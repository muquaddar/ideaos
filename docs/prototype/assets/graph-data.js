/* IdeaOS prototype — seed dataset (shared by every screen).
   Reuses the vision's own lineage: StoryLoom -> Character System -> Human DNA ->
   Validation -> Character Sheets -> Blender Extension -> IdeaOS, plus Sam's
   "Caching layer v2" with an 88% twin to demo duplicate detection.
   This is mock data for an L1 clickable prototype — no backend, no live LLM. */

window.IDEAOS = (function () {
  // Build-status palette mirrors spec_05 design tokens (status_* + icon, never color alone).
  const STATUS = {
    building:   { label: "Building",   color: "var(--status-build)",    icon: "▶" },
    incubating: { label: "Incubating", color: "var(--status-incubate)", icon: "◐" },
    scheduled:  { label: "Scheduled",  color: "var(--status-schedule)", icon: "◷" },
    research:   { label: "Researching",color: "var(--status-research)",  icon: "?" },
    archived:   { label: "Archived",   color: "var(--status-archive)",  icon: "▢" },
    complete:   { label: "Complete",   color: "var(--status-complete)", icon: "✓" },
    captured:   { label: "Captured",   color: "var(--status-captured)", icon: "✦" },
    rejected:   { label: "Rejected",   color: "var(--status-archive)",  icon: "✕" },
  };

  const EDGE_TYPES = {
    parent_of:       { label: "parent of",       dash: "0",   color: "var(--edge-parent)" },
    created_because: { label: "created because", dash: "0",   color: "var(--edge-parent)" },
    depends_on:      { label: "depends on",      dash: "6 4", color: "var(--edge-depend)" },
    supports:        { label: "supports",        dash: "2 4", color: "var(--edge-support)" },
    inspired_by:     { label: "inspired by",     dash: "1 5", color: "var(--edge-inspire)" },
    duplicates:      { label: "duplicates",      dash: "8 3", color: "var(--edge-twin)" },
    improves:        { label: "improves",        dash: "4 3", color: "var(--edge-support)" },
    blocks:          { label: "blocks",          dash: "6 3", color: "var(--edge-twin)" },
  };

  // x,y are pre-laid-out coordinates on a 1000x620 canvas (dependency-free, reliable).
  const nodes = [
    { id: "n1",  title: "StoryLoom",                 status: "building",   type: "necessity",    depth: 0, x: 90,  y: 300,
      origin: "Root mission — an engine for living, evolving stories.", trigger: "Wanting characters that grow across a saga.", purpose: "Generate coherent long-form narrative worlds." },
    { id: "n2",  title: "Character System",          status: "complete",   type: "necessity",    depth: 1, x: 240, y: 200,
      origin: "Stories need consistent characters across episodes.", trigger: "Characters drifted between drafts.", purpose: "A single source of truth per character." },
    { id: "n3",  title: "Human DNA",                 status: "incubating", type: "optimization", depth: 2, x: 380, y: 130,
      origin: "Characters needed a reusable, composable representation.", trigger: "Re-describing the same traits for every character.", purpose: "A shared trait/representation layer." },
    { id: "n4",  title: "Validation Engine",         status: "research",   type: "curiosity",    depth: 3, x: 520, y: 110,
      origin: "DNA traits could be internally contradictory.", trigger: "An impossible character slipped through.", purpose: "Check trait coherence before use." },
    { id: "n5",  title: "Character Sheets",          status: "scheduled",  type: "necessity",    depth: 4, x: 640, y: 170,
      origin: "Validated traits should render as usable sheets.", trigger: "Manual sheet-making was slow.", purpose: "Auto-generate character sheets from DNA." },
    { id: "n6",  title: "Blender Extension",         status: "incubating", type: "optimization", depth: 5, x: 760, y: 250,
      origin: "Sheets needed to become 3D assets.", trigger: "Twenty manual imports into Blender.", purpose: "One-click import of sheets into 3D." },
    { id: "n7",  title: "IdeaOS",                    status: "building",   type: "necessity",    depth: 6, x: 880, y: 330,
      origin: "Tooling kept spawning tooling — the real problem was deciding what to build.", trigger: "The seventh infrastructure project.", purpose: "Decide which ideas to build, and when." },
    { id: "n13", title: "Worldbuilding Lore Engine", status: "archived",   type: "curiosity",    depth: 2, x: 300, y: 320,
      origin: "Characters implied a wider world.", trigger: "A fan asked about the world's history.", purpose: "Generate lore from the character graph." },
    { id: "n10", title: "Voice Capture Module",      status: "scheduled",  type: "necessity",    depth: 7, x: 760, y: 430,
      origin: "Ideas are lost to the friction of writing them down.", trigger: "Lost a good idea in the shower.", purpose: "Capture an idea by speaking." },
    { id: "n11", title: "Knowledge Graph Store",     status: "building",   type: "necessity",    depth: 7, x: 880, y: 470,
      origin: "Ideas live in a graph, not a list.", trigger: "Lists hid the relationships.", purpose: "Persist ideas + reasoning edges." },
    { id: "n12", title: "Evidence Contract",         status: "building",   type: "necessity",    depth: 7, x: 980, y: 380,
      origin: "The AI must never tell you what to build.", trigger: "An assistant once said 'you should ship X'.", purpose: "Force evidence-only, non-directive output." },
    { id: "n14", title: "Activation Monitor",        status: "incubating", type: "optimization", depth: 7, x: 980, y: 250,
      origin: "Incubated ideas should wake on evidence.", trigger: "An idea was 'ready' but nobody noticed.", purpose: "Watch activation conditions, alert with evidence." },
    { id: "n8",  title: "Caching layer v2",          status: "complete",   type: "optimization", depth: 5, x: 470, y: 470,
      origin: "Repeated reads were slow.", trigger: "A dashboard timed out.", purpose: "A reusable caching layer." },
    // The NEW idea being captured/decided in the demo — an 88% twin of n8.
    { id: "n9",  title: "Custom cache for IdeaOS",   status: "captured",   type: "optimization", depth: 8, x: 620, y: 540,
      origin: "Graph reads felt slow while building IdeaOS.", trigger: "A 21-day-ago blocker: a slow graph query.", purpose: "Speed up graph reads in IdeaOS." },
  ];

  const edges = [
    { id: "e1",  s: "n1", t: "n2",  type: "parent_of",   reason: "Stories need consistent characters.", confidence: 0.97, confirmed: true },
    { id: "e2",  s: "n2", t: "n3",  type: "parent_of",   reason: "Characters need a reusable representation.", confidence: 0.94, confirmed: true },
    { id: "e3",  s: "n3", t: "n4",  type: "parent_of",   reason: "A representation can be incoherent — validate it.", confidence: 0.9, confirmed: true },
    { id: "e4",  s: "n4", t: "n5",  type: "parent_of",   reason: "Validated traits render as sheets.", confidence: 0.88, confirmed: true },
    { id: "e5",  s: "n5", t: "n6",  type: "parent_of",   reason: "Sheets become 3D assets.", confidence: 0.85, confirmed: true },
    { id: "e6",  s: "n6", t: "n7",  type: "inspired_by", reason: "Tooling sprawl revealed the need for an idea OS.", confidence: 0.82, confirmed: true },
    { id: "e7",  s: "n2", t: "n13", type: "parent_of",   reason: "Characters imply a wider world.", confidence: 0.8, confirmed: true },
    { id: "e8",  s: "n3", t: "n7",  type: "supports",    reason: "A shared representation is reused by IdeaOS.", confidence: 0.7, confirmed: true },
    { id: "e9",  s: "n10","t": "n7", type: "supports",   reason: "Capture is the entry point of IdeaOS.", confidence: 0.92, confirmed: true },
    { id: "e10", s: "n11","t": "n7", type: "supports",   reason: "The graph store is IdeaOS's backbone.", confidence: 0.95, confirmed: true },
    { id: "e11", s: "n12","t": "n7", type: "depends_on", reason: "IdeaOS's promise depends on non-directive output.", confidence: 0.96, confirmed: true },
    { id: "e12", s: "n7", t: "n14", type: "parent_of",   reason: "IdeaOS needs to watch activation conditions.", confidence: 0.9, confirmed: true },
    // Proposed (unconfirmed) — the twin relationship awaiting human confirmation (ADR-004).
    { id: "e13", s: "n8", t: "n9",  type: "duplicates",  reason: "Custom cache for IdeaOS is substantially the same as Caching layer v2.", confidence: 0.88, confirmed: false },
    { id: "e14", s: "n9", t: "n7",  type: "supports",    reason: "A cache would speed IdeaOS graph reads.", confidence: 0.6, confirmed: false },
  ];

  // Derivative analysis scores (0–100 normalized) with the factors that produced them.
  const scores = {
    n9: {
      depth:           { value: 8,  factors: "8 edges from the root mission (StoryLoom)." },
      leverage:        { value: 18, factors: "Only 1 future idea (IdeaOS) would benefit." },
      dependency:      { value: 22, factors: "IdeaOS does not strictly require it — graph reads are acceptable." },
      cost:            { value: 64, factors: "Re-implements caching: ~3 weeks." },
      opportunity_cost:{ value: 78, factors: "Delays the Evidence Contract (n12) by ~21 days." },
      derivative_value:{ value: 24, factors: "Low long-term strategic value; a point optimization." },
      derivative_risk: { value: 71, factors: "Adds a maintenance surface that duplicates n8." },
    },
    n7: {
      depth:           { value: 6,  factors: "6 hops from the root mission." },
      leverage:        { value: 88, factors: "5 future ideas depend on or support it." },
      dependency:      { value: 90, factors: "The mission converges here." },
      cost:            { value: 70, factors: "Large surface — the OS itself." },
      opportunity_cost:{ value: 30, factors: "Blocks little; it is the trunk." },
      derivative_value:{ value: 95, factors: "Highest strategic value in the graph." },
      derivative_risk: { value: 40, factors: "Scope-explosion risk if undisciplined." },
    },
  };

  // The Reality Check evidence set for the new idea n9 — every item cites a source (NFR-012).
  const realityCheck = {
    n9: [
      { icon: "⚠", text: "Duplicates an existing project, “Caching layer v2”.", confidence: "high",   source: { label: "n8 · 88% similar", href: "idea.html?id=n8" } },
      { icon: "⏳", text: "Expected to delay your current build by ~21 days.", confidence: "medium", source: { label: "opportunity-cost score", href: "idea.html?id=n9#derivative" } },
      { icon: "🧩", text: "Existing open-source caches already cover ~80% of this.", confidence: "medium", source: { label: "derivative analysis", href: "idea.html?id=n9#derivative" } },
      { icon: "🌱", text: "Would support 1 future idea (IdeaOS).", confidence: "high",   source: { label: "n7 · supports edge", href: "idea.html?id=n7" } },
      { icon: "🧭", text: "Originated from a 21-day-old blocker (a slow graph query) — possibly reactive, not strategic.", confidence: "low", source: { label: "captured origin", href: "idea.html?id=n9" } },
    ],
  };

  // Activation condition demo (n3 Human DNA, incubating).
  const activation = {
    n3: { kind: "structured", definition: "Activate when 3 products need a shared character representation.", met: "2 of 3 (StoryLoom, IdeaOS)", status: "incubating" },
  };

  const decisionOutcomes = [
    { id: "build_now", label: "Build now",  icon: "▶" },
    { id: "schedule",  label: "Schedule",   icon: "◷" },
    { id: "incubate",  label: "Incubate",   icon: "◐" },
    { id: "delegate",  label: "Delegate",   icon: "→" },
    { id: "archive",   label: "Archive",    icon: "▢" },
    { id: "merge",     label: "Merge",      icon: "⧉" },
    { id: "reject",    label: "Reject",     icon: "✕" },
  ];

  const byId = (id) => nodes.find((n) => n.id === id);

  return { STATUS, EDGE_TYPES, nodes, edges, scores, realityCheck, activation, decisionOutcomes, byId };
})();
