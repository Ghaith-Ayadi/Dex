import { AddGhostSlot, Slide, Kicker, Title } from "../_primitives";

export type QuoteFeatureProps = {
    kicker?: string;
    title?: string;
    quotes: { text: string; author: string; role?: string }[];
    _onAdd?: (path: string) => void;
};

export default function QuoteFeature({ kicker, title, quotes, _onAdd }: QuoteFeatureProps) {
    const cols = quotes.length === 1 ? 1 : 2;
    return (
        <Slide>
            <div className="flex flex-col gap-4 max-w-3xl">
                {kicker && <Kicker>{kicker}</Kicker>}
                {title && <Title size="md">{title}</Title>}
            </div>
            <div
                className="group/ghost mt-10 grid flex-1 gap-5 content-start"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {quotes.map((q, i) => (
                    <figure key={i} className="flex flex-col gap-5 rounded-2xl border border-secondary bg-primary p-7">
                        <span aria-hidden className="font-serif text-5xl leading-none text-brand-secondary opacity-30 select-none">
                            &ldquo;
                        </span>
                        <blockquote className="-mt-3 text-lg leading-relaxed text-primary">
                            {q.text}
                        </blockquote>
                        <figcaption className="flex items-center gap-3">
                            <span className="h-px w-6 bg-brand-solid" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold text-primary">{q.author}</span>
                                {q.role && <span className="text-xs text-tertiary">{q.role}</span>}
                            </div>
                        </figcaption>
                    </figure>
                ))}
                <AddGhostSlot path="quotes" onAdd={_onAdd} className="min-h-[180px]" />
            </div>
        </Slide>
    );
}

export const canonical: QuoteFeatureProps = {
    kicker: "What customers say",
    title: "Tested with the people who'd actually use it",
    quotes: [
        { text: "I shouldn't need to fix the same gradient on someone's slide every quarter.", author: "Maya Chen", role: "Head of Design, Series C SaaS" },
        { text: "Finally — a deck tool that respects how I actually think.", author: "Carlos Vidal", role: "Sales Engineer" },
        { text: "It's the first time my brand kit has stayed intact across 200 sales decks.", author: "Priya Iyer", role: "VP Marketing" },
        { text: "I write the outline, the slides happen. That's the whole pitch.", author: "Tomas Olin", role: "Staff Engineer" },
    ],
};
