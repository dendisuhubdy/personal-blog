---
title: "What a Real GPU Compute Market Means for Everyone (Part 2)"
author: Dendi Suhubdy
pubDatetime: 2026-04-23T09:00:00Z
featured: false
draft: false
tags:
  - gpu
  - compute
  - ai-inference
  - jevons-paradox
  - power-grid
  - economics
  - ai-infrastructure
description: "If GPU compute becomes a proper commodity market — with spot indices, futures, perpetuals, and basis trades — what changes for everyone who doesn't run an exchange? Peak-off-peak AI for consumers, swap books for neoclouds, watts as the binding constraint, and why your phone bill might start looking like your electric bill. Part 2 of a two-part series."
---

This is the second of a two-part series. [Part 1](/posts/the-gpu-compute-market-is-electricity-not-oil/) made the technical argument that the emerging GPU compute market is structurally an electricity market, not an oil market—perishable, locationally bound, heterogeneously priced, with basis risk and a forward curve. This part is the human argument. What does it mean for everyone who will never trade a compute future but whose life will be shaped by one?

The short answer is: more than you think, and in ways that look a lot like what happened to electricity a century ago.

---

## Table of contents

---

## The frame

When the first AC grid went up in 1886, electricity was sold as a curiosity. By 1910 it was a commodity with regional monopolies and a regulated price. By 1930 it had wholesale markets. By the 1990s it had deregulation, day-ahead auctions, basis trades between Zone J and PJM West, and LMP prices that varied by the minute. The cost of a kilowatt-hour fell by a factor of roughly fifty in real terms over that century. Total electricity consumption rose by a factor of more than a thousand.

This is the template for what is about to happen to compute. The price per unit of intelligence will fall. The total amount of intelligence consumed will rise faster. Along the way, market structure will emerge, prices will become dynamic, new asset classes will be invented, nations will treat the underlying infrastructure as strategic, and the experience of being a consumer will quietly change.

I want to walk through what this looks like for each class of participant—consumers, developers, labs, operators, financiers, nations—because the implications are uneven and not obvious.

---

## For consumers: the end of flat-rate AI

Right now, AI is priced like a Netflix subscription. You pay \$20 a month for Claude Pro, \$20 for ChatGPT Plus, \$19 for Gemini Advanced. The price is flat. The underlying compute cost is not.

This is unstable. Every AI product company is running a business where customer acquisition cost is paid upfront and the variable cost of serving those customers is volatile by a factor of three. When H100 spot prices spike from \$2.00 to \$3.50 in a quarter, as they did in March 2026, the gross margin on a flat-rate subscription tier compresses fast. If you are a product company with ten million subscribers at \$20/month, a 75% jump in your compute cost is not a rounding error.

The economic fix is what every commodity-input industry eventually does: pass the volatility through to the consumer via dynamic pricing, or hedge it in the futures market, or both.

For most consumers the user-facing form will be **tiered time-of-use pricing.** You will pay less to ask Claude a question at 3am than at 3pm. The first version of this will be framed as a reward—"use our batch mode and save 50%"—and the second version will be framed as normal. Anthropic already prices batch API calls at 50% of synchronous calls. OpenAI has a similar structure. What is missing is the retail-facing equivalent. It is coming. Watch for consumer AI products to introduce "off-peak" or "background" tiers in the next 18 months.

The second version of this, which will take longer, is **spot inference.** Your AI assistant will run in the background during off-peak hours, pre-computing likely queries, drafting responses to messages you are likely to ask it to respond to, maintaining caches of likely workflows, using the cheap electricity. The peak-hour session will be short and expensive; the off-peak background session will be long and cheap. The economics of this are identical to why your dishwasher has a "delay start" button. Eventually, your AI will too.

The third version, which is further out but will happen, is **inference on your local device** for everything latency-critical, and **inference in the cloud** for everything that requires frontier-model capability. Apple has built the hardware runway for this: every M-series Mac and every A17/A18 iPhone is a local inference engine with enough capability to run a 3B-parameter model at useful quality. Qualcomm's Snapdragon X Elite is doing the same on Windows. The economic force driving this split is exactly the same force that drove electric utilities to install rooftop solar plus grid backup: you want the cheap local source for baseload and the expensive grid for peaks. Compute will bifurcate the same way.

The net effect for the average consumer will not be dramatically more expensive AI. It will be a slightly more jittery price, hidden inside tiered product offerings, accompanied by quiet expansion of on-device capability. You will notice mostly that your phone gets smarter without your cloud bill going up.

---

## For developers: the commodification of inference

When I was doing research at Mila, access to a single H100 for a week was a political event. You wrote memos. You justified. You waited. Three years later, any developer with a credit card can provision one in ten minutes on any of a dozen providers and pay by the second.

This is what commoditization does. It lowers the floor. It also lowers the ceiling.

The floor: every developer now has access to frontier-adjacent inference. The per-million-token price of Claude Opus 4.5 is \$5 input / \$25 output. Gemini 3 Pro is \$2 / \$12. GPT-5 equivalent is similar. The total cost of a capable AI agent running continuously in the background is now less than an Adobe Creative Cloud subscription. This is a staggering amount of capability for very little money, and the secular direction is down.

The ceiling: the economics of differentiation for AI products get harder, not easier. When the underlying inference is commoditized, the differentiation moves to the wrapper—the product, the distribution, the data, the workflows. This is the same dynamic that happened to every commoditized input. The farmers did not get rich; the Kelloggs did. The oil drillers did not get rich; Exxon did. The GPU providers will probably not capture the long-run value; the product companies that build on top of them will.

For individual developers, the practical consequences are:

1. **Your inference bill is about to have a volatility term.** You will need to forecast it. You will need to decide what to pass through to your customers and what to absorb. If you are running an agent product with heavy inference usage, you are running a business that looks more like an airline than a SaaS company, and you should plan accordingly.

2. **Batch and off-peak pricing is a genuine competitive edge.** If your product can tolerate asynchronous latency for 80% of its workload—email processing, document summarization, background research—you can cut your compute COGS in half by routing to batch endpoints. The products that are structurally batch-compatible will have a structural margin advantage.

3. **Multi-provider routing becomes a feature.** The emergence of Silicon Data's price indices, Compute Exchange's auctions, and cross-provider routing layers (OpenRouter, Portkey, etc.) means the cheapest inference at any moment is not always the same provider. The products that integrate dynamic routing will have lower inference costs than those locked into a single hyperscaler. OpenRouter already publishes token-usage and price data that makes this explicit.

4. **Local-first becomes a real architectural option, not a demo.** The cost curve that makes local inference competitive with cloud inference on privacy-and-latency-sensitive workloads crossed a threshold in 2025. For a surprising number of product workloads, a 7B–13B parameter model running on the user's device is enough, and the economics are compelling even before you count the privacy benefit.

The developer-facing experience of a real GPU compute market is, paradoxically, less uncertainty, not more. Transparent prices, publishable forward curves, multi-provider routing, and hedging products all make compute costs more predictable at the product-planning horizon than they have ever been, even if the underlying spot market is more volatile day-to-day.

---

## For AI labs and neoclouds: balance sheets become swap books

This is the part of the story that matters most for anyone who works in AI infrastructure and the part that the popular press has not yet figured out.

CoreWeave ended 2025 with a \$66.8B revenue backlog. That grew to \$87.8B after the Meta deal in early 2026. The anchor customers are OpenAI (~\$22.4B) and Meta (~\$14.2B). These contracts are take-or-pay: the customers owe whether or not they consume.

What that means in financial terms is that CoreWeave is operating an eighty-seven-billion-dollar swap book. Long-dated receivables against short-dated capex obligations, in a market where the underlying price is changing by 30% per quarter. Without a hedging instrument on the other side, this balance sheet is one spot-price shock away from a crisis. With a liquid hedging instrument, it is a boringly profitable financial business.

Every neocloud is in this position. Lambda is in it. Crusoe is in it. Nebius is in it. So is every foundation-model lab with a capex commitment to a specific provider, and every hyperscaler that has signed multi-year reservation contracts with chip suppliers. Silicon Data's Carmen Li put it cleanly: *"There was no way to hedge."*

The emergence of compute futures changes this from an unhedgeable risk into a managed one. The first transaction that matters is not going to be a hedge fund speculating on H100 prices. It is going to be a neocloud using the futures curve to lock in a cost of capital on a new data center build. The second transaction that matters is a foundation-model lab buying a 2-year strip to cap their training compute cost. The third is an insurance product wrapped around a take-or-pay contract—contract performance insurance, basically, where the payout is indexed to the spot vs. contract basis.

Once this market exists, several things happen to the capital stack of AI infrastructure:

1. **Cost of capital for data center buildouts falls.** Today, lenders apply 40–50% haircuts to GPU collateral because they cannot price it forward. A liquid forward curve collapses the haircut to something closer to oil-and-gas asset-backed lending—10–20%. The cheaper financing flows through to lower end-prices, which is how the consumer gets the benefit.
2. **Securitization of compute cash flows becomes feasible.** Today, OpenAI's \$22.4B CoreWeave contract is an illiquid bilateral obligation. Tomorrow, it is a securitized instrument that trades like any other asset-backed receivable. Compute-backed securities. Compute-backed loans. Compute mezzanine. All of it is obvious in retrospect.
3. **Take-or-pay contracts become tradeable.** If you committed to \$500M of compute and your product traction comes in below plan, today you eat the cost. Tomorrow you resell the allocation into the spot market, and the basis difference shows up as a line item. This is not hypothetical—Compute Exchange's launch materials explicitly mention "the option to resell unused capacity" as a product feature.
4. **Project finance works.** The whole toolkit—senior secured debt, PIK notes, preferred equity, sponsor equity—becomes available for data center construction in a way it currently is not. The big capex projects of the AI era get built on the project-finance model, which is how big capex gets built in every other industry.

This is the macro story. The next trillion dollars of AI infrastructure buildout will be financed against forward compute curves, not against founder conviction and VC equity.

---

## For datacenter operators: you are now a power trader

For a long time, running a data center was a real estate play with technology on top. You bought land near cheap electricity, you built the concrete shell, you installed racks, you leased to hyperscalers on long-term contracts, and you optimized for power usage effectiveness.

That business still exists. But the operators who are winning the AI era are the ones who figured out that the real arbitrage is not between cheap land and expensive rent—it is between cheap power and expensive compute.

ERCOT's interconnection queue hit 410 GW in April 2026, of which roughly 87% is data centers. PJM has 30,000 MW of generation still in its 2026 transition queue. Both numbers tell you the same story: the binding constraint on AI infrastructure has moved from silicon to electricity. In 2023 the question was "can I get H100s." In 2026 the question is "can I get a 200 MW interconnection approval in less than four years."

Which means a data center operator's core skill has shifted. The people who win this build do three things simultaneously:

1. **Lock up the power.** Long-term power purchase agreements, behind-the-meter generation, direct colocation with power plants (the FERC PJM colocation ruling cleared a path for this structure), or outright equity ownership of the generation stack. Microsoft restarting Three Mile Island Unit 1. Amazon buying the Susquehanna data center campus. Oracle's Stargate financing. Every one of these is a power play wrapped in a compute story.
2. **Trade the spread.** When the spot price of an H100-hour is \$3.50 and your all-in cost of producing it (power + depreciation + ops) is \$1.80, the spread is your business. When it compresses to \$2.00, the spread goes away. The operators who survive are the ones who can dynamically shift between spot sale, contract commitment, and their own internal workload, arbitraging across the three.
3. **Optimize for dispatch, not throughput.** The most valuable GPU is not the one running at 100% utilization on a fixed workload. It is the one that can be dispatched to the highest-paying workload at any given moment. Operators who build their scheduling infrastructure around this will capture materially more revenue per GPU than those who treat utilization as the north star.

This is the electricity-market playbook, transplanted. The best operators will end up looking less like Equinix and more like Calpine or Vistra—independent power producers who happen to sell their output as compute.

---

## For financial markets: a new asset class worth trillions

Don Wilson thinks compute will exceed oil in notional futures open interest within ten years. That is a \$650–700B figure. Dave Friedman's falsification bet is \$300B by January 2028. Compute Exchange's marketing materials cite a \$5T derivatives trading opportunity.

Pick your number. All of them are big enough to matter.

The asset-class layers as they will actually develop:

- **Spot indices** (already live): Silicon Data's SDH100RT on Bloomberg. Ornn. Compute Desk. SemiAnalysis. These disagree today and will continue to disagree, because they are the Platts-and-Argus layer. Pick your reference; write it into your contract.
- **Physical auctions** (already live): Compute Exchange, OneChronos+Auctionomics. Day-ahead and shorter-term clearing. This is the compute equivalent of an ISO spot market.
- **Cash-settled perpetuals** (launching 2026): Architect/Ornn's AX exchange, institutional-only, margin in USD or USD stablecoins. Brett Harrison's second act.
- **Standardized dated futures** (2026–2028): The CME or ICE will list a compute contract, or an exchange built specifically for this purpose (OneChronos, Compute Exchange) will achieve the liquidity profile of a listed contract. This is the "H100-hour as a barrel of oil" moment.
- **Options and exotics** (2027+): Once the futures strip is liquid enough, volatility products follow. Given the one-sided price trend, these will be asymmetric from the start—more demand for puts than calls on any specific SKU, with calls concentrated in short-dated expiries around product launches.
- **Compute-backed securities** (2027+): ABS on take-or-pay contracts. Project finance debt backed by forward sales into the spot market. Insurance wrappers on compute delivery. All of this is inevitable.
- **Compute ETFs** (eventually): A retail-accessible product that tracks spot or front-month futures. This is further out because retail-accessible commodity ETFs have a specific regulatory structure that takes years to negotiate, but it will happen.

Every one of these is a real asset class. In aggregate, this is one of the largest new asset classes to emerge since cryptocurrency, and arguably larger than crypto in ultimate institutional adoption. The reason is that crypto was a product in search of a use; compute is a use in search of a product. The hedging demand is already there. The commercial users are already there. All that is missing is the instruments, and those are being built right now, in public, by people whose names are on the cap tables of DRW, Jump Trading, Wintermute, Addition, and DCVC.

If you are an institutional allocator thinking about where to put capital in the next five years, compute markets deserve an allocation strategy. Not crypto-sized (hopefully). But real.

---

## For nations: compute as strategic reserve

Oil is a strategic commodity because modern militaries run on diesel and jet fuel. Compute is about to become a strategic commodity because modern economies run on inference and training.

The signs are already visible. The US Commerce Department's Bureau of Industry and Security issued a rule on 15 January 2026 that moved H200 and AMD MI325X export license review for China from "presumption of denial" to "case-by-case." Blackwell (B100, B200, GB200) remains fully restricted. A 25% tariff applies to advanced computing chips produced abroad and transiting the US before re-export. The "AI Overwatch Act" passed a House committee on 22 January 2026, which would give Congress 30-day veto authority over semiconductor export licenses.

On the other side, the UAE announced a government compute allocation program. Saudi Arabia's Humain is building domestic compute capacity at sovereign-scale. Singapore, Japan, and South Korea have national AI compute initiatives. The EU's AI Act includes compute-threshold provisions. India has a \$1.2B compute subsidy program. Brazil is negotiating compute credits as part of its tech-regulation negotiations with the US.

This is not "AI policy." This is resource-security policy, of the exact kind that has governed oil for a century.

For the emerging market structure, the consequence is **geographic basis on a jurisdictional grid.** The WTI-Brent basis exists because crude quality and delivery geography differ. The H100-in-Virginia vs. H100-in-Shanghai basis will exist because the delivery geography is governed by export controls. Different tiers of jurisdiction will clear at different prices. An H100-hour delivered inside the US-allied tier is one commodity; one delivered in a restricted tier is another, priced separately because it is structurally illiquid for cross-border arbitrage.

This creates a set of trades that will become important over the next five years:

1. **Sovereign compute reserves.** Governments will accumulate compute capacity the way they accumulate oil reserves, and they will use release-from-reserve as a policy tool during AI demand spikes.
2. **Compute-for-access bilaterals.** Countries that want to host frontier training runs will trade regulatory concessions, tax treatments, and market access for compute allocations. This is already happening informally.
3. **Allied compute alliances.** Expect formalized alliances around shared compute pools among US-aligned countries, analogous to how NATO members share energy and ammunition inventories. The "AI Chip Alliance" framing is the early version of this.
4. **Export-control arbitrage.** Every export-control regime creates a geographic price differential that, if not monitored, creates a gray-market. The 25% transit tariff was specifically drafted to close one of these loopholes, but there will be more.

None of this is abstract policy. It flows through directly to the forward curve. A compute future contract written on an index that does not pin its delivery geography is useless for anyone hedging jurisdictional risk. Expect the contract spec to standardize on a Tier-1 geographic delivery assumption, with basis contracts for other jurisdictions.

---

## Jevons paradox in concrete numbers

This is the single most important macro fact about the AI era, and it is misunderstood badly enough that I want to walk through it carefully.

Jevons paradox: when a resource becomes more efficient to use, aggregate consumption of it rises, not falls.

Satya Nadella tweeted in January 2025, in response to DeepSeek R1: *"Jevons paradox strikes again! As AI gets more efficient and accessible, we will see its use skyrocket, turning it into a commodity we just can't get enough of."* He was explicitly framing Microsoft's continued capex as rational despite falling cost per token.

The numbers back him up. From early 2025 to early 2026:

- Average price across major labs went from ~\$10 per million tokens to ~\$2.50. A 75% drop.
- Anthropic cut Claude Opus 4.5 input pricing from \$15 to \$5 per million tokens. A 67% drop on one model.
- Gemini 3 Pro launched at \$2 input / \$12 output per million tokens.
- Cache-read pricing is 10% of base input across all three major labs.
- OpenAI spent \$8.67B on inference in the first nine months of 2025—nearly 2× their revenue for that window.

The unit price dropped by ~75%. Aggregate spend rose by enough to make it the fastest-growing COGS line item in the technology industry. This is Jevons paradox in clean empirical form.

What it means for regular life: the marginal cost of intelligence is falling faster than you can adjust your intuitions. Things that seemed uneconomical last year—running an agent continuously in the background, generating personalized content for every user, maintaining per-user embedding caches, LLM-reranking every search query, real-time translation of every video—are economical now. Things that seem uneconomical this year will be economical next year.

This is the force that will push AI into essentially every software product by 2030. Not because of a marketing push, but because a penny of inference is now cheaper than a millisecond of a database round-trip for many workloads, and it is still falling.

Jensen Huang's framing at GTC 2026—*"In just two years, computation went up by a factor of 10,000x"*—is not a prediction. It is a retrodiction. The ratio is what it is because Jevons is real and the demand response to falling token prices has been enormous.

The consequence for the compute market: even in a world where unit prices keep falling, aggregate spend will keep rising. The market structure being built—indices, futures, perpetuals, basis trades—is being built for a growing market, not a shrinking one. The people on the cap tables of Silicon Data and Compute Exchange are not confused. They are betting on exactly the Jevons dynamic.

---

## The risks I am watching

I have been aggressively bullish on this market structure. I should be explicit about the things that could make me wrong.

1. **The power bottleneck becomes binding enough to freeze the buildout.** ERCOT's 410 GW queue and PJM's 30,000 MW transition backlog are real. Permitting, grid upgrades, and high-voltage transmission siting all move on multi-year timescales, and the gap between queue and actual commissioning is closing slower than the demand curve is rising. If the buildout stalls, the compute spot price rises, the futures market prices in scarcity, and the whole economic structure that depends on falling unit prices reverses. This is the most serious near-term risk and the one I would most seriously hedge against.
2. **One-sided price direction kills the options market.** Eugene Cheah's argument: *"Advancement in GPU will bring price down. Ironically, the biggest threat to H100 GPU rental prices is Nvidia themselves."* If the quality-adjusted price trend is too strongly one-sided, the volatility market fails to develop and the market stops at cash-settled forwards. This is survivable but materially reduces the total addressable market.
3. **The AI demand curve flattens.** The Jevons dynamic is conditional on each productivity improvement in AI capability translating into more economic demand. If there is a capability plateau—we hit a scaling wall, reasoning models stop improving, agent reliability stops improving—the demand curve bends and the compute market loses its growth thesis. Dario Amodei's hedge in the Dwarkesh interview ("we are near the end of the exponential") is the single canary I watch most closely.
4. **Regulatory capture by incumbents.** The existing oligopoly (Nvidia, AWS, Azure, GCP, and a handful of neoclouds) has no interest in a transparent liquid spot market that disintermediates their pricing power. Silicon Data's existence is politically tolerated today because the volumes are small. When Silicon Data or Compute Exchange crosses the threshold where they materially affect the pricing power of a hyperscaler, expect significant pushback.
5. **The underlying silicon roadmap accelerates faster than the contract tenor can support.** If Vera Rubin is 10× better than Blackwell Ultra, as Nvidia claims, and if Rubin Ultra is another 5× better two years later, the forward curve on H100-hour contracts is effectively pricing a rapidly obsoleting asset. There is a risk that no liquid futures market on a specific SKU can sustain open interest more than six months out, which would cap the market's utility for the capital-stack applications I described.

None of these are fatal. All of them are real. A prudent view of the next five years should discount the most bullish scenarios by some combination of them.

---

## My prediction, stated clearly

By January 2028, I expect:

- Silicon Data's SDH100RT and at least two other indices to be tradeable underlyings on at least one regulated derivatives exchange
- Total notional in GPU-compute futures and perpetuals to exceed \$200B—somewhat short of Dave Friedman's \$300B falsification bet, but inside an order of magnitude
- At least one securitized compute-backed debt instrument to have been issued at investment-grade rating, likely by a neocloud
- At least one national government to have established a formal strategic compute reserve, analogous to the SPR
- Consumer AI products to have begun offering tiered peak/off-peak pricing, though not yet universally
- The data center power queue in the US to have grown, not shrunk, relative to 2026 levels
- Realized volatility on spot H100 to have been materially higher than realized volatility on WTI over the same window—my specific bet in Part 1 was above 60% annualized for 3-month realized

The one thing I will not predict is whether any of this makes our lives better. The history of commodity financialization is mixed. Oil futures made the modern global economy possible and also made oil shocks worse. Electricity deregulation lowered prices in most places and also caused California's rolling blackouts. Crypto derivatives enabled capital formation for real crypto businesses and also enabled FTX.

Compute financialization will have the same mixed record. The efficient market will get compute faster to the workloads that value it most and away from the workloads that don't. It will also introduce new ways for the system to break. Both are true.

My job as a writer is to tell you the market structure is coming and that it is more important than the headline AI narrative that currently occupies the popular press. Whether the market itself is a good thing is a question I will not try to resolve here.

What I am confident about is this: by the end of the decade, when you pay for AI, the price you pay will be a derivative—directly or indirectly—of a spot compute index published daily at 16:00 UTC. That is the quiet, decisive change. It is already happening. Most people will never notice. But the infrastructure of the AI economy will rest on it, the same way the infrastructure of every modern economy rests on a set of commodity prices almost no one ever thinks about.

The token factory is under construction. The price signal is going live.

---

## References

Sources overlap with [Part 1](/posts/the-gpu-compute-market-is-electricity-not-oil/); see that post for the full list. Additional sources specifically cited in this post:

- Satya Nadella on Jevons Paradox (X/Twitter, January 2025)
- Jensen Huang, *GTC 2026 Keynote* (Token Factory, tokens-per-watt framing)
- Dario Amodei, *On DeepSeek and Export Controls* (essay, 2025); *Dwarkesh Podcast* interview (2026)
- Motley Fool, *CoreWeave Has a Massive \$88 Billion Revenue Backlog* (April 2026)
- NextPlatform, *CoreWeave Takes As Much Financial Engineering As It Does Datacenter Design* (April 2026)
- FERC, *PJM Co-Location Ruling Guide* (2025–2026)
- ERCOT, *Interconnection Queue Status* (April 2026)
- BIS, *H200 Export Policy Rule* (15 January 2026)
- Anthropic, OpenAI, Google public pricing pages (2026)
