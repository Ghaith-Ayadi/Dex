import { Check } from "@untitledui/icons";
import { AddGhostSlot, Slide, Kicker, Title, Trace } from "../_primitives";

export type PricingTier = {
    name: string;
    price: string;
    cadence?: string;
    description?: string;
    features: string[];
    featured?: boolean;
    badge?: string;
};

export type PricingTiersProps = {
    kicker?: string;
    title: string;
    tiers: PricingTier[];
    _onAdd?: (path: string) => void;
};

export default function PricingTiers({ kicker, title, tiers, _onAdd }: PricingTiersProps) {
    return (
        <Slide>
            <div className="flex max-w-3xl flex-col gap-4">
                {kicker && <Trace path="kicker"><Kicker>{kicker}</Kicker></Trace>}
                <Trace path="title"><Title size="md">{title}</Title></Trace>
            </div>
            <div
                className="group/ghost mt-10 grid flex-1 gap-4 content-stretch"
                style={{ gridTemplateColumns: `repeat(${tiers.length + 1}, minmax(0, 1fr))` }}
            >
                {tiers.map((tier, i) => (
                    <div
                        key={i}
                        className={
                            "relative flex flex-col gap-5 rounded-2xl p-7 transition " +
                            (tier.featured
                                ? "border-2 border-brand bg-primary shadow-lg"
                                : "border border-secondary bg-primary")
                        }
                    >
                        {tier.badge && (
                            <Trace path={`tiers.${i}.badge`}>
                                <span className="absolute -top-3 left-7 inline-flex items-center rounded-full bg-brand-solid px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                    {tier.badge}
                                </span>
                            </Trace>
                        )}
                        <div className="flex flex-col gap-2">
                            <Trace path={`tiers.${i}.name`}>
                                <h3 className="text-md font-semibold text-primary">{tier.name}</h3>
                            </Trace>
                            <div className="flex items-baseline gap-1.5">
                                <Trace path={`tiers.${i}.price`}>
                                    <span className="text-display-md font-semibold tracking-[-0.03em] text-primary tabular-nums">
                                        {tier.price}
                                    </span>
                                </Trace>
                                {tier.cadence && (
                                    <Trace path={`tiers.${i}.cadence`}>
                                        <span className="text-sm font-medium text-tertiary">/ {tier.cadence}</span>
                                    </Trace>
                                )}
                            </div>
                            {tier.description && (
                                <Trace path={`tiers.${i}.description`}>
                                    <p className="text-sm text-tertiary leading-relaxed">{tier.description}</p>
                                </Trace>
                            )}
                        </div>
                        <div className="h-px bg-border-secondary" />
                        <ul className="flex flex-col gap-3">
                            {tier.features.map((f, j) => (
                                <li key={j} className="flex items-start gap-2.5 text-sm text-secondary">
                                    <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-primary">
                                        <Check className="size-3 text-brand-secondary" aria-hidden />
                                    </span>
                                    <Trace path={`tiers.${i}.features.${j}`}>
                                        <span>{f}</span>
                                    </Trace>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <AddGhostSlot path="tiers" onAdd={_onAdd} />
            </div>
        </Slide>
    );
}

export const canonical: PricingTiersProps = {
    kicker: "Plans",
    title: "Pricing that scales with usage",
    tiers: [
        {
            name: "Free",
            price: "$0",
            cadence: "forever",
            description: "Get started, ship a deck this afternoon.",
            features: ["5 decks", "50-template starter library", "Watermarked exports", "Community support"],
        },
        {
            name: "Pro",
            price: "$29",
            cadence: "month",
            description: "For teams that present every week.",
            featured: true,
            badge: "Most popular",
            features: ["Unlimited decks", "Full template library", "Custom templates", "Up to 5 collaborators", "Priority support"],
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For organizations that govern brand at scale.",
            features: ["Everything in Pro", "SSO + SCIM", "Brand-kit lock", "Dedicated CSM", "Audit logs"],
        },
    ],
};
