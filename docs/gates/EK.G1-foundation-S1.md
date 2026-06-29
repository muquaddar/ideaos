---
name: EK.G1-foundation-S1
gate_code: EK.G1
gate_kind: sprint-kickoff
version: 2.1.0
description: "EK.G1 kickoff submission for foundation.S1 — account signup, auth, and credential security."
---

# EK.G1 — Sprint Kickoff Gate Submission: foundation.S1

> Second sprint on the critical path (spec_06 §4: infra.S1 → **foundation.S1** → capture.S1 → ...).
> infra.S1 complete, tagged `infra.S1-complete`. Codebase now GitNexus-indexed (450 nodes/520 edges) —
> impact analysis will be run before any edit to existing symbols (src/db.ts, src/server.ts).

---

## Submission Metadata

```yaml
gate_code: EK.G1
project_slug: "ideaos"
track: "foundation"
sprint_id: "S1"
sprint_title: "Accounts & auth security"
submitter: "Muquaddar"
submitted_at: "2026-06-29"
prerequisite_gates: [EK.G2.infra-S1]
baseline_tag: "infra.S1-complete"
```

---

## Sprint Scope Confirmation

```yaml
sprint_objectives:
  - id: T-001
    criterion: "POST /api/v1/auth/signup creates account + sends verification email; breach-checked Argon2id password"
    verifiable_by: integration_test
    requirement_refs: [FR-034, NFR-014]
    story_refs: [US-022]
    owner: "Muquaddar"
    estimated_effort_hours: 8   # Fastify route + Zod validation + Argon2id + HIBP breach-check (free, keyless k-anonymity API) + users/audit_log migrations + email-send stub (see SR-3)
  - id: T-002
    criterion: "POST /api/v1/auth/login issues access(15m)+refresh(7d rotating httpOnly) tokens; auth events audit-logged"
    verifiable_by: integration_test
    requirement_refs: [FR-035, NFR-014]
    story_refs: [US-022]
    owner: "Muquaddar"
    estimated_effort_hours: 7   # JWT access/refresh issuance + rotation + httpOnly/SameSite cookie + audit_log writes
  - id: T-003
    criterion: "Auth rate-limited <=10 req/min/IP; account locks after 5 failed logins"
    verifiable_by: integration_test
    requirement_refs: [NFR-002]
    story_refs: [US-022]
    owner: "Muquaddar"
    estimated_effort_hours: 5   # @fastify/rate-limit (in-memory store for now, see SR-5) + failed-login lockout counter
  - id: T-004
    criterion: "Idea content + embeddings encrypted at rest (AES-256/KMS); TLS 1.3 enforced end to end"
    verifiable_by: integration_test
    requirement_refs: [NFR-008]
    story_refs: []
    owner: "Muquaddar"
    estimated_effort_hours: 4   # encryption-readiness only this sprint, see SR-4 — no ideas table exists until capture.S1
total_estimated_hours: 24
team_capacity_hours: 60        # 2-week sprint x <=30 focused hrs/week (SC-006)
capacity_pressure: 0.40
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

## Architecture Decisions This Sprint Builds Against (spec_04, no re-litigation)

```yaml
stack:
  backend: "Node 20 + Fastify + TypeScript + Zod"
  auth_method: "email + password (Argon2id, breach-list checked) + JWT access(15m)/refresh(7d rotating, httpOnly+SameSite cookie)"
  rate_limit: "Fastify rate-limiter, Redis-backed in production (SR-5: in-memory store this sprint)"
users_table: "id, email (citext unique), password_hash, status, created_at"
audit_log_table: "id, user_id, action, entity, ip, created_at — append-only, content-free"
```

---

## Pre-Submission Checklist

- [x] Every objective in this sprint has an assigned owner — Muquaddar (solo)
- [x] Estimated effort summed and compared to team capacity — 24h / 60h, pressure 0.40
- [x] Capacity pressure < 0.85
- [ ] Test stubs generated — written TDD-first per objective at build time (AGENTS.md §"Running a sprint" step 3), not pre-generated
- [x] Sprint risks identified and logged (below)
- [x] Dependencies on other tracks confirmed — depends_on: [infra] (spec_06 §2), satisfied by infra.S1
- [x] No scope creep since SK.G4 — objectives match spec_06 §3 `foundation.S1` verbatim
- [x] Capacity profile declared (solo, Tier 3) — sustainability flag green
- [x] GitNexus index current (450 nodes/520 edges, this sprint's baseline) — impact analysis required before editing any existing symbol
- [ ] `accepted_deferred` register — N/A, no deferred objectives in this sprint

---

## Risks Identified

```yaml
sprint_risks:
  - id: SR-3
    description: >
      T-001's AC-1 requires a real verification email to be sent (INT-003, spec_04). No
      transactional email provider account exists yet (same category of gap as T-502/Render).
    severity: medium
    likelihood: high
    mitigation: >
      Scope the email side-effect behind an EmailSender interface with a console/DB-logged
      stub implementation for now (mirrors T-502's localhost-smoke-test pattern) — signup
      still genuinely creates the account, hashes+breach-checks the password, and records a
      verification token; only the outbound send is stubbed. Swap in a real provider
      (Postmark/SES/Resend) behind the same interface with zero call-site changes once an
      account exists. Non-blocking: tracked as an open item against the first sprint that
      needs real email delivery (capture.S1 onboarding flow, or sooner if requested).
    owner: "Muquaddar"
  - id: SR-4
    description: >
      T-004 criterion names "idea content + embeddings" encryption, but no ideas/embeddings
      table exists yet — capture.S1 builds it. Same sequencing shape as infra.S1's SR-1.
    severity: low
    likelihood: high
    mitigation: >
      Scope T-004 this sprint to encryption READINESS: TLS-enforcement middleware/config,
      a KMS-key-resolution module (lib/security/kms.ts) ready for capture.S1 to call, and
      managed-Postgres-at-rest confirmation (Render/Fly Postgres encrypts at rest by
      default) — not per-row content encryption of a table that doesn't exist. capture.S1
      must call the field-encryption helper when it creates the ideas table; this sprint
      makes that helper exist and tested.
    owner: "Muquaddar"
  - id: SR-5
    description: "T-003's rate-limiter is spec'd Redis-backed (spec_04 §NFR-002 row), but no production Redis instance is provisioned (no hosting account yet, same gap as SR-3/T-502)."
    severity: low
    likelihood: medium
    mitigation: "Use @fastify/rate-limit's in-memory store for now — functionally correct for NFR-002's stated threshold on a single instance (today's reality: one process, no horizontal scaling yet). Swap to a Redis store behind the same plugin config once infra exists for it. Non-blocking."
    owner: "Muquaddar"
```

---

## Dependencies on Other Tracks

```yaml
cross_track_dependencies:
  - { depends_on_track: infra, depends_on_sprint: S1, status: satisfied, note: "EK.G1-infra-S1 objectives T-501..T-504 merged to main (tag infra.S1-complete)" }
```

---

## Submitter / Approver

```yaml
submitter:
  name: "Muquaddar"
  role: sprint_owner_or_tech_lead

approver:
  name: "Muquaddar"
  decision: approved
  decision_at: "2026-06-29"
  comments: "Approved as drafted — scope, capacity, and SR-3/SR-4/SR-5 mitigations accepted in-conversation."
```

Tier 3, solo: sprint owner self-approves per spec_01 Tier Variations — but per `AGENTS.md` step 2, this form is **presented for the user's explicit confirmation before any code is written**, regardless of self-approval authority.
