# IdeaOS — Claude Code
> **Canonical rules: [AGENTS.md](AGENTS.md). Read it first — it binds every agent.**
> Switch agents: `/home/muquaddar/Srijan/Srijan-AI-v2/Protocols/execution-kit/harness-adapters/SWITCH-CARD.md`.

## Claude-Code specifics
- **Model routing** (`/model`): Sonnet default; **Opus for the CRITICAL NFRs (NFR-008/010/011),
  the `lib/ai/` gateway + evidence contract, architecture, and spikes**; Haiku for grunt work.
  `/fast` for faster Opus on heavy sessions.
- **Skills**: invoked by task match; invoke explicitly (e.g. `/code-review`). GitNexus skills are wired
  at `.claude/skills/gitnexus/` (not indexed yet — no production code exists; see AGENTS.md). Run
  impact-analysis before any CRITICAL-NFR change once it's indexed.
- **Sprint research**: start each kickoff with `/sprint-research <track>.<sprint>` — ranged-read only
  each task's atoms via the spec-index; never read whole `docs/specs/spec_0*.md` files (see AGENTS.md).
- **MCP**: configured at user/project level; appears as `mcp__*` tools.
- **Hooks**: any `.claude/settings.json` hook must only *call* the neutral `make` targets
  (`make lint`, `make test`) — guarantees live in git hooks + CI (see AGENTS.md), not here.

Everything else — hard rules, the non-directive invariant, locked-spec discipline, what to read,
model principles, enforcement — is in [AGENTS.md](AGENTS.md).

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **ideaos** (450 symbols, 520 relationships, 3 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/ideaos/context` | Codebase overview, check index freshness |
| `gitnexus://repo/ideaos/clusters` | All functional areas |
| `gitnexus://repo/ideaos/processes` | All execution flows |
| `gitnexus://repo/ideaos/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
