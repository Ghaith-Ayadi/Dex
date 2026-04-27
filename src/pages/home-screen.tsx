import { useCallback, useMemo, useRef, useState } from "react";
import { NavHeader } from "@/components/nav/header";
import { SplitPane } from "@/components/split-pane/split-pane";
import { adapt } from "@/mdex/adapt";
import { matchAll } from "@/mdex/matcher";
import { parseMdex } from "@/mdex/parse";
import { TEMPLATES } from "@/templates";
import { ScaledSlide } from "@/templates/_primitives";

const PLACEHOLDER_NOTE = `// mdex authoring is wired to the textarea but not yet rendered.
// The Matcher (mdex → template props) lands next.
// For now, edit freely — the right pane shows the selected template
// with its canonical sample data.
`;

function canonicalToMdex(canonical: any): string {
    /* Naive serializer for v0. Renders the canonical object as a
     * readable mdex stub so authors see the kind of input each template wants. */
    const lines: string[] = [];
    if (canonical.kicker) lines.push(`> ${canonical.kicker}`);
    if (canonical.title) lines.push(`# ${canonical.title}`);
    if (canonical.subtitle) lines.push("", canonical.subtitle);
    if (canonical.intro) lines.push("", canonical.intro);

    if (Array.isArray(canonical.paragraphs)) {
        for (const p of canonical.paragraphs) lines.push("", p);
    }
    if (Array.isArray(canonical.bullets)) {
        lines.push("");
        for (const b of canonical.bullets) lines.push(`- ${b}`);
    }
    if (Array.isArray(canonical.cards)) {
        lines.push("");
        for (const c of canonical.cards) {
            lines.push(`- **${c.heading}** — ${c.body}`);
        }
    }
    if (Array.isArray(canonical.steps)) {
        lines.push("");
        canonical.steps.forEach((s: any, i: number) =>
            lines.push(`${i + 1}. **${s.lead}** — ${s.body}`),
        );
    }
    if (Array.isArray(canonical.events)) {
        lines.push("");
        for (const e of canonical.events) {
            lines.push(`- **${e.date}** — ${e.label}${e.description ? ` — ${e.description}` : ""}`);
        }
    }
    if (Array.isArray(canonical.quotes)) {
        lines.push("");
        for (const q of canonical.quotes) {
            lines.push(`> "${q.text}" — ${q.author}${q.role ? `, ${q.role}` : ""}`);
        }
    }
    if (canonical.quote) {
        lines.push("", `> "${canonical.quote}"`);
        if (canonical.author) lines.push(`> — ${canonical.author}${canonical.role ? `, ${canonical.role}` : ""}`);
    }
    if (canonical.statement) {
        lines.push("", `## ${canonical.statement}`);
        if (canonical.supporting) lines.push("", canonical.supporting);
    }
    if (canonical.heroValue) {
        lines.push("", `# ${canonical.heroValue}`, canonical.heroLabel);
        if (canonical.heroNote) lines.push("", canonical.heroNote);
        if (Array.isArray(canonical.supporting)) {
            lines.push("");
            for (const s of canonical.supporting) lines.push(`- **${s.value}** — ${s.label}`);
        }
    }
    if (Array.isArray(canonical.columns) && Array.isArray(canonical.columns[0]?.bullets)) {
        lines.push("");
        for (const col of canonical.columns) {
            lines.push("", `## ${col.label}`);
            for (const b of col.bullets) lines.push(`- ${b}`);
        }
    }
    if (Array.isArray(canonical.quadrants)) {
        lines.push("");
        for (const q of canonical.quadrants) lines.push(`- **${q.label}** — ${q.body}`);
    }
    if (canonical.feature) {
        lines.push("", `## ${canonical.feature.heading}`, canonical.feature.body);
        if (Array.isArray(canonical.secondary)) {
            lines.push("");
            for (const s of canonical.secondary) lines.push(`- **${s.heading}** — ${s.body}`);
        }
    }
    if (canonical.body && !canonical.feature) {
        lines.push("", canonical.body);
    }
    if (Array.isArray(canonical.tiers)) {
        lines.push("");
        for (const t of canonical.tiers) {
            lines.push("", `## ${t.name} — ${t.price}${t.cadence ? `/${t.cadence}` : ""}`);
            for (const f of t.features) lines.push(`- ${f}`);
        }
    }
    if (Array.isArray(canonical.logos)) {
        lines.push("");
        for (const l of canonical.logos) lines.push(`- ${l}`);
    }
    if (Array.isArray(canonical.members)) {
        lines.push("");
        for (const m of canonical.members) {
            lines.push(`- **${m.name}**, ${m.role}${m.bio ? ` — ${m.bio}` : ""}`);
        }
    }
    if (Array.isArray(canonical.items)) {
        lines.push("");
        canonical.items.forEach((it: any, i: number) =>
            lines.push(`${i + 1}. **${it.title}**${it.description ? ` — ${it.description}` : ""}`),
        );
    }
    if (Array.isArray(canonical.rows)) {
        lines.push("", "| Feature | " + canonical.columns.join(" | ") + " |");
        lines.push("|---|" + canonical.columns.map(() => "---").join("|") + "|");
        for (const r of canonical.rows) {
            lines.push("| " + r.label + " | " + r.values.map((v: any) => (typeof v === "boolean" ? (v ? "✓" : "—") : v)).join(" | ") + " |");
        }
    }
    return lines.length > 0 ? lines.join("\n") : PLACEHOLDER_NOTE;
}

export const HomeScreen = () => {
    const [selectedId, setSelectedId] = useState<string>(TEMPLATES[0].id);
    const selected = useMemo(
        () => TEMPLATES.find((t) => t.id === selectedId) ?? TEMPLATES[0],
        [selectedId],
    );
    const [mdex, setMdex] = useState<string>(canonicalToMdex(selected.canonical));

    const handleSelect = (id: string) => {
        const t = TEMPLATES.find((x) => x.id === id);
        if (!t) return;
        setSelectedId(id);
        setMdex(canonicalToMdex(t.canonical));
    };

    const Component = selected.component;

    /* Parse the mdex on every change and adapt for the selected template.
     * Falls back to the canonical sample when the shape is too sparse. */
    const shape = useMemo(() => parseMdex(mdex), [mdex]);
    const liveProps = useMemo(() => adapt(selected.id, shape), [selected.id, shape]);
    const renderProps = liveProps ?? selected.canonical;
    const renderingFromMdex = liveProps !== null;

    /* Run the Matcher over the live shape to surface ranked candidates. */
    const matches = useMemo(() => matchAll(shape), [shape]);
    const matchScores = useMemo(() => {
        const map = new Map<string, number>();
        for (const m of matches) map.set(m.templateId, m.score);
        return map;
    }, [matches]);
    const topMatchId = matches[0]?.score > 0 ? matches[0].templateId : undefined;

    /* Round-trip: click in preview → place cursor in mdex source.
     * Strategy: from the click target walk up to the nearest element whose
     * text content is short enough to be a unique target, then search the
     * mdex source case-insensitively. */
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handlePreviewClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            let el = e.target as HTMLElement | null;
            let text = "";

            // Walk up from the click target, taking the first ancestor whose
            // text content is non-empty and short enough to be a precise target.
            while (el && el !== e.currentTarget) {
                const t = (el.textContent ?? "").replace(/\s+/g, " ").trim();
                if (t && t.length <= 200) {
                    text = t;
                    break;
                }
                el = el.parentElement;
            }
            if (!text) return;

            const source = mdex;
            const lowerSource = source.toLowerCase();
            const lowerNeedle = text.toLowerCase();

            // Try full match first; degrade to a shorter prefix if the rendered
            // text contains decorations the source doesn't (e.g. quote glyphs).
            let idx = lowerSource.indexOf(lowerNeedle);
            let len = text.length;
            if (idx < 0 && text.length > 30) {
                const prefix = lowerNeedle.slice(0, 30);
                idx = lowerSource.indexOf(prefix);
                len = 30;
            }
            if (idx < 0) {
                // Last resort: just the first word.
                const firstWord = lowerNeedle.split(" ")[0];
                if (firstWord.length >= 3) {
                    idx = lowerSource.indexOf(firstWord);
                    len = firstWord.length;
                }
            }
            if (idx < 0) return;

            const ta = textareaRef.current;
            if (!ta) return;
            ta.focus();
            ta.setSelectionRange(idx, idx + len);
            // Scroll the selection into view in the textarea.
            const before = source.slice(0, idx);
            const lineNumber = before.split("\n").length;
            const lineHeight = 22; // matches the 14px font + leading-relaxed
            ta.scrollTop = Math.max(0, (lineNumber - 4) * lineHeight);
        },
        [mdex],
    );

    const editorPane = (
        <section className="flex h-full flex-col bg-primary">
            <div className="flex h-9 shrink-0 items-center justify-between border-b border-secondary px-4">
                <span className="text-xs font-medium uppercase tracking-wide text-tertiary">mdex</span>
                <span className="text-[10px] text-quaternary">edits update the preview</span>
            </div>
            <textarea
                ref={textareaRef}
                value={mdex}
                onChange={(e) => setMdex(e.target.value)}
                spellCheck={false}
                className="flex-1 resize-none bg-primary p-6 font-mono text-sm leading-relaxed text-primary outline-none"
            />
        </section>
    );

    const previewPane = (
        <section className="flex h-full flex-col bg-secondary">
            <div className="flex h-9 shrink-0 items-center justify-between border-b border-secondary bg-primary px-4">
                <span className="text-xs font-medium uppercase tracking-wide text-tertiary">slide preview</span>
                <span className="text-[10px] text-quaternary">
                    {selected.id} · {renderingFromMdex ? "live" : "canonical"}
                </span>
            </div>
            <div
                className="flex-1 p-8 min-h-0 cursor-text"
                onClick={handlePreviewClick}
                title="Click any element to jump to its source"
            >
                <ScaledSlide>
                    <Component {...(renderProps as object)} />
                </ScaledSlide>
            </div>
        </section>
    );

    return (
        <div className="flex h-dvh flex-col bg-primary">
            <NavHeader rightSlot={<span>{selected.id}.mdex</span>} />

            <div className="grid flex-1 grid-cols-[260px_1fr] min-h-0">
                <aside className="flex flex-col border-r border-secondary bg-primary overflow-hidden">
                    <div className="flex h-9 shrink-0 items-center justify-between border-b border-secondary px-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-tertiary">templates</span>
                        <span className="text-[10px] text-quaternary">match score</span>
                    </div>
                    <ul className="flex flex-col gap-px overflow-y-auto p-2">
                        {TEMPLATES.map((t) => {
                            const score = matchScores.get(t.id) ?? 0;
                            const isTop = topMatchId === t.id;
                            const isSelected = t.id === selectedId;
                            return (
                                <li key={t.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(t.id)}
                                        className={
                                            "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition " +
                                            (isSelected
                                                ? "bg-secondary text-primary"
                                                : "text-secondary hover:bg-secondary/60 hover:text-primary")
                                        }
                                    >
                                        <span className="flex min-w-0 items-center gap-2 truncate">
                                            {isTop && <span aria-hidden className="shrink-0 text-brand-secondary">✦</span>}
                                            <span className="truncate">{t.name}</span>
                                        </span>
                                        <span
                                            className={
                                                "shrink-0 font-mono text-[10px] tabular-nums " +
                                                (score > 0 ? "text-brand-secondary" : "text-quaternary")
                                            }
                                        >
                                            {score > 0 ? score : "—"}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                <SplitPane
                    left={editorPane}
                    right={previewPane}
                    initialSplit={42}
                    min={20}
                    max={75}
                    storageKey="dex.editor.split"
                />
            </div>
        </div>
    );
};
