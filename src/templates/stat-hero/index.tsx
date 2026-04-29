import { TrendUp01 } from "@untitledui/icons";
import { AddGhostSlot, Slide, Kicker, Body, Trace } from "../_primitives";

export type StatHeroProps = {
    kicker?: string;
    heroValue: string;
    heroLabel: string;
    heroNote?: string;
    trend?: { delta: string; label?: string };
    supporting?: { value: string; label: string }[];
    _onAdd?: (path: string) => void;
};

export default function StatHero({ kicker, heroValue, heroLabel, heroNote, trend, supporting, _onAdd }: StatHeroProps) {
    return (
        <Slide>
            {kicker && <Trace path="kicker"><Kicker className="mb-6">{kicker}</Kicker></Trace>}
            <div className="flex flex-1 flex-col justify-center">
                <div className="flex items-baseline gap-6">
                    <Trace path="heroValue">
                        <div className="text-[180px] font-semibold leading-none tracking-[-0.05em] text-primary tabular-nums">
                            {heroValue}
                        </div>
                    </Trace>
                    {trend && (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3 py-1.5 text-sm font-semibold text-brand-secondary">
                            <TrendUp01 className="size-4" aria-hidden />
                            <Trace path="trend.delta">
                                <span className="tabular-nums">{trend.delta}</span>
                            </Trace>
                        </div>
                    )}
                </div>
                <Trace path="heroLabel">
                    <div className="mt-4 text-2xl font-medium text-secondary">{heroLabel}</div>
                </Trace>
                {heroNote && (
                    <Trace path="heroNote">
                        <Body className="mt-3 max-w-2xl text-lg">{heroNote}</Body>
                    </Trace>
                )}
            </div>
            {(supporting?.length ?? 0) > 0 || _onAdd ? (
                <div className="group/ghost mt-6 grid grid-cols-4 gap-10 border-t border-secondary pt-8">
                    {(supporting ?? []).map((s, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            <Trace path={`supporting.${i}.value`}>
                                <span className="text-display-xs font-semibold tracking-tight text-primary tabular-nums">
                                    {s.value}
                                </span>
                            </Trace>
                            <Trace path={`supporting.${i}.label`}>
                                <span className="text-sm font-medium text-tertiary">{s.label}</span>
                            </Trace>
                        </div>
                    ))}
                    <AddGhostSlot path="supporting" onAdd={_onAdd} className="min-h-[80px]" />
                </div>
            ) : null}
        </Slide>
    );
}

export const canonical: StatHeroProps = {
    kicker: "Series A — Q1 2026",
    heroValue: "$4.2M",
    heroLabel: "Annual recurring revenue",
    heroNote: "Up from $2.8M last quarter, driven primarily by enterprise self-serve.",
    trend: { delta: "+50% QoQ" },
    supporting: [
        { value: "12", label: "Enterprise logos signed" },
        { value: "4,800", label: "Pro-tier seats active" },
        { value: "8.2%", label: "Free → Pro conversion" },
    ],
};
