import { Image01 } from "@untitledui/icons";
import { Slide, Kicker, Title, Trace } from "../_primitives";

export type SplitTextImageProps = {
    kicker?: string;
    title: string;
    body: string;
    imageAlt?: string;
    imageSide?: "left" | "right";
};

export default function SplitTextImage({ kicker, title, body, imageAlt, imageSide = "right" }: SplitTextImageProps) {
    const text = (
        <div className="flex flex-col justify-center gap-6">
            {kicker && <Trace path="kicker"><Kicker>{kicker}</Kicker></Trace>}
            <Trace path="title"><Title size="md">{title}</Title></Trace>
            <Trace path="body">
                <p className="text-lg leading-relaxed text-tertiary max-w-md">{body}</p>
            </Trace>
        </div>
    );

    const image = (
        <div
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-secondary"
            style={{
                backgroundImage:
                    "linear-gradient(135deg, var(--color-bg-secondary) 25%, transparent 25%, transparent 75%, var(--color-bg-secondary) 75%), linear-gradient(135deg, var(--color-bg-secondary) 25%, transparent 25%, transparent 75%, var(--color-bg-secondary) 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
            }}
        >
            <div className="flex flex-col items-center gap-2 rounded-xl border border-secondary bg-primary px-5 py-4 text-tertiary shadow-sm">
                <Image01 className="size-7 text-brand-secondary" aria-hidden />
                <Trace path="imageAlt">
                    <span className="text-xs font-medium uppercase tracking-wider">{imageAlt ?? "image"}</span>
                </Trace>
            </div>
        </div>
    );

    return (
        <Slide>
            <div className="grid flex-1 grid-cols-2 items-center gap-12">
                {imageSide === "right" ? (
                    <>
                        {text}
                        {image}
                    </>
                ) : (
                    <>
                        {image}
                        {text}
                    </>
                )}
            </div>
        </Slide>
    );
}

export const canonical: SplitTextImageProps = {
    kicker: "The editor",
    title: "Notion-shaped, markdown-backed",
    body: "Type slash for a block menu. Headings render as headings. Lists render as lists. The mdex serializes to plain markdown when you save — no proprietary format lock-in.",
    imageAlt: "Editor screenshot",
};
