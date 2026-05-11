---
title: "On Quantum Backpropagation, Information Reuse, and Cheating Measurement Collapse"
author: Dendi Suhubdy
pubDatetime: 2026-03-31T06:00:00Z
featured: true
draft: false
tags:
  - quantum-computing
  - quantum-machine-learning
  - backpropagation
  - shadow-tomography
  - variational-quantum-algorithms
description: "Can quantum models train as efficiently as classical neural networks? Abbas et al. prove backpropagation scaling is impossible without multiple copies of a quantum state, then show how shadow tomography gets you most of the way there. A deep dive into the paper that defines the trainability frontier for quantum machine learning."
---

Of all the papers to land on the desk of someone who runs [backpropagation.ai](https://backpropagation.ai), this one was inevitable.

["On quantum backpropagation, information reuse, and cheating measurement collapse"](https://arxiv.org/abs/2305.13362) by Amira Abbas, Robbie King, Hsin-Yuan Huang, William J. Huggins, Ramis Movassagh, Dar Gilboa, and Jarrod R. McClean---a collaboration between Google Quantum AI, the University of KwaZulu-Natal, the University of Amsterdam, QuSoft, and Caltech---published at NeurIPS 2023 (Spotlight), asks the most fundamental question in quantum machine learning:

**Can parameterized quantum models train as efficiently as classical neural networks?**

The answer is nuanced, surprising, and has deep implications for the future of quantum computing as an AI platform.

---

## Why Backpropagation Matters So Much

Classical deep learning's secret weapon is not the architecture. It is not the data. It is *backpropagation*---the algorithm that makes training tractable.

Backpropagation exploits the chain rule and the structure of computational graphs to compute gradients of a loss function with respect to *all* parameters in a single backward pass. The cost of computing the full gradient is bounded by a small constant multiple of the cost of computing the function itself:

$$\text{TIME}(F'(\theta)) \leq c_t \cdot \text{TIME}(F(\theta))$$

where $c_t = O(\log(M))$ and $M$ is the number of parameters. This is what makes it possible to train models with $10^{10}$ parameters. Without backpropagation scaling, gradient computation would cost $O(M)$ times the forward pass---rendering modern deep learning economically and computationally infeasible.

The question is whether quantum models can achieve the same.

---

## The Fundamental Obstacle: Measurement Collapse

In classical computing, you can inspect any intermediate value in a computation without disturbing it. This is what makes backpropagation work: the forward pass stores intermediate activations, and the backward pass reads them to compute gradients layer by layer.

Quantum mechanics forbids this. Measuring a quantum state collapses it. You cannot "peek" at intermediate states in a quantum circuit without destroying the very information you need to continue the computation. This is not a hardware limitation---it is a law of physics.

Naively, this seems to rule out any quantum analogue of backpropagation. Each gradient component requires a separate circuit execution, giving a cost that scales as:

$$\text{TIME}(F'(\theta)) \propto M \cdot \text{TIME}(F(\theta)) = \tilde{O}(M^2/\varepsilon^k)$$

This is the quadratic scaling wall. For a model with 10,000 parameters, a single gradient estimate could take up to a day. Classical neural networks of the same size train in seconds.

---

## The Impossibility Result

The paper's first major contribution is making this intuition rigorous.

**Proposition 3 (Impossibility without quantum memory).** *In the general case, backpropagation scaling is impossible for quantum models without access to multiple copies of a quantum state.*

The proof is elegant. Consider the Pauli circuit model on $n$ qubits with $M = O(4^n)$ parameters. The gradient with respect to each parameter is given by the expected value of a Pauli operator on the unknown state $\rho$. Predicting all $4^n$ Pauli operators to precision $\varepsilon$ from single-copy measurements requires $\Omega(2^n/\varepsilon^2)$ copies---far more than the $O(\text{poly}(n))$ copies that backpropagation scaling would demand.

This is an information-theoretic lower bound. No clever algorithm can circumvent it in the single-copy regime.

---

## The Classical Analogue Surprise

Here is where the paper gets interesting. The authors show that *classical probabilistic analogues* of variational quantum models---parameterized Markov chains---**do** exhibit backpropagation scaling.

**Proposition 5.** *Parameterized Markov chains, which are much closer classical analogues to variational models than neural networks, exhibit backpropagation scaling.*

This is a sharp diagnostic. The barrier to quantum backpropagation is not the probabilistic structure of the model or the sequential composition of parameterized layers. It is specifically the *quantum* property of measurement collapse---the inability to read intermediate states non-destructively while continuing a computation.

The classical-quantum analogy is precise enough to isolate exactly where the difficulty lies, and it is not where you might expect.

---

## Cheating Measurement Collapse with Multiple Copies

The impossibility result applies to single-copy measurements. But what if you have access to multiple copies of your quantum state? This is where *shadow tomography* and *gentle measurements* enter the picture.

A gentle measurement is one that leaves the quantum state approximately undisturbed:

$$||\rho_{F=y} - \rho|| \leq \alpha$$

where $\alpha$ measures how much "damage" the measurement inflicts. By using multiple copies and gentle measurements, you can extract information about many observables without catastrophically collapsing the state.

**Proposition 7 (Special case achieves backpropagation scaling).** For a special class of variational models where $U(\theta) = \prod_{j=1}^{M} e^{-i\theta_j P_j} V$ with $O = I$ and $\theta$ set to zero, all $M$ gradient components can be estimated to precision $\varepsilon$ using only $O(\log(M)/\varepsilon^4)$ function calls, achieving:

$$\text{TIME}(F'(\theta)) = O(\log(M)) \cdot \text{TIME}(F(\theta))$$

This *is* backpropagation scaling. The catch: it holds only for this special case. A small perturbation away from it, and the technique breaks.

---

## The Main Algorithm: Quantum Backpropagation via Shadow Tomography

The paper's central contribution is an algorithm that achieves backpropagation scaling in *quantum resources* for general quantum neural networks, by leveraging the sequential structure of the circuit.

**Theorem 9 (Quantum-efficient backpropagation).** *Given an unknown $n$-qubit input state $|\varphi\rangle$, the algorithm produces gradient estimates for all $M$ parameters using only*

$$m = O\left(\frac{n \log^2 M}{\varepsilon^4}\right)$$

*copies of $|\varphi\rangle$. The number of quantum operations is $\tilde{O}(mM)$---quasi-linear in $M$.*

The algorithm (depicted in Figure 1 of the paper) works as follows:

1. **Initialize** an online shadow tomography protocol with a classically constructed hypothesis state $\sigma$.
2. **Process copies in batches** of size $O(\text{polylog}(M))$, with roughly $n$ batches total.
3. **Rotate** both the quantum states and the hypothesis state through the layers of the quantum neural network $F(\theta)$ sequentially.
4. **At each layer**, perform a threshold check and update the hypothesis if needed---extracting gradient information through gentle measurements.

The key insight is *information reuse*: by rotating through layers sequentially (like classical backpropagation's layer-by-layer backward pass), the algorithm exploits the structure of the quantum neural network to extract gradient information from the same set of copies.

This reduces the quantum cost from $\tilde{O}(M^2)$ to $\tilde{O}(M \cdot \text{polylog}(M))$---matching classical backpropagation's scaling in quantum resources.

---

## The Catch: Exponential Classical Overhead

There is a significant caveat. The algorithm requires classical storage and manipulation of a *hypothesis state*, which in general scales as $M \cdot 2^{O(n)}$---exponentially in the number of qubits.

This is not a bug in the analysis. The authors show via a formal reduction (Theorem 12) that an efficient quantum backpropagation algorithm would *imply* an efficient shadow tomography algorithm for poly-time observables---a problem for which no efficient classical solution is known.

**Theorem 12 (Shadow tomography reduction).** *An algorithm that computes gradients of a quantum neural network efficiently can be transformed into an algorithm for shadow tomography of poly-time observables with the same sample complexity and runtime.*

In other words, solving quantum backpropagation in full generality is *at least as hard as* solving shadow tomography---one of the central open problems in quantum information theory.

Furthermore, the authors rule out a purely quantum "gentle" approach:

**Theorem 13.** *Achieving gentle measurements using only $O(\text{polylog}(1/\alpha))$ copies of the state would violate known query lower bounds for Grover's search algorithm, and thus cannot be possible in general.*

This is a striking complexity-theoretic barrier. Quantum backpropagation cannot be achieved through measurement gentleness alone---you fundamentally need a classical model to complement the quantum measurements.

---

## What This Means for Quantum Machine Learning

The paper paints a nuanced picture:

**The bad news:** Current gradient methods for variational quantum models do not, and in many cases *cannot*, achieve backpropagation scaling. The parameter-shift rule, SPSA, and other standard techniques all exhibit $O(M^2)$ scaling. This is a fundamental obstacle to training large-scale quantum models, independent of hardware noise or barren plateaus.

**The good news:** Backpropagation scaling *is* achievable in quantum resources when you have access to multiple copies of your input state and are willing to pay a classical computational cost. For systems with low entanglement (where states can be efficiently represented as matrix product states or tensor networks), the classical overhead may be manageable.

**The open question:** Can the exponential classical overhead be removed? The authors identify specific regimes where this might be possible:

- **Structured observables:** If the observables have exploitable structure (e.g., Pauli operators), known shadow tomography schemes are efficient.
- **Approximate representations:** For states with low entanglement, tensor network approximations could make the hypothesis state tractable.
- **Alternative model architectures:** Perhaps the right quantum model for efficient training is not the variational circuit, but something designed from the ground up with trainability in mind.

---

## The Deeper Implication

The paper's most provocative suggestion is buried in the discussion:

> "If the difficulty to achieve an efficient scaling is due to inherently quantum properties, perhaps backpropagation is not the correct method for optimization of quantum models."

This is a profound statement. Classical deep learning is built around backpropagation not because gradient descent is the only optimization method, but because backpropagation makes gradient descent *cheap*. If quantum models cannot replicate this cheapness, the entire optimization paradigm may need to change.

The classical deep learning community is already beginning to question backpropagation's monopoly. Forward-mode methods, evolution strategies, and zeroth-order optimization are all active research directions. For quantum models, these alternatives may not be a compromise---they may be a necessity.

---

## Why This Paper Matters Now

With parameter counts in classical models reaching $10^{12}$ and the emerging interest in hybrid quantum-classical architectures, the scalability of quantum model training is not an abstract concern. If quantum neural networks cannot be trained efficiently at scale, their role in the AI stack is limited to small, specialized modules---valuable perhaps, but not transformative.

Abbas et al. have drawn the map of what is possible, what is impossible, and what remains unknown. The boundaries are set by the deepest features of quantum mechanics---measurement collapse, the structure of entanglement, and the relationship between quantum and classical information. Understanding these boundaries is prerequisite to building quantum machine learning systems that actually work.

The paper is available on [arXiv:2305.13362](https://arxiv.org/abs/2305.13362).
