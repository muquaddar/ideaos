import { describe, expect, it } from "vitest";
import { healthCheck } from "../src/health";

describe("healthCheck", () => {
  it("reports ok status for the ideaos service", () => {
    expect(healthCheck()).toEqual({ status: "ok", service: "ideaos" });
  });
});
