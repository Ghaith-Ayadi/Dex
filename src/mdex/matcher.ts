import type { SlideShape } from "./types";

/* The Matcher: deterministic, rule-based scoring of every template against a
 * SlideShape. No AI, no embeddings. Each scorer returns a number (higher =
 * better fit). Caller ranks the results. */

export interface MatchResult {
    templateId: string;
    score: number;
}

/* ---- Helpers ---- */

const LOOKS_LIKE_DATE = /^(?:Q[1-4]\s*\d{4}|\d{4}-\d{2}|\d{4}|[A-Z][a-z]+\s+\d{4})/;
const LOOKS_LIKE_PRICE = /^[\$€£]?\s*[\d.,]+[KMB]?(?:\s|$)|^[\d.]+%/;
const LOOKS_LIKE_NAME = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}$/;

const has = <T,>(arr: T[] | undefined): arr is T[] => Array.isArray(arr) && arr.length > 0;
const lenOf = (arr: unknown[] | undefined) => (arr ? arr.length : 0);

/* ---- Per-template scorers ----
 * Each returns 0–100. Negative penalties allowed; clamp at 0 below. */

const scorers: Record<string, (s: SlideShape) => number> = {
    "hero-title": (s) => {
        let v = 0;
        if (s.title) v += 50;
        if (s.kicker) v += 15;
        if (s.subtitle) v += 15;
        // penalize body content — hero is title-only
        if (has(s.bullets)) v -= 30;
        if (has(s.cards)) v -= 30;
        if (has(s.steps)) v -= 30;
        if (has(s.sections)) v -= 30;
        if (has(s.quotes)) v -= 20;
        if (lenOf(s.paragraphs) > 1) v -= 20;
        return v;
    },

    "section-divider": (s) => {
        let v = 0;
        if (s.title) v += 30;
        if (s.kicker && /\d/.test(s.kicker)) v += 35; // numbered part marker
        if (!s.subtitle && !has(s.paragraphs) && !has(s.bullets) && !has(s.cards)) v += 20;
        return v;
    },

    "paragraph-essay": (s) => {
        let v = 0;
        if (s.title) v += 25;
        const paraCount = lenOf(s.paragraphs);
        if (paraCount >= 2) v += 50;
        else if (paraCount === 1) v += 25;
        // penalize structured body
        if (has(s.cards)) v -= 30;
        if (has(s.bullets)) v -= 15;
        if (has(s.steps)) v -= 30;
        return v;
    },

    "bullet-stack": (s) => {
        let v = 0;
        if (s.title) v += 15;
        const n = lenOf(s.bullets);
        if (n >= 3 && n <= 12) v += 60;
        else if (n > 0) v += 30;
        if (has(s.cards)) v -= 25; // cards is a stronger pattern
        if (has(s.sections)) v -= 25;
        return v;
    },

    "callout-banner": (s) => {
        let v = 0;
        if (s.title && s.title.length > 40) v += 35;
        if (s.kicker) v += 15;
        if (s.subtitle) v += 20;
        if (!has(s.bullets) && !has(s.cards) && !has(s.steps) && !has(s.sections)) v += 25;
        return v;
    },

    "big-quote": (s) => {
        let v = 0;
        if (lenOf(s.quotes) === 1) v += 70;
        if (!s.title && !has(s.cards) && !has(s.bullets)) v += 20;
        return v;
    },

    "card-grid": (s) => {
        let v = 0;
        if (s.title) v += 15;
        const n = lenOf(s.cards);
        if (n >= 2 && n <= 8) v += 60;
        if (s.subtitle) v += 10;
        if (n === 4) v -= 5; // quadrant might score better
        if (has(s.steps)) v -= 15;
        if (has(s.sections)) v -= 25;
        return v;
    },

    "feature-spotlight": (s) => {
        let v = 0;
        if (lenOf(s.sections) >= 1 && has(s.cards)) v += 60;
        if (s.title) v += 15;
        return v;
    },

    "ordered-flow": (s) => {
        let v = 0;
        if (s.title) v += 15;
        const n = lenOf(s.steps);
        if (n >= 2 && n <= 5) v += 65;
        else if (n > 0) v += 30;
        return v;
    },

    "timeline-vertical": (s) => {
        let v = 0;
        if (s.title) v += 15;
        const cards = s.cards ?? [];
        if (cards.length >= 2) {
            const datey = cards.filter((c) => LOOKS_LIKE_DATE.test(c.lead)).length;
            if (datey >= cards.length / 2) v += 65;
            else v += 10;
        }
        return v;
    },

    "stat-hero": (s) => {
        let v = 0;
        if (s.title && LOOKS_LIKE_PRICE.test(s.title)) v += 60;
        if (s.subtitle) v += 15;
        if (has(s.cards) && lenOf(s.cards) <= 4) v += 10;
        return v;
    },

    "quote-feature": (s) => {
        let v = 0;
        const n = lenOf(s.quotes);
        if (n >= 2) v += 65;
        if (s.title) v += 10;
        return v;
    },

    "two-col-compare": (s) => {
        let v = 0;
        if (lenOf(s.sections) === 2) v += 65;
        if (s.title) v += 15;
        return v;
    },

    "quadrant-2x2": (s) => {
        let v = 0;
        if (lenOf(s.cards) === 4) v += 65;
        if (s.title) v += 15;
        return v;
    },

    "comparison-table": (s) => {
        let v = 0;
        if (s.table) v += 80;
        if (s.title) v += 10;
        return v;
    },

    "pricing-tiers": (s) => {
        let v = 0;
        const sections = s.sections ?? [];
        if (sections.length >= 2 && sections.length <= 4) {
            const pricey = sections.filter((sec) => LOOKS_LIKE_PRICE.test(sec.heading) || /[\$€£]/.test(sec.heading)).length;
            if (pricey >= sections.length / 2) v += 70;
            else v += 25;
            // sections must each have bullets
            if (sections.every((sec) => sec.bullets.length > 0)) v += 10;
        }
        if (s.title) v += 10;
        return v;
    },

    "logo-grid": (s) => {
        let v = 0;
        const bullets = s.bullets ?? [];
        if (bullets.length >= 3) {
            const shortish = bullets.filter((b) => b.length < 30 && !/\s/.test(b.trim().split(/[—\-]/)[0])).length;
            if (shortish >= bullets.length * 0.8) v += 50;
        }
        if (s.title) v += 10;
        return v;
    },

    "team-grid": (s) => {
        let v = 0;
        const cards = s.cards ?? [];
        if (cards.length >= 2) {
            const namey = cards.filter((c) => LOOKS_LIKE_NAME.test(c.lead)).length;
            if (namey >= cards.length / 2) v += 55;
        }
        if (s.title) v += 10;
        return v;
    },

    "split-text-image": (s) => {
        let v = 0;
        if (s.title && s.subtitle) v += 35;
        if (!has(s.cards) && !has(s.bullets) && !has(s.sections)) v += 15;
        return v;
    },

    "agenda-toc": (s) => {
        let v = 0;
        if (s.title) v += 15;
        const n = lenOf(s.steps) + lenOf(s.cards);
        if (n >= 3 && n <= 8) v += 35;
        const titleLooksAgenda = /^(agenda|contents|what we|outline|table of)/i.test(s.title ?? "");
        if (titleLooksAgenda) v += 30;
        return v;
    },
};

export function matchAll(shape: SlideShape): MatchResult[] {
    const results: MatchResult[] = [];
    for (const [templateId, score] of Object.entries(scorers)) {
        const v = score(shape);
        results.push({ templateId, score: Math.max(0, v) });
    }
    results.sort((a, b) => b.score - a.score);
    return results;
}

export function bestMatch(shape: SlideShape): MatchResult | null {
    const results = matchAll(shape);
    if (results.length === 0) return null;
    if (results[0].score === 0) return null;
    return results[0];
}
