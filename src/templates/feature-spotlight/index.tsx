import { Cube01, LayersThree01, Lightning01 } from "@untitledui/icons";
import type { FC, SVGProps } from "react";
import { Slide, Kicker, Title } from "../_primitives";

export type FeatureSpotlightProps = {
    kicker?: string;
    title: string;
    feature: {
        icon?: FC<SVGProps<SVGSVGElement>>;
        heading: string;
        body: string;
    };
    secondary: { heading: string; body: string }[];
};

export default function FeatureSpotlight({ kicker, title, feature, secondary }: FeatureSpotlightProps) {
    const Icon = feature.icon ?? Cube01;
    return (
        <Slide>
            <div className="flex flex-col gap-4 max-w-3xl">
                {kicker && <Kicker>{kicker}</Kicker>}
                <Title size="md">{title}</Title>
            </div>
            <div className="mt-10 grid flex-1 grid-cols-[1.4fr_1fr] gap-8 content-start">
                <div className="flex flex-col gap-5 rounded-2xl border border-secondary bg-secondary/50 p-8">
                    <div className="inline-flex size-12 items-center justify-center rounded-xl border border-brand bg-primary">
                        <Icon className="size-6 text-brand-secondary" aria-hidden />
                    </div>
                    <h3 className="text-display-xs font-semibold tracking-tight text-primary">{feature.heading}</h3>
                    <p className="text-md leading-relaxed text-tertiary">{feature.body}</p>
                </div>
                <div className="flex flex-col gap-4">
                    {secondary.map((s, i) => (
                        <div key={i} className="flex flex-col gap-1.5 border-l-2 border-brand pl-4 py-1">
                            <h4 className="text-sm font-semibold text-primary">{s.heading}</h4>
                            <p className="text-sm leading-relaxed text-tertiary">{s.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Slide>
    );
}

export const canonical: FeatureSpotlightProps = {
    kicker: "What's new",
    title: "The Matcher, in plain English",
    feature: {
        icon: LayersThree01,
        heading: "Tree-shape matching, no AI",
        body: "Dex extracts a structural fingerprint from your mdex — depth, branching, leaf types, density — and ranks every template against it. Same content always picks the same template.",
    },
    secondary: [
        { heading: "Deterministic", body: "Pure function. No embeddings, no inference, no nondeterminism." },
        { heading: "Fast", body: "Sub-millisecond. Runs locally in the browser, on every keystroke." },
        { heading: "Inspectable", body: "Dev mode shows the score for every candidate. Debugging is reading a list." },
    ],
};
