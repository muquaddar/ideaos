---
name: spec_03_requirements
spec_id: 03
project_slug: "ideaos"
version: 0.1.0
status: approved
owners:
  product_lead: "Muquaddar (founder)"
  tech_lead: "Muquaddar (founder)"
created: "2026-06-29"
last_modified: "2026-06-29"
gate: SK.G2
depends_on:
  - spec_01_project.md
  - spec_02_users.md
references:
  - shared/moscow-prioritization.md
---

# IdeaOS — Requirements (MoSCoW + NFRs)

> Approval gate: **SK.G2 — Stories + Requirements** (jointly with spec_02_users.md).
> **39 Functional Requirements + 17 Non-Functional Requirements.** FR MoSCoW: **23 Must / 14 Should / 2 Could / 0 Won't** (59% Must — healthy). Every Must FR traces to ≥ 1 user story and is covered by ≥ 1 spec_06 sprint objective.

---

## 1. Functional Requirements

| ID | Description | Source Story | MoSCoW | Status |
|----|------------|-------------|--------|--------|
| FR-001 | Capture an idea by voice; record audio, transcribe, save a draft idea node | US-001 | Must | draft |
| FR-002 | Create a draft idea node from voice or text with zero required fields | US-001, US-002 | Must | draft |
| FR-003 | Free-text capture box with 1–5000 char validation and non-truncating limit warning | US-002 | Should | draft |
| FR-004 | Generate ≤ 5 Socratic interview questions for a captured idea (origin/trigger/purpose/type/existing-solution) | US-003 | Must | draft |
| FR-005 | Record interview answers to the idea's origin/trigger/purpose/type fields; skipped fields stay null | US-003 | Must | draft |
| FR-006 | Generate and store a vector embedding for each idea | US-004 | Must | draft |
| FR-007 | Classify a new idea's ancestry (new/similar/duplicate/child/sibling/multi-parent) with confidence + supporting neighbors | US-004 | Must | draft |
| FR-008 | Reconstruct and narrate an idea's reasoning chain (root → idea) from real edges only | US-005 | Should | draft |
| FR-009 | Propose typed relationship edges for a new idea with reason + confidence (never auto-committed) | US-006 | Must | draft |
| FR-010 | Persist only human-confirmed edges; audit-log confirmations/rejections/edits | US-006 | Must | draft |
| FR-011 | Detect duplicate/twin ideas via similarity threshold (default 0.85) | US-007 | Must | draft |
| FR-012 | Render twin warning with similarity %; capture "not a duplicate" feedback to tune threshold | US-007 | Should | draft |
| FR-013 | Display an idea node's full detail (parent, origin, purpose, trigger, dependencies, supported projects, cost, benefit, opportunity cost, build status, activation condition); never fabricate unrecorded fields | US-008 | Must | draft |
| FR-014 | Fetch the user's idea graph (nodes + edges) for rendering | US-009 | Must | draft |
| FR-015 | Render the living graph canvas with nodes colored by build status | US-009 | Must | draft |
| FR-016 | Filter the graph (status/type/depth) and collapse/expand branches with level-of-detail | US-010 | Should | draft |
| FR-017 | Hybrid keyword + semantic search across ideas; center/highlight result in graph | US-011 | Should | draft |
| FR-018 | Highlight a selected node's relationships; distinguish edge types; dim unrelated nodes | US-012 | Could | draft |
| FR-019 | Compute derivative scores per idea (depth, leverage, dependency, cost, opportunity cost, derivative value, derivative risk) | US-013 | Must | draft |
| FR-020 | Explain each derivative score by exposing its contributing factors + idea IDs | US-013 | Should | draft |
| FR-021 | Assemble a Reality Check evidence set (expected delay, duplication, existing-solution %, origin, future-products-supported) | US-014 | Must | draft |
| FR-022 | Render the Reality Check panel with per-item provenance + confidence; progressive disclosure | US-014 | Should | draft |
| FR-023 | Record a decision with one of seven outcomes (build_now/schedule/incubate/delegate/archive/merge/reject) | US-015 | Must | draft |
| FR-024 | Update build status and preserve the node on every outcome (nothing is ever deleted) | US-015 | Must | draft |
| FR-025 | Merge a duplicate into its twin: re-point all edges, resolve field conflicts, keep a source tombstone | US-016 | Should | draft |
| FR-026 | Set an evidence-based activation condition (structured trigger or free-text) on an idea | US-017 | Must | draft |
| FR-027 | Register structured activation conditions for monitoring; preserve free-text verbatim for human review | US-017 | Should | draft |
| FR-028 | Evaluate registered activation conditions on graph change and emit evidence-based (non-directive) alerts | US-018 | Should | draft |
| FR-029 | Capture a daily graph snapshot via scheduled job | US-019 | Should | draft |
| FR-030 | Replay graph state across a scrubable timeline (read-only) | US-019 | Should | draft |
| FR-031 | Render Idea Archaeology (ancestors, descendants, siblings, twins, influences, conflicts, reason-for-creation) | US-020 | Should | draft |
| FR-032 | Compute and render the Decision Dashboard (building now / why / waiting / activate-next / attention cost) from real graph state | US-021 | Must | draft |
| FR-033 | Surface "what new idea is actually an old idea" (recent captures with high-similarity twins) on the dashboard | US-021 | Should | draft |
| FR-034 | Create a user account with email verification | US-022 | Must | draft |
| FR-035 | Authenticate users; issue/rotate access + refresh tokens; audit-log auth events | US-022 | Must | draft |
| FR-036 | Export the full graph (nodes+edges+decisions+scores) as JSON/GraphML with a reconciled completeness manifest | US-023 | Must | draft |
| FR-037 | Delete account: immediate soft-delete, recoverable in grace window, hard-purge ≤ 30 days | US-024 | Must | draft |
| FR-038 | Enforce the evidence contract: block/rewrite directive AI output and attach provenance before display | US-025 | Must | draft |
| FR-039 | Queue captures offline (IndexedDB) and sync in order on reconnect with conflict prompts | US-026 | Could | draft |

```yaml
functional_requirements:
  - { id: FR-001, description: "Voice capture: record, transcribe, save draft idea", source_story: US-001, source_field: actuator, moscow: must, acceptance: "US-001 AC-1..AC-3", status: draft }
  - { id: FR-002, description: "Create draft idea node, zero required fields", source_story: US-001, source_field: actuator, moscow: must, acceptance: "US-001 AC-1; US-002 AC-1", status: draft }
  - { id: FR-003, description: "Text capture box with 1-5000 char validation", source_story: US-002, source_field: sensor, moscow: should, acceptance: "US-002 AC-1..AC-2", status: draft }
  - { id: FR-004, description: "Generate <=5 Socratic interview questions", source_story: US-003, source_field: actuator, moscow: must, acceptance: "US-003 AC-1", status: draft }
  - { id: FR-005, description: "Record interview answers; skipped fields null", source_story: US-003, source_field: sensor, moscow: must, acceptance: "US-003 AC-2..AC-3", status: draft }
  - { id: FR-006, description: "Generate + store idea embedding", source_story: US-004, source_field: actuator, moscow: must, acceptance: "US-004 AC-1", status: draft }
  - { id: FR-007, description: "Classify ancestry with confidence + neighbors", source_story: US-004, source_field: actuator, moscow: must, acceptance: "US-004 AC-1..AC-3", status: draft }
  - { id: FR-008, description: "Reconstruct reasoning chain from real edges", source_story: US-005, source_field: actuator, moscow: should, acceptance: "US-005 AC-1..AC-3", status: draft }
  - { id: FR-009, description: "Propose typed edges with reason+confidence", source_story: US-006, source_field: actuator, moscow: must, acceptance: "US-006 AC-1, AC-3", status: draft }
  - { id: FR-010, description: "Persist only confirmed edges; audit-log", source_story: US-006, source_field: actuator, moscow: must, acceptance: "US-006 AC-2", status: draft }
  - { id: FR-011, description: "Detect twins via similarity threshold 0.85", source_story: US-007, source_field: actuator, moscow: must, acceptance: "US-007 AC-1", status: draft }
  - { id: FR-012, description: "Twin warning UI + not-duplicate feedback", source_story: US-007, source_field: actuator, moscow: should, acceptance: "US-007 AC-2..AC-3", status: draft }
  - { id: FR-013, description: "Idea node detail; no fabricated fields", source_story: US-008, source_field: actuator, moscow: must, acceptance: "US-008 AC-1..AC-3", status: draft }
  - { id: FR-014, description: "Fetch user idea graph", source_story: US-009, source_field: actuator, moscow: must, acceptance: "US-009 AC-1", status: draft }
  - { id: FR-015, description: "Render graph canvas, status colors", source_story: US-009, source_field: actuator, moscow: must, acceptance: "US-009 AC-1..AC-3", status: draft }
  - { id: FR-016, description: "Filter + collapse/expand branches", source_story: US-010, source_field: actuator, moscow: should, acceptance: "US-010 AC-1..AC-3", status: draft }
  - { id: FR-017, description: "Hybrid keyword+semantic search", source_story: US-011, source_field: actuator, moscow: should, acceptance: "US-011 AC-1..AC-3", status: draft }
  - { id: FR-018, description: "Relationship highlight on selection", source_story: US-012, source_field: actuator, moscow: could, acceptance: "US-012 AC-1..AC-3", status: draft }
  - { id: FR-019, description: "Compute derivative scores", source_story: US-013, source_field: actuator, moscow: must, acceptance: "US-013 AC-1, AC-3", status: draft }
  - { id: FR-020, description: "Explain derivative scores by factors", source_story: US-013, source_field: actuator, moscow: should, acceptance: "US-013 AC-2", status: draft }
  - { id: FR-021, description: "Assemble Reality Check evidence set", source_story: US-014, source_field: actuator, moscow: must, acceptance: "US-014 AC-1", status: draft }
  - { id: FR-022, description: "Render Reality Check with provenance+confidence", source_story: US-014, source_field: actuator, moscow: should, acceptance: "US-014 AC-2..AC-3", status: draft }
  - { id: FR-023, description: "Record decision (7 outcomes)", source_story: US-015, source_field: sensor, moscow: must, acceptance: "US-015 AC-1..AC-3", status: draft }
  - { id: FR-024, description: "Update status; preserve node always", source_story: US-015, source_field: actuator, moscow: must, acceptance: "US-015 AC-4", status: draft }
  - { id: FR-025, description: "Merge twin: re-point edges, tombstone source", source_story: US-016, source_field: actuator, moscow: should, acceptance: "US-016 AC-1..AC-3", status: draft }
  - { id: FR-026, description: "Set activation condition (structured/free-text)", source_story: US-017, source_field: sensor, moscow: must, acceptance: "US-017 AC-1", status: draft }
  - { id: FR-027, description: "Register structured conditions; preserve free-text", source_story: US-017, source_field: actuator, moscow: should, acceptance: "US-017 AC-2..AC-3", status: draft }
  - { id: FR-028, description: "Evaluate conditions; evidence-based alerts", source_story: US-018, source_field: actuator, moscow: should, acceptance: "US-018 AC-1..AC-3", status: draft }
  - { id: FR-029, description: "Daily graph snapshot job", source_story: US-019, source_field: actuator, moscow: should, acceptance: "US-019 AC-1", status: draft }
  - { id: FR-030, description: "Timeline playback (read-only)", source_story: US-019, source_field: actuator, moscow: should, acceptance: "US-019 AC-2..AC-3", status: draft }
  - { id: FR-031, description: "Idea Archaeology view", source_story: US-020, source_field: actuator, moscow: should, acceptance: "US-020 AC-1..AC-3", status: draft }
  - { id: FR-032, description: "Decision Dashboard from real graph state", source_story: US-021, source_field: actuator, moscow: must, acceptance: "US-021 AC-1..AC-2", status: draft }
  - { id: FR-033, description: "Dashboard old-idea (twin) surfacing", source_story: US-021, source_field: actuator, moscow: should, acceptance: "US-021 AC-3", status: draft }
  - { id: FR-034, description: "Create account + email verification", source_story: US-022, source_field: actuator, moscow: must, acceptance: "US-022 AC-1..AC-2", status: draft }
  - { id: FR-035, description: "Authenticate; rotate tokens; audit auth", source_story: US-022, source_field: actuator, moscow: must, acceptance: "US-022 AC-3", status: draft }
  - { id: FR-036, description: "Export graph JSON/GraphML + manifest", source_story: US-023, source_field: actuator, moscow: must, acceptance: "US-023 AC-1..AC-3", status: draft }
  - { id: FR-037, description: "Delete account: soft-delete + 30d hard-purge", source_story: US-024, source_field: actuator, moscow: must, acceptance: "US-024 AC-1..AC-3", status: draft }
  - { id: FR-038, description: "Evidence contract: block directives + provenance", source_story: US-025, source_field: actuator, moscow: must, acceptance: "US-025 AC-1..AC-3", status: draft }
  - { id: FR-039, description: "Offline capture queue + sync", source_story: US-026, source_field: actuator, moscow: could, acceptance: "US-026 AC-1..AC-3", status: draft }

fr_moscow:
  must:   [FR-001, FR-002, FR-004, FR-005, FR-006, FR-007, FR-009, FR-010, FR-011, FR-013, FR-014, FR-015, FR-019, FR-021, FR-023, FR-024, FR-026, FR-032, FR-034, FR-035, FR-036, FR-037, FR-038]
  should: [FR-003, FR-008, FR-012, FR-016, FR-017, FR-020, FR-022, FR-025, FR-027, FR-028, FR-029, FR-030, FR-031, FR-033]
  could:  [FR-018, FR-039]
  wont:   []
```

---

## 2. Non-Functional Requirements

| ID | Category | Description | Target | Measurement | MoSCoW |
|----|---------|------------|--------|-------------|--------|
| NFR-001 | performance | Interaction latency for core actions | text capture p95 < 2s; graph render p95 < 1.5s @2k nodes; API p95 < 300ms | apm_metric / rum_telemetry | Must |
| NFR-002 | security | Auth endpoints rate-limited + lockout | ≤ 10 login req/min/IP; lock after 5 fails | rate_limiter_logs | Must |
| NFR-003 | availability | Production uptime | ≥ 99.5% / 30d | apm_metric | Must |
| NFR-004 | accessibility | WCAG 2.2 AA conformance | 100% of app screens | axe_scan + manual_audit | Must |
| NFR-005 | compatibility | Browser support | Chrome 110+, Safari 16+, Firefox 110+ | e2e_test | Must |
| NFR-006 | performance | Graph + AI scale | graph 10k nodes interactive ≥ 45fps; ancestry classify p95 < 6s | rum_telemetry / apm_metric | Should |
| NFR-007 | usability | Capture friction | 0 required fields to save an idea; every list/graph has a meaningful empty state | manual_audit | Must |
| NFR-008 | security | **Idea content encrypted at rest + in transit** (the user's whole mind) | AES-256 at rest; TLS 1.3 in transit; keys in KMS | static_scan + manual_audit | **Must (CRITICAL)** |
| NFR-009 | compliance | No third-party ad/sale use; least-privilege access to idea content | 0 third-party content egress; access audited | manual_audit | Must |
| NFR-010 | ai_safety | **Non-directive guardrail** — AI never instructs a decision | 0 directive outputs in 200-sample adversarial+prod audit | ai_eval_harness | **Must (CRITICAL)** |
| NFR-011 | ai_safety | **Prompt-injection defense** — ingested/captured idea text treated as data, not instructions | adversarial injection suite blocks 100% in CI; confused-deputy guard at authz | static_scan (adversarial suite) | **Must (CRITICAL)** |
| NFR-012 | ai_safety | Output grounding / provenance — auto-edges, ancestry, scores cite source records | 100% of fact-bearing AI claims carry provenance; ungrounded flagged | ai_eval_harness | Must |
| NFR-013 | ai_safety | Evaluation harness — golden eval sets + CI regression-eval + model-change re-eval; model_version in provenance | thresholds met; eval gates merges; re-eval on model bump | ci_artifact | Must |
| NFR-014 | security | Credential security — Argon2id hashing, breach-list check, token rotation, httpOnly cookies | no plaintext secrets; breach-check on signup; access 15m / refresh 7d rotating | static_scan | Must |
| NFR-015 | compliance | Data portability + right-to-erasure (GDPR/DPDP) | export completeness 100% (manifest-reconciled); erasure ≤ 30d | integration_test + audit_log | Must |
| NFR-016 | resilience_lifecycle | Disaster-recovery targets + retention policy enforced per data class | RTO/RPO per failure class (spec_04 §10.4); retention policy (spec_04 §10.3) drill-tested | deploy_log (drill) + integration_test | Must |
| NFR-017 | ai_safety | LLM/embedding cost ceiling per user — unit economics | per-user monthly AI budget enforced; overrun degrades to cheap-model/queue, never silent overspend | apm_metric | Should |

### 2a. AI / LLM Safety NFRs  *(MANDATORY — IdeaOS sends captured idea content to an LLM and embedding provider)*

> IdeaOS is LLM-backed at its core (interview, ancestry, relationships, derivative reasoning, reality check). NFR-010, NFR-011, NFR-012, NFR-013, NFR-017 above are the AI-safety set. NFR-010 (non-directive) and NFR-011 (injection) are **CRITICAL** — they are the load-bearing guardrails of the entire product promise ("the AI never decides") and of privacy.

### 2b. Resilience & Data Lifecycle NFRs  *(MANDATORY — IdeaOS stores the user's entire idea graph)*

> NFR-015 (portability + erasure) and NFR-016 (DR targets + retention) above satisfy §2b. The idea graph is the most sensitive personal data the product holds; retention, deletion, and recovery are first-class. Policy lives in spec_04 §10.3–10.4.

```yaml
non_functional_requirements:
  - { id: NFR-001, category: performance, description: "Core interaction latency", target: "text capture p95<2s; graph render p95<1.5s@2k; API p95<300ms", measurement: rum_telemetry, moscow: must, source_story: US-009, source_field: performance }
  - { id: NFR-002, category: security, description: "Auth rate-limit + lockout", target: "<=10 login/min/IP; lock after 5 fails", measurement: rate_limiter_logs, moscow: must, source_story: US-022, source_field: performance }
  - { id: NFR-003, category: availability, description: "Uptime", target: ">=99.5%/30d", measurement: apm_metric, moscow: must, source_story: null, source_field: null }
  - { id: NFR-004, category: accessibility, description: "WCAG 2.2 AA", target: "100% of app screens", measurement: axe_scan, moscow: must, source_story: null, source_field: null }
  - { id: NFR-005, category: compatibility, description: "Browser support", target: "Chrome110+/Safari16+/Firefox110+", measurement: e2e_test, moscow: must, source_story: US-001, source_field: environment }
  - { id: NFR-006, category: performance, description: "Graph + AI scale", target: "10k nodes >=45fps; ancestry p95<6s", measurement: rum_telemetry, moscow: should, source_story: US-004, source_field: performance }
  - { id: NFR-007, category: usability, description: "Capture friction / empty states", target: "0 required fields; meaningful empty states", measurement: manual_audit, moscow: must, source_story: US-002, source_field: performance }
  - { id: NFR-008, category: security, description: "Idea content encrypted at rest+in transit", target: "AES-256 at rest; TLS1.3; KMS keys", measurement: manual_audit, moscow: must, source_story: null, source_field: null }
  - { id: NFR-009, category: compliance, description: "No ad/sale use; least-privilege content access", target: "0 third-party content egress; audited", measurement: manual_audit, moscow: must, source_story: null, source_field: null }
  - { id: NFR-010, category: ai_safety, description: "Non-directive guardrail", target: "0 directive outputs in 200-sample audit", measurement: ai_eval_harness, moscow: must, source_story: US-025, source_field: performance }
  - { id: NFR-011, category: ai_safety, description: "Prompt-injection defense", target: "injection suite blocks 100% in CI; confused-deputy guard", measurement: static_scan, moscow: must, source_story: null, source_field: null }
  - { id: NFR-012, category: ai_safety, description: "Output grounding/provenance", target: "100% fact claims carry provenance", measurement: ai_eval_harness, moscow: must, source_story: US-025, source_field: performance }
  - { id: NFR-013, category: ai_safety, description: "Evaluation harness + CI regression-eval", target: "thresholds met; gates merges; re-eval on model change", measurement: ci_artifact, moscow: must, source_story: US-014, source_field: performance }
  - { id: NFR-014, category: security, description: "Credential security", target: "Argon2id; breach-check; token rotation 15m/7d", measurement: static_scan, moscow: must, source_story: US-022, source_field: environment }
  - { id: NFR-015, category: compliance, description: "Portability + erasure (GDPR/DPDP)", target: "export completeness 100%; erasure <=30d", measurement: integration_test, moscow: must, source_story: US-023, source_field: performance }
  - { id: NFR-016, category: resilience_lifecycle, description: "DR targets + retention policy", target: "RTO/RPO per failure class; retention drill-tested", measurement: deploy_log, moscow: must, source_story: null, source_field: null }
  - { id: NFR-017, category: ai_safety, description: "Per-user LLM/embedding cost ceiling", target: "per-user budget; graceful degrade on overrun", measurement: apm_metric, moscow: should, source_story: null, source_field: null }

nfr_moscow:
  must:     [NFR-001, NFR-002, NFR-003, NFR-004, NFR-005, NFR-007, NFR-008, NFR-009, NFR-010, NFR-011, NFR-012, NFR-013, NFR-014, NFR-015, NFR-016]
  should:   [NFR-006, NFR-017]
  could:    []
  wont:     []
  critical: [NFR-008, NFR-010, NFR-011]
```

---

## 3. Constraints (Amplified from spec_01)

### Regulatory
- **GDPR Art. 15/20 (access + portability):** user can export the entire graph in an open, re-importable format (FR-036, NFR-015).
- **GDPR Art. 17 / DPDP erasure:** account deletion soft-deletes immediately and hard-purges idea content + embeddings within 30 days; only non-content audit metadata survives (FR-037, NFR-015).
- **No secondary use:** idea content is never used for advertising, sold, or used to train third-party models (NFR-009).

### Technical
- **LLM + embedding dependency:** Anthropic Claude (reasoning/interview) and Voyage AI (embeddings) are external; every AI-backed feature must degrade gracefully when they are slow/unavailable (capture and graph viewing must keep working).
- **Cost ceiling:** per-user AI spend capped so unit economics close (NFR-017; cost model spec_07 §10).
- **Web-first responsive:** Chrome/Safari/Firefox current; voice via Web Speech / MediaRecorder with server-side transcription fallback.

### Organizational
- **Solo, ≤ 30 hrs/week, serial execution:** drives the capacity profile (spec_06 §6) and the serial critical path.
- **Dogfoodable alpha by ~week 10 of build.**

```yaml
constraints_amplified:
  regulatory:
    - { id: C-REG-001, source: "GDPR Art.15/20", requirement: "full graph export in open re-importable format", affects: [FR-036, NFR-015] }
    - { id: C-REG-002, source: "GDPR Art.17 / DPDP", requirement: "erasure: soft-delete now, hard-purge <=30d, content+embeddings gone", affects: [FR-037, NFR-015] }
    - { id: C-REG-003, source: "trust positioning", requirement: "no ad/sale/3rd-party-training use of idea content", affects: [NFR-009] }
  technical:
    - { id: C-TEC-001, source: "external AI providers", requirement: "graceful degradation when LLM/embeddings unavailable", affects: [FR-007, FR-009, FR-021, NFR-003] }
    - { id: C-TEC-002, source: "unit economics", requirement: "per-user AI cost ceiling", affects: [NFR-017] }
  organizational:
    - { id: C-ORG-001, source: "solo capacity", requirement: "serial execution; <=30 hrs/week", affects: [FR-001, FR-007, FR-014] }
```

---

## 4. Out-of-Scope (Explicit Won't List)

| Item | Rationale | Revisit |
|------|-----------|--------|
| Team / shared multi-user graphs | Single-thinker v1.0 wedge; collaboration adds permission/merge complexity | future |
| Task/project execution (assignees, due dates, kanban) | Explicit non-goal; decide what to build, not track work | never |
| Calendar / habits / generic note-taking / "second brain" | Declared non-goals; would re-anchor as a productivity app | never |
| General chatbot / open-ended AI assistant surface | AI is an evidence engine; assistant framing invites directive answers (violates NFR-010) | never |
| Native iOS/Android apps | Responsive web + voice first; native deferred until capture habit validated | next-release |
| Auto-execution of decisions (e.g., scaffold a repo on "Build Now") | System informs decisions; acting on them is the user's domain | future |

```yaml
out_of_scope:
  - { id: OOS-001, capability: "Team / shared graphs", rationale: "single-thinker wedge; collaboration complexity", revisit: future, requested_by: null }
  - { id: OOS-002, capability: "Task/project execution", rationale: "explicit non-goal", revisit: never, requested_by: null }
  - { id: OOS-003, capability: "Calendar/habits/notes/second-brain", rationale: "declared non-goals", revisit: never, requested_by: null }
  - { id: OOS-004, capability: "General chatbot/assistant", rationale: "invites directive answers; violates NFR-010", revisit: never, requested_by: null }
  - { id: OOS-005, capability: "Native mobile apps", rationale: "web+voice first", revisit: next-release, requested_by: null }
  - { id: OOS-006, capability: "Auto-execution of decisions", rationale: "acting is the user's domain", revisit: future, requested_by: null }
```

---

## 5. MoSCoW Distribution

```yaml
moscow_distribution:
  # FR counts (NFRs tracked separately in nfr_moscow)
  must: 23
  should: 14
  could: 2
  wont: 0   # Won't items captured as out_of_scope (OOS-001..006), not as FR rows
  total: 39
  must_pct: 59
  health_check: pass   # Must 59% (<=60% warn threshold; <=80% fail threshold)
```

---

## 5a. MoSCoW by Tier (prose ↔ YAML)

> Prose tier membership; must equal the `fr_moscow` YAML lists above (sk-lint R3). Won't items are captured as out-of-scope (§4), so the Won't tier holds 0 FR rows.

### Must (23)
FR-001, FR-002, FR-004, FR-005, FR-006, FR-007, FR-009, FR-010, FR-011, FR-013, FR-014, FR-015, FR-019, FR-021, FR-023, FR-024, FR-026, FR-032, FR-034, FR-035, FR-036, FR-037, FR-038

### Should (14)
FR-003, FR-008, FR-012, FR-016, FR-017, FR-020, FR-022, FR-025, FR-027, FR-028, FR-029, FR-030, FR-031, FR-033

### Could (2)
FR-018, FR-039

### Won't (0)
None — Won't items live in §4 Out-of-Scope (OOS-001..006), not as FR rows.

---

## 6. Traceability Matrix

> Every Must FR traces to ≥ 1 user story (above) and to ≥ 1 sprint objective in spec_06 §3 (validated at SK.G4 by sk-lint R5). CRITICAL NFRs trace to a blocking test (spec_06 §7) and a launch criterion (spec_07 §6) per R8.

| Requirement ID | User Story | Sprint Objective (spec_06) | Test (EK) |
|---------------|-----------|---------------------------|-----------|
| FR-001 | US-001 | T-101 | (pending) |
| FR-007 | US-004 | T-205 | (pending) |
| FR-011 | US-007 | T-207 | (pending) |
| FR-021 | US-014 | T-301 | (pending) |
| FR-023 | US-015 | T-303 | (pending) |
| FR-038 | US-025 | T-203 | (pending) |
| NFR-008 (CRITICAL) | (cross-cutting) | T-004, T-403 | (pending) |
| NFR-010 (CRITICAL) | US-025 | T-203, T-204 | (pending) |
| NFR-011 (CRITICAL) | (cross-cutting) | T-204 | (pending) |

```yaml
traceability:
  - { requirement_id: FR-001, story_ids: [US-001], sprint_objective_ids: [T-101], test_ids: [] }
  - { requirement_id: FR-007, story_ids: [US-004], sprint_objective_ids: [T-205], test_ids: [] }
  - { requirement_id: FR-011, story_ids: [US-007], sprint_objective_ids: [T-207], test_ids: [] }
  - { requirement_id: FR-021, story_ids: [US-014], sprint_objective_ids: [T-301], test_ids: [] }
  - { requirement_id: FR-023, story_ids: [US-015], sprint_objective_ids: [T-303], test_ids: [] }
  - { requirement_id: FR-038, story_ids: [US-025], sprint_objective_ids: [T-203], test_ids: [] }
  - { requirement_id: NFR-008, story_ids: [], sprint_objective_ids: [T-004, T-403], test_ids: [] }
  - { requirement_id: NFR-010, story_ids: [US-025], sprint_objective_ids: [T-203, T-204], test_ids: [] }
  - { requirement_id: NFR-011, story_ids: [], sprint_objective_ids: [T-204], test_ids: [] }
```

---

## 7. Approval

```yaml
approval:
  facilitator: "Muquaddar"
  reviewers:
    - { name: "Muquaddar", role: product, decision: approved, comments: "Solo self-approval." }
    - { name: "Muquaddar", role: tech, decision: approved, comments: "DEFERRED (tracked, not blocking): SC-002 ancestry/twin eval thresholds need a real labeled set — validated at T-208 (reasoning.S2 golden-eval gate), not before SK.G2." }
  approver_product: "Muquaddar"
  approver_tech: "Muquaddar"
  approved_at: "2026-06-29"
  git_tag: null
  forge_submission_id: null
```

---

## Tier Variations

- **Tier 3 (this project)**: Standard + the security NFR review is performed by the founder acting as security lead (solo build). AI-safety NFRs (§2a) are first-class, not optional, because the product is LLM-backed.

---

## Quality Bar (SK.G2 — Requirements side)

- [x] Every Must FR traces to ≥ 1 user story
- [x] Every Must NFR has a measurable target + measurement method
- [x] ≥ 4 NFR categories (performance, security, availability, accessibility, compatibility, usability, compliance, ai_safety, resilience_lifecycle — 9 covered)
- [x] AI/LLM safety NFRs present (§2a) — NFR-010/011/012/013/017
- [x] Resilience & data-lifecycle NFRs present (§2b) — NFR-015/016
- [x] MoSCoW distribution healthy (Must 59% ≤ 60%)
- [x] ≥ 3 explicit Won't items with rationale (OOS-001..006)
- [x] All spec_01 constraints carried forward (amplified)
- [x] Header counts match reality (39 FR: 23/14/2/0; 17 NFR)
