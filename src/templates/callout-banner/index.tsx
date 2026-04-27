import { Slide, Eyebrow } from "../_primitives";

export type CalloutBannerProps = {
    eyebrow?: string;
    statement: string;
    supporting?: string;
};

export default function CalloutBanner({ eyebrow, statement, supporting }: CalloutBannerProps) {
    return (
        <Slide className="justify-center">
            <div className="flex max-w-5xl flex-col gap-6">
                {eyebrow && <Eyebrow className="text-brand-secondary uppercase tracking-[0.12em] font-semibold">{eyebrow}</Eyebrow>}
                <p className="text-display-xl font-semibold leading-[1.05] tracking-tight text-primary">
                    {statement}
                </p>
                {supporting && (
                    <p className="text-xl leading-relaxed text-tertiary max-w-3xl">{supporting}</p>
                )}
            </div>
        </Slide>
    );
}

export const canonical: CalloutBannerProps = {
    eyebrow: "Our bet",
    statement: "All presentations are essentially markdown.",
    supporting: "Same tree, many visual forms. The slide isn't the unit of thought — the tree is.",
};
