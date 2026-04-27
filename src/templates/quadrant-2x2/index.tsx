import { Slide, Kicker, Title } from "../_primitives";

export type Quadrant = {
    label: string;
    body: string;
};

export type Quadrant2x2Props = {
    kicker?: string;
    title: string;
    xAxis?: { low: string; high: string };
    yAxis?: { low: string; high: string };
    quadrants: [Quadrant, Quadrant, Quadrant, Quadrant];
};

export default function Quadrant2x2({ kicker, title, xAxis, yAxis, quadrants }: Quadrant2x2Props) {
    return (
        <Slide>
            <div className="flex flex-col gap-4 max-w-3xl">
                {kicker && <Kicker>{kicker}</Kicker>}
                <Title size="md">{title}</Title>
            </div>
            <div className="mt-8 flex flex-1 gap-4">
                {yAxis && (
                    <div className="flex w-6 flex-col items-center justify-between py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-quaternary">
                        <span>{yAxis.high}</span>
                        <span className="h-px w-3 bg-border-secondary" />
                        <span>{yAxis.low}</span>
                    </div>
                )}
                <div className="flex flex-1 flex-col gap-2">
                    <div className="grid flex-1 grid-cols-2 gap-px content-stretch overflow-hidden rounded-xl border border-secondary bg-border-secondary">
                        {quadrants.map((q, i) => (
                            <div key={i} className="flex flex-col gap-2 bg-primary p-6">
                                <div className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-secondary">{q.label}</div>
                                <p className="text-sm leading-relaxed text-secondary">{q.body}</p>
                            </div>
                        ))}
                    </div>
                    {xAxis && (
                        <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-quaternary">
                            <span>{xAxis.low}</span>
                            <span>{xAxis.high}</span>
                        </div>
                    )}
                </div>
            </div>
        </Slide>
    );
}

export const canonical: Quadrant2x2Props = {
    kicker: "Competitive map",
    title: "Where Dex sits",
    xAxis: { low: "Generic templates", high: "Brand-enforced" },
    yAxis: { low: "Visual editor", high: "Markdown-first" },
    quadrants: [
        { label: "Dex", body: "Brand-enforced templates with markdown-first authoring. The whole point." },
        { label: "Notion / Tome", body: "Markdown-first but generic templates. Authoring wins, brand suffers." },
        { label: "Pitch / Beautiful.ai", body: "Visual editor with curated templates. Brand-friendly but no outline-first flow." },
        { label: "PowerPoint / Keynote", body: "Visual editor, generic templates. The status quo every brand fights." },
    ],
};
