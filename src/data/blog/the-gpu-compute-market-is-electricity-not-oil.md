---
title: "The GPU Compute Market Is Electricity, Not Oil (Part 1)"
author: Dendi Suhubdy
pubDatetime: 2026-04-23T08:00:00Z
featured: false
draft: false
tags:
  - gpu
  - compute
  - commodity-markets
  - electricity
  - derivatives
  - market-microstructure
  - ai-infrastructure
description: "GPU compute is being financialized the way oil was in the 1980s, but the correct commodity analogue is electricity, not oil. A rigorous look at the microstructure: perishability, locational marginal pricing, basis risk, standardized units, forward curves, and why the math breaks where the electricity analogy breaks. Part 1 of a two-part series."
---

Don Wilson, the DRW founder who helped mainstream VIX options and crypto futures, told the *Wall Street Journal* that the total dollars spent on compute will exceed the total dollars spent on oil within ten years. Kelly Littlepage, the OneChronos CEO building a combinatorial-auction market for GPU-hours with Nobel laureate Paul Milgrom, put it more precisely: *"GPUs are about to be the largest unhedged corporate asset class on the planet. These other markets are hedged down to the penny. And then you have GPUs, which everyone is treating like power and oil, but which fundamentally still is not."*

Everyone reaches for oil as the analogy. It is the wrong analogy.

GPU-hours behave almost nothing like oil. They behave almost exactly like electricity. Once you take that seriously, everything about the emerging market structure—the index providers, the auction venues, the term contracts, the basis trades, the hedging failures, the cash-settled perpetuals—becomes predictable from a century of electricity market experience. This post is the rigorous version of the claim. A second post will cover what it means for the rest of us.

---

## Table of contents

---

## Why oil is the wrong analogue

A commodity's microstructure is dictated by five physical properties: storability, fungibility, divisibility, transportability, and unit definition. Oil scores high on all five. A barrel of WTI at Cushing is fungible with a barrel of WTI at Cushing produced last Tuesday; you can put it in a tank; you can pipe it; you can load it on a VLCC and take it to Rotterdam; it trades against a single globally-understood benchmark with a handful of named grades (Brent, WTI, Dubai) whose basis differentials are stable and arbitrageable.

GPU-hours fail four of those five tests:

1. **Non-storable.** An idle H100-second is gone forever. You cannot inventory compute. This is not an engineering problem—it is a thermodynamic one. The second the allocation window closes, the economic good evaporates.
2. **Non-fungible across quality.** An H100-hour is not a B200-hour is not an MI300X-hour is not an RTX 4090-hour. Worse: an 8×H100 HGX node with NVLink and InfiniBand is a different economic good than eight unconnected H100s in the same region. Interconnect topology dominates raw FLOPs for training workloads, and that can't be arbitraged away.
3. **Locationally bound.** Latency-sensitive inference cannot cross oceans. Training runs can cross oceans but only if the interconnect is inside a single failure domain. You cannot "ship" compute between Ashburn and Frankfurt the way you ship WTI from Cushing to Rotterdam—the electrons arrive too late for anything real-time.
4. **Unit-definition ambiguous.** OneChronos' Silvia Console Battilana, describing the actual work of building the auction, said: *"We spent a lot of our time defining what is exactly for sale."* Milgrom called the building-block definition "magic sauce" and declined to specify. In an oil market this is settled in the 19th century. In compute, it is still open.

Electricity fails exactly the same four tests. A megawatt-hour in ERCOT West is not the same economic good as a megawatt-hour in ERCOT North, because transmission is finite. A megawatt-hour at 3pm is not the same good as one at 3am, because the grid must balance in real time. You cannot store electrons at scale—pumped hydro, batteries, and thermal storage are all imperfect proxies, and the marginal megawatt is always perishable. And the unit definition—what counts as "firm" vs. interruptible, regulation-up vs. regulation-down, capacity vs. energy—is the entire architecture of modern ISO markets.

That is why the correct mental model is: **GPU compute is an ISO, not NYMEX.**

---

## The five-way mapping

Once you accept the framing, the correspondences are tight enough to do real work with.

| Electricity concept | GPU compute analogue | What it controls |
| --- | --- | --- |
| Locational Marginal Price (LMP) | Regional $/GPU-hour (us-east vs us-west vs Frankfurt) | Where you schedule the workload |
| Real-time vs day-ahead | On-demand spot vs reserved / committed | Intraday urgency premium |
| Capacity vs energy | Reservations vs utilization | What you pay for idle vs running |
| Ancillary services (regulation, reserves) | Flexible training, burstable inference | Who gets paid to move load around |
| Transmission constraints | Interconnect + cross-region latency | Where basis blows out |
| Forward curve | Term contracts / futures strip | The price of time |
| Demand response | Batchable training jobs | The flexible load that clears congestion |
| Fuel stack | GPU SKU mix (H100/H200/B100/B200/MI300X) | Merit-order dispatch |

Every line of that table has a paper behind it in the electricity literature. All of it is being re-derived in real time in the GPU market, usually without the authors realizing it.

---

## The math: spot, basis, and the forward curve

Start with the single-cell pricing model. Let $P_{r,t}$ be the clearing $/GPU-hour at region $r$ and time $t$ for a fixed SKU (say, H100 SXM 80GB). In equilibrium, spot price equals the marginal cost of the last unit dispatched:

$$P_{r,t} = c_r + \lambda_{r,t} + \mu_{r,t}$$

where:
- $c_r$ is the merit-order operating cost in region $r$ (amortized capex + power + cooling + interconnect depreciation)
- $\lambda_{r,t}$ is the shadow price on the regional capacity constraint at time $t$ (zero when there is slack, large when sold out)
- $\mu_{r,t}$ is the shadow price on any binding export constraint (cross-region transit, jurisdictional controls)

This is exactly the ISO pricing formula with a relabeling. The headline number that everyone quotes—Silicon Data's SDH100RT at \$2.37 on 27 May 2025—is the volume-weighted average of $P_{r,t}$ over 30-plus global source providers, normalized. It is the compute-market analogue of a spot power index.

Basis is the difference between two regional prices for the same SKU at the same time:

$$\text{Basis}_{r_1, r_2, t} = P_{r_1, t} - P_{r_2, t}$$

Empirically, the basis is nonzero and persistent. IEEE Spectrum's data has a \$1.04/hour East-West H100 gap in early 2025 on the Silicon Data index, and a separate analysis shows general-purpose GPU rentals running 15–30% higher on the West Coast than the East. In an oil market that spread would be arbitraged to transportation cost in days. In a compute market it cannot be arbitraged at all, because you cannot physically move the GPU on that timescale, and you cannot ship the workload if it is latency-bound.

This is the single most important microstructural fact in the GPU market: **compute basis is structural, not transitional.** It will not converge. It can only be traded.

The forward curve is the set of prices at which you can lock in future delivery:

$$F_{r, T} = \mathbb{E}^{\mathbb{Q}}\left[P_{r, T}\right] + \text{risk premium}$$

The risk premium in a non-storable market is large and sign-ambiguous. Oil has a cash-and-carry arbitrage that pins the forward curve to spot plus storage cost plus financing. Electricity does not—the forward curve reflects expectations of future scarcity, weather, outage risk, regulatory change. It is famously ugly. GPU forwards will be equally ugly, for exactly the same reason. Compute Exchange runs a "Forward Contracts" tab in its nav; Architect Financial Technologies, the firm Brett Harrison built after leaving FTX US, partnered with index provider Ornn in January 2026 to launch the first exchange-traded perpetual futures on daily GPU rental prices and DRAM prices. Cash-settled. Margin in USD or USD stablecoins. Institutional only.

The perpetual structure is itself a tell. You use perpetuals when the underlying has no natural delivery date and you cannot warehouse the physical. Nobody builds perpetual futures on oil, because oil wants a forward curve with real expiries. Electricity has cash-settled monthly contracts at every major ISO hub. Compute will converge to that, with perpetuals as the liquidity bootstrap.

---

## The quality stack: merit order for GPUs

Electricity markets dispatch by merit order. The cheapest unit on the supply curve clears first, then the next, then the next, until demand is satisfied. The marginal unit sets the price for everyone.

Compute has the same structure, with a twist. The "fuel stack" is the menu of GPU SKUs:

- **Consumer / gaming cards** (RTX 4090, 5090) — cheapest, smallest memory, no HBM, no NVLink. Run small inference and fine-tunes. Priced on RunPod / Vast.ai around \$0.30–\$0.70/hour.
- **A100 80GB** — last-generation data-center card. Workhorse for medium training and inference. ~\$1.50–\$2.00/hour.
- **H100 SXM 80GB** — flagship for 2023–2025. ~\$2.00–\$3.50/hour global spot; Silicon Data's 27 May 2025 global index: \$2.37.
- **H200** — memory-expanded H100. ~\$3.00–\$4.50/hour.
- **B200** — Blackwell generation, 2x–3x H100 throughput for most workloads. ~\$4.40–\$8.00/hour spot; AWS Capacity Block ~\$9.36/GPU-hour; GCP spot ~\$6.69.
- **MI300X** — AMD's datacenter flagship. Less liquid secondary market; roughly H100-competitive on inference, still illiquid on training.

On the supply curve this looks like a staircase. The key microstructural observation is that a sudden demand shock dispatches up the stack: when H100s sell out, workloads that can tolerate the downgrade dispatch to A100s; workloads that cannot dispatch to H200 or B200 at a premium. The shape of the staircase—the size of each tier's installed base and its price gap to the next tier—determines how volatile the top-of-stack price will be.

Compute Desk's "There is no GPU price" shows this happening in real data: H100 on-demand held around \$3.00/hour through the winter of 2025–2026 and then spiked to \$3.50 in March 2026 as capacity across providers hit zero availability. B200 on-demand exploded from \$5.70 to over \$8.00 in weeks. Silicon Data's B200 Index spiked from \$4.40 to \$6.11 and then pulled back to \$5.47—a 39% rip and a retracement inside a single quarter.

That volatility is not a bug in price discovery. It is the shape of the supply curve. If you want it to flatten you need a deeper fuel stack or more capacity; neither is available on tradable timescales.

---

## Why four indices don't agree

Compute Desk's core observation is that four different providers—Silicon Data (SDH100RT), Ornn AI, Compute Desk, SemiAnalysis—publish H100 price indices that visibly diverge. In a mature commodity market this would be a scandal. In electricity it is the norm.

PJM, ERCOT, CAISO, NYISO, and MISO all publish separate LMP prints. Platts, Argus, and S&P Global Commodity Insights all publish competing electricity and gas benchmarks. They disagree because they survey different pools of trades, weight differently, normalize differently, and include different products. The relevant question is not "which index is right" but "which index is the reference price for my contract."

The same will be true of GPU indices. Silicon Data, backed by DRW, Jump Trading, and Wintermute Ventures, is going first. Their SDH100RT hit Bloomberg terminals on 27 May 2025, published daily at 16:00 UTC, built from 3.5M pricing data points per calculation across 80%+ of the global H100 rental market. It is the compute-market Platts. But Silicon Data is a price-reporting agency, not a venue. Compute Exchange is a venue. OneChronos+Auctionomics is a venue with combinatorial auction mechanics. Architect/Ornn is a derivatives venue running cash-settled perpetuals on an Ornn index.

The separation of the price-reporting agency from the venue is load-bearing. It is how every mature physical-commodity market works. Oil has Platts and Argus separate from NYMEX and ICE. Electricity has Platts and ICE separate from the ISO day-ahead auctions. Compute is converging to exactly that architecture. It took oil a hundred years. It is taking compute three.

The fact that DRW appears on the cap table of both Silicon Data (the PRA) and Compute Exchange (the venue) is not a coincidence. It is the same playbook DRW ran on VIX options and crypto. Get the price transparency layer tradable, then build the derivatives on top.

---

## Where the electricity analogy breaks

Every analogy has a breaking point. Three of them matter for compute, and ignoring them is how you lose money.

**1. The underlying depreciates.** An electron produced today is identical to one produced a decade from now. An H100 today is 20% slower than a B200, and in two years it will be 50% slower than Rubin. Eugene Cheah put the consequence cleanly: *"Advancement in GPU will bring price down. Ironically, the biggest threat to H100 GPU rental prices is Nvidia themselves."* The forward curve on any specific SKU is biased downward by the product roadmap. This matters for anyone writing long-dated forwards. It is why you see Architect/Ornn launching with perpetuals—perpetuals sidestep the problem by never committing to a delivery date far enough out for the silicon roadmap to embarrass them.

**2. The underlying is re-rentable.** The AI Street piece articulated it: *"Most commodities are consumed once—electricity included—whereas GPU hardware can be re-rented until it depreciates. This builds in scarcity."* A GPU-hour is consumed once, but the GPU that produced it can produce another hour next second. This is the ultimate difference between compute and electricity: an ERCOT turbine is always ready to produce the next megawatt-hour, but the marginal supply in the electricity market is set by fuel and labor cost; the marginal supply in the GPU market is set by the amortized capex of the silicon itself, and the capex is falling fast. The implication is that the compute supply curve's slope is endogenous to Nvidia's roadmap in a way no electricity market has to deal with.

**3. Price direction is one-sided.** A commenter on the Upstarts piece on OneChronos made the sharpest observation in the entire corpus: *"Because GPU compute prices trend downward, traditional options/hedging may not work—unlike oil, price direction is too one-sided to support balanced hedging books. Options prices will be way too expensive or the market for it will become illiquid."* This is the put-call parity problem. A symmetric options market needs a rough two-sided distribution of future prices. In a secularly falling market, the demand for puts (protection against further decline) dominates and the demand for calls (upside) collapses. Market makers either widen spreads to prohibitive levels or refuse to quote. This is exactly what happened to memory chip options in the 1990s.

But this analysis is incomplete. GPU prices are secularly down in *quality-adjusted* terms. In nominal terms they spike—see March 2026. A well-designed futures contract on a specific SKU at a specific location produces a two-sided distribution around a declining mean. The put-call asymmetry shrinks to something manageable. This is why SKU-specific, region-specific contracts are the only ones likely to work. A "compute futures" contract that tries to aggregate across SKUs and regions is doomed for exactly the reason the commenter identified.

---

## The infrastructure that's actually being built

Three layers, all being built in parallel, by people who know what they are doing:

**Layer 1: Price reporting.** Silicon Data (Carmen Li, ex-Bloomberg, \$4.7M seed from DRW/Jump/Wintermute, SDH100RT on Bloomberg from 27 May 2025). Extensions: GDDR6 Spot Price Index, B200 Index. Product: Silicon Navigator (dashboard), T-Guard (data pipeline), API. Positioning: *"If American Airlines couldn't hedge oil, they couldn't price tickets. Compute is going to be bigger than oil someday. But right now, it doesn't have the basic financial tools that every other commodity does—no futures, no options, no visibility."*

**Layer 2: Physical venue.** Compute Exchange (Simeon Bochev, ex-Apple/Lambda; co-founder Don Wilson of DRW; Woodside AI). Live auctions, real-time pricing across verified providers. As of April 2026: 75 providers on the network, 100,000+ listed GPU units, 1,000+ GPUs actively deployed, claims of \$1B+ compute supply facilitated since the first post-launch auction on 25 February 2025. Supply-side counterparties named publicly: Gcore, Nebius, Nscale, Massed Compute, Boostrun, Denvr Dataworks, Hyperstack, STN, Voltage Park, IO.net, DataCrunch. Demand-side: Modular is the case study. Standardized contracts and a "Forward Contracts" product in the nav.

**Layer 3: Financial venue.** OneChronos + Auctionomics (Kelly Littlepage + Paul Milgrom, the 2020 Nobel laureate for auction theory). Combinatorial smart-market auctions for managed GPU compute—spot resale of excess capacity plus futures/forwards. Stephen Johnson: *"Why is there a hedging market for every other type of commodity, but not compute? We think a lot of it is just the complexity of the instrument type, and how fast it moves."* Separately, Architect Financial Technologies (Brett Harrison, ex-FTX US) announced in January 2026 that its AX exchange will list the first exchange-traded compute futures, using Ornn Data's index as the underlying, cash-settled, perpetual structure, institutional-only.

If you squint at this and see the oil market in 1983—NYMEX launching WTI futures with the existing Platts spot market as the underlying, Koch and Vitol figuring out how to hedge physical flows against the paper curve—you are seeing it correctly. The same people who financialized one commodity cycle are financializing this one. Don Wilson's quote is not hyperbole: *"The total dollars spent on compute will, over the next 10 years, exceed total dollars spent on oil."* He is not saying this to be quoted. He is saying it because he is building the infrastructure that makes it true.

---

## The standardized-unit problem

This is the one piece of the architecture that is not yet solved, and I think it is the most interesting piece.

Every mature commodity has a canonical unit. One barrel of WTI = 42 US gallons of light sweet crude delivered to Cushing, Oklahoma. One megawatt-hour at ERCOT North Hub = 1,000 kWh of energy delivered over one hour at a specified location on the ERCOT grid. These definitions are precise to the point of pedantry because the entire financial superstructure depends on them.

Compute has no such unit. Dave Friedman proposed *"the H100-hour is a unit like a barrel of oil."* That is attractive but underspecified. Is it one H100 GPU for one hour at the device? Is it one eighth of an 8×H100 HGX node with NVLink enabled? Does it include InfiniBand fabric? Which generation of H100 (SXM vs PCIe, 80GB vs 94GB)? Which CPU pairing (IEEE Spectrum noted Intel-CPU A100 bundles carry a 40% premium over alternatives)? Which hypervisor overhead assumption?

OneChronos' Console Battilana: *"We spent a lot of our time defining what is exactly for sale."* Milgrom called it "magic sauce" and refused to specify.

This is not lazy. It is hard. The closest analogue is the product-definition work that went into the CME's PJM Western Hub peak-period electricity contract: the finalized spec is 16 pages and took years of stakeholder negotiation. A GPU contract spec will need to pin down SKU, memory tier, interconnect topology, fabric spec, power envelope, delivery region, settlement-time window, preemption rules, and reference index. Until that spec is finalized and adopted, every "GPU contract" is a bespoke trade, and the market cannot aggregate.

The race is to get there first. Whoever ships the standardized spec that the big three buyers (hyperscalers, foundation-model labs, neocloud operators) all accept gets to be the WTI of compute. Compute Exchange is pushing "one universal set of terms." OneChronos is keeping theirs proprietary for now. Silicon Data is standardizing at the index level. Architect is standardizing at the cash-settled derivative level. The four approaches are complementary, not competitive, and the winner will probably be the combination that clears the first \$10B of notional.

---

## The hedging demand is already here

People forget how much of modern finance was built to hedge unhedged exposures that already existed. Farmers were hedging grain in bespoke forwards before the CBOT standardized them in 1864. Airlines were hedging jet fuel in OTC swaps for a decade before NYMEX heating-oil futures became useful. Miners were hedging copper bilaterally before the LME was a consolidated market.

The unhedged exposure in compute is enormous and growing:

- **CoreWeave** ended 2025 with a \$66.8B contracted revenue backlog, which expanded to \$87.8B after the Meta deal in early 2026. OpenAI is the anchor at ~\$22.4B; Meta at ~\$14.2B. These are take-or-pay contracts: customers owe whether or not they consume. That is a long-dated swap book with no hedging instrument on the other side. The balance sheet is already a derivative; the derivative is just illiquid.
- **Every foundation-model lab** has a capital expenditure curve that commits to tens of billions of dollars of future compute, priced at bespoke terms with individual providers. Anthropic has talked publicly about training-compute costs going from \$100M to \$1B to a projected \$10–100B per run. None of that is hedged.
- **Every AI-using enterprise** is signing multi-year commitments with Azure, AWS, and GCP at fixed or reserved rates, while their competitive environment demands they commit to inference workloads whose cost curves are radically uncertain. This is exactly the position American Airlines was in before jet-fuel swaps existed.

Silicon Data's Carmen Li put the consequence cleanly: *"These startups were building cutting-edge models, but they were locked into SaaS pricing while their compute costs were all over the place. Their revenue was static, but their costs could triple overnight. There was no way to hedge."*

The structural demand for a hedging product is larger than the oil-and-gas hedging demand of 1983. Dave Friedman set himself a falsification bet: if open interest in GPU-hour futures hasn't broken \$300 billion by January 2028, his thesis is wrong. I think that number is conservative.

---

## What will drive the price

From the electricity mental model, five forces set the spot price:

1. **Fuel stack economics.** TSMC's advanced packaging (CoWoS) capacity. HBM3E/HBM4 supply from SK Hynix, Samsung, Micron. Nvidia's allocation algorithm. AMD's MI350/MI400 timing. Every one of these is a supply-side shock vector, and every one of them is lumpy—fabs don't smooth, they step.
2. **Transmission constraints.** ERCOT's interconnection queue hit 410 GW in April 2026, up from 63 GW at end-2024 and 226 GW in November 2025—roughly 550% growth in 16 months, and 87% of the queue is data centers. PJM has 30,000 MW of generation still in its 2026 transition queue, with 63,000 MW total to clear by year-end. The binding constraint has migrated from silicon to watts. Jensen Huang said it cleanly at GTC 2026: *Revenue = (Tokens per Watt) × (Available Gigawatts).* Watts are the tighter scarcity.
3. **Demand response.** The flexible load in a compute market is batchable training. If overnight training workloads can be shifted by six hours, they function the way interruptible industrial load functions in ERCOT—they clear congestion at a lower price than peakers. This is the asset class that hyperscalers are quietly building up. A liquid compute futures strip will eventually price the option value of this flexibility directly.
4. **Jurisdictional basis.** The 15 January 2026 BIS rule moved H200 and AMD MI325X export license review for China from "presumption of denial" to "case-by-case." Blackwell remains fully restricted. The US added a 25% tariff on advanced computing chips produced abroad that transit the US before re-export. These do not reduce supply—they fragment the market geographically, creating a hard basis between Tier-1 (US/allies) and Tier-3 (restricted) regions. In oil-market terms, they create a Urals discount.
5. **Efficiency.** Nvidia's Vera Rubin generation claims 5× inference speed and a 10× reduction in token cost over Blackwell Ultra. This translates through to the forward curve. A buyer entering a 3-year reserved contract at \$3.00/H100-hour today is implicitly paying a large premium over the expected 2027 price. The contract only makes sense as a hedge against the volatility of price, not a bet on its direction.

Nothing in this list is a surprise if you have ever looked at an electricity pricing paper. All of it is a surprise to people who think compute is like oil.

---

## The part that is actually new

Here is what is genuinely unprecedented, and what the electricity analogy does not capture.

The underlying asset in electricity is a turbine. The useful life of a turbine is 30–50 years. The cash flows are long-duration. The hedging instruments can be long-duration without counterparty risk blowing up. The silicon content of a GPU has a useful commercial life of maybe 5 years and a competitive half-life closer to 18 months. This compresses every tenor on the compute forward curve. You cannot run a 10-year compute future. The underlying will be obsolete. You can run a 3-year future, maybe, on a specific SKU. Most of the liquidity will be in the front month.

Compound this with the fact that the end-use demand—AI inference and training—is growing as a function of technology that is also changing fast. The price per token fell roughly 80% from early 2025 to early 2026. Anthropic cut Claude Opus 4.5 input from \$15 to \$5 per million tokens—a 67% reduction. Gemini 3 Pro is priced at \$2 input / \$12 output per million. But OpenAI spent \$8.67B on inference in the first nine months of 2025—nearly 2× their revenue over the same window. Jevons paradox in real numbers: unit price down, aggregate spend up.

What this means for the compute forward curve is that both the cost side and the demand side are moving fast in opposite directions, and the price you see is the equilibrium between them. In electricity the supply side moves on decadal timescales (new capacity) and the demand side moves on annual timescales (load growth, weather). In compute both sides move on quarterly timescales. The implied volatility of compute futures should be higher than any electricity contract ever written.

And it will be. Watch the first year of Architect/Ornn's perpetuals and the first year of real OneChronos volume. My prediction: realized 3-month volatility on H100 spot closes above 60% annualized. If it does, the electricity analogy is correct—that is power-market-level volatility, not oil-market-level. If it closes below 30%, something more oil-like is happening and I am wrong.

---

## What I got wrong in the framing

I want to flag one thing before closing.

The analogy I have been pushing—GPU-compute-is-electricity—is the right analogy for the *market structure*. It is not the right analogy for the *asset*. The asset is a depreciating, rapidly obsoleting piece of silicon with a downward-sloping quality-adjusted price curve. Electricity does not have this. Oil does not have this. Memory chips have this, and memory futures have never liquidly developed despite decades of trying.

The bet embedded in Compute Exchange, OneChronos, Silicon Data, and Architect/Ornn is that the market-structure analogy dominates the asset-structure analogy—that the perishability, locational pricing, and forward-curve hedging demand are powerful enough forces that they overcome the memory-chip problem.

I think they will. I think the reason is that the tokens-per-watt output of a GPU, not the silicon itself, is the commodity being traded. Tokens-per-watt is a flow, not a stock. It does not obsolete. It does not depreciate. It compounds. And Jensen's framing—*"the Token Factory"*—is not marketing; it is the economic argument that makes the compute market structurally permanent even as the specific silicon underneath it turns over every two years.

That is the bet. We will know by January 2028 whether it was right.

---

## Part 2

In the [second post](/posts/what-a-real-gpu-compute-market-means-for-everyone/), I take this microstructure and ask what it means for everyone who does not run an exchange or a hedging desk—for consumers, developers, AI labs, datacenter operators, and nations.

---

## References

- Simeon Bochev, Don Wilson, Arkady Volozh. *Compute Exchange Launches to Transform How AI Compute is Bought and Sold.* BusinessWire, 28 January 2025.
- Kelly Littlepage, Stephen Johnson, Paul Milgrom, Silvia Console Battilana. *OneChronos and Auctionomics Launch First Auction Market for GPU Compute.* Upstarts Media (Alex Konrad), 29 July 2025.
- Matt Robinson. *The Emerging Market for Trading "Compute."* AI Street, 22 May 2025.
- Carmen Li, Nima Olumi. *How Silicon Data is Bringing Transparency to the GPU Market.* Founders Press, 28 March 2025.
- *There Is No GPU Price.* Compute Desk, 2026.
- Dave Friedman. *When GPU Compute Becomes a Commodity* and *The GPU Market Will Be Bigger Than [Oil].* Substack, 2025–2026.
- Eliza Strickland. *Silicon Data Launches World's First Daily GPU Rental Index.* IEEE Spectrum, 28 May 2025.
- Brett Harrison, Ornn Data. *Architect Financial Technologies Partners with Ornn to Launch Exchange-Traded Futures on GPU and RAM Prices.* PR Newswire, 21 January 2026.
- *United States Graphics Processing Unit (GPU) Research Report 2025: A \$136.07 Billion Market by 2033 from \$19 Billion in 2024.* ResearchAndMarkets via GlobeNewswire, 28 November 2025.
- Citrini Research. *Agentic Utilities.* 25 March 2026.
- ERCOT. *2026 Long-Term Load Forecast.* April 2026.
- FERC. *PJM Co-Location Ruling Guide.* 2025–2026.
- BIS. *Export Administration Regulations, H200 Rule.* 15 January 2026.
