---
title: "Society of Models: A Citation-Grounded Survey of AI Agent Collaboration Research (2023–2026)"
author: Dendi Suhubdy
pubDatetime: 2026-05-01T07:50:00Z
featured: false
draft: false
tags:
  - ai
  - agents
  - llm
  - multi-agent
  - icml
  - iclr
  - neurips
  - autogen
  - metagpt
  - swe-bench
  - scalable-oversight
  - debate
  - ai-safety
description: "An end-to-end survey of AI agent collaboration as it stands in May 2026, grounded in 100+ citations from ICML/ICLR/NeurIPS 2023–2026 and arXiv. Architectures (AutoGen, MetaGPT, Magentic-One, OpenHands, ADAS, AFlow), communication protocols (MCP, A2A), critic/verifier patterns (Self-Refine, Reflexion, LLM-Modulo), planning and decomposition (ReAct, Tree-of-Thoughts, CodeAct, GPTSwarm), benchmarks (SWE-bench, GAIA, WebArena, OSWorld, τ-bench, MLE-bench, TheAgentCompany), the contrarian compute-fair-comparison literature (Stop Overvaluing MAD, Agentless, Mixture-of-Agents rethinks), and safety/control (AI Control, debate, collusion, AgentHarm). With negative results and the methodological crisis foregrounded."
---

There is a methodological crisis in AI agent collaboration research, and almost nobody outside the field is talking about it.

The crisis is this: the dominant story of 2023–2024 — that arranging multiple LLMs into elaborate societies of agents would produce capabilities that no single model could — is now being systematically falsified by the 2025–2026 compute-fair-comparison literature. When you give a single agent the same number of inference tokens as a multi-agent debate, the multi-agent system often *loses*. When you compare a clever single-agent SWE scaffolding (Agentless) against multi-agent SWE systems (Devin) on the same benchmark, the single agent wins at lower cost. When you add Mixture-of-Agents on top of GPT-4, careful follow-ups find that homogeneous self-mixing matches heterogeneous mixing. The picture is not that multi-agent is useless. The picture is that the *case* for it has been dramatically over-claimed.

But the field is also genuinely producing things that work. Generator-verifier loops (the simplest two-agent system) are robustly positive. Hierarchical orchestrator-worker patterns (Anthropic's June 2025 multi-agent research system, Microsoft's Magentic-One) deliver real gains on parallelizable tasks. Debate with information asymmetry (Khan et al., ICML 2024 Best Paper) provides the strongest empirical scalable-oversight evidence we have. Memory and skill-library architectures (Voyager, Agent Workflow Memory) produce durable improvements. Tool-use protocols (MCP, A2A) are standardizing faster than the research consensus on how to use them.

This post is a survey of where the field actually is in May 2026, organized around eight clusters of work and grounded in ~100 specific papers. I'll be opinionated about which directions look promising and which look like wasted compute. The bibliography at the end groups citations by venue (ICML, ICLR, NeurIPS, ACL/EMNLP, COLM/UIST/AAAI, arXiv, industry).

Three claims structure the whole piece:

1. **The architectural taxonomy has stabilized into four families** — single-agent + tools (ReAct-style), flat multi-agent (CAMEL, AgentVerse), hierarchical orchestrator-worker (MetaGPT, Magentic-One), and graph/network (DyLAN, GPTSwarm, AFlow). Almost all production deployments are flavors of #1 or #3. The academic literature is heavily skewed toward #2 and #4. This mismatch is informative.
2. **The benchmarks have caught up to the architectures** — SWE-bench Verified, GAIA, OSWorld, TheAgentCompany, τ-bench, MLE-bench. We can now actually measure what works. The measurements are deflationary.
3. **Safety, control, and collusion are now first-class research areas** — AI Control (Greenblatt et al.), debate-as-scalable-oversight (Khan et al., Brown-Cohen et al.), Secret Collusion (Motwani et al., NeurIPS 2024), AgentHarm (ICLR 2025). The field is, slowly, learning to evaluate agents adversarially.

---

## Table of contents

---

## 1. Architectures: four families that have stabilized

The taxonomy is now mostly settled. There are four architectural families, each with a canonical paper or two:

### Family A — Single agent + tool use (ReAct lineage)

The foundation is **ReAct** [Yao, Zhao, Yu, Du, Shafran, Narasimhan, Cao; ICLR 2023; [arXiv:2210.03629](https://arxiv.org/abs/2210.03629)], which interleaves *Thought / Action / Observation* steps. Almost every modern tool-using agent inherits this loop. The 2024 elaboration that matters most for production is **CodeAct** [Wang, Chen, Yuan, Zhang, Li, Peng, Ji; ICML 2024; [arXiv:2402.01030](https://arxiv.org/abs/2402.01030)], which collapses all actions into Python code executed in an interpreter — up to 20% higher success on API-Bank and the architectural foundation of OpenHands.

Production stacks in this family include OpenAI's Agents SDK (March 2025, evolved from Swarm), Anthropic's Claude Agent SDK and Computer Use API (October 2024 with Claude 3.5 Sonnet "new", continued through Sonnet 3.5/3.6/4/4.5/4.6/4.7), Google's Gemini Agent / ADK, and Mistral's Agent SDK.

### Family B — Flat multi-agent (CAMEL, AgentVerse)

**CAMEL** [Li, Hammoud, Itani, Khizbullin, Ghanem; NeurIPS 2023; [arXiv:2303.17760](https://arxiv.org/abs/2303.17760)] is the original LLM role-play paper: an "Inception Prompting" pattern pairs an AI User with an AI Assistant, and the conversational data they generate has been a core training source for downstream agent fine-tuning.

**AgentVerse** [Chen, Su, Zuo et al.; ICLR 2024; [arXiv:2308.10848](https://arxiv.org/abs/2308.10848)] explicitly tests the "greater than the sum of its parts" hypothesis: dynamic team composition adjusts during task execution, and the paper documents emergent social behaviors (volunteering, conformity, destructive criticism). It is one of the cleanest references for emergence claims in flat multi-agent systems.

**ChatDev** [Qian, Liu, Liu et al.; ACL 2024; [arXiv:2307.07924](https://arxiv.org/abs/2307.07924)] introduced the "chat chain" and "communicative dehallucination": specialized roles communicate in natural language for design and in code for debug. Same lab line as AgentVerse.

### Family C — Hierarchical orchestrator-worker

This is the family that is genuinely working in production.

**MetaGPT** [Hong, Zhuge, Chen et al.; ICLR 2024 Oral; [arXiv:2308.00352](https://arxiv.org/abs/2308.00352)] encodes Standardized Operating Procedures (SOPs) into prompt sequences for an "assembly-line" of role-bearing agents (PM, Architect, Engineer, QA). On HumanEval/MBPP and the SoftwareDev benchmark it beats prior multi-agent chat systems; the ICLR 2024 Oral acceptance confirms its impact.

**Magentic-One** [Fourney, Bansal, Mozannar et al.; Microsoft Research; [arXiv:2411.04468](https://arxiv.org/abs/2411.04468)] is the canonical orchestrator-worker reference: a lead Orchestrator agent tracks progress, re-plans on failure, and dispatches to four specialists (WebSurfer, FileSurfer, Coder, ComputerTerminal). Headline: statistically competitive with SOTA on GAIA, AssistantBench, and WebArena, with modular agent add/remove without prompt re-tuning.

**Anthropic's multi-agent research system** (engineering blog, June 13, 2025) reports a 90.2% improvement on internal research evals over single-agent Opus 4 — but at ~15× the token cost. The lesson: orchestrator-worker delivers when the task is naturally parallel (research, exploration, parallel tool use), but cost scales aggressively.

### Family D — Graph / network agents

**GPTSwarm** [Zhuge, Wang, Kirsch et al.; ICML 2024 Oral; [arXiv:2402.16823](https://arxiv.org/abs/2402.16823)] models agents as nodes in an optimizable computational graph with edge optimization.

**DyLAN** [Liu, Zhang, Li et al.; [arXiv:2310.02170](https://arxiv.org/abs/2310.02170)] is a dynamic communication structure with inference-time agent selection and an Agent Importance Score; up to +25% accuracy on MMLU subjects.

**ADAS — Automated Design of Agentic Systems** [Hu, Lu, Clune; ICLR 2025; [arXiv:2408.08435](https://arxiv.org/abs/2408.08435)] uses a meta-agent that iteratively writes new agent code; produces designs that beat human-designed agents on coding/science/math benchmarks and transfer across LLMs.

**AFlow** [Zhang, Xiang et al.; ICLR 2025 Oral; [arXiv:2410.10762](https://arxiv.org/abs/2410.10762)] runs MCTS over code-represented workflows; 5.7% average improvement, lets smaller models beat GPT-4o on specific tasks at 4.55% the cost.

The honest summary across families: in 2026, single-agent + tools (Family A) and hierarchical orchestrator-worker (Family C) own production. Flat multi-agent (B) and graph/network (D) are the active academic frontier, but evidence that they consistently beat well-scaffolded single agents at matched compute is weak (see §6).

---

## 2. Communication and coordination

The 2024–2026 story: the field largely abandoned learned discrete codes (a major 2018–2022 MARL research thread) for natural-language-with-JSON-tool-schemas, then bolted on standardization protocols (MCP, A2A) on top of that.

**Model Context Protocol (MCP)** — Anthropic, November 2024. Open standard for AI ↔ tool/data integration: prompts, resources, tools, sampling. Strictly speaking single-agent ↔ tools, but in practice MCP servers are increasingly used as the substrate that other agents expose themselves through. Adopted by OpenAI (March 2025) and Google DeepMind. Recent Anthropic engineering writing argues code-as-action is more efficient than direct tool calls for complex agentic flows.

**Agent2Agent Protocol (A2A)** — Google, April 2025; donated to Linux Foundation. Capability discovery via "Agent Cards" (JSON), task lifecycle states, agent ↔ agent collaboration. Launched with 50+ partners (Salesforce, SAP, Atlassian, MongoDB, Workday). v0.3 added gRPC support and signed cards.

The **MCP-vs-A2A** framing is now standard in industry: *MCP equips an agent with tools; A2A lets agents delegate to each other*. Whether the academic community will converge on these standards or fork into something else is one of the open governance questions of 2026.

On the research side, the canonical communication-pattern papers are:

**Du et al. multi-agent debate** [Du, Li, Torralba, Tenenbaum, Mordatch; ICML 2024 Spotlight; [arXiv:2305.14325](https://arxiv.org/abs/2305.14325)] is the reference paper for "multiple LMs propose, critique, converge." Multiple GPT-3.5/GPT-4 instances debate over rounds; the final answer is more factually accurate and better at strategic reasoning (chess move quality, GSM8K, MMLU). Explicitly cites Minsky's *Society of Mind* as inspiration. *This is the paper that most often gets cited as evidence that multi-agent debate works — and the paper whose claims have been substantially walked back by the 2025 compute-fair-comparison literature.*

**Khan et al.** [Debating with More Persuasive LLMs Leads to More Truthful Answers; Khan, Hughes, Valentine, Ruis, Sachan, Radhakrishnan, Grefenstette, Bowman, Rocktäschel, Perez; ICML 2024 Best Paper; [arXiv:2402.06782](https://arxiv.org/abs/2402.06782)] is the strongest empirical scalable-oversight result yet. Stronger expert debaters defending opposing answers help weaker non-expert judges (76% accuracy vs 48% baseline; 88% vs 60% for human judges). Crucially, *optimizing debaters for persuasiveness improves judge truthfulness* — the single most important contrarian finding of 2024 because it cuts against the worry that persuasion-optimization would degrade truth.

**Encouraging Divergent Thinking ("MAD")** [Liang, He, Jiao, Wang et al.; EMNLP 2024; [arXiv:2305.19118](https://arxiv.org/abs/2305.19118)] introduces the tit-for-tat debate format with a judge; addresses "Degeneration-of-Thought" where a single LM locked into a wrong answer cannot recover. Notable negative finding: judges are biased toward agents using the same backbone LLM.

---

## 3. Critic / verifier patterns: the only multi-agent design with consistently positive evidence

If you read the entire literature carefully, one pattern stands out as consistently producing real gains: **generator + verifier**. It is the simplest possible "multi-agent" system (and arguably it isn't multi-agent at all, since it's often the same LLM playing two roles), but it is also the most empirically robust.

**Self-Refine** [Madaan, Tandon, Gupta et al.; NeurIPS 2023; [arXiv:2303.17651](https://arxiv.org/abs/2303.17651)] uses the same LLM as generator, refiner, and feedback provider. ~20% absolute improvement averaged across 7 tasks. The single-LLM "two-agent illusion" baseline that everything else has to beat.

**Reflexion** [Shinn, Cassano, Berman, Gopinath, Narasimhan, Yao; NeurIPS 2023; [arXiv:2303.11366](https://arxiv.org/abs/2303.11366)] runs an Actor / Evaluator / Self-Reflection triad with verbal RL via memory of self-criticism. 91% pass@1 on HumanEval, above GPT-4 raw. Architecturally a 3-agent pipeline, philosophically a 1-agent loop.

**LLM-Modulo Frameworks** [Kambhampati, Valmeekam, Guan, Verma, Stechly, Bhambri, Saldyt, Murthy; ICML 2024; [arXiv:2402.01817](https://arxiv.org/abs/2402.01817)] is the strongest contrarian voice from the symbolic-AI community. Hard line: pure LLMs cannot plan or self-verify; the LLM must be in a closed loop with a *sound* external verifier (PDDL planners, model checkers) or no correctness guarantee exists. The position paper plus formal framework is the most rigorous statement of "you need a verifier outside the LLM" available.

The takeaway: where the verifier is sound (a Python interpreter, a unit test, a PDDL planner, a chess engine, a formal proof checker), the generator-verifier pattern is reliably positive. Where the verifier is itself an LLM judging another LLM, the picture is muddier — see §6 on sycophancy and same-backbone bias.

---

## 4. Planning and task decomposition

Beyond ReAct, the modern planning-and-decomposition literature is centered on a few key works:

**Tree of Thoughts (ToT)** [Yao, Yu, Zhao, Shafran, Griffiths, Cao, Narasimhan; NeurIPS 2023; [arXiv:2305.10601](https://arxiv.org/abs/2305.10601)]: deliberate tree search over reasoning steps. On Game-of-24, 74% vs 4% for chain-of-thought. The reference architecture for "search over thoughts."

**Graph of Thoughts** [Besta, Blach, Kubicek et al.; AAAI 2024; [arXiv:2308.09687](https://arxiv.org/abs/2308.09687)]: generalized DAG of LLM thoughts; 62% quality improvement over ToT on sorting at 31% lower cost.

**LLMCompiler** [Kim, Moon, Tabrizi, Lee, Mahoney, Keutzer, Gholami; ICML 2024; [arXiv:2312.04511](https://arxiv.org/abs/2312.04511)]: a planner builds a DAG of calls executed in parallel by a Task Fetching Unit. 3.7× speedup, 6.7× cost saving, ~9% accuracy gain over ReAct on relevant tasks. Berkeley work that has been quietly influential in production tool-use systems.

**AutoAgents** [Chen, Dong et al.; IJCAI 2024; [arXiv:2309.17288](https://arxiv.org/abs/2309.17288)]: a Planner + Observer co-design specialized agents per task; compares favorably to MetaGPT on certain coding/QA splits.

**Agent Workflow Memory (AWM)** [Wang, Mao, Fried, Neubig; CMU/Stanford; [arXiv:2409.07429](https://arxiv.org/abs/2409.07429)] is one of the most important results of 2024–2025: agents *induce reusable workflows* from their own past trajectories. +24.6% on Mind2Web, +51.1% relative on WebArena while *reducing* step counts. This is the single best evidence we have that agents can learn from their own experience without parameter updates.

**Voyager** [Wang, Xie, Jiang, Mandlekar, Xiao, Zhu, Fan, Anandkumar; [arXiv:2305.16291](https://arxiv.org/abs/2305.16291)] is the embodied-agent analogue: a lifelong-learning Minecraft agent with automatic curriculum, skill library, iterative prompting; 3.3× more unique items, 15.3× faster tech-tree milestones than prior SOTA. Memory + skill-library is the architectural pattern that ties Voyager and AWM together.

**AgentTuning** [Zeng, Liu, Lu et al.; ACL Findings 2024; [arXiv:2310.12823](https://arxiv.org/abs/2310.12823)] addresses the parameter-update side: instruction tuning specifically for agentic ability. AgentLM-70B matches GPT-3.5-turbo on unseen agent tasks.

The bottom line: planning architectures (ToT, GoT, LLMCompiler) help on specific structured tasks. Memory + skill libraries (Voyager, AWM) help durably across tasks. Automated workflow design (ADAS, AFlow, GPTSwarm) is the open frontier, with credible early results.

---

## 5. Benchmarks: we can finally measure agents

The benchmarks are the most important thing that happened in 2024. Without them, the multi-agent debate would still be aesthetic. With them, we can falsify claims.

**SWE-bench** [Jimenez, Yang, Wettig, Yao, Pei, Press, Narasimhan; ICLR 2024] — 2,294 real GitHub issues. As of 2026, top entries are around 75% on SWE-bench Verified; ByteDance and Anthropic lead. The Anthropic-curated **SWE-bench Verified** (OpenAI, 2024) is the standard sub-benchmark.

A critical contrarian paper: **The SWE-Bench Illusion** [arXiv:2506.12286] argues memorization confound, since most repos are pre-training data. **SWE-Bench+** [arXiv:2410.06992] addresses contamination; **SWE-Bench Multimodal** [arXiv:2410.03859] adds visual UI; **SWE-Bench Pro** [arXiv:2509.16941] is the long-horizon successor where Claude Sonnet 4.5/4 lead at 43.6%/42.7%.

The pattern these benchmarks expose is uncomfortable: top scores collapse meaningfully when you control for contamination or extend horizon. SWE-bench at 75% does not mean "agents can do SWE." It means "agents can do issues structurally similar to those they saw in pretraining."

**GAIA** [Mialon, Fourrier, Swift, Wolf, LeCun, Scialom; ICLR 2024; [arXiv:2311.12983](https://arxiv.org/abs/2311.12983)]: 466 questions; humans 92% vs GPT-4-with-plugins 15%. Magentic-One is competitive with SOTA; this is the benchmark where multi-agent does help.

**WebArena** [Zhou, Xu, Zhu et al.; ICLR 2024; [arXiv:2307.13854](https://arxiv.org/abs/2307.13854)]: 812 long-horizon tasks across e-commerce, forums, code, CMS. Best GPT-4 agent: 14.41% vs human 78.24%.

**VisualWebArena** [Koh, Lo, Jang et al.; ACL 2024; [arXiv:2401.13649](https://arxiv.org/abs/2401.13649)]: 910 visually grounded tasks.

**AgentBench** [Liu, Yu, Zhang et al.; ICLR 2024; [arXiv:2308.03688](https://arxiv.org/abs/2308.03688)]: 8 environments, 29 LLMs evaluated; significant gap between top closed models and OSS ≤70B.

**τ-bench** [Yao, Shinn, Razavi, Narasimhan; [arXiv:2406.12045](https://arxiv.org/abs/2406.12045)]: retail and airline tool-use sims with simulated users. SOTA function-calling agents <50% on tasks; pass\^8 < 25% in retail. The paper that made "consistency" the relevant axis. **τ²-Bench** [arXiv:2506.07982] adds dual-control evaluation.

**OSWorld** [Xie, Zhang, Chen et al.; NeurIPS 2024 D&B; [arXiv:2404.07972](https://arxiv.org/abs/2404.07972)]: 369 real OS tasks (Ubuntu / Windows / macOS). Humans 72.36% vs best agent 12.24%. The single most sobering benchmark for "AI replaces knowledge workers" — operating-system competence is the closest proxy and the gap is enormous.

**MLE-bench** [Chan, Chowdhury, Jaffe et al.; OpenAI; [arXiv:2410.07095](https://arxiv.org/abs/2410.07095)]: 75 Kaggle ML competitions. o1-preview + AIDE achieves Kaggle bronze on 16.9%. Follow-up [arXiv:2507.02554] pushes MLE-bench Lite from 39.6% to 47.7% via search/exploration variants. **MLR-Bench** [arXiv:2505.19955] extends to ML research tasks.

**TheAgentCompany** [Xu, Wu, Cao et al.; CMU; [arXiv:2412.14161](https://arxiv.org/abs/2412.14161)]: 175 tasks in a simulated software company. Best agent (Claude 3.5 Sonnet) 24%; Gemini 2.0 Flash 11.4%; GPT-4o 8.6%. *This is the benchmark that should be cited every time someone claims "AI agents will replace knowledge work this year."*

**SWE-Gym** [Pan, Shen, Liu et al.; ICML 2025; [arXiv:2412.21139](https://arxiv.org/abs/2412.21139)] is the first training environment combining 2,438 real GitHub Python tasks with executable runtime; +19% absolute resolve rate; 32.0% on SWE-Bench Verified for open-weight agents. Companion **R2E-Gym** [COLM 2025; [arXiv:2504.07164](https://arxiv.org/abs/2504.07164)] adds procedural environment generation.

### The architectural angle on benchmarks

This is where the field's most uncomfortable result lives.

Cognition's **Devin** (March 2024 technical report) reported 13.86% on a 25% SWE-bench sample as a multi-agent system, with substantial fanfare. **Agentless** [Xia, Deng, Dunn, Zhang; [arXiv:2407.01489](https://arxiv.org/abs/2407.01489)] then hit **32.00% on SWE-bench Lite at \$0.70 per issue** using only localization → repair → validation, with no agent loop at all.

Agentless is the canonical "single-agent beats multi-agent at the same compute" data point in software engineering. It triggered a serious re-evaluation of agentic complexity. **Moatless** (Antonio Antonsson, 2024) is the second well-known minimalist SWE entrant. **OpenHands** [Wang et al.; ICLR 2025; [arXiv:2407.16741](https://arxiv.org/abs/2407.16741)] is the open multi-agent platform that grew out of OpenDevin and provides the production base for the OpenHands SDK [arXiv:2511.03690]. **Kimi-Dev** [arXiv:2509.23045] uses agentless training as a *prior* for SWE-agents. **LIVE-SWE-AGENT** [arXiv:2511.13646] explores agents that self-evolve their own scaffold during a SWE-bench run.

The pattern is unmistakable: minimalist single-agent scaffolds with strong verifiers (compilation, test runs) often match or beat orchestrated multi-agent systems on SWE-bench at substantially lower cost. The multi-agent approach is *not winning* in the most measurable agent application.

---

## 6. Theory and the methodological crisis

This is the live methodological dispute of 2025–2026.

### The original positive case

**Mixture-of-Agents (MoA)** [Wang, Mu, Hooi, Sukhbaatar, Bordia, Bachem, Beirami, Mukherjee; Together AI; [arXiv:2406.04692](https://arxiv.org/abs/2406.04692)] introduced layered MoA where each layer's agents see prior-layer outputs. On AlpacaEval 2.0, open-source MoA reaches 65.1% vs GPT-4 Omni's 57.5%. The paper coined the *collaborativeness* property: an LLM tends to generate better responses when shown other models' outputs even when those models are weaker. This was widely cited as evidence that ensembling LLMs produces super-additive gains.

### The contrarian case

**Rethinking Mixture-of-Agents** [arXiv:2502.00674] finds heterogeneous mixing is often *no better* than homogeneous self-mixing, undermining the original interpretation.

**Stop Overvaluing Multi-Agent Debate** [arXiv:2502.08788] is the most explicit contrarian paper of 2025. Under matched compute, multi-agent debate often fails to beat Chain-of-Thought + Self-Consistency. The authors argue we systematically over-credit MAD in evaluations — typically because MAD baselines use multiple LLM calls and CoT baselines do not.

**Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets** [arXiv:2604.02460] is the hardest version of this critique. When test-time compute is normalized, multi-agent systems often *lose* to a single-agent system using the same tokens for longer reasoning. This is the "compute-fair comparison" that should be the default for any future MAS claim.

**Talk Isn't Always Cheap: Understanding Failure Modes in Multi-Agent Debate** [arXiv:2509.05396] gives a taxonomy of MAD failure: weaker agents corrupt correct answers; sycophantic convergence to the loudest agent; cascade hallucination. *Same-backbone bias* — judges preferring the agent that uses the same underlying LLM — is the recurring failure mode.

**Diversity of Thought Elicits Stronger Reasoning Capabilities in Multi-Agent Debate Frameworks** [arXiv:2410.12853] is the positive direction: diverse role / persona prompts help. **Free-MAD: Consensus-Free Multi-Agent Debate** [arXiv:2509.11035] argues that forced consensus is the bug; track distinct positions instead.

**Large Language Models Miss the Multi-Agent Mark** [La Malfa et al.; [arXiv:2505.21298](https://arxiv.org/abs/2505.21298)] is the AAMAS-tradition critique: LLM "multi-agent systems" don't satisfy the AAMAS-classical definition of multi-agent. There is no genuine partial observability, no real action concurrency, no proper game theory. The position is that we need to reconnect with AAMAS rigor before continuing to claim "multi-agent."

### The bargaining and game-theoretic literature

**Game-theoretic LLM** [Hua, Liu, Mao et al.; [arXiv:2411.05990](https://arxiv.org/abs/2411.05990)]: LLMs deviate from rational play as game complexity grows; structured workflows (Dominant Strategy Search, Backward Induction, Bayesian update) recover near-optimal Nash play. The takeaway: LLMs aren't natively rational players, but you can engineer workflows that simulate rationality.

**Measuring Bargaining Abilities of LLMs** [arXiv:2402.15813]: Buyer role is much harder than Seller; scale alone doesn't fix it.

**LLMs with Personalities in Multi-issue Negotiation Games** [arXiv:2405.05248]: Big-Five-prompted personalities affect fairness and rationality in predictable ways.

### The simulation literature

**Generative Agents: Interactive Simulacra of Human Behavior** [Park, O'Brien, Cai, Morris, Liang, Bernstein; UIST 2023 Best Paper; [arXiv:2304.03442](https://arxiv.org/abs/2304.03442)] is the "Smallville" 25-agent simulation that established the architectural template: memory stream + reflection + planning. The successor, **Generative Agent Simulations of 1,000 People** [arXiv:2411.10109], constructs 1,052 real-individual agents from 2-hour interviews and replicates participants' GSS responses 85% as well as the participants themselves on retest.

**Concordia** [Vezhnevets, Agapiou, Aharon et al.; DeepMind; [arXiv:2312.03664](https://arxiv.org/abs/2312.03664); [arXiv:2411.07038](https://arxiv.org/abs/2411.07038)] is DeepMind's library for grounded multi-agent generative simulation, and the substrate of the **NeurIPS 2024 Concordia Contest** on cooperative AI.

**Beyond Static Responses: Multi-Agent LLM Systems as a New Paradigm for Social Science Research** [arXiv:2506.01839] is the methodology paper for using MAS as a social-science instrument.

### The synthesis

The honest synthesis of the 2025–2026 theoretical literature is that we have:

1. **Robustly positive**: generator-verifier loops with sound verifiers; hierarchical orchestrator-worker on parallelizable tasks; debate with information asymmetry where judges are weaker than debaters.
2. **Mixed**: flat multi-agent debate (helps on some tasks, fails to beat compute-matched single agents on many).
3. **Probably over-claimed**: mixture-of-agents heterogeneity gains, generic "more agents = better" claims, society-of-agents emergence.
4. **Underexplored**: graph/network agents with proper benchmarking, AAMAS-rigorous formulations, agents that learn from their own trajectories at scale.

---

## 7. Recent specific work (2025–2026)

**AI Scientist v1/v2** [Lu, Lange, Foerster, Clune, Ha; Sakana AI; [arXiv:2408.06292](https://arxiv.org/abs/2408.06292); NeurIPS 2024 workshop track]. v2 [arXiv:2504.08066] produced the first AI-generated paper to clear ICLR-workshop peer review thresholds. The critical evaluation [arXiv:2502.14297] is essential reading: it documents shallow literature review, false-novelty errors (e.g., reinventing micro-batched SGD), and structural limitations. *This is the highest-profile fully-autonomous research-agent system, and the critique tells us where it actually stands.*

**AlphaEvolve** [Novikov, Vũ, Eisenberger et al.; DeepMind; [arXiv:2506.13131](https://arxiv.org/abs/2506.13131)]: a Gemini-Flash + Gemini-Pro evolutionary loop. Discovered a matrix-multiplication algorithm beating Strassen for 4×4 complex; recovered 0.7% of Google data-center compute via a discovered Borg heuristic. The most concrete "agent-discovers-novel-algorithm" claim of 2025.

**AgentBreeder: Mitigating the AI Safety Evaluation–Alignment Gap** [arXiv:2502.00757; ICLR 2025] is an evolutionary search over multi-agent topologies that explicitly tracks safety properties. It found that several "high-capability" topologies are also high-jailbreak-success, surfacing a capability-safety trade-off in agent design.

**Microsoft AutoGen 0.4** (released January 2025) is the actor-model rewrite that the Magentic-One paper hinted at. **AG2** is the community fork.

**OpenAI Operator** (January 2025): CUA-trained agentic browser, the first major commercial computer-use deployment after Anthropic's October 2024 release.

**Anthropic's multi-agent research system** (engineering blog, June 2025): orchestrator (Opus 4) + parallel Sonnet 4 subagents; 90.2% improvement on internal research eval over single-agent Opus 4. Tokens used per query are ~15× the chat baseline; cost is the binding constraint.

**Anthropic — Building Effective Agents** (engineering blog, December 2024) articulates the design language of "augmented LLM," "prompt chaining," "routing," "parallelization," "orchestrator-workers," "evaluator-optimizer," and "agents." Effectively the spec for the Claude Agent SDK and one of the most-cited industry essays of 2024–2025.

**A Survey on LLM-based Multi-Agent System: Recent Advances and New Frontiers in Application** [arXiv:2412.17481] and **Multi-Agent Collaboration Mechanisms: A Survey of LLMs** [arXiv:2501.06322] are the two most useful recent survey papers.

---

## 8. Safety, alignment, and adversarial multi-agent

This is the area where the field has matured the most in the last 18 months.

### Debate as scalable oversight

**AI Safety via Debate** [Irving, Christiano, Amodei, Rosenstein; OpenAI 2018; [arXiv:1805.00899](https://arxiv.org/abs/1805.00899)] is the foundational proposal: a zero-sum debate game with a human judge; PSPACE upper bound under optimal play with poly-time judges.

**Scalable AI Safety via Doubly-Efficient Debate** [Brown-Cohen, Irving, Piliouras; ICML 2024 Oral; [arXiv:2311.14125](https://arxiv.org/abs/2311.14125)] refines the framework so that the honest strategy needs only polynomial-step simulation. This is the formal protocol most relevant for stochastic AI verification.

**Khan et al.** [ICML 2024 Best Paper; [arXiv:2402.06782](https://arxiv.org/abs/2402.06782)] (already discussed in §2) is the empirical confirmation: persuasiveness-optimization improves judge truthfulness in information-asymmetry settings. The caveat is that the gain doesn't transfer to symmetric-info settings.

**An Alignment Safety Case Sketch Based on Debate** [arXiv:2505.03989] articulates how debate fits into a deployable safety case.

### AI Control

**AI Control: Improving Safety Despite Intentional Subversion** [Greenblatt, Shlegeris, Sachan, Roger; Redwood Research; [arXiv:2312.06942](https://arxiv.org/abs/2312.06942)] is the landmark paper that established control evaluations as a discipline. The framing: an adversarial Red-team-as-untrusted-model vs Blue-team-protocols, with safety defined as the probability the untrusted AI cannot cause concrete unacceptable outcome.

**Towards Evaluations-Based Safety Cases for AI Scheming** [arXiv:2411.03336] formalizes the safety-case methodology built on control evaluations.

**Games for AI Control: Models of Safety Evaluations of AI Deployment Protocols** [Griffin, Bhatt, Greenblatt, Hilton, Shlegeris; ICLR 2025; [arXiv:2409.07985](https://arxiv.org/abs/2409.07985)] is the game-theoretic formalism for control protocol design.

**How to Evaluate Control Measures for LLM Agents? A Trajectory from Today to Superintelligence** [arXiv:2504.05259] is the canonical 2025 reference for extending control to agentic settings.

**CoT Red-Handed: Stress Testing Chain-of-Thought Monitoring** [arXiv:2505.23575] shows adversarial probes break CoT monitoring; the technique is brittle.

**Async Control: Stress-Testing Asynchronous Control Measures for LLM Agents** [arXiv:2512.13526] is one of the few 2026 control papers; extends control to async agents.

### Collusion and deception in multi-agent

**Secret Collusion among AI Agents: Multi-Agent Deception via Steganography** [Motwani, Baranov, Gupta, Hammond, Krueger, Foerster, Schroeder de Witt; NeurIPS 2024; [arXiv:2402.07510](https://arxiv.org/abs/2402.07510)] formalizes collusion via steganography among AI agents and presents the first detection methods. *This is the paper that put adversarial multi-agent on the safety map.*

**Detecting Multi-Agent Collusion Through Multi-Agent Interpretability** [arXiv:2604.01151] develops probing techniques to surface collusive coordination.

**Governing LLM Collusion in Multi-Agent Cournot Markets** [arXiv:2601.11369] tests institutional governance as an intervention: drops mean collusion tier from 3.1 to 1.8; severe-collusion incidence from 50% to 5.6%.

**Lying with Truths: Open-Channel Multi-Agent Collusion for Belief Manipulation via Generative Montage** [arXiv:2601.01685] documents collusion *without* steganography — truthful claims composed deceptively.

**Colosseum: Auditing Collusion in Cooperative Multi-Agent Systems** [arXiv:2602.15198] proposes an audit protocol for cooperative MAS.

**Peacemaker or Troublemaker: How Sycophancy Shapes Multi-Agent Debate** [arXiv:2509.23055] documents that sycophancy *amplifies* in MAD: agents abandon correct answers under social pressure even when ground truth is objective. Sobering for anyone deploying debate as an oversight mechanism.

### Harmful agent behavior

**AgentHarm** [Andriushchenko, Souly, Dziemian et al.; ICLR 2025; [arXiv:2410.09024](https://arxiv.org/abs/2410.09024)] is the benchmark for harmful agent behaviors. Many SOTA agents complete clearly harmful tasks even when the underlying chat model refuses. The wrapper-agnostic safety story falls apart in agentic settings.

**Position: Towards a Responsible LLM-empowered Multi-Agent Systems** [arXiv:2502.01714] articulates MAS-specific safety axioms (decentralized accountability, emergent harm, communication audit). Useful as a checklist for MAS deployers.

---

## What didn't move

Some directions that were hot in 2023–2024 have made surprisingly little progress:

- **Learned discrete codes for inter-agent communication** — the field largely abandoned this in favor of natural-language + JSON. The 2018–2022 MARL emergent-language literature has not transferred meaningfully to LLM agents.
- **Pure flat multi-agent debate as a default** — see §6. Compute-fair comparisons have been damaging.
- **End-to-end agent training** — most production agents are still "frozen LLM + scaffolding." AgentTuning, SWE-Gym, R2E-Gym are the credible exceptions, but the dominant deployment pattern is closed-weight LLM + clever prompting.
- **The "society of agents" simulation thesis** — Generative Agents and Concordia are real research instruments, but the larger claim that you can recover useful policy or strategic insight from large-scale agent simulations remains underdemonstrated.

---

## What this means for builders

Five practical takeaways:

1. **Default to single-agent + tools for production.** Use a strong frontier model (Claude Sonnet 4.6 / 4.7, GPT-5-class, Gemini-class) with ReAct + CodeAct + a good verifier. Reach for multi-agent only when the task is naturally parallel (research, exploration, parallel tool calls).
2. **Generator-verifier loops always pay off.** Self-Refine and Reflexion are not "multi-agent" in any deep sense, but they're the most consistently positive design pattern in the literature. Use them.
3. **Memory + skill libraries (Voyager, AWM) are underexploited in industry.** If your agent does the same things repeatedly, induce workflows from past trajectories rather than re-planning from scratch.
4. **Match compute when you compare.** Most multi-agent claims evaporate when you give the single-agent baseline the same number of tokens. If you're evaluating an agent system, normalize on tokens (or dollars) before believing the result.
5. **Treat safety as a design property, not an afterthought.** AI Control evaluations, debate-as-oversight, AgentHarm — these tools exist now. If you're shipping an agent, the question is not "is the underlying model safe?" but "is this *agent system* safe in this deployment?"

The field is in a phase where the architectural taxonomy has stabilized, the benchmarks are catching up, and the contrarian compute-fair literature is forcing methodological discipline. That's a healthy place to be. The next year of work — better benchmarks (especially long-horizon and OS-level), AAMAS-rigorous multi-agent formulations, scalable oversight that actually scales, and agents that learn from their own trajectories — should produce real progress.

What it probably won't produce is the autonomous society of intelligent agents that the 2023 hype cycle promised. That story was always more aesthetic than empirical.

---

## Bibliography

Numbered, grouped by venue. ~100 references.

### ICML

1. Du, Li, Torralba, Tenenbaum, Mordatch. *Improving Factuality and Reasoning in Language Models through Multiagent Debate.* ICML 2024 Spotlight. [arXiv:2305.14325](https://arxiv.org/abs/2305.14325).
2. Khan, Hughes, Valentine, Ruis, Sachan, Radhakrishnan, Grefenstette, Bowman, Rocktäschel, Perez. *Debating with More Persuasive LLMs Leads to More Truthful Answers.* ICML 2024 Best Paper. [arXiv:2402.06782](https://arxiv.org/abs/2402.06782).
3. Brown-Cohen, Irving, Piliouras. *Scalable AI Safety via Doubly-Efficient Debate.* ICML 2024 Oral. [arXiv:2311.14125](https://arxiv.org/abs/2311.14125).
4. Kambhampati et al. *Position: LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks.* ICML 2024. [arXiv:2402.01817](https://arxiv.org/abs/2402.01817).
5. Kim, Moon, Tabrizi, Lee, Mahoney, Keutzer, Gholami. *An LLM Compiler for Parallel Function Calling.* ICML 2024. [arXiv:2312.04511](https://arxiv.org/abs/2312.04511).
6. Wang, Chen, Yuan, Zhang, Li, Peng, Ji. *Executable Code Actions Elicit Better LLM Agents (CodeAct).* ICML 2024. [arXiv:2402.01030](https://arxiv.org/abs/2402.01030).
7. Zhuge, Wang, Kirsch, Faccio, Khizbullin, Schmidhuber. *GPTSwarm: Language Agents as Optimizable Graphs.* ICML 2024 Oral. [arXiv:2402.16823](https://arxiv.org/abs/2402.16823).
8. Pan et al. *Training Software Engineering Agents and Verifiers with SWE-Gym.* ICML 2025. [arXiv:2412.21139](https://arxiv.org/abs/2412.21139).

### ICLR

9. Yao, Zhao, Yu, Du, Shafran, Narasimhan, Cao. *ReAct: Synergizing Reasoning and Acting in Language Models.* ICLR 2023. [arXiv:2210.03629](https://arxiv.org/abs/2210.03629).
10. Hong et al. *MetaGPT: Meta Programming for a Multi-Agent Collaborative Framework.* ICLR 2024 Oral. [arXiv:2308.00352](https://arxiv.org/abs/2308.00352).
11. Mialon, Fourrier, Swift, Wolf, LeCun, Scialom. *GAIA: A Benchmark for General AI Assistants.* ICLR 2024. [arXiv:2311.12983](https://arxiv.org/abs/2311.12983).
12. Zhou et al. *WebArena: A Realistic Web Environment for Building Autonomous Agents.* ICLR 2024. [arXiv:2307.13854](https://arxiv.org/abs/2307.13854).
13. Liu et al. *AgentBench: Evaluating LLMs as Agents.* ICLR 2024. [arXiv:2308.03688](https://arxiv.org/abs/2308.03688).
14. Chen, Su et al. *AgentVerse: Facilitating Multi-Agent Collaboration and Exploring Emergent Behaviors.* ICLR 2024. [arXiv:2308.10848](https://arxiv.org/abs/2308.10848).
15. Hu, Lu, Clune. *Automated Design of Agentic Systems (ADAS).* ICLR 2025. [arXiv:2408.08435](https://arxiv.org/abs/2408.08435).
16. Zhang, Xiang et al. *AFlow: Automating Agentic Workflow Generation.* ICLR 2025 Oral. [arXiv:2410.10762](https://arxiv.org/abs/2410.10762).
17. Wang et al. *OpenHands: An Open Platform for AI Software Developers as Generalist Agents.* ICLR 2025. [arXiv:2407.16741](https://arxiv.org/abs/2407.16741).
18. Griffin, Bhatt, Greenblatt, Hilton, Shlegeris. *Games for AI Control.* ICLR 2025. [arXiv:2409.07985](https://arxiv.org/abs/2409.07985).
19. Andriushchenko et al. *AgentHarm: A Benchmark for Measuring Harmfulness of LLM Agents.* ICLR 2025. [arXiv:2410.09024](https://arxiv.org/abs/2410.09024).
20. *AgentBreeder: Mitigating the AI Safety Evaluation–Alignment Gap.* ICLR 2025. [arXiv:2502.00757](https://arxiv.org/abs/2502.00757).

### NeurIPS

21. Li, Hammoud, Itani, Khizbullin, Ghanem. *CAMEL: Communicative Agents for "Mind" Exploration of LLM Society.* NeurIPS 2023. [arXiv:2303.17760](https://arxiv.org/abs/2303.17760).
22. Madaan et al. *Self-Refine: Iterative Refinement with Self-Feedback.* NeurIPS 2023. [arXiv:2303.17651](https://arxiv.org/abs/2303.17651).
23. Shinn, Cassano, Berman, Gopinath, Narasimhan, Yao. *Reflexion: Language Agents with Verbal Reinforcement Learning.* NeurIPS 2023. [arXiv:2303.11366](https://arxiv.org/abs/2303.11366).
24. Yao et al. *Tree of Thoughts: Deliberate Problem Solving with Large Language Models.* NeurIPS 2023. [arXiv:2305.10601](https://arxiv.org/abs/2305.10601).
25. Yang et al. *SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering.* NeurIPS 2024. [arXiv:2405.15793](https://arxiv.org/abs/2405.15793).
26. Xie et al. *OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments.* NeurIPS 2024 D&B. [arXiv:2404.07972](https://arxiv.org/abs/2404.07972).
27. Motwani et al. *Secret Collusion among AI Agents: Multi-Agent Deception via Steganography.* NeurIPS 2024. [arXiv:2402.07510](https://arxiv.org/abs/2402.07510).
28. Lu, Lange, Foerster, Clune, Ha. *The AI Scientist: Towards Fully Automated Open-Ended Scientific Discovery.* NeurIPS 2024 workshop. [arXiv:2408.06292](https://arxiv.org/abs/2408.06292).

### ACL / EMNLP / Other NLP

29. Qian et al. *ChatDev: Communicative Agents for Software Development.* ACL 2024. [arXiv:2307.07924](https://arxiv.org/abs/2307.07924).
30. Koh et al. *VisualWebArena: Evaluating Multimodal Agents on Realistic Visual Web Tasks.* ACL 2024. [arXiv:2401.13649](https://arxiv.org/abs/2401.13649).
31. Liang et al. *Encouraging Divergent Thinking in Large Language Models through Multi-Agent Debate (MAD).* EMNLP 2024. [arXiv:2305.19118](https://arxiv.org/abs/2305.19118).
32. Zeng et al. *AgentTuning: Enabling Generalized Agent Abilities for LLMs.* ACL Findings 2024. [arXiv:2310.12823](https://arxiv.org/abs/2310.12823).

### COLM / UIST / IJCAI / AAAI

33. Wu et al. *AutoGen.* COLM 2024 (extended). [arXiv:2308.08155](https://arxiv.org/abs/2308.08155).
34. Wang et al. *Mixture-of-Agents Enhances LLM Capabilities.* COLM 2024. [arXiv:2406.04692](https://arxiv.org/abs/2406.04692).
35. Park et al. *Generative Agents: Interactive Simulacra of Human Behavior.* UIST 2023 Best Paper. [arXiv:2304.03442](https://arxiv.org/abs/2304.03442).
36. Chen, Dong et al. *AutoAgents: A Framework for Automatic Agent Generation.* IJCAI 2024. [arXiv:2309.17288](https://arxiv.org/abs/2309.17288).
37. Besta et al. *Graph of Thoughts.* AAAI 2024. [arXiv:2308.09687](https://arxiv.org/abs/2308.09687).

### arXiv-only and industry technical reports

38. Fourney et al. *Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks.* Microsoft. [arXiv:2411.04468](https://arxiv.org/abs/2411.04468).
39. Wang, Mao, Fried, Neubig. *Agent Workflow Memory.* [arXiv:2409.07429](https://arxiv.org/abs/2409.07429).
40. Liu et al. *DyLAN: A Dynamic LLM-Powered Agent Network.* [arXiv:2310.02170](https://arxiv.org/abs/2310.02170).
41. Wang et al. *Voyager: An Open-Ended Embodied Agent.* [arXiv:2305.16291](https://arxiv.org/abs/2305.16291).
42. Park et al. *Generative Agent Simulations of 1,000 People.* [arXiv:2411.10109](https://arxiv.org/abs/2411.10109).
43. Vezhnevets et al. *Concordia (DeepMind generative ABM library).* [arXiv:2312.03664](https://arxiv.org/abs/2312.03664); [arXiv:2411.07038](https://arxiv.org/abs/2411.07038).
44. Yao, Shinn, Razavi, Narasimhan. *τ-bench.* [arXiv:2406.12045](https://arxiv.org/abs/2406.12045).
45. *τ²-Bench.* [arXiv:2506.07982](https://arxiv.org/abs/2506.07982).
46. Jimenez et al. *SWE-bench.* [arXiv:2310.06770](https://arxiv.org/abs/2310.06770) (ICLR 2024).
47. *SWE-Bench+.* [arXiv:2410.06992](https://arxiv.org/abs/2410.06992).
48. *SWE-Bench Multimodal.* [arXiv:2410.03859](https://arxiv.org/abs/2410.03859).
49. *SWE-Bench Pro.* [arXiv:2509.16941](https://arxiv.org/abs/2509.16941).
50. *The SWE-Bench Illusion.* [arXiv:2506.12286](https://arxiv.org/abs/2506.12286).
51. *Dissecting the SWE-Bench Leaderboards.* [arXiv:2506.17208](https://arxiv.org/abs/2506.17208).
52. Xia, Deng, Dunn, Zhang. *Agentless: Demystifying LLM-based Software Engineering Agents.* [arXiv:2407.01489](https://arxiv.org/abs/2407.01489).
53. *LIVE-SWE-AGENT.* [arXiv:2511.13646](https://arxiv.org/abs/2511.13646).
54. *Kimi-Dev.* [arXiv:2509.23045](https://arxiv.org/abs/2509.23045).
55. *R2E-Gym.* COLM 2025. [arXiv:2504.07164](https://arxiv.org/abs/2504.07164).
56. Chan et al. *MLE-bench.* OpenAI. [arXiv:2410.07095](https://arxiv.org/abs/2410.07095).
57. *AI Research Agents for ML: Search, Exploration, Generalization in MLE-bench.* [arXiv:2507.02554](https://arxiv.org/abs/2507.02554).
58. *MLR-Bench.* [arXiv:2505.19955](https://arxiv.org/abs/2505.19955).
59. Xu et al. *TheAgentCompany.* CMU. [arXiv:2412.14161](https://arxiv.org/abs/2412.14161).
60. Greenblatt, Shlegeris, Sachan, Roger. *AI Control.* Redwood. [arXiv:2312.06942](https://arxiv.org/abs/2312.06942).
61. *Towards Evaluations-Based Safety Cases for AI Scheming.* [arXiv:2411.03336](https://arxiv.org/abs/2411.03336).
62. *How to Evaluate Control Measures for LLM Agents?* [arXiv:2504.05259](https://arxiv.org/abs/2504.05259).
63. *CoT Red-Handed: Stress Testing Chain-of-Thought Monitoring.* [arXiv:2505.23575](https://arxiv.org/abs/2505.23575).
64. *Async Control.* [arXiv:2512.13526](https://arxiv.org/abs/2512.13526).
65. *Detecting Multi-Agent Collusion Through Multi-Agent Interpretability.* [arXiv:2604.01151](https://arxiv.org/abs/2604.01151).
66. *Governing LLM Collusion in Multi-Agent Cournot Markets.* [arXiv:2601.11369](https://arxiv.org/abs/2601.11369).
67. *Lying with Truths: Open-Channel Multi-Agent Collusion via Generative Montage.* [arXiv:2601.01685](https://arxiv.org/abs/2601.01685).
68. *Colosseum: Auditing Collusion in Cooperative MAS.* [arXiv:2602.15198](https://arxiv.org/abs/2602.15198).
69. *Peacemaker or Troublemaker: Sycophancy in MAD.* [arXiv:2509.23055](https://arxiv.org/abs/2509.23055).
70. Hua et al. *Game-theoretic LLM: Agent Workflow for Negotiation Games.* [arXiv:2411.05990](https://arxiv.org/abs/2411.05990).
71. *Measuring Bargaining Abilities of LLMs.* [arXiv:2402.15813](https://arxiv.org/abs/2402.15813).
72. *LLMs with Personalities in Multi-issue Negotiation Games.* [arXiv:2405.05248](https://arxiv.org/abs/2405.05248).
73. *Rethinking Mixture-of-Agents: Is Mixing Different Large Language Models Beneficial?* [arXiv:2502.00674](https://arxiv.org/abs/2502.00674).
74. *Stop Overvaluing Multi-Agent Debate.* [arXiv:2502.08788](https://arxiv.org/abs/2502.08788).
75. *Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets.* [arXiv:2604.02460](https://arxiv.org/abs/2604.02460).
76. *Talk Isn't Always Cheap: Understanding Failure Modes in Multi-Agent Debate.* [arXiv:2509.05396](https://arxiv.org/abs/2509.05396).
77. *Diversity of Thought Elicits Stronger Reasoning Capabilities in MAD.* [arXiv:2410.12853](https://arxiv.org/abs/2410.12853).
78. *Free-MAD: Consensus-Free Multi-Agent Debate.* [arXiv:2509.11035](https://arxiv.org/abs/2509.11035).
79. La Malfa et al. *Large Language Models Miss the Multi-Agent Mark.* [arXiv:2505.21298](https://arxiv.org/abs/2505.21298).
80. *Multi-Agent Collaboration Mechanisms: A Survey of LLMs.* [arXiv:2501.06322](https://arxiv.org/abs/2501.06322).
81. *Position: Towards a Responsible LLM-empowered Multi-Agent Systems.* [arXiv:2502.01714](https://arxiv.org/abs/2502.01714).
82. *Evaluation and Benchmarking of LLM Agents: A Survey.* [arXiv:2507.21504](https://arxiv.org/abs/2507.21504).
83. *Survey on LLM-based Multi-Agent System.* [arXiv:2412.17481](https://arxiv.org/abs/2412.17481).
84. *AlphaEvolve.* DeepMind. [arXiv:2506.13131](https://arxiv.org/abs/2506.13131).
85. *AI Scientist v2.* Sakana. [arXiv:2504.08066](https://arxiv.org/abs/2504.08066).
86. *Evaluating Sakana's AI Scientist.* [arXiv:2502.14297](https://arxiv.org/abs/2502.14297).
87. *Do Agent Societies Develop Intellectual Elites?* [arXiv:2604.02674](https://arxiv.org/abs/2604.02674).
88. *Beyond Static Responses: Multi-Agent LLM Systems for Social Science Research.* [arXiv:2506.01839](https://arxiv.org/abs/2506.01839).
89. Cognition Labs. *Devin SWE-bench Technical Report.* March 2024. https://cognition.ai/blog/swe-bench-technical-report
90. Anthropic Engineering. *How we built our multi-agent research system.* June 2025. https://www.anthropic.com/engineering/multi-agent-research-system
91. Anthropic Engineering. *Building Effective Agents.* December 2024. https://www.anthropic.com/research/building-effective-agents
92. Anthropic. *Computer Use (Claude 3.5 Sonnet).* October 2024. https://www.anthropic.com/news/3-5-models-and-computer-use
93. Anthropic. *Model Context Protocol (MCP).* November 2024. https://www.anthropic.com/news/model-context-protocol
94. Google Developers. *Agent2Agent Protocol (A2A).* April 2025. https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
95. OpenAI. *Swarm → Agents SDK.* Oct 2024 / March 2025. https://openai.github.io/openai-agents-python/
96. OpenAI. *Operator.* January 2025. https://openai.com/index/introducing-operator/
97. *OpenHands Software Agent SDK.* [arXiv:2511.03690](https://arxiv.org/abs/2511.03690).
98. *AI Safety via Debate.* OpenAI 2018. [arXiv:1805.00899](https://arxiv.org/abs/1805.00899).
99. *Multiple LLM Agents Debate for Equitable Cultural Alignment.* [arXiv:2505.24671](https://arxiv.org/abs/2505.24671).
100. *NeurIPS 2024 Concordia Contest.* DeepMind / NeurIPS Competitions.
