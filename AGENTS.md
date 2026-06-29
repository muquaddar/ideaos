# IdeaOS — agent rules (canonical)
<!--
  Canonical, agent-agnostic rules — the single source of truth every coding agent reads
  (Claude Code, Codex, opencode, Cursor, Aider, Qwen…). Agent-specific files (CLAUDE.md, etc.)
  are THIN POINTERS to this file. PRODUCE at SK.G1; REFRESH at each gate. SRIJAN protocol v2.7.0.
-->

## What this is
IdeaOS is an AI cognitive operating system that helps builders turn thousands of ideas into a few
deliberate, well-timed decisions — it manages the *evolution of ideas and the decisions around them*,
not tasks. Built by Muquaddar (solo, bootstrapped).
**Spec-driven**: the specs in `docs/specs/` are the source of truth; code is built against them.
Current phase: **Specification Kit (SK) — full pack drafted, pending gate approval.**

## Read these to orient
- `docs/specs/project.yaml` — spec_00 index: tier, lock state, ID registry (next_*), counts, open items.
- `docs/specs/spec_06_build.md` — build plan: tracks, T-NNN objectives, serial-solo sprint sequence. **Drives EK.**
- `docs/specs/spec_04_architecture.md` — architecture, data model, and the CRITICAL AI trust boundary (§11).
- `docs/specs/spec_03_requirements.md` — FR/NFR + the CRITICAL NFR list.
- `DEV.md` — local dev environment (added at EK.G1).

## Methodology (reference, don't copy)
Follow the canonical kits at `/home/muquaddar/Srijan/Srijan-AI-v2/Protocols`
(`execution-kit/harness-adapters/` for your agent). Create **filled** per-project gate records under
`docs/gates/<GATE>-<track>-<sprint>.md`. Fix methodology gaps in the canonical template + bump its
version; log in `docs/missing.md`.

## Hard rules (agent-neutral — they bind every agent)
- **Locked specs** (`status: approved`) → any change is a **sectional amendment**: add an `amendments[]`
  entry (`re_approval: sectional`), bump the spec version **and** `project.yaml`, keep the lock, and
  **re-run sk-lint to PASS**.
- **Spec files are read-only to the agent** — spec changes go through human + gate, never autonomous edit.
- **Never change approval state** (status / lock / consensus) without the governor's explicit go-ahead.
- **A change isn't done until `sk-lint` is green** (`make lint`, exit 0).
- **Only work on an active T-NNN objective.** Tests first; evidence = a real run + output, not assertion.
- **Capacity:** Tier-3 complexity, **team size 1, serial-solo**, ≤ 30 focused hrs/week (SC-006). Confirm the
  filled EK.G1 gate form before writing code.

## The non-negotiable product invariant (this is what IdeaOS IS)
- **The AI never decides. It presents evidence; the human decides.** No code path may emit a directive
  ("you should build X"). All model output flows through `lib/ai/evidence-contract` (ADR-003) and is
  covered by the blocking non-directive suite. Edges only persist on **explicit human confirmation**
  (ADR-004) — injected text can change what the model *says*, never what the graph *commits*.
- **Nothing is forgotten.** No code path hard-deletes an *idea* (archive/reject/merge preserve the node;
  merge keeps a tombstone). Only whole-account erasure removes content, via the §10.3 purge workflow.

## Enforcement is in neutral substrate (NOT any agent's hooks)
Guarantees live in `make lint` / `make test`, **git hooks** (`.githooks/pre-commit` → sk-lint +
spec-index drift guard + tests, via `git config core.hooksPath .githooks`), and **CI**. An agent's own
hooks are optional accelerants that **call these same `make` targets** — never the sole home of a guarantee.

## Running a sprint — `run sprint <track>.<sprint>`
1. **Research** — `/sprint-research <track>.<sprint>`: resolve each T-NNN's atoms via the spec-index and
   ranged-read only those. **Never read a whole `docs/specs/spec_0*.md` file.** Present the compact brief.
2. ⛔ **EK.G1 kickoff** — fill `docs/gates/EK.G1-<track>-<sprint>.md`, tag the baseline, and **present scope
   for the user's confirmation. Do NOT write code until the user approves.**
3. **Build (TDD per objective)** — write the test verbatim from each T-NNN criterion, watch it fail,
   implement, watch it pass. Migrations first (expand→contract, reversible). Stay within the sprint's T-NNN scope.
4. **Verify** — `make lint` (green) + `make test`. Run impact analysis before touching CRITICAL code.
5. ⛔ **Evidence + SVM** — `/sprint-verify`, **present the Manual Verification Checklist, and STOP. Never
   self-certify** — the user ticks each item before EK.G2 is submitted.

## CRITICAL NFRs (get-it-wrong-is-catastrophic) — strongest model, EK.G4 blocking suites
- **NFR-010 — non-directive guardrail** (the core promise; 0 directives / 200-sample audit)
- **NFR-011 — prompt-injection defense** (ingested idea text is untrusted data; confused-deputy guard)
- **NFR-008 — encryption + tenant isolation** of idea content (the user's whole mind)

## Model use (principle; mechanism is per-agent — see the switch card)
- Strongest model (Opus): CRITICAL NFRs, architecture decisions, hard debugging, spikes, AI-gateway code.
- Mid model: routine implementation against a clear objective. ← default
- Cheapest model: boilerplate / mechanical edits / search.

## Tooling
- **Spec research (token discipline):** use `docs/specs/index/spec-index.yaml` to ranged-read only a task's
  atoms (its `T-NNN`, its `FR/NFR/US` refs). Never read a full spec file to research a task.
- Diff review before a gate; run the thing to confirm it works.

<!-- gitnexus:start -->
## GitNexus — Code Intelligence

**Not indexed yet.** There is no production code to index — `docs/prototype/` is disposable L1 design
collateral (spec_05 §8), not the indexed target. Once `EK.G1` for `infra.S1`/`foundation.S1` lands real
code, run `npx gitnexus analyze` from the project root to build the index (regenerates the gitignored
`.gitnexus/run.cjs` project-local runner). After that, treat the index as live and **use these tools
instead of re-reading whole files**:

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available
> runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

### Always Do (once indexed)
- **MUST run impact analysis before editing any symbol** — `impact({target: "symbolName", direction:
  "upstream"})` — and report the blast radius (callers, affected processes, risk level). This is the
  evidence requirement at **EK.G2** (`gitnexus_impact` field) and **EK.G4** (`gitnexus_blast_radius`,
  depth-3 full report).
- **MUST run `detect_changes()` before committing** to verify changes only affect expected symbols and
  execution flows. For regression review: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding — this is
  non-negotiable for any symbol touching **NFR-008/010/011** or `lib/ai/evidence-contract`.
- Explore unfamiliar code with `query({query: "concept"})` instead of grepping — process-grouped results
  ranked by relevance. Use `context({name: "symbolName"})` for full caller/callee context on a symbol.

### Never Do
- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename`, which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

### CLI / skill files (read before first use of each)
| Task | Skill file |
|------|------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
<!-- gitnexus:end -->

## Open items
- See `docs/specs/project.yaml` → `open_items` (design partners, eval thresholds, AI cost validation,
  diagram galleries, staging rollback drill).
