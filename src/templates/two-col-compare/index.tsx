import { Slide, Kicker, Title, Trace } from "../_primitives";

export type TwoColCompareProps = {
    kicker?: string;
    title: string;
    columns: [
        { label: string; bullets: string[] },
        { label: string; bullets: string[] },
    ];
};

export default function TwoColCompare({ kicker, title, columns }: TwoColCompareProps) {
    return (
        <Slide>
            <div className="flex flex-col gap-4 max-w-3xl">
                {kicker && <Trace path="kicker"><Kicker>{kicker}</Kicker></Trace>}
                <Trace path="title"><Title size="md">{title}</Title></Trace>
            </div>
            <div className="mt-10 grid flex-1 grid-cols-2 gap-6 content-start">
                {columns.map((col, i) => (
                    <div
                        key={i}
                        className={
                            "flex flex-col gap-5 rounded-2xl p-7 " +
                            (i === 1
                                ? "border-2 border-brand bg-primary"
                                : "border border-secondary bg-secondary/30")
                        }
                    >
                        <div className="flex items-center justify-between">
                            <Trace path={`columns.${i}.label`}>
                                <h3 className="text-md font-semibold text-primary">{col.label}</h3>
                            </Trace>
                            {i === 1 && (
                                <span className="rounded-full bg-brand-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-secondary">
                                    Now
                                </span>
                            )}
                        </div>
                        <ul className="flex flex-col gap-3">
                            {col.bullets.map((b, j) => (
                                <li key={j} className="flex gap-3 text-sm leading-relaxed text-secondary">
                                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-solid" />
                                    <Trace path={`columns.${i}.bullets.${j}`}>
                                        <span>{b}</span>
                                    </Trace>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </Slide>
    );
}

export const canonical: TwoColCompareProps = {
    kicker: "The shift",
    title: "PowerPoint vs Dex",
    columns: [
        {
            label: "PowerPoint",
            bullets: [
                "Layer-based, absolute positioning",
                "One file per deck, binary format",
                "Theming via masters (often broken)",
                "Fonts and colors drift across slides",
                "Brand consistency requires constant policing",
            ],
        },
        {
            label: "Dex",
            bullets: [
                "CSS grid + flexbox, no absolute positioning",
                "Markdown source + JSON state (text)",
                "Semantic design tokens, unbreakable theming",
                "Brand consistency enforced by templates",
                "Detach is a friction-laden last resort",
            ],
        },
    ],
};
