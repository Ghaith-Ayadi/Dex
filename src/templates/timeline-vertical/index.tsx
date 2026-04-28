import { AddGhostSlot, Slide, Kicker, Title } from "../_primitives";

export type TimelineEvent = {
    date: string;
    label: string;
    description?: string;
    active?: boolean;
};

export type TimelineVerticalProps = {
    kicker?: string;
    title: string;
    events: TimelineEvent[];
    _onAdd?: (path: string) => void;
};

export default function TimelineVertical({ kicker, title, events, _onAdd }: TimelineVerticalProps) {
    return (
        <Slide>
            <div className="flex flex-col gap-4 max-w-3xl">
                {kicker && <Kicker>{kicker}</Kicker>}
                <Title size="md">{title}</Title>
            </div>
            <div className="group/ghost mt-10 flex flex-1 flex-col">
                {events.map((event, i) => (
                    <div key={i} className="grid grid-cols-[140px_28px_1fr] items-start gap-5">
                        <div className="pt-1 text-right">
                            <div className="text-sm font-mono font-semibold text-brand-secondary tabular-nums">{event.date}</div>
                        </div>
                        <div className="flex flex-col items-center self-stretch">
                            <div
                                className={
                                    "mt-1.5 size-3.5 rounded-full border-2 " +
                                    (event.active
                                        ? "border-brand bg-brand-solid"
                                        : "border-brand bg-primary")
                                }
                            />
                            {i < events.length - 1 && <div className="w-px flex-1 bg-border-secondary" />}
                        </div>
                        <div className="flex flex-col gap-1.5 pb-7">
                            <div className="flex items-center gap-2">
                                <h3 className="text-md font-semibold text-primary">{event.label}</h3>
                                {event.active && (
                                    <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-secondary">
                                        Now
                                    </span>
                                )}
                            </div>
                            {event.description && (
                                <p className="text-sm leading-relaxed text-tertiary">{event.description}</p>
                            )}
                        </div>
                    </div>
                ))}
                <AddGhostSlot path="events" onAdd={_onAdd} className="ml-[124px] mt-2 h-16" />
            </div>
        </Slide>
    );
}

export const canonical: TimelineVerticalProps = {
    kicker: "2026 roadmap",
    title: "What ships when",
    events: [
        { date: "Q1 2026", label: "Foundations", description: "Data model, slot schemas, first 20 templates, Matcher v0." },
        { date: "Q2 2026", label: "Authoring", active: true, description: "Notion-like editor, slash commands, detach/re-attach flows." },
        { date: "Q3 2026", label: "Beta", description: "Closed beta with 3 design leaders. b100 score above 80." },
        { date: "Q4 2026", label: "Launch", description: "Public release. 100 templates, theme tokens, multi-user." },
    ],
};
