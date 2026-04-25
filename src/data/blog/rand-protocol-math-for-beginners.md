---
title: "The Math Behind Rand Protocol: A Friendly Walkthrough"
author: Dendi Suhubdy
pubDatetime: 2026-04-25T00:00:00Z
featured: false
draft: false
tags:
  - cryptography
  - blockchain
  - zero-knowledge-proofs
  - post-quantum
  - byzantine-fault-tolerance
description: A beginner-friendly tour of the mathematics behind Rand Protocol — a privacy-preserving, post-quantum blockchain that combines BFT consensus with GPU-driven zero-knowledge proving. We unpack the cryptographic primitives, the consensus protocol, and the security proofs in language a first-year graduate student in mathematics can follow.
---

The original Rand Protocol whitepaper is dense. It assumes you already know what a Merkle tree, a STARK, a quorum certificate, and the Module-LWE problem are. If you don't, the formal definitions can feel like a wall.

This post walks through the same mathematics in a friendlier way. The audience I have in mind is a beginner-level mathematician — someone comfortable with proofs, modular arithmetic, and basic probability, but who has not yet spent a year reading IACR papers. Where the whitepaper writes a definition, I explain the intuition first, then the symbols. Where the whitepaper writes a proof, I sketch the idea before the algebra.

The protocol itself is what you'd get if you tried to design a privacy-preserving blockchain that can survive both a Byzantine adversary today *and* a quantum computer ten years from now. That sounds ambitious, and it is — but the building blocks are by now standard, and the mathematics is more accessible than the literature suggests.

## What Rand Is, in One Paragraph

Rand combines two ideas. First, **Byzantine Fault Tolerant consensus** (specifically HotStuff): a small set of validators agree on the next block in 2–6 seconds with deterministic finality, tolerating up to one third of them being malicious. Second, **GPU-driven zero-knowledge proving**: anyone with a GPU can earn tokens by generating STARK proofs that authorize private transactions. The first gives speed and decentralized agreement; the second gives privacy and a permissionless entry point. The protocol runs on the Solana Virtual Machine (SVM), uses a dual-token economy (ATLAS for public gas and validator stake, **SHRUGG** for private gas and prover rewards), and chooses cryptographic primitives that remain secure under quantum attack.

## The Cryptographic Building Blocks

Before any consensus or privacy logic, we need three primitives. Each can be defined in one or two lines, so let's get them out of the way.

### Hash Functions

A *hash function* $H : \{0,1\}^* \to \{0,1\}^\lambda$ takes any-length input and produces a fixed-length output of $\lambda$ bits. We say $H$ is **collision-resistant** if no efficient adversary can find two distinct inputs $x \neq x'$ with $H(x) = H(x')$ except with negligible probability.

"Negligible" has a precise meaning here: it's a function $\epsilon(\lambda)$ that shrinks faster than any inverse polynomial as $\lambda$ grows. For practical purposes, $\epsilon(2^{128}) \approx 0$ — small enough that you'd need more energy than the sun emits to brute-force.

Rand uses SHA-3 and BLAKE3 as its hash functions. Both give 128 bits of post-quantum collision resistance, which I'll explain below.

### Digital Signatures

A *signature scheme* is a triple $\Sigma = (\mathsf{KeyGen}, \mathsf{Sign}, \mathsf{Verify})$:

- $\mathsf{KeyGen}(1^\lambda) \to (pk, sk)$ — produces a public/secret key pair.
- $\mathsf{Sign}(sk, m) \to \sigma$ — produces a signature on message $m$.
- $\mathsf{Verify}(pk, m, \sigma) \to \{0,1\}$ — checks the signature.

The security property is **existential unforgeability under chosen-message attack** (EUF-CMA): an adversary who can request signatures on any messages of their choosing still cannot produce a valid signature on a *new* message. This is the cryptographic version of "even if you watch me sign a thousand documents, you can't forge my signature on a thousand-and-first."

Rand uses **CRYSTALS-Dilithium**, a NIST-standardized lattice-based signature scheme. Public keys are 1,312 bytes; signatures are 2,420 bytes. That's larger than ECDSA, but the trade-off is that lattice problems remain hard for quantum computers.

### Commitment Schemes

A commitment lets you "lock in" a value without revealing it, and later "open" it to prove what you committed to. Two properties matter:

- **Hiding:** the commitment $\mathsf{Comm}(m; r)$ reveals nothing about $m$ (because $r$ is random).
- **Binding:** you cannot later claim the commitment was for a different value.

Rand uses **Pedersen commitments**:

$$\mathsf{Comm}(v; r) = v \cdot G + r \cdot H$$

where $G, H$ are independent generators of an elliptic-curve group of prime order $q$. Hiding follows from $r$ being uniformly random; binding follows from the discrete log between $G$ and $H$ being unknown.

### Zero-Knowledge Proofs

This is the magical primitive. A zero-knowledge proof system for a relation $R$ lets a *prover* convince a *verifier* that they know a witness $w$ for a statement $x$ (i.e., $(x, w) \in R$), without revealing anything about $w$.

Three properties define it:

- **Completeness:** if the prover knows a valid $w$, the verifier accepts.
- **Soundness:** if no valid $w$ exists, no cheating prover can convince the verifier (except with negligible probability).
- **Zero-knowledge:** the verifier learns nothing about $w$ beyond the fact that one exists. Formally, there exists a *simulator* that can produce verifier-indistinguishable transcripts using only $x$.

Rand uses **STARKs** (Scalable Transparent Arguments of Knowledge). The two adjectives matter: *scalable* means proof verification is logarithmic in the size of the computation; *transparent* means there is no trusted setup ceremony. Proof size is $O(\log^2 n)$ for a computation of size $n$, and verification takes $O(\log^2 n)$ time. Concretely, a private-transfer proof is 50–200 KB and verifies in 2–5 ms.

### Byzantine Fault Tolerance

Finally, the consensus primitive. A protocol is **Byzantine fault tolerant** if it maintains *safety* (no two honest nodes disagree) and *liveness* (the protocol keeps making progress) even when up to $f$ of $n$ nodes behave arbitrarily — including lying, colluding, or going silent.

The classical Lamport–Shostak–Pease result says you need

$$n \geq 3f + 1$$

That is: to tolerate $f$ Byzantine nodes you need at least $3f + 1$ total nodes. Equivalently, fewer than one third can be malicious.

## The Dual-Token Architecture

Most privacy-preserving blockchains pay for gas in the same token they hold. Rand splits the gas token in two, and there is a real mathematical reason for this.

### Why Two Tokens

Suppose Alice has a public identity tied to address $A$, and she wants to make a private transaction $\text{tx}_{\text{priv}}$. If she pays gas for $\text{tx}_{\text{priv}}$ from $A$, an observer can chain the inferences:

$$\text{tx}_{\text{priv}} \xleftarrow{\text{gas payment}} A \xleftarrow{\text{ownership}} \text{Alice}$$

The privacy of the transaction body is irrelevant — the gas payment alone deanonymizes the sender. This is a *gas payment privacy leak*, and it's a theorem, not just a pitfall: in any single-token system where private transactions pay gas in the public token, an adversary can correlate private transactions with public identities through gas patterns.

Rand fixes this by giving private transactions their own gas token, **SHRUGG**, which can itself be held in shielded form and spent for gas *inside* the zero-knowledge circuit. The relation the prover must satisfy looks like:

$$R_{\text{private gas}} = \begin{cases} \text{Valid private transfer proof} \\ \land \ \text{Gas note nullifier valid} \\ \land \ \text{Gas amount} \geq \text{required fee}\end{cases}$$

So the gas payment itself is part of the zero-knowledge proof. The chain of inferences above is broken at the first arrow.

### The Two Roles

- **ATLAS** is the public utility token. It pays gas for public (transparent) transactions, serves as validator stake, carries governance voting power, and partially backs the USDB stablecoin.
- **SHRUGG** is the private utility token. It pays gas for private transactions, rewards GPU provers who generate the zero-knowledge proofs that authorize those transactions, and also partially backs USDB.

The diversification matters for the stablecoin: ATLAS price reflects validator demand and public-transaction throughput, while SHRUGG price reflects proof-generation demand. Their correlation is low, which makes the basket more stable than either alone.

### Resource Accounting

Public and private transactions consume different resources:

| Resource         | Public tx         | Private tx                |
| ---------------- | ----------------- | ------------------------- |
| SVM computation  | High              | Low                       |
| State storage    | Variable          | Fixed (one commitment)    |
| Bandwidth        | Low               | High (50–200 KB proofs)   |
| GPU proving      | None              | High (3–10 seconds)       |
| Verification     | Signature only    | STARK verification        |

Two gas tokens let you price these accurately without one transaction type subsidizing the other.

## Consensus: HotStuff BFT

Rand uses HotStuff, a BFT protocol with **linear message complexity** (most BFT protocols are $O(n^2)$). The protocol proceeds in *views*, each with a designated leader.

### Quorum Certificates

A **Quorum Certificate** (QC) for block $B$ at view $v$ is a set of signatures from at least $2f + 1$ validators on the tuple

$$(B.\text{hash}, v, \text{type})$$

where $\text{type} \in \{\text{prepare}, \text{precommit}, \text{commit}\}$. A QC is the protocol's way of saying "a supermajority of validators agreed to this." Each block goes through three QC stages — prepare, pre-commit, commit — before being finalized.

### Why Three Phases

The three-phase structure exists to handle the case where a leader is replaced mid-flight without the network ever committing to two conflicting blocks. Two-phase BFT (like the original PBFT) needs a more complex view-change subprotocol; HotStuff's third phase eliminates that complexity at the cost of one extra round of voting.

### Leader Selection

Leaders are picked deterministically using a stake-weighted **Verifiable Random Function** (VRF):

$$\text{Leader}(v) = V_{\text{active}}[i], \quad i = \mathsf{VRF}(\text{epoch seed}, v) \bmod |V_{\text{active}}|$$

A VRF is essentially a signature scheme whose output is also a uniform-looking random string — anyone can verify the leader was chosen correctly, but no one can predict or grind the next leader without breaking the VRF. This blocks **grinding attacks**, where an adversary tries many candidate seeds to bias future leader selection.

### Safety Theorem

Here is the proof I think is worth seeing in full because the algebra is clean.

**Theorem (Safety).** *If fewer than $f < n/3$ validators are Byzantine, no two honest validators commit to conflicting blocks.*

**Proof.** Suppose for contradiction that honest validators $V_1, V_2$ commit to conflicting blocks $B, B'$ at the same height. Each commit required a commit-QC, so

$$|S_B| \geq 2f + 1, \qquad |S_{B'}| \geq 2f + 1$$

where $S_B$ is the signing set for $B$. With $n = 3f + 1$ total validators, inclusion–exclusion gives

$$|S_B \cap S_{B'}| \geq (2f+1) + (2f+1) - (3f+1) = f + 1.$$

So at least $f+1$ validators signed *both* blocks. By assumption, at most $f$ are Byzantine, so at least one *honest* validator signed both — but the protocol forbids honest validators from doing that. Contradiction. $\blacksquare$

The whole argument is a counting bound on intersection sizes. This is what's beautiful about BFT proofs: the security reduces to elementary combinatorics applied to overlapping quorums.

### Slashing

Byzantine behavior is also discouraged economically:

| Violation                    | Slash | Jail        |
| ---------------------------- | ----- | ----------- |
| Double-signing               | 33%   | Permanent   |
| Extended downtime (>24h)     | 1%    | 7 days      |
| Invalid block proposal       | 50%   | Permanent   |
| Provable censorship          | 10%   | 30 days     |

This is what eliminates the **nothing-at-stake** problem — in PoS without slashing, a rational validator might sign every fork "just in case," because there's no cost. With 33% slashing for double-signing, that strategy has expected return $-0.33 \cdot S$ and is dominated.

## Privacy: STARKs Over Note Commitments

Rand's privacy system uses a UTXO-style "note" model, where each unit of private value is a record committed into a Merkle tree.

### Notes, Commitments, Nullifiers

A **private note** is a tuple

$$\text{note} = (v, \text{asset}, \rho, r, \text{pk}_{\text{owner}})$$

where $v$ is the value, $\text{asset}$ is the asset identifier, $\rho$ is a unique nullifier seed, $r$ is randomness, and $\text{pk}_{\text{owner}}$ is the owner's public key. Notes are stored only as their commitments:

$$\text{cm} = H(H(\text{pk}_{\text{owner}}) \,\|\, v \,\|\, \text{asset} \,\|\, \rho \,\|\, r)$$

To spend a note, the owner publishes its **nullifier**:

$$\text{nf} = H(\text{sk} \,\|\, \rho)$$

Two properties are doing all the work here. First, the nullifier is *deterministic in the secret key and seed*, so any attempt to spend the same note twice produces the same $\text{nf}$, which validators can detect. Second, the nullifier is *unlinkable to the commitment*: given $\text{nf}$, you cannot tell which $\text{cm}$ it spent without knowing $\text{sk}$.

### The Transfer Circuit

To make a private transfer, the sender produces a STARK proof for the relation:

The relation $R_{\text{transfer}}$ that the prover must satisfy is the conjunction of five conditions. Letting $\{\text{note}^{\text{in}}_i\}$ be the input notes and $\{\text{note}^{\text{out}}_j\}$ the output notes:

1. **Membership.** Every input commitment is in the Merkle tree: for all $i$, $\mathsf{MerkleVerify}(\text{rt}, \text{cm}^{\text{in}}_i, \text{path}_i) = 1$.
2. **Nullifier correctness.** Each nullifier is correctly derived from the secret key and the note's seed: $\text{nf}_i = H(\text{sk} \Vert \rho_i)$.
3. **Commitment correctness.** Each output commitment is correctly formed: $\text{cm}_j = \mathsf{Commit}(\text{note}^{\text{out}}_j)$.
4. **Value conservation.** Total value in equals total value out: $\sum_i v^{\text{in}}_i = \sum_j v^{\text{out}}_j$. No minting, no burning.
5. **Asset preservation.** All input and output notes share the same asset type.

The verifier sees only the public inputs — the Merkle root $\text{rt}$, the nullifiers $\{\text{nf}_i\}$, the new commitments $\{\text{cm}_j\}$, and the asset identifier — and is convinced that all five conditions hold without learning *which* notes were spent, *who* the parties are, or *how much* changed hands.

### Why STARKs

Rand's STARK uses the Goldilocks field $\mathbb{F}_p$ with $p = 2^{64} - 2^{32} + 1$ (chosen for fast arithmetic on 64-bit CPUs and GPUs), BLAKE3 as the hash, blowup factor 8, and 30 FRI queries. This gives 100+ bits of soundness, ~120 KB proofs, and 2–5 ms verification.

The key reason for STARKs over SNARKs is **post-quantum security**: STARK soundness rests only on the collision resistance of a hash function, while many SNARKs use elliptic-curve pairings that fall to Shor's algorithm.

### Recipient Notification

To inform the recipient of a new note, the sender attaches an encrypted output:

$$\text{enc note} = \mathsf{Enc}_{\text{pk}_{\text{recipient}}}(\text{note})$$

using **CRYSTALS-Kyber** for post-quantum key encapsulation. The recipient scans new commitments, tries to decrypt each attached ciphertext with their secret key, and recovers any notes addressed to them.

## Supply Auditability

A privacy chain must answer an awkward question: how do we know nobody is silently minting tokens inside the shielded pool?

For ATLAS (the public token), supply is just an arithmetic sum:

$$S_{\text{ATLAS}}(h) = S_{\text{initial}} + \sum_{i=0}^{h} \text{BlockReward}(i) + \sum_{i=0}^{h} \text{StakingRewards}(i) - \sum_{i=0}^{h} \text{Burned}(i)$$

with $S_{\text{initial}} = 500{,}000{,}000$ ATLAS at genesis. Every block header carries the running total and the delta, both of which are verifiable from public data.

SHRUGG is similar in shape:

$$S_{\text{SHRUGG}}(h) = S_{\text{initial}} + \sum_{i=0}^{h} \text{ProvingRewards}(i) + \sum_{i=0}^{h} \text{DemandBonus}(i) - \sum_{i=0}^{h} \text{Burned}(i)$$

with $S_{\text{initial}} = 200{,}000{,}000$ SHRUGG. Demand bonuses are deterministic from on-chain proof activity:

$$\text{multiplier}(\text{epoch}) = \max\!\left(0.5,\ \min\!\left(2.0,\ 1 + \frac{\text{proofs}_{\text{epoch}} - \text{target}}{\text{target}}\right)\right)$$

so when proof demand exceeds target, prover rewards inflate (capped at $2\times$), and when demand collapses, rewards deflate (floored at $0.5\times$).

The hard part is auditing the *shielded pool*, where individual balances are hidden by design. Rand handles this with a zero-knowledge supply proof:

$$R_{\text{supply audit}} = \begin{cases} \text{every committed note appears in the root} \\ \sum (\text{note values}) = \text{shielded balance} \\ \text{all note values} \geq 0 \end{cases}$$

Anyone can verify the *aggregate* shielded supply equals the publicly claimed shielded balance, even though no individual note value is revealed.

## Post-Quantum Security

The most distinctive feature of Rand is its commitment to remaining secure when quantum computers arrive. Two algorithms threaten classical cryptography:

- **Shor's algorithm** factors integers and computes discrete logarithms in polynomial time on a quantum computer. It breaks RSA, Diffie–Hellman, and ECDSA.
- **Grover's algorithm** searches an unstructured space of size $N$ in $O(\sqrt{N})$ quantum queries instead of $O(N)$. It halves the effective security of symmetric primitives.

### Resistance to Shor

Rand uses no primitive that Shor's algorithm can attack:

- **Signatures:** CRYSTALS-Dilithium is lattice-based (Module-LWE / Module-SIS).
- **Key encapsulation:** CRYSTALS-Kyber is also lattice-based.
- **ZK proofs:** STARKs rely only on hash collision resistance.
- **Hashing:** SHA-3 and BLAKE3 are symmetric, not affected by Shor.

The hard problem under all of this is **Module-LWE** (Module Learning With Errors). Informally, given a random matrix $\mathbf{A}$ over the polynomial ring $R_q = \mathbb{Z}_q[X]/(X^n+1)$ and a vector $\mathbf{b} = \mathbf{A}\mathbf{s} + \mathbf{e}$ where $\mathbf{s}, \mathbf{e}$ are small, distinguish $\mathbf{b}$ from uniform. No efficient algorithm — classical or quantum — is known.

### Grover's Impact

Grover halves bit-security against unstructured search. So:

- A 256-bit hash gives 128 bits of *quantum* preimage resistance.
- A 256-bit hash gives roughly 85 bits of *quantum* collision resistance, by the BHT bound (collisions found in $O(2^{n/3})$ quantum queries).

For Rand, that means SHA-3-256 and BLAKE3-256 give 128 bits of quantum preimage security and roughly 85 bits of quantum collision security — which is the dominant term in the STARK soundness bound:

$$\epsilon_{\text{STARK}} \leq \epsilon_{\text{FRI}} + \epsilon_{\text{collision}} + q_H \cdot 2^{-\lambda}$$

This is acceptable for current parameters; if more quantum collision resistance is needed later, the system can move to 384- or 512-bit hashes at the cost of larger proofs.

## Attack Resistance

Many famous blockchain attacks have closed-form bounds in this framework. Three are worth highlighting.

### The 51% Attack Becomes a 67% Attack

In Nakamoto consensus, an adversary with 51% of hashpower can rewrite history. Under BFT consensus, the threshold is *higher*:

**Theorem.** *An adversary needs more than $2/3$ of stake to violate safety in BFT consensus.*

This follows immediately from the safety proof above: signing two conflicting blocks requires $f + 1$ honest signatures, so the adversary must control more than $2f$ of $3f+1$ stake — i.e., more than $2/3$.

### Eclipse Attacks

In an eclipse attack, an adversary surrounds a victim node with malicious peers. With $k$ outbound connections to diverse subnets, the eclipse probability is bounded by

$$\Pr[\text{Eclipse}] \leq \left(\frac{m}{N}\right)^k$$

where $m$ is the number of adversary-controlled nodes and $N$ is total network size. For $m/N = 0.1$ and $k = 8$, this is $10^{-8}$ — small enough to ignore.

### Sybil Attacks

The classic Sybil attack — creating many fake identities — is neutralized by stake-weighted voting:

$$\text{Power}(k \text{ identities with stake } S/k) = k \cdot \frac{S}{k} = S$$

Splitting $S$ across $k$ identities gives the same total power as one identity with $S$, so there is no Sybil benefit.

## Concrete Parameters

The whitepaper recommends these parameters for 128-bit security:

| Component                | Parameter                          | Security level                |
| ------------------------ | ---------------------------------- | ----------------------------- |
| Hash function            | SHA-3-256                          | 128-bit classical, 85-bit Q   |
| Signatures               | Dilithium2                         | 128-bit quantum               |
| Key encapsulation        | Kyber768                           | 192-bit quantum               |
| Symmetric encryption     | AES-256-GCM                        | 128-bit quantum               |
| STARK field              | Goldilocks $p = 2^{64}-2^{32}+1$   | —                             |
| FRI queries              | 30                                 | Soundness $2^{-100}$          |
| Validators               | $n = 100$                          | BFT $f < 33$                  |
| Minimum stake            | 100,000 ATLAS                      | Economic security             |
| Block time               | 2 seconds                          | —                             |
| Finality                 | 3 rounds (~6 seconds)              | Deterministic                 |
| Merkle tree depth        | 32                                 | $2^{32}$ notes                |
| Nullifier size           | 256 bits                           | 128-bit collision resistance  |

### Economic Security

With $n = 100$ validators and a minimum stake of 100,000 ATLAS at \$1 each, the cost to mount a safety-violating attack is bounded below by

$$\text{AttackCost} \geq \frac{n}{3} \cdot S_{\min} \cdot P_{\text{ATLAS}} + \text{SlashingLoss} \approx 33 \cdot 100{,}000 \cdot 1 + 0.33 \cdot 33 \cdot 100{,}000 \approx \$4.4\text{M}$$

That's the floor. In practice, validator stake will scale up well beyond the minimum, and ATLAS market cap will move the floor with it.

## Closing Thoughts

What I find appealing about the Rand design is that almost every choice has a *mathematical* justification rather than a heuristic one. The two-token gas split is forced by a privacy-leakage theorem. The 67% threshold is forced by the BFT safety proof. The choice of STARKs over SNARKs is forced by post-quantum requirements. The choice of Module-LWE is forced by Shor-resistance. The slashing fractions are calibrated against expected attack rewards.

There is no part of the protocol that requires you to take anything on faith. Every property is provable from a small list of standard cryptographic assumptions: collision resistance of the hash, Module-LWE/SIS hardness, and a partially synchronous network with $f < n/3$ Byzantine validators. If those assumptions hold, everything else follows.

The mathematics is, in the end, not exotic. It is mostly counting — counting overlapping quorums, counting collision queries, counting the cost of a Sybil identity. What is exotic is *how much you can build on top of those counts* if you are careful.

For readers who want the unabridged version, the formal whitepaper has the full statement of every theorem and a complete bibliography. This post was written to be the on-ramp.
