---
title: "The Edge of Artificial Intelligence Research: A Citation-Grounded Survey from ICML, ICLR, NeurIPS (2023–2026)"
author: Dendi Suhubdy
pubDatetime: 2026-04-28T15:00:00Z
featured: false
draft: false
tags:
  - artificial-intelligence
  - deep-learning
  - natural-language-processing
  - speech
  - video-generation
  - audio
  - reinforcement-learning
  - world-models
  - foundation-models
  - diffusion-models
  - state-space-models
  - mamba
  - dpo
  - dreamer
  - genie
  - sora
  - whisper
  - musicgen
  - alphafold
  - openvla
description: "A domain-by-domain survey of the artificial intelligence research frontier, grounded in specific papers from ICML, ICLR, NeurIPS, and adjacent venues (CoRL, CVPR, Nature). Covers natural language processing, speech, video, sound, robotics/VLA, biology, 3D generation, diffusion architecture, and the renaissance of reinforcement learning and world models. The through-line: pretraining is no longer the frontier — test-time compute, generative simulators, and embodied grounding are."
---

There is a version of this post that is just a list of papers. I want to write the version that explains *why* each paper matters and what the citation graph around it actually looks like — because the field has fragmented into enough subfields that even practitioners working in adjacent areas often miss the load-bearing references.

The frame I'll use is domain-by-domain, grounded in specific papers from **ICML**, **ICLR**, **NeurIPS**, and the few adjacent venues that have absorbed work that doesn't fit cleanly into a generalist ML conference (CoRL for robotics, CVPR/SIGGRAPH for vision and graphics, Nature for biology). I'll call out arxiv-only and industry-blog releases explicitly when they're load-bearing — increasingly, the most important results in this field never go through peer review at all.

The through-line, before I get into specifics: **pretraining is no longer the research frontier**. The frontier has moved to test-time compute, generative simulators, embodied grounding, and the architectural primitives (state-space models, flow matching, mixture-of-experts) that make the new regime tractable. Almost every section below is a variant of that story.

---

## 1. Natural Language Processing

NLP went through three distinct phases in the 2023–2026 window: (a) the alignment phase, where the question was "how do we make pretrained LLMs follow instructions"; (b) the architecture phase, where the question was "what replaces or augments the transformer"; and (c) the reasoning phase, where the question is "how do we use RL on verifiable rewards to elicit chain-of-thought." We are deep into (c) as of 2026.

### Alignment and preference optimization

The defining paper of the alignment phase was **Direct Preference Optimization** ([Rafailov et al., NeurIPS 2023, Outstanding Paper](https://arxiv.org/abs/2305.18290)). DPO collapsed the RLHF pipeline — reward model + PPO — into a single closed-form contrastive loss. Within twelve months, every open-weights model release post-Llama-2 was using DPO or one of its descendants (IPO, KTO, SimPO).

The follow-up wave matters too:
- **Self-Rewarding Language Models** ([Yuan et al., ICML 2024](https://arxiv.org/abs/2401.10020)) — model judges its own outputs to generate preference data.
- **KTO** ([Ethayarajh et al., ICML 2024](https://arxiv.org/abs/2402.01306)) — preference learning from binary thumbs-up/down rather than pairwise comparisons, drawing on prospect theory.
- **SimPO** ([Meng et al., NeurIPS 2024](https://arxiv.org/abs/2405.14734)) — reference-free preference optimization, simpler and often stronger than DPO.

### Architecture: state-space models and hybrids

The transformer's quadratic-attention bottleneck has been the open architectural problem since 2017. The breakthrough was **Mamba** ([Gu and Dao, 2023, arxiv](https://arxiv.org/abs/2312.00752)) and **Mamba-2** ([Dao and Gu, ICML 2024](https://arxiv.org/abs/2405.21060)), which made selective state-space models (SSMs) competitive with transformers at scale by introducing input-dependent transitions and a hardware-aware parallel scan.

Mamba alone didn't displace transformers — but **hybrid SSM-attention stacks** did, in the sense that nearly every long-context-optimized open model in 2025 used some hybrid:
- **Jamba** ([Lieber et al., 2024, arxiv](https://arxiv.org/abs/2403.19887)) — first production-scale SSM-transformer-MoE hybrid.
- **Samba** ([Ren et al., ICLR 2025](https://arxiv.org/abs/2406.07522)) — Mamba + sliding-window attention.
- **Zamba** ([Glorioso et al., 2024, arxiv](https://arxiv.org/abs/2405.16712)).

The open question for 2026 is whether SSMs can match transformer reasoning on tasks that require precise in-context retrieval; the [RULER benchmark (Hsieh et al., COLM 2024)](https://arxiv.org/abs/2404.06654) is the standard test bed.

### Reasoning, RL on verifiable rewards, and test-time compute

This is the live frontier. The first systematic statement that test-time compute can substitute for parameter count was **"Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Model Parameters"** ([Snell et al., 2024, arxiv](https://arxiv.org/abs/2408.03314)).

The reasoning paradigm crystallized publicly with OpenAI's o1, but the open-research story runs through:
- **DeepSeek-Math** and the **GRPO** algorithm ([Shao et al., 2024, arxiv](https://arxiv.org/abs/2402.03300)) — group relative policy optimization, which dispenses with PPO's value network and is now the default for open-source reasoning RL.
- **DeepSeek-R1** ([DeepSeek-AI, 2025, arxiv](https://arxiv.org/abs/2501.12948)) — first open replication of o1-style reasoning, distilled into smaller models that beat much larger non-reasoning baselines.
- **Process reward models**: **"Let's Verify Step by Step"** ([Lightman et al., ICLR 2024](https://arxiv.org/abs/2305.20050)) is the canonical reference, though outcome-only RL (à la R1) has largely won the empirical argument.
- The conceptual ancestors: **Chain-of-Thought** ([Wei et al., NeurIPS 2022](https://arxiv.org/abs/2201.11903)), **Tree of Thoughts** ([Yao et al., NeurIPS 2023](https://arxiv.org/abs/2305.10601)), **Self-Consistency** ([Wang et al., ICLR 2023](https://arxiv.org/abs/2203.11171)).

### Mixture-of-experts at scale

The architectural workhorse behind frontier-quality open models is sparse MoE. The reference papers:
- **Switch Transformer** ([Fedus et al., JMLR 2022](https://arxiv.org/abs/2101.03961)) — the foundational paper.
- **Mixtral 8x7B** ([Jiang et al., 2024, arxiv](https://arxiv.org/abs/2401.04088)) — first widely-deployed open MoE.
- **DeepSeekMoE** ([Dai et al., ACL 2024](https://arxiv.org/abs/2401.06066)) and **DeepSeek-V3** ([DeepSeek-AI, 2024, arxiv](https://arxiv.org/abs/2412.19437)) — fine-grained experts, auxiliary-loss-free balancing, the current Pareto frontier for cost/quality.

### Mechanistic interpretability

The most interesting applied-interpretability development is the rise of **sparse autoencoders (SAEs)** as a tool for finding monosemantic features in residual streams. Key references:
- **"Sparse Autoencoders Find Highly Interpretable Features in Language Models"** ([Cunningham et al., ICLR 2024](https://arxiv.org/abs/2309.08600)).
- Anthropic's **"Towards Monosemanticity"** ([Bricken et al., 2023](https://transformer-circuits.pub/2023/monosemantic-features)) and the follow-up **"Scaling Monosemanticity"** ([Templeton et al., 2024](https://transformer-circuits.pub/2024/scaling-monosemanticity/)).
- **Gemma Scope** ([Lieberum et al., 2024, arxiv](https://arxiv.org/abs/2408.05147)) — open SAE suite for Gemma 2.

### Agents

The agents literature is messier — many of the most-cited results live in industry blog posts, not conference proceedings. The peer-reviewed anchors:
- **Toolformer** ([Schick et al., NeurIPS 2023](https://arxiv.org/abs/2302.04761)) — language models teaching themselves to use tools.
- **ReAct** ([Yao et al., ICLR 2023](https://arxiv.org/abs/2210.03629)) — interleaving reasoning and acting.
- **Voyager** ([Wang et al., NeurIPS 2023](https://arxiv.org/abs/2305.16291)) — open-ended Minecraft agent with a skill library.
- **SWE-bench** ([Jimenez et al., ICLR 2024](https://arxiv.org/abs/2310.06770)) — the benchmark that has driven most of the agent-progress narrative since its release.

---

## 2. Speech

Speech research bifurcated cleanly: a **discriminative track** that more or less solved general-purpose ASR, and a **generative track** that has now collapsed the entire ASR-LLM-TTS pipeline into single audio-native models.

### ASR

- **Whisper** ([Radford et al., ICML 2023](https://arxiv.org/abs/2212.04356)) is the reference point. 680k hours of weakly-supervised multilingual data, encoder-decoder transformer; v3 is still the open-source ASR baseline as of 2026.
- **OWSM** ([Peng et al., ASRU 2023](https://arxiv.org/abs/2309.13876)) and **Canary** (NVIDIA) are the open-research follow-ups that tried to reproduce Whisper-quality with documented data.

### Self-supervised speech representation

- **HuBERT** ([Hsu et al., TASLP 2021](https://arxiv.org/abs/2106.07447)) and **WavLM** ([Chen et al., JSTSP 2022](https://arxiv.org/abs/2110.13900)) — the dominant SSL frontends through 2023.
- **BEST-RQ** ([Chiu et al., ICML 2022](https://arxiv.org/abs/2202.01855)) — random-projection codebook, simpler than wav2vec 2.0.

### TTS and zero-shot voice cloning

The defining shift was treating speech generation as language modeling over neural codec tokens.
- **VALL-E** ([Wang et al., 2023, arxiv](https://arxiv.org/abs/2301.02111)) — neural codec language model, the first credible 3-second zero-shot TTS.
- **NaturalSpeech 3** ([Ju et al., ICML 2024](https://arxiv.org/abs/2403.03100)) — factorized diffusion, attribute-disentangled codec.
- **Voicebox** ([Le et al., NeurIPS 2023](https://arxiv.org/abs/2306.15687)) — flow-matching for non-autoregressive speech generation.
- **F5-TTS** ([Chen et al., 2024, arxiv](https://arxiv.org/abs/2410.06885)) — flow-matching with a diffusion transformer, currently a strong open baseline.

### Speech-native LLMs

The convergence of ASR, dialog, and TTS into single end-to-end models is the most important development of 2024–2025.
- **AudioLM** ([Borsos et al., TASLP 2023](https://arxiv.org/abs/2209.03143)) — language modeling over hierarchical audio tokens; the conceptual seed.
- **AudioPaLM** ([Rubenstein et al., 2023, arxiv](https://arxiv.org/abs/2306.12925)) — joint text-and-audio LLM.
- **Moshi** ([Défossez et al., 2024, arxiv](https://arxiv.org/abs/2410.00037)) — full-duplex spoken dialog at ~200ms latency, built on the **Mimi** neural codec. Production-quality open release.
- **GPT-4o** and **Gemini Live** are the closed-source counterparts; no peer-reviewed papers, but they set the latency target the open community is chasing.

### Neural audio codecs

The infrastructure layer:
- **SoundStream** ([Zeghidour et al., TASLP 2022](https://arxiv.org/abs/2107.03312)).
- **EnCodec** ([Défossez et al., TMLR 2023](https://arxiv.org/abs/2210.13438)).
- **DAC** (Descript Audio Codec) ([Kumar et al., NeurIPS 2023](https://arxiv.org/abs/2306.06546)) — currently the best open codec by reconstruction quality.

---

## 3. Video

Video is where diffusion transformers won, and where "video generation" and "world model" are visibly converging into the same research object.

### Backbone: diffusion transformers

The architectural pivot point was **DiT** ([Peebles and Xie, ICCV 2023](https://arxiv.org/abs/2212.09748)) — replacing U-Nets with transformers in latent diffusion. Every frontier video model from 2024 onward is a DiT or a near-relative.

### Video generation

- **Make-A-Video** ([Singer et al., ICLR 2023](https://arxiv.org/abs/2209.14792)) and **Imagen Video** ([Ho et al., 2022, arxiv](https://arxiv.org/abs/2210.02303)) — the cascaded-diffusion era.
- **Stable Video Diffusion** ([Blattmann et al., 2023, arxiv](https://arxiv.org/abs/2311.15127)) — first open weights at usable quality.
- **VideoPoet** ([Kondratyuk et al., ICML 2024](https://arxiv.org/abs/2312.14125)) — language-model-style video generation over discrete tokens.
- **Lumiere** ([Bar-Tal et al., SIGGRAPH Asia 2024](https://arxiv.org/abs/2401.12945)) — space-time U-Net for temporally-consistent video.
- **W.A.L.T.** ([Gupta et al., ECCV 2024](https://arxiv.org/abs/2312.06662)) — windowed attention latent transformer for video.
- **Sora** ([OpenAI technical report, 2024](https://openai.com/research/video-generation-models-as-world-simulators)) — closed-weights, but the architectural sketch (DiT with spacetime patches, scaled massively) defined the frame.
- **Movie Gen** ([Polyak et al., 2024, Meta](https://ai.meta.com/research/movie-gen/)) — Meta's open technical report, currently the most detailed reproducible recipe for frontier-quality video generation.

### Video understanding

- **VideoMAE** ([Tong et al., NeurIPS 2022](https://arxiv.org/abs/2203.12602)) and **VideoMAE V2** ([Wang et al., CVPR 2023](https://arxiv.org/abs/2303.16727)) — the masked-autoencoding workhorses.
- **InternVideo2** ([Wang et al., ECCV 2024](https://arxiv.org/abs/2403.15377)) — current open SOTA video encoder.
- **LLaVA-Video** ([Zhang et al., 2024, arxiv](https://arxiv.org/abs/2410.02713)) and **Qwen2-VL** ([Wang et al., 2024, arxiv](https://arxiv.org/abs/2409.12191)) — current open video-language models.

### Flow matching for video

Worth flagging separately: most frontier video models in 2025 are using **rectified flow** ([Liu et al., ICLR 2023](https://arxiv.org/abs/2209.03003)) and **flow matching** ([Lipman et al., ICLR 2023](https://arxiv.org/abs/2210.02747)) rather than DDPM-style diffusion. The training objective is simpler, the sampling needs fewer steps, and the empirical quality is at least as good.

---

## 4. Sound (non-speech audio)

Music and general audio are smaller communities than speech, but they have crystallized around a few load-bearing papers.

### Audio understanding and event detection

- **CLAP** ([Wu et al., ICASSP 2023](https://arxiv.org/abs/2211.06687)) — contrastive language-audio pretraining; the audio analogue of CLIP.
- **BEATs** ([Chen et al., ICML 2023](https://arxiv.org/abs/2212.09058)) — bidirectional encoder for audio tagging, current open SOTA on AudioSet.
- **Audio-MAE** ([Huang et al., NeurIPS 2022](https://arxiv.org/abs/2207.06405)) — masked autoencoders for audio spectrograms.

### Sound generation

- **AudioLDM** ([Liu et al., ICML 2023](https://arxiv.org/abs/2301.12503)) and **AudioLDM 2** ([Liu et al., ICML 2024](https://arxiv.org/abs/2308.05734)) — text-to-audio latent diffusion.
- **AudioGen** ([Kreuk et al., ICLR 2023](https://arxiv.org/abs/2209.15352)) — language-model-style audio generation.

### Music

- **MusicLM** ([Agostinelli et al., 2023, arxiv](https://arxiv.org/abs/2301.11325)) — Google's hierarchical music LM.
- **MusicGen** ([Copet et al., NeurIPS 2023](https://arxiv.org/abs/2306.05284)) — Meta's open single-stage transformer over EnCodec tokens; the open baseline through 2025.
- **Stable Audio 2** ([Evans et al., 2024, arxiv](https://arxiv.org/abs/2402.04825) and follow-up) — long-form structured music generation via DiT.
- **Suno** and **Udio** are the production frontier; no public papers, but the open community is closing the gap with **DiTTo-TTS** and similar architectures.

### Source separation

- **SepFormer** ([Subakan et al., ICASSP 2021](https://arxiv.org/abs/2010.13154)) — transformer-based, still the open SOTA for clean speech separation.
- **Band-Split RNN** ([Luo and Yu, TASLP 2023](https://arxiv.org/abs/2209.15174)) — current open SOTA for music source separation.

---

## 5. What you might have missed

A few high-impact areas that don't fit cleanly into the above buckets but should be on any 2026 reading list.

### Robotics and Vision-Language-Action models (VLAs)

The robotics community has its own venue (CoRL) and deserves a separate post, but the load-bearing papers:
- **RT-1** ([Brohan et al., RSS 2023](https://arxiv.org/abs/2212.06817)) and **RT-2** ([Brohan et al., CoRL 2023](https://arxiv.org/abs/2307.15818)).
- **Open X-Embodiment** ([RT-X collaboration, ICRA 2024 Best Paper](https://arxiv.org/abs/2310.08864)) — the cross-embodiment dataset that made foundation policies possible.
- **OpenVLA** ([Kim et al., CoRL 2024](https://arxiv.org/abs/2406.09246)) — the open-weights baseline.
- **π0** ([Black et al., 2024, Physical Intelligence](https://www.physicalintelligence.company/blog/pi0)) — flow-matching action heads on top of a VLM.
- **GR00T** ([NVIDIA, 2025, arxiv](https://arxiv.org/abs/2503.14734)) — humanoid foundation model.

### Computational biology

- **AlphaFold 2** ([Jumper et al., Nature 2021](https://www.nature.com/articles/s41586-021-03819-2)) — the paper that started the structural-biology AI era.
- **AlphaFold 3** ([Abramson et al., Nature 2024](https://www.nature.com/articles/s41586-024-07487-w)) — protein-ligand-nucleic-acid complexes via diffusion.
- **ESM-2** ([Lin et al., Science 2023](https://www.science.org/doi/10.1126/science.ade2574)) and **ESM3** ([Hayes et al., 2024, EvolutionaryScale](https://www.evolutionaryscale.ai/blog/esm3-release)) — protein language models, generative in ESM3.
- **Evo** ([Nguyen et al., Science 2024](https://www.science.org/doi/10.1126/science.ado9336)) — DNA foundation model at million-token context using StripedHyena.
- **RFdiffusion** ([Watson et al., Nature 2023](https://www.nature.com/articles/s41586-023-06415-8)) — generative protein design.

### 3D generation and reconstruction

- **3D Gaussian Splatting** ([Kerbl et al., SIGGRAPH 2023, Best Paper](https://arxiv.org/abs/2308.04079)) — replaced NeRF as the dominant scene representation in eighteen months.
- **DUSt3R** ([Wang et al., CVPR 2024](https://arxiv.org/abs/2312.14132)) and **MASt3R** ([Leroy et al., ECCV 2024](https://arxiv.org/abs/2406.09756)) — feed-forward dense 3D reconstruction without camera poses.
- **VGGT** ([Wang et al., CVPR 2025](https://arxiv.org/abs/2503.11651)) — single-pass transformer that predicts cameras, depth, and 3D point maps jointly.
- **Trellis** ([Xiang et al., CVPR 2025](https://arxiv.org/abs/2412.01506)) — structured latent 3D generation.

### Diffusion architecture

The architectural primitives have shifted under most people's noses:
- **Consistency Models** ([Song et al., ICML 2023](https://arxiv.org/abs/2303.01469)) — one-step or few-step generation.
- **Flow Matching** ([Lipman et al., ICLR 2023](https://arxiv.org/abs/2210.02747)) and **Rectified Flow** ([Liu et al., ICLR 2023](https://arxiv.org/abs/2209.03003)) — the simulation-free training objectives that have largely replaced DDPM in production.
- **EDM** ([Karras et al., NeurIPS 2022](https://arxiv.org/abs/2206.00364)) — the design-space paper that re-parameterized everything.

---

## 6. Reinforcement Learning and World Models

This is the single most active area of deep learning research in 2026, in my reading. Three previously-separate threads — LLM reasoning RL, generative video models, and embodied AI — are visibly converging into a single research program around *learning a world model that is good enough to plan in*.

### World models: the hottest area

- **DreamerV3** ([Hafner et al., Nature 2025](https://www.nature.com/articles/s41586-025-08744-2); [arxiv preprint 2023](https://arxiv.org/abs/2301.04104)) — the first general agent that mastered 150+ tasks across diverse domains with fixed hyperparameters. The model-based-RL renaissance starts here.
- **IRIS** ([Micheli et al., ICLR 2023](https://arxiv.org/abs/2209.00588)) — transformer world model over discrete tokens, sample-efficient on Atari 100k.
- **Genie** ([Bruce et al., ICML 2024, Best Paper Award](https://arxiv.org/abs/2402.15391)) — first generative interactive environment learned purely from internet video, action-conditioned via latent action codes. The conceptual breakthrough that made "video model = world model" a defensible position.
- **DIAMOND** ([Alonso et al., NeurIPS 2024](https://arxiv.org/abs/2405.12399)) — diffusion world model for Atari and CSGO; first credible diffusion-based environment for RL.
- **GameNGen** ([Valevski et al., ICLR 2025](https://arxiv.org/abs/2408.14837)) — neural Doom at 20fps via diffusion, demonstrating that real-time playable simulation from a neural net is feasible.
- **Genie 2** ([DeepMind, 2024 blog](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/)) and **Genie 3** ([DeepMind, 2025 blog](https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/)) — minute-long, prompt-controllable, real-time interactive environments. No paper yet at time of writing.
- **Oasis** ([Decart, 2024](https://oasis-model.github.io/)) — open real-time playable Minecraft world model.
- **NVIDIA Cosmos** ([NVIDIA, 2025, arxiv](https://arxiv.org/abs/2501.03575)) — physical-world foundation models trained for physical-AI applications.

The conceptual seed for all of this is older: **World Models** ([Ha and Schmidhuber, NeurIPS 2018](https://arxiv.org/abs/1803.10122)). The 2024–2025 wave is what happens when the seed paper finally has compute and data behind it.

### RL for reasoning (LLMs)

- **GRPO** ([Shao et al., 2024, DeepSeek-Math arxiv](https://arxiv.org/abs/2402.03300)) — group relative policy optimization, the algorithm that has effectively replaced PPO for LLM reasoning RL.
- **DeepSeek-R1** ([DeepSeek-AI, 2025, arxiv](https://arxiv.org/abs/2501.12948)) — the most consequential open RL result of the past two years. RL-only-from-base produces emergent long chain-of-thought.
- **VinePPO** ([Kazemnejad et al., 2024, arxiv](https://arxiv.org/abs/2410.01679)) — credit assignment for LLM RL via Monte Carlo rollouts, an ICLR 2025 submission worth tracking.
- **Process reward models**: **"Let's Verify Step by Step"** ([Lightman et al., ICLR 2024](https://arxiv.org/abs/2305.20050)) — the canonical PRM paper; the empirical question of PRM vs. outcome-RL is still live, with R1 making the case for outcome-only.

### Embodied / robotics RL

- **Massively parallel sim**: **Isaac Lab** ([NVIDIA, 2024, arxiv](https://arxiv.org/abs/2301.04195) for the Isaac Gym predecessor) and **MJX** (MuJoCo's GPU port) made it possible to run millions of env steps per second on a single GPU. This has quietly enabled most of the recent humanoid-locomotion progress.
- **Eureka** ([Ma et al., ICLR 2024](https://arxiv.org/abs/2310.12931)) — LLMs writing reward functions for RL.
- **DrM** ([Xu et al., ICLR 2024](https://arxiv.org/abs/2310.19668)) — dormant ratio minimization, a notable algorithmic improvement for visual RL.
- **TD-MPC2** ([Hansen et al., ICLR 2024](https://arxiv.org/abs/2310.16828)) — scalable model-based RL across many tasks.

### Search, self-play, and program synthesis

- **AlphaZero** ([Silver et al., Science 2018](https://www.science.org/doi/10.1126/science.aar6404)) is still the canonical reference.
- **AlphaTensor** ([Fawzi et al., Nature 2022](https://www.nature.com/articles/s41586-022-05172-4)) and **AlphaDev** ([Mankowitz et al., Nature 2023](https://www.nature.com/articles/s41586-023-06004-9)) — RL discovers faster matrix multiplication and sorting algorithms.
- **FunSearch** ([Romera-Paredes et al., Nature 2024](https://www.nature.com/articles/s41586-023-06924-6)) — LLM + evolutionary search for new mathematical results.
- **AlphaProof** and **AlphaGeometry 2** ([DeepMind, 2024](https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/)) — IMO silver-medal performance via formal proof + LLM + search.

### Open-ended learning

A smaller community but conceptually important:
- **POET** and the **OMNI** line ([Wang et al., 2019; Zhang et al., NeurIPS 2024](https://arxiv.org/abs/2306.01711)) — autocurricula and open-ended task generation.
- **JaxGCRL** and **Minari** — infrastructure papers enabling the rest.

### The unifying thesis

Read across the 2024–2026 RL literature and the same picture appears: **RL is back, but only because we finally have generative simulators worth planning in**. DreamerV3 made the case that a learned world model is enough for general control. Genie made the case that internet video is enough to train one. R1 made the case that RL on verifiable rewards in a "world model" of language (a base LLM) elicits reasoning. The next two years will be about whether these threads merge into a single architecture, or whether language reasoning and physical reasoning end up requiring genuinely different machinery.

---

## 7. Benchmarks and current SOTA scores

A reference table for the load-bearing benchmarks per subdomain, with the best public results as of early 2026. Scores are approximate, drawn from technical reports, leaderboards, and arxiv evaluation tables; they move month-to-month and rely on self-reported numbers in many cases. Treat this as orientation, not a leaderboard. Where a benchmark is saturated I say so — running it on a frontier model is no longer informative.

The short version of who leads where, before the tables:

- **General reasoning, math, coding, agents:** Claude Opus 4.x, GPT-5 / o3-class, Gemini 2.5 Pro/3 trade the lead month-to-month. **DeepSeek-R1** and its successors are the open-weights frontier and within striking distance on math/code.
- **Long context:** Gemini's 1M+ context family leads on RULER and needle-style tests; Claude's 1M context is competitive; open-source still trails past 128k.
- **ASR:** **Whisper-v3** is still the open baseline; **NVIDIA Canary** and **Parakeet** are the open SOTA on English; **OWSM-CTC** is the most reproducible.
- **TTS / voice:** **F5-TTS**, **NaturalSpeech 3**, **Voicebox** for non-real-time; **Moshi** for full-duplex dialog.
- **Video generation:** **Sora**, **Veo 3**, **Movie Gen**, **Kling**, **Runway Gen-4** are the closed frontier; **Wan 2.1**, **HunyuanVideo**, **CogVideoX** are the open frontier.
- **Video understanding:** **Qwen2-VL** / **Qwen2.5-VL** and **InternVL2.5** are the open SOTA; closed frontier (Gemini, GPT-5) higher on long-video benchmarks.
- **Music / sound generation:** **Suno v4** and **Udio** lead production; **Stable Audio 2** and **MusicGen** are the open reference points.
- **Robotics / VLA:** **π0** and **π0.5** (Physical Intelligence) lead on real-robot generalization; **OpenVLA** is the open baseline; **GR00T N1** for humanoids.
- **Protein structure / design:** **AlphaFold 3** for complex prediction; **RFdiffusion** / **Chai-1** / **Boltz-1** for design and open replication.
- **3D reconstruction / generation:** **3D Gaussian Splatting** for scenes; **VGGT** for feed-forward reconstruction; **Trellis** for image-to-3D.
- **RL / world models:** **DreamerV3** for general agents; **Genie 3** for interactive video world models; **DIAMOND** for diffusion-based environments.

### NLP — reasoning and knowledge

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **MMLU-Pro** | 57-subject reasoning + knowledge | ~88–92% (frontier reasoning models) | Original MMLU saturated above 92%; MMLU-Pro is the harder successor. |
| **GPQA Diamond** | Graduate-level science (PhD-blocking questions) | ~85–90% (o3-class, Claude Opus 4.x, Gemini 2.5 Pro) | Human PhD experts ~65%; reasoning models broke past expert level in late 2024. |
| **AIME 2024 / 2025** | Olympiad-level math | 95%+ on AIME 2024 for o3-class; ~80–90% on AIME 2025 | DeepSeek-R1 reported ~79.8% on AIME 2024; o3 reported 96.7%. AIME 2025 still discriminates. |
| **MATH-500** | Competition / high-school math | Saturated above 96% | No longer informative for frontier models. |
| **FrontierMath** | Research-level math (Tao et al. designed) | ~25–32% for o3-class | Designed to stay unsaturated for years. |
| **Humanity's Last Exam (HLE)** | Cross-domain expert-blocking | ~25–35% (top reasoning models) | Best new "stays hard" benchmark; most non-reasoning models still under 10%. |
| **ARC-AGI v1** | Few-shot abstract visual reasoning | ~87% (o3 high-compute setting) | High-compute runs cost \$20+ per task; v1 is effectively retired as a frontier target. |
| **ARC-AGI v2** | Harder ARC successor | <20% across the board | The current frontier puzzle. |

### NLP — coding and agents

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **SWE-bench Verified** | Real GitHub issue resolution | ~70–82% (Claude Sonnet/Opus 4.x, GPT-5, Gemini 2.5 Pro) | Was ~12% (Claude 3 Opus) in early 2024. Largest single-benchmark jump in recent history. |
| **SWE-bench Multimodal** | Bug fixes with visual context | ~50–60% | Newer, less saturated. |
| **LiveCodeBench** | Contest-style coding (time-stratified) | ~85–90% (top reasoning models) | Time-stratification mitigates contamination. |
| **HumanEval / MBPP** | Function-completion | Saturated (>95%) | Useless for frontier comparison. |
| **τ-bench (tau-bench)** | Multi-turn tool-use in retail/airline domains | ~70–80% | Better proxy for "real agent" work than single-turn benchmarks. |
| **BFCL v3** (Berkeley Function Calling) | Function calling correctness | ~85–90% | Standard tool-use benchmark. |
| **WebArena / VisualWebArena** | Web-browsing agents | ~40–55% | Stays hard; the agent frontier. |

### NLP — long context

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **RULER (128k)** | Long-context retrieval and reasoning | ~88–92% (Gemini 1.5/2.5 Pro, Claude Sonnet 4.x) | The credible long-context test bed; needle-in-haystack is too easy. |
| **RULER (1M)** | Frontier-context regime | Gemini family ~80%+; others drop sharply | Few credible 1M-token systems. |
| **LongBench v2** | Realistic long-document tasks | ~50–60% | Stays hard. |
| **∞Bench** | Multi-task long context | ~60–70% top | Older but still cited. |

### Speech — ASR

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **LibriSpeech test-clean** | English read speech WER | ~1.4–1.7% WER (Parakeet, Canary, Whisper-v3) | Saturated. |
| **LibriSpeech test-other** | Noisier English | ~2.8–3.5% WER | Near-saturated. |
| **Common Voice (multilingual)** | 100+ language WER | Whisper-v3 baseline; OWSM/Canary close on covered languages | Very high variance across languages. |
| **FLEURS** | 102-language ASR | ~10–15% avg WER (top models) | The standard multilingual coverage benchmark. |
| **AMI / Earnings-22** | Meeting / accented speech | 12–18% WER | Where general ASR still struggles. |

### Speech — TTS and voice

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **LibriTTS WER (objective)** | Synthesis intelligibility | <2% | Saturated for non-streaming. |
| **SECS / SIM-O** | Speaker similarity (zero-shot voice cloning) | ~0.65–0.75 (F5-TTS, NaturalSpeech 3, Voicebox) | Some commercial systems claim higher. |
| **DNSMOS / UTMOS** | Predicted MOS | ~4.0–4.4 | Most frontier systems indistinguishable from ground truth on these proxies. |
| **Moshi latency (full-duplex)** | End-to-end response time | ~200ms | Production-quality target the open community is chasing. |

### Video — generation

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **VBench** | 16-dimension video quality (subject/background consistency, motion smoothness, etc.) | Sora, Veo 3, Movie Gen, Kling 2 lead closed; Wan 2.1, HunyuanVideo lead open | The de facto standard. |
| **VBench-Long / VBench++** | Long video and I2V | Same leaders; gap narrows on I2V | Adds image-conditioned and long-form. |
| **Movie Gen Bench** | Internal Meta eval (released) | Movie Gen self-reported leader | Reproducible recipe; useful sanity check. |
| **EvalCrafter** | Multi-dimension comparison | Closed > open by 5–15% | Aggregate score is fragile; use dimension-by-dimension. |

### Video — understanding

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **VideoMME** | Long/short video QA | ~75–82% (Qwen2.5-VL, InternVL2.5, Gemini) | Best general video-understanding leaderboard. |
| **MVBench** | 20-task video understanding | ~70–78% | Approaching saturation. |
| **EgoSchema** | Long egocentric video | ~65–75% | Stays hard; designed to require true temporal reasoning. |
| **NExT-QA / Perception Test** | Causal/temporal reasoning over video | ~75–85% | The classic comprehension benchmarks. |

### Sound (non-speech audio)

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **AudioSet mAP** | 527-class audio tagging | ~50–52% (BEATs and successors) | The reference tagging benchmark. |
| **AudioCaps FAD** | Text-to-audio quality (lower is better) | ~1.3–1.8 (AudioLDM 2, Stable Audio 2) | Frechet Audio Distance. |
| **MusicCaps FAD-VGG** | Text-to-music quality | ~3.5–4.5 (MusicGen, Stable Audio 2) | Suno/Udio do not publish on this. |
| **MUSDB18 SDR** | Music source separation | ~10–11 dB (Band-Split RNN, HT Demucs) | Higher is better; near practical ceiling. |
| **CLAP zero-shot AudioSet** | Text-audio alignment | ~50%+ mAP | The audio analogue of CLIP zero-shot. |

### Robotics and VLAs

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **LIBERO** | 4-suite manipulation (spatial, object, goal, long) | ~85–95% success (π0, OpenVLA, RDT) | The standard simulated VLA benchmark. |
| **SimplerEnv** | Sim-to-real-aligned manipulation eval | π0, π0.5, RT-2-X, Octo lead | Designed so sim numbers correlate with real-robot performance. |
| **CALVIN** | Long-horizon language-conditioned manipulation | ~80%+ (top VLAs) | Saturating. |
| **Open X-Embodiment evals** | Cross-embodiment generalization | RT-X, OpenVLA, π0 the reference points | Dataset-paper benchmark. |
| **HumanoidBench / Isaac humanoid suites** | Whole-body humanoid control | RL + sim-to-real (Berkeley, NVIDIA, Tesla recipes) | No single agreed metric yet. |

### Biology

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **CASP15 / CASP16 GDT-TS** | Protein structure prediction | AF2/AF3 ~85–90 GDT-TS | The classical structural-biology benchmark. |
| **AF3 PoseBusters** | Protein–ligand docking | ~70–80% success (AlphaFold 3) | Major step over classical docking. |
| **RFdiffusion success rate** | De novo binder design | ~10–30% wet-lab hit rate | Active area; numbers vary by target class. |
| **ProteinGym** | Variant effect prediction (ESM-class models) | ESM-2/ESM3 lead open | Standard zero-shot benchmark for PLMs. |
| **Evo / nucleotide LMs** | DNA modeling at long context | Evo (StripedHyena) the open reference | Million-token DNA context. |

### 3D reconstruction and generation

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **Mip-NeRF 360 / DTU PSNR** | Novel-view synthesis | 3D Gaussian Splatting baseline; recent variants push +1–2 dB | Saturated as a research target. |
| **CO3D / RealEstate10k** | Feed-forward 3D reconstruction without poses | DUSt3R, MASt3R, VGGT | The pose-free regime. |
| **Tanks and Temples / ETH3D** | Multi-view stereo | 3DGS-based and recent feed-forward methods | Long-standing reference. |
| **GSO (Google Scanned Objects)** | Image-to-3D generation | Trellis, InstantMesh, recent DiT-3D variants | No single agreed metric — mixes CLIP score, LPIPS, F-score. |

### RL and world models

| Benchmark | What it measures | Current SOTA | Notes |
|---|---|---|---|
| **Atari 100k** | Sample-efficient RL (human-normalized score) | DreamerV3 ~120%, IRIS ~100%, EfficientZero V2 ~190% | World-model methods now beat humans at 100k frames. |
| **DMC (DeepMind Control)** | Continuous control | DreamerV3, TD-MPC2 dominant | Saturated on many tasks. |
| **Crafter** | Open-ended survival (procedural) | DreamerV3 superhuman | Reference for general agents. |
| **Minecraft Diamond (from scratch)** | Long-horizon exploration | DreamerV3 first, no prior knowledge | Headline claim of the Nature paper. |
| **NetHack Learning Environment** | Hard exploration | Stays hard; no reliable solver | The unsolved bar. |
| **Procgen** | Generalization across procedural levels | Stays hard | Less tracked in 2025–2026 but still relevant for generalization claims. |
| **Genie 3 interactive eval** | Minute-long, prompt-controllable simulation | Genie 3 (DeepMind) | No public quantitative leaderboard yet — assessed qualitatively. |

A few honest caveats on this section:

1. Many of these numbers are self-reported in technical reports and have not been independently reproduced. Where a frontier closed model claims +2 points over the previous SOTA, treat that as a hint, not a settled fact.
2. Some benchmarks (HumanEval, MMLU, MATH-500) are *contaminated* by training data overlap. The credible benchmarks now bake in time-stratification (LiveCodeBench), private test sets (FrontierMath, HLE), or held-out construction (ARC-AGI v2).
3. The most important capabilities don't have benchmarks yet. There is no good public benchmark for "can this agent maintain coherent context over a multi-day software-engineering task" or "does this world model permit zero-shot transfer to a real robot." The frontier is moving faster than the eval community can keep up.

---

## What I'd read first

If you have one weekend and want to recompile your mental model of the field, I'd read in this order:

1. **DreamerV3** — for the structural argument that model-based RL works.
2. **Genie** (ICML 2024 Best Paper) — for "video model = world model."
3. **Mamba-2** — for the post-transformer architectural option.
4. **DeepSeek-R1** — for the test-time-compute regime.
5. **DPO** — for what alignment looked like before reasoning RL ate it.
6. **DiT** — for the architectural primitive behind every frontier image and video model.
7. **AlphaFold 3** — for what mature scientific deep learning looks like.

The bibliography is intentionally biased toward papers with reproducible methods over papers with marketing. The hardest part of staying current in this field in 2026 isn't finding the frontier — it's distinguishing the frontier from the press release. Reading the actual papers, with their actual ablation tables, is still the only reliable filter.
