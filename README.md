# Dex

A headless presentation tool. Pick a template, fill the form, watch the slide draw itself.

**Editor** — sidebar of templates, generated form on the left, live slide preview on the right. Click any text on the slide to put a cursor in the matching input; drag to select; arrow keys move the caret in both places at once.

![Dex editor](docs/screenshot-editor.png)

**Template gallery** — every template rendered with its canonical sample so you can scan the library at a glance.

![Template gallery](docs/screenshot-templates.png)

**Thesis test bench** — 54 real-world and synthetic slides side-by-side with their nested-list mdex, color-coded by fit (clean / strained / forced / broke). The original "all presentations are essentially markdown" experiment. Frozen but kept in the repo — see below.

![Thesis test bench](docs/screenshot-test.png)

## How it works

You pick a template from the sidebar. The middle pane becomes a form generated from that template's schema — text inputs, textareas, repeating list groups with `min`/`max` constraints, toggles. The right pane renders the slide live with your values, redrawing on every keystroke.

The interesting part is the **contextual highlighting**:

- **Hover** any text on the slide → I-beam cursor.
- **Click** at a position → the matching input gets focused and the caret lands at the *same character offset* you clicked. A simulated blinking caret appears in the slide, mirroring the input's real cursor.
- **Drag-select** a word → the same range is selected in the input, and a translucent overlay in the slide shows the same selection.
- **Arrow / Shift+Arrow / Home / End / Cmd+Arrow** in the input → the slide caret follows in the same frame. The input is the real focus owner; the slide overlay just observes the input's `selectionStart`/`End`.

It feels like one continuous editing surface, even though the typing happens in the input.

When a template has a list (cards, steps, quotes, members…), hovering any item shows a dashed `+` ghost slot at the end of the list. Click → a new item is added with placeholder text, the first input is focused, and its content is selected so your first keystroke overwrites it. The schema's `min`/`max` enforce constraints from both ends (Add disables at max, Trash disables at min).

## Architecture

```
form schema                                  template (TSX, pure)
    │                                              │
    ▼                                              ▼
FormRenderer ──→ formProps ──────────────→ Slide rendering
                    │                              │
                    └──→ data-form-path on inputs  └──→ <Trace path="..."> on text leaves
                              │                              │
                              ▼                              ▼
                        ─── PreviewCaretOverlay ───
                            (selectionchange ↔ DOM rects)
```

- **Templates** — 21 layout components in `src/templates/`. Each is a pure function of typed props with a co-located `canonical` sample. Every text leaf is wrapped with `<Trace path="...">`; decorative chrome (numbered indices, badges, dividers) is intentionally untraced.
- **`<Trace>` primitive** — a `<span>` with `display: contents` that stamps `data-form-path` on the wrapped element without affecting layout. Click resolution is just `e.target.closest('[data-form-path]')` — deterministic, no text matching.
- **Form schemas** — per-template entries in `src/forms/schemas.ts`, expressed as a small `FieldSchema` union (text / textarea / select / toggle / group / list). `<FormRenderer>` walks the schema and renders the matching form UI. List items use `$self` for primitive items (e.g. `bullets: string[]`).
- **`<PreviewCaretOverlay>`** — listens to `selectionchange` + `focusin/out` + `input` on the document, reads the active input's path + selection range, finds the matching `<Trace>`, walks text nodes to find the visual rect, writes `transform: translate(...)` directly to overlay refs. No React state in the keystroke hot path.
- **`<AddGhostSlot>`** — dashed `+` placeholder at the end of each list. Hidden by default; appears on `group/ghost` parent hover. Click calls back to the editor with the list path; the editor builds a default item from the schema and inserts it.

## The original thesis (frozen)

Dex started with a stronger claim: **all presentations are essentially markdown**. The repo still contains the full pipeline — `parseMdex` (a `marked.lexer()` token walker), `SlideShape` (structured representation), per-template `adapt(shape) → props` adapters, and a rule-based `Matcher` that ranks templates against any shape with no AI. The 54-slide bench at `/test` validated that claim at ~95% on a corpus of real-world decks (Airbnb pitch, UN SDG, WEF Global Risks, BCG-style reports + 20 synthetic shapes).

The current authoring surface is forms instead. **Same data model, different on-ramp.** A template + props produces a slide regardless of how the props get there. The mdex code is paused, not deleted — it lives in `src/mdex/` and the test bench is still browsable at `/test`. The form path needed to land first because it tightens the feedback loop dramatically; the markdown path can come back as a sibling input mode once the matching/contextual-highlighting story is solid.

## Stack

- React 19, TypeScript 5.9 strict
- Vite 8, Tailwind CSS v4.2 with semantic design tokens
- React Aria Components for primitives
- `marked` for the (currently frozen) mdex lexer
- Plus Jakarta Sans + Inter via Google Fonts

## Setup

```bash
npm install
npm run dev
```

Opens on `http://localhost:6173`. Routes:

- `/` — editor (sidebar templates · resizable form/preview · contextual highlighting)
- `/templates` — gallery of all 21 templates with their canonical samples
- `/test` — the 54-slide thesis test bench (frozen)

## Project structure

```
src/
├── templates/
│   ├── _primitives/         # Slide, ScaledSlide, Kicker, Title, Trace, AddGhostSlot, ...
│   ├── <id>/index.tsx       # 21 templates
│   └── index.ts             # registry: id, name, category, component, canonical
├── forms/
│   ├── schema.ts            # FieldSchema union + path helpers (get/set/listInsert)
│   ├── schemas.ts           # per-template form schemas
│   └── form-renderer.tsx    # generic form generator with min/max, $self, list pool
├── components/
│   ├── nav/header.tsx       # router nav + Basic/Fun flavor toggle
│   ├── split-pane/          # pointer-driven resizable split
│   └── preview-caret/       # <PreviewCaretOverlay> — caret + selection sync
├── mdex/                    # FROZEN: parseMdex, SlideShape, adapt, matcher
├── pages/
│   ├── home-screen.tsx      # editor (sidebar + form + preview + caret overlay)
│   ├── template-gallery.tsx
│   └── test-bench.tsx       # iframes the static thesis-test viewer
├── providers/
│   └── flavor-provider.tsx  # basic | fun, persisted to localStorage
└── styles/
    ├── globals.css          # cursor: text on traced spans; caret-blink keyframes
    ├── theme.css            # Genesis tokens (neutral)
    ├── flavors.css          # [data-flavor="fun"] orange + Plus Jakarta overrides
    └── typography.css

.claude/skills/creating-slides/SKILL.md   # project skill: how to add a new template
public/test-bench/                         # static viewer for the 54-slide thesis test
experiment-decks/                          # source PDFs + RESULTS.md from the thesis test
```

## Vocabulary

- **Trace** — a wrapper that stamps `data-form-path` on a slide leaf for contextual highlighting; renders as a `display: contents` span (no layout effect).
- **f100** — the curated TSX template library this becomes (currently 21).
- **b100** — the curated benchmark mdex corpus used to score rulesets (planned; the existing 54-slide bench is the proof of concept).
- **ruleset** — versioned bundle of paginator + Matcher + extensions (currently a single in-tree default; frozen with the rest of the mdex pipeline).
- **flex param** — per-template flexibility lever (zoom, hide-decoration, etc.) used by the Matcher to score "fit" as `Fit (X of N)` (planned).
- **canonical** — the proof-of-validity sample every template ships with; doubles as gallery thumbnail and form initial state.

## Status

v0, live at https://dex-swart-ten.vercel.app/.

Shipped:
- 21 templates with form schemas, contextual highlighting, ghost-add affordances
- Live preview ↔ form bidirectional caret/selection sync
- Two flavors (Basic / Fun), persisted
- Resizable editor split, scaled-slide preview
- Test bench at `/test` validating the original thesis at ~95%

Not yet shipped:
- Notion-like block editor (currently semantic form inputs)
- Persisted presentations (single in-memory deck)
- Flex params threaded through the Matcher score
- Image directives
- Detach / reattach for free-form layouts
- More flavors / theme tokens
- Full f100, curated b100, ruleset comparison
- The mdex path reactivated as a sibling on-ramp

## License

TBD.
