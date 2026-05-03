---
title: "The State of Robotics in 2026: A Citation-Grounded Survey of Research and Companies"
author: Dendi Suhubdy
pubDatetime: 2026-05-03T08:00:00Z
featured: false
draft: false
tags:
  - robotics
  - vla
  - vision-language-action
  - imitation-learning
  - reinforcement-learning
  - humanoids
  - manipulation
  - locomotion
  - foundation-models
  - diffusion-policy
  - aloha
  - openvla
  - pi-zero
  - rt-x
  - iclr
  - icml
  - neurips
  - corl
  - rss
  - icra
  - science-robotics
  - figure-ai
  - tesla-optimus
  - boston-dynamics
  - unitree
  - physical-intelligence
description: "A citation-grounded survey of robotics research as it stands in May 2026 — VLA foundation models (RT-2, OpenVLA, π0, π0.5, Helix, Gemini Robotics), imitation-learning architectures (Diffusion Policy, ACT/ALOHA, RDT-1B), cross-embodiment data (Open X-Embodiment, DROID), whole-body humanoid control (HOVER, ASAP, OmniH2O), reward design with LLMs (Eureka, DrEureka), world models for robotics (Cosmos, Genie, 1X), simulators (Isaac Lab, Genesis, RoboCasa), and the company landscape (Figure, Tesla, Boston Dynamics, Apptronik, Agility, 1X, Unitree, Physical Intelligence, Skild AI, XPENG, UBTECH, Fourier). With venue-by-venue references from ICLR, ICML, NeurIPS, CoRL, RSS, ICRA, and Science Robotics."
---

There are two things happening in robotics simultaneously, and the academic and industrial sides of the field are not yet on the same page about how to reconcile them.

The first is the foundation-model takeover. The vision-language-action (VLA) paradigm — train a large transformer or diffusion model on millions of teleoperated trajectories pooled across embodiments and call it the policy — has eaten the field over the last twenty-four months. Google's RT-1 was the first proof of concept in late 2022. RT-2 added internet-scale vision-language pretraining at CoRL 2023. Open X-Embodiment pooled twenty-two robots and sixty datasets into one corpus and trained RT-X at ICRA 2024 (best paper). Octo (RSS 2024) and OpenVLA (CoRL 2024) made the recipe open-source. Physical Intelligence's π0 (October 2024) and π0.5 (April 2025) showed the recipe scales to bimanual mobile manipulation in unseen homes. Figure released Helix in February 2025 and DeepMind released Gemini Robotics in March 2025. The architectural debate is over. Everyone is training a VLA.

The second is the humanoid arms race. Boston Dynamics retired hydraulic Atlas and shipped electric Atlas in April 2024. Tesla showed Optimus Gen 2 in December 2023 and has been iterating publicly since. Figure raised \$675M at \$2.6B in February 2024 and unveiled the Figure 03 home humanoid in October 2025. 1X opened Neo preorders in October 2025 and sold out first-year capacity in five days. Unitree put a humanoid (G1) on sale for \$16,000 starting at ICRA 2024. Apptronik raised \$350M in February 2025 (extended to \$415M in March 2025 with Mercedes-Benz, Japan Post Capital, and ARK Invest). Physical Intelligence raised \$400M at \$2.4B in November 2024 and another \$600M at \$5.6B in November 2025 (CapitalG-led), bringing total raised to \$1.1B. Skild AI went from \$300M Series A at \$1.5B in July 2024 to \$1.4B Series C at \$14B in January 2026 (SoftBank-led, with NVentures, Bezos Expeditions, Samsung, LG, Schneider Electric joining). Agility's Digit is doing live tote-handling at GXO warehouses under contract. XPENG announced Iron in November 2024 and several Chinese makers (UBTECH, Fourier, Booster, EngineAI, LimX) followed.

The disconnect is this: the foundation-model story comes mostly from research labs working with bimanual tabletop manipulators (the Aloha-style 7-DoF arms) where the data-collection physics are tractable. The humanoid story comes from companies who need bipedal locomotion to work *and* dexterous manipulation to work *and* a whole-body controller to glue them together — which is a much harder problem and which today is solved mostly by classical model-predictive control plus learned residual policies, not by a single VLA. There is a research thread (HOVER, ASAP, OmniH2O) explicitly trying to merge the two. It is the most important open problem in the field.

This survey is organized around eleven clusters: (1) the VLA paradigm, (2) imitation-learning architectures, (3) cross-embodiment pretraining, (4) whole-body humanoid control, (5) reward design and sim-to-real, (6) data acquisition, (7) world models for robotics, (8) simulators and benchmarks, (9) LLM-grounded planning, (10) the company landscape, and (11) what didn't work. I'll be opinionated about which directions are paying off and which are wasted compute.

A few framing claims:

1. **The action representation is converging on flow matching / diffusion over chunks**, not autoregressive next-token. Diffusion Policy (Chi et al., RSS 2023), ACT (Zhao et al., RSS 2023), π0's flow-matched action expert, and RDT-1B (ICLR 2025) all share this insight: predict the next 10–50 actions as a single chunk, denoise it. Autoregressive RT-2-style discretized actions are now considered a transitional architecture.
2. **Cross-embodiment pretraining works**, but the lift is smaller than the marketing implies. RT-X showed 50%+ improvements on in-distribution embodiments in the corpus. OpenVLA-OFT and Crossformer (CoRL 2024) confirm the benefit but also show that fine-tuning on the target embodiment recovers most of the performance you'd get from training on it from scratch.
3. **Sim-to-real for locomotion is mostly solved; sim-to-real for contact-rich manipulation is mostly not**. The locomotion side has converged on PPO + domain randomization in Isaac Gym/Lab and works robustly across hardware. The manipulation side still mostly requires real-world data because contact dynamics are not modeled accurately enough in any current simulator.

---

## Table of contents

---

## 1. The VLA paradigm

The vision-language-action lineage starts with **BC-Z** [Jang, Irpan, Khansari, Kappler, Ebert, Lynch, Levine, Finn; CoRL 2021] and **Gato** [Reed et al., DeepMind, 2022; [arXiv:2205.06175](https://arxiv.org/abs/2205.06175)] but really begins as a research program with **RT-1** [Brohan, Brown, Carbajal, Chebotar, Dabis, Finn, Gopalakrishnan, Hausman et al.; RSS 2023; [arXiv:2212.06817](https://arxiv.org/abs/2212.06817)]. RT-1 took 130k teleoperated episodes across 700+ tasks on a fleet of Everyday Robots manipulators and trained a 35M-parameter transformer that maps language + image → discretized actions. The headline result was that scaling along the data axis kept improving generalization to new tasks, distractors, and backgrounds.

**RT-2** [Brohan et al.; CoRL 2023; [arXiv:2307.15818](https://arxiv.org/abs/2307.15818)] is the first VLA proper. They take a frozen vision-language model (PaLI-X or PaLM-E backbone), tokenize end-effector deltas as text tokens, and co-finetune on robotic trajectories and internet-scale VL data. The result transfers semantic generalization that the robot has never seen in robot data — it can pick up "the extinct animal" or "the can to use as a hammer" because the VL backbone knows what those mean.

**Open X-Embodiment / RT-X** [Padalkar, Pooley et al.; ICRA 2024 best paper; [arXiv:2310.08864](https://arxiv.org/abs/2310.08864)] pools 22 embodiments and 60 datasets (1M+ trajectories) into a single corpus and trains a single policy. The five-fold improvement over single-embodiment baselines is the headline; the more important finding is that *data sharing across embodiments is positive-sum*, contradicting a long-running concern that mixing morphologies would hurt rather than help.

**Octo** [Octo Model Team: Ghosh, Walke, Pertsch, Black, Mees, Dasari, Hejna, Kreiman, Xu et al.; RSS 2024; [arXiv:2405.12213](https://arxiv.org/abs/2405.12213)] is the first fully open-weight generalist VLA. 800k episodes, transformer backbone, diffusion action head. The key engineering decision is that observations and actions are flexible inputs (the model accepts proprio, wrist cam, third-person cam in any combination) so it can fine-tune onto any robot.

**OpenVLA** [Kim, Pertsch, Karamcheti, Xiao, Balakrishna, Nair, Rafailov, Foster, Lam, Sanketi, Vuong, Kollar, Burchfiel, Tedrake, Sadigh, Levine, Liang, Finn; CoRL 2024; [arXiv:2406.09246](https://arxiv.org/abs/2406.09246)] takes Llama 2 7B + DINOv2 + SigLIP and fine-tunes on the full Open X-Embodiment corpus. Open weights, open data, open training code. As of mid-2025 it is the most-used research baseline in the field. The follow-up **OpenVLA-OFT** (One-shot Fine-Tuning, late 2024) reduces the data needed for new-task adaptation by 10x by fine-tuning only the action expert.

**π0 (Pi-Zero)** [Black, Brown, Driess, Esmail, Equi, Finn, Fusai, Hejna, Itkina, Lachman, Levine, Liu, Mees, Pertsch, Walke et al.; Physical Intelligence; 2024; [arXiv:2410.24164](https://arxiv.org/abs/2410.24164)] is the first VLA that visibly works at the level a customer would care about. PaliGemma backbone + flow-matched action expert, trained on a large internal corpus of mobile bimanual manipulation. The video reel — folding laundry, bussing tables, packing groceries, assembling boxes — is the most impressive sustained dexterous-manipulation demo published as of 2025.

**π0.5** [Physical Intelligence team; April 2025; [arXiv:2504.16054](https://arxiv.org/abs/2504.16054)] adds explicit *open-world* generalization: tested in homes the robot has never seen. The architectural changes are minor (better web-scale co-training, autoregressive high-level "subtask" tokens consumed by the flow-matching low-level action expert); the data change — diversifying across hundreds of physical environments — is what matters.

**Helix** (Figure AI, February 2025) is Figure's proprietary VLA. It's the first VLA to output high-rate continuous control of the entire humanoid upper body — wrists, torso, head, and individual fingers — and the first to run two robots cooperatively on a shared long-horizon task. Architecturally it's a two-system stack: a slower internet-pretrained VLM "System 2" handles scene understanding and language; a fast visuomotor policy "System 1" emits control at 200Hz from S2's latent guidance. Helix runs entirely onboard low-power embedded GPUs. Two-system VLAs of this kind have become the dominant architecture for humanoids in 2025–2026.

**Gemini Robotics / Gemini Robotics-ER** (DeepMind, March 12, 2025) ports Gemini 2.0 to robot control. The "ER" variant focuses on embodied reasoning — pointing, trajectory prediction, multi-view spatial reasoning — and is released as an API. DeepMind announced Apptronik as the launch hardware partner. The successor **Gemini Robotics 1.5** (later in 2025) added agentic multi-step planning, and **Gemini Robotics-ER 1.6** (April 2026) further sharpened the reasoning side. Gemini Robotics is the first VLA shipped as a foundation-model API rather than as a paper.

**RDT-1B** [Liu, Chen, Bai, Li, Lin, Mu, Lu, Yu, Tan; ICLR 2025; [arXiv:2410.07864](https://arxiv.org/abs/2410.07864)] is the largest open-weight diffusion transformer for bimanual manipulation (1.2B parameters). Pretrained on multi-robot data, fine-tuned on a self-collected ALOHA-2 corpus. As of late 2025 it is the best-performing open VLA on ALOHA-style tasks, beating OpenVLA on most tabletop bimanual benchmarks.

**HPT (Heterogeneous Pretrained Transformers)** [Wang, Xian, Held, Agrawal, Tedrake; NeurIPS 2024; [arXiv:2409.20537](https://arxiv.org/abs/2409.20537)] reframes the VLA as a stem-trunk-head architecture: per-embodiment "stem" tokenizers, a shared "trunk" transformer, per-embodiment "head" decoders. Pretraining the trunk on heterogeneous data (52 datasets, 200k trajectories) gives a clean transfer story. HPT is the most academically rigorous of the cross-embodiment papers — the scaling laws section is the load-bearing contribution.

**Crossformer** [Doshi, Walke, Mees, Dasari, Levine; CoRL 2024; [arXiv:2408.11812](https://arxiv.org/abs/2408.11812)] generalizes Octo across morphologies — one transformer that controls a single-arm manipulator, a bimanual rig, a quadruped, and a wheeled navigation robot. Same architecture, different output heads.

The argumentative claim that VLAs change the field rests on three things: (a) data scaling appears to give nontrivial returns past 1M trajectories, (b) language-conditioned generalization to unseen objects and tasks is now reproducible, and (c) cross-embodiment transfer is positive-sum at moderate scale. The *un*resolved question is whether VLAs scale to dexterous, contact-rich, long-horizon tasks like cable assembly, fastening, or fine kitchen work — π0.5 begins to push into that regime, but the verdict is open.

---

## 2. Imitation-learning architectures

Underneath the VLA story, the action-prediction architectures have stabilized into two dominant designs and one that is fading.

**Diffusion Policy** [Chi, Feng, Du, Xu, Cousineau, Burchfiel, Song; RSS 2023; [arXiv:2303.04137](https://arxiv.org/abs/2303.04137); IJRR 2024 extended] predicts an action chunk via a denoising diffusion model conditioned on observation history. Receding-horizon execution: predict the next 16 steps, execute the next 8, replan. The headline result was a state-of-the-art success rate on 15 manipulation benchmarks, but the *architectural* claim — that multi-modal action distributions are better captured by diffusion than by L2 regression or by mixture-of-Gaussians — is what shaped the field. Almost every subsequent imitation-learning paper uses a diffusion or flow-matching action head.

**3D Diffusion Policy** [Ze, Yan, Wu, Macaluso, Ge, Ye, Hansen, Li, Wang; RSS 2024; [arXiv:2403.03954](https://arxiv.org/abs/2403.03954)] adds a sparse 3D point-cloud encoder to Diffusion Policy. iDP3 (improved 3D Diffusion Policy) follows. The 3D variant is cleaner for mobile manipulation in unseen environments because the policy doesn't have to learn camera intrinsics or scene-specific 2D priors.

**3D Diffuser Actor** [Ke, Gkanatsios, Fragkiadaki; CoRL 2024; [arXiv:2402.10885](https://arxiv.org/abs/2402.10885)] denoises in SE(3) directly — the policy predicts a sequence of end-effector poses in the rigid-body group, not in joint space. State-of-the-art on RLBench (16% absolute improvement over prior work) and CALVIN.

**ACT (Action Chunking Transformer)** [Zhao, Kumar, Levine, Finn; RSS 2023; [arXiv:2304.13705](https://arxiv.org/abs/2304.13705)] is the architecture that powers ALOHA. A conditional VAE transformer that predicts action chunks; the "chunking" insight is that predicting many actions at once smooths out compounding error from per-step prediction. ACT and Diffusion Policy converged on the same insight (chunked actions) from different theoretical motivations.

**ALOHA Unleashed** [Zhao, Tompson et al., Google DeepMind; CoRL 2024; [arXiv:2410.13126](https://arxiv.org/abs/2410.13126)] scales ACT-style imitation to harder bimanual tasks: tying shoelaces, hanging shirts, fitting gears. The data-scaling experiments are the most useful part: success rate climbs roughly logarithmically with demonstration count up to ~26k episodes per task, suggesting we are not yet in the saturation regime.

**Q-Transformer** [Chebotar, Vuong, Hausman, Xia, Lu et al.; CoRL 2023] is the autoregressive-action thread that has mostly *not* won. They tokenize each action dimension as a separate vocabulary element and train a Q-function with a transformer. Performs well; but the architecture has not been adopted by the larger community because the chunked-diffusion approach is more sample-efficient.

**FAST (Frequency-domain Action Sequence Tokenization)** [Pertsch, Belkhale et al.; Physical Intelligence; 2025; [arXiv:2501.09747](https://arxiv.org/abs/2501.09747)] is the autoregressive comeback: instead of tokenizing per-dimension per-step, take a DCT of the action chunk and tokenize the frequency coefficients. This compresses an action chunk by 4–8× and lets autoregressive VLAs match diffusion-action VLAs in throughput and accuracy. π0-FAST is now the autoregressive variant of π0.

**iDP3** (Improved 3D Diffusion Policy, Ze et al., 2025) is what currently powers the academic mobile-manipulation research stack — Stanford's mobile platforms, several Tsinghua humanoid demos.

If you wanted to start a new robotics project today, the conventional wisdom is: diffusion or flow-matching action chunks, transformer trunk, vision encoder pretrained on web data (DINOv2, SigLIP, or CLIP), and either OpenVLA or π0 weights as initialization. This recipe is now boring.

---

## 3. Cross-embodiment data and pretraining

The data side of the field is where the most interesting infrastructural work is happening.

**Open X-Embodiment** [Padalkar et al.; ICRA 2024; [arXiv:2310.08864](https://arxiv.org/abs/2310.08864)] is the foundational corpus. 22 embodiments, 60 datasets, ~1M trajectories, ~500 skills, 22 institutions. A flat trajectory format (RLDS) that anyone can write to. The 2025 v2 release adds another ~30 datasets including a large humanoid subset.

**DROID** [Khazatsky, Pertsch, Nair, Bharadhwaj, Dasari, Karamcheti et al.; RSS 2024; [arXiv:2403.12945](https://arxiv.org/abs/2403.12945)] is a 76k-episode bimanual manipulation dataset collected over 12 months at 13 institutions on a standardized rig (Franka + ZED stereo + iPhone wrist cams). Importantly, DROID is *in-the-wild* — kitchens, offices, classrooms, hallways — not in-lab. The dataset is the load-bearing part; the paper's policy results are secondary.

**LIBERO** [Liu, Mahapatra, Holmes, Mandlekar, Garg, Stone; NeurIPS 2023; [arXiv:2306.03310](https://arxiv.org/abs/2306.03310)] is the standard benchmark for lifelong / continual robot learning. Four task suites (Spatial, Object, Goal, 100), each with 10 tasks, used as the de-facto evaluation harness for OpenVLA, Octo, RDT-1B, π0, and most academic VLAs.

**RoboCasa** [Nasiriany, Maddukuri, Zhang, Parikh, Lo, Joshi, Mandlekar, Zhu; RSS 2024; [arXiv:2406.02523](https://arxiv.org/abs/2406.02523)] is a large-scale simulation kitchen environment built on Robosuite + MuJoCo with 100+ generated procedural kitchens, 2.5k+ 3D assets, and 100 task definitions. The MimicGen pipeline auto-generates demos from a small seed of human demonstrations. Used as the simulation half of a sim+real fine-tuning pipeline.

**BEHAVIOR-1K** [Li, Xia, Srivastava et al., Stanford; CoRL 2023; benchmark paper revised 2024] is 1,000 long-horizon household tasks defined as preconditions and goal states in a logical formalism (BDDL), instantiated in OmniGibson. The aspirational benchmark for embodied agents — most current methods solve only a single-digit percentage of tasks.

**ARIO (All Robots in One)** [DataComp-style robot data effort, 2024–2025] is the second-generation effort to standardize cross-embodiment data formats with stricter quality controls. As of 2026 it is the leading candidate for OXE-v2.

The cross-embodiment data argument has settled around a specific empirical claim: pretraining on diverse data + fine-tuning on the target embodiment beats training on the target embodiment alone, *provided* the diverse corpus covers the target morphology family. A single-arm policy benefits from other single-arm data; transfer to bimanual or to mobile rigs is much weaker. This nuance is missing from most marketing-grade discussions of "general-purpose robot foundation models."

---

## 4. Whole-body humanoid control

This is the cluster that has changed the most in the last twelve months. A year ago, humanoid whole-body control was mostly pure RL in simulation with hand-designed rewards. As of mid-2025, the dominant pattern is *teacher–student distillation* — train a privileged-information teacher in simulation with PPO, then distill into a vision/proprio-only student that runs on the real robot — augmented by *real-world teleoperation* as the bridge to dexterous manipulation.

**HOVER** [He, Yuan, Xu, Yang, Wang, Liu, Wang, Sun, Bonatti, Cui, Vahdat, Fox, Kang, Lin, Zhu; NVIDIA; 2024; [arXiv:2410.21229](https://arxiv.org/abs/2410.21229)] trains a single neural humanoid controller that supports many control modes (root velocity, root pose, joint targets, end-effector targets) by masking different parts of the goal vector during PPO training. The same policy can then be commanded by an MPC stack, by a VLA, or by teleoperation. This unification eliminates the previous mess of one-policy-per-control-mode.

**ASAP (Aligning Simulation and Real Physics)** [He, Cui, Tang, Bonatti, Zhu, Xie, Garg, Fox; NVIDIA; 2025; [arXiv:2502.01143](https://arxiv.org/abs/2502.01143)] addresses the persistent sim-to-real gap for humanoid agility. Instead of ever-larger domain randomization, ASAP fine-tunes the simulator's residual dynamics to match real-world rollouts. The result is a humanoid policy that does kicks, jumps, and Cristiano Ronaldo–style poses on real Unitree G1 hardware. It is the single most viral humanoid demo of 2025 and the methodology is now widely copied.

**OmniH2O** [He, Luo, Xiao, Tang, Liang, Wang, Li, Garg, Fox; CoRL 2024; [arXiv:2406.08858](https://arxiv.org/abs/2406.08858)] is universal teleoperation for humanoids — VR-headset commands map to whole-body humanoid motion through a learned RL policy, with a separate learned manipulation policy for the hands. OmniH2O is what the academic-side humanoid teleop pipelines are mostly built on.

**Humanoid-Gym / HumanoidVerse** [Gu, Wang et al., 2024] are the two open simulation/training stacks for humanoids that the field has converged on. Both are Isaac Lab–based, both ship with Unitree H1, G1, and Booster T1 templates.

**Robot Parkour Learning** [Zhuang, Fu, Wang, Atkeson, Schwertfeger, Finn, Zhao; CoRL 2023; [arXiv:2309.05665](https://arxiv.org/abs/2309.05665)] established the teacher-student distillation recipe for legged locomotion on a Unitree A1 quadruped. **Extreme Parkour** [Cheng, Shi, Agarwal, Pathak; ICRA 2024] extends this to a bipedal robot. **ANYmal Parkour** [Hoeller, Rudin, Sako, Hutter; *Science Robotics*, 2024] is the publication that legitimized parkour-style maneuvers in a top-tier journal.

**Humanoid Locomotion as Next Token Prediction** [Radosavovic, Xiao, Zhang, Darrell, Malik; ICML 2024; [arXiv:2402.19469](https://arxiv.org/abs/2402.19469)] reframes humanoid locomotion as a sequence-modeling problem on motion-capture data. Trained with a causal transformer on a mix of mocap, mocap-to-sim retargeted data, and real-robot rollouts. Walks Berkeley's bipedal H1 around campus zero-shot.

**Walking by Watching** [Chen, Cheng, Pathak, Gupta, Wang; 2024] takes humanoid teaching from internet video — humans walking — and uses it as a prior for whole-body humanoid policies.

**HumanPlus** [Fu, Xie, Niu, Liu, Niu, Zhao, Zhu, Liu, Sadigh, Fei-Fei, Finn; CoRL 2024; [arXiv:2406.10454](https://arxiv.org/abs/2406.10454)] does whole-body shadowing — a Unitree H1 humanoid mirrors a human's pose in real time, captured by a single RGB camera. The point of the paper is the data pipeline (sim-trained shadow controller + hand teleop) more than the demos.

**GR00T N1** [NVIDIA; GTC March 2025; [arXiv:2503.14734](https://arxiv.org/abs/2503.14734)] is NVIDIA's open foundation model for humanoid robots. It follows the System-1 / System-2 architecture of Helix: a slow VLM "thinker" interprets the scene and language; a fast diffusion-transformer "actor" emits real-time motor commands. Trained in Isaac Lab with synthetic data generated by Cosmos plus real demonstrations from a small humanoid fleet. Early access partners announced at launch: Agility Robotics, Boston Dynamics, Mentee Robotics, NEURA Robotics. Jensen demoed N1 powering a 1X humanoid live at GTC. The first open humanoid foundation model with major-vendor sponsorship.

The honest assessment of humanoid whole-body control as of May 2026: locomotion on flat ground is solved, agile locomotion (parkour, recovery) works in research videos and is becoming reliable on hardware, and full whole-body coordination of locomotion + dexterous manipulation in unstructured environments is *not* solved. The leading industrial labs (Figure, Tesla, Boston Dynamics, Apptronik, 1X) are all running locomotion as a separate controller from manipulation, with the VLA controlling the manipulation side and a learned MPC-style controller handling the legs.

---

## 5. Reward design and sim-to-real

The reinforcement-learning side of robotics had a quiet two years before Eureka.

**Eureka** [Ma, Liang, Wang, Huang, Bastani, Jayaraman, Zhu, Fan, Anandkumar; ICLR 2024; [arXiv:2310.12931](https://arxiv.org/abs/2310.12931)] uses GPT-4 to generate reward functions for RL tasks — feed in the environment code, generate a population of candidate rewards, evolve toward higher fitness. Beats human-designed rewards on 29 of 29 tasks across Isaac Gym and Bidexterous Manipulation suites. This is the most-cited paper on LLM-assisted robotics from the 2023–2024 cycle.

**DrEureka** [Ma, Patel, Tao, Wang, Bastani, Jayaraman, Zhu, Anandkumar; RSS 2024; [arXiv:2406.01967](https://arxiv.org/abs/2406.01967)] extends Eureka to *domain-randomization-parameter* generation — the LLM also synthesizes the sim-to-real DR distribution. Trains a quadruped to balance on a yoga ball as the headline demo.

**HiL-SERL (Human-in-the-Loop Sample-Efficient Robot Learning)** [Luo, Xu, Chebotar, Schmidhuber, Levine; 2024; [arXiv:2410.21845](https://arxiv.org/abs/2410.21845)] is the strongest case for *real-world* RL on physical robots in 2024–2025. With small amounts of human-corrective intervention, RL fine-tunes contact-rich tasks (USB insertion, peg-in-hole, cable routing) to ~100% success in 1–3 hours of real-world training. The argument is that bare imitation learning hits a ceiling on contact-rich tasks and only on-robot RL closes the gap.

**SERL / EfficientImitate / Residual Reinforcement Learning** are the family of techniques where a base policy (imitation) is fine-tuned by a small amount of real-world RL. Almost everyone shipping a real robot ends up using something in this family.

**Q-Chunking / Behavior Transformer / V-D4RL** are the offline-RL-on-robot-data threads — train Q-functions on logged teleoperation data, use them as critics for fine-tuning. As of 2025 the offline RL approach has not paid off as much as the imitation+real-RL stack.

For sim-to-real the operating consensus is: PPO + domain randomization for locomotion, teacher-student distillation for legged-with-vision, real-world data for contact-rich manipulation, and ASAP-style residual sim-correction when neither pure sim nor pure real data are sufficient.

---

## 6. Data acquisition: how to actually get the data

A persistent problem in robotics is that the data does not exist. Internet-scale text exists. Internet-scale images exist. Robot trajectories on the morphology you care about almost always do not. This is the binding constraint on the field, and the research has shifted to make data collection cheaper.

**ALOHA** [Zhao, Kumar, Levine, Finn; RSS 2023; [arXiv:2304.13705](https://arxiv.org/abs/2304.13705)] is a \$20k bimanual teleoperation rig with leader-follower joint-copying — the operator's two arms drive the robot's two arms. Open-source CAD, BoM, and software. ALOHA shifted academic robot-data collection from cumbersome VR-headset rigs to direct kinesthetic teleoperation. ALOHA-2 (2024) and the commercial ALOHA-style rigs (ARX, Fluent) are the descendants.

**Mobile ALOHA** [Fu, Zhao, Finn; CoRL 2024; [arXiv:2401.02117](https://arxiv.org/abs/2401.02117)] adds a mobile base. The wheeled chassis is the difference — bimanual mobile manipulation lets the policy handle long-horizon tasks (cooking shrimp, calling an elevator, wiping wine spills) that pure tabletop ALOHA cannot.

**Universal Manipulation Interface (UMI)** [Chi, Xu, Pan, Cousineau, Burchfiel, Feng, Tedrake, Song; RSS 2024; [arXiv:2402.10329](https://arxiv.org/abs/2402.10329)] is the most clever of the data-collection papers. A handheld gripper with a GoPro mounted on top — a human picks it up, performs the task with their hand directly, and the trajectory is later mapped to a real robot. No teleoperation, no robot hardware needed during data collection. The key engineering trick is the SLAM-based pose recovery from the GoPro alone.

**DexCap** [Wang, Chen, Yan, Li, Zhang, Wang, Li, Tedrake, Song; RSS 2024; [arXiv:2403.07788](https://arxiv.org/abs/2403.07788)] does the same idea for dexterous manipulation — a wearable hand-tracking glove + camera rig for collecting human-hand demonstrations that map to a robot multi-finger hand.

**HumanPlus** (already discussed in §4) collects data from human motion-capture + RGB and uses it as policy initialization for humanoids.

**MimicGen** [Mandlekar, Nasiriany, Wen, Akinola, Balakrishna, Mees, Fan, Zhu; CoRL 2023; [arXiv:2310.17596](https://arxiv.org/abs/2310.17596)] generates synthetic robot demonstrations by replaying small numbers of human demonstrations in many environment variations in simulation. Used to inflate small datasets 100x.

**DexMimicGen** [Jiang, Mandlekar, Sundaresan, Akinola, Balakrishna, Fan, Zhu; ICRA 2025] extends MimicGen to dexterous bimanual humanoid hands.

The argument that emerges from this cluster: data collection for real robots is converging on a hybrid pipeline — small numbers of high-quality real demonstrations (UMI / DexCap / ALOHA), inflated by MimicGen-style synthesis in simulation, augmented by sim-to-real transfer for the morphologies (locomotion, parkour) where simulators are good enough. Pure sim is too unrealistic for contact; pure real is too expensive.

---

## 7. World models for robotics

World models are the sleeper hit of the 2025 cycle. The thesis is that if you can learn a generative video model good enough to predict the future from an action sequence, you can plan in latent space, augment data with synthetic rollouts, and do model-based RL where reward shaping has historically failed.

**DreamerV3** [Hafner, Pasukonis, Ba, Lillicrap; *Nature* 2025; [arXiv:2301.04104](https://arxiv.org/abs/2301.04104)] is the longstanding world-model RL line that finally landed in Nature. Single configuration, no per-task tuning, masters Minecraft Diamond from pixels. The robotics relevance is methodological: it is the most credible large-scale demonstration that world-model planning beats model-free PPO when reward is sparse.

**Cosmos World Foundation Models** [NVIDIA; 2025; [arXiv:2501.03575](https://arxiv.org/abs/2501.03575)] is the largest publicly-released action-conditioned video world model, trained on 20M hours of driving / robot / human-activity video. Released as open weights for derivative work, with a focus on synthetic-data generation for embodied AI. Cosmos is now the standard upstream for synthetic robot video.

**Genie 2** (DeepMind, December 2024) is an action-conditioned world model that generates 3D scenes consistent with a player's input commands. Less directly applicable to robotics than Cosmos but has had outsized influence on the framing of "neural simulator" as a research direction.

**1X World Model** (1X Technologies, late 2024) is a humanoid-specific action-conditioned video model. Trained on 100k+ hours of internal Neo teleoperation footage; used internally for evaluating policies before real-robot deployment, since on-policy evaluation on humanoid hardware is expensive and damaging.

**UniSim / RoboDreamer / Diffusion Forcing** are the academic threads on action-conditioned video for robot data. None has yet shown that world-model–based policy improvement beats well-tuned imitation+RL on real hardware, but the data-augmentation case — train a VLA on a mix of real and world-model-generated trajectories — is increasingly empirically positive.

**iVideoGPT** [Wu, Yang, Li, Sun, Long; NeurIPS 2024] and **AVID (Action-Conditioned Video Diffusion)** are the cleanest academic reference points on the methodology side.

The hard question is: does world-model data augmentation actually unlock new capabilities or is it an expensive way to wash existing data? As of 2026 the answer is: it helps modestly in benchmarks but no one has a clean ablation showing it strictly dominates the alternative of just collecting more real data.

---

## 8. Simulators and benchmarks

The simulator stack stabilized in 2024–2025. Five tools dominate:

**Isaac Lab** (NVIDIA, 2024) replaced the older Isaac Gym as NVIDIA's robotics RL stack. Built on Isaac Sim / Omniverse with a clean Python API; ships the Unitree, Boston Dynamics, Booster, Apptronik humanoid templates. The default RL training environment for humanoid locomotion in 2025.

**Genesis** (Genesis Authors; December 2024) is a unified, fully Python physics engine that claims 43M FPS on a single RTX 4090 — 10–80× faster than Isaac Gym, ~430,000× real-time — with native support for rigid bodies, MPM solids, fluids, cloth, and tactile contact in one differentiable engine, and a generative data pipeline that turns natural-language prompts into 4D scenes. The engineering is genuinely impressive; the practical adoption has been slower than the marketing implies because Isaac Lab has the broader ecosystem.

**Newton** (NVIDIA + Google DeepMind + Disney Research, announced GTC March 2025) is the new joint open-source physics engine, built on NVIDIA Warp and OpenUSD and managed under the Linux Foundation. Differentiable, GPU-accelerated, and explicitly aimed at closing the contact-dynamics sim-to-real gap. Disney is using it to power its expressive BDX entertainment robots; NVIDIA's GR00T N1 training pipeline incorporates it; Google DeepMind contributes from MuJoCo. As of CoRL 2025 the broader release happened. If Newton matures it is the first credible attempt at a single, vendor-neutral physics standard for robotics.

**MuJoCo MPC** [Howell, Cuignet, Erez et al.; DeepMind; 2022 onward] continues to be the trajectory-optimization backbone for many academic groups. MuJoCo 3.x adds GPU acceleration and is now competitive with Isaac for medium-scale problems.

**ManiSkill3** [Tao, Mu, Tang et al.; UCSD; 2024] is the GPU-parallelized successor to ManiSkill2, focused on dexterous and multi-finger manipulation with photorealistic rendering. The fastest open simulator for hand-scale tasks.

**RoboCasa** (already covered in §3) is the standard kitchen environment.

**LeRobot** (Hugging Face, 2024–2025) is the meta-framework — not a simulator but a library that wraps simulators, real robots (so100, Koch, ARX, Aloha, Unitree), data formats, and policy implementations (Diffusion Policy, ACT, OpenVLA, π0). The de-facto Python entry point for academic robotics work.

The benchmarking story is more contested. There are too many benchmarks (LIBERO, RoboCasa, BEHAVIOR-1K, ManiSkill, RLBench, MetaWorld, Robosuite, Isaac Tasks, OmniGibson). The field's increasing convergence is on (a) LIBERO + RoboCasa for tabletop and kitchen manipulation, (b) Isaac Lab humanoid templates for locomotion, (c) BEHAVIOR-1K for aspirational long-horizon. Real-world evaluation is irreducibly necessary for any policy paper that claims practical utility.

---

## 9. LLM-grounded planning and skill libraries

The 2022–2023 thread of "use an LLM as the planner, ground its outputs into robot actions" is now mostly absorbed into the VLA story but a few specific designs from this cluster are still load-bearing.

**SayCan** [Ahn, Brohan, Brown, Chebotar, Cortes, David, Finn et al.; CoRL 2022; [arXiv:2204.01691](https://arxiv.org/abs/2204.01691)] is the original LLM-as-planner paper — affordance-grounded language models pick from a discrete library of skills.

**Code as Policies** [Liang, Huang, Xu, Hausman, Xia, Sermanet, Nair, Hausman, Florence, Zeng et al.; ICRA 2023; [arXiv:2209.07753](https://arxiv.org/abs/2209.07753)] generates Python code that calls perception and motion-planning APIs. The programmatic grounding holds up better than free-form planning because the code is checkable.

**VoxPoser** [Huang, Wang, Mees, Kollar, Goldberg, Hausman, Held, Florence, Liang, Levine; CoRL 2023; [arXiv:2307.05973](https://arxiv.org/abs/2307.05973)] uses LLMs and vision-language models to extract value maps in 3D voxel space from natural-language commands, then runs motion planning against the value maps. No fine-tuning, fully zero-shot.

**ReKep (Relational Keypoint Constraints)** [Huang, Chen, Yu, Mees, Kollar, Hausman, Levine, Liang; CoRL 2024; [arXiv:2409.01652](https://arxiv.org/abs/2409.01652)] is the most influential 2024 paper in this thread. A VLM generates spatio-temporal constraints over keypoints (e.g., "the lid stays parallel to the cup throughout pouring"), and an MPC solver enforces them. Cleanly mixes high-level VLM reasoning with low-level optimization.

**MOKA / SuSIE / DynaCon** are the related "VLM-decides-keypoints, MPC-runs-motion" papers from 2024.

The honest take on this cluster: end-to-end VLAs (RT-2, OpenVLA, π0) are eating the LLM-as-planner story for reactive manipulation, but for long-horizon planning + tool use + multi-step recovery the LLM-as-planner-of-skill-library approach is still meaningfully better. The open production systems (Sanctuary's Carbon, Apptronik's Apollo control stack) are mostly hierarchical: an LLM at the top, learned skills below.

---

## 10. The company landscape

Robotics in 2026 is dominated by four categories of company:

### 10.1 Humanoid hardware and integration

**Boston Dynamics** — The veteran. Acquired by Hyundai in 2021. Atlas (electric, since April 2024) is the flagship humanoid; Spot (quadruped) and Stretch (warehouse case-handler) are the commercial products. Spot has been deployed in industrial inspection at hundreds of sites globally. Boston Dynamics is the only company with a credible 30-year track record on legged robotics, but it is not the leader in the AI/VLA stack — the AI Institute (Marc Raibert's separate effort) and external partners do most of the foundation-model work.

**Tesla** (Optimus). Gen 2 demonstrated December 2023; Gen 3 reportedly in pilot internal use at Fremont. Tesla's strategy is to vertically integrate hardware and the "FSD-for-humanoids" stack on the same Dojo / HW5 silicon. Most credible competitor to Figure on the integration story; least transparent on technical capability.

**Figure AI** — \$675M Series B in February 2024 at \$2.6B post; investors include Microsoft, NVIDIA, OpenAI Startup Fund, Bezos Expeditions, Intel Capital, Parkway, ARK Invest. Figure's bet is on a fully internal foundation-model stack (Helix), having ended its OpenAI partnership in early 2025. **Figure 03** was unveiled in October 2025 — a \$20K consumer humanoid with redesigned camera architecture (2× frame rate, 1/4 latency, 60% wider field of view), wireless inductive foot-charging at 2 kW, and engineered for high-volume manufacturing. Figure says its BotQ first-generation line targets up to 12,000 units/year, with a four-year goal of 100,000. As of early 2026 Figure had delivered ~350 units of Figure 03 with throughput ramping to roughly one per hour. BMW pilot at Spartanburg ongoing.

**1X Technologies** — Norwegian/American maker of Neo (home humanoid) and EVE (commercial). Backed by OpenAI Startup Fund. Series A2 \$23.5M (2023), Series B \$100M (2024). Released 1X World Model in late 2024. As of September 2025 1X was raising \$1B at \$10B valuation. Neo preorders opened October 28, 2025 at \$20K; first-year production capacity reportedly sold out within five days. December 2025 EQT deal: up to 10,000 Neo humanoids deployed across EQT's 300+ portfolio companies between 2026 and 2030 — the first sizable commercial reverse-of-direction (home robot finds use in factories first).

**Apptronik** — Apollo humanoid; \$350M Series A closed February 2025 co-led by B Capital and Capital Factory with Google participation, then extended to \$415M in March 2025 with Mercedes-Benz, Japan Post Capital, and ARK Invest joining. Commercial agreements with Mercedes-Benz and GXO Logistics. Jabil partnership announced February 2025 for Apollo on Jabil's own electronics-manufacturing lines. DeepMind's Gemini Robotics launch partner for hardware. Founded 2016 out of UT Austin's Human Centered Robotics Lab; Apollo is their 16th robotic system after a long history including the NASA Valkyrie. Strong industrial-integration story.

**Agility Robotics** — Digit (bipedal warehouse worker). Amazon-backed. GXO contract for live tote-handling in operating warehouses (2024 onwards). The first humanoid form factor with paying contractual deployment at scale.

**Sanctuary AI** — Phoenix (Canadian). Backed by Magna; Phoenix has ~20 DoF in each hand, more than most peers. Slower public pace than US competitors but has consistently strong dexterous-manipulation demos.

**Unitree** (Chinese) — H1 (\$90k) and G1 (\$16k) humanoids; Go2 / B2 quadrupeds. Aggressive price competition is the core story — Unitree H1/G1 are the cheapest humanoids on the market by a factor of 5–10x. Quality is debated, but they are the most-purchased robot bodies in academic labs in 2025.

**XPENG** (Chinese, EV maker) — Iron humanoid (announced November 2024). Vertical integration of EV-derived motor and battery technology into humanoid form is the strategic bet.

**UBTECH** (Chinese, HK-listed) — Walker S2; pilots at Geely, BYD, Foxconn assembly lines.

**Fourier Intelligence** (Chinese) — GR-1 and GR-2 humanoids; rehab-medicine origins.

**Booster Robotics** (Chinese) — T1 humanoid for academic and developer markets.

**LimX Dynamics**, **EngineAI**, **Galbot**, **Robot Era**, **AgiBot** — Chinese second-tier; rapid iteration, varying degrees of public technical maturity.

### 10.2 Foundation-model labs (humanoid-agnostic)

**Physical Intelligence (PI)** — Founded 2024. \$70M seed (March 2024); \$400M Series B (November 2024) at \$2.4B led by Bezos Expeditions, Thrive, Lux, Khosla, with OpenAI participating; \$600M Series C (November 2025) at \$5.6B led by Alphabet's CapitalG with Lux, Thrive, Bezos, Emergence, Index, T. Rowe Price. Total raised: \$1.1B. Released π0 (October 2024), π0.5 (April 2025), and the open-weight `openpi` derivatives. Sergey Levine's and Chelsea Finn's research-led play, drawing senior staff from Google DeepMind, X, and Tesla. Strategically ambiguous about which hardware partners they support, but broadly compatible with most bimanual rigs. The benchmark for what a research-credentialed VLA team can ship.

**Skild AI** — Founded 2023 by Deepak Pathak (CMU) and Abhinav Gupta (CMU). \$300M Series A (July 2024) at \$1.5B led by Lightspeed, Coatue, SoftBank, Bezos, with Sequoia, Felicis, Menlo, General Catalyst, Amazon Industrial Innovation Fund participating. Series B \$135M at \$4.5B (mid-2025). \$1.4B Series C (January 2026) at \$14B led by SoftBank, with NVentures (NVIDIA), Macquarie, Bezos Expeditions, Disruptive, 1789 Capital, plus strategic participation from Samsung, LG Technology Ventures, Schneider Electric, CommonSpirit Health, and Salesforce Ventures. Pitch: a single "Skild Brain" omni-bodied foundation model controlling any robot — quadrupeds, humanoids, tabletop arms, mobile manipulators — without prior knowledge of the body. Says it grew from \$0 to ~\$30M revenue in the second half of 2025. Largest robotics-foundation-model raise in the field's history.

**Covariant** — Earliest "AI-for-robots" lab, founded 2017. Acquired in part by Amazon (August 2024) when most senior staff including Pieter Abbeel transitioned over; remaining entity continues operations.

**World Labs** — Fei-Fei Li's spatial-intelligence company (\$230M raised in 2024). Less directly about robots, more about 3D scene understanding and world models that downstream robotics labs can use.

**The AI Institute** (Marc Raibert) — Boston Dynamics founder's separate research arm, focused on humanoid AI fundamentals. Backed by Hyundai. Closer to a research lab than a product company.

### 10.3 Industrial / warehouse / mobility

**Symbotic** (NASDAQ: SYM) — Walmart's exclusive automation provider; high-density automated warehousing. The largest pure-play robotics company by market cap.

**Locus Robotics** — Autonomous mobile robots for e-commerce fulfillment.

**AutoStore** (OSE: AUTO) — Norwegian high-density goods-to-person system; ~1,000 deployments globally.

**Berkshire Grey** — Acquired by SoftBank, 2023.

**Geek+** (Chinese) — Largest by deployment count globally for AMRs; revenue-positive.

**Hai Robotics** (Chinese) — High-density storage robots.

**Anybotics** (Swiss) — ANYmal industrial inspection quadruped; Series C in 2024.

### 10.4 Surgical, medical, and specialty

**Intuitive Surgical** (NASDAQ: ISRG) — da Vinci. The dominant surgical robot, with installed base of 8,000+ systems worldwide and the SP single-port system in active rollout. The financial yardstick for "what a successful robotics company looks like at maturity."

**Stryker** — Mako orthopedic robot; the leading competitor in orthopedic surgical robotics.

**Vicarious Surgical** (NYSE: RBOT) — single-port abdominal system.

**CMR Surgical** — Versius (UK).

**Medical Microinstruments** — Symani; microsurgical platform.

**Auris Health** (Johnson & Johnson) — Monarch bronchoscopy/urology system.

**Galen / Moon Surgical / Pristine Surgical** — surgical robotics second tier.

### 10.5 Drones, autonomous vehicles, agriculture

These deserve their own surveys (and parts of this site already cover drones in the [GPS-denied navigation post](/posts/navigating-blind-drones-without-gps) and chip supply in the [silicon-to-silicon walk](/posts/chip-supply-chain-silicon-to-silicon-wafers)). The headline names:

- **Drones / defense robotics**: Skydio, Anduril, Shield AI, AeroVironment, Saronic (maritime), Helsing (Europe).
- **Autonomous vehicles**: Waymo (Alphabet), Zoox (Amazon), Wayve (UK), Aurora (NASDAQ: AUR), Pony.ai, WeRide, Tesla FSD, Nuro.
- **Agricultural robotics**: John Deere autonomous tractors, Carbon Robotics (laser weeder), Burro, Naïo, Monarch Tractor.

---

## 11. What didn't work and the open problems

A short list of what the 2024–2025 cycle convincingly showed *did not* deliver on its early hype:

1. **Pure end-to-end RL for dexterous manipulation in the real world.** Despite two years of Eureka-style reward synthesis and HiL-SERL-style hybrid training, no team has shipped a contact-rich dexterous task (e.g., shoelace tying, cable threading, wristwatch assembly) trained purely from RL on the physical robot at scale. The ALOHA-style imitation pipelines remain dominant for these tasks.

2. **Pure simulation training for contact-rich manipulation.** Domain randomization works for locomotion. It does not yet work, in published results, for dexterous insertion, soft-body manipulation, or fluid manipulation. The open question is whether the gap closes with better physics (Genesis) or with better real-world fine-tuning (HiL-SERL, ASAP), or both.

3. **"Robot brain" as a clean, universal API.** Skild's pitch — that one foundation-model API powers any humanoid — remains aspirational. In practice, every deployed humanoid in 2026 runs a custom-tuned VLA fine-tuned on that specific embodiment's data. Cross-embodiment transfer helps; it does not yet eliminate per-robot fine-tuning.

4. **Generalist humanoid foundation models that match per-task pipelines.** GR00T N1 and π0 are excellent, but on any specific deployed task at any specific company, a tightly fine-tuned narrow-task policy usually beats the generalist. This is the same pattern as in language modeling circa 2021 — generalists win in flexibility, narrow models win in benchmark numbers per task.

5. **Robot teleoperation as a viable scaling strategy alone.** UMI, DexCap, and Mobile ALOHA each made teleoperation easier, but the cost-per-trajectory is still enough that no company can afford to teleoperate the millions of trajectories needed for true open-world manipulation. The world-model + sim + small-real hybrid is the only credible path forward at scale.

The largest unresolved problem of the field, in my view, is the *sim-to-real gap for contact dynamics*. Every simulator (MuJoCo, Bullet, PhysX, Genesis) underestimates how much friction, slip, deformation, and material variation matter in tasks like buttoning a shirt, untangling a cable, or pouring a viscous liquid. Until that closes, foundation models trained mostly in simulation will keep having a ~40% real-world success rate ceiling on contact-rich tasks, no matter how big they get. The teams that solve this — by better physics, by better residual-correction methods like ASAP, or by sufficient real-world data — will own the next phase.

The second-largest unresolved problem is *evaluation*. There is no SWE-bench for robotics. Every paper benchmarks on a slightly different task suite, with a slightly different camera setup, on a slightly different embodiment. As of 2026, the field needs the equivalent of HumanEval (small, sharp, replicable) and the equivalent of SWE-bench Verified (large, real, contamination-controlled). Without this, claims about "5% better than OpenVLA" remain hard to evaluate.

---

## Bibliography by venue

### ICLR

- Eureka — [arXiv:2310.12931](https://arxiv.org/abs/2310.12931) (ICLR 2024)
- RDT-1B — [arXiv:2410.07864](https://arxiv.org/abs/2410.07864) (ICLR 2025)

### ICML

- Humanoid Locomotion as Next Token Prediction — [arXiv:2402.19469](https://arxiv.org/abs/2402.19469) (ICML 2024)
- Train for the Worst, Plan for the Best (Masked Diffusion) — [arXiv:2502.06768](https://arxiv.org/abs/2502.06768) (ICML 2025; methodologically relevant to action-token VLAs)

### NeurIPS

- LIBERO — [arXiv:2306.03310](https://arxiv.org/abs/2306.03310) (NeurIPS 2023)
- HPT (Heterogeneous Pretrained Transformers) — [arXiv:2409.20537](https://arxiv.org/abs/2409.20537) (NeurIPS 2024)
- iVideoGPT (NeurIPS 2024)
- 1000 Layer Self-Supervised RL — [arXiv:2503.14858](https://arxiv.org/abs/2503.14858) (NeurIPS 2025)

### CoRL

- BC-Z (CoRL 2021)
- SayCan — [arXiv:2204.01691](https://arxiv.org/abs/2204.01691) (CoRL 2022)
- RT-2 — [arXiv:2307.15818](https://arxiv.org/abs/2307.15818) (CoRL 2023)
- VoxPoser — [arXiv:2307.05973](https://arxiv.org/abs/2307.05973) (CoRL 2023)
- Q-Transformer (CoRL 2023)
- Robot Parkour Learning — [arXiv:2309.05665](https://arxiv.org/abs/2309.05665) (CoRL 2023)
- BEHAVIOR-1K (CoRL 2023)
- MimicGen — [arXiv:2310.17596](https://arxiv.org/abs/2310.17596) (CoRL 2023)
- 3D Diffuser Actor — [arXiv:2402.10885](https://arxiv.org/abs/2402.10885) (CoRL 2024)
- Crossformer — [arXiv:2408.11812](https://arxiv.org/abs/2408.11812) (CoRL 2024)
- Mobile ALOHA — [arXiv:2401.02117](https://arxiv.org/abs/2401.02117) (CoRL 2024)
- HumanPlus — [arXiv:2406.10454](https://arxiv.org/abs/2406.10454) (CoRL 2024)
- ALOHA Unleashed — [arXiv:2410.13126](https://arxiv.org/abs/2410.13126) (CoRL 2024)
- OpenVLA — [arXiv:2406.09246](https://arxiv.org/abs/2406.09246) (CoRL 2024)
- ReKep — [arXiv:2409.01652](https://arxiv.org/abs/2409.01652) (CoRL 2024)
- OmniH2O — [arXiv:2406.08858](https://arxiv.org/abs/2406.08858) (CoRL 2024)

### RSS

- RT-1 — [arXiv:2212.06817](https://arxiv.org/abs/2212.06817) (RSS 2023)
- ACT / ALOHA — [arXiv:2304.13705](https://arxiv.org/abs/2304.13705) (RSS 2023)
- Diffusion Policy — [arXiv:2303.04137](https://arxiv.org/abs/2303.04137) (RSS 2023)
- 3D Diffusion Policy — [arXiv:2403.03954](https://arxiv.org/abs/2403.03954) (RSS 2024)
- UMI — [arXiv:2402.10329](https://arxiv.org/abs/2402.10329) (RSS 2024)
- DexCap — [arXiv:2403.07788](https://arxiv.org/abs/2403.07788) (RSS 2024)
- DROID — [arXiv:2403.12945](https://arxiv.org/abs/2403.12945) (RSS 2024)
- Octo — [arXiv:2405.12213](https://arxiv.org/abs/2405.12213) (RSS 2024)
- DrEureka — [arXiv:2406.01967](https://arxiv.org/abs/2406.01967) (RSS 2024)
- RoboCasa — [arXiv:2406.02523](https://arxiv.org/abs/2406.02523) (RSS 2024)

### ICRA

- Code as Policies — [arXiv:2209.07753](https://arxiv.org/abs/2209.07753) (ICRA 2023)
- RT-X / Open X-Embodiment — [arXiv:2310.08864](https://arxiv.org/abs/2310.08864) (ICRA 2024 best paper)
- Extreme Parkour (ICRA 2024)
- DexMimicGen (ICRA 2025)

### Journals (Science, Nature, IJRR, T-RO)

- Diffusion Policy IJRR extended (IJRR 2024)
- ANYmal Parkour — *Science Robotics*, 2024 (Hoeller et al.)
- DreamerV3 — [arXiv:2301.04104](https://arxiv.org/abs/2301.04104) (*Nature*, 2025)

### Industry / arXiv only (load-bearing)

- π0 — [arXiv:2410.24164](https://arxiv.org/abs/2410.24164) (Physical Intelligence, 2024)
- π0.5 — [arXiv:2504.16054](https://arxiv.org/abs/2504.16054) (Physical Intelligence, 2025)
- HOVER — [arXiv:2410.21229](https://arxiv.org/abs/2410.21229) (NVIDIA, 2024)
- ASAP — [arXiv:2502.01143](https://arxiv.org/abs/2502.01143) (NVIDIA / CMU, 2025)
- Cosmos World Foundation Models — [arXiv:2501.03575](https://arxiv.org/abs/2501.03575) (NVIDIA, 2025)
- HiL-SERL — [arXiv:2410.21845](https://arxiv.org/abs/2410.21845) (Berkeley, 2024)
- FAST (action tokenization) — [arXiv:2501.09747](https://arxiv.org/abs/2501.09747) (Physical Intelligence, 2025)
- GR00T N1 — [arXiv:2503.14734](https://arxiv.org/abs/2503.14734) (NVIDIA, March 2025)
- Helix ([Figure AI blog](https://www.figure.ai/news/helix), February 2025)
- Gemini Robotics ([DeepMind blog](https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/), March 2025)
- 1X World Model (1X blog, late 2024)
- Newton physics engine ([NVIDIA + DeepMind + Disney + Linux Foundation](https://developer.nvidia.com/newton-physics), 2025)

---

## Closing thought

If you'd asked me three years ago whether end-to-end neural policies could fold laundry in someone's actual house, I would have said no. π0.5 settled that question in April 2025. If you'd asked me whether a single learned controller could do parkour on a humanoid out of the box, I would have been even more skeptical — ASAP settled that in February 2025. If you'd asked me whether one of the major academic conferences would have multiple humanoid foundation-model papers in 2025–2026 (rather than yet more tabletop manipulation), I'd have been wrong about that too.

But the field still cannot reliably button a shirt, and the cost per trajectory is too high to brute-force the data. The next two years will be decided by who closes the contact-dynamics sim-to-real gap and by who builds the equivalent of HumanEval-for-robots so that progress can be measured cleanly. My bet is that the foundation-model labs (Physical Intelligence, Skild, Figure, NVIDIA) win on the modeling side and that a university consortium — probably some descendant of the Open X-Embodiment authors — wins on the evaluation side. We'll know in 2027.
