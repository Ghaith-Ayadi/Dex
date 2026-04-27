# Dex — steps log

A running record of what we worked on. Hierarchical: H1 = phase, H2 = topic, H3 = decision/output.

---

# Day 1 — 2026-04-25 — Thesis, matcher design, 32-slide test

## Project orientation
First contact. User shared the landing page (https://www.ayadighaith.com/Dex). Saved Dex as a project memory: a headless presentation tool, currently in planning, repo empty.

## Initial design discussion
User asked for deep collaboration. Framing: pagination on headings + dividers is mostly a port from sibling project Hemingway. The hard problem is **mapping markdown → a 50–100 TSX template library**.

### Tensions surfaced
- Strictness of fit (does a 3-section template accept 2 or 4?)
- Determinism vs. choice
- Where the template decision lives (frontmatter, sidecar, or recomputed every render)
- No-fit fallback behavior
- Image semantics (markdown-only vs. directives)

## Positioning locked in
User clarified Dex is a **brand governance tool for heads of design**, not a PowerPoint replacement for everyone.

### Customer / user split
- **Customer (buyer):** Head of Design — curates the TSX template library
- **End-user:** employee — writes markdown only
- Escape hatch: **detach** → absolute positioning, frowned upon but available

### Constraints
- **No AI** in matching — pure structural matching only
- **No PPTX export** — principled, part of the moat
- **MVP scope:** 50–100 seed TSX templates, no theming, manual edits via Claude

### Match UX
- Each slide gets *n perfect matches* + *m partial matches* (with mod indicators)
- User picks; choice is sticky
- Detach is non-destructive: latest pick stays in JSON with `detached: true`

## Two thesis options on the table
- **Thesis A** — "All presentations are essentially markdown" (universal)
- **Thesis B** — "Presentations for engineers" (narrower niche)
- Decision: test via early prototypes, not philosophy

## Storage model
1 deck = 1 file. Markdown content + appended JSON state block.

### Refinements
- Slash commands as **editor UI affordance**, NOT inline DSL in persisted markdown
- Markdown = what you say; JSON = how it looks
- Separator format **TBD** — fenced ` ```dex ` block preferred (avoids `---` ambiguity)
- Detach → re-attach is deterministic given the same matcher rules

## Nested lists as organizing primitive (linchpin)
User proposed nested lists; reframed as a deeper claim:

### A slide is a tree
- Markdown headings + nested lists encode the tree
- Templates are tree-shape *acceptors*
- Matcher = tree-shape *comparison*: signature `(depth, branching factor, leaf type, density)`

### Gotchas surfaced
- Heterogeneous siblings need per-slot type tolerance
- Interleaved non-list content (intro/outro paragraphs)
- Depth ambiguity (sub-bullet = sub-section or detail?)
- Leaf size/density matters
- Non-tree forms (mind maps, cycles) — constrain out of v1

## 32-slide thesis test
User instructed: find real beefy decks online, convert slides to nested-list markdown.

### Sources downloaded
- Airbnb 2008 pitch deck (14 slides) — startup pitch
- UN SDG Report 2025 — global policy
- WEF Global Risks Report 2025 — corporate / mixed
- SDG Sustainable Development Report 2025 — global / index-heavy
- McKinsey + BCG returned access-denied; substituted with WEF + SDG

### Results
**34 slides converted.** Saved to `experiment-decks/RESULTS.md`. Distribution:
- ✅ Clean: 23 (68%)
- 🟡 Strained: 8 (24%) — multi-series charts need typed blocks
- 🟠 Forced: 1 (3%) — needs image directives
- 🔴 Broke: 2 (6%) — 2x2 quadrant + network graph

### Findings
- Same handful of tree shapes recur constantly (Airbnb 14 slides ≈ 4 shapes)
- "Bold-lead + body" is the workhorse leaf type
- Charts split into single-series (markdown captures) vs. multi-series (typed block)
- **Verdict on Thesis A: ~95% alive**

### Side-by-side comparison viewer
- Built `experiment-decks/comparison.html`
- 39 PDF pages extracted via pdftoppm/poppler
- Inlined as base64 (`slides-data.js`, 5.3MB) after relative paths failed in preview
- Per-slide toggle: markdown source / rendered

### 20 synthetic test slides (Section E)
Vary branching (1, 2, 3, 4, 5, 6, 8), depth (1, 2, 3), leaf type, content volume. Includes intentional edge cases:
- E15 mixed collage → forced (image directives)
- E18 mind-map → broke (graph topology)
- E9 funnel, E10 hero stat, E19 stat-with-breakdown → strained (visual magnitudes)

---

# Day 2 — 2026-04-26 — Side trip and persistence

## Van Gogh familiarization
Read sibling project at `/Users/ghaithayadi/code/Van Gogh/`. Interactive React-illustration design workbench with custom Figma export (BVG serializer). React 18 + Vite + Framer Motion. Actively developed; no direct code link to Dex.

## Conversation persistence
Set up running record:
- `steps.md` (this file) — hierarchical, decisions and milestones, non-verbatim
- `.claude/Convo.md` — compact verbatim conversation (gitignored), generated from JSONL transcript
- `.gitignore` — added for downstream git init

## Steps logging automated globally
Promoted the manual logging convention into a global, automatic system across all projects.

### Built `steps` global skill
Created `~/.claude/skills/steps/SKILL.md`. Skill applies inclusion/exclusion judgment (skip typos, acks, inline error fixes; include decisions, artifacts, insights) and picks H1/H2/H3 by importance, biased to the lowest that fits. Also regenerates `.claude/Convo.md` from the session JSONL.

### Wired Stop hook with loop guard
Added Stop hook to `~/.claude/settings.json` that runs `~/.claude/hooks/steps-trigger.py`. Script scans the transcript tail for a recent `Skill(skill="steps")` tool_use; exits silently if found, otherwise emits `decision:block` with a reason that re-prompts Claude to invoke `/steps`. Pipe-tested both branches; hook fired live this session, confirming wiring.
