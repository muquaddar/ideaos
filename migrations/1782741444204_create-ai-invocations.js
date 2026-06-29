/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("ai_invocations", {
    id: { type: "uuid", notNull: true, primaryKey: true, default: pgm.func("gen_random_uuid()") },
    user_id: { type: "uuid", notNull: true },
    idea_id: { type: "uuid", notNull: false },
    feature: { type: "text", notNull: true },
    model: { type: "text", notNull: true },
    model_version: { type: "text", notNull: true },
    grounded: { type: "boolean", notNull: true },
    cost_micros: { type: "bigint", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("now()") },
  });

  // NFR-017: per-user monthly cost-budget lookups are the hot read path.
  pgm.createIndex("ai_invocations", ["user_id", "created_at"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("ai_invocations");
};
