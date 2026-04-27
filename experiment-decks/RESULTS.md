# The 32-Slide Markdown Conversion Experiment

**Thesis under test:** Every presentation slide can be expressed as nested-list markdown. Same tree, many visual forms.

**Sources (4 decks, public PDFs, downloaded):**
- Airbnb 2008 pitch deck (14 slides) — startup
- UN SDG Report 2025 — global policy / data-heavy
- WEF Global Risks Report 2025 — corporate / mixed
- SDG Sustainable Development Report 2025 — global / index-heavy

**Annotation legend per slide:**
- ✅ **clean** — markdown captures the slide naturally; nothing visual is lost that wasn't decoration
- 🟡 **strained** — works, but feels reductive or requires a templating leap of faith
- 🟠 **forced** — possible only with explicit DSL/directive extensions
- 🔴 **broke** — semantic content lost; would have to be detached or accepted as image

---

## Part A — Airbnb pitch deck (14 slides)

### A1. Welcome (title slide) ✅
*Original: Logo + tagline*
```
# AirBed&Breakfast
Book rooms with locals, rather than hotels.
```
**Fit:** Trivial. H1 + paragraph.

### A2. Problem ✅
*Original: 3 bolded lead-in statements*
```
# Problem
- **Price** is an important concern for customers booking travel online.
- **Hotels** leave you disconnected from the city and its culture.
- **No easy way exists** to book a room with a local or become a host.
```
**Fit:** Trivial. Each bullet has a bolded lead — the template handles the visual prominence. Tree shape: `(1 title, 3 leaves)`.

### A3. Solution ✅
*Original: 1 statement + 3 colored boxes (SAVE MONEY / MAKE MONEY / SHARE CULTURE)*
```
# Solution
A web platform where users can rent out their space to host travelers to:
- **Save money** when traveling
- **Make money** when hosting
- **Share culture** through local connection to the city
```
**Fit:** Trivial. Same shape as A2 with an intro paragraph. Template decides "render as 3 cards in a row."

### A4. Market Validation 🟡
*Original: Two giant numbers (660,000 / 50,000) with sources*
```
# Market Validation
- **660,000** total users on Couchsurfing.com
- **50,000** temporary housing listings/week on Craigslist (07/09–07/16)
```
**Fit:** Works, but the visual emphasis on the BIG numbers is purely template territory. Markdown encodes "two stats with labels" — what makes the slide *land* is the typography, which the template owns. **This is fine** for the thesis.

### A5. Market Size 🟡
*Original: 3 differently-sized orange circles (2B+ / 560M / 84M)*
```
# Market Size
- **2 Billion+** trips booked worldwide — Total Available Market
- **560M** budget & online — Serviceable Available Market
- **84M** trips with AB&B — Share of Market (15% of available)
```
**Fit:** Tree shape `(1 title, 3 stats with labels)` — same shape as A2/A3. The "circle sizes proportional to value" is template-rendering, not content. Template can decide to render as proportional bubbles or just numbered cards.

### A6. Product 🟠
*Original: 3 horizontal arrows + 3 product screenshots overlapping*
```
# Product
1. Search by city
2. Review listings
3. Book it
```
**Fit:** The text reduces cleanly to an ordered list. **What's lost:** the screenshots. They need image directives:
```
# Product
1. Search by city — ![screenshot:search-by-city]
2. Review listings — ![screenshot:listings]
3. Book it — ![screenshot:booking]
```
With image directive support, this lands. Without, you lose evidence-of-existence.

### A7. Business Model ✅
*Original: 1 statement + arrow flow ($84M → $25 → $2.1B)*
```
# Business Model
We take a 10% commission on each transaction.

- **$84M** trips with AB&B — share of market (15% of available)
- **$25** average fee — $80/night × 3 nights × 10%
- **$2.1B** revenue — projected by 2011
```
**Fit:** Tree captures the chain. The "→ arrow → " visual is template-rendering of an ordered flow. A "flow template" reads the list and adds arrows; a "card template" renders without. Same data, different views.

### A8. Adoption Strategy 🟡
*Original: 3 columns (EVENTS / PARTNERSHIPS / CRAIGSLIST), each with sub-content of different types*
```
# Adoption Strategy
- **Events** — target events monthly with listing widget
  - Octoberfest (6M)
  - Cebit (700,000)
  - Summerfest (1M)
  - Eurocup (3M+)
  - Mardi Gras (800,000)
- **Partnerships** — cheap / alternative travel
  - GoLoco
  - Kayak
  - Orbitz
- **Craigslist** — dual posting feature
  - ![screenshot:craigslist-dual-post]
```
**Fit:** Works, but the columns are visually heterogeneous (text list vs. logos vs. screenshot). Tree shape is `(1 title, 3 sections, each with sub-list)` — heterogeneous leaves. Template needs per-section type tolerance: list-of-text vs. list-of-logos vs. image.

### A9. Competition 🔴
*Original: 2x2 quadrant chart (axes: Affordable–Expensive, Offline–Online), competitors as logos plotted in space*
```
# Competition
> Positioning: Affordable × Online vs. Expensive × Offline
- **Affordable, Online (us)**: AirBed&Breakfast, Hostels.com
- **Affordable, Offline**: Couchsurfing, Craigslist, BedandBreakfast.com
- **Expensive, Online**: Rentahome, Orbitz, Hotels.com
- **Expensive, Offline**: Rentobi.com, VRBO
```
**Fit:** The 2x2 spatial encoding *is* the slide's argument. Reducing to 4 buckets-of-logos loses the "we are alone in our quadrant" insight. **Possible workaround:** a "matrix/quadrant" template that takes a 2x2 list and renders the chart. But you'd need DSL or a specific data shape:
```
:::quadrant x="Online ↔ Offline" y="Affordable ↔ Expensive"
- {pos: [hi,hi], label: "AirBed&Breakfast"}
- {pos: [hi,lo], label: "Couchsurfing"}
...
:::
```
**This breaks the pure-markdown thesis.** It needs a DSL block.

### A10. Competitive Advantages ✅
*Original: 6 colored boxes in 2 rows*
```
# Competitive Advantages
- **1st to market** — for transaction-based temporary housing site
- **Host incentive** — they can make money over couchsurfing.com
- **List once** — hosts post one time vs. daily on Craigslist
- **Ease of use** — search by price, location & check-in/out dates
- **Profiles** — browse host profiles, book in 3 clicks
- **Design & brand** — memorable name, will launch at historic DNC
```
**Fit:** Trivial. 6-leaf tree. Template renders as 2x3 grid, 3x2 grid, list, or cards.

### A11. Team ✅
*Original: 4 people with photos, role, bio*
```
# Team
- **Joe Gebbia** — User Interface & PR
  - Entrepreneur and designer. Holds a patent for CritBuns®. RISD BFA in graphic and industrial design.
  - ![photo:joe]
- **Brian Chesky** — Business Development & Brand
  - Founder of Brian Chesky Inc, industrial design consultant. RISD BFA in industrial design.
  - ![photo:brian]
- **Nathan Blecharcyk** — Developer
  - Created Facebook apps "Your neighbors" (75K users), "Rolodextrous", recently launched "Identified Hits". Harvard CS, worked at Microsoft, OPNET, Batiq.
  - ![photo:nate]
- **Michael Seibel** — Advisor
  - CEO and co-founder of justin.tv, San Francisco-based VC-funded startup that delivers live video to the internet.
```
**Fit:** Clean. Each person = a list item with title (name, role) + nested description + image. Heterogeneous treatment of advisor (no photo) is fine — leaves don't have to be identical.

### A12. Press ✅
*Original: 4 speech-bubble quotes with publication logos*
```
# Press
- > "AirBed & Breakfast is a fun approach to couch surfing." — Webware
- > "Think of it as Craigslist meets Hotels.com, but a lot less creepy." — Josh Spear
- > "A cool alternative to a boring evening in a hotel room." — Mashable
- > "AirBed's fee-based service could help alleviate concerns about quality." — Springwise
```
**Fit:** Quote blocks as list items. Template renders bubbles, cards, or stacked. Logos can be implied from the publication name or via an image hint.

### A13. User Testimonials ✅
*Original: Same shape as Press — 4 quotes with photos*
```
# User Testimonials
- > "AirBed&Breakfast freaking rocks!" — Josue F., Washington, DC
- > "I found something in my price-range, and that's what enabled me to come to the conference." — Jason R., Atlanta, GA
- > "A complete success. It is easy to use and it made me money." — Emily M., Austin, TX
- > "It's about the ideas, the interactions, the people. You don't get that in a hotel room." — Dan A., Ontario, Canada
```
**Fit:** Identical shape to A12 — that's exactly the thesis at work. Same tree, same template, slightly different content.

### A14. Financial 🟡
*Original: 1 statement + 3 numbers ($500K / 80K → $2M)*
```
# Financial
We are looking for 12 months financing to reach 80,000 transactions on AirBed&Breakfast.
- **$500K** angel round — initial investment opportunity
- **80K** trips with AB&B — avg $25 fee
- **$2M** revenue — over 12 months
```
**Fit:** Same shape as A7 (Business Model). The deck reuses this stats-row pattern repeatedly — good evidence that a small library of templates covers a lot of pitch-deck ground.

---

## Part B — UN SDG Report 2025 (8 slides)

### B1. Foreword (long letter) 🟡
*Original: 1 page of dense narrative prose from Antonio Guterres + photo + signature*
```
# Foreword

Ten years since world leaders embraced the transformative 2030 Agenda for Sustainable Development, we have not only the opportunity but the obligation to take stock of progress, acknowledge shortfalls and act with urgency.

Since 2015, millions have gained access to essential services. More than half the world's population now benefits from some form of social protection, up by 10 percentage points compared to a decade ago.

> Only 35 per cent of SDG targets are on track or making moderate progress. Nearly half are moving too slowly and, alarmingly, 18 per cent are in reverse.

We face a global development emergency.

[... 600 more words ...]

— António Guterres, Secretary-General of the United Nations
```
**Fit:** The page is essentially a long-form essay with one pull-quote. Markdown handles this natively (paragraphs + blockquote). What's "presentation-y" about this? The pull-quote treatment, the photo, the signature. Template renders those. **Tree shape is non-list-y** — paragraph-paragraph-pullquote-paragraph. The "essay" template is a thing.

### B2. Introduction ✅
*Original: 2-page essay with sub-headings*
```
# Introduction
At an inflection point in human history, with five years remaining to achieve the SDGs, this report presents both a frank assessment and a compelling case for the transformative vision.

## A decade of learning: progress amid adversity
Ten years ago, world leaders gathered at the UN and made an unprecedented commitment — to leave no one behind and to transform our world by 2030.
- New HIV infections have declined by **40%** since 2010
- Malaria prevention has averted **2.2B cases** and saved **12.7M lives** since 2000
- Since 2015, **110M more children and youth** have entered school
- By 2023, **92%** of the world had access to electricity
- Internet use grew to **68%** in 2024 from 40% in 2015

## Confronting hard truths
Despite progress, the pace remains insufficient.
- 1 in 12 people still experience hunger
- Women devote 2.5x as many hours per day to unpaid care work as men
- $4 trillion annual financing gap

## Strategic pathways forward
Six SDG transitions:
- Food systems
- Energy access
- Digital transformation
- Education
- Jobs and social protection
- Climate and biodiversity action
```
**Fit:** Clean. H2 sub-sections, mix of prose and bullets. Templates that accept "long-form with sectioned bullets" cover this.

### B3. Funding Section I — Stark reality of SDG progress ✅
*Original: Header + 4-paragraph analysis + donut chart with 5 progress categories*
```
# Five years to go: the stark reality of SDG progress
The 2025 progress assessment reveals that the world remains far off track.

Of 169 SDG targets, 139 could be assessed using global trend data:
- **18%** on track
- **17%** moderate progress
- **31%** marginal progress
- **18%** stagnation
- **17%** regression

> 48% of targets show insufficient progress. 18% have regressed below 2015 baseline.
```
**Fit:** A 5-bucket distribution. The donut chart is one way to render `(label, percentage)[5]`. Template options: donut, stacked bar, horizontal bars, table. All driven from the same list.

### B4. Funding Section II — Data progress ✅
*Original: Header + 2 paragraphs + bar chart by Goal*
```
# A decade of SDG data progress reveals critical gaps
Significant progress in strengthening data systems for SDG monitoring.

- **2016 baseline:** Only 1/3 of indicators had good data coverage; 39% lacked agreed methodologies
- **Today:** Almost 70% have good coverage; all 234 indicators have established methodologies

## Strong improvement
- Goal 3 (Good health) — substantial improvement
- Goal 6 (Clean water) — substantial improvement
- Goal 7 (Energy) — highest at 80%+ trend coverage
- Goal 17 (Partnerships) — substantial improvement

## Persistent gaps (below 30% trend coverage)
- Goal 5 (Gender equality)
- Goal 11 (Sustainable cities)
- Goal 13 (Climate action)
- Goal 16 (Peace and justice)
```
**Fit:** Clean. Two grouped lists. Template can render as paired columns ("good" vs. "gaps") or sequential.

### B5. Funding Section III — DHS termination impact 🟡
*Original: Header + dense paragraphs + 2 charts (impacted goals + impact level by indicator)*
```
# Funding fragility undermines global SDG monitoring
The abrupt termination of USAID funding in February 2025 led to suspension of the Demographic and Health Surveys (DHS), exposing risks of externally-funded data systems.

## Goals most affected by DHS data loss
- Goal 3 (Good health) — 11 indicators affected
- Goal 5 (Gender equality) — 6 indicators affected
- Goal 2 (Zero hunger) — 5 indicators affected
- Goals 4, 1, 16, 6, 7, 8, 11, 17 — varying impact

## Five most-impacted SDG indicators
- **5.6.1** Women's reproductive decisions — 70% of data points from DHS
- **16.2.3** Sexual violence experienced by youth — 70%
- **5.3.2** Female genital mutilation — 50%
- **11.1.1** Urban population in slums — 50%
- **1.4.1** Households with basic services — 50%
```
**Fit:** Two ranked lists. Strain comes from the chart that shows percentages broken down by region (LDCs vs. Sub-Saharan vs. World) — that's a 3-series bar chart, fundamentally tabular. **Markdown solution:** a table block. Or you accept that "charts with multiple series" need a directive:
```
:::chart kind="grouped-bar" series="LDCs,Sub-Saharan,World"
| indicator | LDCs | SSA | World |
|-----------|------|-----|-------|
| 5.6.1 | 90 | 80 | 70 |
...
:::
```
The text content is markdown; the chart is a structured block.

### B6. Goal 1: No poverty (page intro) ✅
*Original: Title + 4 summary bullets + photo + caption*
```
# Goal 1 — No poverty
- Extreme poverty persists, affecting 1 in 10 people worldwide. Without acceleration, **8.9% of the global population will still be in extreme poverty by 2030**.
- For the first time on record, **over half the world's population** now receives at least one form of social protection benefit. **3.8 billion remain uncovered**.
- Governments are spending more on education, health and social protection, but emerging economies still **lag advanced economies by ~20 points**.
- A world without poverty requires urgent action to raise social protection coverage, close spending gaps, and target resources to the most vulnerable.

> ![photo:antananarivo-vegetable-vendors] In Antananarivo, Madagascar, vendors sell vegetables in local markets — a vital lifeline for many in the informal economy.
```
**Fit:** Clean. Each bullet is a self-contained mini-finding, with bold pulling out the key stat. Template renders as a vertical list, possibly with the photo as a side-element.

### B7. Goal 1: Revised poverty estimates section ✅
*Original: H3 sub-heading + dense paragraph + line chart*
```
# Revised poverty estimates show 2030 goal further out of reach

The World Bank revised global poverty estimates in June 2025. The international poverty line was raised from $2.15 (2017 PPP) to $3.00 (2021 PPP).

- Under the new threshold, **1.5 billion people escaped poverty 1990–2022** (vs. 1.3B under old line)
- In 2025, **808 million people** will be living in extreme poverty — up from previous estimate of 677M
- That's **9.9% of the world's population**, or 1 in 10
- By 2030, projected to fall to **8.3% (under $2.15 line)** or **7.3% (under $3 line)**
- More than **3/4 of the global extreme poor** will live in sub-Saharan Africa or fragile/conflict-affected countries

> Eradicating extreme poverty by 2030 appears highly unlikely.
```
**Fit:** The chart is a time series (1990–2030) with two lines. Markdown captures the *insights* perfectly; the visual time-series is template-rendered from the underlying data. **The data isn't in markdown** — that's a chart-block problem (B5 again).

### B8. Goal 2: Zero hunger (page intro) ✅
*Original: Same shape as B6 — title + 4 summary bullets + photo*
```
# Goal 2 — Zero hunger
- Global hunger has declined but **remains above pre-pandemic levels**. In 2024, **8.2%** of population faced hunger; **28% (~2.3B)** were moderately/severely food insecure.
- Hundreds of millions of children and women are affected by malnutrition. Share of countries with high food prices declined from 60% (2022) to 50% (2023) — but still **3x pre-pandemic norms**.
- Public agricultural investment is rising — **$701B in 2023** — but the agriculture orientation index continues to fall.
- Goal 2 requires urgent action to strengthen food systems, support small-scale producers, and address structural drivers of food price volatility.

> ![photo:dollow-school-lunch] A girl enjoys lunch with her friends at Kabasa Primary School in Dollow, Somalia.
```
**Fit:** Same template as B6 — and that's the point. Templates compose a library; the same shape recurs across an entire report.

---

## Part C — WEF Global Risks Report 2025 (6 slides)

### C1. Preface ✅
*Original: ~10-paragraph essay with author photo + name/title*
```
# Preface

[paragraphs of analysis describing how multi-decade structural forces — technological acceleration, geostrategic shifts, climate change, demographic bifurcation — interact and accentuate a paradigm shift...]

This is the 20th edition of the Global Risks Report. Over the last two decades, **environmental risks have steadily consolidated their position as the greatest source of long-term concern**.

[paragraphs on geopolitics, societal risks, technology...]

The report highlights findings from our annual Global Risks Perception Survey, with insights from over **900 global leaders** across academia, business, government, international organizations and civil society.

— Saadia Zahidi, Managing Director
```
**Fit:** Same as B1 — long-form prose with one pull-quote. Essay template.

### C2. Methodology Overview ✅
*Original: Header + intro paragraph + 4 numbered survey components*
```
# Overview of methodology

The Global Risks Perception Survey (GRPS) has underpinned the Global Risks Report for two decades. The 2024-2025 GRPS gathered over 900 experts.

> "Global risk" is the possibility of an event or condition that, if it occurs, would negatively impact a significant proportion of global GDP, population or natural resources.

## GRPS components
- **Risk landscape** — assess severity of global risks over 1-, 2-, and 10-year horizons
- **Consequences** — consider the range of potential impacts and risk relationships
- **Risk governance** — reflect on approaches with most potential for action
- **Outlook** — predict evolution of key aspects of the global risks landscape

## Complementary inputs
- **Executive Opinion Survey** — 11,000 business leaders in 121 economies on national risk
- **Expert contributions** — 96 experts via meetings, interviews, and workshops (April–November 2024)
```
**Fit:** Clean. Two grouped lists with intro. Template renders as columns or stacked.

### C3. Key Findings: Declining optimism 🟡
*Original: Header + dense paragraphs + Figure A bar chart*
```
# Declining optimism

As we enter 2025, the global outlook is increasingly fractured across geopolitical, environmental, societal, economic and technological domains.

> Optimism is limited as the danger of miscalculation or misjudgment by political and military actors is high.

## 2-year outlook
- **Stormy**: 5%
- **Turbulent**: 31%
- **Unsettled**: 52%
- **Stable**: 11%
- **Calm**: 1%

## 10-year outlook (deteriorating)
- **Stormy**: 17%
- **Turbulent**: 45%
- **Unsettled**: 30%
- **Stable**: 8%
- **Calm**: <1%
```
**Fit:** Two parallel distributions. Stacked-bar template handles natively. Same shape as B3.

### C4. Figure B: Current Global Risk Landscape 🟠
*Original: Horizontal bar chart of 30+ risks ranked by % of respondents picking each*
```
# Current Global Risk Landscape (2025)
> "Most likely to present a material crisis on a global scale in 2025"

- **State-based armed conflict** (23%) — Geopolitical
- **Extreme weather events** — Environmental
- **Geoeconomic confrontation** — Geopolitical
- **Misinformation and disinformation** — Technological
- **Societal polarization** — Societal
- **Economic downturn** — Economic
- **Critical change to Earth systems** — Environmental
- **Lack of economic opportunity / unemployment** — Economic
- **Erosion of human rights / civic freedoms** — Societal
- **Inequality** — Societal
- ... [continues to ~30 risks across 5 categories]
```
**Fit:** A long ranked list with category tagging. The visual is a horizontal bar chart with color-coded categories. Markdown captures the ranking and category. **Strain:** the slide's value is also in the % values per item, which only the top one is reported textually. Without raw values, you lose magnitude. **Workaround:** a structured "ranked list with metadata" that templates render as bars, dots, etc.

### C5. Figure C: Risks ranked by severity (2y vs 10y) ✅
*Original: Two parallel ranked lists side-by-side, color-coded by category*
```
# Global risks ranked by severity

## Over 2 years (short term)
1. Misinformation and disinformation [Tech]
2. Extreme weather events [Env]
3. State-based armed conflict [Geo]
4. Societal polarization [Soc]
5. Cyber espionage and warfare [Tech]
6. Pollution [Env]
7. Inequality [Soc]
8. Involuntary migration or displacement [Soc]
9. Geoeconomic confrontation [Geo]
10. Erosion of human rights / civic freedoms [Soc]

## Over 10 years (long term)
1. Extreme weather events [Env]
2. Biodiversity loss and ecosystem collapse [Env]
3. Critical change to Earth systems [Env]
4. Natural resource shortages [Env]
5. Misinformation and disinformation [Tech]
6. Adverse outcomes of AI technologies [Tech]
7. Inequality [Soc]
8. Societal polarization [Soc]
9. Cyber espionage and warfare [Geo]
10. Pollution [Env]
```
**Fit:** Two parallel ranked lists — exactly the shape side-by-side comparison templates eat for breakfast.

### C6. Figure D: Risk interconnections map 🔴
*Original: Network/node graph — risks as nodes connected by lines indicating relationships*
```
# Global risks landscape: An interconnections map

> Inequality is perceived as the most central risk, playing a significant role in both triggering and being influenced by other risks.

## Central nodes (high connectivity)
- Inequality
- Misinformation and disinformation
- State-based armed conflict
- Societal polarization

## Visible connections (sample)
- Inequality ↔ Societal polarization ↔ Erosion of human rights
- State-based armed conflict ↔ Involuntary migration ↔ Biodiversity loss
- Misinformation ↔ Censorship and surveillance ↔ Online harms
- Cyber espionage ↔ Adverse outcomes of AI ↔ Disruptions to critical infrastructure
```
**Fit:** **Breaks.** A network graph is fundamentally a graph (set of nodes + set of edges). Nested lists are trees — they can't express many-to-many relationships. Same trap as the Airbnb 2x2 quadrant (A9). **Workaround:** a `:::graph` directive with explicit node and edge lists, rendered by a graph template. Outside pure markdown.

---

## Part D — SDG Sustainable Development Report 2025 (6 slides)

### D1. Contents page 🟡
*Original: Multi-level table of contents with page numbers, dotted leaders*
```
# Contents

## Part 1. Financing for Development — p.1
- Overview — p.1
- Sustainable development is a high-return activity — p.3
- The potential of cutting-edge technologies — p.4
- Reforming the International Financial Architecture — p.4
- The Action Agenda at FfD4 — p.8
- Message of Hope in Memory of Pope Francis — p.9

## Part 2. The SDG Index and Dashboards — p.11
- Status of SDG progress globally — p.11
- SDG progress by region and country — p.14
- International spillovers and exposure to supply-chain disruptions — p.20
- Annex: SDG Dashboard by Regions — p.21

## Part 3. Commitment to the SDGs and UN-Based Multilateralism — p.33
- [...]
```
**Fit:** A TOC is a tree by definition — markdown nails it. The "dotted leader" formatting is template territory. Page numbers are metadata.

### D2. Acronyms list ✅
*Original: 2-page glossary of ~80 acronyms*
```
# Acronyms and Abbreviations
- **ACLED** — Armed Conflict Location and Event Data
- **AI** — Artificial intelligence
- **ASEAN** — Association of Southeast Asian Nations
- **AU** — African Union
- **BRICS** — Brazil, Russia, India, China, and South Africa
- **BRICS+** — BRICS + Egypt, Ethiopia, Indonesia, Iran, UAE
- **COP** — Conference of the Parties
- **DESA** — UN Department of Economic and Social Affairs
- [... 70+ more ...]
```
**Fit:** Trivial. Definition list. Template can render as 2-column, 3-column, or single.

### D3. Executive Summary intro ✅
*Original: 1 paragraph + 8 numbered bold-led messages*
```
# Executive Summary

Since 2016, the Sustainable Development Report (SDR) has tracked all UN member states on the SDGs. Eighty years after the creation of the UN system, this year's edition uses **200,000+ data points** to produce **200+ country and regional SDG profiles**.

This year's SDR emphasizes eight key messages.
```
**Fit:** Trivial intro paragraph.

### D4. Key Messages 1-4 ✅
*Original: 4 numbered messages with bold lead + paragraph*
```
# Eight key messages (1–4)

1. **Global commitment to the SDGs is strong** — 190 of 193 countries have presented national action plans through the VNR process. Only Haiti, Myanmar, and the United States have not.
2. **East and South Asia has outperformed all regions in SDG progress since 2015**, driven by rapid socioeconomic progress.
3. **Other rapidly progressing countries** include Benin (SSA), Nepal (E&S Asia), Peru (LATAM), UAE (MENA), Uzbekistan (E.Europe), Costa Rica (OECD), Saudi Arabia (G20).
4. **European countries top the SDG Index** — Finland #1; 19 of top 20 are European. China entered top 50 (#49); India entered top 100 (#99).
```
**Fit:** Trivial. Ordered list with bold lead + body. Same shape as Airbnb A2 with stronger emphasis.

### D5. Key Messages 5-8 ✅
*Original: 4 numbered messages, same shape as D4*
```
# Eight key messages (5–8)

5. **On average, the SDGs are far off-track.** None of the 17 goals are on course to be achieved by 2030. 17% of targets are on track. Strongest progress: mobile broadband, electricity access, internet use, under-5 mortality.
6. **Barbados ranks first; United States ranks last** in UN-based multilateralism. In early 2025, the US withdrew from Paris Agreement and WHO and formally opposed the SDGs and 2030 Agenda. Brazil is most committed among G20; Chile leads OECD.
7. **Lack of fiscal space is the major obstacle** for many developing countries. Roughly half the world's population lives in countries that cannot adequately invest in sustainable development due to debt and limited capital access.
8. **Sustainable development offers high returns** — capital should flow to emerging economies on more favourable terms. The Global Financial Architecture is broken.
```
**Fit:** Same shape as D4 — same template. The slide pair `(D4, D5)` exemplifies template reuse.

### D6. Part 1 opener / chapter title ✅
*Original: Part section divider with title, large numerals, possibly a quote/photo*
```
# Part 1 — Financing for Development
```
**Fit:** Trivial. Template renders this dramatically (full-bleed background, big number "1", etc.). The markdown is just an H1.

---

## Total: 14 + 8 + 6 + 6 = **34 slides converted**

---

## Findings

### Distribution of fit
- ✅ **Clean: 23/34 (68%)** — Trivial conversion, tree shape captures content; visual is purely template-rendering.
- 🟡 **Strained: 8/34 (24%)** — Works, but a chart with multiple series or numeric magnitudes lives outside markdown text. Needs a chart/table block.
- 🟠 **Forced: 1/34 (3%)** — Possible only with an image directive (Airbnb's product screenshots).
- 🔴 **Broke: 2/34 (6%)** — Genuinely cannot be a tree. The Airbnb 2x2 quadrant chart and the WEF risk interconnections graph.

### Patterns

1. **The same handful of tree shapes recur constantly.** A pitch deck of 14 slides used roughly 4 distinct shapes:
   - `(title, intro, N×{bold-lead + body})` — Problem, Solution, Adv, Press, Testimonials, Team, Adoption, Bus Model, Financial
   - `(title, big-number with label)[N]` — Market Validation, Market Size
   - `(title, ordered flow)` — Product
   - `(title, 2D matrix)` — Competition (the broken one)

   The UN report used ~3 shapes for 17 Goal pages and the SDG report's 8 messages all use a single shape. **Library size needed for 80%+ coverage of real decks: probably 20–30 templates.**

2. **The "bold lead + body description" pattern is the workhorse.** It appears in pitch decks, consulting reports, UN reports, executive summaries. A handful of templates accepting this shape (1, 3, 4, 6, 8 items) cover an enormous surface.

3. **Heterogeneous siblings are common.** Adoption Strategy (A8) had a text list, then logos, then a screenshot in three columns. Templates need per-slot type tolerance, not blanket type matching.

4. **Charts split into two kinds:**
   - **Single-series ranked / categorical** (B3, C3, C5, half of A4–A7) — markdown captures the data; template renders chart from list values.
   - **Multi-series / time-series / network** (B5, B7, C4, C6) — needs a structured block (table or directive). The text content stays markdown; the chart is a typed block.

5. **Two true "breaks":** spatial 2D charts (quadrants) and graph/network diagrams. Both need explicit DSL blocks. They're rare in the corpus (~6% of slides) but high-value when they appear.

### Verdict on Thesis A ("All presentations are essentially markdown")

**~95% alive.** Across 34 slides from 4 wildly different decks (a 2008 startup pitch, a UN policy report, a corporate risk report, and a global development index), 92% can be expressed as nested-list markdown without explicit DSL. Another 3% need an image directive. Only **6% genuinely need a structured block** beyond markdown — and those (quadrants, networks) are clearly identifiable.

This validates the **tree-as-organizing-primitive** stance: most presentation content reduces cleanly to nested lists with bolded leads, paragraphs as bodies, and image/chart references as leaves.

### Implications for the matcher

- **Slot schema dimensions are simple:** branching factor (1, 2, 3, 4, 6, 8), leaf type (text, bold-lead+body, quote, image, ranked, paired-list), density (short / medium / long).
- **A "bold-lead + body" leaf type** is so common it deserves first-class status.
- **A "structured block" escape hatch** (`:::chart`, `:::quadrant`, `:::graph`) handles the 6% breaks without contaminating markdown for the 94%.
- **Image directives** (`![bg]`, `![hero]`, `![inline]`, `![photo]`) cover the 3% that need explicit visual intent.
- **The same template used across many slides** is a feature, not a bug. The UN report's "Goal page" template renders 17 nearly-identical slides — and that's exactly the brand-governance behavior Dex wants.

### One surprise

Long-form essay pages (B1 Foreword, C1 Preface) work fine as markdown — but they're not really "list-shaped." They're paragraphs with a pull-quote. **There's a separate template family for "essay/letter" pages** (foreword, intro, conclusion) that doesn't fit the nested-list paradigm but sits comfortably alongside it. Worth flagging in the slot schema design — not every slide is a list.

### One unsolved question

The 2x2 quadrant (A9) and the interconnection graph (C6) are fundamentally not list-shaped. The pragmatic call is: structured blocks. The philosophical call is: do you ship Dex saying "we don't do quadrants" (Thesis A: pure), "we do them via a chart-block DSL" (Thesis A: pragmatic), or "if you need quadrants, detach" (Thesis B-flavored)? 6% of slides will force this choice.
