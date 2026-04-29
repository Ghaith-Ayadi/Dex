import { Slide, Eyebrow, Trace } from "../_primitives";

export type SectionDividerProps = {
    number?: string;
    label: string;
    title: string;
};

export default function SectionDivider({ number, label, title }: SectionDividerProps) {
    return (
        <Slide className="justify-end">
            <div className="flex items-end gap-8">
                {number && (
                    <Trace path="number">
                        <span className="text-display-2xl font-semibold leading-none tracking-tighter text-brand-secondary opacity-30">
                            {number}
                        </span>
                    </Trace>
                )}
                <div className="flex flex-col gap-3 pb-3">
                    <Trace path="label">
                        <Eyebrow className="text-brand-secondary uppercase tracking-[0.12em] font-semibold">
                            {label}
                        </Eyebrow>
                    </Trace>
                    <Trace path="title">
                        <h1 className="text-display-xl font-semibold tracking-tight text-primary leading-[1.05]">
                            {title}
                        </h1>
                    </Trace>
                </div>
            </div>
        </Slide>
    );
}

export const canonical: SectionDividerProps = {
    number: "02",
    label: "Part Two",
    title: "How the Matcher works",
};
