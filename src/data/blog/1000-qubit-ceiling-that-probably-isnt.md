---
title: "The 1,000-Qubit Ceiling That Probably Isn't"
author: Dendi Suhubdy
pubDatetime: 2026-04-03T00:00:00Z
featured: false
draft: false
tags:
  - quantum-computing
  - cryptography
  - post-quantum
  - elliptic-curve-cryptography
  - bitcoin
  - ethereum
description: "Oxford physicist Tim Palmer claims quantum computers face a hard 1,000-qubit ceiling that would protect RSA and ECC forever. A careful reading of the physics and the math says otherwise---and your migration timeline should not wait to find out."
---

Tim Palmer, emeritus professor of physics at Oxford, just published a paper in the *Proceedings of the National Academy of Sciences* arguing that quantum computers face a hard, physics-imposed ceiling of roughly 1,000 useful qubits. If true, this would mean quantum computers could never break RSA-2048 or the elliptic curve cryptography protecting Bitcoin, Ethereum, and modern TLS.

Marin Ivezic at [PostQuantum](https://postquantum.com/quantum-research/the-1000-qubit-ceiling/) wrote an excellent dissection of the claim. Here is my summary and what I think it means for anyone building on or securing crypto infrastructure.

---

## Palmer's Argument

Palmer's framework, called **Rational Quantum Mechanics (RaQM)**, proposes that Hilbert space is discrete rather than continuous. In standard quantum mechanics, quantum state parameters are real (or complex) numbers---they can take on any value along the continuum. RaQM restricts these parameters to rational numbers, which imposes a finite information capacity on quantum systems.

From this, Palmer derives maximum qubit counts by hardware type:

| Qubit technology | N_max (Palmer's estimate) |
|------------------|--------------------------|
| Quantum dot      | ~200                     |
| Photonic         | ~300                     |
| Ion trap         | ~400                     |
| Absolute ceiling | ~1,000                   |

The absolute 1,000-qubit ceiling comes from a thought experiment involving a photon with the lowest frequency that fits within the universe's age, superposed over one Planck length. This is a purely theoretical upper bound under maximally favorable conditions.

---

## Three Unverified Assumptions

Ivezic identifies three foundational assumptions underlying RaQM, each of which must hold for the ceiling to be real:

**1. Discrete Hilbert space.** Standard quantum mechanics uses continuous Hilbert space and has been experimentally uncontradicted for over a century. There is no experimental evidence for discretization.

**2. Gravitational collapse via the Diósi-Penrose model.** RaQM relies on gravity-induced wavefunction collapse as described by the Diósi-Penrose model. The parameter-free version of this model was **experimentally ruled out in 2021** by the LNGS-INFN Gran Sasso laboratories.

**3. Extension to photonic systems.** Palmer substitutes relativistic mass-energy for rest mass to apply the (Newtonian) Diósi-Penrose framework to photons. Extending a Newtonian gravitational framework into post-Newtonian regimes without full justification is a significant theoretical leap.

Palmer's paper acknowledges that its predictions are "testable in less than 5 years." The PNAS publication reflects scientific merit worthy of discussion, not experimental confirmation.

---

## The Algorithmic Trajectory That Palmer Ignores

Even if you take RaQM seriously, the algorithmic trajectory of quantum factoring and discrete-log attacks tells a more urgent story:

| Year | RSA-2048 physical qubit estimate |
|------|----------------------------------|
| 2019 | ~20,000,000                      |
| 2025 | <1,000,000 (20x reduction)       |

Resource requirements have **never increased**---they drop by roughly an order of magnitude every two to three years.

The [Iceberg Quantum Pinnacle Architecture](https://arxiv.org/abs/2602.00000) (February 2026) claims RSA-2048 can be broken with fewer than 100,000 physical qubits using quantum low-density parity-check codes instead of surface codes. The current best estimate for logical qubits needed: approximately **1,399**---already within 40% of Palmer's ceiling.

---

## The ECC Problem Is Worse

Here is what I find most striking, and what connects directly to my [previous post on Google's quantum threat to Bitcoin](/posts/google-quantum-bitcoin-ecdlp-breakthrough/).

A February 2026 EUROCRYPT paper by Chevignard, Fouque, and Schrottenloher estimates that breaking P-256 (the elliptic curve securing modern TLS, digital signatures, and cryptocurrency wallets) requires only **1,193 logical qubits**. That is the most space-efficient polynomial-time algorithm for the elliptic curve discrete logarithm problem to date.

1,193 qubits. Palmer's ceiling is 1,000.

Even under Palmer's own framework, we are within touching distance. And Palmer's ceiling assumes maximally favorable physical conditions that do not correspond to any real hardware. The realistic per-technology ceilings (200--400 qubits) are far below what current algorithms require, but the gap between the theoretical ceiling and the algorithmic requirement is **closing from both sides**: algorithms are getting more efficient while Palmer's ceiling has no experimental basis to begin with.

---

## Harvest Now, Decrypt Later

Even if you believe Palmer, the **harvest-now-decrypt-later (HNDL)** threat means the clock is already ticking. Adversaries are capturing encrypted traffic today for future decryption. Data with long confidentiality requirements---healthcare records, financial data, government communications---is already exposed.

NIST recommends deprecating quantum-vulnerable systems after 2030. NSA CNSA 2.0 requires migration by 2033 for national security systems. These timelines exist because the migration itself takes years, not because the threat is distant.

---

## What You Should Do

Palmer's paper is an interesting contribution to quantum foundations research. It deserves serious investigation by physicists. But it should not influence your cryptographic migration timeline. Here is why:

1. Standard quantum mechanics remains experimentally uncontradicted
2. RaQM has zero experimental confirmation
3. One of its key dependencies (Diósi-Penrose) has been experimentally falsified in its parameter-free form
4. Algorithmic compression continues relentlessly
5. ECC attacks already approach the 1,000-qubit threshold
6. HNDL exposure accumulates every day you wait

If you run infrastructure that depends on ECC or RSA:

- **Complete a cryptographic inventory** with focus on ECC deployments
- **Prioritize long-data-retention systems** (healthcare, finance, government)
- **Begin testing NIST post-quantum standards**: ML-KEM for key encapsulation, ML-DSA for digital signatures
- **Monitor algorithmic developments**, not just hardware milestones
- **Do not anchor your risk model to a single unverified theoretical framework**

The 1,000-qubit ceiling is an interesting hypothesis. It is not a security policy.
