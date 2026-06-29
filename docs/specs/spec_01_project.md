---
name: spec_01_project
spec_id: 01
project_slug: "ideaos"
version: 0.1.0
tier: 3  # one of: 1, 2, 3, 4 — complexity tier (see §Capacity note; built solo, MP-06)
facilitator: hybrid  # AI drafts, founder reviews/approves
status: approved  # draft → in-review → approved
owners:
  product_lead: "Muquaddar (founder)"
  tech_lead: "Muquaddar (founder)"
sponsor: null  # solo, bootstrapped — no external sponsor
created: "2026-06-29"
last_modified: "2026-06-29"
gate: SK.G1
spec_files_in_pack:
  - spec_01_project.md
  - spec_02_users.md
  - spec_03_requirements.md
  - spec_04_architecture.md
  - spec_05_design.md
  - spec_06_build.md
  - spec_07_launch.md
---

# IdeaOS — An AI Cognitive Operating System for Builders

> Approval gate: **SK.G1 — Discovery**. Approve when sections 1–10 are complete and the quality bar (see `facilitator-rules.md`) is met.

---

## 1. Vision

IdeaOS is an AI-powered cognitive operating system that helps creators, researchers, founders, and engineers turn thousands of fleeting ideas into a small number of deliberate, well-timed decisions. It does not manage tasks, notes, or projects — it manages the *evolution of ideas* and the *decisions surrounding them*. Every idea a person has is captured, connected to the ideas it descended from, and preserved forever; nothing is discarded, and nothing is built on excitement alone. When a new idea appears, IdeaOS reconstructs where it came from, what it would cost, what it would delay, and what it would enable — then presents that evidence so the person, not the AI, decides what to build and when. Its purpose is not productivity; its purpose is **decision quality**. The product exists to help people spend their finite lives building the right things at the right time while losing none of the valuable ideas they ever have.

---

## 2. Mission

Help people make **conscious commitments instead of emotional commitments** — by making every idea's origin, cost, opportunity cost, and activation condition visible at the moment of decision.

---

## 3. Scope — In

> What the v1.0 release IS. Anything not listed is out of scope.

- Frictionless idea capture by voice or text (no forms, no templates)
- AI Socratic interview that elicits an idea's origin, trigger, purpose, and type (curiosity / necessity / optimization)
- Idea Ancestry Engine: classify a new idea against the existing graph (new / similar / duplicate / child / sibling / multi-parent) and reconstruct its reasoning chain
- Automatic relationship detection between ideas (parent, child, dependency, supports, conflicts, duplicates, inspired-by)
- A persistent, queryable **idea knowledge graph** where nodes are ideas and edges carry reasoning
- Derivative Analysis per idea (depth, leverage, dependency, cost, opportunity cost, derivative value, derivative risk)
- Reality Check: an evidence panel surfaced at decision time (similarity, origin, expected delay, duplication, existing-solution coverage)
- A non-directive decision step with seven outcomes: Build Now, Schedule, Incubate, Delegate, Archive, Merge, Reject
- Evidence-based **activation conditions** ("activate when N products need a shared character model") rather than priority ranking
- Living graph home screen with zoom, filter, branch collapse/expand, search, and relationship highlighting
- Time Machine: daily graph snapshots and timeline playback of how thinking evolved
- Idea Archaeology view: ancestors, descendants, siblings, twins, influences, conflicts for any idea
- Decision Dashboard answering "what am I building / why / what is waiting / what should activate next"
- Single-user accounts with secure auth, full graph export, and account/data deletion

```yaml
# Machine layer — parsed by Forge v2
scope_in:
  - id: SC-IN-001
    capability: "Idea capture"
    description: "Capture ideas by voice or free-text with no forms or templates"
  - id: SC-IN-002
    capability: "AI interview"
    description: "Socratic interview eliciting origin, trigger, purpose, idea-type"
  - id: SC-IN-003
    capability: "Idea ancestry engine"
    description: "Classify a new idea vs the graph and reconstruct its reasoning chain"
  - id: SC-IN-004
    capability: "Relationship detection"
    description: "Auto-detect parent/child/dependency/support/conflict/duplicate edges"
  - id: SC-IN-005
    capability: "Idea knowledge graph"
    description: "Persistent graph: idea nodes + reasoning-bearing edges"
  - id: SC-IN-006
    capability: "Derivative analysis"
    description: "Per-idea scores: depth, leverage, dependency, cost, opportunity cost, value, risk"
  - id: SC-IN-007
    capability: "Reality check"
    description: "Evidence panel at decision time (non-directive)"
  - id: SC-IN-008
    capability: "Decision step"
    description: "Seven outcomes: build-now/schedule/incubate/delegate/archive/merge/reject"
  - id: SC-IN-009
    capability: "Activation conditions"
    description: "Evidence-triggered activation rather than priority ranking"
  - id: SC-IN-010
    capability: "Graph visualization"
    description: "Living home graph: zoom, filter, collapse, search, relationship highlight"
  - id: SC-IN-011
    capability: "Time machine"
    description: "Daily snapshots + timeline playback of idea evolution"
  - id: SC-IN-012
    capability: "Idea archaeology"
    description: "Per-idea history: ancestors, descendants, siblings, twins, influences, conflicts"
  - id: SC-IN-013
    capability: "Decision dashboard"
    description: "Standing answers to what/why/waiting/activate-next"
  - id: SC-IN-014
    capability: "Account, export, deletion"
    description: "Auth, full graph export, account + data deletion"
```

---

## 4. Scope — Out

> What v1.0 is NOT. Each item has rationale.

- **Team / multi-collaborator graphs** — Rationale: v1.0 is a single thinker's cognitive OS; shared graphs add permission, merge, and conflict complexity that would dilute the core promise. Revisit: future.
- **Task / project execution (assignees, due dates, kanban)** — Rationale: explicit non-goal; IdeaOS decides *what* to build, not *how* to track the work. Revisit: never (integration, not absorption).
- **Calendar, habit tracking, note-taking, generic "second brain"** — Rationale: declared non-goals in the vision; presence of these features would re-anchor the product as a productivity app. Revisit: never.
- **A conversational chatbot / general AI assistant surface** — Rationale: the AI is an evidence engine, not an open-ended chat companion; an assistant framing invites "tell me what to do," violating the never-decides principle. Revisit: never.
- **Native mobile apps (iOS/Android)** — Rationale: v1.0 ships responsive web + voice capture; native apps are deferred until capture habits are validated. Revisit: next-release.
- **Auto-execution of decisions (e.g., scaffolding a repo when "Build Now" chosen)** — Rationale: the system informs decisions; acting on them is the user's domain. Revisit: future.

```yaml
scope_out:
  - id: SC-OUT-001
    capability: "Team / shared graphs"
    rationale: "Single-thinker product; collaboration adds permission/merge complexity"
    revisit: future
  - id: SC-OUT-002
    capability: "Task & project execution"
    rationale: "Explicit non-goal; decide what to build, not track the work"
    revisit: never
  - id: SC-OUT-003
    capability: "Calendar / habits / notes / second-brain"
    rationale: "Declared non-goals; would re-anchor product as productivity app"
    revisit: never
  - id: SC-OUT-004
    capability: "General chatbot / AI assistant"
    rationale: "AI is an evidence engine; assistant framing invites directive answers"
    revisit: never
  - id: SC-OUT-005
    capability: "Native mobile apps"
    rationale: "Responsive web + voice first; native deferred until habit validated"
    revisit: next-release
  - id: SC-OUT-006
    capability: "Auto-execution of decisions"
    rationale: "System informs decisions; acting on them is the user's domain"
    revisit: future
```

---

## 5. Stakeholders

| Name | Role | Authority | Contact |
|------|------|-----------|---------|
| Muquaddar | Founder (product + tech + UX lead) | Decides | muquaddar@gmail.com |
| Early design partners (3–5 builders) | Beta users / domain validators | Consulted | recruited pre-SK.G2 |
| LLM provider (Anthropic) | Reasoning + interview model vendor | Informed | account-level |
| Embedding provider (Voyage AI) | Similarity / ancestry vectors vendor | Informed | account-level |
| Prospective subscribers | Future paying users | Informed | n/a |

```yaml
stakeholders:
  - id: ST-001
    name: "Muquaddar"
    role: "Founder (product/tech/UX lead)"
    authority: decides
    contact: "muquaddar@gmail.com"
  - id: ST-002
    name: "Early design partners"
    role: "Beta users / domain validators"
    authority: consulted
    contact: "recruited pre-SK.G2"
  - id: ST-003
    name: "Anthropic"
    role: "LLM provider"
    authority: informed
    contact: "account-level"
  - id: ST-004
    name: "Voyage AI"
    role: "Embedding provider"
    authority: informed
    contact: "account-level"
  - id: ST-005
    name: "Prospective subscribers"
    role: "Future paying users"
    authority: informed
    contact: "n/a"
```

---

## 6. Success Criteria

> Each criterion has a measurable target. These are the things that must be true for IdeaOS to have succeeded — and they are deliberately about *decision quality*, not engagement.

1. **Ideas are captured, not lost** — Target: ≥ 90% of capture sessions reach a saved, classified idea node in < 60s p95 from first input. Measurement: analytics. Timeframe: 30d post-launch.
2. **Duplicates are caught before they are rebuilt** — Target: ≥ 80% of ideas with a ≥ 0.85 similarity twin are surfaced as duplicate/twin at capture, validated against a labeled eval set. Measurement: AI eval harness. Timeframe: per release.
3. **Decisions are evidence-backed** — Target: ≥ 95% of "Build Now" decisions are made on a screen where a Reality Check evidence panel was shown and viewed. Measurement: analytics. Timeframe: 30d post-launch.
4. **Reduced project drift (the core promise)** — Target: among design partners using IdeaOS ≥ 8 weeks, self-reported abandoned/duplicate projects drop ≥ 30% vs the prior comparable period. Measurement: longitudinal survey. Timeframe: 90d post-launch.
5. **The AI never decides** — Target: 0 instances of directive output ("you should build X") in a 200-sample adversarial + production audit; 100% of fact-bearing AI claims carry provenance. Measurement: AI eval harness + manual audit. Timeframe: per release (CRITICAL).
6. **Founder sustainability (MP-09)** — Target: build sustained at ≤ 30 focused hours/week with ≥ 6 months runway maintained; breach triggers descope, not heroics. Measurement: manual. Timeframe: monthly.

```yaml
success_criteria:
  - id: SC-001
    description: "Ideas captured and classified, not lost"
    target: ">=90% of sessions reach saved+classified node; p95 < 60s"
    measurement: analytics
    timeframe: "30d post-launch"
  - id: SC-002
    description: "Duplicate/twin ideas surfaced before rebuild"
    target: ">=80% recall of >=0.85-similarity twins on labeled eval set"
    measurement: ai_eval_harness
    timeframe: "per release"
  - id: SC-003
    description: "Build-Now decisions are evidence-backed"
    target: ">=95% made with Reality Check panel shown+viewed"
    measurement: analytics
    timeframe: "30d post-launch"
  - id: SC-004
    description: "Reduced abandoned/duplicate projects (core promise)"
    target: ">=30% self-reported reduction among >=8-week design partners"
    measurement: longitudinal_survey
    timeframe: "90d post-launch"
  - id: SC-005
    description: "AI is non-directive and grounded (CRITICAL)"
    target: "0 directive outputs in 200-sample audit; 100% fact claims carry provenance"
    measurement: ai_eval_harness
    timeframe: "per release"
  - id: SC-006
    description: "Founder sustainability"
    target: "<=30 focused hrs/week; >=6 months runway; breach => descope"
    measurement: manual
    timeframe: monthly
```

> **Cold-start / time-to-value.** IdeaOS's value is structurally back-loaded: an empty graph cannot show ancestry, leverage, or duplicates. The cold-start plan (see spec_05 §7 onboarding and spec_07 §7) is to (a) seed each new user by importing 10–30 existing ideas in a guided first session so the graph is non-trivial on day one, and (b) deliver an immediate single-idea value moment (the AI interview + a first relationship) before any graph density exists.

---

## 7. Constraints

### Regulatory
- GDPR / DPDP (India) — the graph is a person's most private asset (their entire thinking history); right-to-export and right-to-erasure are first-class, not afterthoughts.
- No sale or third-party advertising use of idea content, ever (product positioning + trust constraint).

### Technical
- LLM-backed: depends on a third-party reasoning model (Anthropic Claude) and an embedding model (Voyage AI); the product must degrade gracefully when either is unavailable.
- Per-user LLM/embedding cost must stay within a defined budget so unit economics close (see spec_07 §10).
- Web-first (responsive); voice capture via browser speech APIs with a server-side transcription fallback.

### Organizational
- Solo founder, bootstrapped: ≤ 30 focused hours/week capacity; serial execution across tracks (MP-06 capacity profile in spec_06 §6).
- Build must reach a usable, dogfoodable alpha within the first ~10 weeks of build to validate the core loop.

```yaml
constraints:
  regulatory:
    - "GDPR / DPDP: right-to-export + right-to-erasure first-class"
    - "No sale or ad-use of idea content"
  technical:
    - "Depends on third-party LLM (Anthropic) + embeddings (Voyage AI); must degrade gracefully"
    - "Per-user LLM/embedding cost capped to keep unit economics positive"
    - "Web-first responsive; voice via browser API + server transcription fallback"
  organizational:
    - "Solo founder, <=30 focused hrs/week, serial track execution"
    - "Dogfoodable alpha within ~10 weeks of build start"
```

---

## 8. Risks

| ID | Risk | Severity | Likelihood | Owner | Mitigation |
|----|------|---------|-----------|-------|-----------|
| R-001 | AI drifts into directive advice ("build this"), violating the core promise and user trust | High | Medium | ST-001 | Make non-directive a CRITICAL NFR (NFR-010); evidence-only prompt contract; adversarial eval suite blocking in CI; provenance required on every fact claim |
| R-002 | Ancestry/duplicate detection is inaccurate — false twins frustrate, missed twins defeat the purpose | High | Medium | ST-001 | Golden eval set with precision/recall thresholds; human-confirm every auto-edge; tune similarity threshold; eval gates merges |
| R-003 | Cold-start: empty graph reads as a failed product; users churn before value accrues | High | High | ST-001 | Guided import of 10–30 ideas in first session; immediate single-idea value moment; onboarding journey (spec_02 J-1) |
| R-004 | LLM/embedding cost per active user exceeds revenue — unit economics never close | High | Medium | ST-001 | Per-user budget + cheap-model routing for classification; cost model in spec_07 §10; kill/continue criteria |
| R-005 | Privacy breach of idea content (the user's whole mind) destroys trust irrecoverably | High | Low | ST-001 | Encryption at rest + in transit; ingested-content treated as untrusted; injection defense (NFR-011); least-privilege; export/delete workflows tested |
| R-006 | Solo founder burnout / scope explosion — IdeaOS itself becomes a victim of idea drift | Medium | High | ST-001 | Dogfood IdeaOS's own pipeline on its feature backlog (vision §"use its own philosophy"); sustainability success criterion SC-006; serial capacity floor |

```yaml
risks:
  - id: R-001
    description: "AI drifts into directive advice, violating non-decides promise"
    severity: high
    likelihood: medium
    owner: ST-001
    mitigation: "CRITICAL NFR-010; evidence-only prompt contract; adversarial eval blocking CI; provenance required"
  - id: R-002
    description: "Inaccurate ancestry/duplicate detection (false/missed twins)"
    severity: high
    likelihood: medium
    owner: ST-001
    mitigation: "Golden eval set precision/recall; human-confirm edges; eval gates merges"
  - id: R-003
    description: "Cold-start: empty graph reads as failure; early churn"
    severity: high
    likelihood: high
    owner: ST-001
    mitigation: "Guided import; immediate single-idea value; onboarding journey J-1"
  - id: R-004
    description: "Per-user LLM/embedding cost exceeds revenue"
    severity: high
    likelihood: medium
    owner: ST-001
    mitigation: "Per-user budget; cheap-model routing; cost model + kill/continue criteria (spec_07 §10)"
  - id: R-005
    description: "Privacy breach of idea content destroys trust"
    severity: high
    likelihood: low
    owner: ST-001
    mitigation: "Encryption; untrusted-content handling; injection defense; tested export/delete"
  - id: R-006
    description: "Solo founder burnout / scope explosion in IdeaOS itself"
    severity: medium
    likelihood: high
    owner: ST-001
    mitigation: "Dogfood own pipeline on backlog; SC-006 sustainability; serial capacity floor"
```

---

## 9. Assumptions

- Builders genuinely lose value to idea drift and *want* a tool that slows them down at decision time (validated in beta — SC-004).
- An LLM can elicit an idea's origin and classify ancestry well enough that auto-edges are mostly correct and human confirmation is light.
- Embedding similarity over idea text is a good-enough first proxy for "is this the same idea" before richer signals exist.
- Users will tolerate a guided first session (importing past ideas) in exchange for a non-empty graph.
- A single-user, private graph is a defensible v1.0 wedge; collaboration is a later expansion, not a launch requirement.

```yaml
assumptions:
  - id: A-001
    description: "Builders lose value to idea drift and want decision-time friction"
    validation: "Design-partner interviews + SC-004 longitudinal survey"
  - id: A-002
    description: "LLM can elicit origin + classify ancestry with light human confirm"
    validation: "Ancestry eval set (SC-002) before SK.G4"
  - id: A-003
    description: "Embedding similarity is a good-enough first duplicate proxy"
    validation: "Duplicate-detection eval precision/recall"
  - id: A-004
    description: "Users accept a guided import for a non-empty graph"
    validation: "Onboarding completion rate in alpha"
  - id: A-005
    description: "Single-user private graph is a viable v1.0 wedge"
    validation: "Beta retention + willingness-to-pay"
```

---

## 10. Glossary

| Term | Definition |
|------|-----------|
| Idea | A captured thought represented as a node in the knowledge graph, with origin, purpose, scores, and a build status. |
| Idea node | The graph vertex for one idea; records parent, origin, trigger, dependencies, supported projects, cost, benefit, opportunity cost, build status, activation condition. |
| Reasoning edge | A directed, explained relationship between two ideas (created-because, depends-on, improves, blocks, inspired-by, duplicates, supports). |
| Ancestry | The chain of ideas a given idea descended from, reconstructed by the Ancestry Engine. |
| Twin / duplicate | Two ideas the system judges to be substantially the same (high similarity); candidates for Merge. |
| Derivative analysis | The per-idea score set: depth, leverage, dependency, cost, opportunity cost, derivative value, derivative risk. |
| Depth | How many edges an idea sits from the root mission. |
| Leverage | How many future projects/ideas would benefit if this idea were built. |
| Opportunity cost | What gets delayed by building this idea now. |
| Reality Check | The evidence panel shown at decision time (similarity, origin, expected delay, duplication, existing-solution coverage). |
| Activation condition | A pre-declared, evidence-based trigger that says *when* an incubated idea should become reality. |
| Decision outcome | One of: Build Now, Schedule, Incubate, Delegate, Archive, Merge, Reject. |
| Time Machine | Daily graph snapshots and timeline playback of how the graph evolved. |
| Idea Archaeology | The full per-idea history view: ancestors, descendants, siblings, twins, influences, conflicts. |
| Build status | An idea node's lifecycle state (e.g., captured, incubating, scheduled, building, complete, archived, rejected, merged). |

---

## Approval

```yaml
approval:
  facilitator: "Muquaddar"
  reviewers:
    - name: "Muquaddar"
      role: "founder (product+tech)"
      decision: approved  # pending | approved | changes-requested | rejected
      comments: "Solo self-approval — founder holds product+tech authority (Tier 3 capacity profile, see Tier Variations)."
  approver: "Muquaddar"
  approved_at: "2026-06-29"
  git_tag: null
  forge_submission_id: null
```

---

## Tier Variations

- **Tier 3 (this project)**: Standard + executive sponsor name in frontmatter — sponsor is `null` because the project is solo/bootstrapped; the founder holds product, tech, and UX authority. Complexity is Tier 3 (LLM-backed reasoning + knowledge graph); team is one person → capacity profile declared in spec_06 §6 (MP-06), tier is NOT dropped.

```yaml
# Tier 4 only — not applicable (this project is Tier 3)
consensus:
  models: []
  results: []
  reconciled_diff: null
  reconciled_by: null
```

---

## Quality Bar (SK.G1)

- [x] Vision is specific (not generic)
- [x] Mission is 1–2 sentences
- [x] Scope-In and Scope-Out don't overlap
- [x] ≥3 success criteria with measurable targets (6 declared)
- [x] Stakeholder authority explicit (decides/approves/consulted/informed)
- [x] ≥3 risks identified (6 declared)
- [x] All machine-layer YAML blocks filled in (no `{{placeholders}}` remaining)
- [x] Glossary started
