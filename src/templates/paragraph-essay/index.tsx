import { AddGhostSlot, Slide, Kicker, Trace } from "../_primitives";

export type ParagraphEssayProps = {
    kicker?: string;
    title: string;
    paragraphs: string[];
    _onAdd?: (path: string) => void;
};

export default function ParagraphEssay({ kicker, title, paragraphs, _onAdd }: ParagraphEssayProps) {
    return (
        <Slide>
            <div className="flex max-w-4xl flex-col gap-8">
                {kicker && (
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-brand-solid" />
                        <Trace path="kicker">
                            <Kicker>{kicker}</Kicker>
                        </Trace>
                    </div>
                )}
                <Trace path="title">
                    <h1 className="text-display-md font-semibold tracking-[-0.02em] text-primary leading-[1.05]">
                        {title}
                    </h1>
                </Trace>
                <div className="group/ghost mt-2 flex flex-col gap-5 max-w-3xl">
                    {paragraphs.map((p, i) => (
                        <Trace key={i} path={`paragraphs.${i}`}>
                            <p
                                className={
                                    "text-lg leading-relaxed " +
                                    (i === 0 ? "text-secondary" : "text-tertiary")
                                }
                            >
                                {p}
                            </p>
                        </Trace>
                    ))}
                    <AddGhostSlot path="paragraphs" onAdd={_onAdd} className="h-16" />
                </div>
            </div>
        </Slide>
    );
}

export const canonical: ParagraphEssayProps = {
    kicker: "Foreword",
    title: "On the markdown thesis",
    paragraphs: [
        "Every well-designed deck I've studied turns out to be a hierarchical outline first and a layout second. The slide isn't the unit of thought. The slide is the unit of presentation. The unit of thought is the tree.",
        "If that's true, then the layout is decoration, and the markdown is the artifact. PowerPoint shipped in 1987 with the implicit claim that ideas are best communicated through arranged shapes. We built three decades of muscle memory around that.",
        "Dex tests the opposite claim — that the same outline, run through different rulesets, becomes any of a hundred visually distinct slides.",
    ],
};
