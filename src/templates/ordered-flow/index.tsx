import { AddGhostSlot, Slide, Kicker, Title, Trace } from "../_primitives";

export type OrderedFlowStep = {
    lead: string;
    body: string;
};

export type OrderedFlowProps = {
    kicker?: string;
    title: string;
    steps: OrderedFlowStep[];
    _onAdd?: (path: string) => void;
};

export default function OrderedFlow({ kicker, title, steps, _onAdd }: OrderedFlowProps) {
    const cols = Math.min(steps.length, 4);
    return (
        <Slide>
            <div className="flex flex-col gap-5 max-w-3xl">
                {kicker && <Trace path="kicker"><Kicker>{kicker}</Kicker></Trace>}
                <Trace path="title"><Title size="md">{title}</Title></Trace>
            </div>
            <div
                className="group/ghost mt-12 grid flex-1 gap-6 content-start"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {steps.map((step, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-primary font-mono text-sm font-semibold tabular-nums text-brand-secondary">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            {i < steps.length - 1 && (
                                <div className="h-px flex-1 bg-border-secondary" />
                            )}
                        </div>
                        <Trace path={`steps.${i}.lead`}>
                            <h3 className="text-lg font-semibold tracking-tight text-primary mt-2">{step.lead}</h3>
                        </Trace>
                        <Trace path={`steps.${i}.body`}>
                            <p className="text-sm leading-relaxed text-tertiary">{step.body}</p>
                        </Trace>
                    </div>
                ))}
                <AddGhostSlot path="steps" onAdd={_onAdd} className="min-h-[140px]" />
            </div>
        </Slide>
    );
}

export const canonical: OrderedFlowProps = {
    kicker: "How it works",
    title: "From mdex to slides in three steps",
    steps: [
        { lead: "Paginate", body: "Split on H1, H2, and dividers. Each chunk becomes one slide." },
        { lead: "Extract shape", body: "Compute depth, branching factor, leaf types, density. The slide's structural fingerprint." },
        { lead: "Match templates", body: "The Matcher scores the f100 against the shape. n perfect matches, m partial; user picks; choice sticks." },
    ],
};
