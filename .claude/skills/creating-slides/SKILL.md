---
name: creating-slides
description: Add a new slide template to the Dex f100 library. Use when the user asks to create a new slide, template, or layout. Produces a TSX component, a co-located form schema, a registry entry, and Trace + AddGhostSlot wiring so the new template participates in contextual highlighting and ghost-add affordances.
---

# Creating slides

A "slide" in Dex is a **TSX layout component** + a **form schema** + a **registry entry**. The layout is pure presentation; content flows in via typed props. The user authors content through the form pane on the left; the component renders into the slide preview on the right.

## What a slide is

```
src/templates/<id>/
└── index.tsx         # default export = component, named export = canonical
src/forms/schemas.ts  # SCHEMAS["<id>"] = form definition
src/templates/index.ts # TEMPLATES array entry
```

The component:
- Renders inside `<Slide>` (1280×720 fixed; visually scaled by `<ScaledSlide>`)
- Accepts typed props named exactly like the schema keys
- Wraps **every text leaf** with `<Trace path="...">` so contextual highlighting works
- Wraps each repeating list with `group/ghost` and ends it with `<AddGhostSlot>`
- Accepts `_onAdd?: (path: string) => void` (passed by the editor, used by `AddGhostSlot`)
- Exports a `canonical` sample with realistic content

## Success criteria

A template is "done" when **all** of these pass. Verify each before claiming success.

| # | Criterion | How to verify |
|---|---|---|
| 1 | TypeScript compiles strict | `curl -sI http://localhost:6173/src/templates/<id>/index.tsx` returns 200 with no error in Vite log |
| 2 | Renders in `/templates` gallery with canonical sample | Open `/templates`, scroll to entry, slide is visible at 16:9 with no broken layout |
| 3 | Renders in `/` editor when selected | Click the entry in the sidebar; preview pane shows the slide |
| 4 | Form schema generates a working form | Form pane shows fields in the right order; each input is editable; min/max constraints enforced (Add disabled at max, Trash disabled at min) |
| 5 | Click on any text leaf focuses the matching input | Click kicker → kicker input focused. Click each leaf type once. |
| 6 | Drag-select a substring → only that substring is selected in input | Highlight one word in the title → input has that word selected |
| 7 | Hover any list sibling → ghost "+" appears at end of list | Hover any card → dashed plus shows up; click adds a new item with placeholder text and focuses it |
| 8 | Newly added item has placeholder text and is selected for typing | After ghost-add, first text input is focused and its value is selected |
| 9 | All decorative chrome (numbers, badges, dividers) is NOT wrapped in Trace | Decorative spans have no `data-form-path`; clicks on them resolve to `null` (no jump) |
| 10 | No console errors during interaction | Open devtools, exercise the template, no red errors |

## Step-by-step

### 1. Pick an id, name, and category

- **id** — kebab-case, unique, descriptive (`metric-grid`, `checklist`, `step-tabs`).
- **name** — Human-readable ("Metric Grid", "Checklist").
- **category** — one of: `structure` | `text` | `data` | `comparison` | `people` | `media`.

### 2. Sketch the props type

Look at the existing 20 templates for shape inspiration. Common patterns:
- `kicker?: string` (small uppercase pre-title)
- `title: string`
- `subtitle?: string` or `intro?: string`
- `items: Item[]` where Item is `{ heading: string; body: string }` or similar
- Sub-objects: `feature: { heading, body }`, `trend: { delta, label }`
- Booleans for state: `featured?: boolean`, `active?: boolean`

Always include `_onAdd?: (path: string) => void` if the template has any list.

### 3. Build the component

Skeleton (replace placeholders):

```tsx
import { AddGhostSlot, Slide, Kicker, Title, Trace } from "../_primitives";

export type <Pascal>Props = {
    kicker?: string;
    title: string;
    items: { heading: string; body: string }[];
    _onAdd?: (path: string) => void;
};

export default function <Pascal>({ kicker, title, items, _onAdd }: <Pascal>Props) {
    return (
        <Slide>
            <div className="flex flex-col gap-5 max-w-3xl">
                {kicker && <Trace path="kicker"><Kicker>{kicker}</Kicker></Trace>}
                <Trace path="title"><Title size="md">{title}</Title></Trace>
            </div>
            <div className="group/ghost mt-10 grid flex-1 gap-4 content-start" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                {items.map((it, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-2xl border border-secondary p-6">
                        <Trace path={`items.${i}.heading`}>
                            <h3 className="text-lg font-semibold text-primary">{it.heading}</h3>
                        </Trace>
                        <Trace path={`items.${i}.body`}>
                            <p className="text-sm leading-relaxed text-tertiary">{it.body}</p>
                        </Trace>
                    </div>
                ))}
                <AddGhostSlot path="items" onAdd={_onAdd} className="min-h-[160px]" />
            </div>
        </Slide>
    );
}

export const canonical: <Pascal>Props = {
    kicker: "Section",
    title: "A real, content-shaped title",
    items: [
        { heading: "First", body: "Realistic body that demonstrates the layout." },
        { heading: "Second", body: "Realistic body." },
        { heading: "Third", body: "Realistic body." },
    ],
};
```

**Trace rules**
- Wrap **only text-bearing elements** (`<h1>`, `<h3>`, `<p>`, `<span>` containing a value).
- Path is the dotted form-path: `"kicker"`, `"items.0.heading"`, `"feature.body"`.
- `<Trace>` is a span with `display: contents` — it does not affect layout.
- **Do not wrap decorative content** (numbered indices, "Now" badges, divider lines, icons, quote glyphs). Clicking those should resolve to no path.

**AddGhostSlot rules**
- The list container needs class `group/ghost` so the ghost shows on sibling hover.
- `path` matches the list key in the props (`"items"`, `"cards.0.bullets"` for nested).
- `className` should approximate the visual size of a list item so the ghost looks like a real placeholder.
- Only render when the list has a min/max in the schema; otherwise leave it off.

**Canonical sample rules**
- Real, demonstrative content. Not lorem ipsum.
- Must satisfy any required fields and the schema's min item count.
- This is the form initial state when the user picks the template.

### 4. Add the form schema

Edit `src/forms/schemas.ts`. Append a new entry to `SCHEMAS`:

```ts
"<id>": [
    KICKER(),
    TITLE(),
    {
        kind: "list",
        key: "items",
        label: "Items",
        itemLabel: "Item",
        min: 2,
        max: 6,
        itemFields: [
            { kind: "text", key: "heading", label: "Heading", required: true, maxLength: 60 },
            { kind: "textarea", key: "body", label: "Body", rows: 3, maxLength: 240 },
        ],
    },
],
```

**Field types available**: `text`, `textarea`, `select`, `toggle`, `group`, `list`. See [src/forms/schema.ts](../../../src/forms/schema.ts) for the full union.

**Lists of primitives** (e.g. `bullets: string[]`): use `key: "$self"` on the inner field — the form renderer treats the item itself as the value.

```ts
{
    kind: "list",
    key: "bullets",
    label: "Bullets",
    itemLabel: "Bullet",
    min: 2,
    max: 12,
    itemFields: [{ kind: "textarea", key: "$self", label: "Bullet", rows: 2, maxLength: 200 }],
},
```

**Schema must round-trip with props**: every key in the schema must match a key in the component props; every prop the component reads must have a schema field (or be `_onAdd`).

### 5. Register the template

Edit `src/templates/index.ts`:

```ts
import <Pascal>, { canonical as <camel>Canonical } from "./<id>";
// ...inside TEMPLATES = [...]:
{ id: "<id>", name: "<Name>", category: "<category>", component: <Pascal>, canonical: <camel>Canonical },
```

The order in the array determines the order in the sidebar and gallery.

### 6. Verify against the success criteria

Run through the checklist above. Concretely:

```bash
# 1. TypeScript / Vite compile — should serve 200 with no errors
curl -sI http://localhost:6173/src/templates/<id>/index.tsx -o /dev/null -w "%{http_code}\n"

# 2-3. Open the dev server pages
# /templates → see the new card in the gallery
# / → click the entry in the sidebar, see the form + preview

# 4-10. Manual check in the browser per the table above
```

**If a check fails, the most common causes are:**
- Missing `<Trace>` wrap (clicks resolve to nothing) — wrap each leaf
- Trace wrapping a decorative element (clicks land in the wrong input) — unwrap
- Missing `group/ghost` on the list container (ghost never shows) — add the class
- AddGhostSlot path mismatch with schema key (add fails silently) — match exactly
- Schema list `min` greater than canonical sample length (form starts in invalid state) — fix
- Component prop name doesn't match schema key (form changes don't render) — match exactly
- Ghost position is too far from the items (visual disconnect) — adjust the className

## Pitfalls

- **Schema key MUST equal the component prop name.** Edits to the form write to `formProps[<schema-key>]`; the component reads `formProps[<prop-name>]`. Mismatch = silent bug; the form looks like it works but the slide never updates. Test by editing the field and watching the preview.
- **Beware the schema shorthand helpers (`KICKER`, `TITLE`, `SUBTITLE`).** They hardcode keys (`"kicker"`, `"title"`, `"subtitle"`). If your prop is named differently — e.g. `intro` instead of `subtitle` — **do not use the helper**; write an inline field with the correct `key`. (Pre-existing bug fixed in `bullet-stack` is the canonical example.)
- **Don't add textContent that isn't in props.** If you render literal text (e.g. `"Now"` badge), that text becomes click-target chrome. Either keep it conditional on a real prop, or accept that clicks on it won't resolve.
- **Don't nest `<Trace>` wrappers.** `closest()` finds the nearest one; a wrapper with parent path will swallow clicks meant for inner leaves.
- **Don't put `<Trace>` around block-level containers that hold multiple leaves.** Wrap the leaves individually; the user clicks the body, you select the body.
- **Don't use random placeholder text** in `canonical`. Future you will copy from this when reasoning about the layout.
- **List `min` ≥ 1 with no items in canonical** will leave the form in an invalid initial state. Make sure `canonical` has at least `min` items.
- **`_onAdd` is optional in the prop type** but should always be threaded through to `AddGhostSlot`. The gallery passes nothing; the editor passes a real function.

## What this skill does NOT do

- It does not invent the brand visual idiom — copy the existing 20 templates' typographic conventions (`text-display-md` for content titles; `text-display-lg`+ for hero/section openers; `Kicker` for pre-title labels; `text-primary/secondary/tertiary/quaternary` for hierarchy; `border-secondary` for chrome; `bg-brand-primary` for highlight pills).
- It does not handle deeply-nested lists in the form (e.g. `columns[i].bullets[j]`). Those work but the form UX gets cramped — prefer flatter shapes when possible.
- It does not write tests beyond the success-criteria checklist. Treat the gallery render + manual click-and-add as the integration test.
