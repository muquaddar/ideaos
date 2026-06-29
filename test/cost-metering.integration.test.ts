import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// T-504 (verifiable_by: integration_test) — requires a live Postgres (DATABASE_URL).
// Runs for real in CI (postgres service container) and locally when DATABASE_URL is set;
// skips gracefully otherwise so contributors without a local DB aren't blocked.
const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("cost metering (integration)", () => {
  let pool: import("pg").Pool;
  let recordInvocation: typeof import("../src/cost-metering").recordInvocation;
  let checkBudget: typeof import("../src/cost-metering").checkBudget;
  let assertWithinBudget: typeof import("../src/cost-metering").assertWithinBudget;
  let BudgetCeilingExceededError: typeof import("../src/cost-metering").BudgetCeilingExceededError;
  let BUDGET_CEILING_MICROS: bigint;

  beforeAll(async () => {
    const db = await import("../src/db");
    const metering = await import("../src/cost-metering");
    pool = db.pool;
    recordInvocation = metering.recordInvocation;
    checkBudget = metering.checkBudget;
    assertWithinBudget = metering.assertWithinBudget;
    BudgetCeilingExceededError = metering.BudgetCeilingExceededError;
    BUDGET_CEILING_MICROS = metering.BUDGET_CEILING_MICROS;
  });

  afterAll(async () => {
    await pool.end();
  });

  it("records an invocation and reports it under budget", async () => {
    const userId = randomUUID();
    await recordInvocation({
      userId,
      ideaId: null,
      feature: "ancestry",
      model: "claude-haiku-4-5",
      modelVersion: "2025-10-01",
      grounded: true,
      costMicros: 1_000n,
    });

    const status = await checkBudget(userId);
    expect(status.totalMicros).toBe(1_000n);
    expect(status.overCeiling).toBe(false);
  });

  it("fires the budget alarm once spend exceeds the ceiling", async () => {
    const userId = randomUUID();
    await recordInvocation({
      userId,
      ideaId: null,
      feature: "ancestry",
      model: "claude-opus-4-8",
      modelVersion: "2025-10-01",
      grounded: true,
      costMicros: BUDGET_CEILING_MICROS + 1n,
    });

    const status = await checkBudget(userId);
    expect(status.overCeiling).toBe(true);
    await expect(assertWithinBudget(userId)).rejects.toThrow(BudgetCeilingExceededError);
  });
});
