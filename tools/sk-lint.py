#!/usr/bin/env python3
"""sk-lint — SK spec-set consistency linter (the "manual Forge").

Checks the invariants in SK-CONSISTENCY-RULES.md against a project's spec_01..spec_07.
Usage:  python3 sk-lint.py <project_dir>
Exit 0 if no FAILs; non-zero otherwise. WARN/INFO do not affect exit code.
"""
import sys, re, os, glob
try:
    import yaml
except ImportError:
    print("needs pyyaml: pip install pyyaml"); sys.exit(2)

FAILS = []; WARNS = []; INFOS = []
def fail(m): FAILS.append(m)
def warn(m): WARNS.append(m)
def info(m): INFOS.append(m)

def load(specdir):
    files = {}
    for n in range(1, 8):
        g = sorted(glob.glob(os.path.join(specdir, f"spec_0{n}_*.md")))
        if g:
            files[n] = (os.path.basename(g[0]), open(g[0], encoding="utf-8").read())
    return files

def frontmatter(text):
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not m: return {}
    try: return yaml.safe_load(m.group(1)) or {}
    except Exception: return {}

def yaml_blocks(text):
    out = []
    for m in re.finditer(r'```yaml\n(.*?)```', text, re.S):
        try:
            o = yaml.safe_load(m.group(1))
            if o is not None: out.append(o)
        except Exception: pass
    return out

def named_block(text, name):
    """Return the value of a top-level mapping key `name` from any ```yaml block
    (e.g. fr_moscow:, nfr_moscow:). Handles the block being wrapped under that name."""
    for o in yaml_blocks(text):
        if isinstance(o, dict) and name in o and isinstance(o[name], dict):
            return o[name]
    return None

def ids(text, prefix):
    return re.findall(rf'\b({prefix}-\d+)\b', text)

def idset(text, prefix):
    return set(ids(text, prefix))

def nums(idlist):
    return sorted(int(x.split('-')[1]) for x in idlist)

def report_gaps(label, idlist):
    if not idlist: return
    ns = nums(set(idlist))
    if not ns: return
    full = set(range(ns[0], ns[-1] + 1))
    gaps = sorted(full - set(ns))
    if gaps:
        warn(f"R2 {label}: numbering gaps {['%03d' % g for g in gaps]} (max {ns[-1]:03d}) — ok if deferred/retired")

# ---------------------------------------------------------------- load
if len(sys.argv) < 2:
    print("usage: python3 sk-lint.py <project_dir>"); sys.exit(2)
specdir = sys.argv[1]
F = load(specdir)
if not F:
    print(f"no spec_0N_*.md found in {specdir}"); sys.exit(2)
present = ",".join(f"spec_0{n}" for n in sorted(F))
info(f"specs found: {present}")

def txt(n): return F[n][1] if n in F else ""

# ---------------------------------------------------------------- R0 project.yaml index (if present)
proj = None
ppath = os.path.join(specdir, "project.yaml")
if os.path.exists(ppath):
    try: proj = yaml.safe_load(open(ppath, encoding="utf-8").read()) or {}
    except Exception as e: warn(f"R0: project.yaml unparseable: {e}")
if proj:
    declared = proj.get("specs") or {}
    for n, (fn, t) in F.items():
        fm = frontmatter(t)
        key = re.sub(r'\.md$', '', fn)
        d = declared.get(key) or declared.get(fm.get("name", ""))
        if d and str(d.get("version")) != str(fm.get("version")):
            fail(f"R0 project.yaml: {key} version {d.get('version')} != spec frontmatter {fm.get('version')} (stale index)")
    info("R0: project.yaml present (id registry: " + ", ".join(f"{k}={v}" for k, v in (proj.get('id_registry') or {}).items()) + ")")
else:
    info("R0: no project.yaml index (recommended — spec_00)")

# ---------------------------------------------------------------- R1 gate-lock guard
# The guard catches *accidental* locks while specs are being drafted/amended. A
# *deliberate* governor approval is legitimate: declare it in project.yaml under
# project.lock.intentional: true and the guard reports the lock (info) instead of
# failing. Without that declaration, any non-draft/approved state is still a FAIL.
_lk = ((proj or {}).get("project") or {}).get("lock") or {}
LOCKED = bool(_lk.get("intentional"))
if LOCKED:
    info(f"R1: intentional gate lock declared in project.yaml "
         f"(locked_by={_lk.get('locked_by')}, at={_lk.get('locked_at')}, method={_lk.get('method')}"
         + (", multi_voice_waived" if _lk.get("multi_voice_waived") else "") + ")")
for n, (fn, t) in F.items():
    fm = frontmatter(t)
    st = str(fm.get("status", "")).lower()
    if st and st not in ("draft",):
        if LOCKED and st == "approved":
            info(f"R1 {fn}: status='{fm.get('status')}' (locked — declared in project.yaml)")
        else:
            fail(f"R1 {fn}: status='{fm.get('status')}' (expected draft — accidental lock?)")
    cons = fm.get("consensus") or {}
    if isinstance(cons, dict):
        cst = str(cons.get("status", "pending")).lower()
        if cst not in ("pending", ""):
            if LOCKED and cst.startswith("approved"):
                info(f"R1 {fn}: consensus.status='{cons.get('status')}' (locked)")
            else:
                fail(f"R1 {fn}: consensus.status='{cons.get('status')}' (expected pending)")
    appr = None
    for blk in yaml_blocks(t):
        if isinstance(blk, dict) and blk.get("approval"):
            a = blk["approval"]
            if isinstance(a, dict) and a.get("approved_at"):
                appr = a.get("approved_at")
    if appr and not LOCKED:
        fail(f"R1 {fn}: approval.approved_at is set ({appr}) — gate locked")

# ---------------------------------------------------------------- ID sets
FRs  = idset(txt(3), "FR")
NFRs = idset(txt(3), "NFR")
USs  = idset(txt(2), "US")
Ts   = idset(txt(6), "T")
LCs  = idset(txt(7), "LC")

# ---------------------------------------------------------------- R2 ID integrity (dups + gaps)
# duplicate T-NNN *definitions* in spec_06
tdefs = re.findall(r'-\s*id:\s*(T-\d+)', txt(6))
dups = sorted({x for x in tdefs if tdefs.count(x) > 1})
if dups: fail(f"R2 spec_06: duplicate T-NNN definitions {dups}")
for label, s in (("FR", FRs), ("NFR", NFRs), ("US", USs), ("T", set(tdefs) or Ts), ("LC", LCs)):
    report_gaps(label, s)
maxima = {"FR": max(nums(FRs) or [0]), "NFR": max(nums(NFRs) or [0]), "US": max(nums(USs) or [0]),
          "T": max(nums(set(tdefs) or Ts) or [0]), "LC": max(nums(LCs) or [0])}
info(f"ID maxima — FR:{maxima['FR']:03d} NFR:{maxima['NFR']:03d} US:{maxima['US']:03d} "
     f"T:{maxima['T']:03d} LC:{maxima['LC']:03d}")
if proj:  # R0: id_registry next_* must be > current max
    reg = proj.get("id_registry") or {}
    for fam, mx in maxima.items():
        nxt = reg.get(f"next_{fam}")
        if nxt:
            try: nv = int(str(nxt).split('-')[1])
            except Exception: nv = None
            if nv is not None and nv <= mx:
                fail(f"R0 project.yaml id_registry.next_{fam}={nxt} but max {fam} in specs is {mx:03d} (registry stale/collision)")

# ---------------------------------------------------------------- R3 MoSCoW prose<->YAML (spec_03)
s3 = txt(3)
def section_frs(header_re):
    m = re.search(header_re, s3)
    if not m: return None
    start = m.end()
    nxt = re.search(r'\n##+ ', s3[start:])
    seg = s3[start:start + (nxt.start() if nxt else len(s3) - start)]
    return set(re.findall(r'\bFR-\d+\b', seg))
prose = {
    "must":   section_frs(r'###\s*Must\s*\('),
    "should": section_frs(r'###\s*Should\s*\('),
    "could":  section_frs(r'###\s*Could\s*\('),
    "wont":   section_frs(r"###\s*Won't\s*\("),
}
fr_moscow = named_block(s3, "fr_moscow")
if fr_moscow is None:
    warn("R3 spec_03: fr_moscow YAML block not found")
else:
    for tier in ("must", "should", "could", "wont"):
        py = set(prose.get(tier) or [])
        yl = set(fr_moscow.get(tier) or [])
        if prose.get(tier) is None:
            warn(f"R3 spec_03: prose '{tier}' table not found")
            continue
        only_prose = py - yl
        only_yaml = yl - py
        if only_prose: fail(f"R3 spec_03 {tier}: in prose table but not fr_moscow YAML: {sorted(only_prose)}")
        if only_yaml:  fail(f"R3 spec_03 {tier}: in fr_moscow YAML but not prose table: {sorted(only_yaml)}")
    # FR in two tiers
    allt = {}
    for tier in ("must", "should", "could", "wont"):
        for fr in (fr_moscow.get(tier) or []):
            allt.setdefault(fr, []).append(tier)
    multi = {k: v for k, v in allt.items() if len(v) > 1}
    if multi: fail(f"R3 spec_03: FR in multiple MoSCoW tiers: {multi}")

# ---------------------------------------------------------------- R4 header counts
def headline_int(text, pat):
    m = re.search(pat, text)
    return int(m.group(1)) if m else None
hdr_fr = headline_int(s3, r'(\d+)\s+Functional Requirements')
hdr_nfr = headline_int(s3, r'(\d+)\s+Non-Functional Requirements')
if hdr_fr is not None and hdr_fr != len(FRs):
    fail(f"R4 spec_03: header says {hdr_fr} FRs; counted {len(FRs)} distinct FR-IDs")
if hdr_nfr is not None and hdr_nfr != len(NFRs):
    fail(f"R4 spec_03: header says {hdr_nfr} NFRs; counted {len(NFRs)} distinct NFR-IDs")
m = re.search(r'MoSCoW \(FRs\):\s*(\d+)\s*Must\s*/\s*(\d+)\s*Should\s*/\s*(\d+)\s*Could\s*/\s*(\d+)\s*Won', s3)
if m and fr_moscow:
    claim = dict(zip(("must","should","could","wont"), map(int, m.groups())))
    for tier in claim:
        actual = len(fr_moscow.get(tier) or [])
        if claim[tier] != actual:
            fail(f"R4 spec_03 header MoSCoW {tier}={claim[tier]} but fr_moscow has {actual}")
# spec_02 story counts
s2 = txt(2)
story_hdrs = re.findall(r'^####\s+(US-\d+)\s+—.*?—\s*\*\*(Must|Should|Could)\*\*', s2, re.M)
by = {"Must":0,"Should":0,"Could":0}
for _id, tier in story_hdrs: by[tier]+=1
hdr_stories = headline_int(s2, r'(\d+)\s+stories across')
if hdr_stories is not None and hdr_stories != len(story_hdrs):
    warn(f"R4 spec_02: header says {hdr_stories} stories; counted {len(story_hdrs)} story headers")
m2 = re.search(r'MoSCoW \(stories\):\s*(\d+)\s*Must\s*/\s*(\d+)\s*Should\s*/\s*(\d+)\s*Could', s2)
if m2:
    claim = dict(zip(("Must","Should","Could"), map(int, m2.groups())))
    for tier in claim:
        if claim[tier] != by[tier]:
            warn(f"R4 spec_02 stories {tier}={claim[tier]} but counted {by[tier]} headers")

# ---------------------------------------------------------------- R5 Must-FR build coverage
s6 = txt(6)
if fr_moscow:
    uncovered = [fr for fr in (fr_moscow.get("must") or []) if fr not in s6]
    if uncovered: fail(f"R5: Must FRs with NO reference anywhere in spec_06: {sorted(uncovered)}")

# ---------------------------------------------------------------- R6 cross-ref resolution (spec_06 -> 02/03)
ref_frs  = set(re.findall(r'\bFR-\d+\b', s6))
ref_nfrs = set(re.findall(r'\bNFR-\d+\b', s6))
ref_us   = set(re.findall(r'\bUS-\d+\b', s6))
dangling_fr  = ref_frs  - FRs
dangling_nfr = ref_nfrs - NFRs
dangling_us  = ref_us   - USs
if dangling_fr:  fail(f"R6 spec_06 references FRs not in spec_03: {sorted(dangling_fr)}")
if dangling_nfr: fail(f"R6 spec_06 references NFRs not in spec_03: {sorted(dangling_nfr)}")
if dangling_us:  fail(f"R6 spec_06 references US not in spec_02: {sorted(dangling_us)}")

# ---------------------------------------------------------------- R7 PEAS completeness
peas_missing = []
for m in re.finditer(r'^####\s+(US-\d+)\b(.*?)(?=^####\s+US-|\Z)', s2, re.M | re.S):
    sid, body = m.group(1), m.group(2)
    if 'peas:' not in body and '```peas' not in body and 'peas:' not in body.lower():
        peas_missing.append(sid)
if peas_missing: warn(f"R7 spec_02: stories without a peas block: {sorted(set(peas_missing))}")

# ---------------------------------------------------------------- R8 CRITICAL NFR enforcement
nfr_moscow = named_block(s3, "nfr_moscow")
crit = (nfr_moscow.get("critical") if isinstance(nfr_moscow, dict) else None) or []
s7 = txt(7)
for c in crit:
    if c not in s7: warn(f"R8: CRITICAL {c} not referenced in spec_07 launch criteria")
    if c not in s6: warn(f"R8: CRITICAL {c} not referenced in spec_06 build")

# ---------------------------------------------------------------- R9 amendment build_coverage
for n, (fn, t) in F.items():
    fm = frontmatter(t)
    for am in (fm.get("amendments") or []):
        bc = str(am.get("build_coverage", "") or "")
        for tref in re.findall(r'\bT-\d+\b', bc):
            if tref not in set(tdefs):
                fail(f"R9 {fn} {am.get('id')}: build_coverage cites {tref} not defined in spec_06")

# ---------------------------------------------------------------- R10 diagram set
manifest = os.path.join(specdir, "diagrams", "manifest.psv")
if os.path.exists(manifest):
    rows = [l.split("|") for l in open(manifest).read().splitlines() if l.strip()]
    gates = {r[1] for r in rows if len(r) > 1}
    files_by_gate = {}
    for r in rows:
        if len(r) >= 4: files_by_gate.setdefault(r[1], []).append(r[0])
    if "SK.G2" in gates and not any("journey" in f for f in files_by_gate.get("SK.G2", [])):
        warn("R10: SK.G2 diagram set has no `journey` diagram")
    if "SK.G3" in gates and not any(("er" in f or "data-model" in f) for f in files_by_gate.get("SK.G3", [])):
        warn("R10: SK.G3 diagram set has no ER diagram")
    info(f"R10: diagram manifest covers gates {sorted(gates)} ({len(rows)} diagrams)")
else:
    info("R10: no docs/diagrams/manifest.psv (diagram review not set up)")

# ---------------------------------------------------------------- report
def section(title, items):
    if items:
        print(f"\n{title} ({len(items)})")
        for it in items: print(f"  - {it}")
print("=" * 70)
print(f"sk-lint — {specdir}")
print("=" * 70)
section("INFO", INFOS)
section("WARN", WARNS)
section("FAIL", FAILS)
print("\n" + "-" * 70)
print(f"RESULT: {'FAIL' if FAILS else 'PASS'}  ({len(FAILS)} fail, {len(WARNS)} warn)")
sys.exit(1 if FAILS else 0)
