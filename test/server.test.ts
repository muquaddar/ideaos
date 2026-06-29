import { describe, expect, it, afterEach } from "vitest";
import { createApp } from "../src/server";

describe("server", () => {
  let close: (() => Promise<void>) | undefined;

  afterEach(async () => {
    await close?.();
    close = undefined;
  });

  it("responds 200 with the health payload on GET /health", async () => {
    const { server, port } = await createApp(0);
    close = () => new Promise((resolve) => server.close(() => resolve()));

    const res = await fetch(`http://localhost:${port}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", service: "ideaos" });
  });

  it("responds 404 for unknown routes", async () => {
    const { server, port } = await createApp(0);
    close = () => new Promise((resolve) => server.close(() => resolve()));

    const res = await fetch(`http://localhost:${port}/nope`);
    expect(res.status).toBe(404);
  });
});
