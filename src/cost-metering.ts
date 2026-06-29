import { pool } from "./db.js";

// SR-2 (EK.G1-infra-S1, deferred): real Anthropic + Voyage AI account-level pricing not yet
// confirmed. Placeholder ceiling so a budget alarm exists and fires now; tighten once T-504's
// SR-2 pricing confirmation lands. No AI traffic exists yet, so this is non-blocking.
export const BUDGET_CEILING_MICROS = 5_000_000n; // $5.00/user/month placeholder

export class BudgetCeilingExceededError extends Error {
  constructor(userId: string, totalMicros: bigint, ceilingMicros: bigint) {
    super(`User ${userId} AI spend ${totalMicros}µ exceeds ceiling ${ceilingMicros}µ`);
    this.name = "BudgetCeilingExceededError";
  }
}

export interface RecordInvocationInput {
  userId: string;
  ideaId: string | null;
  feature: string;
  model: string;
  modelVersion: string;
  grounded: boolean;
  costMicros: bigint;
}

export async function recordInvocation(input: RecordInvocationInput): Promise<void> {
  await pool.query(
    `INSERT INTO ai_invocations (user_id, idea_id, feature, model, model_version, grounded, cost_micros)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.userId,
      input.ideaId,
      input.feature,
      input.model,
      input.modelVersion,
      input.grounded,
      input.costMicros.toString(),
    ],
  );
}

export interface BudgetStatus {
  totalMicros: bigint;
  ceilingMicros: bigint;
  overCeiling: boolean;
}

export async function checkBudget(userId: string): Promise<BudgetStatus> {
  const { rows } = await pool.query<{ total: string | null }>(
    `SELECT SUM(cost_micros) AS total
     FROM ai_invocations
     WHERE user_id = $1 AND created_at >= date_trunc('month', now())`,
    [userId],
  );

  const totalMicros = BigInt(rows[0]?.total ?? 0);
  return {
    totalMicros,
    ceilingMicros: BUDGET_CEILING_MICROS,
    overCeiling: totalMicros > BUDGET_CEILING_MICROS,
  };
}

// NFR-017: "overrun degrades to cheap-model/queue, never silent overspend" — callers (the
// future lib/ai router) must call this before an expensive model invocation and handle the
// throw; it is never swallowed.
export async function assertWithinBudget(userId: string): Promise<void> {
  const status = await checkBudget(userId);
  if (status.overCeiling) {
    console.warn("budget_ceiling_exceeded", { userId, ...status });
    throw new BudgetCeilingExceededError(userId, status.totalMicros, status.ceilingMicros);
  }
}
