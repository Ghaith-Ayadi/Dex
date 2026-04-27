import { marked, type Tokens } from "marked";
import type { BoldLeadItem, QuoteEntry, SectionEntry, SlideShape, TableShape } from "./types";

/* Match `**Lead** — body` (or `-` / `:` separator). Captures lead and body. */
const BOLD_LEAD_RE = /^\*\*([^*]+)\*\*\s*[—\-:]\s*([\s\S]+)$/;

/* Strip leading `> ` from raw blockquote text. */
function stripQuotePrefix(text: string): string {
    return text
        .split("\n")
        .map((l) => l.replace(/^>\s?/, ""))
        .join("\n")
        .trim();
}

/* Try to extract `"Quote text" — Author, Role` from a blockquote text body. */
function parseQuoteText(text: string): QuoteEntry {
    const cleaned = stripQuotePrefix(text);
    // Look for trailing attribution after an em-dash or hyphen on the last meaningful chunk
    const m = cleaned.match(/^["“]?([\s\S]+?)["”]?\s*\n?[—\-]\s*(.+)$/m);
    if (m) {
        const [, body, attrib] = m;
        const [author, ...rest] = attrib.split(",").map((s) => s.trim());
        return { text: body.trim(), author, role: rest.join(", ") || undefined };
    }
    return { text: cleaned.replace(/^["“]|["”]$/g, "") };
}

function parseBoldLeadItem(text: string): BoldLeadItem | null {
    const m = text.trim().match(BOLD_LEAD_RE);
    if (!m) return null;
    return { lead: m[1].trim(), body: m[2].trim() };
}

function listItemText(item: Tokens.ListItem): string {
    /* List items can have nested tokens; take the raw text. */
    return (item.text ?? "").trim();
}

function isAllBoldLead(items: Tokens.ListItem[]): boolean {
    if (items.length === 0) return false;
    return items.every((it) => BOLD_LEAD_RE.test(listItemText(it)));
}

export function parseMdex(mdex: string): SlideShape {
    const tokens = marked.lexer(mdex);
    const shape: SlideShape = { raw: mdex, tokenCount: tokens.length };

    let seenTitle = false;
    let currentSection: SectionEntry | null = null;

    const pushParagraph = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        if (currentSection) {
            currentSection.paragraphs.push(trimmed);
            return;
        }

        // First paragraph after the title (and before any list) becomes subtitle.
        if (seenTitle && !shape.subtitle && !shape.bullets && !shape.cards && !shape.paragraphs) {
            shape.subtitle = trimmed;
            return;
        }

        (shape.paragraphs ??= []).push(trimmed);
    };

    const flushSection = () => {
        if (currentSection) {
            (shape.sections ??= []).push(currentSection);
            currentSection = null;
        }
    };

    for (const token of tokens) {
        switch (token.type) {
            case "heading": {
                const t = token as Tokens.Heading;
                if (t.depth === 1 && !seenTitle) {
                    shape.title = t.text.trim();
                    seenTitle = true;
                } else if (t.depth === 2) {
                    flushSection();
                    currentSection = { heading: t.text.trim(), paragraphs: [], bullets: [], cards: [] };
                } else {
                    /* H3+ treated like a paragraph for now */
                    pushParagraph(t.text);
                }
                break;
            }

            case "paragraph": {
                const t = token as Tokens.Paragraph;
                pushParagraph(t.text);
                break;
            }

            case "blockquote": {
                const t = token as Tokens.Blockquote;
                const inner = stripQuotePrefix(t.text);

                // Pre-title blockquote → kicker. Post-title → quote.
                if (!seenTitle && !shape.kicker) {
                    shape.kicker = inner;
                } else {
                    (shape.quotes ??= []).push(parseQuoteText(t.text));
                }
                break;
            }

            case "list": {
                const t = token as Tokens.List;
                const items = t.items;

                if (isAllBoldLead(items)) {
                    const parsed = items
                        .map((it) => parseBoldLeadItem(listItemText(it)))
                        .filter((x): x is BoldLeadItem => x !== null);

                    if (currentSection) {
                        currentSection.cards.push(...parsed);
                    } else if (t.ordered) {
                        (shape.steps ??= []).push(...parsed);
                    } else {
                        (shape.cards ??= []).push(...parsed);
                    }
                } else {
                    const flat = items.map((it) => listItemText(it));
                    if (currentSection) {
                        currentSection.bullets.push(...flat);
                    } else {
                        (shape.bullets ??= []).push(...flat);
                    }
                }
                break;
            }

            case "table": {
                const t = token as Tokens.Table;
                const columns = t.header.map((cell) => cell.text);
                const rows = t.rows.map((row) => {
                    const [first, ...rest] = row;
                    const values: (string | boolean)[] = rest.map((cell) => {
                        const v = cell.text.trim();
                        if (v === "✓" || v === "yes" || v === "true") return true;
                        if (v === "—" || v === "no" || v === "false" || v === "") return false;
                        return v;
                    });
                    return { label: (first?.text ?? "").trim(), values };
                });
                shape.table = { columns: columns.slice(1), rows } as TableShape;
                break;
            }

            case "space":
            case "hr":
            default:
                break;
        }
    }

    flushSection();
    return shape;
}
