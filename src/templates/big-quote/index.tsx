import { Slide } from "../_primitives";

export type BigQuoteProps = {
    quote: string;
    author: string;
    role?: string;
};

export default function BigQuote({ quote, author, role }: BigQuoteProps) {
    return (
        <Slide>
            <div className="flex flex-1 flex-col justify-between">
                <span aria-hidden className="font-serif text-[200px] leading-none text-brand-secondary opacity-20 select-none">
                    &ldquo;
                </span>
                <p className="-mt-16 text-display-md font-medium leading-[1.15] tracking-[-0.015em] text-primary max-w-5xl">
                    {quote}
                </p>
                <div className="flex items-center gap-4">
                    <span className="h-px w-12 bg-brand-solid" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-md font-semibold text-primary">{author}</span>
                        {role && <span className="text-sm text-tertiary">{role}</span>}
                    </div>
                </div>
            </div>
        </Slide>
    );
}

export const canonical: BigQuoteProps = {
    quote: "Limitations are not the obstacles to creativity. They are the conditions of it.",
    author: "Adam Phillips",
    role: "Psychoanalyst & Essayist",
};
