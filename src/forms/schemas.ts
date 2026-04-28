import type { TemplateSchema } from "./schema";

/* Per-template form schemas. Each entry's key matches the template id in
 * `src/templates/index.ts`. The shape of each schema must round-trip with
 * the template's React props. */

const KICKER = (label = "Kicker") =>
    ({ kind: "text", key: "kicker", label, maxLength: 60, placeholder: "What you get" } as const);

const TITLE = (label = "Title", required = true) =>
    ({ kind: "text", key: "title", label, required, maxLength: 80, placeholder: "Slide headline" } as const);

const SUBTITLE = (label = "Subtitle") =>
    ({ kind: "textarea", key: "subtitle", label, rows: 2, maxLength: 200 } as const);

export const SCHEMAS: Record<string, TemplateSchema> = {
    "hero-title": [
        KICKER("Kicker / pre-title"),
        TITLE("Headline"),
        SUBTITLE(),
        { kind: "text", key: "callout", label: "Callout pill", placeholder: "Internal · Confidential", maxLength: 60 },
    ],

    "section-divider": [
        { kind: "text", key: "number", label: "Number", placeholder: "02", maxLength: 4 },
        { kind: "text", key: "label", label: "Label", placeholder: "Part Two", maxLength: 40, required: true },
        TITLE("Title"),
    ],

    "agenda-toc": [
        KICKER(),
        TITLE("Agenda heading"),
        {
            kind: "list",
            key: "items",
            label: "Items",
            itemLabel: "Item",
            min: 2,
            max: 8,
            itemFields: [
                { kind: "text", key: "title", label: "Title", required: true, maxLength: 80 },
                { kind: "textarea", key: "description", label: "Description", rows: 2, maxLength: 160 },
            ],
        },
        { kind: "text", key: "activeIndex", label: "Active index (0-based)", placeholder: "1", maxLength: 2 },
    ],

    "paragraph-essay": [
        KICKER(),
        TITLE(),
        {
            kind: "list",
            key: "paragraphs",
            label: "Paragraphs",
            itemLabel: "Paragraph",
            min: 1,
            max: 6,
            itemFields: [{ kind: "textarea", key: "$self", label: "Text", rows: 4, maxLength: 600 }],
        },
    ],

    "bullet-stack": [
        KICKER(),
        TITLE(),
        SUBTITLE("Intro"),
        {
            kind: "list",
            key: "bullets",
            label: "Bullets",
            itemLabel: "Bullet",
            min: 2,
            max: 12,
            itemFields: [{ kind: "textarea", key: "$self", label: "Bullet", rows: 2, maxLength: 200 }],
        },
    ],

    "callout-banner": [
        { kind: "text", key: "eyebrow", label: "Eyebrow", maxLength: 60 },
        { kind: "textarea", key: "statement", label: "Statement", rows: 2, maxLength: 200, required: true },
        { kind: "textarea", key: "supporting", label: "Supporting", rows: 2, maxLength: 240 },
    ],

    "big-quote": [
        { kind: "textarea", key: "quote", label: "Quote", rows: 4, maxLength: 400, required: true },
        { kind: "text", key: "author", label: "Author", required: true, maxLength: 60 },
        { kind: "text", key: "role", label: "Role", maxLength: 80 },
    ],

    "card-grid": [
        KICKER(),
        TITLE(),
        SUBTITLE(),
        {
            kind: "list",
            key: "cards",
            label: "Cards",
            itemLabel: "Card",
            min: 2,
            max: 8,
            itemFields: [
                { kind: "text", key: "heading", label: "Heading", required: true, maxLength: 60 },
                { kind: "textarea", key: "body", label: "Body", rows: 3, maxLength: 240 },
            ],
        },
    ],

    "feature-spotlight": [
        KICKER(),
        TITLE(),
        {
            kind: "group",
            key: "feature",
            label: "Feature",
            fields: [
                { kind: "text", key: "heading", label: "Heading", required: true, maxLength: 80 },
                { kind: "textarea", key: "body", label: "Body", rows: 4, maxLength: 320 },
            ],
        },
        {
            kind: "list",
            key: "secondary",
            label: "Secondary points",
            itemLabel: "Point",
            min: 1,
            max: 4,
            itemFields: [
                { kind: "text", key: "heading", label: "Heading", required: true, maxLength: 60 },
                { kind: "textarea", key: "body", label: "Body", rows: 2, maxLength: 200 },
            ],
        },
    ],

    "ordered-flow": [
        KICKER(),
        TITLE(),
        {
            kind: "list",
            key: "steps",
            label: "Steps",
            itemLabel: "Step",
            min: 2,
            max: 5,
            itemFields: [
                { kind: "text", key: "lead", label: "Lead", required: true, maxLength: 40 },
                { kind: "textarea", key: "body", label: "Body", rows: 2, maxLength: 200 },
            ],
        },
    ],

    "timeline-vertical": [
        KICKER(),
        TITLE(),
        {
            kind: "list",
            key: "events",
            label: "Events",
            itemLabel: "Event",
            min: 2,
            max: 8,
            itemFields: [
                { kind: "text", key: "date", label: "Date", required: true, placeholder: "Q1 2026", maxLength: 40 },
                { kind: "text", key: "label", label: "Label", required: true, maxLength: 60 },
                { kind: "textarea", key: "description", label: "Description", rows: 2, maxLength: 200 },
                { kind: "toggle", key: "active", label: "Mark as 'Now'" },
            ],
        },
    ],

    "stat-hero": [
        KICKER(),
        { kind: "text", key: "heroValue", label: "Hero value", required: true, placeholder: "$4.2M", maxLength: 12 },
        { kind: "text", key: "heroLabel", label: "Hero label", required: true, maxLength: 60 },
        { kind: "textarea", key: "heroNote", label: "Hero note", rows: 2, maxLength: 200 },
        {
            kind: "group",
            key: "trend",
            label: "Trend pill (optional)",
            fields: [
                { kind: "text", key: "delta", label: "Delta", placeholder: "+50% QoQ", maxLength: 30 },
                { kind: "text", key: "label", label: "Label", maxLength: 30 },
            ],
        },
        {
            kind: "list",
            key: "supporting",
            label: "Supporting stats",
            itemLabel: "Stat",
            min: 0,
            max: 4,
            itemFields: [
                { kind: "text", key: "value", label: "Value", required: true, maxLength: 12 },
                { kind: "text", key: "label", label: "Label", required: true, maxLength: 60 },
            ],
        },
    ],

    "quote-feature": [
        KICKER(),
        TITLE("Title (optional)", false),
        {
            kind: "list",
            key: "quotes",
            label: "Quotes",
            itemLabel: "Quote",
            min: 1,
            max: 4,
            itemFields: [
                { kind: "textarea", key: "text", label: "Quote", required: true, rows: 3, maxLength: 240 },
                { kind: "text", key: "author", label: "Author", required: true, maxLength: 60 },
                { kind: "text", key: "role", label: "Role", maxLength: 80 },
            ],
        },
    ],

    "two-col-compare": [
        KICKER(),
        TITLE(),
        {
            kind: "list",
            key: "columns",
            label: "Columns",
            itemLabel: "Column",
            min: 2,
            max: 2,
            itemFields: [
                { kind: "text", key: "label", label: "Label", required: true, maxLength: 30 },
                {
                    kind: "list",
                    key: "bullets",
                    label: "Bullets",
                    itemLabel: "Bullet",
                    min: 1,
                    max: 8,
                    itemFields: [{ kind: "textarea", key: "$self", label: "Bullet", rows: 2, maxLength: 160 }],
                },
            ],
        },
    ],

    "quadrant-2x2": [
        KICKER(),
        TITLE(),
        {
            kind: "group",
            key: "xAxis",
            label: "X axis (optional)",
            fields: [
                { kind: "text", key: "low", label: "Low", maxLength: 40 },
                { kind: "text", key: "high", label: "High", maxLength: 40 },
            ],
        },
        {
            kind: "group",
            key: "yAxis",
            label: "Y axis (optional)",
            fields: [
                { kind: "text", key: "low", label: "Low", maxLength: 40 },
                { kind: "text", key: "high", label: "High", maxLength: 40 },
            ],
        },
        {
            kind: "list",
            key: "quadrants",
            label: "Quadrants",
            itemLabel: "Quadrant",
            min: 4,
            max: 4,
            itemFields: [
                { kind: "text", key: "label", label: "Label", required: true, maxLength: 40 },
                { kind: "textarea", key: "body", label: "Body", rows: 3, maxLength: 200 },
            ],
        },
    ],

    "comparison-table": [
        KICKER(),
        TITLE(),
        {
            kind: "list",
            key: "columns",
            label: "Column headers",
            itemLabel: "Column",
            min: 2,
            max: 4,
            itemFields: [{ kind: "text", key: "$self", label: "Header", required: true, maxLength: 30 }],
        },
        { kind: "text", key: "highlightColumn", label: "Highlight column index (0-based)", placeholder: "1", maxLength: 2 },
        {
            kind: "list",
            key: "rows",
            label: "Rows",
            itemLabel: "Row",
            min: 2,
            max: 10,
            itemFields: [
                { kind: "text", key: "label", label: "Feature", required: true, maxLength: 60 },
                {
                    kind: "list",
                    key: "values",
                    label: "Values",
                    itemLabel: "Value",
                    min: 2,
                    max: 4,
                    itemFields: [{ kind: "text", key: "$self", label: "Value", maxLength: 30, placeholder: "✓ / — / text" }],
                },
            ],
        },
    ],

    "pricing-tiers": [
        KICKER(),
        TITLE(),
        {
            kind: "list",
            key: "tiers",
            label: "Tiers",
            itemLabel: "Tier",
            min: 2,
            max: 4,
            itemFields: [
                { kind: "text", key: "name", label: "Name", required: true, maxLength: 30 },
                { kind: "text", key: "price", label: "Price", required: true, placeholder: "$29", maxLength: 12 },
                { kind: "text", key: "cadence", label: "Cadence", placeholder: "month", maxLength: 30 },
                { kind: "textarea", key: "description", label: "Description", rows: 2, maxLength: 160 },
                { kind: "text", key: "badge", label: "Badge", placeholder: "Most popular", maxLength: 24 },
                { kind: "toggle", key: "featured", label: "Featured (visual emphasis)" },
                {
                    kind: "list",
                    key: "features",
                    label: "Features",
                    itemLabel: "Feature",
                    min: 1,
                    max: 8,
                    itemFields: [{ kind: "text", key: "$self", label: "Feature", required: true, maxLength: 80 }],
                },
            ],
        },
    ],

    "logo-grid": [
        KICKER(),
        TITLE(),
        {
            kind: "list",
            key: "logos",
            label: "Logos",
            itemLabel: "Logo",
            min: 3,
            max: 12,
            itemFields: [{ kind: "text", key: "$self", label: "Brand name", required: true, maxLength: 30 }],
        },
    ],

    "team-grid": [
        KICKER(),
        TITLE(),
        {
            kind: "list",
            key: "members",
            label: "Members",
            itemLabel: "Member",
            min: 2,
            max: 8,
            itemFields: [
                { kind: "text", key: "name", label: "Name", required: true, maxLength: 40 },
                { kind: "text", key: "role", label: "Role", required: true, maxLength: 60 },
                { kind: "textarea", key: "bio", label: "Bio", rows: 3, maxLength: 200 },
                { kind: "text", key: "initials", label: "Initials override", maxLength: 4 },
            ],
        },
    ],

    "split-text-image": [
        KICKER(),
        TITLE(),
        { kind: "textarea", key: "body", label: "Body", rows: 4, maxLength: 400, required: true },
        { kind: "text", key: "imageAlt", label: "Image alt", maxLength: 60 },
        {
            kind: "select",
            key: "imageSide",
            label: "Image side",
            options: [
                { value: "right", label: "Right" },
                { value: "left", label: "Left" },
            ],
        },
    ],
};
