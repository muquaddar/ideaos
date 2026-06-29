---
name: spec_07_launch
spec_id: 07
project_slug: "ideaos"
version: 0.1.0
status: approved
owners:
  devops_lead: "Muquaddar (founder)"
  product_lead: "Muquaddar (founder)"
created: "2026-06-29"
last_modified: "2026-06-29"
gate: SK.G4
depends_on:
  - spec_01_project.md
  - spec_03_requirements.md
  - spec_04_architecture.md
  - spec_06_build.md
---

# IdeaOS — Launch Plan

> Approval gate: **SK.G4 — Build Plan** (jointly with spec_06_build.md).
> Launch posture is a **phased-arc** (§12), not a single GA day — this is a multi-quarter solo build. CRITICAL NFRs (NFR-008/010/011) each have a blocking launch criterion (§6).

---

## 1. Environments

| Environment | Purpose | Promotion criteria | URL |
|-------------|---------|-------------------|-----|
| dev | Local + preview | Push to feature branch | localhost / preview |
| staging | Dogfood + pre-prod | Merge to main passes CI (incl. sk-lint + AI safety suites) | staging.ideaos.app |
| prod | Production | Manual promote after EK.G4 + launch criteria green | app.ideaos.app |

```yaml
environments:
  - { name: dev, promotion_trigger: "push to feature branch", auto_deploy: true, approval_required: false }
  - { name: staging, promotion_trigger: "merge to main", auto_deploy: true, approval_required: false, smoke_tests: true }
  - { name: prod, promotion_trigger: "manual promote after EK.G4 + launch criteria", auto_deploy: false, approval_required: true, canary: true, canary_percentage: 10, canary_bake_time_min: 30 }
```

---

## 2. Infrastructure Provisioning

| Resource | Provider | Notes |
|----------|---------|-------|
| DNS | Cloudflare | ideaos.app |
| TLS certs | Managed (platform) + Cloudflare | TLS 1.3; HSTS |
| Compute | Render / Fly.io | web + api + worker services (ADR-005) |
| Database | Managed Postgres 16 + pgvector | PITR enabled; AES-256 at rest |
| Cache/queue | Managed Redis 7 | BullMQ + cache + rate-limit |
| Object storage | S3-compatible (SSE) | voice audio (short-TTL) + exports |
| Secrets | Platform secret manager / KMS | provider API keys, DB creds; rotate ≥ quarterly |
| CDN | Cloudflare | static assets |
| AI providers | Anthropic + Voyage AI | keys in KMS; per-user budget metering (NFR-017) |

---

## 3. Runbook (Standard Operations)

### Deploy / promote
```bash
# staging auto-deploys on merge to main
# promote to prod after launch criteria green:
gh workflow run promote-prod.yml -f sha=<release-sha>
```

### Scale / stop
```bash
# scale api/worker (managed dashboard or CLI)
render scale ideaos-api --count 3
render scale ideaos-worker --count 2
# pause AI workers during a provider incident (capture + graph keep working):
render scale ideaos-worker --count 0
```

### Database operations
```bash
npm run migrate:up        # expand-migrate-contract; never destructive same-deploy
npm run migrate:status
# read-only prod inspection:
psql "$DATABASE_URL_READONLY"
```

### Common operations
- Tail logs: `render logs ideaos-api -f`
- Replay a failed AI job: `npm run jobs:retry --queue=ancestry --id=<jobId>`
- Force a snapshot: `npm run jobs:run --job=snapshot-daily`

---

## 4. Rollback Strategy

### Decision tree
**Rollback IMMEDIATELY if:** service down · idea data lost/corrupted · **a non-directive or injection guardrail regression ships (NFR-010/011)** · error rate > 10% vs < 1% baseline.
**Do NOT rollback (use a flag) if:** minor non-critical bug · one AI panel degraded while capture+graph work · perf degraded < 20%.

### Rollback procedure (target T+30min)

| Phase | Time | Action |
|-------|------|--------|
| 1: Declare | T+0–5m | Note incident; confirm PITR/backup current |
| 2: DB rollback (if schema) | T+5–20m | Pause workers; restore via PITR; verify row counts |
| 3: Code rollback | T+20–25m | Redeploy previous image (managed one-click) |
| 4: Restart | T+25–28m | Health checks green |
| 5: Verify | T+28–30m | Smoke tests; error rate + p95; **re-run AI safety smoke (non-directive + injection)** |

```yaml
rollback:
  rto_minutes: 30
  rpo_minutes: 5
  options:
    - { id: image_swap, method: "redeploy previous image (managed)", use_when: "code broke, schema unchanged" }
    - { id: pitr_restore, method: "managed Postgres point-in-time restore", use_when: "data corruption / bad migration" }
    - { id: flag_kill, method: "disable feature flag", use_when: "one feature broke; service healthy" }
  tested_on_staging: false   # DEFERRED at SK.G4 self-approval (2026-06-29): T-507 is an infra.S2
                              # build objective and cannot run before any infra exists. Tracked as
                              # a hard pre-GA gate (LC-009) — re-check when infra.S2 lands, not waived.
  test_log_link: null         # link the staging rollback drill log (T-507)
```

---

## 5. Monitoring & Alerting

### Metrics tracked

| Metric | Source | Alert threshold |
|--------|--------|-----------------|
| API p95 latency | OpenTelemetry | > 500ms for 5 min |
| API error rate | OTel | > 1% for 5 min |
| Graph render p95 (RUM) | web vitals | > 1.5s @2k nodes |
| AI job queue depth / age | BullMQ metrics | oldest job > 10 min |
| **Per-user AI cost** | ai_invocations rollup | > monthly budget ceiling (NFR-017) |
| **Non-directive filter rejections** | evidence-contract logs | any *bypass* (filter failed to catch) = P0 |
| Ancestry/twin eval drift | scheduled eval job | F1 < 0.80 or recall < 0.80 |
| DB connection pool | pg_stat_activity | > 80% |
| LLM/embedding provider errors | gateway logs | > 2% for 5 min → degrade mode |

### Alerting routes
- **P0** (data loss, guardrail bypass, prod down): push + email to founder immediately.
- **P1** (provider outage → degraded mode, eval drift): email + dashboard.
- **P2/P3**: dashboard digest.

```yaml
monitoring:
  apm: opentelemetry
  metrics_backend: "managed (Grafana Cloud / provider)"
  log_aggregation: "platform logs"
  alerting: "push + email (solo on-call)"
  dashboards: grafana
  slo: { api_availability: 99.5, api_p95_latency_ms: 300, error_rate_pct: 1.0 }
  ai_slo: { non_directive_bypass: 0, provenance_coverage_pct: 100, ancestry_f1_min: 0.80, twin_recall_min: 0.80 }
```

---

## 6. Launch Criteria

> Concrete and measurable. CRITICAL-NFR criteria (LC-006/007/008) are blocking and map to spec_06 blocking suites (sk-lint R8).

- [ ] All Must FRs passing in the EK.G4 release gate
- [ ] All spec_06 sprint objectives marked `passed`
- [ ] Graph + ancestry latency NFRs (NFR-001/006) verified on a staging load test
- [ ] Accessibility audit passed incl. graph alternative view (NFR-004)
- [ ] Rollback drill executed on staging (LC-009, log linked §4)
- [ ] Backup restore tested in last 30 days (NFR-016)
- [ ] DR drill verifies RTO/RPO + export completeness (NFR-016)
- [ ] DNS/TLS/CDN verified with `curl -I`
- [ ] Founder-sustainability gate green (MP-09 / §12)

```yaml
launch_criteria:
  - { id: LC-001, description: "All Must FRs passing in EK.G4", status: pending, verifier: forge }
  - { id: LC-002, description: "Graph + ancestry latency NFRs verified on staging load test (NFR-001/006)", status: pending, verifier: tech_lead }
  - { id: LC-003, description: "Accessibility audit passed incl. graph alternative view (NFR-004)", status: pending, verifier: ux_lead }
  - { id: LC-004, description: "Data rights verified: export completeness 100% + erasure purge <=30d (NFR-015/016)", status: pending, verifier: tech_lead }
  - { id: LC-005, description: "Per-user AI cost within budget on staging cohort (NFR-017)", status: pending, verifier: tech_lead }
  - { id: LC-006, description: "CRITICAL: encryption at rest + TLS + tenant isolation verified (NFR-008)", status: pending, verifier: tech_lead }
  - { id: LC-007, description: "CRITICAL: non-directive audit 0 directives / 200 samples; 100% provenance (NFR-010/012)", status: pending, verifier: tech_lead }
  - { id: LC-008, description: "CRITICAL: adversarial prompt-injection suite green; secret redaction verified (NFR-011)", status: pending, verifier: tech_lead }
  - { id: LC-009, description: "Rollback drill executed on staging (log linked)", status: pending, verifier: devops_lead }
  - { id: LC-010, description: "Founder-sustainability gate: build delivered <=30 hrs/week avg; runway >=6 months (SC-006)", status: pending, verifier: product_lead }
```

---

## 7. Go-to-Market (GTM) Plan

> Phased-arc (§12); GTM is sequenced, not a single day.

### Audience
- Primary: serial founders + indie engineers (P-001, P-003) who feel idea drift acutely.
- Secondary: independent researchers + writers/worldbuilders (P-002, P-004).

### Channels

| Channel | Asset | Owner | Timing |
|---------|-------|-------|--------|
| Design-partner cohort | private alpha invites (10–20) | founder | from alpha (~wk10) |
| Build-in-public (X / blog) | the dogfooding story (IdeaOS deciding IdeaOS's own features) | founder | continuous |
| Waitlist landing | value framing: "decide what to build, not track tasks" | founder | pre-beta |
| Beta launch post | Reality Check + ancestry demo video | founder | beta open |
| Founder/maker communities | beta invites | founder | beta |

### Cold-start onboarding (SC-001 / R-003)
Every new user is guided to import 10–30 past ideas in the first session so the graph is non-trivial on day one, with an immediate single-idea value moment (interview + first relationship/twin) before graph density exists.

---

## 8. Post-Launch Plan

```yaml
post_launch:
  week_1: { standup_frequency: daily-self, on_call_heightened: true, hotfix_authority: founder }
  week_2_4: { retro_frequency: weekly, metric_review: true }   # compare to spec_01 SC-001..006
  day_30: { full_retro: true, spec_updates: true, pattern_capture: true }   # update PEAS targets if reality diverges; log into SRIJAN issues
```

---

## 9. Feature Flags

| Feature | Flag | Default | Rollout |
|---------|------|---------|---------|
| Voice capture | `voice_capture` | false | enable after WER validated on beta cohort |
| Activation monitor | `activation_monitor` | false | enable once eval-stable; off if alerts noisy |
| Time Machine | `time_machine` | false | enable after ≥ 14 snapshots exist per user |
| Opus escalation | `opus_escalation` | true | kill-switch if per-user cost breaches budget (NFR-017) |

```yaml
feature_flags:
  - { name: opus_escalation, default: true, kill_switch: true, rollout: [{percent: 100, after: "release_day_0"}] }
  - { name: voice_capture, default: false, kill_switch: true, rollout: [{percent: 100, after: "wer_validated"}] }
  - { name: activation_monitor, default: false, kill_switch: true, rollout: [{percent: 100, after: "eval_stable"}] }
```

---

## 10. Business Model & Unit Economics  *(MP-16)*

> IdeaOS is a commercial product. Numbers are **assumptions to validate in beta**, but the model is explicit and falsifiable — and it is dominated by AI cost (the lever from spec_04 §11.5 / NFR-017).

```yaml
business_model:
  pricing:
    model: "tiered subscription; usage-aware (AI cost is the COGS driver)"
    tiers:
      - { id: free, persona: "trial / light user", assumption_band: "$0; capped AI usage + node count to bound COGS" }
      - { id: builder, persona: "P-001/P-003 active builders", assumption_band: "$12-20/mo validate" }
      - { id: pro, persona: "P-002 researchers / heavy graphs", assumption_band: "$30-45/mo validate" }
  unit_economics:
    target_acv: "~$220 blended/yr (assumption)"
    success_criterion_link: "retention tied to SC-004 (reduced drift) — value justifies subscription"
    cogs_per_customer: "dominated by LLM+embedding spend (spec_04 §11.5); Haiku-first routing + analysis caching keep it bounded; per-user budget (NFR-017)"
    gross_margin_target: ">=70% after AI COGS"
    cac: "build-in-public + community; near-zero paid CAC at start"
    payback_target: "<6 months"
    sensitivities:
      - "AI cost per active user is THE risk — lever: model routing, caching, per-user budget"
      - "cold-start churn (R-003) — lever: guided import + first-idea value"
  kill_continue_criteria:
    - { milestone: "month 3 of beta", continue_if: ">=40% of design partners weekly-active AND gross margin >=60%", else: "descope AI depth / re-price / narrow ICP" }
    - { milestone: "month 6 of beta", continue_if: "SC-004 signal positive (drift reduced) AND payback trending <6mo", else: "pivot positioning or sunset" }
  competitive_displacement:
    - { adjacent: "Notion / Obsidian (second brain)", why_used: "capture + linking", why_adopt_ours: "they store ideas; IdeaOS decides which to build, with opportunity cost + ancestry" }
    - { adjacent: "Linear / Jira (project mgmt)", why_used: "track work", why_adopt_ours: "those start AFTER the decision; IdeaOS owns the decision itself" }
    - { adjacent: "ChatGPT (brainstorm)", why_used: "ideation + advice", why_adopt_ours: "IdeaOS never advises; it preserves + connects + surfaces evidence so the human decides" }
```

---

## 11. Tenant Offboarding & Data Portability  *(MP-19)*

> Each user is a tenant of their own private graph. "Clean exit" = export + erasure, already first-class (FR-036/FR-037, NFR-015). Restated as the offboarding contract.

```yaml
offboarding:
  export:
    format: "JSON + GraphML (open, re-importable)"
    completeness_guarantee: "manifest with reconciled counts + checksum → completeness certificate (not best-effort)"
    excluded: "derived data regenerable on re-import (embeddings, scores); never another user's data (single-tenant graphs)"
  deletion:
    default: "30-day grace soft-delete then hard-purge per spec_04 §10.3"
    immediate_option: "honored; hard-purge still completes within the policy window"
    audit_exception: "content-free audit metadata retained per retention policy — DISCLOSED to the user at deletion"
  portability_principle: "your graph is yours and re-importable elsewhere; the moat is product value (ancestry, evidence, decisions), never data lock-in — directly supports trust constraint NFR-009"
```

---

## 12. Launch Posture  *(MP-08)*

- **phased-arc** — "launch" is a sequence of gates over multiple quarters, not a day:
  1. **Dogfood alpha** (~wk10, after graph.S2) — founder uses IdeaOS to run IdeaOS's own feature backlog (vision §"use its own philosophy").
  2. **Private beta** (design-partner cohort) — validates SC-001/002/003 + cold-start.
  3. **Public beta** (waitlist) — validates pricing + unit economics (kill/continue month 3).
  4. **GA** — only after CRITICAL launch criteria (LC-006/007/008) and SC-004 drift signal hold.
- **Sustainability is a launch gate (MP-09):** LC-010 — the build must be delivered at ≤ 30 focused hrs/week with ≥ 6 months runway. Launching unsustainably guarantees post-launch failure (R-006), so it blocks GA like any other criterion.

---

## 13. Approval

```yaml
approval:
  facilitator: "Muquaddar"
  reviewers:
    - { name: "Muquaddar", role: devops, decision: approved, comments: "DEFERRED (tracked, not blocking): LC-009 staging rollback drill (rollback.tested_on_staging) waits on T-507/infra.S2 — re-checked as a pre-GA gate, not a plan-approval precondition." }
    - { name: "Muquaddar", role: product, decision: approved }
    - { name: "Muquaddar", role: security, decision: approved }
  approver_devops: "Muquaddar"
  approver_product: "Muquaddar"
  approved_at: "2026-06-29"
  git_tag: null
  forge_submission_id: null
```

---

## Tier Variations

- **Tier 3 (this project)**: Full spec_07; phased-arc GTM; founder reviews as security + SRE; sustainability gate (LC-010) added because spec_01 declares SC-006.

---

## Quality Bar (SK.G4 — Launch side)

- [x] All environments documented with promotion criteria
- [x] Rollback procedure defined; staging drill is a launch criterion (LC-009) — DEFERRED at SK.G4
  self-approval (T-507 doesn't exist until infra.S2 builds it); `tested_on_staging: true` is a
  pre-GA gate, re-checked then, not a precondition for this draft-plan approval
- [x] Monitoring thresholds for all critical metrics (incl. AI guardrail + cost)
- [x] On-call defined (solo)
- [x] Launch criteria measurable; CRITICAL NFRs (NFR-008/010/011) → LC-006/007/008 (R8)
- [x] DR targets (RTO/RPO per failure class) committed; DR drill is a launch criterion (NFR-016)
- [x] Business Model & Unit Economics (§10) complete; AI cost identified as the dominant lever
- [x] Tenant offboarding & data portability (§11) defined
- [x] Launch posture (§12) is phased-arc; sustainability gate added (LC-010)
- [x] Feature flags listed for risky features
