import { Stars01, LayersThree01, Zap, Globe04, Lightning01, Target01, Cube01, Stars02 } from "@untitledui/icons";
import type { FC, SVGProps } from "react";
import { AddGhostSlot, Slide, Kicker, Title } from "../_primitives";

const FALLBACK_ICONS: FC<SVGProps<SVGSVGElement>>[] = [Stars01, LayersThree01, Zap, Globe04, Lightning01, Target01, Cube01, Stars02];

export type CardGridCard = {
    icon?: FC<SVGProps<SVGSVGElement>>;
    heading: string;
    body: string;
};

export type CardGridProps = {
    kicker?: string;
    title: string;
    subtitle?: string;
    cards: CardGridCard[];
    _onAdd?: (path: string) => void;
};

export default function CardGrid({ kicker, title, subtitle, cards, _onAdd }: CardGridProps) {
    const colCount = cards.length <= 2 ? 2 : cards.length === 4 ? 2 : 3;
    return (
        <Slide>
            <div className="flex max-w-3xl flex-col gap-5">
                {kicker && <Kicker>{kicker}</Kicker>}
                <Title size="md">{title}</Title>
                {subtitle && (
                    <p className="text-lg leading-relaxed text-tertiary max-w-2xl">{subtitle}</p>
                )}
            </div>
            <div
                className="group/ghost mt-12 grid flex-1 gap-5 content-start"
                style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
            >
                {cards.map((card, i) => {
                    const Icon = card.icon ?? FALLBACK_ICONS[i % FALLBACK_ICONS.length];
                    return (
                        <div
                            key={i}
                            className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-6 transition hover:border-primary"
                        >
                            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-primary">
                                <Icon className="size-5 text-brand-secondary" aria-hidden />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight text-primary">{card.heading}</h3>
                            <p className="text-sm leading-relaxed text-tertiary">{card.body}</p>
                        </div>
                    );
                })}
                <AddGhostSlot path="cards" onAdd={_onAdd} className="min-h-[180px]" />
            </div>
        </Slide>
    );
}

export const canonical: CardGridProps = {
    kicker: "What you get",
    title: "Authoring without the layout fight",
    subtitle: "Four pillars that make Dex feel less like fighting PowerPoint and more like writing in your favorite editor.",
    cards: [
        { heading: "Markdown-first", body: "Write the outline. Slides emerge. No dragging text boxes into alignment." },
        { heading: "Brand-safe templates", body: "Heads of design curate the library. Employees stay inside the brand by default." },
        { heading: "Deterministic match", body: "No AI. The Matcher is a pure function: same content, same template, every time." },
        { heading: "Detach when needed", body: "An escape hatch for the 6% of slides that genuinely need pixel-pushing." },
    ],
};
