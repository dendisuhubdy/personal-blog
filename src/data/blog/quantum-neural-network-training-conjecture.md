---
title: "On Quantum Algorithms for Neural-Network Training: A Conjecture on Fault-Tolerant Speedups"
author: Dendi Suhubdy
pubDatetime: 2026-05-11T02:30:00Z
featured: true
draft: false
tags:
  - quantum-computing
  - quantum-machine-learning
  - backpropagation
  - quantum-optimization
  - high-dimensional-optimization
  - quantum-langevin
  - sdp-solvers
  - quantum-interior-point
  - barren-plateaus
  - bqp
  - conjecture
  - neurips
  - icml
  - iclr
  - stoc
  - focs
description: "The Suhubdy Conjecture — a three-form mathematical conjecture for a fault-tolerant quantum algorithm that accelerates — or replaces — backpropagation for empirical-risk minimisation in neural networks. Positioned against the Baur–Strassen cheap-gradient bound, Jordan and Gilyén–Arunachalam–Wiebe gradient-estimation algorithms, Abbas et al. (NeurIPS 2023) impossibility, quantum SDP and interior-point solvers, the Zhang–Leng–Li and Garg–Kothari–Netrapalli–Sherif lower bounds, and the 2024–2026 line on quantum non-logconcave sampling. Companion arXiv-style preprint (.tex source and .pdf) provided."
---

> **Preprint downloads.** A formal preprint version of this conjecture is available as a self-contained arXiv-style document: [PDF](/quantum-nn-training-conjecture.pdf) · [LaTeX source](/quantum-nn-training-conjecture.tex). The .tex file is self-compiling under standard distributions (`tectonic`, `pdflatex`, `lualatex`). The blog text below summarises and contextualises the preprint; for the formal statements with theorem environments, falsification criteria, and bibliography, see the PDF.
>
> **Companion posts.** Two earlier posts on this site are load-bearing context for the obstructions discussed below: [The credit assignment problem: from Rosenblatt's perceptron to backpropagation to quantum gradients](/posts/credit-assignment-problem-perceptrons-backprop-quantum) (historical survey) and [On quantum backpropagation, information reuse, and cheating measurement collapse](/posts/quantum-backpropagation-information-reuse-measurement-collapse) (extended exposition of Abbas et al., NeurIPS 2023, which is the central obstacle for Form B).

## Abstract

We state, in three escalating forms, a mathematical conjecture — hereafter referred to as the **Suhubdy Conjecture** — for a fault-tolerant quantum algorithm that accelerates or replaces backpropagation for empirical-risk minimisation in neural networks. The conjecture is positioned against six bodies of established literature: (i) the [Baur–Strassen (1983)](https://www.sciencedirect.com/science/article/pii/0304397583900762) cheap-gradient bound; (ii) [Jordan (2005)](https://arxiv.org/abs/quant-ph/0405146) and [Gilyén–Arunachalam–Wiebe (SODA 2019)](https://arxiv.org/abs/1711.00465) quantum-gradient-estimation algorithms with matching lower bounds; (iii) [Abbas et al. (NeurIPS 2023 Spotlight)](https://arxiv.org/abs/2305.13362) impossibility and shadow-tomography workaround for parameterised quantum models; (iv) quantum semidefinite-programming and interior-point solvers ([Brandão–Svore FOCS 2017](https://arxiv.org/abs/1609.05537), [van Apeldoorn–Gilyén–Gribling–de Wolf Quantum 2020](https://arxiv.org/abs/1705.01843), [Kerenidis–Prakash ACM TQC 2020](https://arxiv.org/abs/1808.09266), [Augustino et al. Quantum 2023](https://arxiv.org/abs/2112.06025)); (v) the [Zhang–Leng–Li (ICML 2023)](https://arxiv.org/abs/2212.03906) stationary-point and [Garg–Kothari–Netrapalli–Sherif (ITCS 2021)](https://arxiv.org/abs/2010.01801) non-smooth lower bounds; and (vi) the recent 2024–2026 line on quantum-enhanced non-reversible Markov chains and non-logconcave sampling ([arXiv:2505.05301](https://arxiv.org/abs/2505.05301), [arXiv:2504.03626](https://arxiv.org/abs/2504.03626)). For each form we specify the access model, identify which existing lower bound it must thread, and enumerate falsification routes. Of the three, Forms A and B are recompositions of established quantum primitives (amplitude estimation $\times$ multivariate gradient estimation, and quantum singular value transformation respectively) and their interest lies primarily in whether the compositions go through without losing the speedup; Form C is the most genuinely novel claim, asserting that non-logconcave-sampling speedups extend to deep-network loss landscapes outside the reach of any current dequantisation. The conjecture is offered as an open problem, not a theorem.

---

## Table of contents

---

## 1. Introduction

Reverse-mode automatic differentiation makes the cost of computing the gradient of a smooth function bounded by a small constant multiple of the cost of evaluating the function itself, independent of the number of variables [(Baur and Strassen, 1983)](https://www.sciencedirect.com/science/article/pii/0304397583900762). This *cheap-gradient principle* is what makes modern deep learning tractable: it permits training of models with $P \gtrsim 10^{12}$ parameters at a per-step cost only a small multiple of one forward pass. Any candidate quantum algorithm for neural-network training must situate itself with respect to this bound.

Three claims have appeared in the recent literature in mutual tension. First, generic quantum gradient estimation in $d$ dimensions admits a $\widetilde{O}(\sqrt{d}/\varepsilon)$ query-complexity upper bound, optimal up to polylogarithmic factors against a matching lower bound [(Gilyén, Arunachalam, and Wiebe, SODA 2019)](https://arxiv.org/abs/1711.00465). Second, in the parameterised-quantum-circuit setting, single-copy access to the output state prohibits backpropagation-style scaling: $\Omega(M)$ circuit runs are required per gradient [(Abbas et al., NeurIPS 2023)](https://arxiv.org/abs/2305.13362). Third, for smooth non-convex stationary-point finding in $\mathbb{R}^P$ with quantum derivative oracles, no asymptotic speedup over classical algorithms exists [(Zhang, Leng, and Li, ICML 2023)](https://arxiv.org/abs/2212.03906).

These results are not contradictory — they hold in different access models with different objectives — but they make the question *"can a fault-tolerant quantum computer train a neural network asymptotically faster than a classical one?"* delicate. This post states a three-form conjecture that, for each form, identifies the access model, the existing lower bound it must avoid, and the established algorithmic primitive it would compose. The conjecture is not proved here. Its purpose is to specify an open problem precisely enough that progress on it is testable.

---

## 2. Preliminaries

### 2.1 Notation

Let $f_\theta : \mathcal{X} \to \mathcal{Y}$ be a neural network with parameters $\theta \in \mathbb{R}^P$, computation graph $G=(V,E)$, and depth $L$. Let $\mathcal{D} = \{(x_i, y_i)\}_{i=1}^N$ be a dataset, $\ell : \mathcal{Y}\times\mathcal{Y} \to \mathbb{R}$ a smooth loss, and

$$\mathcal{L}(\theta) \;\coloneqq\; \frac{1}{N}\sum_{i=1}^N \ell\bigl(f_\theta(x_i), y_i\bigr).$$

We write $T_{\text{fwd}}$ for the gate count of a reversible quantum implementation of $f_\theta$ and assume $T_{\text{fwd}} = O(|E|) = O(PL)$. Throughout, $\widetilde{O}(\cdot)$ suppresses polylogarithmic factors in $N, P, 1/\varepsilon, 1/\delta$.

### 2.2 Classical baseline

**Theorem (Baur–Strassen, 1983).** *For every straight-line arithmetic program of size $L$ computing $f : \mathbb{R}^d \to \mathbb{R}$, there exists a straight-line program of size $\le 5L$ computing $f$ together with $\nabla f$. The dimension $d$ does not appear in the multiplicative overhead.*

This is the worst-case-optimal classical bound any quantum algorithm must improve upon. Modern reverse-mode automatic differentiation achieves a practical constant of $2$–$4$ for neural-network gradients [(Griewank and Walther, 2008)](https://my.siam.org/Store/Product/viewproduct/?ProductId=13036033).

### 2.3 Access models

Three quantum access types are referenced by the conjecture:

**Coherent data oracle.** $O_\mathcal{D} : |i\rangle|0\rangle \mapsto |i\rangle|x_i, y_i\rangle$ for $i \in [N]$, supporting superposition queries. Realisable with $\widetilde{O}(\log N)$ depth in the bucket-brigade QRAM model [(Giovannetti, Lloyd, Maccone, 2008)](https://arxiv.org/abs/0708.1879), or with classical-equivalent data-loading cost in a sequential read model.

**Reversible forward-pass oracle.** $U_{f,\theta} : |x\rangle|y\rangle|0\rangle \mapsto |x\rangle|y\rangle|\ell(f_\theta(x), y)\rangle$ to additive precision $2^{-b}$ using $T_{\text{fwd}} = \widetilde{O}(|E|)$ Clifford$+$T gates and $\widetilde{O}(b)$ ancillas.

**Block-encoding of the loss.** A unitary $U$ is an $(\alpha, a, \varepsilon)$-block-encoding of the loss Hamiltonian $H_\mathcal{L}$ if $\|H_\mathcal{L} - \alpha(\langle 0|^{\otimes a} \otimes I)U(|0\rangle^{\otimes a} \otimes I)\| \le \varepsilon$, in the sense of [Gilyén–Su–Low–Wiebe (STOC 2019)](https://arxiv.org/abs/1806.01838).

---

## 3. The Suhubdy Conjecture

**Standing assumptions.** Forms A and C are stated under the assumption that the coherent data oracle of §2.3 is realisable — concretely, that the bucket-brigade QRAM construction of [Giovannetti, Lloyd, and Maccone (2008)](https://arxiv.org/abs/0708.1879) (or an equivalent) is physically implementable at fault-tolerant scale. No such device currently exists. Without this assumption, the $\sqrt{N}$ sample factor in Forms A and the data-loading step of Form C collapse to classical-equivalent cost; the conjecture is therefore *physically vacuous on architectures currently being built* and *mathematically non-trivial* in the QRAM-abstraction model. Form B is independent of QRAM but conditional on the existence of a measurement-free, data-respecting block-encoding (see §5.2).

The **Suhubdy Conjecture** is stated in three forms (A, B, C), ordered by increasing strength and decreasing similarity to classical backpropagation. We refer to the individual claims as **Suhubdy Conjecture (Form A / B / C)**.

### Form A: Quantum-accelerated backpropagation

*There exists a fault-tolerant quantum algorithm $\mathcal{A}_A$ such that, for every $\varepsilon, \delta \in (0,1)$, given oracles $O_\mathcal{D}$ and $U_{f,\theta}$, $\mathcal{A}_A$ returns $\tilde g \in \mathbb{R}^P$ satisfying*

$$\Pr\bigl[\,\|\tilde g - \nabla_\theta \mathcal{L}(\theta)\|_\infty \le \varepsilon\,\bigr] \;\ge\; 1 - \delta$$

*using*

1. *query complexity $\widetilde{O}\bigl(\sqrt{N}\cdot\sqrt{P}\cdot\varepsilon^{-1}\cdot\log(1/\delta)\bigr)$ — the $\log(1/\delta)$ factor reflects standard repetition-and-majority amplification; under median-of-means amplification (cf. Cornelissen–Hamoudi–Jerbi) the factor sharpens to $\sqrt{\log(1/\delta)}$, which a proof should adopt;*
2. *circuit depth $\widetilde{O}\bigl(L\cdot\mathrm{polylog}(N,P,\varepsilon^{-1})\bigr)$;*
3. *ancilla space $O\bigl(P\cdot\mathrm{polylog}(N,\varepsilon^{-1})\bigr)$.*

### Form B: Backpropagation replacement

*There exists a fault-tolerant quantum algorithm $\mathcal{A}_B$ that, given an $(\alpha, a, \varepsilon)$-block-encoding $U_{H_\theta}$ of the parameter Hamiltonian and access to the derivative-generator $\partial_\theta H_\theta$, recovers*

$$\nabla_\theta \mathcal{L}(\theta) \;=\; \Bigl\langle\,i\bigl[H_\mathcal{L},\, \partial_\theta H_\theta\bigr]\,\Bigr\rangle$$

*via quantum singular value transformation and phase estimation in $\widetilde{O}(\alpha/\varepsilon)$ queries to $U_{H_\theta}$. The chain rule on $G$ is invoked nowhere in $\mathcal{A}_B$.*

### Form C: Non-gradient training

*There exists a fault-tolerant quantum algorithm $\mathcal{A}_C$ that, given $O_\mathcal{D}$ and $U_{f,\theta}$ and a temperature $\beta = \Theta(\log P)$, samples $\hat\theta \sim \pi_\beta$ from the Gibbs measure*

$$\pi_\beta(\theta) \;\propto\; \exp\bigl(-\beta\,\mathcal{L}(\theta)\bigr)$$

*to total-variation accuracy $\varepsilon$ in time*

$$\widetilde{O}\bigl(\mathrm{poly}(P)\cdot \varepsilon^{-c}\bigr),\qquad c < 2.$$

*Under standard concentration assumptions, $\hat\theta$ concentrates on $\varepsilon$-approximate first-order stationary points of $\mathcal{L}$, and — under a local-Hessian spectral-gap assumption — on $\varepsilon$-approximate second-order stationary points.*

The target value of the constant $c$ is $c \le 1.75$, motivated by composing the quartic Witten-Laplacian-acceleration upper bound of [arXiv:2505.05301](https://arxiv.org/abs/2505.05301) with the classical $\varepsilon^{-2}$ non-logconcave-Langevin baseline (giving $\varepsilon^{-0.5}$ in the most optimistic regime) and a more conservative pessimisation that accounts for the polynomial $P$-dependence absorbing slack. The conjecture is robust to any $c < 2$: even a strictly-sub-quadratic improvement over classical non-logconcave Langevin would be a substantive theorem in this setting.

---

## 4. Plausibility of Form A

Form A composes four established quantum primitives. The $\sqrt{N}$ factor follows from quadratic speedup for sample-mean estimation via amplitude estimation [(Brassard–Høyer–Mosca–Tapp, 2002)](https://arxiv.org/abs/quant-ph/0005055); [Montanaro (Proc. Roy. Soc. A 2015)](https://arxiv.org/abs/1504.06987); [Cornelissen–Hamoudi–Jerbi (STOC 2022)](https://arxiv.org/abs/2111.09787). Writing $\nabla \mathcal{L} = N^{-1}\sum_i \nabla\ell_i$, the multivariate quantum mean estimator achieves additive $\varepsilon$ in $\ell_2$ norm using $\widetilde{O}(\sqrt{N}/\varepsilon)$ queries to a per-sample gradient oracle.

The $\sqrt{P}$ factor follows from quantum gradient estimation in $P$ dimensions [(Gilyén–Arunachalam–Wiebe, SODA 2019)](https://arxiv.org/abs/1711.00465), which is optimal up to polylogarithmic factors against a matching $\widetilde{\Omega}(\sqrt{P}/\varepsilon)$ lower bound in the continuous-phase-query model. The matching $N$-dependent lower bound for multivariate empirical-risk mean estimation is established by [Cornelissen–Hamoudi–Jerbi (STOC 2022)](https://arxiv.org/abs/2111.09787); their analysis is the appropriate reference for any tightness argument on the $\sqrt{N}\sqrt{P}/\varepsilon$ rate.

The circuit-depth bound $\widetilde{O}(L \cdot \mathrm{polylog})$ requires that the forward pass remain sequentially depth-$L$ after block-encoding composition, consistent with the layer-wise structure of standard architectures.

**Speedup regime — the comparison that matters.** The Gilyén–Arunachalam–Wiebe $\sqrt{P}$ factor is a saving over *finite-difference* gradient estimation (which costs $P$ forward passes), not over the classical state of the art. The classical state of the art for neural-network gradients is reverse-mode automatic differentiation (Baur–Strassen, §2.2), which computes the *entire* gradient in $O(1)$ forward-pass-equivalents — independent of $P$. Composed over $N$ samples, classical empirical-risk-gradient computation therefore costs $O(N)$ forward-pass-equivalents.

Form A claims $\widetilde{O}(\sqrt{NP}/\varepsilon)$ queries to $U_{f,\theta}$. The quantum advantage over classical AD is therefore real only when

$$\sqrt{NP}/\varepsilon \;<\; N \quad\Longleftrightarrow\quad N \;\gg\; P/\varepsilon^{2}.$$

For frontier models with $P \sim 10^{12}$ parameters and $N \sim 10^{10}$ training tokens, this regime requires $\varepsilon^2 > 100$ — far outside any useful precision. The Form A speedup window is genuine in the *large-data, modest-precision* regime (e.g., low-bit-precision pretraining on $N \gg P$ corpora, or coarse-gradient curriculum stages) but is *illusory in the parameter-dominated frontier-model regime*. The conjecture remains non-trivial; the headline $\sqrt{NP}$ scaling, however, is not by itself a speedup against AD. Any preprint or proof must lead with this regime distinction.

**Obstructions.** Three technical conditions must be discharged:

- **(O1) Oracle composition without poly-$P$ blow-up.** The combined estimator must avoid an additional $\mathrm{poly}(P)$ factor in ancilla management, which would dominate the claimed $\sqrt{P}$ scaling.
- **(O2) QRAM realisability.** The $\sqrt{N}$ factor is contingent on the realisability of the coherent data oracle. No scalable QRAM implementation currently exists; the claim is conditional on the bucket-brigade model.
- **(O3) Zhang–Leng–Li compatibility.** The query-complexity lower bound of [Zhang–Leng–Li (ICML 2023)](https://arxiv.org/abs/2212.03906) for finding $\varepsilon$-stationary points of smooth non-convex functions matches classical complexity. Form A addresses *gradient computation at a fixed* $\theta$, not stationary-point finding; a proof must verify this distinction does not collapse under reductions.

---

## 5. Plausibility of Form B

Form B rests on the observation that for a Hamiltonian $H_\theta$ with parameter-derivative-generator $\partial_\theta H_\theta$, the gradient of the expectation $\mathcal{L}(\theta) = \langle\psi|H_\mathcal{L}(\theta)|\psi\rangle$ is the expectation of the commutator

$$\nabla_\theta \mathcal{L}(\theta) \;=\; \langle\psi\,|\,i[H_\mathcal{L}, \partial_\theta H_\theta]\,|\,\psi\rangle$$

in a Heisenberg-picture sense — equivalently, the parameter-shift / Feynman–Hellmann identity for the variational expectation. Given block-encodings of both operators, quantum singular value transformation [(Gilyén–Su–Low–Wiebe, STOC 2019)](https://arxiv.org/abs/1806.01838) applies any bounded polynomial to the singular values of the encoded operator. The commutator estimate is therefore reducible to phase estimation on a polynomial-in-$1/\varepsilon$-degree block-encoding of $i[H_\mathcal{L}, \partial_\theta H_\theta]$.

**Where does the data enter?** This is the central open question for Form B, and it is what separates "QSVT in $\widetilde{O}(\alpha/\varepsilon)$ queries" from a usable training algorithm. The conjecture presupposes an $(\alpha, a, \varepsilon)$-block-encoding $U_{H_\theta}$ of a data-dependent loss Hamiltonian — naturally, $H_\theta \propto \sum_i \ell(f_\theta(x_i), y_i)$. Two questions about this construction must be answered:

- **(D1) Measurement-free construction.** Is there a polynomial-time construction of $U_{H_\theta}$ from $O_\mathcal{D}$ and $U_{f,\theta}$ that does *not* require intermediate measurement of the per-sample loss? If construction goes via per-sample measurement, [Abbas et al. (NeurIPS 2023)](https://arxiv.org/abs/2305.13362) reasserts itself. If construction requires the dataset to be loaded classically into a fault-tolerant register, the build cost is at least $\Omega(N)$ and the QSVT $\widetilde{O}(\alpha/\varepsilon)$ speedup is erased.
- **(D2) Normalisation scaling.** What is the dependence of $\alpha$ on $N$? Crude bounds give $\alpha = \Theta(N \|\ell\|_\infty)$, in which case subnormalisation reintroduces precision loss. Whether tighter normalisations are available for natural loss functions (cross-entropy, squared error, contrastive) is open.

Until (D1) and (D2) are addressed, Form B is best read as: *conditional on a data-respecting block-encoding existing*, QSVT computes the gradient in $\widetilde{O}(\alpha/\varepsilon)$ queries. The conditional is load-bearing — it is currently the most important obstruction in the conjecture.

**Obstructions.**

- **(O4) Non-linearity polynomial approximation and depth compounding.** ReLU, softmax, and GELU activations do not block-encode cleanly. Approximating ReLU to additive $\varepsilon$ on a bounded interval requires a polynomial of degree $\Theta(1/\sqrt{\varepsilon})$ (Eremenko–Yuditskii type bounds for non-smooth functions). For an $L$-layer network, naive composition compounds this to total degree $\Theta((1/\sqrt{\varepsilon})^L)$ — exponential in depth. A useful Form B therefore either (a) restricts to shallow architectures where the depth-exponential factor is controllable, (b) replaces the global polynomial approximation by a linear-combination-of-unitaries treatment over piecewise-linear segments of the activation, or (c) interleaves layer-wise tomographic refresh between blocks (paying a quantum-tomography overhead, but bounded as in [Abbas et al.](https://arxiv.org/abs/2305.13362)). Whether any of (a)–(c) preserves the headline $\widetilde{O}(\alpha/\varepsilon)$ rate is open.
- **(O5) Block-encoding normalisation.** The normalisation factor $\alpha$ typically grows with the spectral norm of the encoded operator. For cross-entropy losses on softmax outputs, $\|H_\mathcal{L}\|$ can be unbounded without an a priori activation-norm bound. A normalisation bound under realistic loss functions must be either proved or assumed explicitly. This obstruction is closely coupled to (D2).
- **(O6) Measurement collapse.** Per [Abbas et al. (NeurIPS 2023)](https://arxiv.org/abs/2305.13362), gradients of parameterised quantum models cannot be efficiently estimated under single-copy access. Form B circumvents this by representing the loss coherently as a block-encoded operator rather than as the output of a parameterised circuit, but only conditional on (D1) — that the block-encoding itself be efficiently constructible without intermediate measurement.

---

## 6. Plausibility of Form C

The [Zhang–Leng–Li (ICML 2023)](https://arxiv.org/abs/2212.03906) and [Garg–Kothari–Netrapalli–Sherif (ITCS 2021)](https://arxiv.org/abs/2010.01801) lower bounds rule out generic quantum speedups for optimisation *with gradient oracles*. They are silent on the regime where training is reformulated as sampling. The recent quantum-Langevin and non-reversible-Markov-chain line establishes:

- up to quartic speedup over classical Langevin dynamics in the non-logconcave regime, via encoding the Gibbs measure as the kernel of a factorised Witten Laplacian and applying quantum eigenvalue transformation [(arXiv:2505.05301, 2025)](https://arxiv.org/abs/2505.05301);
- up to exponential speedup for non-reversible Markov chains, beating the quadratic limit of reversible-walk methods inherited from [Szegedy (FOCS 2004)](https://ieeexplore.ieee.org/document/1366222) and [Magniez–Nayak–Roland–Santha (SIAM J. Comput. 2011)](https://epubs.siam.org/doi/10.1137/090745854);
- application to optimisation via Gibbs sampling at large $\beta$ [(arXiv:2504.03626, 2025)](https://arxiv.org/abs/2504.03626).

Neural-network posteriors are non-logconcave by construction. Sampling from $\pi_\beta \propto \exp(-\beta\mathcal{L})$ at large $\beta$ concentrates on minima of $\mathcal{L}$. For smooth $\mathcal{L}$ the concentration is to first-order stationary points; under additional spectral-gap assumptions on the local Hessian, to second-order stationary points. The relevant concentration result is the standard metastability/large-deviations analysis of low-temperature Gibbs measures over Morse-type landscapes — see Bovier and den Hollander, *Metastability: A Potential-Theoretic Approach* (Springer, 2015), Ch. 4–5; the more recent isoperimetric line in [Eldan, Lee, and Lehec (2020)](https://arxiv.org/abs/1905.04578) provides quantitative bounds under weaker logconcavity assumptions. The earlier-cited [Zhang, Leng, and Li (Quantum 2021)](https://arxiv.org/abs/2007.10253) is about *saddle-point escape via quantum wave equations*, a related but distinct mechanism, and is not the appropriate reference for the concentration step.

**Obstructions.**

- **(O7) Spectral-gap dependence.** The runtime of quantum Langevin methods depends polynomially on the spectral gap of the underlying chain. For deep-network loss landscapes the gap behaviour is empirically unknown and may scale unfavourably with width or depth.
- **(O8) Temperature scaling.** Reaching an $\varepsilon$-approximate stationary point requires $\beta = \Theta(\log P)$, contributing additional polynomial factors that the conjecture absorbs into $\mathrm{poly}(P)$ but a proof must bound explicitly.
- **(O9) Dequantisation — and what would have to be true to survive it.** The [Tang (STOC 2019)](https://arxiv.org/abs/1807.04271) — [Chia–Gilyén–Li–Lin–Tang–Wang (STOC 2020)](https://arxiv.org/abs/1910.06151) dequantisation programme — extended in the [Bakshi–Tang (STOC 2024)](https://arxiv.org/abs/2303.01492) line on classical singular-value-transformation analogues — has repeatedly collapsed apparent quantum speedups to polynomial via length-squared sampling. The non-logconcave regime is where these techniques have so far not applied, but absence-of-attack is not proof-of-resistance. A proof of Form C must give a *structural reason* why the relevant operator does not admit classical length-squared sampling — for example: (i) the kernel of the factorised Witten Laplacian on a non-logconcave loss does not admit a low-rank approximation in any basis efficiently samplable from $O_\mathcal{D}$, or (ii) the non-reversible quantum walk underlying the speedup has stationary distribution whose entry distribution is not concentrated enough for $\ell_2^2$-sampling to track it within polynomial overhead. Without an explicit such argument, Form C is open to dequantisation in principle; the failure of the existing dequantisation programme is encouraging but not a proof.

---

## 7. Related work

### 7.1 Quantum gradient estimation

The line begins with [Jordan (PRL 2005)](https://arxiv.org/abs/quant-ph/0405146), who showed that $O(1)$ queries to a phase oracle suffice for $d$-dimensional gradient estimation, by quantum-Fourier-transforming the perturbation register. [Gilyén, Arunachalam, and Wiebe (SODA 2019)](https://arxiv.org/abs/1711.00465) tightened both the query upper bound to $\widetilde{O}(\sqrt{d}/\varepsilon)$ and the matching lower bound, using a multi-dimensional generalisation of polynomial methods. [Cornelissen, Hamoudi, and Jerbi (STOC 2022)](https://arxiv.org/abs/2111.09787) gave near-optimal quantum algorithms for multivariate mean estimation, directly applicable to empirical-risk gradients over a dataset of size $N$.

### 7.2 Quantum backpropagation for variational models

[Abbas, King, Huang, Huggins, Movassagh, Gilboa, and McClean (NeurIPS 2023 Spotlight)](https://arxiv.org/abs/2305.13362) proved that, under single-copy access to the output state of a parameterised quantum model, $\Omega(M)$ circuit executions are required to estimate all $M$ gradient components, matching parameter-shift [(Mitarai et al., PRA 2018)](https://arxiv.org/abs/1803.00745); [Schuld et al., PRA 2019](https://arxiv.org/abs/1811.11184). They constructed a shadow-tomography-based algorithm achieving $\mathrm{polylog}(M)$ *quantum* sample complexity under multi-copy access, at the cost of classical post-processing whose efficiency is governed by open problems in shadow tomography. [Bowles, Wright, Farré, Coyle, and Schuld (Quantum 2025)](https://arxiv.org/abs/2306.14962) subsequently exhibited a class of structured parameterised circuits, not known to be classically simulable, for which the number of distinct circuits required for full gradient estimation is independent of $M$.

### 7.3 Quantum convex and semidefinite optimisation

[Brandão and Svore (FOCS 2017)](https://arxiv.org/abs/1609.05537) introduced the first quantum SDP solver, achieving $\widetilde{O}(\sqrt{nm})$ scaling in primal–dual dimensions. [van Apeldoorn, Gilyén, Gribling, and de Wolf (Quantum 2020)](https://arxiv.org/abs/1705.01843) improved the parameter dependence and proved a matching lower bound. [Kerenidis and Prakash (ACM TQC 2020)](https://arxiv.org/abs/1808.09266) introduced quantum interior-point methods for LP and SDP with $\widetilde{O}(n^{1.5}\mu\kappa^3\xi^{-2})$ complexity; [Augustino, Nannicini, Terlaky, and Zuluaga (Quantum 2023)](https://arxiv.org/abs/2112.06025) closed the inexact–infeasible gap. [Chakrabarti, Childs, Li, and Wu (Quantum 2020)](https://arxiv.org/abs/1809.01731) gave $\widetilde{O}(n)$ query algorithms for convex optimisation over a convex body in $\mathbb{R}^n$.

### 7.4 Non-convex stationary-point finding

[Zhang, Leng, and Li (ICML 2023)](https://arxiv.org/abs/2212.03906) proved that finding $\varepsilon$-approximate stationary points of smooth non-convex functions admits no asymptotic quantum speedup with derivative oracles. The saddle-escape paper of the same authors [(Quantum 2021)](https://arxiv.org/abs/2007.10253) established a $\log$-factor dimensional speedup for second-order stationary points via quantum-wave-equation perturbations. [Liu, Guan, He, and Lui (NeurIPS 2024)](https://arxiv.org/abs/2410.16189) achieved a genuine $\varepsilon^{-2/3}$ speedup for $(\delta,\varepsilon)$-Goldstein stationary points of non-smooth Lipschitz objectives with zeroth-order stochastic access, threading the loophole left by the smooth-first-order lower bounds.

### 7.5 Quantum sampling and Langevin dynamics

[Montanaro (Proc. Roy. Soc. A 2015)](https://arxiv.org/abs/1504.06987) established the foundational quadratic speedup for Monte Carlo mean estimation. [Layden et al. (Nature 619:282, 2023)](https://www.nature.com/articles/s41586-023-06095-4) demonstrated empirical speedups for quantum-enhanced MCMC on Ising models. The 2024–2026 line [(arXiv:2505.05301](https://arxiv.org/abs/2505.05301); [arXiv:2504.03626](https://arxiv.org/abs/2504.03626)) established quartic speedups for non-logconcave sampling and exponential speedups for non-reversible chains.

### 7.6 Dequantisation and barren plateaus

[Tang (STOC 2019)](https://arxiv.org/abs/1807.04271) initiated the dequantisation programme by giving a polylog-time classical algorithm matching the Kerenidis–Prakash quantum recommendation algorithm under length-squared sampling. [Chia, Gilyén, Li, Lin, Tang, and Wang (STOC 2020)](https://arxiv.org/abs/1910.06151) extended this to a general framework. [McClean, Boixo, Smelyanskiy, Babbush, and Neven (Nat. Commun. 2018)](https://arxiv.org/abs/1803.11173) identified the barren-plateau phenomenon; [Cerezo et al. (Nat. Commun. 2021)](https://arxiv.org/abs/2001.00550) and [Cerezo et al. (Nat. Commun. 2025)](https://arxiv.org/abs/2312.09121) established cost-function dependence and the simulability implication of provable absence.

---

## 8. Falsification criteria

Concrete falsification routes for each form:

- **Form A is falsified** by a proof that any quantum algorithm computing $\nabla\mathcal{L}$ to $\ell_\infty$ error $\varepsilon$ from $O_\mathcal{D}$ and $U_{f,\theta}$ requires $\Omega(NP^{1-o(1)}\varepsilon^{-1})$ queries, or by extension of [Zhang–Leng–Li (ICML 2023)](https://arxiv.org/abs/2212.03906) to the empirical-risk-gradient setting at the conjectured precision.
- **Form B is falsified** by (a) a proof that any measurement-free block-encoding of $H_\theta \propto \sum_i \ell(f_\theta(x_i), y_i)$ requires $\Omega(N)$ data-loading queries even at constant depth (closing (D1)/(D2)); (b) a tightness result on activation-polynomial approximation showing that *no* LCU or piecewise treatment escapes the depth-exponential $(1/\sqrt{\varepsilon})^L$ blow-up of (O4); or (c) an explicit reduction showing such a block-encoding implies an efficient solution to shadow tomography of polynomial-time observables [(Abbas et al., 2023)](https://arxiv.org/abs/2305.13362).
- **Form C is falsified** by a dequantisation result extending [Chia et al. (STOC 2020)](https://arxiv.org/abs/1910.06151) to block-encoded non-logconcave Gibbs measures under classical length-squared sampling, or by a proof that the spectral gap of the relevant Markov chain on $\mathbb{R}^P$ depends super-polynomially on $P$ for natural network architectures.

---

## 9. Discussion

The conjecture is not that quantum computers will train neural networks faster than classical ones in some imprecise sense. It is that at least one of three precisely specified algorithmic claims admits a proof under access models natural enough to apply to deep-network training. Each form maps to an existing primitive: amplitude estimation and quantum gradient estimation (Form A), quantum singular value transformation (Form B), quantum-enhanced non-reversible Markov chains (Form C). The conjecture asserts that the compositions and constructions required are achievable; the literature establishes that the components are.

---

## 10. Reproducibility and preprint

The arXiv-style preprint contains the same statements with formal theorem environments and a bibliography in `plainnat` style.

- **PDF:** [`/quantum-nn-training-conjecture.pdf`](/quantum-nn-training-conjecture.pdf) (132 KB, 11 pages)
- **LaTeX source:** [`/quantum-nn-training-conjecture.tex`](/quantum-nn-training-conjecture.tex) (40 KB, self-contained, MIT-licensed)

Compilation under `tectonic`:

```bash
tectonic quantum-nn-training-conjecture.tex
```

The source is also compatible with `pdflatex` and `lualatex` under any standard TeX Live distribution. Comments, corrections, and proofs are welcomed at the email address on the about page.

Companion posts on this site:

- [On quantum backpropagation, information reuse, and cheating measurement collapse](/posts/quantum-backpropagation-information-reuse-measurement-collapse) — extended exposition of [Abbas et al. (NeurIPS 2023)](https://arxiv.org/abs/2305.13362).
- [The credit assignment problem: from Rosenblatt's perceptron to backpropagation to quantum gradients](/posts/credit-assignment-problem-perceptrons-backprop-quantum) — historical and technical survey from 1958 to the present.
