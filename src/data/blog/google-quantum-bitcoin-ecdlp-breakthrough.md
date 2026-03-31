---
title: "Google Just Cut the Quantum Resources to Break Bitcoin's Cryptography by 20x"
author: Dendi Suhubdy
pubDatetime: 2026-03-31T00:00:00Z
featured: true
draft: false
tags:
  - quantum-computing
  - cryptography
  - post-quantum
  - bitcoin
  - elliptic-curve-cryptography
  - ethereum
description: "Google Quantum AI, the Ethereum Foundation, and Stanford published a 57-page whitepaper showing <500,000 physical qubits and ~9 minutes suffice to break Bitcoin and Ethereum's elliptic curve cryptography---a 20x reduction over prior estimates. This is not FUD. It is an engineering specification."
---

My phone rang at 4 AM this morning. Again.

Google Quantum AI just published ["Securing Elliptic Curve Cryptocurrencies against Quantum Vulnerabilities: Resource Estimates and Mitigations"](https://quantumai.google/static/site-assets/downloads/cryptocurrency-whitepaper.pdf)---a 57-page whitepaper that dramatically cuts the quantum resources needed to break the cryptography protecting Bitcoin, Ethereum, and every major cryptocurrency. The authors: Ryan Babbush, Adam Zalcman, Craig Gidney, Michael Broughton, Tanuj Khattar, and Hartmut Neven from Google Quantum AI, Thiago Bergamaschi from Google and UC Berkeley, Justin Drake from the Ethereum Foundation, and Dan Boneh from Stanford.

This is not a single-lab exercise. The people building the quantum hardware sat down with the people building the blockchain infrastructure and one of the world's foremost cryptographers, and together they wrote what amounts to an engineering threat assessment for the entire cryptocurrency ecosystem.

---

## The Numbers

The paper presents two optimized circuit variants for solving the 256-bit Elliptic Curve Discrete Logarithm Problem (ECDLP) on secp256k1---the curve underpinning Bitcoin, Ethereum, and most major blockchains:

| Variant | Logical Qubits | Toffoli Gates |
|---------|---------------|---------------|
| Low-qubit | $\leq 1{,}200$ | $\leq 90$ million |
| Low-gate | $\leq 1{,}450$ | $\leq 70$ million |

On a standard superconducting architecture---planar degree-four connectivity, surface code error correction, $10^{-3}$ physical gate error rates---these circuits can execute on **fewer than half a million physical qubits**. That represents a **nearly 20-fold reduction** over the best prior estimates for physical qubit count.

The runtime is equally striking. Assuming a 10-microsecond control system reaction time (standard for superconducting qubits) and a 50% overhead per Toffoli gate, the full computation resolves in 18 to 23 minutes. But here is the critical detail: because a quantum computer can *precompute* the first half of Shor's algorithm (which depends only on public protocol parameters common to all addresses) and wait in a "primed" state until a public key is revealed, the actual attack from the moment a transaction is broadcast takes roughly **9 minutes**.

Nine minutes. Bitcoin's average block time is ten.

---

## Three Classes of Attack

The paper introduces a taxonomy of quantum attacks on blockchains that I expect will become standard:

1. **On-Spend Attacks.** The attacker intercepts a transaction in the mempool, derives the private key from the newly exposed public key, and forges a competing transaction---all before the original is confirmed. This requires solving ECDLP within the block time: ~10 minutes for Bitcoin, ~12 seconds for Ethereum, ~400 milliseconds for Solana. The Google estimates show a superconducting CRQC could execute this against Bitcoin.

2. **At-Rest Attacks.** The attacker targets public keys that are already exposed on-chain---dormant wallets, reused addresses, Pay-to-Public-Key (P2PK) scripts. No time pressure. The paper estimates **1.7 million BTC** (nearly 9% of all bitcoin) is locked in P2PK scripts vulnerable to at-rest attacks. The total quantum-vulnerable dormant bitcoin may reach **2.3 million BTC** across all script types.

3. **On-Setup Attacks.** A one-time offline quantum computation that produces a universal reusable backdoor into a cryptographic protocol. Think: recovering "toxic waste" from a powers-of-tau trusted setup ceremony. Bitcoin is immune, but Ethereum's Data Availability Sampling mechanism, privacy protocols like Tornado Cash, and scaling solutions are vulnerable.

The paper draws a critical architectural distinction: "fast-clock" platforms (superconducting, silicon, photonic) with gate times in the microsecond range can potentially execute on-spend attacks. "Slow-clock" platforms (neutral atom, ion trap), whose elementary operations are two to three orders of magnitude slower, would initially be limited to at-rest attacks. This distinction determines which mitigation strategies are needed and when.

---

## The ECC Blind Spot

I have been arguing for years that elliptic curve cryptography was dangerously under-researched relative to RSA from the perspective of quantum attack complexity.

RSA-2048 became quantum computing's unofficial benchmark. It absorbed the lion's share of algorithmic optimization work: better windowed arithmetic, improved modular exponentiation circuits, tighter error correction overhead estimates. Paper after paper refined the resource estimates for factoring, while the cryptographic primitive protecting *trillions of dollars* in cryptocurrency value sat largely ignored.

The thesis was simple: once top researchers apply the same optimization intensity to ECC, the estimates will plummet.

Google's paper validates this in their own words. They note that breaking RSA and simulating quantum chemistry "have been the focus of significantly more published research historically than quantum algorithms for breaking ECDLP," and that "it may be the case that algorithms for those applications are closer to optimal than they are for ECDLP."

Read that again. The team that just achieved a 20x reduction is telling you they may not be done.

---

## The Zero-Knowledge Proof

This paper does something I have never seen in a quantum resource estimation paper: it ships a *cryptographic proof of correctness*.

The authors face a genuine tension. Publishing detailed quantum circuits for breaking ECDLP hands a blueprint to adversaries. Withholding details makes the community skeptical---and the cryptocurrency community has good reason to be skeptical of unsubstantiated quantum threat claims. Their solution is elegant: a zero-knowledge proof using the [SP1 zkVM](https://docs.succinct.xyz/) that verifies their classical reversible circuit correctly computes elliptic curve point addition on secp256k1, tested against 9,000 random inputs, without revealing the circuit itself.

The ZK proof is committed to via a SHA-256 hash of the circuit (a cryptographic "digital fingerprint"), with random test inputs generated by a SHAKE256 CSPRNG seeded from the raw circuit bytes---an approach grounded in the Fiat-Shamir heuristic. The Rust code and proof are publicly available on [Zenodo](https://zenodo.org).

This is a methodological innovation. It establishes a new paradigm for responsible disclosure in quantum cryptanalysis: you can demonstrate that a vulnerability is real, and that your resource estimates are grounded in a working circuit, without handing over the attack itself.

---

## Why This Paper Is Different

Readers of [PostQuantum.com](https://postquantum.com) know I do not trade in quantum FUD. I have spent years fighting it---debunking sensationalized timelines, challenging papers built on unproven hardware assumptions, and publishing the CRQC Readiness Benchmark specifically to separate engineering reality from hype.

This paper is not FUD. It is different from the noise for several reasons:

1. **The team.** Craig Gidney is the author of the previous best estimates for quantum factoring of RSA. Dan Boneh literally wrote the textbook on cryptography. Justin Drake is a core Ethereum researcher. These are not outsiders making claims---they are the people closest to both the attack and the defense.

2. **Conservative hardware model.** Surface codes with planar degree-four connectivity and $10^{-3}$ error rates---consistent with scaled-up versions of hardware Google has already demonstrated experimentally. No exotic qLDPC codes. No speculative connectivity assumptions.

3. **Responsible disclosure.** The paper underwent a disclosure process including the U.S. government before public release. The specific quantum circuits are withheld; only the resource estimates and a ZK proof of correctness are shared.

4. **Self-aware about limitations.** The authors explicitly note that more aggressive hardware assumptions (bicycle qLDPC codes, Pinnacle architecture) could push qubit counts below 100,000---but they decline to rely on undemonstrated hardware.

This paper almost certainly explains why Google announced its 2029 PQC migration deadline days ago. When the organization building the hardware tells you the engineering specification for breaking cryptocurrency cryptography just improved by 20x, you should listen.

---

## The Companion Result: Neutral Atoms

On the same day, a team from Oratomic, Caltech, and UC Berkeley---including Dolev Bluvstein, John Preskill, and Manuel Endres---published a companion paper showing Shor's algorithm can run at cryptographically relevant scales with as few as **10,000 neutral atom qubits**.

Different architecture. Different tradeoffs. Same conclusion.

The convergence of two independent results on the same day, from different research groups using fundamentally different quantum computing platforms, is the kind of signal that should not be ignored. When one team finds a tighter bound, it could be an artifact of optimistic assumptions. When two teams find it simultaneously via orthogonal approaches, the bound is probably real.

---

## The Dormant Asset Problem

Perhaps the most sobering section of the paper addresses what happens to cryptocurrency that *cannot* be migrated to post-quantum cryptography.

Active wallets can, in principle, move to PQC-protected addresses through a protocol upgrade. But dormant assets---wallets whose owners have lost their keys, died, or simply stopped paying attention---cannot migrate. They are frozen in quantum-vulnerable cryptography forever. The paper estimates 1.7 million BTC in P2PK scripts alone, worth tens of billions of dollars at current prices, sitting as permanent targets.

The authors explore several policy frameworks:

- **Do Nothing, Burn, and Hourglass.** Let the assets be stolen, destroy them preemptively, or implement a time-locked transition period.
- **Bad Sidechain.** Move vulnerable assets to a segregated chain.
- **Digital Salvage.** Classify quantum recovery of dormant assets as a regulated activity, analogous to recovery of sunken treasure.

The "digital salvage" concept is particularly striking---a legal framework that acknowledges quantum key recovery will happen and attempts to channel it into legitimate, taxable economic activity rather than leaving it to criminals or state actors. The paper argues this is more realistic than attempting to destroy the assets or pretending the problem does not exist.

---

## What This Means

Let me be precise about what this result does and does not imply.

**What it does not mean:** Bitcoin is broken tomorrow. Building a ~500,000-qubit fault-tolerant quantum computer remains an extraordinary engineering challenge. The current state of the art is measured in hundreds to low thousands of physical qubits, with error rates still being driven below threshold.

**What it does mean:** The *engineering specification* for a cryptographically relevant quantum computer (CRQC) just got dramatically more achievable. The gap between "where quantum hardware is today" and "where it needs to be to break ECC" narrowed by 20x in a single paper. And the authors are telling us there is likely more optimization headroom remaining.

For those building on or holding cryptocurrency:

- **Post-quantum migration is no longer optional planning.** It is an engineering emergency. The paper's closing line: "the safest course of action for the cryptocurrency community is to begin preparing itself against quantum attacks immediately."
- **The "harvest now, decrypt later" threat is already active on blockchain.** Every public key that has ever appeared on-chain is a permanent target. Unlike TLS sessions that expire, blockchain transactions are immutable and public.
- **ECC requires fewer qubits to break than RSA.** The resource requirements for breaking 256-bit ECDLP are now roughly half those for RSA-2048. The crypto ecosystem's near-total dependence on secp256k1 is a concentrated, systemic risk.
- **On-spend attacks are architecturally feasible.** A superconducting CRQC that can perform at-rest attacks can likely also intercept live transactions on Bitcoin. The 9-minute primed runtime fits within Bitcoin's 10-minute block interval.

For the quantum computing research community:

- **ECC optimization is an open frontier.** The authors themselves flag that ECDLP has received less optimization attention than RSA or quantum chemistry. Further reductions should be expected.
- **Cross-platform convergence is a strong signal.** Google (superconducting) and Oratomic/Caltech (neutral atom) arriving at compatible conclusions via independent architectures suggests the resource estimates are converging on physical reality.
- **The ZK proof methodology is reusable.** Future quantum cryptanalysis papers can adopt this disclosure framework to share threat assessments responsibly.

---

## Full Analysis

The complete technical breakdown---including comparison against prior work by [Litinski (2023)](https://arxiv.org/abs/2306.08585), Gidney's own RSA estimates, and the Pinnacle architecture, plus CRQC capability mapping and the ZK proof appendix---is available at [PostQuantum.com](https://postquantum.com/security-pqc/google-quantum-bitcoin-ecdlp/).

The clock is ticking. The mathematics does not care whether we are ready.
