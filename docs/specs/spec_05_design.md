---
name: spec_05_design
spec_id: 05
project_slug: "ideaos"
version: 0.1.0
status: approved
owners:
  ux_lead: "Muquaddar (founder)"
  product_lead: "Muquaddar (founder)"
created: "2026-06-29"
last_modified: "2026-06-29"
gate: SK.G3
depends_on:
  - spec_01_project.md
  - spec_02_users.md
  - spec_03_requirements.md
  - spec_04_architecture.md
---

# IdeaOS — Design (UX / UI / Accessibility)

> Approval gate: **SK.G3 — Design** (jointly with spec_04_architecture.md).
> Every Must-have user story has ≥ 1 screen (§2). The design's job is to make IdeaOS feel like a *cognitive instrument*, not a productivity app.

---

## 1. Design Principles

1. **Evidence over advice** — The UI presents evidence with provenance and confidence; there is no "recommended" badge and no "do this" button. The decision controls are neutral and equal-weight (DP).
2. **The graph is home** — The primary surface is the living idea graph, never a list or inbox. Lists are secondary views *into* the graph.
3. **Nothing is forgotten, visibly** — Archived, rejected, and merged ideas remain findable and dimmed-but-present; deletion of an *idea* is never offered (only whole-account erasure).
4. **Friction at decision, not capture** — Capture is one gesture with zero required fields; deliberation (Reality Check, decision) is the only place the UI deliberately slows the user down.
5. **Confidence is always on the surface** — Every AI-derived statement shows its confidence and a provenance badge; uncertainty is shown, not hidden.
6. **Calm, not gamified** — No streaks, points, badges, or dopamine loops. The product's emotional tone is reflective. This is an explicit anti-pattern guard (the vision's non-goals).

```yaml
design_principles:
  - { id: DP-001, principle: "Evidence over advice", description: "Provenance + confidence; no recommendation UI; neutral equal-weight decision controls" }
  - { id: DP-002, principle: "The graph is home", description: "Primary surface is the living graph; lists are secondary" }
  - { id: DP-003, principle: "Nothing is forgotten, visibly", description: "Archived/rejected/merged stay findable; no per-idea delete" }
  - { id: DP-004, principle: "Friction at decision, not capture", description: "Zero-field capture; deliberation is the only intentional slowdown" }
  - { id: DP-005, principle: "Confidence always on surface", description: "Every AI claim shows confidence + provenance; uncertainty shown" }
  - { id: DP-006, principle: "Calm, not gamified", description: "No streaks/points/badges; reflective tone" }
```

---

## 2. Screen Inventory

> Every Must-have user story has ≥ 1 screen. (Traceability validated at SK.G3.)

| Screen ID | Name | Story | Route / Path | Primary CTA |
|-----------|------|-------|--------------|-------------|
| SCR-001 | Graph Home | US-009 | / | "Capture" (floating) |
| SCR-002 | Capture | US-001, US-002, US-026 | /capture | "Save idea" / mic |
| SCR-003 | AI Interview | US-003 | /ideas/:id/interview | "Done" |
| SCR-004 | Ancestry & Twins | US-004, US-006, US-007 | /ideas/:id/ancestry | "Review relationships" |
| SCR-005 | Lineage ("where from?") | US-005 | /ideas/:id/lineage | — (read) |
| SCR-006 | Relationship Review | US-006 | /ideas/:id/relationships | "Confirm selected" |
| SCR-007 | Node Detail + Derivative | US-008, US-013 | /ideas/:id | "Open Reality Check" |
| SCR-008 | Search | US-011 | /search | "Capture as new" (empty) |
| SCR-009 | Reality Check & Decision | US-014, US-015, US-025 | /ideas/:id/decide | (7 neutral outcomes) |
| SCR-010 | Merge | US-016 | /ideas/:id/merge | "Merge" |
| SCR-011 | Activation Condition | US-017 | /ideas/:id/activation | "Save condition" |
| SCR-012 | Activation Alerts | US-018 | /alerts | "View evidence" |
| SCR-013 | Time Machine | US-019 | /timeline | (scrubber) |
| SCR-014 | Idea Archaeology | US-020 | /ideas/:id/archaeology | — (read) |
| SCR-015 | Decision Dashboard | US-021 | /dashboard | "Open idea" |
| SCR-016 | Signup | US-022 | /signup | "Create account" |
| SCR-017 | Login | US-022 | /login | "Sign in" |
| SCR-018 | Export | US-023 | /settings/export | "Export graph" |
| SCR-019 | Delete Account | US-024 | /settings/delete | "Delete my ideas" |

```yaml
screens:
  - { id: SCR-001, name: "Graph Home", route: "/", story_refs: [US-009], primary_cta: "Capture", description: "Living idea graph; color by build status", states: [empty, loading, populated, partial, error, degraded] }
  - { id: SCR-002, name: "Capture", route: "/capture", story_refs: [US-001, US-002, US-026], primary_cta: "Save idea", description: "Voice/text capture, zero required fields", states: [empty, validating, submitting, error, success, degraded] }
  - { id: SCR-003, name: "AI Interview", route: "/ideas/:id/interview", story_refs: [US-003], primary_cta: "Done", description: "<=5 skippable Socratic questions", states: [loading, populated, degraded, error] }
  - { id: SCR-004, name: "Ancestry & Twins", route: "/ideas/:id/ancestry", story_refs: [US-004, US-006, US-007], primary_cta: "Review relationships", description: "Classification + twin warning + confidence", states: [loading, populated, partial, degraded, error] }
  - { id: SCR-005, name: "Lineage", route: "/ideas/:id/lineage", story_refs: [US-005], primary_cta: null, description: "Ordered reasoning chain root->idea", states: [loading, populated, empty] }
  - { id: SCR-006, name: "Relationship Review", route: "/ideas/:id/relationships", story_refs: [US-006], primary_cta: "Confirm selected", description: "Accept/reject/edit proposed edges", states: [loading, populated, empty, error] }
  - { id: SCR-007, name: "Node Detail + Derivative", route: "/ideas/:id", story_refs: [US-008, US-013], primary_cta: "Open Reality Check", description: "All node fields + derivative scores w/ factors", states: [loading, populated, partial, error] }
  - { id: SCR-008, name: "Search", route: "/search", story_refs: [US-011], primary_cta: "Capture as new", description: "Hybrid keyword+semantic", states: [empty, loading, populated, error] }
  - { id: SCR-009, name: "Reality Check & Decision", route: "/ideas/:id/decide", story_refs: [US-014, US-015, US-025], primary_cta: "Record decision", description: "Evidence panel + 7 neutral outcomes", states: [loading, populated, partial, degraded, error] }
  - { id: SCR-010, name: "Merge", route: "/ideas/:id/merge", story_refs: [US-016], primary_cta: "Merge", description: "Per-field conflict resolution", states: [populated, error] }
  - { id: SCR-011, name: "Activation Condition", route: "/ideas/:id/activation", story_refs: [US-017], primary_cta: "Save condition", description: "Structured trigger or free-text rule", states: [empty, populated, error] }
  - { id: SCR-012, name: "Activation Alerts", route: "/alerts", story_refs: [US-018], primary_cta: "View evidence", description: "Evidence-based readiness alerts", states: [empty, populated] }
  - { id: SCR-013, name: "Time Machine", route: "/timeline", story_refs: [US-019], primary_cta: null, description: "Snapshot scrubber playback", states: [empty, loading, populated] }
  - { id: SCR-014, name: "Idea Archaeology", route: "/ideas/:id/archaeology", story_refs: [US-020], primary_cta: null, description: "Full relation history", states: [loading, populated, empty] }
  - { id: SCR-015, name: "Decision Dashboard", route: "/dashboard", story_refs: [US-021], primary_cta: "Open idea", description: "What building/why/waiting/activate-next", states: [empty, loading, populated] }
  - { id: SCR-016, name: "Signup", route: "/signup", story_refs: [US-022], primary_cta: "Create account", description: "Email + strong password", states: [empty, validating, submitting, error, success] }
  - { id: SCR-017, name: "Login", route: "/login", story_refs: [US-022], primary_cta: "Sign in", description: "Email + password + lockout", states: [empty, validating, submitting, error] }
  - { id: SCR-018, name: "Export", route: "/settings/export", story_refs: [US-023], primary_cta: "Export graph", description: "JSON/GraphML, async, manifest", states: [empty, submitting, success, error] }
  - { id: SCR-019, name: "Delete Account", route: "/settings/delete", story_refs: [US-024], primary_cta: "Delete my ideas", description: "Phrase confirm; 30d grace", states: [empty, validating, submitting, error] }
```

---

## 3. Design System

### Approach
- **Adapt** — Build on a headless component library (shadcn/ui + Radix primitives) themed with custom IdeaOS tokens. Rationale: solo capacity favors not building primitives from scratch, but the calm/reflective tone (DP-006) and the bespoke graph surface require a custom theme, not an off-the-shelf look.

### Tokens

```yaml
design_tokens:
  color:
    primary: "#3B5BDB"      # deliberate indigo (calm, non-alarming)
    secondary: "#5C7CFA"
    success: "#2F9E44"      # "complete"
    warning: "#E8A13A"      # "schedule"
    error: "#E03131"
    neutral_50: "#F8F9FB"
    neutral_900: "#15181E"
    # build-status palette (DP-002 node coloring)
    status_build: "#3B5BDB"
    status_incubate: "#7048E8"
    status_schedule: "#E8A13A"
    status_research: "#1098AD"
    status_archive: "#868E96"
    status_complete: "#2F9E44"
  typography:
    font_family_body: "'Inter', system-ui, sans-serif"
    font_family_heading: "'Inter', system-ui, sans-serif"
    font_family_mono: "'JetBrains Mono', monospace"   # provenance refs / ids
    scale: { xs: 0.75, sm: 0.875, base: 1.0, lg: 1.125, xl: 1.25, 2xl: 1.5, 3xl: 2.0 }
  spacing: { scale_rem: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4] }
  radius: { sm: 0.25rem, md: 0.5rem, lg: 1rem, full: 9999px }
  shadow: { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 12px rgba(0,0,0,0.08)" }
  motion: { reduced_motion_respected: true, default_easing: "cubic-bezier(0.2,0,0,1)" }
```

### Component library

| Component | Source | Use cases |
|-----------|--------|-----------|
| Button | shadcn/ui (themed) | Neutral decision outcomes, CTAs |
| Input / Textarea | shadcn/ui | Capture, forms |
| Dialog / Sheet | Radix | Node detail, merge, confirmations |
| GraphCanvas | custom (Cosmograph/Sigma.js) | The home graph (DP-002) |
| ProvenanceBadge | custom | Source-record citation on every AI claim (DP-005) |
| ConfidenceMeter | custom | Confidence on AI claims |
| EvidenceItem | custom | One Reality-Check evidence row |
| Toast | sonner | Capture success, sync, export-ready |

---

## 4. Accessibility

### Conformance target
- **WCAG 2.2 AA** for all app screens (NFR-004). Auth screens target AA strictly.
- **The graph (SCR-001) is the hardest a11y surface:** it must have a fully keyboard-navigable, screen-reader-friendly **list/tree alternative view** of the same data — the graph is not the only path to any function.

### Specific requirements

| Area | Requirement | Verified by |
|------|------------|-------------|
| Graph alternative | Every graph action reachable via an accessible tree/list view | manual_audit (NVDA + VoiceOver) |
| Keyboard navigation | All interactive elements Tab-reachable; visible focus ring | axe-core + manual |
| Screen reader | ARIA labels on icon buttons; provenance badges announced with their source | manual_audit |
| Color contrast | Text ≥ 4.5:1; status colors paired with shape/label (never color alone) | axe-core in CI |
| Status encoding | Build status conveyed by color **and** icon/label (color-blind safe) | manual_audit |
| Motion | Respect prefers-reduced-motion (graph physics, timeline playback) | CSS media query test |
| Touch targets | ≥ 44×44px | manual_audit (mobile) |

```yaml
accessibility:
  conformance_target: "WCAG 2.2 AA"
  scope: "all app screens incl. graph alternative view"
  exceptions: []
  ci_tools: [axe-core, pa11y]
  manual_audit: true
  audit_schedule: "before SK.G3 approval; before EK.G4 release"
```

---

## 5. Responsive Strategy

| Breakpoint | Range | Primary devices |
|-----------|-------|-----------------|
| Mobile | 360–767px | Phones — capture-first; graph in simplified/list mode |
| Tablet | 768–1023px | Tablets — graph + side panel |
| Desktop | 1024–1439px | Laptops — full graph workspace |
| Large | 1440px+ | Monitors — graph + persistent detail rail |

- **Approach:** Mobile-first for **capture** (US-001/002 must be flawless on a phone); desktop-first for the **graph workspace** (Time Machine, Archaeology are desktop-min per their PEAS).
- **Layout system:** CSS Grid + container queries; the graph canvas fills available space with overlaid floating controls.

---

## 6. Interaction Patterns

### Capture (DP-004)
- One gesture: a persistent floating "Capture" affordance on every screen; ⌘/Ctrl+K opens it anywhere; mic + text in one box; zero required fields; saves on ⌘/Ctrl+Enter.

### AI results
- AI results arrive asynchronously and animate in calmly (no spinner-blocking); each carries a ProvenanceBadge + ConfidenceMeter (DP-005). Directive language is impossible by construction (post-filter); the UI has no "recommended" styling (DP-001).

### Decision controls
- The seven outcomes are presented as **equal-weight, neutral** controls — same size, same color, alphabetical/logical order — so the UI never nudges toward "Build Now".

### Navigation
- Graph is home; a slim left rail links Dashboard, Search, Alerts, Timeline, Settings. Node detail opens as a side sheet over the graph (context preserved, US-008 AC-2/US-009 AC-2).

### Empty / loading / error / degraded
- See the per-screen state matrix (§9). Degraded (AI provider down) is first-class: capture + graph keep working; AI panels show "analysis pending", never a hard error (NFR-003 / §11 graceful degradation).

---

## 7. Per-Screen Details (representative)

### SCR-002 — Capture
**Route:** /capture (also modal via ⌘K) · **Stories:** US-001, US-002, US-026 · **Layout:** centered single field
**Components:** mic button, text box, "Save idea", offline/pending indicator
**States:** empty (prompt "What's on your mind?") · submitting (inline, non-blocking) · success (toast + box clears) · error (inline, retains text) · degraded (offline → "Saved locally, will sync")
**Accessibility:** mic button labeled + state announced (aria-pressed); text box is the default focus.
**Mockup:**
```
+--------------------------------------------+
|   What's on your mind?                      |
|  +--------------------------------------+   |
|  |                                      |   |
|  |  (type, or press the mic)            |   |
|  +--------------------------------------+   |
|   [ 🎤 ]                     [ Save idea ]   |
|   ⌘+Enter to save · zero required fields    |
+--------------------------------------------+
```

### SCR-009 — Reality Check & Decision
**Route:** /ideas/:id/decide · **Stories:** US-014, US-015, US-025 · **Layout:** evidence list (left) + neutral decision controls (right/bottom)
**Components:** EvidenceItem rows (each with ProvenanceBadge + ConfidenceMeter), optional rationale field, seven equal-weight outcome buttons
**States:** loading (skeleton evidence rows) · populated (top-3 evidence, expand for more — progressive disclosure) · partial (some evidence still computing) · degraded (AI down → cached/structural evidence only, clearly labeled) · error
**Accessibility:** evidence rows are a list; each provenance badge links to its source idea and is announced.
**Mockup:**
```
+------------------ Reality Check ------------------+
| ⚠ Duplicates "Caching layer v2"   88%  [source]  |
| ⏳ Expected delay to current build  ~21 days [src]|
| 🧩 Existing OSS covers ~80%          conf: med [src]|
| 🌱 Supports 3 future ideas           [sources]    |
|  ... show 4 more                                  |
+---------------------------------------------------+
| Your decision (the system does not choose):       |
| [Build now] [Schedule] [Incubate] [Delegate]      |
| [Archive]   [Merge]    [Reject]                   |
| Rationale (optional): [________________________]  |
+---------------------------------------------------+
```

### SCR-001 — Graph Home
**Route:** / · **Story:** US-009 · **Layout:** full-bleed WebGL canvas + floating controls + left rail
**States:** empty (new user → import/onboarding hero, NOT blank canvas — R-003) · loading (skeleton + progressive node fade-in) · populated · partial (large graph streaming) · degraded · error
**Accessibility:** "View as tree" toggle exposes the keyboard/SR-navigable alternative (§4).

---

## 8. Prototype Verification & Usability Validation  *(MP-02 — required Tier 3)*

```yaml
fidelity_ladder:
  L0_wireframe:  "this spec (§7)"
  L1_prototype:  "clickable Figma prototype of J-1 onboarding and J-2 capture->decision, BEFORE the first UI build sprint"
  L2_components: "coded components in Storybook, visual-regression baselined (graph canvas, ProvenanceBadge, EvidenceItem, decision controls)"
  L3_staging:    "real app on staging with a seeded graph (alpha/dogfood)"

usability_test:
  when: "on the L1 prototype, before graph.S2 (the first heavy UI sprint)"
  participants: ">=3 representative builders (founder + researcher + engineer personas) + 1 prospective buyer"
  tasks: "map to spec_02 journeys J-1 (onboard + seed) and J-2 (capture -> Reality Check -> decision)"
  success_thresholds:
    task_completion: ">=4 of 5 complete each core task unaided"
    comprehension: "users state IdeaOS's value (decide what to build, not track tasks) in their own words"
    safety_critical: "100% correctly read the decision step as THEIRS — no user reports the app 'told them what to build' (validates DP-001 / NFR-010 at the UX layer)"
  failure_handling: "redesign + re-test a failing surface BEFORE its build sprint opens"
```

> **Verification separation:** prototype usability (right thing) → component a11y/visual-regression (built right) → E2E (behaves right) → staging dogfood (works with real data). The non-directive promise (NFR-010) is validated *twice*: at the UX layer here, and at the model layer by the eval harness (spec_04 §11.4).

---

## 9. Per-Screen State Matrix  *(MP-03)*

| State | Requirement (applies to data-bearing screens) |
|---|---|
| loading | skeleton matching final layout (graph: progressive node fade; lists: row skeletons) — not a bare spinner |
| empty | meaningful next action — capture CTA / import hero (never "no data"); onboarding hero on SCR-001 |
| populated | the §7 mockup |
| partial | large graph or evidence still streaming — show what's ready + a "computing…" affordance |
| error | inline-at-source + retry; never a dead end |
| degraded | AI/embedding provider down — capture + graph keep working; AI panels read "analysis pending", clearly labeled (graceful degradation) |
| stale | snapshot/score older than its freshness NFR shows a "last computed" indicator |

`not_all_apply: SCR-016/017/019 (auth) have no degraded/stale state; SCR-005/014 (read views) have no submitting state.`

---

## 10. Content & Copy Library  *(MP-04)*

- i18n-ready message catalog; **no hardcoded user-facing strings** (en-US v1.0, structured for later locales).
- **Every spec_04 error code maps to a human string** (e.g., `AI_PROVIDER_UNAVAILABLE` → "Analysis is paused while our reasoning service is unavailable — your idea is saved and will be analyzed automatically."). Errors never leak provider/internal detail.
- **Voice/tone:** reflective, calm, second-person, never imperative about decisions. Banned phrasing (lint-checked in copy review): "you should", "we recommend", "best choice", "do this now". This is the copy-layer expression of DP-001 / NFR-010.
- Glossary terms (spec_01 §10) used consistently: "idea", "twin", "activation condition", "Reality Check", "Archaeology".

---

## 11. Design Handoff & Tokens  *(MP-05)*

- Tokens are **source-of-truth in code** (`tokens.json`, W3C format) → generate the Tailwind/CSS theme + Figma variables (one direction: code → design tool).
- **"No magic numbers" lint:** any color/spacing outside the token set fails CI.
- **Design QA in CI:** visual-regression baseline (Storybook + Playwright snapshots) on the graph canvas, ProvenanceBadge, EvidenceItem, and the decision controls; token lint; reduced-motion snapshot.

---

## 12. Approval

```yaml
approval:
  facilitator: "Muquaddar"
  reviewers:
    - { name: "Muquaddar", role: ux, decision: approved }
    - { name: "Muquaddar", role: product, decision: approved }
    - { name: "Muquaddar", role: a11y, decision: approved }
  approver: "Muquaddar"
  approved_at: "2026-06-29"
  git_tag: null
  forge_submission_id: null
```

---

## Tier Variations

- **Tier 3 (this project)**: Full per-screen details; WCAG 2.2 AA on all screens; founder reviews as accessibility lead; prototype usability validation (§8) required before the first heavy UI sprint.

---

## Quality Bar (SK.G3 — Design side)

- [x] Every Must-have user story has ≥ 1 screen (§2 traceability)
- [x] Design system approach declared (adapt) with rationale
- [x] Accessibility target ≥ WCAG 2.2 AA + graph alternative view
- [x] Responsive strategy explicit
- [x] Empty/loading/error states per screen (§9)
- [x] Per-screen 7-state matrix applied (§9)
- [x] Prototype verification & usability plan (§8) — validates non-directive promise at UX layer
- [x] Content/copy library (§10) — every spec_04 error code mapped; directive phrasing banned
- [x] Design handoff: tokens single-source + design QA in CI (§11)
- [x] Touch targets ≥ 44×44px declared
