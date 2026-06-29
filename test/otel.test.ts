import { describe, expect, it } from "vitest";
import { tracer } from "../src/otel";

describe("otel", () => {
  it("emits a real span with a valid trace context", () => {
    const span = tracer.startSpan("test-span");
    const ctx = span.spanContext();

    expect(ctx.traceId).toMatch(/^[0-9a-f]{32}$/);
    expect(ctx.spanId).toMatch(/^[0-9a-f]{16}$/);

    span.end();
  });
});
