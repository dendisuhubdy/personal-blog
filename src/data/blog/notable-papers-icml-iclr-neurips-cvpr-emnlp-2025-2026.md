---
title: "Notable Papers from ICLR, ICML, NeurIPS, CVPR, EMNLP (2025–2026): An Award-Grounded Reading List"
author: Dendi Suhubdy
pubDatetime: 2026-05-01T10:00:00Z
featured: false
draft: false
tags:
  - ai
  - machine-learning
  - deep-learning
  - reading-list
  - iclr
  - icml
  - neurips
  - cvpr
  - emnlp
  - awards
  - llm
  - diffusion-models
  - reinforcement-learning
  - 3d-vision
  - safety-alignment
description: "A short, hyperlinked reading list of award-winning and outstanding papers from ICLR 2025/2026, ICML 2025, NeurIPS 2025, CVPR 2025, and EMNLP 2025. One- to three-line summaries with direct arXiv and venue links."
---

A reading list of the award-winning and outstanding papers across the major ML and CV/NLP venues for the 2025 cycle, plus the just-announced ICLR 2026 outstanding papers. Every paper title is linked to its arXiv preprint; the conference page is linked separately when useful.

As of today (2026-05-01), only ICLR 2026 has concluded for the 2026 cycle — CVPR 2026 (June), ICML 2026 (July), NeurIPS 2026 (December), and EMNLP 2026 (October, Budapest) have not yet happened. EMNLP 2026 submissions are due **2026-05-25**.

---

## Table of contents

---

## ICLR 2025 — Outstanding Papers

ICLR 2025 selected three Outstanding Papers from 3,704 accepted submissions ([award announcement](https://blog.iclr.cc/2025/04/22/announcing-the-outstanding-paper-awards-at-iclr-2025/)).

- **[Safety Alignment Should Be Made More Than Just a Few Tokens Deep](https://arxiv.org/abs/2406.05946)** — Qi, Panda, Lyu, Ma, Roy, Beirami, Mittal, Henderson. Argues that current alignment is "shallow" — it only conditions the first few output tokens — and that this single weakness explains adversarial-suffix attacks, prefilling attacks, decoding-parameter attacks, and the easy reversal of safety via fine-tuning. Demonstrates a deeper-token training fix.
- **[Learning Dynamics of LLM Finetuning](https://arxiv.org/abs/2407.10490)** — Yi (Joshua) Ren, Danica J. Sutherland (UBC). Step-wise decomposition of how influence accumulates across responses during SFT and DPO. Identifies the "squeezing effect" that explains why running off-policy DPO too long pushes down even the *desired* outputs.
- **[AlphaEdit: Null-Space Constrained Knowledge Editing for Language Models](https://arxiv.org/abs/2410.02355)** — Fang, Jiang, Wang, Ma, Shi, X. Wang, He, Chua. Projects parameter perturbations onto the null space of preserved knowledge, so edits don't collide with what was already there. ~36.7% average gain on top of existing locating-then-editing methods, in a single line of code.

## ICML 2025 — Outstanding Papers

Six Outstanding Papers in the main track, picked from ~3,200 accepted out of ~12,000 submissions ([awards page](https://icml.cc/virtual/2025/awards_detail)).

- **[CollabLLM: From Passive Responders to Active Collaborators](https://arxiv.org/abs/2502.00640)** — S. Wu, Galley, Peng, Cheng, G. Li, Dou, Cai, Zou, Leskovec, Gao. Trains LLMs against multiturn-aware rewards estimated by collaborative simulation, instead of next-turn rewards alone. +18.5% task performance, +46.3% interactivity, and +17.6% user satisfaction in a 201-judge user study.
- **[Train for the Worst, Plan for the Best: Understanding Token Ordering in Masked Diffusions](https://arxiv.org/abs/2502.06768)** — J. Kim, Shah, Kontonis, Kakade, S. Chen. Theoretically and empirically, masked diffusion models train on intractable subproblems but at inference can pick the next token to decode. The "decode where most confident" heuristic alone takes Sudoku from 7% → ~90%.
- **[Roll the Dice & Look Before You Leap: Going Beyond the Creative Limits of Next-Token Prediction](https://arxiv.org/abs/2504.15266)** — Nagarajan, C. H. Wu, Ding, Raghunathan. Constructs minimal algorithmic creativity tasks; shows next-token learning is myopic, that teacherless and diffusion approaches are more creative, and that input-side seed-conditioning rivals output-temperature sampling.
- **[Conformal Prediction as Bayesian Quadrature](https://arxiv.org/abs/2502.13228)** — Snell, Griffiths. Reframes conformal prediction through a Bayesian lens; unifies Split CP and Conformal Risk Control as special cases of Bayesian quadrature, with richer uncertainty representation.
- **[Score Matching with Missing Data](https://arxiv.org/abs/2506.00557)** — Givens, S. Liu, Reeve. Adapts score matching to partial-coordinate missingness via two routes (importance-weighted and variational), with finite-sample bounds for the IW variant.
- **[The Value of Prediction in Identifying the Worst-Off](https://arxiv.org/abs/2501.19334)** — Fischer-Abaigar, Kern, Perdomo. Formal welfare analysis of using ML to find the most vulnerable individuals (rather than maximize aggregate outcomes) in social policy, grounded in a German long-term-unemployment case study. Comparing prediction against expanded bureaucratic capacity is the key contribution.

## CVPR 2025

Both top awards went to 3D / inverse-rendering work ([best papers page](https://cvpr.thecvf.com/Conferences/2025/BestPapersDemos)).

- **[VGGT: Visual Geometry Grounded Transformer](https://arxiv.org/abs/2503.11651)** — Wang, M. Chen, Karaev, Vedaldi, Rupprecht, Novotny (Oxford VGG / Meta AI). Best Paper. A single feed-forward Transformer that, in one second, jointly predicts camera parameters, depth maps, point maps, and 3D point tracks for one to hundreds of input views — beating optimization-based pipelines on most 3D benchmarks. ([code](https://github.com/facebookresearch/vggt))
- **[Neural Inverse Rendering from Propagating Light](https://arxiv.org/abs/2506.05347)** — Malik, Attal, Xie, O'Toole, Lindell (Toronto / Vector / CMU). Best Student Paper. First physically-based neural inverse rendering from multi-view *time-resolved* (transient) measurements, using a time-resolved extension of neural radiance caching. Enables decomposing captured light into direct/indirect components and time-resolved relighting.

## EMNLP 2025 (Suzhou)

Single Best Paper plus 35 highlighted Outstanding Papers ([awards page](https://2025.emnlp.org/program/awards/)).

- **[Infini-gram mini: Exact n-gram Search at the Internet Scale with FM-Index](https://arxiv.org/abs/2506.12229)** — H. Xu, J. Liu, Choi, N. A. Smith, Hajishirzi (UW / AI2). Best Paper. FM-index–based system that makes 83 TB of text (Common Crawl Jan–Jul 2025, DCLM-baseline, Pile) exactly searchable by n-gram, with index size only 44% of the corpus. Practical infrastructure for contamination audits, membership inference, and grounding work.
- **[PAFT: Prompt-Agnostic Fine-Tuning](https://arxiv.org/abs/2502.12859)** — Wei, Y. Shu, Ou, Y. He, F. R. Yu. Outstanding Paper. Continually samples diverse synthetic prompts during SFT/RLFT so the model learns task-level structure rather than surface phrasing. +7% generalization to unseen prompts, 3.2× faster inference.
- **[Constructions are Revealed in Word Distributions](https://arxiv.org/abs/2503.06048)** — Rozner, Weissweiler, Mahowald, Shain. Outstanding Paper. Uses RoBERTa as a proxy for the language distribution and shows that constructions (in the construction-grammar sense) are visible as patterns of statistical affinity, including hard cases of superficially similar but semantically distinct constructions.
- **[To Mask or to Mirror: Human-AI Alignment in Collective Reasoning](https://arxiv.org/abs/2510.01924)** — C. Qian, Parisi, Bouleau, Tsai, Lebreton, Dixon (Google). Outstanding Paper. 748-participant "Lost at Sea" leader-election experiment, then matched LLM groups (Gemini 2.5, GPT-4.1, Claude Haiku 3.5, Gemma 3). Some models mirror human demographic biases; others mask and over-correct. Collective alignment is model-specific.

## NeurIPS 2025

Four Best Papers and three Runner-Ups ([award announcement](https://blog.neurips.cc/2025/11/26/announcing-the-neurips-2025-best-paper-awards/)).

**Best Papers**

- **[Gated Attention for Large Language Models: Non-linearity, Sparsity, and Attention-Sink-Free](https://arxiv.org/abs/2505.06708)** — Qiu et al. (Alibaba Qwen). A learnable, head-specific sigmoid gate inserted right after Scaled Dot-Product Attention. Eliminates the attention-sink artifact (heads can now output zero), stabilizes training, tolerates higher learning rates, and improves scaling. Validated on 1.7B dense and 15B MoE up to 3.5T tokens.
- **[Artificial Hivemind: The Open-Ended Homogeneity of Language Models (and Beyond)](https://arxiv.org/abs/2510.22954)** — L. Jiang et al. Releases Infinity-Chat (26K real open-ended queries, 31K human annotations across ratings + pairwise preferences, 25 annotators per example) and a 6-category / 17-subcategory taxonomy. Documents both intra-model repetition and pronounced inter-model homogeneity across 70+ models.
- **[1000 Layer Networks for Self-Supervised RL: Scaling Depth Can Enable New Goal-Reaching Capabilities](https://arxiv.org/abs/2503.14858)** — K. Wang et al. Most RL networks are 2–5 layers. Pushing contrastive RL to 1024 layers (with the right SSL classification objective rather than TD-regression) gives 2×–50× gains on locomotion and manipulation, in a goal-conditioned setting with no demonstrations or rewards.
- **[Why Diffusion Models Don't Memorize: The Role of Implicit Dynamical Regularization in Training](https://arxiv.org/abs/2505.17638)** — Bonnaire, Urfin, Biroli, Mézard. Identifies two distinct training timescales: τ_gen (when good samples appear) and τ_mem (when memorization sets in). τ_mem grows linearly with dataset size n while τ_gen stays constant, yielding a widening generalization window. Reframes early stopping as a structural necessity, not a heuristic.

**Runner-Ups**

- **[Optimal Mistake Bounds for Transductive Online Learning](https://arxiv.org/abs/2512.12567)** — Z. Chase, Hanneke, Moran, Shafer. Closes a 30-year-old open problem: the optimal transductive mistake bound is Θ(√d) where d is Littlestone dimension — exponentially tighter than prior Ω(log log d) / Ω(√log d) / Ω(log d) bounds. Establishes a quadratic gap between transductive and standard online learning.
- **[Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?](https://arxiv.org/abs/2504.13837)** — Y. Yue et al. (Tsinghua LeapLab). RLVR-trained LLMs beat their base models at small k in pass@k, but the *base* models win at large k. The reasoning paths RLVR produces are already in the base model's sampling distribution — so the trained capability boundary actually *narrows*. Distillation, by contrast, genuinely expands it.
- **[Superposition Yields Robust Neural Scaling](https://arxiv.org/abs/2505.10465)** — Y. Liu, Z. Liu, Gore. First-principles derivation of neural scaling laws from representation superposition: in the strong-superposition regime (more features than dimensions), loss scales as L ∝ 1/m with model width. Validated on OPT, Pythia, Qwen via a sparse-autoencoder framework. Distribution-robust unlike previous explanations.

## ICLR 2026 — Outstanding Papers (just announced)

Two Outstanding Papers and one Honorable Mention from 5,355 accepted of 19,525 submissions (27.4% acceptance) ([award announcement](https://blog.iclr.cc/2026/04/23/announcing-the-iclr-2026-outstanding-papers/)).

- **[Transformers are Inherently Succinct](https://arxiv.org/abs/2510.19315)** — Bergsträßer, Cotterell, Lin. Proves Transformers are *doubly exponentially* more succinct than finite automata, and exponentially more succinct than RNNs and LTL, when representing formal languages. As a corollary, verifying properties of Transformers is EXPSPACE-complete — formally intractable.
- **[LLMs Get Lost in Multi-Turn Conversation](https://openreview.net/forum?id=VKGTGGcwl6)** — Laban, Hayashi, Y. Zhou, Neville. Across 200,000+ simulated conversations on six generation tasks, every top open- and closed-weight LLM tested shows an average **39% drop** going from single-turn to multi-turn underspecified instructions. Decomposes the drop into a small aptitude loss and a large *unreliability* increase.

## What's still to come in 2026

- **CVPR 2026** — June 2026.
- **ICML 2026** — July 2026.
- **EMNLP 2026** — Oct 24–29, 2026, Budapest. Submission deadline May 25, 2026.
- **NeurIPS 2026** — December 2026.

---

## A few patterns worth noticing

A pattern across the 2025 best-paper slate: **deflationary findings are getting awarded.** "RLVR doesn't expand reasoning beyond the base model" (NeurIPS runner-up), "LLMs lose 39% of their capability across multi-turn conversation" (ICLR 2026), "alignment is shallow and easily reversed" (ICLR 2025), "different LLMs collapse onto the same outputs" (NeurIPS 2025) — the field is rewarding work that punctures over-claims rather than pushing the next benchmark by 0.7%.

A second pattern: **mechanistic explanations of empirical phenomena are back.** Why diffusion models don't memorize, why scaling laws hold (superposition), why attention sinks exist (gating), what creativity gaps next-token prediction has — these are *theory* papers grounded in clean experiments, not pure benchmark contests.

A third: in 3D vision, **the feed-forward Transformer has eaten the optimization-based pipeline.** VGGT does in one second what bundle-adjustment-style pipelines do in minutes, and wins on accuracy.

Sources for everything above are linked inline; the conference award pages are the canonical lists if you want the full slate of Outstanding/Honorable Mention papers I didn't pull out individually.
