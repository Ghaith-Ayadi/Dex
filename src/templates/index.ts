import type { ComponentType } from "react";

import ParagraphEssay, { canonical as paragraphEssayCanonical } from "./paragraph-essay";
import BulletStack, { canonical as bulletStackCanonical } from "./bullet-stack";
import HeroTitle, { canonical as heroTitleCanonical } from "./hero-title";
import BigQuote, { canonical as bigQuoteCanonical } from "./big-quote";
import CalloutBanner, { canonical as calloutBannerCanonical } from "./callout-banner";
import CardGrid, { canonical as cardGridCanonical } from "./card-grid";
import StatHero, { canonical as statHeroCanonical } from "./stat-hero";
import QuoteFeature, { canonical as quoteFeatureCanonical } from "./quote-feature";
import OrderedFlow, { canonical as orderedFlowCanonical } from "./ordered-flow";
import TimelineVertical, { canonical as timelineVerticalCanonical } from "./timeline-vertical";
import TwoColCompare, { canonical as twoColCompareCanonical } from "./two-col-compare";
import Quadrant2x2, { canonical as quadrant2x2Canonical } from "./quadrant-2x2";
import FeatureSpotlight, { canonical as featureSpotlightCanonical } from "./feature-spotlight";
import SplitTextImage, { canonical as splitTextImageCanonical } from "./split-text-image";
import AgendaToc, { canonical as agendaTocCanonical } from "./agenda-toc";
import PricingTiers, { canonical as pricingTiersCanonical } from "./pricing-tiers";
import LogoGrid, { canonical as logoGridCanonical } from "./logo-grid";
import TeamGrid, { canonical as teamGridCanonical } from "./team-grid";
import ComparisonTable, { canonical as comparisonTableCanonical } from "./comparison-table";
import SectionDivider, { canonical as sectionDividerCanonical } from "./section-divider";

export type TemplateEntry = {
    id: string;
    name: string;
    category: "structure" | "text" | "data" | "people" | "comparison" | "media";
    component: ComponentType<any>;
    canonical: any;
};

export const TEMPLATES: TemplateEntry[] = [
    { id: "hero-title", name: "Hero Title", category: "structure", component: HeroTitle, canonical: heroTitleCanonical },
    { id: "section-divider", name: "Section Divider", category: "structure", component: SectionDivider, canonical: sectionDividerCanonical },
    { id: "agenda-toc", name: "Agenda / TOC", category: "structure", component: AgendaToc, canonical: agendaTocCanonical },
    { id: "paragraph-essay", name: "Paragraph Essay", category: "text", component: ParagraphEssay, canonical: paragraphEssayCanonical },
    { id: "bullet-stack", name: "Bullet Stack", category: "text", component: BulletStack, canonical: bulletStackCanonical },
    { id: "callout-banner", name: "Callout Banner", category: "text", component: CalloutBanner, canonical: calloutBannerCanonical },
    { id: "big-quote", name: "Big Quote", category: "text", component: BigQuote, canonical: bigQuoteCanonical },
    { id: "card-grid", name: "Card Grid", category: "structure", component: CardGrid, canonical: cardGridCanonical },
    { id: "feature-spotlight", name: "Feature Spotlight", category: "structure", component: FeatureSpotlight, canonical: featureSpotlightCanonical },
    { id: "ordered-flow", name: "Ordered Flow", category: "structure", component: OrderedFlow, canonical: orderedFlowCanonical },
    { id: "timeline-vertical", name: "Timeline (Vertical)", category: "structure", component: TimelineVertical, canonical: timelineVerticalCanonical },
    { id: "stat-hero", name: "Stat Hero", category: "data", component: StatHero, canonical: statHeroCanonical },
    { id: "quote-feature", name: "Quote Feature", category: "text", component: QuoteFeature, canonical: quoteFeatureCanonical },
    { id: "two-col-compare", name: "Two-column Compare", category: "comparison", component: TwoColCompare, canonical: twoColCompareCanonical },
    { id: "quadrant-2x2", name: "2x2 Quadrant", category: "comparison", component: Quadrant2x2, canonical: quadrant2x2Canonical },
    { id: "comparison-table", name: "Comparison Table", category: "comparison", component: ComparisonTable, canonical: comparisonTableCanonical },
    { id: "pricing-tiers", name: "Pricing Tiers", category: "data", component: PricingTiers, canonical: pricingTiersCanonical },
    { id: "logo-grid", name: "Logo Grid", category: "people", component: LogoGrid, canonical: logoGridCanonical },
    { id: "team-grid", name: "Team Grid", category: "people", component: TeamGrid, canonical: teamGridCanonical },
    { id: "split-text-image", name: "Split Text + Image", category: "media", component: SplitTextImage, canonical: splitTextImageCanonical },
];
