import { Check } from "@untitledui/icons";
import { AddGhostSlot, Slide, Kicker, Title, Trace } from "../_primitives";

export type ChecklistItem = {
    text: string;
    done?: boolean;
};

export type ChecklistProps = {
    kicker?: string;
    title: string;
    intro?: string;
    items: ChecklistItem[];
    _onAdd?: (path: string) => void;
};

export default function Checklist({ kicker, title, intro, items, _onAdd }: ChecklistProps) {
    const completed = items.filter((it) => it.done).length;
    return (
        <Slide>
            <div className="flex flex-col gap-5 max-w-3xl">
                {kicker && (
                    <Trace path="kicker"><Kicker>{kicker}</Kicker></Trace>
                )}
                <div className="flex items-baseline gap-4">
                    <Trace path="title"><Title size="md">{title}</Title></Trace>
                    <span className="text-md font-mono font-semibold text-brand-secondary tabular-nums">
                        {completed}/{items.length}
                    </span>
                </div>
                {intro && (
                    <Trace path="intro">
                        <p className="text-lg leading-relaxed text-tertiary max-w-2xl">{intro}</p>
                    </Trace>
                )}
            </div>
            <ul className="group/ghost mt-10 flex flex-1 flex-col gap-3 content-start">
                {items.map((it, i) => (
                    <li
                        key={i}
                        className="flex items-start gap-4 rounded-xl border border-secondary bg-primary p-4"
                    >
                        <span
                            className={
                                "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition " +
                                (it.done
                                    ? "border-brand bg-brand-solid text-white"
                                    : "border-brand bg-primary")
                            }
                            aria-hidden
                        >
                            {it.done && <Check className="size-4" aria-hidden />}
                        </span>
                        <Trace path={`items.${i}.text`}>
                            <span
                                className={
                                    "text-md leading-relaxed " +
                                    (it.done ? "text-tertiary line-through" : "text-secondary")
                                }
                            >
                                {it.text}
                            </span>
                        </Trace>
                    </li>
                ))}
                <AddGhostSlot path="items" onAdd={_onAdd} className="h-14" />
            </ul>
        </Slide>
    );
}

export const canonical: ChecklistProps = {
    kicker: "Pre-launch",
    title: "Brand kit handoff checklist",
    intro: "What needs to be ready before we ship the new design system to engineering.",
    items: [
        { text: "Color tokens documented (50–950 + semantic)", done: true },
        { text: "Type ramp finalized and exported as Tailwind config", done: true },
        { text: "Icon set audited against Figma library", done: false },
        { text: "Component prop interfaces typed and reviewed", done: false },
        { text: "Storybook coverage above 80% for primitives", done: false },
    ],
};
