import { ArrowRight } from "@untitledui/icons";
import { Slide } from "../_primitives";

export type HeroTitleProps = {
    kicker?: string;
    title: string;
    subtitle?: string;
    callout?: string;
};

export default function HeroTitle({ kicker, title, subtitle, callout }: HeroTitleProps) {
    return (
        <Slide>
            <div className="flex flex-1 flex-col justify-end gap-10">
                {kicker && (
                    <div className="flex items-center gap-3">
                        <span className="h-px w-10 bg-brand-solid" />
                        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                            {kicker}
                        </span>
                    </div>
                )}
                <h1 className="text-[112px] font-semibold leading-[0.95] tracking-[-0.04em] text-primary max-w-[18ch]">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-2xl leading-snug text-tertiary max-w-2xl">
                        {subtitle}
                    </p>
                )}
                {callout && (
                    <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-secondary bg-secondary/40 px-4 py-2 text-sm font-medium text-secondary">
                        <span>{callout}</span>
                        <ArrowRight className="size-4" aria-hidden />
                    </div>
                )}
            </div>
        </Slide>
    );
}

export const canonical: HeroTitleProps = {
    kicker: "Q4 2026 — Strategy Review",
    title: "From outline to outcome.",
    subtitle: "How Dex turns the way teams think into the way they present — without fighting templates.",
    callout: "Internal · Confidential",
};
