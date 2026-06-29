---
name: EK.G1-infra-S1
gate_code: EK.G1
gate_kind: sprint-kickoff
version: 2.1.0
description: "EK.G1 kickoff submission for infra.S1 — CI/CD, sk-lint gate, eval & safety suites, observability."
---

# EK.G1 — Sprint Kickoff Gate Submission: infra.S1

> First sprint on the critical path (spec_06 §4). SK.G1–G4 self-approved 2026-06-29
> (`docs/specs/project.yaml` → `project.lock`); `sk-lint` PASS (0 fail, 1 expected WARN —
> track-banded T-NNN numbering gaps, by design).

---

## Submission Metadata

```yaml
gate_code: EK.G1
project_slug: "ideaos"
track: "infra"
sprint_id: "S1"
sprint_title: "CI/CD, sk-lint gate, eval & safety suites, observability"
submitter: "Muquaddar"
submitted_at: "2026-06-29"
prerequisite_gates: [SK.G4]
baseline_tag: null   # not a git repo yet — T-501 itself initializes git + GitHub remote;
                      # tag the empty baseline as the first action inside this sprint, before T-501's
                      # Actions workflow is added (see Pre-Submission Checklist).
```

---

## Sprint Scope Confirmation

```yaml
sprint_objectives:
  - id: T-501
    criterion: "GitHub Actions runs lint + test + sk-lint (exit 0) on every PR; red blocks merge"
    verifiable_by: ci_artifact
    requirement_refs: []
    story_refs: []
    owner: "Muquaddar"
    estimated_effort_hours: 5   # git init + GH remote + Actions workflow + branch protection
  - id: T-502
    criterion: "Merge to main deploys to staging + runs smoke tests"
    verifiable_by: deploy_log
    requirement_refs: [NFR-003]
    story_refs: []
    owner: "Muquaddar"
    estimated_effort_hours: 6   # Render/Fly.io staging service (ADR-005) + smoke-test job
  - id: T-503
    criterion: "CI blocks merge on the three AI safety suites: adversarial prompt-injection, non-directive output, evidence groundedness"
    verifiable_by: ci_artifact
    requirement_refs: [NFR-010, NFR-011, NFR-013]
    story_refs: [US-025]
    owner: "Muquaddar"
    estimated_effort_hours: 10  # harness + fixture format + CI wiring (see Risks — SR-1)
  - id: T-504
    criterion: "OpenTelemetry traces emitted; per-user AI cost metered to ai_invocations; budget alarm fires over ceiling"
    verifiable_by: integration_test
    requirement_refs: [NFR-017]
    story_refs: []
    owner: "Muquaddar"
    estimated_effort_hours: 7   # otel sdk + ai_invocations table/migration + budget alarm
total_estimated_hours: 28
team_capacity_hours: 60        # 2-week sprint x <=30 focused hrs/week (SC-006)
capacity_pressure: 0.47
```

### Capacity profile (MP-06 / MP-23)

```yaml
capacity_profile:
  execution: serial-solo
  capacity_floor: "<=30 focused hrs/week (SC-006); descope Should/Could FRs first if breached 2 sprints running"
  sustainability_flag: green
  active_tracks_this_sprint: 1
```

---

## Pre-Submission Checklist

- [x] Every objective in this sprint has an assigned owner — Muquaddar (solo)
- [x] Estimated effort summed and compared to team capacity — 28h / 60h, pressure 0.47
- [x] Capacity pressure < 0.85
- [ ] Test stubs generated — no `test-synthesis` agent run yet; stubs will be written TDD-first per
      objective at build time (AGENTS.md §"Running a sprint" step 3), not pre-generated
- [x] Sprint risks identified and logged (below)
- [x] Dependencies on other tracks confirmed — none; `infra.S1` is the first sprint, nothing precedes it
- [x] No scope creep since SK.G4 — objectives match spec_06 §3 `infra.S1` verbatim
- [x] Capacity profile declared (solo, Tier 3) — sustainability flag green
- [ ] `accepted_deferred` register — N/A, no deferred objectives in this sprint (the SK.G1-G4
      deferred-but-tracked open items are logged in `project.yaml`, not sprint-level deferrals)

---

## Risks Identified

```yaml
sprint_risks:
  - id: SR-1
    description: >
      T-503 requires CI to block merges on three AI safety suites, but the code under test
      (lib/ai/evidence-contract, lib/ai/injection-filter) doesn't exist until reasoning.S1 —
      several sprints downstream on the critical path (spec_06 §4).
    severity: medium
    likelihood: high
    mitigation: >
      Scope T-503 in this sprint to the HARNESS, not the assertions: CI job + fixture format +
      runner wiring that fails CLOSED (red) when lib/ai/ is absent or a fixture is missing —
      satisfying "red blocks merge" now. The harness starts asserting real non-directive/injection/
      groundedness behavior once reasoning.S1 lands its code against the same fixtures. No merge to
      main is possible without this job passing, at any point — including before reasoning.S1.
    owner: "Muquaddar"
  - id: SR-2
    description: "NFR-017 cost-ceiling budget alarm (T-504) needs real Anthropic + Voyage AI account-level pricing, not yet confirmed (project.yaml open_items, deferred from SK.G4 self-approval)."
    severity: low
    likelihood: medium
    mitigation: "Confirm pricing against current provider rate cards before wiring the alarm threshold; use a conservative placeholder ceiling if confirmation slips, flagged non-blocking for this sprint since no AI traffic exists yet to meter."
    owner: "Muquaddar"
```

---

## Dependencies on Other Tracks

```yaml
cross_track_dependencies: []   # infra.S1 is first on the critical path — nothing to depend on
```

---

## Submitter / Approver

```yaml
submitter:
  name: "Muquaddar"
  role: sprint_owner_or_tech_lead

approver:
  name: "Muquaddar"
  decision: pending   # awaiting user confirmation in this conversation before any code is written
  decision_at: null
  comments: ""
```

Tier 3, solo: sprint owner self-approves per spec_01 Tier Variations (founder holds tech+product+devops authority) — but per `AGENTS.md` step 2, this form is **presented for the user's explicit confirmation before any code is written**, regardless of self-approval authority.
