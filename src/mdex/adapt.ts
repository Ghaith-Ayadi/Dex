import type { BoldLeadItem, QuoteEntry, SlideShape } from "./types";

/* Per-template adapters. Each maps a SlideShape to the props that template
 * needs. Returns null if the shape is too sparse to be useful — caller
 * falls back to the template's canonical sample. */

function isEmpty(shape: SlideShape): boolean {
    return (
        !shape.title &&
        !shape.kicker &&
        !shape.subtitle &&
        !shape.paragraphs?.length &&
        !shape.bullets?.length &&
        !shape.cards?.length &&
        !shape.steps?.length &&
        !shape.quotes?.length &&
        !shape.sections?.length
    );
}

function flatBoldLead(item: BoldLeadItem): string {
    return `${item.lead} — ${item.body}`;
}

function quoteToFlat(q: QuoteEntry): string {
    const attr = q.author ? ` — ${q.author}${q.role ? `, ${q.role}` : ""}` : "";
    return `"${q.text}"${attr}`;
}

/* ---- Adapters ---- */

function adaptParagraphEssay(s: SlideShape) {
    const paragraphs = s.paragraphs?.length
        ? s.paragraphs
        : s.subtitle
          ? [s.subtitle]
          : [];
    if (!s.title && paragraphs.length === 0) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        paragraphs,
    };
}

function adaptBulletStack(s: SlideShape) {
    const bullets = s.bullets?.length
        ? s.bullets
        : s.cards?.length
          ? s.cards.map(flatBoldLead)
          : s.steps?.length
            ? s.steps.map(flatBoldLead)
            : [];
    if (!s.title && bullets.length === 0) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        intro: s.subtitle,
        bullets,
    };
}

function adaptCardGrid(s: SlideShape) {
    const cards = s.cards?.length
        ? s.cards.map((c) => ({ heading: c.lead, body: c.body }))
        : s.bullets?.length
          ? s.bullets.map((b) => ({ heading: "", body: b }))
          : [];
    if (!s.title && cards.length === 0) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        subtitle: s.subtitle,
        cards,
    };
}

function adaptQuoteFeature(s: SlideShape) {
    const quotes = s.quotes?.length
        ? s.quotes.map((q) => ({ text: q.text, author: q.author ?? "", role: q.role }))
        : [];
    if (quotes.length === 0) return null;
    return {
        kicker: s.kicker,
        title: s.title,
        quotes,
    };
}

function adaptAgendaToc(s: SlideShape) {
    /* Agenda accepts ordered or unordered list of items with optional descriptions. */
    const source: BoldLeadItem[] = s.steps?.length
        ? s.steps
        : s.cards?.length
          ? s.cards
          : (s.bullets ?? []).map((b) => ({ lead: b, body: "" }));
    if (!s.title && source.length === 0) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "Agenda",
        items: source.map((it) => ({ title: it.lead, description: it.body || undefined })),
    };
}

function adaptHeroTitle(s: SlideShape) {
    if (!s.title) return null;
    return {
        kicker: s.kicker,
        title: s.title,
        subtitle: s.subtitle,
    };
}

function adaptSectionDivider(s: SlideShape) {
    if (!s.title) return null;
    /* Try to extract a leading number from the kicker, e.g. "Part 02" → "02" */
    const m = s.kicker?.match(/(\d+)/);
    return {
        number: m ? m[1] : undefined,
        label: s.kicker ?? "",
        title: s.title,
    };
}

function adaptCalloutBanner(s: SlideShape) {
    /* Statement is the title (or first paragraph). Supporting is subtitle/next paragraph. */
    const statement = s.title ?? s.paragraphs?.[0];
    if (!statement) return null;
    return {
        eyebrow: s.kicker,
        statement,
        supporting: s.subtitle ?? s.paragraphs?.[s.title ? 0 : 1],
    };
}

function adaptBigQuote(s: SlideShape) {
    const q = s.quotes?.[0];
    if (!q) return null;
    return {
        quote: q.text,
        author: q.author ?? "",
        role: q.role,
    };
}

function adaptOrderedFlow(s: SlideShape) {
    const steps = s.steps?.length
        ? s.steps
        : s.cards?.length
          ? s.cards
          : [];
    if (steps.length === 0) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        steps,
    };
}

function adaptTimelineVertical(s: SlideShape) {
    /* Looks for `**Date** — Label — description` or sections w/ heading as date. */
    const events: { date: string; label: string; description?: string }[] = [];
    if (s.cards?.length) {
        for (const c of s.cards) {
            // body might contain " — description" suffix
            const parts = c.body.split(/\s+[—\-]\s+/);
            events.push({
                date: c.lead,
                label: parts[0] ?? c.body,
                description: parts.slice(1).join(" — ") || undefined,
            });
        }
    }
    if (events.length === 0) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        events,
    };
}

function adaptTwoColCompare(s: SlideShape) {
    if (!s.sections || s.sections.length < 2) return null;
    const [a, b] = s.sections;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        columns: [
            { label: a.heading, bullets: a.bullets },
            { label: b.heading, bullets: b.bullets },
        ],
    };
}

function adaptQuadrant2x2(s: SlideShape) {
    if (!s.cards || s.cards.length < 4) return null;
    const four = s.cards.slice(0, 4);
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        quadrants: four.map((c) => ({ label: c.lead, body: c.body })),
    };
}

function adaptFeatureSpotlight(s: SlideShape) {
    /* First section becomes the featured item; cards become secondary. */
    const featureSection = s.sections?.[0];
    const feature = featureSection
        ? { heading: featureSection.heading, body: featureSection.paragraphs.join("\n\n") }
        : s.cards?.[0]
          ? { heading: s.cards[0].lead, body: s.cards[0].body }
          : null;
    const secondary = (featureSection ? s.cards : s.cards?.slice(1)) ?? [];
    if (!feature) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        feature,
        secondary: secondary.map((c) => ({ heading: c.lead, body: c.body })),
    };
}

function adaptSplitTextImage(s: SlideShape) {
    const body = s.subtitle ?? s.paragraphs?.[0];
    if (!s.title || !body) return null;
    return {
        kicker: s.kicker,
        title: s.title,
        body,
    };
}

function adaptStatHero(s: SlideShape) {
    /* Convention: the title field holds the hero number (e.g. `# $4.2M`),
     * the subtitle holds the label, paragraphs[0] holds the optional note,
     * and a list of `**delta** — label` cards become supporting stats. */
    if (!s.title) return null;
    const supporting = s.cards?.map((c) => ({ value: c.lead, label: c.body }));
    return {
        kicker: s.kicker,
        heroValue: s.title,
        heroLabel: s.subtitle ?? "",
        heroNote: s.paragraphs?.[0],
        supporting,
    };
}

function adaptPricingTiers(s: SlideShape) {
    /* Each H2 section becomes a tier. Heading "Name — $Price/cadence" parsed. */
    if (!s.sections || s.sections.length === 0) return null;
    const tiers = s.sections.map((sec) => {
        const m = sec.heading.match(/^(.+?)\s*[—\-]\s*([^/]+?)(?:\/(.+))?$/);
        const name = m ? m[1].trim() : sec.heading;
        const price = m ? m[2].trim() : "—";
        const cadence = m?.[3]?.trim();
        return {
            name,
            price,
            cadence,
            features: sec.bullets,
        };
    });
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        tiers,
    };
}

function adaptLogoGrid(s: SlideShape) {
    const logos = s.bullets ?? s.cards?.map((c) => c.lead) ?? [];
    if (logos.length === 0) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        logos,
    };
}

function adaptTeamGrid(s: SlideShape) {
    /* Convention: `- **Name**, Role — bio` */
    if (!s.cards?.length) return null;
    const members = s.cards.map((c) => {
        // c.lead might be "Name" with body "Role — bio"
        const bodyParts = c.body.split(/\s+[—\-]\s+/);
        return {
            name: c.lead,
            role: bodyParts[0] ?? "",
            bio: bodyParts.slice(1).join(" — ") || undefined,
        };
    });
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        members,
    };
}

function adaptComparisonTable(s: SlideShape) {
    if (!s.table) return null;
    return {
        kicker: s.kicker,
        title: s.title ?? "",
        columns: s.table.columns,
        rows: s.table.rows,
    };
}

/* ---- Dispatch ---- */

const ADAPTERS: Record<string, (s: SlideShape) => unknown | null> = {
    "paragraph-essay": adaptParagraphEssay,
    "bullet-stack": adaptBulletStack,
    "card-grid": adaptCardGrid,
    "quote-feature": adaptQuoteFeature,
    "agenda-toc": adaptAgendaToc,
    "hero-title": adaptHeroTitle,
    "section-divider": adaptSectionDivider,
    "callout-banner": adaptCalloutBanner,
    "big-quote": adaptBigQuote,
    "ordered-flow": adaptOrderedFlow,
    "timeline-vertical": adaptTimelineVertical,
    "two-col-compare": adaptTwoColCompare,
    "quadrant-2x2": adaptQuadrant2x2,
    "feature-spotlight": adaptFeatureSpotlight,
    "split-text-image": adaptSplitTextImage,
    "stat-hero": adaptStatHero,
    "pricing-tiers": adaptPricingTiers,
    "logo-grid": adaptLogoGrid,
    "team-grid": adaptTeamGrid,
    "comparison-table": adaptComparisonTable,
};

export function adapt(templateId: string, shape: SlideShape): unknown | null {
    if (isEmpty(shape)) return null;
    const fn = ADAPTERS[templateId];
    if (!fn) return null;
    return fn(shape);
}

/* Suppress unused warnings for utility helpers. */
export { quoteToFlat };
