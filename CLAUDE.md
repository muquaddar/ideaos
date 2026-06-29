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
