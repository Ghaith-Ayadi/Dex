/* The "slide shape" is the structured representation of one slide's mdex.
 * It's the input to both adapters (shape → template props) and the Matcher
 * (shape → ranked template candidates). Same data, two consumers. */

export interface BoldLeadItem {
    lead: string;
    body: string;
}

export interface QuoteEntry {
    text: string;
    author?: string;
    role?: string;
}

export interface SectionEntry {
    heading: string;
    paragraphs: string[];
    bullets: string[];
    cards: BoldLeadItem[];
}

export interface TableShape {
    columns: string[];
    rows: { label: string; values: (string | boolean)[] }[];
}

export interface SlideShape {
    /* Hierarchical text */
    kicker?: string;
    title?: string;
    subtitle?: string;

    /* Body content (mutually exclusive flavors of "what comes after the title") */
    paragraphs?: string[];
    bullets?: string[];
    cards?: BoldLeadItem[];     // unordered list with **lead** — body pattern
    steps?: BoldLeadItem[];     // ordered list with **lead** — body pattern
    quotes?: QuoteEntry[];

    /* H2 sections (each with their own body content) */
    sections?: SectionEntry[];

    /* Tabular content */
    table?: TableShape;

    /* The original input + lexer output, for templates that need raw access */
    raw: string;
    tokenCount: number;
}
