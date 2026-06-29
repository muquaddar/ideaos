import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

interface SafetyFixture {
  suite: string;
  target_module: string;
  requirement_refs: string[];
  cases: unknown[];
}

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(here, "fixtures");
const fixtureFiles = ["non-directive.json", "injection.json", "groundedness.json"];

function loadFixture(file: string): SafetyFixture {
  const raw = readFileSync(path.join(fixturesDir, file), "utf-8");
  return JSON.parse(raw) as SafetyFixture;
}

// SR-1 (EK.G1-infra-S1): lib/ai/ doesn't exist until reasoning.S1. This harness is wired into
// the required `ci` check now so merges can never bypass it. Each suite below is a tripwire:
// it passes only while its target module is absent, matching today's reality. The moment
// reasoning.S1 adds that module, the tripwire flips red, blocking merge until it's replaced
// with real fixture-driven assertions against the module — never a silent, accidental green.
describe("AI safety harness (SR-1: wiring scoped ahead of reasoning.S1)", () => {
  for (const file of fixtureFiles) {
    describe(file, () => {
      it("is a well-formed fixture", () => {
        const fixture = loadFixture(file);
        expect(fixture.suite).toBeTruthy();
        expect(fixture.requirement_refs.length).toBeGreaterThan(0);
        expect(Array.isArray(fixture.cases)).toBe(true);
        expect(fixture.cases.length).toBeGreaterThan(0);
      });

      it("tripwire: target module not built yet — replace this suite once it lands", () => {
        const fixture = loadFixture(file);
        const targetPath = path.join(here, fixture.target_module);
        expect(existsSync(targetPath)).toBe(false);
      });
    });
  }
});
