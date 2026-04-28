---
title: "The Perception–Planning Gap: What's Actually Hard About Visual AI in 2026"
author: Dendi Suhubdy
pubDatetime: 2026-04-28T10:00:00Z
featured: false
draft: false
tags:
  - artificial-intelligence
  - computer-vision
  - robotics
  - world-models
  - planning
  - vla
  - foundation-models
  - 3d-reconstruction
  - jepa
  - dreamer
  - rt-2
  - pi-zero
  - genie
  - sora
  - dust3r
  - vggt
description: "A technical survey of where visual perception and planning research actually stands in 2026. Pixel-level perception is largely solved at the representation layer, but perception-for-action — geometry, physics, dexterity, long-horizon control — is not. Reading the recent literature on JEPA, DreamerV3, Sora-as-world-model, RT-2 / OpenVLA / π0, Helix, Gemini Robotics, DUSt3R / MASt3R / VGGT, and the world-model evaluation papers (WorldModelBench, Physion, IntPhys 2), the through-line is the same: we have strong representations and architectural ideas, but the data, evaluation, and physical-grounding infrastructure to validate them is what's missing."
---

The thesis I want to defend in this piece is structural: **perception in pixels is largely solved at the representation level; perception *for action* is not, and the gap between the two is the central unsolved problem of visual AI in 2026.** Frontier vision-language models can pass medical-board questions and explain radiographs at attending-physician level. Frontier robots, after a decade of foundation-model progress, still cannot reliably load an arbitrary dishwasher. Moravec's paradox is not a quaint historical observation; it is the daily lived experience of every embodied-AI lab.

This post is a technical survey of why. I'll walk through what is actually hard about visual perception, what is actually hard about planning, and where the four most active research frontiers — world models, vision-language-action policies, 3D foundation models, and embodied evaluation — actually stand. I'll cite the work I'm leaning on, including LeCun's position paper on autonomous machine intelligence, the JEPA family ([V-JEPA](https://arxiv.org/abs/2404.08471), [V-JEPA 2](https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/)), the Dreamer line ([DreamerV3](https://arxiv.org/abs/2301.04104)), the world-model-evaluation literature ([Physion](https://arxiv.org/abs/2106.08261), [IntPhys 2](https://arxiv.org/abs/2503.18078), [WorldModelBench](https://arxiv.org/abs/2502.20694)), the VLA papers ([RT-2](https://robotics-transformer2.github.io/), [Open X-Embodiment](https://robotics-transformer-x.github.io/), [OpenVLA](https://openvla.github.io/), [π0](https://www.physicalintelligence.company/blog/pi0)), [Helix from Figure](https://www.figure.ai/news/helix), [Gemini Robotics](https://deepmind.google/discover/blog/gemini-robotics-brings-ai-into-the-physical-world/), and the recent feed-forward 3D work ([DUSt3R](https://arxiv.org/abs/2312.14132), [MASt3R](https://arxiv.org/abs/2406.09756), [VGGT](https://arxiv.org/abs/2503.11651)).

This is the long version of the argument.

---

## 1. What "perception" actually means, and why it has two failure modes

The word "perception" papers over two very different capabilities. The first is **passive recognition**: given an image or video, produce labels, captions, segmentations, or answers to questions. The second is **active grounding for control**: produce a representation that supports action — reaching, grasping, navigating, manipulating, planning over.

The 2010s vision community optimized almost exclusively for the first. ImageNet, COCO, Visual Genome, VQA, and their descendants are passive benchmarks. They reward models that map pixels to symbols. They do not reward models that produce metric geometry, action affordances, physical predictions, or counterfactual rollouts. The leaderboards converged. The capability did not.

The honest reading of the field in 2026 is that **passive perception is mostly a solved problem at the representation layer**. DINOv2-class self-supervised encoders ([Oquab et al., 2023](https://arxiv.org/abs/2304.07193)), [SAM 2](https://ai.meta.com/sam2/) (Segment Anything Model 2) for promptable segmentation, [Depth Anything V2](https://depth-anything-v2.github.io/) for monocular depth, and frontier vision-language models or VLMs (GPT-4V class, Gemini 2.5, Claude with vision, Qwen2-VL, Molmo, the Llama 3.2 Vision family) collectively give you strong zero-shot 2D understanding. The remaining 2D failure modes are real but increasingly narrow: counting, fine-grained spatial relations, occluded-object reasoning, and adversarial corner cases. The benchmarks that still embarrass these models — [BLINK](https://arxiv.org/abs/2404.12390), [MMVP](https://arxiv.org/abs/2401.06209), [CV-Bench](https://cambrian-mllm.github.io/), [ARC-AGI-2](https://arcprize.org/) — are precisely the ones that probe perception *as reasoning over geometry and composition*, not perception as recognition.

A necessary caveat on the word "solved." What I mean is **solved on standard benchmarks under controlled conditions**, not solved for deployment. A deployed perception system in a warehouse, an operating theater, or a household kitchen still routinely fails on lighting variation, novel materials, motion blur, partial occlusion under unusual viewpoints, and the long tail of objects that simply did not appear in pretraining. Autonomous-vehicle perception is the canonical case study: ImageNet was "solved" in 2015 and AVs still log perception failures in 2026, because real-world distributions are not bounded. The lab-to-deployment gap is wide for exactly the same reason it has always been wide — robustness in the wild is a different problem from accuracy on a held-out test set, and the way we measure progress systematically under-rewards the former.

Active perception is a different story entirely. Almost none of the foundation-model gains transfer cleanly to robots, and the reasons are now well-understood:

- **3D inference from 2D is data-starved.** The web has trillions of natural images; it has comparatively little metric 3D data. Objaverse-XL (~10M synthetic assets) is the closest thing to ImageNet for 3D, and synthetic assets do not replace natural scenes.
- **Temporal reasoning over long video is unsolved.** Object permanence, event causality, multi-minute coherence — frontier VLMs degrade rapidly past a few seconds of context. The recent video benchmarks (LongVideoBench, Video-MME) confirm this.
- **Active perception — moving the camera to disambiguate — is barely studied at scale.** Almost all pretraining is passive consumption.
- **Physical and intuitive reasoning lags behind semantic reasoning.** [IntPhys 2](https://arxiv.org/abs/2503.18078) and [Physion](https://arxiv.org/abs/2106.08261) demonstrate that frontier models systematically fail at predicting what will happen next in physical scenes, even when they can describe the scene perfectly.

The structural problem is that **the objectives that produce strong semantic representations are not the objectives that produce strong action-relevant representations**. CLIP-style contrastive training optimizes for "image matches caption." That is a useful signal, but a robot does not need to know that a coffee cup is *called* a coffee cup. It needs to know how heavy it is, how it deforms, where its handle is in 3D, what its center of mass implies for tipping, and what happens to the liquid inside if you tilt it.

This is what I mean by "the perception–planning gap." It is not that perception is unsolved. It is that the *kind* of perception we have solved is the wrong kind for the next set of problems.

### A short detour: why vision suffers more from this gap than text or speech

It is worth asking why this gap is so much wider in vision than in language. Three reasons, in order of importance.

**Embodiment and irreversibility.** Text actions are cheap and reversible. Saying the wrong sentence costs nothing; saying it again is free. Visual actions, in the embodied sense, are not. A robot that grasps wrong drops the cup. The world does not let you re-roll. This asymmetry shapes everything downstream — data collection, evaluation, and the kinds of objectives you can train against.

**Closing the human-feedback loop is cheap for language and expensive for vision.** Reinforcement learning from human feedback (RLHF) worked for language because language is the substrate of human preference: you can ask a person to rate two sentences in seconds, at scale, on Mechanical Turk. The visual analogue — asking a person to rate two robot trajectories, or two physical reconstructions of a scene — is dramatically more expensive per labeled sample, and the labels are noisier. There is no Mechanical-Turk-for-physics.

**Vision is bound to a continuous, uncountable distribution.** Text is discrete. Speech is one-dimensional. The set of possible visual scenes a robot might encounter is, for practical purposes, a measure-zero subset of an extremely high-dimensional manifold, and the parts that matter for action are the parts of the manifold least represented in any natural-image corpus. This is not a temporary data problem; it is a structural one.

The implication is that the playbook that worked for language — pretrain on the internet, post-train with RLHF, deploy — does not straightforwardly apply to embodied vision. The next section makes the same point from the planning side.

---

## 2. What "planning" actually means, and why long horizons are hard

Planning has the same two-level problem. There is **planning in tokens** — language-model agents producing sequences of tool calls, math derivations, code edits — and there is **planning in the world**, where actions have continuous, irreversible, partially observed consequences.

Planning in tokens has improved dramatically. ReAct ([Yao et al., 2022](https://arxiv.org/abs/2210.03629)) and its descendants, Tree of Thoughts ([Yao et al., 2023](https://arxiv.org/abs/2305.10601)), and the newer reasoning-model paradigm (the o-series, DeepSeek-R1, Claude with extended thinking) closed a meaningful chunk of the planning gap on math, code, and structured agentic tasks. The reason it works is not principled — it works because text environments tolerate retries. Make a wrong tool call, recover, try again. The world does not always grant that affordance.

Planning in the physical world is bottlenecked by four interlocking problems.

**Long-horizon credit assignment.** Beyond ~50–100 decisions, search blows up combinatorially and value estimates drift. Hierarchical reinforcement learning (HRL) was supposed to fix this with temporal abstraction (options, sub-goals, skills). It has not, at least not at the scale needed for general embodied agents. The decades of work since [Sutton, Precup & Singh (1999)](https://people.cs.umass.edu/~barto/courses/cs687/Sutton-Precup-Singh-AIJ99.pdf) on options has produced strong narrow results and no general method. That said, the field is not stuck. Several active strands are nibbling at the edges: hindsight experience replay ([HER, Andrychowicz et al., 2017](https://arxiv.org/abs/1707.01495)) and goal-relabeling more broadly turn failed trajectories into useful supervision; off-policy importance-weighted methods reduce the variance of value estimates over long horizons; learned reward models from preference data — the same mechanism behind RLHF — give a path to dense supervision without dense human labels; and the causal-inference / RL interface ([Buesing et al., 2018](https://arxiv.org/abs/1811.06272), [Lu et al., 2020](https://arxiv.org/abs/2006.02732)) is starting to formalize counterfactual credit assignment in ways the pre-2020 literature could not. None of these is a general solution. Together they suggest the bottleneck is more likely to crack than it has at any point in the last twenty-five years.

**World-model fidelity.** To plan in imagination, you need a model accurate enough that the imagined consequences track reality. This is the topic of section 3.

**Goal and reward specification.** RLHF and RLAIF work for language because language is the substrate of human preference. For embodied tasks the substrate is much harder. "Wash the dishes" decomposes into thousands of sub-goals that are easy to specify in natural language and brutally hard to specify as a reward function. The reward-hacking literature ([Pan et al., 2022](https://arxiv.org/abs/2201.03544), [Skalse et al., 2022](https://arxiv.org/abs/2209.13085)) has documented dozens of cases where optimizers find degenerate solutions that satisfy the letter of a reward but not the intent.

**Compositionality of skills.** Stitching learned primitives into novel sequences without retraining is the classic neuro-symbolic gap. We have policies that can pour and policies that can stir; we do not have a clean recipe for combining them on demand to make tea.

The first three problems are research-hard. The fourth is, in some sense, the deepest — because it is the bottleneck on the entire general-intelligence agenda, not just robotics.

---

## 3. The world-model debate

Three camps are fighting over the same word.

**The generative-pixel camp** — [Sora](https://openai.com/index/sora/), Veo 3, [NVIDIA's Cosmos](https://www.nvidia.com/en-us/ai/cosmos/), [Genie 2](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/) and Genie 3 from DeepMind — bets that **scale plus action conditioning leads to emergent physics**. The training signal is pixel reconstruction or denoising; the architectural commitment is autoregressive transformers or video diffusion; the deployment story is increasingly explicit, with NVIDIA pitching Cosmos as the foundation substrate for "physical AI" simulation.

Genie 3 is the strongest existence proof of this camp's bet — real-time interactive worlds at decent fidelity, actions affecting future frames in roughly the right ways. The visual quality is staggering. The physical reliability, under controlled probes, is not.

**The latent-predictive camp** is LeCun's program, articulated in the [autonomous-machine-intelligence position paper](https://openreview.net/pdf?id=BZ5a1r-kVsf) and built out as the [JEPA family](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/) (Joint Embedding Predictive Architecture). The architectural bet is that **pixel prediction is wasteful**: you should predict the parts of the latent state that matter for control, not the texture of the next frame. [V-JEPA 2 (2025)](https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/) is the headline result — *action-conditioned latent rollouts used for zero-shot manipulation planning*. Unpacked: instead of generating the next video frame given an action, the model is trained to predict the next *latent embedding* of the scene given an action, and a planner searches over candidate action sequences by rolling them out in this latent space. The visual blindness is intentional; the question is whether the latent representations are rich enough to plan over realistic distributions.

**The compact-world-model-for-RL camp** — DreamerV3 ([Hafner et al., 2023](https://arxiv.org/abs/2301.04104)), [IRIS](https://arxiv.org/abs/2209.00588), [TWM](https://arxiv.org/abs/2303.07109), [DIAMOND](https://arxiv.org/abs/2405.12399) — actually closes the loop. Train a small recurrent or transformer world model, plan or learn a policy in imagination, deploy. DreamerV3 was the first general method to solve Minecraft diamond from pixels with no task-specific tuning. The narrowness of the application domain is the price for actually working.

The empirical evidence on the central question — *can generative video models plan?* — is now starting to come in, and it is not flattering to the pixel camp. [WorldModelBench (2025)](https://arxiv.org/abs/2502.20694), [Physion](https://arxiv.org/abs/2106.08261), [IntPhys 2 (2025)](https://arxiv.org/abs/2503.18078), and the various Sora and Kling physics-violation studies converge on the same finding: generative video models hallucinate plausible-looking but counterfactually wrong physics. The output looks like a world. It does not respond to interventions like a world. Nudge an action — push the cup left instead of right — and the rollout drifts in ways that real physics does not allow.

The crux is this: **counterfactual fidelity under action conditioning is the missing capability**, not visual realism. A model that produces beautiful frames but cannot tell you what happens when you push the cup is *not a world model*, regardless of how its output looks on a website. It is a video decorator with conditioning.

The honest reading: the latent-predictive camp has the cleaner formulation but weaker visual outputs; the generative-pixel camp has the most spectacular demos but the weakest physical grounding; the compact-RL camp has the only end-to-end working pipeline but in narrow domains. Nobody has the full thing.

If world models are the imagination substrate for planning, the next question is what is being built on top of them in the meantime. That is the VLA story.

---

## 4. Vision-language-action models — the actual robotics frontier

The fastest-moving area of embodied AI in 2024–2026 is the vision-language-action (VLA) line. The lineage is:

[**RT-1 (2022)**](https://robotics-transformer1.github.io/) — first transformer policy at robotics scale.
[**RT-2 (2023)**](https://robotics-transformer2.github.io/) — co-trained with web vision-language data, established that web pretraining transfers to robot control.
[**RT-X / Open X-Embodiment (2023)**](https://robotics-transformer-x.github.io/) — pooled robot data across 22 institutions and dozens of embodiments, ~1M episodes total. The first credible attempt at an "ImageNet for robots."
[**OpenVLA (2024)**](https://openvla.github.io/) — open 7B VLA, the standard baseline.
[**π0 (Physical Intelligence, 2024)**](https://www.physicalintelligence.company/blog/pi0) — flow-matching action expert grafted onto a VLM backbone, trained on internet plus a large proprietary teleop corpus. Among the strongest published demos of cross-task generalization.
[**π0.5 (Physical Intelligence, 2025)**](https://www.physicalintelligence.company/blog/pi05) — better generalization, mobile manipulation, more challenging environments.
[**Helix (Figure, 2025)**](https://www.figure.ai/news/helix) — explicit System 1 / System 2 split, the cleanest articulation of the hierarchical pattern.
[**Gemini Robotics and Robotics-ER (DeepMind, 2025)**](https://deepmind.google/discover/blog/gemini-robotics-brings-ai-into-the-physical-world/) — embodied reasoning, long-horizon, large-scale.
[**GR00T N1 (NVIDIA, 2024–2025)**](https://developer.nvidia.com/blog/accelerate-generalist-humanoid-robot-development-with-nvidia-isaac-gr00t-n1/) — humanoid foundation model with sim-to-real emphasis.

The architectural debate has converged on three choices that are now broadly settled.

**Continuous action heads beat discrete action tokens.** RT-2 tokenized actions into a vocabulary and predicted them autoregressively. This is fine for coarse manipulation; it loses to [Diffusion Policy (Chi et al., 2023)](https://arxiv.org/abs/2303.04137) and to flow-matching heads (π0) on fine motor tasks. The reason is that action distributions are multimodal and continuous, and softmax over bins quantizes away the dexterity. The field has moved on.

**System 1 / System 2 separation is forced by latency.** Helix and Gemini Robotics-ER both factor explicitly: a slow VLM (~5–10 Hz) for semantic reasoning and task decomposition, a fast transformer or diffusion policy (~200 Hz) for low-level control. Monolithic 7B VLAs cannot run at control rates on the kind of compute a robot can carry. The hierarchy is not just architectural elegance — it is a consequence of the speed of light and the price of GPUs.

**Cotraining beats frozen backbones.** RT-2 established that joint training with web vision-language data preserves semantic generalization in a way that adapter-based fine-tuning does not. Frozen backbones are cheaper but lose the long tail of object and scene knowledge. Every serious VLA since has cotrained.

The actual bottleneck is **data, not architecture**. Open X-Embodiment is a rounding error next to LAION-class image datasets. There is no embodied analogue to the web — and there cannot be, because robot data has to be collected by robots, in physical environments, by people. This is why Physical Intelligence, Figure, 1X, Tesla, Boston Dynamics, and Google Robotics are all simultaneously building teleoperation farms and deploying early fleets. The "GPT-3 moment" for robotics is gated on a dataset that does not exist yet, and may need to be collected by deployed fleets — a chicken-and-egg problem that the well-funded entrants are betting on solving in production.

The honest read on what these models can do: short-horizon manipulation, single-room, modest novelty, extensive variation within the training distribution. What they cannot do: arbitrary novel kitchens, contact-rich tool use under variation, long-horizon recovery from off-distribution states, and generalization across embodiments. The "fold laundry" demo class is real. "Load any dishwasher in any kitchen" is not, and the gap between the two is mostly data.

It is worth being explicit about what "mostly data" hides, because the long tail in robotics is unforgiving in a way that the long tail in 2D classification is not. A perception model that misclassifies 0.1% of images is a state-of-the-art system. A robot policy that fails on 0.1% of grasps drops one cup per thousand — and if those failures cluster on wet floors, dark cabinets, transparent objects, soft fruit, kids holding the cup at the wrong end, or the cat sitting on the dishwasher door, the policy is unshippable regardless of average-case performance. The autonomous-vehicle decade demonstrated this empirically: each subsequent 9 of reliability cost an order of magnitude more data and engineering than the last, and the failure modes were always concentrated in messy real-world distributions that the lab benchmarks did not span. There is no reason to expect humanoid robotics to be more forgiving on this axis. If anything, the contact-rich, multi-object, multi-agent nature of household tasks makes the long tail thicker.

---

## 5. The 3D foundation-model frontier

Three tracks are moving at different speeds.

**Feed-forward reconstruction is the breakout area.** [DUSt3R (Wang et al., 2024)](https://arxiv.org/abs/2312.14132) replaced per-scene NeRF/Gaussian-splatting optimization with a single forward pass producing dense geometry from two unposed images. [MASt3R (2024)](https://arxiv.org/abs/2406.09756) extended it to matching and metric reconstruction. [VGGT (Visual Geometry Grounded Transformer, 2025)](https://arxiv.org/abs/2503.11651) generalized to N views, jointly producing camera poses, depth, and tracks. Fast3R and Spann3R extend further. This is, in my view, the closest analogue to ImageNet's effect on 2D — a pretrained backbone that gives you camera and depth and correspondence essentially for free, in a way that wasn't possible eighteen months ago.

**Generative 3D is mature for assets, immature for scenes.** TRELLIS, Hunyuan3D 2, Rodin, and the multi-view diffusion line ([Zero-1-to-3](https://arxiv.org/abs/2303.11328), [MVDream](https://arxiv.org/abs/2308.16512)) produce decent meshes and Gaussians from images or text. Useful for content pipelines and for populating simulators. Not useful for understanding the natural world a robot is operating in.

**3D-aware semantics is fragmented.** The agenda of lifting 2D foundation features (CLIP, DINO, SAM) into 3D — [3D-LLM](https://arxiv.org/abs/2307.12981), [ConceptGraphs](https://concept-graphs.github.io/), OpenScene, SAM-3D variants — is functional but has not produced a clean unifying foundation model. We have many good components and no DINO-of-3D-semantics yet.

The actual open problems are well-defined but unsolved:

- **Joint metric depth, semantics, and dynamics over time.** Depth Anything V2 nails monocular geometry. SAM 2 nails segmentation. Nothing nails them simultaneously over time at metric scale.
- **Feed-forward 4D.** 4D — three spatial dimensions plus time — is the natural representation for dynamic scenes, where geometry and motion both matter. 4D Gaussian splatting works but is per-scene and data-hungry: every new video has to be optimized from scratch. *Feed-forward* methods, by contrast, produce 4D output in a single pass through a pretrained network, no per-scene optimization required, the way DUSt3R and VGGT do for static 3D. Feed-forward 4D in that spirit is wide open and would be transformative for robotics.
- **The right 3D representation *for action*.** Gaussians, neural radiance fields, voxels, point clouds, mesh, signed-distance fields — the policy-learning community has not converged. This is not a stylistic choice. The representation determines what compositional generalization is possible and what kinds of transfer from sim to real are tractable.
- **Pretraining data.** Objaverse-XL is 10M+ synthetic assets; CO3D, MVImgNet, ScanNet++, Aria Everyday Activities are the realistic naturalistic options and they are tiny by 2D standards.

The honest read: 3D in 2026 is roughly where 2D was in 2018. The components are strong, the unifying foundation model is not yet here, and the data flywheel is not yet spinning at internet scale. VGGT is the most plausible candidate for the "DINO of 3D" but it is months old and not yet battle-tested across the long tail of natural scenes.

---

## 6. Embodied evaluation — the missing infrastructure

A theme runs through all of the above: **we do not have benchmarks that reliably distinguish a real capability from a convincing demo**. This is the most under-discussed bottleneck in the field.

For perception, the situation is actually decent. BLINK, MMVP, CV-Bench, MME, MMMU, ARC-AGI-2, and the various spatial-reasoning benchmarks have surfaced real failures and driven real progress. The benchmarks lag the models — saturated benchmarks become useless within months of release — but the methodology of *probing what models cannot do* is mature.

For world models, the methodology is still being invented. WorldModelBench, IntPhys 2, and Physion are early attempts. They show that frontier video models fail at simple physics under counterfactual probes, but they are far from comprehensive. There is no generally accepted procedure for evaluating "is this a world model?" beyond visual inspection and ad-hoc physics tests.

For embodied policies, the situation is worse. Real-world evaluation is expensive, hard to reproduce, and confounded by hardware variation. Simulators (Isaac Sim, MuJoCo MPC, RoboCasa, BEHAVIOR-1K, Habitat) help but inherit sim-to-real gaps. The community runs strong sim benchmarks and weak real benchmarks, and the published numbers from corporate labs are essentially impossible to verify independently. The Open X-Embodiment community is the best counterweight to this, but it is undermanned for the scale of the claims being made.

The result is that **the architectural literature is moving faster than the empirical literature can keep up with**. We have ten papers per month proposing new VLA recipes, new world-model objectives, new 3D backbones. We have very few papers carefully measuring what any of them actually do under controlled conditions. This is the single highest-leverage place for the academic community to push, because it is the bottleneck the corporate labs cannot easily solve from inside.

---

## 7. The honest summary

The through-line across perception, planning, world models, VLAs, and 3D is the same: **representations are improving faster than the data and evaluation infrastructure can validate them**.

Concretely:

- **Perception in pixels** is largely solved at the representation layer. The remaining failures are in geometry, composition, and long-form video — the parts of perception that are most relevant to action.
- **Planning in tokens** has had a real breakthrough with reasoning models. **Planning in the physical world** remains data- and world-model-limited.
- **World models** — there are three serious camps, and none of them has the full thing. Generative video models are visually rich but counterfactually wrong. Latent-predictive models are physically tighter but visually blind. Compact RL world models work but only in narrow domains. Counterfactual fidelity under action conditioning is the missing capability.
- **VLA models** are the most exciting active frontier. Architectural debates have largely converged. The bottleneck is data, not ideas.
- **3D foundation models** are roughly five years behind 2D and starting to catch up via feed-forward methods like DUSt3R and VGGT. The right representation for action is still open.
- **Evaluation infrastructure** is the most under-discussed bottleneck and the highest-leverage place for community investment.

Moravec's paradox is not a curiosity. It is the daily lived experience of the field. Frontier models can do graduate-level mathematics and write production-quality code, and they cannot reliably load a dishwasher. The reason is not that we lack ideas. It is that *we do not yet have an internet-scale dataset of physical interaction*, and we do not yet have a world-model objective that produces representations rich enough to plan over realistic distributions.

If I had to bet on what closes the gap, it would be three things, roughly in this order:

1. **Deployed robot fleets generating their own training data**, the way self-driving fleets did in the late 2010s. Physical Intelligence, Figure, 1X, Tesla, and the humanoid push are all positioned for this.
2. **Action-conditioned latent world models with serious counterfactual evaluation**. Not Sora-as-world-model. Something more like V-JEPA 2 with a richer latent space and a proper evaluation harness.
3. **3D foundation models for action**, in the spirit of VGGT but trained on robot interaction data, with representations chosen for policy learning rather than reconstruction.

None of these are guaranteed. It is worth saying out loud what could go wrong with each. **Robot fleet data may be slower, more expensive, and lower-variance than the autonomous-vehicle precedent suggests.** Cars are constrained to roads with structured rules; humanoids will operate in homes and warehouses with no such structure, and the per-episode cost of a useful trajectory is far higher than a mile of highway. The flywheel may take fifteen years, not five, and may require regulatory and liability scaffolding that does not yet exist. **Latent world models may not scale.** The JEPA program is intellectually clean but empirically thin — V-JEPA 2 is a strong existence proof, not a scaling-law demonstration, and there is a real possibility that latent prediction loses the long tail of detail that turns out to matter for fine-grained control. **3D foundation models for action may need representations we have not yet invented.** The 2D foundation-model story worked because pixels were already a usable substrate; the embodied analogue may require a representation co-designed with the policy, in which case it is less a scaling problem and more a research problem, and the timeline stretches accordingly.

The field has been here before — the 2010s vision community had the same problem with ImageNet before AlexNet, and the early-2020s language community had the same problem with text data before the scaling laws came in. What we are missing in embodied AI right now is the equivalent of those two unlocks. They will probably arrive. The interesting question is not whether, but who builds them and on what timeline, and whether the resulting capability lands in a regulatory and labor environment that can absorb it without breaking things downstream — which is a separate essay, and one I have already written.

---

## 8. Ten claims the field should debate in 2026

A non-exhaustive list of claims I think are roughly right and would benefit from sharper public argument. I do not expect agreement on any of them; I do think the field would be better served by debating them explicitly than by sliding past them.

1. **Generative video models are not world models, and the field should stop calling them that.** Counterfactual fidelity under action conditioning is the test. Most of what is called a "world model" today fails it.
2. **The "GPT-3 moment" for robotics is gated on a dataset that may take a decade of fleet deployment to collect.** Architectural debates above this layer are second-order.
3. **Hierarchical reinforcement learning has been a twenty-five-year research program with no general method to show for it.** This is evidence that the abstraction may be wrong, not that we have not tried hard enough.
4. **Reasoning-model progress on math and code does not transfer to embodied planning.** Treating it as evidence for general-intelligence progress is a category error.
5. **3D foundation models will close the gap to 2D faster than expected**, on the order of 18–36 months, because feed-forward methods like DUSt3R and VGGT remove the data-quantity bottleneck that was thought to be terminal.
6. **Sim-to-real transfer will be solved before cross-embodiment transfer.** The latter is harder than it looks because the inductive biases of a humanoid and a parallel-jaw gripper are not interchangeable in the way the literature implicitly assumes.
7. **The bottleneck on humanoid robotics is not hardware.** It is policy data and evaluation infrastructure. The labs that win will be the ones with the largest deployed fleets, not the ones with the best mechanics.
8. **Counterfactual evaluation should become a first-class methodology for world models**, on par with FID for image generation. Until that lands, the visual-quality leaderboard is misleading the field.
9. **The "right" representation for action-relevant 3D is unlikely to be Gaussian splats, neural radiance fields, or meshes.** It will be something policy-learned that we do not yet have a clean name for.
10. **RLHF was a one-time wedge that worked because text is the substrate of human preference.** The embodied analogue will require fundamentally different infrastructure — likely some combination of teleoperation at scale, learned reward models grounded in physics, and counterfactual evaluation harnesses that do not yet exist.

If any of these turn out to be wrong, I would like to know which, and why. That is the productive disagreement. The unproductive one is the one the field is mostly having: arguing past each other about whether a given demo "works" without specifying what working means under what distribution.

---

## References and further reading

- Yann LeCun. *A Path Towards Autonomous Machine Intelligence* (2022). [OpenReview](https://openreview.net/pdf?id=BZ5a1r-kVsf).
- Bardes et al. *V-JEPA: Latent Video Prediction for Visual Representation Learning* (2024). [arXiv:2404.08471](https://arxiv.org/abs/2404.08471).
- Meta AI. *V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction, and Planning* (2025). [Meta Research](https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/).
- Hafner et al. *Mastering Diverse Domains through World Models* (DreamerV3, 2023). [arXiv:2301.04104](https://arxiv.org/abs/2301.04104).
- Micheli et al. *Transformers are Sample-Efficient World Models* (IRIS, 2022). [arXiv:2209.00588](https://arxiv.org/abs/2209.00588).
- Alonso et al. *Diffusion for World Modeling* (DIAMOND, 2024). [arXiv:2405.12399](https://arxiv.org/abs/2405.12399).
- Bear et al. *Physion: Evaluating Physical Prediction from Vision in Humans and Machines* (2021). [arXiv:2106.08261](https://arxiv.org/abs/2106.08261).
- Bordes et al. *IntPhys 2: Benchmarking Intuitive Physics Understanding in Complex Synthetic Environments* (2025). [arXiv:2503.18078](https://arxiv.org/abs/2503.18078).
- Li et al. *WorldModelBench: Judging Video Generation Models as World Models* (2025). [arXiv:2502.20694](https://arxiv.org/abs/2502.20694).
- DeepMind. *Genie 2: A Large-Scale Foundation World Model* (2024). [DeepMind Blog](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/).
- NVIDIA. *Cosmos: A Foundation Model Platform for Physical AI* (2025). [NVIDIA Cosmos](https://www.nvidia.com/en-us/ai/cosmos/).
- Brohan et al. *RT-1: Robotics Transformer for Real-World Control* (2022). [Project page](https://robotics-transformer1.github.io/).
- Brohan et al. *RT-2: Vision-Language-Action Models* (2023). [Project page](https://robotics-transformer2.github.io/).
- Open X-Embodiment Collaboration. *Open X-Embodiment: Robotic Learning Datasets and RT-X Models* (2023). [Project page](https://robotics-transformer-x.github.io/).
- Kim et al. *OpenVLA: An Open-Source Vision-Language-Action Model* (2024). [Project page](https://openvla.github.io/).
- Physical Intelligence. *π0: A Vision-Language-Action Flow Model for General Robot Control* (2024). [Blog](https://www.physicalintelligence.company/blog/pi0).
- Physical Intelligence. *π0.5: A VLA with Open-World Generalization* (2025). [Blog](https://www.physicalintelligence.company/blog/pi05).
- Figure. *Helix: A Vision-Language-Action Model for Generalist Humanoid Control* (2025). [Figure News](https://www.figure.ai/news/helix).
- DeepMind. *Gemini Robotics: Bringing AI into the Physical World* (2025). [DeepMind Blog](https://deepmind.google/discover/blog/gemini-robotics-brings-ai-into-the-physical-world/).
- NVIDIA. *Isaac GR00T N1: A Foundation Model for Generalist Humanoid Robots* (2025). [NVIDIA Developer Blog](https://developer.nvidia.com/blog/accelerate-generalist-humanoid-robot-development-with-nvidia-isaac-gr00t-n1/).
- Chi et al. *Diffusion Policy: Visuomotor Policy Learning via Action Diffusion* (2023). [arXiv:2303.04137](https://arxiv.org/abs/2303.04137).
- Wang et al. *DUSt3R: Geometric 3D Vision Made Easy* (2024). [arXiv:2312.14132](https://arxiv.org/abs/2312.14132).
- Leroy et al. *MASt3R: Grounding Image Matching in 3D with MASt3R* (2024). [arXiv:2406.09756](https://arxiv.org/abs/2406.09756).
- Wang et al. *VGGT: Visual Geometry Grounded Transformer* (2025). [arXiv:2503.11651](https://arxiv.org/abs/2503.11651).
- Oquab et al. *DINOv2: Learning Robust Visual Features without Supervision* (2023). [arXiv:2304.07193](https://arxiv.org/abs/2304.07193).
- Ravi et al. *SAM 2: Segment Anything in Images and Videos* (2024). [Meta SAM 2](https://ai.meta.com/sam2/).
- Yang et al. *Depth Anything V2* (2024). [Project page](https://depth-anything-v2.github.io/).
- Fu et al. *BLINK: Multimodal Large Language Models Can See but Not Perceive* (2024). [arXiv:2404.12390](https://arxiv.org/abs/2404.12390).
- Tong et al. *Eyes Wide Shut? Exploring the Visual Shortcomings of Multimodal LLMs* (MMVP, 2024). [arXiv:2401.06209](https://arxiv.org/abs/2401.06209).
- Yao et al. *ReAct: Synergizing Reasoning and Acting in Language Models* (2022). [arXiv:2210.03629](https://arxiv.org/abs/2210.03629).
- Yao et al. *Tree of Thoughts: Deliberate Problem Solving with Large Language Models* (2023). [arXiv:2305.10601](https://arxiv.org/abs/2305.10601).
- Sutton, Precup & Singh. *Between MDPs and Semi-MDPs: A Framework for Temporal Abstraction* (1999). [PDF](https://people.cs.umass.edu/~barto/courses/cs687/Sutton-Precup-Singh-AIJ99.pdf).
- Pan et al. *The Effects of Reward Misspecification: Mapping and Mitigating Misaligned Models* (2022). [arXiv:2201.03544](https://arxiv.org/abs/2201.03544).
- Skalse et al. *Defining and Characterizing Reward Hacking* (2022). [arXiv:2209.13085](https://arxiv.org/abs/2209.13085).
