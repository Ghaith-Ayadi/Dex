import { Slide, Kicker, Title } from "../_primitives";

export type LogoGridProps = {
    kicker?: string;
    title: string;
    logos: string[];
};

export default function LogoGrid({ kicker, title, logos }: LogoGridProps) {
    const cols = logos.length <= 4 ? logos.length : Math.ceil(logos.length / 2);
    return (
        <Slide>
            <div className="flex max-w-3xl flex-col gap-4">
                {kicker && <Kicker>{kicker}</Kicker>}
                <Title size="md">{title}</Title>
            </div>
            <div
                className="mt-12 grid flex-1 gap-px content-center overflow-hidden rounded-2xl border border-secondary bg-border-secondary"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {logos.map((logo, i) => (
                    <div
                        key={i}
                        className="group flex items-center justify-center bg-primary py-12 px-6 transition hover:bg-secondary/30"
                    >
                        <span className="text-2xl font-semibold tracking-[-0.02em] text-quaternary transition group-hover:text-secondary">
                            {logo}
                        </span>
                    </div>
                ))}
            </div>
        </Slide>
    );
}

export const canonical: LogoGridProps = {
    kicker: "Trusted by design teams at",
    title: "Companies betting on opinionated tooling",
    logos: ["Linear", "Vercel", "Notion", "Figma", "Framer", "Loom", "Arc", "Raycast"],
};
