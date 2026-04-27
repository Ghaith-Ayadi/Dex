import { Slide, Kicker, Title } from "../_primitives";

export type AgendaTocProps = {
    kicker?: string;
    title: string;
    items: { title: string; description?: string }[];
    activeIndex?: number;
};

export default function AgendaToc({ kicker, title, items, activeIndex }: AgendaTocProps) {
    return (
        <Slide>
            <div className="flex flex-col gap-4 max-w-3xl">
                {kicker && <Kicker>{kicker}</Kicker>}
                <Title size="md">{title}</Title>
            </div>
            <ol className="mt-10 flex flex-1 flex-col">
                {items.map((item, i) => {
                    const isActive = activeIndex === i;
                    return (
                        <li
                            key={i}
                            className={
                                "flex items-start gap-6 border-b border-secondary py-4 transition " +
                                (isActive ? "" : "")
                            }
                        >
                            <span
                                className={
                                    "font-mono text-sm tabular-nums w-12 pt-1 " +
                                    (isActive ? "text-brand-secondary font-semibold" : "text-quaternary")
                                }
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1 flex flex-col gap-1">
                                <span
                                    className={
                                        "text-xl tracking-tight " +
                                        (isActive ? "font-semibold text-primary" : "font-medium text-secondary")
                                    }
                                >
                                    {item.title}
                                </span>
                                {item.description && (
                                    <span className="text-sm text-tertiary">{item.description}</span>
                                )}
                            </div>
                            {isActive && (
                                <span className="mt-1 rounded-full bg-brand-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-secondary">
                                    Now
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </Slide>
    );
}

export const canonical: AgendaTocProps = {
    kicker: "Agenda",
    title: "What we'll cover",
    activeIndex: 1,
    items: [
        { title: "The market we're aimed at", description: "Heads of design at engineering-heavy companies." },
        { title: "The thesis", description: "All presentations are essentially markdown." },
        { title: "The architecture", description: "Mdex → Matcher → templates. Deterministic, no AI." },
        { title: "The roadmap", description: "What ships in Q1, Q2, and beta." },
        { title: "The ask", description: "What we need from this room." },
    ],
};
