import { Slide, Kicker, Title } from "../_primitives";

export type BulletStackProps = {
    kicker?: string;
    title: string;
    intro?: string;
    bullets: string[];
};

export default function BulletStack({ kicker, title, intro, bullets }: BulletStackProps) {
    return (
        <Slide>
            <div className="flex flex-col gap-5 max-w-3xl">
                {kicker && <Kicker>{kicker}</Kicker>}
                <Title size="md">{title}</Title>
                {intro && <p className="text-lg leading-relaxed text-tertiary max-w-2xl">{intro}</p>}
            </div>
            <ul className="mt-10 grid flex-1 grid-cols-2 gap-x-12 gap-y-5 content-start">
                {bullets.map((b, i) => (
                    <li key={i} className="flex gap-4 text-md leading-relaxed text-secondary">
                        <span className="text-sm font-mono font-semibold text-brand-secondary tabular-nums w-6 shrink-0 pt-1">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{b}</span>
                    </li>
                ))}
            </ul>
        </Slide>
    );
}

export const canonical: BulletStackProps = {
    kicker: "What we found",
    title: "Eight findings from the user research",
    intro: "Across 32 interviews with heads of design and senior PMs.",
    bullets: [
        "Authors describe presentations as 'writing tasks' until they hit layout — then it becomes a design task they don't enjoy",
        "73% of corporate users said they spend more time fighting templates than choosing what to say",
        "The most common failure mode is colors drifting across slides as people copy-paste from prior decks",
        "Finance decks are written in markdown-shaped outlines internally before anyone touches PowerPoint",
        "Heads of design view template enforcement as a top-3 unsolved problem",
        "Engineers prefer a markdown-first tool by 4:1 over WYSIWYG; designers split evenly",
        "Speaker notes are the most-edited and least-shipped piece of every deck",
        "Nobody re-uses templates across decks — they re-use the last deck and overwrite",
    ],
};
