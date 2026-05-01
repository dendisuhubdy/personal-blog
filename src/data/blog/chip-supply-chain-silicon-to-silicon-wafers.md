---
title: "From Sand to Stargate: The CPU and GPU Chip Supply Chain, Silicon to Silicon Wafers and Beyond"
author: Dendi Suhubdy
pubDatetime: 2026-04-30T22:45:00Z
featured: false
draft: false
tags:
  - semiconductors
  - chip-war
  - tsmc
  - asml
  - nvidia
  - amd
  - intel
  - samsung
  - sk-hynix
  - hbm
  - cowos
  - chips-act
  - supply-chain
  - geopolitics
  - ai-infrastructure
description: "An end-to-end research survey of the CPU and GPU chip supply chain in 2026 — from a single Appalachian quartz mine and Ukrainian neon plants up through 300mm wafers, EUV scanners, leading-edge foundries, HBM/DRAM/NAND, advanced packaging, design and EDA, ATE, the geopolitics of CHIPS Acts and export controls, and the hyperscaler demand wave that is now consuming most of it. With 130+ primary references — SEC filings, government reports, SEMI/SEMI Europe data, Yole/TrendForce/SemiAnalysis/CSIS, and company disclosures."
---

If you want to understand modern computing, you have to look past the chip. The Nvidia GB200 in a hyperscaler rack is the visible end of a supply chain that begins in a single mountain valley in North Carolina, passes through air-separation units in Ukraine, photoresist factories in Japan, polysilicon plants in Bavaria, lithography labs in Veldhoven, foundries in Hsinchu and Pyeongtaek, packaging fabs in Hsinchu and Phoenix, and EDA suites in Mountain View and San Jose, before it ever lands in a server. Pull any of those links and the chip does not get built — at all, or in usable volume.

This post is the long version of that map. I'll walk the 10 layers of the stack from raw materials to hyperscaler demand, with the market shares, single points of failure, and recent shocks for each. I'll cite primary sources where I can — SEC filings, government reports, SEMI/Yole/TrendForce/SemiAnalysis, and company disclosures. The bibliography at the end runs to ~140 references; the body cites the most load-bearing of them inline.

Three claims structure the whole piece:

1. **The chip supply chain is more concentrated than people realize.** Each layer is a near-cartel. Some are literal monopolies (ASML on EUV). Most are 2–5 firm oligopolies with HHIs that would attract antitrust attention in any other industry.
2. **The recent shock list is dense and mostly geopolitical.** Hurricane Helene (Spruce Pine), Russia's invasion of Ukraine (neon), the failed GlobalWafers/Siltronic merger, BIS export controls in October 2022/2023 and December 2024, China's gallium/germanium/rare-earth retaliation, the Dutch DUV restrictions, Intel's Magdeburg cancellation. Each one moved real capacity.
3. **The demand side is roaring.** Big-4 hyperscaler capex is going from \$410B in 2025 to a guided \$725B in 2026; Stargate has committed \$500B over four years; Nvidia has booked >50% of TSMC's 2026 advanced-packaging capacity. The constraint is no longer demand. It's CoWoS, HBM, EUV, and grid.

Let's walk the stack.

---

## Table of contents

---

## Layer 1 — Raw materials

### High-purity quartz: Spruce Pine, North Carolina

The semiconductor industry's quartz crucibles, fused-silica chambers, photomask substrates, and ingot-pulling consumables all depend on a single Appalachian valley. Spruce Pine, North Carolina hosts two mines — Sibelco and The Quartz Corp — that produce **70–90% of the world's high-purity quartz** ([Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/the-worlds-semiconductor-industry-hinges-on-a-quartz-factory-in-north-carolina)). TECHCET CEO Lita Shon-Roy puts the dependency this way: *"This is the only plant in the world right now that serves the semiconductor industry in its entirety"* ([CNBC](https://www.cnbc.com/2024/10/03/helene-quartz-mine-semiconductor-north-carolina.html)).

When Hurricane Helene shuttered both producers in September 2024, it was a textbook concentration event. Sibelco restarted within weeks ([Fast Company](https://www.fastcompany.com/91208060/key-supplier-critical-semiconductor-material-back-operation-post-helene)) and committed to a **\$500M expansion through 2027** ([Sibelco](https://www.sibelco.com/en/news/sibelco-provides-an-update-on-the-expansion-of-its-spruce-pine-usa-high-purity-quartz-operations)). But the structural fact stands: a single mountain valley is the bottleneck for the consumables every fab on Earth uses.

### Polysilicon: semiconductor-grade vs solar-grade

Most polysilicon production today is solar-grade (~6N–9N purity). Semiconductor-grade is 11N–13N — three to seven orders of magnitude purer — and is a far smaller, far more concentrated market. Global semiconductor-grade polysilicon was **\$1.06B in 2024**, projected \$1.5B by 2034 ([Global Growth Insights](https://www.globalgrowthinsights.com/market-reports/polysilicon-for-semiconductor-market-119780)).

**Wacker Chemie, Hemlock Semiconductor, and Tokuyama hold ~60–70% combined share**. Smaller players: Mitsubishi, OCI, GCL-Poly, REC Silicon ([OpenPR](https://www.openpr.com/news/3656852/solar-and-semiconductor-grade-polysilicon-market-size-share)). Tokuyama completed a ¥30B Shunan expansion in Q1 2024 for sub-3nm node consumables; GCL-Poly broke ground on a 50,000 t/yr semi-grade plant in Jiangsu in March 2024. Wacker (Burghausen, Germany; Charleston, TN) and Hemlock (Michigan, US joint venture of Corning/Shin-Etsu/Mitsubishi) anchor non-Chinese supply.

### Noble gases: neon, krypton, xenon

Pre-war Ukraine supplied **50–70% of global neon, 40% of krypton, 30% of xenon** ([CSIS](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)). When Russia shelled Mariupol and Odesa in early 2022, Ingas (15,000–20,000 m³/month neon) and Cryoin (10,000–15,000 m³/month) went offline. High-purity neon prices climbed **up to 500%** by spring 2022 ([CNBC](https://www.cnbc.com/2022/03/25/russia-ukraine-war-laser-neon-shortage-threatens-semiconductor-industry.html)).

Linde, Air Liquide, Air Products, and Nippon Sanso responded by building neon recovery and air-separation capacity in Korea, Japan, Taiwan, and the US ([SPIE](https://spie.org/news/photonics-focus/mayjune-2023/supplying-noble-gases-for-photonics-in-war-time)). Air Liquide is constructing a 1,400 t/day air-separation unit on Naoshima Island, Japan, online 2027 ([Linde](https://www.linde.com/news-and-media/2025/linde-to-expand-supply-of-industrial-gases-to-samsung-in-south-korea)). The industry survived the shock, but it was the loudest possible reminder that a single deep-purification step can have a country-scale supplier.

### Photoresists: Japan's quiet monopoly

Japan controls **~80% of global photoresist; the EUV photoresist segment is held ~75% by JSR + TOK + Shin-Etsu + Fujifilm** ([Founty Tech](https://www.fountyltech.com/news/japanese-companies-monopolize-the-euv-photoresist-supply-market/)). JSR alone holds 22%+ market share in 2024 ([GMI Insights](https://www.gminsights.com/industry-analysis/photoresist-chemicals-for-advanced-lithography-market)).

The most telling industrial-policy event in the photoresist sector: **JSR Corporation was taken private in 2024 by Japan Investment Corp**, METI's sovereign fund. This was explicitly a sovereignty move — Tokyo did not want JSR's EUV chemistry to be vulnerable to a hostile bid. The US BIS export-control regime got the headlines; the Japanese take-private of JSR is the deeper story of how chemical layers of the supply chain are now being treated as national assets.

The photoresist chemicals market for advanced lithography was **\$5.5B in 2024** with >11% projected CAGR.

### CMP slurries and specialty gases

CMP slurry market: **\$1.96B in 2024 → \$4.28B by 2034** at ~8% CAGR ([Zion](https://www.zionmarketresearch.com/report/cmp-slurry-market)). Concentrated among Cabot Microelectronics (now CMC Materials/Entegris), Versum (Merck), Hitachi Chemical (Resonac), Fujimi, Fujifilm, DuPont, and Saint-Gobain.

Top-5 industrial gas suppliers — Air Liquide, Linde, Air Products, Nippon Sanso, Messer — control **55–70%** of high-purity gas supply. Industrial gas TAM: **\$94B (2024) → \$126.5B (2030)** ([Linde](https://www.linde-engineering.com/products-and-services/success-stories/2024/invisible-but-indispensable-electronics-gases-keep-the-chips-flowing)).

### Rare earths, gallium, germanium, graphite — China's chokepoint

This is the layer where China sets the terms.

China holds **~70% of rare earth mining, 90% of separation/processing, 93% of magnet manufacturing, 96% of NdFeB magnets globally** ([CSIS](https://www.csis.org/analysis/chinas-new-rare-earth-and-magnet-restrictions-threaten-us-defense-supply-chains)). The retaliation timeline against US export controls is dense:

- **July 3, 2023**: gallium / germanium export-license regime
- **October 20, 2023**: graphite licensing
- **December 2024**: outright ban on Ga / Ge / antimony / superhard materials to the US
- **April 4, 2025**: 7 heavy rare-earth elements added to export controls; foreign-made magnets with ≥0.1% Chinese-origin heavy REE require licenses; sub-14nm semiconductor materials face case-by-case review ([RSIS](https://rsis.edu.sg/rsis-publication/rsis/analysing-chinas-2025-rare-earth-export-controls/))

The effect on US imports has been measurable. GaAs wafer imports collapsed to roughly zero post-July 2023 ([PIIE](https://www.piie.com/blogs/realtime-economics/2024/chinas-export-controls-critical-minerals-arent-starving-united-states)), and rare-earth prices in importing countries have hit **6× domestic Chinese levels** ([IEA](https://www.iea.org/commentaries/with-new-export-controls-on-critical-minerals-supply-concentration-risks-become-reality)). This is the asymmetric piece of the chip-war geometry: the West weaponizes EUV/EDA/SME export controls; China weaponizes the periodic table.

---

## Layer 2 — Silicon wafers (300mm)

The global silicon wafer market: **\$14.49B (2024) → \$25.69B (2032)** at 8.7% CAGR; 300mm = ~75% of wafer revenue ([Intel Market Research](https://www.intelmarketresearch.com/semiconductor-silicon-wafer-market-16631)). The supplier landscape is a near-cartel: top-5 (Shin-Etsu, SUMCO, GlobalWafers, Siltronic, SK Siltron) = **~82% of revenue**.

Shin-Etsu alone holds >28% of 300mm supply, >2.2 million wafers/month. SUMCO is ~23%, 1.8 million 300mm wafers/month. Together they are >50% of 300mm capacity ([Semiconductor Insight](https://semiconductorinsight.com/report/silicon-wafer-market/)).

### The defining shock: GlobalWafers / Siltronic, blocked

On **February 1, 2022**, GlobalWafers' €4.35B takeover of Siltronic collapsed when the German Federal Ministry for Economic Affairs failed to approve the deal by the deadline. Had it closed, the combined entity would have been the #2 300mm vendor globally. Germany's stated concern was technological sovereignty; the €50M termination fee was paid ([CNBC](https://www.cnbc.com/2022/02/01/globalwafers-bid-for-siltronic-fails-amid-tech-sovereignty-concerns-.html), [Bloomberg](https://www.bloomberg.com/news/articles/2022-02-01/siltronic-says-globalwafers-won-t-complete-5-billion-takeover)).

GlobalWafers redirected the war chest into a **\$5B fab in Sherman, Texas** (with US CHIPS Act support). The geographic distribution of the top 5 today: Shin-Etsu (Japan + Malaysia + US), SUMCO (Japan + Taiwan), Siltronic (Germany + Singapore + Portland OR), GlobalWafers (Taiwan + Japan/MEMC + Denmark + US Sherman), SK Siltron (Korea + US Auburn MI for SiC).

### SOI: Soitec

Soitec holds **~70% of the SOI wafer market**; FD-SOI/RF-SOI dominate ADAS, IoT, and RF Front-End modules. Bernin (France) doubled FD-SOI to 100M units/yr in 2024; Singapore extension doubled local 300mm SOI capacity to ~2M wafers/yr.

---

## Layer 3 — Wafer fab equipment

SEMI projects **\$110B WFE in 2025, \$130B in 2026, and a record \$156B by 2027** ([SEMI](https://www.semi.org/en/semi-press-release/global-fab-equipment-investment-expected-to-reach-110-billion-dollar-in-2025), [SEMI](https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-projected-to-reach-a-record-of-156-billion-dollars-in-2027-semi-reports)). China is the single largest geography (\$38B in 2025), followed by Korea (\$21.5B) and Taiwan (\$21B).

The **Big Five — ASML, AMAT, Lam, TEL, KLA — hold ~70% of WFE** ([Yole](https://www.yolegroup.com/press-release/wafer-fab-equipment-wfe-market-to-hit-184-billion-by-2030-for-equipment-and-services-driven-by-specialized-segment-growth-and-global-manufacturing-shifts/)).

### ASML: the EUV monopoly

ASML holds **100% of the EUV market**. Cumulative R&D >€10B over decades. A current TWINSCAN NXE:3800E sells for ~€200M; the High-NA EXE:5000 is **>€350M** ([TechPowerUp](https://www.techpowerup.com/319071/asml-high-na-euv-twinscan-exe-machines-cost-usd-380-million-10-20-units-already-booked)).

ASML 2025 revenue was **€32.7B (\$39B)**, +15% year-over-year; 2026 guide €34–39B; EUV (Low + High NA) was 48% of system revenue at €11.6B in 2025; the company's **\$71B 2030 target** is realistic if AI demand holds ([Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/asml-projects-usd71-billion-in-revenue-by-2030-as-demand-for-euv-lithography-machines-intensifies-due-to-ai-boom-china-sales-lag-behind-while-company-cashes-in-on-high-end-twinscan-systems)).

The structural shift in 2026 is **High-NA EUV** moving from prototype to high-volume manufacturing. NA goes from 0.33 → 0.55, giving 1.7× resolution. Q1 2026 marked the first HVM HNA shipments. China revenue at ASML is projected to fall to ~20% in 2025 from a 49% peak in Q2 2024, as the Dutch government's September 2024 export controls bite.

### DUV: Nikon, Canon, ASML

DUV is more contested. 2024 unit shipments: **i-line — Canon 182, ASML 44, Nikon 18; KrF — ASML 70.5%, Canon 27.9%, Nikon 1.6%; ArF immersion — ASML 97%, Nikon 3%** ([Valuates](https://reports.valuates.com/market-reports/QYRE-Auto-23W9388/global-duv-lithography-systems)). Canon is re-entering ArF immersion in 2025. Nikon's strategic rump is mostly i-line and small-volume KrF.

### Deposition, etch, ALD, metrology

- **Lam Research FY2024 revenue \$14.91B**; system revenue (etch, deposition, clean) \$8.9B ([Lam](https://newsroom.lamresearch.com/2025-01-29-Lam-Research-Corporation-Reports-Financial-Results-for-the-Quarter-Ended-December-29,-2024)).
- **Applied Materials FY2024 record revenue \$27.18B** ([AMAT](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-fourth-quarter-and-fiscal-year-2024)).
- **Tokyo Electron FY25 (Apr 2024–Mar 2025) net sales ¥2.4315 trillion (~\$15B)**, +32.8% YoY. **TEL holds ~92% share in coater/developer track tools and 100% of EUV coater/developer** ([TEL](https://www.tel.com/ir/library/report/l8gqgo00000000gl-att/fy25q4transcript-e.pdf), [Bismarck](https://brief.bismarckanalysis.com/p/tokyo-electrons-place-in-global-semiconductor)).
- **ASM International controls mid-50s % of single-wafer ALD; >55% in segments where it competes**. ALD market: \$6.17B (2024) → \$12.18B (2032) at 10.2% CAGR.
- **KLA FY2024 revenue ~\$11B; 56% share of process control overall, ~63% of metrology+inspection by 2024, 80%+ in reticle inspection** ([KLA 10-K](https://ir.kla.com/sec-filings/all-sec-filings/content/0000319201-25-000024/0000319201-25-000024.pdf)).

The pattern repeats: every sub-layer of WFE is a 1–3 firm oligopoly. There is no commodity layer here.

---

## Layer 4 — Foundry / leading-edge logic

### TSMC

TSMC is the gravitational center of leading-edge logic. **2024 consolidated revenue NT\$2,894.31B / US\$90.08B**, +33.9% TWD, +30.0% USD. Apple is 22% of revenue; the top-4 customers are ~50% of revenue; Nvidia is ~12% as #2 and AMD <10% as #3 ([TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf), [TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)). 7nm-and-below was 69% of wafer revenue in 2024 (vs 58% in 2023); 3nm alone was 18%.

**Capacity and node ramp**:

- **N3**: ~120–130k WPM end-2025, **180k WPM end-2026 (+40% YoY)** ([TrendForce](https://www.trendforce.com/news/2026/04/27/news-tsmc-3nm-monthly-capacity-may-hit-180k-wafers-by-2026-up-over-40-yoy-on-ai-demand/))
- **N2**: HVM H2 2025 in Hsinchu Fab 20 + Kaohsiung Fab 22; ~50k WPM end-2025 → 120–130k WPM end-2026
- **A16 (1.6nm)**: HVM target H2 2026

**Geographic diversification** is the second-order story. TSMC committed to:

- **Arizona**: up to 12 fabs; Phase 1 N4 ramping; Phase 2 (3nm) HVM 2027; Phase 3 (A16/N2) broke ground April 2025; ~30% of 2nm-and-advanced capacity ultimately in Arizona
- **Japan / JASM (Kumamoto, with Sony/Denso/Toyota)**: Fab 23 Phase 1 producing; Phase 2 with N3 expected 2028; **METI subsidies up to ¥1.208 trillion** ([METI](https://www.meti.go.jp/english/policy/0704_001.pdf))
- **Germany / ESMC (Dresden, JV with Bosch/Infineon/NXP)**: total €10B; production 2027; FinFET 300mm; up to 480k wafers/yr by 2029
- **2025 capex: \$42B** ([Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/tsmc-to-spend-usd42-billion-on-expansion-in-2025-ambitious-plans-detail-nine-production-facilities))
- **CHIPS Act final award: \$6.6B**

### Samsung Foundry

Samsung was first to GAA in mass production (SF3E, 2022). SF3 went to HVM in H2 2024; **SF2 mass production is targeted for Q4 2025**. Yield matters: 2nm yield rose from ~30% (Feb 2025) to **55–60% (Nov 2025)** ([TrendForce Feb 2025](https://www.trendforce.com/news/2025/02/07/news-samsung-reportedly-achieves-30-yield-in-sf2-test-production-set-for-q4-mass-prodution/), [TrendForce Nov 2025](https://www.trendforce.com/news/2025/11/25/news-samsung-reportedly-hits-55-60-2nm-yields-eyeing-an-edge-through-early-gaa-deployment/)). SF2P in 2026; 1.4nm pushed beyond original roadmap. **CHIPS Act final award: \$4.745B** for the Taylor, Texas fabs.

### Intel Foundry

Pat Gelsinger's "5 nodes in 4 years" thesis (Intel 7 → 4 → 3 → 20A → 18A) broadly succeeded on the technical roadmap; he was succeeded by **Lip-Bu Tan in early 2025**.

- **Intel 18A**: backside power (PowerVia) + RibbonFET GAA, risk production 2025, HVM late 2025
- **Intel 14A**: risk 2026
- **Intel 10A**: 2027 — first node to use High-NA EUV
- **CHIPS Act final award: \$7.86B** (down from \$8.5B preliminary); **Ohio fabs slipped to 2027–28**
- **Intel Magdeburg (Germany) abandoned July 2025**; subsidies redirected ([EE Times](https://www.eetimes.com/germany-redirects-intel-funds-into-new-wave-of-semiconductor-projects/))
- **Tower Semiconductor acquisition was blocked by China's MOFCOM in 2023** (now legacy partnership only)

### SMIC: the Chinese frontier

SMIC's N+2 7nm process powers Huawei's Kirin 9000s in the Mate 60 Pro (Sept 2023), confirmed by [TechInsights](https://www.techinsights.com/blog/techinsights-finds-smic-7nm-n2-huawei-mate-60-pro). The achievement is real, and the cost is real: SMIC is doing 7nm via **multi-patterning on 193nm immersion ArF**, because it lacks EUV. Yields and cycle times are degraded; the part is produced "in limited quantities" ([CSIS](https://www.csis.org/analysis/contextualizing-national-security-concerns-over-chinas-domestically-produced-high-end-chip)).

Per-wafer costs at SMIC's 7nm are estimated to be 30–40% of TSMC's economics — a tax that the Chinese state can absorb but that does not produce a competitive commercial product. The Soviet "copy it" lesson holds: copying scales poorly when the chokepoint is a tool, not a chip.

### Rapidus: Japan's 2nm bet

**\$12B+ committed by Tokyo so far**, backed by Toyota, SoftBank, Sony, Kioxia, NEC, NTT, MUFG, Denso. The **2nm pilot line at IIM-1 in Chitose, Hokkaido began April 2025**; HVM target 2027 with technology transfer from IBM, EUV process knowledge from imec, and back-end / EDA from Siemens ([IBM](https://research.ibm.com/blog/rapidus-ibm-move-closer-to-scaling-out-2-nm-chip-production), [Rapidus](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)). An additional ¥4 trillion is needed for HVM ramp.

The realistic question for Rapidus: can a brand-new fab ramp 2nm to commercial yield against TSMC's (and Samsung's) decade-deep learning curves, with state support but without a captive customer base of Apple/Nvidia/AMD scale? Tokyo's bet is yes. The historical base rate for greenfield leading-edge foundries succeeding is very low.

### GlobalFoundries / UMC / PSMC: mature nodes

Q4 2024 foundry rankings: **UMC #4 (4.7%), GlobalFoundries #5 (4.6%)** ([SemiEngineering](https://semiengineering.com/which-foundry-is-in-the-lead-it-depends/)). 2025 saw reported merger talks between GF and UMC that, if consummated, would produce ~28% mature-node share. PSMC partnered with Tata for India's Dholera fab.

---

## Layer 5 — Memory

### DRAM

**Q4 2024 DRAM**: \$52.47B; Samsung \$19.16B / 36.6%; SK Hynix \$17.23B / 32.9%; Micron 22.9% ([Wccftech](https://wccftech.com/global-dram-industry-revenue-grows-by-13-6-quarter-over-quarter-samsung-still-leads-with-around-41-market-share/)).

The historic moment: **in Q1 2025, SK Hynix overtook Samsung in DRAM for the first time in 33 years** (36.3% vs 32.7%), driven by HBM ([KED Global](https://www.kedglobal.com/korean-chipmakers/newsView/ked202504090006)). This is not a small event. Samsung had been the world DRAM leader since 1992.

### HBM: the AI memory war

This is the layer where the Nvidia GPU shortage ultimately lives.

**Q2 2025 HBM market share**: SK Hynix **62%**, Micron **21%**, Samsung **17%** — down from Samsung's 41% in Q2 2024 ([Astute Group](https://www.astutegroup.com/news/general/sk-hynix-holds-62-of-hbm-micron-overtakes-samsung-2026-battle-pivots-to-hbm4/)). SK Hynix mass-produced 12-Hi 36GB HBM3E first in September 2024.

**Nvidia is projected to allocate roughly two-thirds of HBM4 demand to SK Hynix for Vera Rubin**. Samsung passed Nvidia's HBM4 qualification in Q4 2025; HBM4 mass production at Pyeongtaek P4 began February 2026 ([KED Global](https://www.kedglobal.com/korean-chipmakers/newsView/ked202509190008)). Micron's 1β-node 12-Hi HBM3E claims 30% lower power.

The 2026 forecast HBM revenue mix: **55% HBM4 / 45% HBM3E**, with Samsung and SK Hynix planning a **~20% HBM3E price hike for 2026** as Nvidia H200 / ASIC demand stays oversubscribed ([TrendForce](https://www.trendforce.com/news/2025/12/24/news-samsung-sk-hynix-reportedly-plan-20-hbm3e-price-hike-for-2026-as-nvidia-h200-asic-demand-rises/)).

### NAND

**Q2 2024 NAND share**: Samsung 36.9%, SK Group (Hynix + Solidigm) 22.1%, Kioxia 13.8%, Micron 11.8%, WD 10.5% ([Blocks & Files](https://blocksandfiles.com/2024/09/13/samsung-and-sk-hynix-gain-nand-market-share/)). NAND TAM: \$65.1B in 2024 (+5.6% projected CAGR).

**Western Digital separated flash from HDD in early 2025** (now SanDisk) after the Kioxia merger was blocked by SK Hynix in 2023 ([CNBC](https://www.cnbc.com/2023/10/30/western-digital-to-split-flash-memory-business-after-kioxia-merger-talks-stall.html)). **Kioxia IPO'd in December 2024** at ¥1,455/share, ~\$5.5B market cap.

### China memory: CXMT and YMTC

**YMTC (Wuhan)** has been on the Entity List since late 2022. The company is building a third Wuhan fab targeted for HVM in 2027; Q2 2025 share fell **below 5%**. It is producing Gen 5 (Xtacking 4.0) 3D NAND and working on Gen 6 ([Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/ymtc-moves-ahead-with-third-fab-in-wuhan-despite-us-sanctions)).

**CXMT** demoed DDR5-8000 and LPDDR5X-10667 in 2025 — surprising progress. Added to the DOD blacklist in January 2025; further BIS Footnote 5 restrictions in December 2024 ([Tom's Hardware](https://www.tomshardware.com/pc-components/dram/chinas-banned-memory-maker-cxmt-unveils-surprising-new-chipmaking-capabilities-despite-crushing-us-export-restrictions-ddr5-8000-and-lpddr5x-10667-displayed)).

### Micron: the US memory anchor

**\$6.165B CHIPS Act award finalized December 2024** for Idaho + New York fabs. The stated goal: grow US advanced-memory share from <2% (2024) to ~10% (2035). Sanand, India, ATMP shipped first DRAM modules in 2024.

---

## Layer 6 — Advanced packaging

### TSMC's CoWoS chokepoint

Almost every Nvidia AI accelerator currently shipping is gated by **CoWoS** (Chip-on-Wafer-on-Substrate) capacity at TSMC. C.C. Wei has stated that CoWoS is sold out through 2025 and into 2026.

**Nvidia has booked >50% of 2026 CoWoS capacity; 800k–850k wafers reserved**. CoWoS capacity is scaling from **~35k WPM end-2024 to ~130k WPM end-2026 — an 80% CAGR** ([Wccftech](https://wccftech.com/nvidia-alone-has-tsmc-advanced-packaging-lines-booked-for-several-years-ahead/), [Digitimes](https://www.digitimes.com/news/a20251210PD218/tsmc-cowos-capacity-nvidia-equipment.html)). TSMC is outsourcing simpler steps to ASE/Amkor and building two Arizona advanced-packaging fabs.

The portfolio: **InFO** (smartphone), **CoWoS** (AI/HPC), **SoIC** (3D stacking).

### Intel: Foveros, EMIB, Foveros Direct

EMIB embeds a silicon bridge in the substrate (no full interposer). Foveros stacks 3D face-to-face. Foveros Direct uses hybrid bonding. **Apple and Qualcomm reportedly sought EMIB capacity from Intel by November 2025** ([TrendForce](https://www.trendforce.com/news/2025/11/18/news-intel-advanced-packaging-reportedly-gains-traction-with-apple-and-qualcomm-seeking-emib-expertise/)) — a striking validation of Intel's packaging IP independent of its struggling foundry economics.

### Samsung: I-Cube, X-Cube, SAINT

Samsung's packaging stack is driven by the need to relieve TSMC's CoWoS bottleneck and to combine HBM hybrid bonding with logic. I-Cube is 2.5D; X-Cube is 3D.

### OSATs

**2024 Top 10 OSAT revenue: \$41.56B**, +3% YoY ([TrendForce](https://www.trendforce.com/presscenter/news/20250513-12577.html)). ASE \$18.54B (~45% of top-10); Amkor \$6.32B (15.2%); JCET \$5B (12%, +19.3% YoY); Tongfu 8%; Powertech \$2.28B (5.5%); SPIL within ASE Group.

### 2.5D/3D packaging market and UCIe

**2.5D/3D packaging: \$4.2B (2024) → \$14.8B (2032)** at 18.6% CAGR. **UCIe 2.0 was published August 6, 2024**; UCIe 3.0 raises rates to 48/64 GT/s. The consortium includes AMD, Arm, ASE, Google Cloud, Intel, Meta, Microsoft, Qualcomm, Samsung, and TSMC. **Nvidia is notably absent** ([UCIe](https://www.uciexpress.org/specifications)) — a clue that NVLink is functioning as a deliberate moat against the chiplet-interop standard the rest of the industry is converging on.

---

## Layer 7 — Design / IP / EDA

### Nvidia

**FY2024 (ending Jan 2024) Data Center revenue \$47.53B = 78.01% of total**; Q4 FY24 DC = \$18.4B, +409% YoY ([Nvidia 10-K](https://www.sec.gov/Archives/edgar/data/1045810/000104581024000029/nvda-20240128.htm)). Gross margin reached 75% in FY25 vs 72.7% in FY24.

**Blackwell (TSMC N4P)**: **GB200 NVL72** = 36 Grace Blackwell Superchips, 72 GPUs, 36 CPUs over NVLink-5 with 130 TB/s aggregate; **30× faster than H100 LLM inference** ([Nvidia](https://www.nvidia.com/en-us/data-center/gb200-nvl72/), [Nvidia News](https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing)). **B300 (Blackwell Ultra)**: 12-Hi HBM3E at 288GB/GPU, 15 PFLOPS dense FP4 (vs B100/B200 10 PFLOPS, 192GB).

**Vera Rubin (TSMC 3nm, H2 2026)**: HBM4 288GB, 13 TB/s; **NVL72 = 260 TB/s NVLink-6 fabric (2× GB200); 3.6 ExaFLOPS dense FP4; ~5× B200 throughput**. **Rubin Ultra (H2 2027)**: 4 reticle-limited GPU dies in one socket = 100 PFLOPS FP4, 1TB HBM4E. Feynman 2028 ([NextPlatform](https://www.nextplatform.com/2025/03/19/nvidia-draws-gpu-system-roadmap-out-to-2028/)).

### AMD

**MI300X** (CDNA3): 192GB HBM3, vs H100. **MI325X** (Q4 2024 launch, vol. Q2 2025): 288GB HBM3E, 6 TB/s. **MI350** (CDNA4, H2 2025): 288GB HBM3E, 8 TB/s, +35× inference vs MI300; +80% perf vs MI325X. **AMD Instinct revenue >\$5B in 2024**; Lisa Su's forecast **AI accelerator TAM \$500B by 2028** ([AMD](https://www.amd.com/en/newsroom/press-releases/2024-6-2-amd-extends-ai-and-high-performance-leadership-in-.html)). MI400 (UDNA, 2026) → "Helios" rack with EPYC Venice. **EPYC server share: 2% (2018) → 34%** by Computex 2024.

### Intel CPUs and Accelerators

**Sierra Forest** (Xeon 6 E-core, June 2024): up to 144 cores on Intel 3, +2.4× perf/W vs gen 2. **Granite Rapids** (P-core, Sept 2024): 2–3× mixed-AI vs current Xeon. **Gaudi 3** (Vision 2024): claims +50% inference, +40% perf/W vs H100 ([Intel](https://newsroom.intel.com/artificial-intelligence/vision-2024-enterprise-ai-gaudi-3-open-systems-strategy)).

### Apple

**A18/A18 Pro on TSMC N3E** (iPhone 16 series, Sept 2024). The A19 Pro / A18 Pro / M3 / M4 / M5 ship from TSMC Fab 18 in Tainan ("Apple's fab"); A20 / next-gen M-series will be on TSMC N2 ([SemiAnalysis](https://newsletter.semianalysis.com/p/apple-tsmc-the-partnership-that-built)). Apple holds ~22% of TSMC revenue in 2024 — the single largest customer relationship in the industry.

### Qualcomm

**Snapdragon X Elite** (Oct 2023, Oryon, 12-core, up to 4.3 GHz boost, 4.6 TFLOPS Adreno, 45 TOPS Hexagon NPU). X Plus (Apr 2024). X (Jan 2025). **X2 Elite/Extreme** (3nm, late 2025): up to 18 Oryon cores, 80 TOPS Hexagon NPU ([Tom's Hardware](https://www.tomshardware.com/pc-components/cpus/qualcomms-new-snapdragon-x2-elite-extreme-and-elite-chips-for-pcs-stretch-up-to-a-record-5-ghz-3nm-arm-chips-sport-new-oryon-prime-cores)).

### Custom AI silicon (hyperscalers)

This is the structurally most important shift in the design layer.

- **Google TPU v6e "Trillium"** GA late 2024: 4.7× v5 perf/chip, +67% perf/W. **TPU v7 "Ironwood"**: 4,614 FP8 TFLOPS, 192GB HBM3E.
- **AWS Trainium2**: 4× Trainium1; 30–40% better price/perf vs current-gen Nvidia. Inferentia for inference.
- **Microsoft Maia 100/200**, **Meta MTIA v2** for recommendation + GenAI.
- **Broadcom holds ~60% of the AI ASIC market; Marvell ~15%** ([HeyGoTrade](https://www.heygotrade.com/en/blog/broadcom-vs-marvell-custom-ai-silicon-battle-2026/)). Broadcom partners include Google and Meta (incl. a 2nm Meta accelerator). Marvell is in talks with Google on a memory-processing unit and inference TPU as third design partner.
- **TrendForce: custom-chip sales growing +45% in 2026 vs +16% for GPUs; ASIC TAM \$118B by 2033**.

The thesis here is that the hyperscalers are vertically integrating — pulling design in-house and outsourcing only fabrication to TSMC, plus packaging. This is a slow-motion threat to Nvidia's pricing power, even as Nvidia continues to dominate the absolute volume.

### EDA: a three-firm oligopoly

**Synopsys 31%, Cadence 30%, Siemens EDA 13% in 2024 = 75% combined**, up from <75% in 2014 to >85% by some methodologies in 2023 ([SemiEngineering](https://semiengineering.com/the-state-of-the-eda-industry-in-2024/)). **Synopsys' \$35B Ansys acquisition** (announced January 2024) closed in 2025, deepening the EDA / simulation convergence. **June 2025 BIS curbs on EDA exports to China** are a real revenue hit and a real strategic constraint on China's design-tool stack.

### IP: ARM, x86, RISC-V

ARM's IPO (Nasdaq, September 2023) with SoftBank as ~90% owner; v9 royalties accelerating. The x86 license is held by Intel, AMD, and (in restricted form) VIA / Zhaoxin. RISC-V momentum is real — SiFive, Tenstorrent, Ventana (Veyron V2 has UCIe), Esperanto, Andes; China's Nuclei has joined UCIe — but the ARM and x86 ecosystems are a decade ahead in software tooling.

---

## Layer 8 — Test (ATE)

**Advantest + Teradyne ≈ 80% of the ATE market**. Advantest is 58% by some methodologies, 31–55% by others; Teradyne ~23–30%. Advantest posted **record FY2024 sales / op income / net income** driven by AI HPC test demand ([Advantest](https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2407E.pdf), [Seeking Alpha](https://seekingalpha.com/article/4837312-advantest-teradyne-market-share-shifts-in-this-duopoly)). Advantest has been called the "ASML of test." For HBM specifically, Advantest is the dominant test platform.

---

## Layer 9 — Geopolitics and policy

The supply chain has been re-shaped more by export controls and industrial policy in the last four years than by any technology shift. Six policy regimes are now in motion simultaneously.

### US export controls

- **October 7, 2022 BIS rule**: advanced-node logic (16/14nm), DRAM 18nm, NAND 128L+; SME for advanced nodes; AI accelerators
- **October 17, 2023**: closed loopholes (H800, A800 carve-outs eliminated), expanded VEU restrictions
- **December 2, 2024**: 140 entities added to Entity List, 16 with new "Footnote 5" designation, 3 removed from VEU; tightened HBM controls; targeted Chinese SME makers (Naura, AMEC, Piotech, SiCarrier ecosystem) ([WilmerHale](https://www.wilmerhale.com/en/insights/client-alerts/20241206-bis-issues-sweeping-additional-restrictions-on-semiconductors-and-advanced-computing-entity-list-designations))
- **January 13, 2025**: AI Diffusion Rule introducing tiered country licensing
- Huawei, SMIC, YMTC, CXMT, ZTE all on Entity List with varying scope

### CHIPS and Science Act (US)

**\$280B total authorization; \$52.7B appropriated** (\$39B mfg + \$13B R&D/workforce); 25% investment tax credit on equipment ([CHIPS Act](https://en.wikipedia.org/wiki/CHIPS_and_Science_Act)). Final awards (December 2024, just before the Trump transition):

- Intel \$7.86B
- TSMC \$6.6B
- Micron \$6.165B
- Samsung \$4.745B
- GlobalFoundries \$1.5B
- SK Hynix Indiana ATMP \$450M
- Microchip \$162M; BAE \$35M; Polar \$120M

The 2025 Trump administration sought equity stakes in CHIPS Act awardees, an unusual policy posture for a US industrial subsidy program.

### EU Chips Act (€43B)

Three streams: **€21.8B IPCEI ME-CT, €5.1B for R&D pilot lines, €53.8B confirmed/pending FOAK + non-FOAK public-private** ([SEMI](https://www.semi.org/sites/semi.org/files/2025-11/SEMI_Chips_Act_Report_Full_Report.pdf)). The defining negative event: **Intel Magdeburg (\$11B subsidy / €30B project) was abandoned in July 2025**, and the funds are being redirected. Doubling Europe's global semi share to ~20% by 2030 looks unlikely on current trajectory.

### Japan METI

**Total ~¥4 trillion FY2021–2023**. Rapidus has been committed ~¥1.72 trillion including a ¥920B technology subsidy; FY2024 added ¥590B (\$3.89B); a further ¥267.6B (\$1.7B) was added in February 2026 ([CNBC](https://www.cnbc.com/2024/04/02/japan-approves-3point9-billion-in-subsidies-to-domestic-chip-maker-rapidus-.html)). JASM/TSMC Kumamoto received up to ¥1.208 trillion. Of all the industrial-policy plays, METI's is the most coherent: a coordinated bet on Rapidus + JASM + JSR + photoresist + power semiconductors.

### Korea K-Chips Act

Strategic-tech investment tax credit raised to **15% for large firms / 25% for SMEs**, plus a 10% increment bonus. **2024 \$19B (₩26 trillion) support package, including ₩17 trillion KDB low-rate semi-fab loans** ([Fortune](https://fortune.com/2024/05/23/south-korea-19-billion-chip-funding-package-no-subsidies/)).

### India Semiconductor Mission

**Ten projects approved in under four years**. Tata + PSMC \$10.9B Dholera fab (HVM mid-2027); Micron \$2.75B Sanand ATMP (first DRAM modules 2024); Tata + Powerchip; CG Power-Renesas; Kaynes; Suchi. Central + state subsidies up to 70% ([India Briefing](https://www.india-briefing.com/news/india-4-new-semiconductor-plants-approved-2025-39180.html/), [Carnegie](https://carnegieendowment.org/research/2025/08/indias-semiconductor-mission-the-story-so-far?lang=en)). The Vedanta-Foxconn JV collapsed in 2023.

### Taiwan: the silicon shield

**Taiwan is 60% of all chips and 90% of advanced chips; TSMC alone is 78% of the foundry market and 92% of leading-edge capacity** ([MIT Technology Review](https://www.technologyreview.com/2025/08/15/1121358/taiwan-silicon-shield-tsmc-china-chip-manufacturing/)). Taiwan's statutory ban on overseas production of the most advanced node (currently 2nm) is the legal expression of the silicon-shield doctrine. 2nm Arizona is earliest 2028. The shield is under stress as TSMC's diversification proceeds, but the diversification is also slow on purpose — a fully-equivalent overseas 2nm fab would, by Taiwanese policy, undermine the shield.

### Dutch ASML restrictions

**September 7, 2024**: the Dutch government required ASML licenses for NXT:1970i / 1980i DUV immersion sales to China; jurisdiction transferred from US (FDPR) to The Hague. Service, spare parts, and software updates also licensed ([TrendForce](https://www.trendforce.com/news/2024/09/09/news-netherlands-expands-export-control-over-asmls-two-duv-machines-effective-on-september-7th/)).

### China retaliation timeline

- Gallium / germanium licenses August 1, 2023 → outright ban December 2024
- Graphite licensing October 20, 2023
- April 4, 2025: 7 heavy REE controls; foreign-made magnets with ≥0.1% Chinese-origin REE require licenses; sub-14nm semi materials case-by-case
- Antimony, superhard materials banned to US December 2024

This is the asymmetric tools-of-statecraft pattern: West weaponizes EUV/EDA/SME; China weaponizes minerals.

---

## Layer 10 — Hyperscaler demand and AI bottlenecks

### Hyperscaler capex

The demand layer is the part of the chain that is roaring. **Big-4 (Microsoft / Google / Amazon / Meta) 2025 capex \$410B; 2026 guide \$725B (+77% YoY)** ([Tom's Hardware](https://www.tomshardware.com/tech-industry/big-tech/big-techs-ai-spending-plans-reach-725-billion)).

- Microsoft: \$190B 2026 (with \$25B from rising memory costs alone)
- Amazon: \$200B
- Alphabet: \$190B
- ~75% AI-infrastructure tied
- Big tech AI capex tripled \$162B (2022) → \$448B (2025) ([Epoch AI](https://epoch.ai/data-insights/hyperscaler-capex-trend/))

### CoWoS and HBM as bottleneck

Already covered (Layer 6). The summary: SemiAnalysis has been documenting since early 2024 that "almost all HBM systems currently packaged on CoWoS by TSMC; CoWoS shortage created GPU shortages through Q2 2024." The bottleneck has not gone away; it has just moved upstream from CoWoS itself to the HBM stacks that feed it.

### Power and grid

**US data-center demand → 75.8 GW (2026), 108 GW (2028), 134.4 GW (2030)**; from ~4% to ~9% of US electricity by 2030 ([S&P Global](https://www.spglobal.com/energy/en/news-research/latest-news/electric-power/101425-data-center-grid-power-demand-to-rise-22-in-2025-nearly-triple-by-2030), [Belfer](https://www.belfercenter.org/research-analysis/ai-data-centers-us-electric-grid)). Virginia: 12.1 GW (2025) from 9.3 GW (2024). Texas: 9.7 GW (2025) from <8 GW (2024). PJM/Loudoun moratoria; ERCOT transmission constraints.

The grid is now a real chip-supply-chain constraint. A fab can be built in 24 months. A new transmission line takes 5–10. The binding constraint on Stargate-scale buildouts may end up being copper and steel, not silicon.

### Stargate and sovereign AI

**Stargate Project: \$500B over 4 years, 10 GW commitment by end-2025; \$100B initial deployment**; OpenAI + Oracle + SoftBank + MGX. Five new sites announced in September 2025 → ~7 GW + >\$400B ([OpenAI](https://openai.com/index/announcing-the-stargate-project/), [OpenAI](https://openai.com/index/five-new-stargate-sites/)).

**Stargate UAE** (G42-led): 1 GW first phase, 5 GW campus, online 2026 ([G42](https://www.g42.ai/resources/news/global-tech-alliance-launches-stargate-uae)). **Saudi Arabia**: AMD + Cisco + Humain JV, up to 1 GW by 2030; Nvidia AI factories announced ([Nvidia](https://nvidianews.nvidia.com/news/saudi-arabia-and-nvidia-to-build-ai-factories-to-power-next-wave-of-intelligence-for-the-age-of-reasoning)). The US authorized **70,000 GB300 chips for UAE/Saudi (~\$77B program)** ([WinBuzzer](https://winbuzzer.com/2025/11/20/u-s-approves-70000-nvidia-gb300-chips-for-uae-and-saudi-arabia-unlocking-77b-ai-push-xcxwbn/)).

### AI accelerator TAM

Lisa Su's forecast: **AI accelerator TAM \$500B by 2028 (60%+ CAGR)**. Custom ASIC TAM \$118B by 2033 (TrendForce).

---

## What the map shows

Five things I'd take away from the whole walk:

**1. Single points of failure are everywhere.** Spruce Pine (quartz). ASML (EUV). TSMC (leading-edge logic + CoWoS). Shin-Etsu / SUMCO (300mm wafers). Synopsys / Cadence / Siemens (EDA). Advantest (HBM test). Soitec (SOI). Each of these is a literal monopoly or a 2-firm duopoly. Each is in a concentrated geography (Taiwan, Japan, Netherlands, North Carolina). The supply chain is a long string of lock-ins.

**2. HHIs are extreme by any normal antitrust standard.** WFE Big Five 70%. EUV 100% ASML. EDA 75% three-firm. ATE 80% two-firm. Photoresist 80% Japan. Top-3 wafer 60%. Top-3 DRAM ~92%. Top-5 NAND ~95%. None of these markets would clear a Hart-Scott-Rodino review. The reason they exist is that the capital and learning curves are so steep that consolidation is structurally inevitable.

**3. The recent shock list is dense and mostly geopolitical.** COVID auto-chip crisis, Russia/Ukraine neon, GlobalWafers/Siltronic blocked, BIS Oct 2022 / Oct 2023 / Dec 2024 escalation, China Ga/Ge/REE/graphite retaliation, Hurricane Helene (Spruce Pine), Intel Magdeburg cancellation, ASML DUV Dutch licensing, Stargate \$500B announcement, AI capex surge, CoWoS bottleneck, HBM oversubscription. Any of these alone would have been the defining chip-industry story of 2010. Together, they are the chip industry of 2026.

**4. Industrial policy totals well over \$200B globally.** US \$52.7B + EU €43B + Japan ~¥4T + Korea \$19B + India ~\$15B+ committed. On top of >\$700B/year private hyperscaler capex. Subsidies are now a routine input cost. The US CHIPS Act broke the 50-year norm against direct industrial subsidy; every major economy followed within 24 months.

**5. The asymmetric tools of statecraft.** West weaponizes EUV / EDA / SME export controls. China weaponizes Ga / Ge / REE / graphite / antimony. Taiwan's silicon shield is the deterrent geometry between them. The hot-war scenario gets the press; the cold-war chemistry sets the price of every chip in your laptop.

The ground truth, after walking ten layers: there is no point in this stack where supply is actually elastic. Every layer is concentrated. Every layer has a chokepoint. And the demand wall is roaring upstream.

---

## Bibliography

Organized by category. ~140 references; primary sources, government reports, financial filings, industry research, and major journalism.

### A. Raw materials, chemicals, gases

1. Tom's Hardware — Spruce Pine quartz: https://www.tomshardware.com/tech-industry/semiconductors/the-worlds-semiconductor-industry-hinges-on-a-quartz-factory-in-north-carolina
2. CNBC — Helene quartz mine: https://www.cnbc.com/2024/10/03/helene-quartz-mine-semiconductor-north-carolina.html
3. Sibelco — Spruce Pine expansion: https://www.sibelco.com/en/news/sibelco-provides-an-update-on-the-expansion-of-its-spruce-pine-usa-high-purity-quartz-operations
4. Z2Data — Quartz mine disruption: https://www.z2data.com/insights/quartz-mine-disruption-in-spruce-pine-nc-threatens-semiconductor-manufacturing
5. CNN — Helene chip impact: https://www.cnn.com/2024/10/02/tech/semiconductor-supply-chain-north-carolina-helene/index.html
6. Fast Company — Sibelco restart: https://www.fastcompany.com/91208060/key-supplier-critical-semiconductor-material-back-operation-post-helene
7. Global Growth Insights — semiconductor-grade polysilicon: https://www.globalgrowthinsights.com/market-reports/polysilicon-for-semiconductor-market-119780
8. OpenPR — solar/semi polysilicon players: https://www.openpr.com/news/3656852/solar-and-semiconductor-grade-polysilicon-market-size-share
9. CSIS — Russia/Ukraine and chip gases: https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production
10. USITC — Ukraine, Neon, Semiconductors: https://www.usitc.gov/publications/332/executive_briefings/ebot_decarlo_goodman_ukraine_neon_and_semiconductors.pdf
11. The Register — Ukraine neon shutter: https://www.theregister.com/2022/03/11/ukraine_neon_supplies/
12. SPIE — Noble gases in wartime: https://spie.org/news/photonics-focus/mayjune-2023/supplying-noble-gases-for-photonics-in-war-time
13. CNBC — Laser neon shortage: https://www.cnbc.com/2022/03/25/russia-ukraine-war-laser-neon-shortage-threatens-semiconductor-industry.html
14. Founty Tech — Japan EUV photoresist monopoly: https://www.fountyltech.com/news/japanese-companies-monopolize-the-euv-photoresist-supply-market/
15. GMI Insights — Photoresist for advanced litho: https://www.gminsights.com/industry-analysis/photoresist-chemicals-for-advanced-lithography-market
16. Zion Market Research — CMP slurry: https://www.zionmarketresearch.com/report/cmp-slurry-market
17. OpenPR — CMP slurry players: https://www.openpr.com/news/2307382/cmp-slurry-market-versum-materials-saint-gobain-eminess
18. Linde — Electronics gases & Samsung: https://www.linde.com/news-and-media/2025/linde-to-expand-supply-of-industrial-gases-to-samsung-in-south-korea
19. Linde — Invisible but indispensable: https://www.linde-engineering.com/products-and-services/success-stories/2024/invisible-but-indispensable-electronics-gases-keep-the-chips-flowing

### B. Rare earths / Ga / Ge / graphite

20. CSIS — China REE & magnet restrictions: https://www.csis.org/analysis/chinas-new-rare-earth-and-magnet-restrictions-threaten-us-defense-supply-chains
21. PIIE — China critical-mineral controls: https://www.piie.com/blogs/realtime-economics/2024/chinas-export-controls-critical-minerals-arent-starving-united-states
22. IEA — Ga/Ge announcement: https://www.iea.org/policies/17893-announcement-on-the-implementation-of-export-control-of-items-related-to-gallium-and-germanium
23. Fast Markets — China lifts/imposes Ga/Ge ban: https://www.fastmarkets.com/insights/china-suspends-export-prohibition-on-superhard-materials-us/
24. Stimson — Ge/Ga consequences: https://www.stimson.org/2025/chinas-germanium-and-gallium-export-restrictions-consequences-for-the-united-states/
25. Z2Data — Ga/Ge ban impact: https://www.z2data.com/insights/how-chinas-gallium-germanium-export-ban-is-disrupting-supply-chains
26. RSIS — China 2025 REE controls: https://rsis.edu.sg/rsis-publication/rsis/analysing-chinas-2025-rare-earth-export-controls/
27. IEA — Supply concentration: https://www.iea.org/commentaries/with-new-export-controls-on-critical-minerals-supply-concentration-risks-become-reality
28. Mainrich — China dual-use REE compliance: https://mainrichmagnets.com/chinas-2025-dual-use-export-controls
29. War on the Rocks — burn and choke: https://warontherocks.com/the-burn-and-the-choke-why-semiconductor-controls-will-outlast-chinas-rare-earth-weapon/

### C. Silicon wafers / SOI

30. Intel Market Research — Si wafer market: https://www.intelmarketresearch.com/semiconductor-silicon-wafer-market-16631
31. Mark Lapedus — Silicon wafer upturn: https://marklapedus.substack.com/p/silicon-wafer-market-upturn-higher
32. Semiconductor Insight — Si wafer report: https://semiconductorinsight.com/report/silicon-wafer-market/
33. Euronews — GlobalWafers/Siltronic deal fail: https://www.euronews.com/next/2022/02/01/siltronic-m-a-globalwafers
34. CNBC — GlobalWafers blocked: https://www.cnbc.com/2022/02/01/globalwafers-bid-for-siltronic-fails-amid-tech-sovereignty-concerns-.html
35. Bloomberg — Siltronic takeover failure: https://www.bloomberg.com/news/articles/2022-02-01/siltronic-says-globalwafers-won-t-complete-5-billion-takeover
36. Soitec / Wikipedia: https://en.wikipedia.org/wiki/Soitec
37. UniversityWafer — Soitec UNIBOND: https://www.universitywafer.com/soitec-unibond-soi.html
38. Global Growth Insights — SOI wafer: https://www.globalgrowthinsights.com/market-reports/soi-wafer-market-115007

### D. Wafer fab equipment

39. Yole — WFE \$184B by 2030: https://www.yolegroup.com/press-release/wafer-fab-equipment-wfe-market-to-hit-184-billion-by-2030-for-equipment-and-services-driven-by-specialized-segment-growth-and-global-manufacturing-shifts/
40. NextMSC — WFE market: https://www.nextmsc.com/report/semiconductor-wafer-fab-equipment-wfe-market-se3846
41. SEMI — \$110B fab equipment 2025: https://www.semi.org/en/semi-press-release/global-fab-equipment-investment-expected-to-reach-110-billion-dollar-in-2025
42. SEMI — \$156B 2027 record: https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-projected-to-reach-a-record-of-156-billion-dollars-in-2027-semi-reports
43. ASML 2025 Annual Report: https://www.asml.com/en/investors/annual-report/2025/financials
44. Tom's Hardware — ASML \$71B 2030: https://www.tomshardware.com/tech-industry/semiconductors/asml-projects-usd71-billion-in-revenue-by-2030-as-demand-for-euv-lithography-machines-intensifies-due-to-ai-boom-china-sales-lag-behind-while-company-cashes-in-on-high-end-twinscan-systems
45. TechPowerUp — High-NA EXE \$380M: https://www.techpowerup.com/319071/asml-high-na-euv-twinscan-exe-machines-cost-usd-380-million-10-20-units-already-booked
46. ASML — China export update Oct 2024: https://www.asml.com/en/news/press-releases/2024/asml-expects-impact-of-updated-export-restrictions-to-fall-within-outlook-for-2025
47. CNBC — ASML 2025 China outlook: https://www.cnbc.com/2024/10/16/asml-2025-outlook-shows-us-chip-export-curbs-impacting-china-sales
48. Valuates — DUV litho market: https://reports.valuates.com/market-reports/QYRE-Auto-23W9388/global-duv-lithography-systems
49. Lam Research — Q4 FY24 results: https://newsroom.lamresearch.com/2025-01-29-Lam-Research-Corporation-Reports-Financial-Results-for-the-Quarter-Ended-December-29,-2024
50. Macrotrends — Lam revenue history: https://www.macrotrends.net/stocks/charts/LRCX/lam-research/revenue
51. Applied Materials — FY2024 results: https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-fourth-quarter-and-fiscal-year-2024
52. Tokyo Electron FY25 transcript: https://www.tel.com/ir/library/report/l8gqgo00000000gl-att/fy25q4transcript-e.pdf
53. Bismarck — TEL place in semis: https://brief.bismarckanalysis.com/p/tokyo-electrons-place-in-global-semiconductor
54. KLA 10-K 2024: https://ir.kla.com/sec-filings/all-sec-filings/content/0000319201-25-000024/0000319201-25-000024.pdf
55. Robert Castellano — KLA process control share: https://drrobertcastellano.substack.com/p/klas-market-share-growth-in-process
56. BALD Engineering — ASM ALD leadership: https://www.blog.baldengineering.com/2024/02/asm-international-spearheading.html
57. BizModelMastery — Inside ASM 50% ALD: https://bizmodelmastery.substack.com/p/inside-asm-how-a-50-ald-market-share

### E. Foundries (TSMC, Samsung, Intel, SMIC, Rapidus, GF/UMC)

58. TSMC 2024 Annual Report: https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf
59. TechSoda — TSMC 2024 highlights: https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report
60. Tom's Hardware — TSMC \$42B 2025 capex: https://www.tomshardware.com/tech-industry/semiconductors/tsmc-to-spend-usd42-billion-on-expansion-in-2025-ambitious-plans-detail-nine-production-facilities
61. TrendForce — TSMC N3 / AZ Fab 2 3nm 2H27: https://www.trendforce.com/news/2026/04/16/news-tsmc-n3-tightens-on-ai-demand-arizona-2nd-fab-3nm-volume-production-in-2h27-kumamoto-in-2028/
62. TrendForce — TSMC 3nm 180k WPM 2026: https://www.trendforce.com/news/2026/04/27/news-tsmc-3nm-monthly-capacity-may-hit-180k-wafers-by-2026-up-over-40-yoy-on-ai-demand/
63. Digitimes — TSMC AZ 12 fabs / Japan/Germany: https://www.digitimes.com/news/a20260106PD217/tsmc-arizona-market-germany-2026.html
64. Fortune — TSMC Dresden + Intel: https://fortune.com/2024/08/20/tsmc-eu-dresden-germany-chip-plant-intel-subsidies/
65. TrendForce — Samsung 2nm 30% yield: https://www.trendforce.com/news/2025/02/07/news-samsung-reportedly-achieves-30-yield-in-sf2-test-production-set-for-q4-mass-prodution/
66. TrendForce — Samsung 55–60% 2nm yields: https://www.trendforce.com/news/2025/11/25/news-samsung-reportedly-hits-55-60-2nm-yields-eyeing-an-edge-through-early-gaa-deployment/
67. Tom's Hardware — Intel 18A-PT / 14A: https://www.tomshardware.com/pc-components/cpus/intel-foundry-roadmap-update-new-18a-pt-variant-that-enables-3d-die-stacking-14a-process-node-enablement
68. TechInsights — SMIC 7nm in Mate 60: https://www.techinsights.com/blog/techinsights-finds-smic-7nm-n2-huawei-mate-60-pro
69. CSIS — Mate 60 national security: https://www.csis.org/analysis/contextualizing-national-security-concerns-over-chinas-domestically-produced-high-end-chip
70. IBM Research — Rapidus 2nm milestone: https://research.ibm.com/blog/rapidus-ibm-move-closer-to-scaling-out-2-nm-chip-production
71. Rapidus — ¥267.6B funding: https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/
72. The Register — Rapidus \$1.7B: https://www.theregister.com/2026/02/27/rapidus_funding/
73. SemiEngineering — foundry leadership: https://semiengineering.com/which-foundry-is-in-the-lead-it-depends/
74. TrendForce — GF–UMC merger talks: https://www.trendforce.com/news/2025/04/02/news-mature-node-shake-up-globalfoundries-reportedly-seeks-taiwans-approval-for-potential-umc-merger/
75. TrendForce — CHIPS Act final awards: https://www.trendforce.com/news/2024/12/23/news-chips-act-funding-highlights-before-trump-takes-office-tsmc-intel-samsung-and-more/

### F. Memory (DRAM, NAND, HBM)

76. Astute Group — SK Hynix 62% HBM: https://www.astutegroup.com/news/general/sk-hynix-holds-62-of-hbm-micron-overtakes-samsung-2026-battle-pivots-to-hbm4/
77. Tom's Hardware — HBM roadmaps: https://www.tomshardware.com/tech-industry/semiconductors/hbm-roadmaps-for-micron-samsung-and-sk-hynix-to-hbm4-and-beyond
78. KED Global — Samsung 12-Hi HBM3E qual: https://www.kedglobal.com/korean-chipmakers/newsView/ked202509190008
79. TrendForce — HBM3E 20% price hike: https://www.trendforce.com/news/2025/12/24/news-samsung-sk-hynix-reportedly-plan-20-hbm3e-price-hike-for-2026-as-nvidia-h200-asic-demand-rises/
80. Wccftech — DRAM Q4 share: https://wccftech.com/global-dram-industry-revenue-grows-by-13-6-quarter-over-quarter-samsung-still-leads-with-around-41-market-share/
81. KED Global — SK Hynix overtakes Samsung DRAM: https://www.kedglobal.com/korean-chipmakers/newsView/ked202504090006
82. Blocks & Files — NAND share: https://blocksandfiles.com/2024/09/13/samsung-and-sk-hynix-gain-nand-market-share/
83. Tom's Hardware — YMTC Wuhan fab: https://www.tomshardware.com/tech-industry/semiconductors/ymtc-moves-ahead-with-third-fab-in-wuhan-despite-us-sanctions
84. Tom's Hardware — CXMT DDR5/LPDDR5X: https://www.tomshardware.com/pc-components/dram/chinas-banned-memory-maker-cxmt-unveils-surprising-new-chipmaking-capabilities-despite-crushing-us-export-restrictions-ddr5-8000-and-lpddr5x-10667-displayed
85. Yole — Kioxia IPO + WD split: https://www.yolegroup.com/strategy-insights/kioxias-ipo-and-western-digitals-split-nand-industry-consolidation-looms/
86. CNBC — WD splits flash: https://www.cnbc.com/2023/10/30/western-digital-to-split-flash-memory-business-after-kioxia-merger-talks-stall.html
87. Digitimes — CXMT DOD blacklist: https://www.digitimes.com/news/a20250107PD235/cxmt-us-department-of-defense-blacklist-dram-nand-military.html

### G. Advanced packaging

88. SemiAnalysis — CoWoS HBM constraints: https://newsletter.semianalysis.com/p/ai-capacity-constraints-cowos-and
89. Wccftech — Nvidia booked TSMC packaging: https://wccftech.com/nvidia-alone-has-tsmc-advanced-packaging-lines-booked-for-several-years-ahead/
90. Digitimes — TSMC CoWoS Nvidia 2026–27: https://www.digitimes.com/news/a20251210PD218/tsmc-cowos-capacity-nvidia-equipment.html
91. Digitimes — CoWoS 80% CAGR: https://www.digitimes.com/news/a20260410VL204/packaging-capacity-tsmc-nvidia-demand.html
92. Samsung — Advanced packaging: https://semiconductor.samsung.com/foundry/advanced-package/
93. TrendForce — Top 10 OSAT 2024: https://www.trendforce.com/presscenter/news/20250513-12577.html
94. UCIe Consortium specs: https://www.uciexpress.org/specifications
95. SemiAnalysis — advanced packaging review: https://newsletter.semianalysis.com/p/advanced-packaging-part-2-review
96. TrendForce — Intel EMIB / Apple / Qualcomm: https://www.trendforce.com/news/2025/11/18/news-intel-advanced-packaging-reportedly-gains-traction-with-apple-and-qualcomm-seeking-emib-expertise/

### H. Design / IP / EDA

97. Nvidia 10-K FY24: https://www.sec.gov/Archives/edgar/data/1045810/000104581024000029/nvda-20240128.htm
98. Nvidia 10-K FY25: https://www.sec.gov/Archives/edgar/data/1045810/000104581025000023/nvda-20250126.htm
99. Nvidia — Q4 FY24 results: https://investor.nvidia.com/news/press-release-details/2024/NVIDIA-Announces-Financial-Results-for-Fourth-Quarter-and-Fiscal-2024/
100. Nvidia — Blackwell platform: https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing
101. Nvidia GB200 NVL72: https://www.nvidia.com/en-us/data-center/gb200-nvl72/
102. NextPlatform — Nvidia roadmap to 2028: https://www.nextplatform.com/2025/03/19/nvidia-draws-gpu-system-roadmap-out-to-2028/
103. AMD — Computex 2024 Instinct/EPYC: https://www.amd.com/en/newsroom/press-releases/2024-6-2-amd-extends-ai-and-high-performance-leadership-in-.html
104. AMD — Instinct roadmap expanded: https://www.amd.com/en/newsroom/press-releases/2024-6-2-amd-accelerates-pace-of-data-center-ai-innovation-.html
105. Intel — Gaudi 3 / Open AI strategy: https://newsroom.intel.com/artificial-intelligence/vision-2024-enterprise-ai-gaudi-3-open-systems-strategy
106. Intel — Granite Rapids/Sierra Forest brief: https://download.intel.com/newsroom/2023/data-center-hpc/Hot_Chips_23_Granite_Rapids_Sierra_Forest_Xeon_Press_Briefing.pdf
107. TrendForce — Trillium TPU v6: https://www.trendforce.com/news/2024/05/15/news-google-unveils-6th-generation-tpu-scheduled-to-launch-later-this-year/
108. SemiEngineering — State of EDA 2024: https://semiengineering.com/the-state-of-the-eda-industry-in-2024/
109. SemiAnalysis — Apple-TSMC partnership: https://newsletter.semianalysis.com/p/apple-tsmc-the-partnership-that-built
110. Tom's Hardware — Snapdragon X2: https://www.tomshardware.com/pc-components/cpus/qualcomms-new-snapdragon-x2-elite-extreme-and-elite-chips-for-pcs-stretch-up-to-a-record-5-ghz-3nm-arm-chips-sport-new-oryon-prime-cores
111. HeyGoTrade — Broadcom vs Marvell 60/15%: https://www.heygotrade.com/en/blog/broadcom-vs-marvell-custom-ai-silicon-battle-2026/
112. The Next Web — Google–Marvell inference TPU: https://thenextweb.com/news/google-marvell-ai-chips-inference-tpu-broadcom
113. TrendForce — China revenue at risk EDA: https://www.trendforce.com/news/2025/06/02/news-china-revenue-at-risk-as-u-s-curbs-slam-eda-giants-impact-on-synopsys-cadence-and-more/
114. DataGravity — Synopsys/Cadence \$160B unsung: https://www.datagravity.dev/p/synopsys-and-cadence-the-160b-unsung

### I. Test (ATE)

115. Advantest Investors Guide 2024: https://www.advantest.com/document/en/investors/ir-library/investors-guide/Investors_Guide_2407E.pdf
116. Seeking Alpha — Advantest/Teradyne duopoly: https://seekingalpha.com/article/4837312-advantest-teradyne-market-share-shifts-in-this-duopoly

### J. Geopolitics / policy

117. Congressional Research Service — US export controls: https://www.congress.gov/crs-product/R48642
118. WilmerHale — BIS Dec 2024 rules: https://www.wilmerhale.com/en/insights/client-alerts/20241206-bis-issues-sweeping-additional-restrictions-on-semiconductors-and-advanced-computing-entity-list-designations
119. CSIS — Where the chips fall (Biden 2022–2024): https://www.csis.org/analysis/where-chips-fall-us-export-controls-under-biden-administration-2022-2024
120. Wikipedia — CHIPS and Science Act: https://en.wikipedia.org/wiki/CHIPS_and_Science_Act
121. SIA — Supply chain investments: https://www.semiconductors.org/chip-supply-chain-investments/
122. SEMI Europe — Chips Act report: https://www.semi.org/sites/semi.org/files/2025-11/SEMI_Chips_Act_Report_Full_Report.pdf
123. EE Times — Germany redirects Intel funds: https://www.eetimes.com/germany-redirects-intel-funds-into-new-wave-of-semiconductor-projects/
124. METI — Semiconductor strategy July 2024: https://www.meti.go.jp/english/policy/0704_001.pdf
125. CNBC — Japan \$3.89B Rapidus: https://www.cnbc.com/2024/04/02/japan-approves-3point9-billion-in-subsidies-to-domestic-chip-maker-rapidus-.html
126. Brookings — Japan semi renaissance: https://www.brookings.edu/articles/the-renaissance-of-the-japanese-semiconductor-industry/
127. PIIE — US/Korean Chips Acts costs: https://www.piie.com/blogs/realtime-economics/2024/us-and-korean-chips-acts-are-spurring-investment-high-cost
128. Fortune — Korea \$19B package: https://fortune.com/2024/05/23/south-korea-19-billion-chip-funding-package-no-subsidies/
129. India Briefing — 4 new fabs: https://www.india-briefing.com/news/india-4-new-semiconductor-plants-approved-2025-39180.html/
130. Carnegie — India ISM story so far: https://carnegieendowment.org/research/2025/08/indias-semiconductor-mission-the-story-so-far?lang=en
131. MIT Technology Review — Taiwan silicon shield weakening: https://www.technologyreview.com/2025/08/15/1121358/taiwan-silicon-shield-tsmc-china-chip-manufacturing/
132. CSET — Semiconductor supply chain: https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/
133. CSET — Securing semiconductor supply chains: https://cset.georgetown.edu/publication/securing-semiconductor-supply-chains/
134. TrendForce — Netherlands DUV controls: https://www.trendforce.com/news/2024/09/09/news-netherlands-expands-export-control-over-asmls-two-duv-machines-effective-on-september-7th/
135. Stimson — Why Taiwan fears erosion of silicon shield: https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/
136. KED Global — Trump equity stakes in CHIPS awardees: https://www.kedglobal.com/business-politics/newsView/ked202508200001

### K. Hyperscaler demand / power / Stargate

137. OpenAI — Announcing Stargate: https://openai.com/index/announcing-the-stargate-project/
138. OpenAI — 5 new Stargate sites: https://openai.com/index/five-new-stargate-sites/
139. CNBC — Texas Stargate first DC: https://www.cnbc.com/2025/09/23/openai-first-data-center-in-500-billion-stargate-project-up-in-texas.html
140. G42 — Stargate UAE launch: https://www.g42.ai/resources/news/global-tech-alliance-launches-stargate-uae
141. Nvidia — Saudi AI factories: https://nvidianews.nvidia.com/news/saudi-arabia-and-nvidia-to-build-ai-factories-to-power-next-wave-of-intelligence-for-the-age-of-reasoning
142. WinBuzzer — 70k GB300 UAE/Saudi \$77B: https://winbuzzer.com/2025/11/20/u-s-approves-70000-nvidia-gb300-chips-for-uae-and-saudi-arabia-unlocking-77b-ai-push-xcxwbn/
143. Tom's Hardware — Big Tech \$725B 2026: https://www.tomshardware.com/tech-industry/big-tech/big-techs-ai-spending-plans-reach-725-billion
144. Epoch AI — hyperscaler capex: https://epoch.ai/data-insights/hyperscaler-capex-trend/
145. S&P Global — DC grid demand 2030: https://www.spglobal.com/energy/en/news-research/latest-news/electric-power/101425-data-center-grid-power-demand-to-rise-22-in-2025-nearly-triple-by-2030
146. Belfer Center — AI data centers + grid: https://www.belfercenter.org/research-analysis/ai-data-centers-us-electric-grid
147. NZero — US power demand DC/AI: https://nzero.com/blog/u-s-power-demand-hits-new-highs-driven-by-data-centers-ai-and-grid-constraints/
