import { Slide, Eyebrow } from "../_primitives";

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
                    <span className="text-display-2xl font-semibold leading-none tracking-tighter text-brand-secondary opacity-30">
                        {number}
                    </span>
                )}
                <div className="flex flex-col gap-3 pb-3">
                    <Eyebrow className="text-brand-secondary uppercase tracking-[0.12em] font-semibold">
                        {label}
                    </Eyebrow>
                    <h1 className="text-display-xl font-semibold tracking-tight text-primary leading-[1.05]">
                        {title}
                    </h1>
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
