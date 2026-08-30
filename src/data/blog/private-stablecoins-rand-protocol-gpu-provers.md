---
title: "Private Stablecoins, GPU Provers, and the Rand Bridge"
author: Dendi Suhubdy
pubDatetime: 2026-08-30T06:00:00Z
featured: true
draft: false
tags:
  - stablecoins
  - privacy
  - zero-knowledge-proofs
  - gpu
  - cryptography
  - blockchain
  - post-quantum
  - economics
description: "Stablecoins moved trillions of dollars last year across ledgers where every payment is permanently public. This is a tour of what that costs, and of one way out: a shielded stablecoin bridge whose privacy proofs are manufactured by a competitive market of GPUs. We cover why privacy is a payments requirement rather than a luxury, how the Rand Protocol prover market and bridge fit together, what the economics of a proof actually look like, and what a graphics card is really doing during the five seconds it spends convincing the world you paid your rent."
---

Imagine your bank sent every one of your transactions to a public bulletin board. Not your name — just a number that follows you forever. Your salary, on the 1st, to the dollar. Your rent, on the 3rd. The clinic on the 12th. The lawyer in March. Your employer's payroll, in full, visible to their competitors. And the board is written in permanent ink: nothing is ever deleted, and anyone who ever learns that the number is _you_ learns everything you have ever done, backwards to the beginning of time.

That is not a thought experiment. That is a stablecoin.

Notice how strange the opening paragraph feels. It feels strange because a bank would never do that, and the reason people are comfortable keeping their money in one is that a bank is, above almost everything else, a confidentiality machine. Your balance is not a public fact. Your transfers are not a public fact. A stranger cannot query what you earn, who pays you, or what you spent it on — not with your account number, not with your name, not with a court order they do not have. Discretion is not a feature banks advertise; it is so deeply assumed that we only notice it when it fails.

That assumption is load-bearing for the entire economy. A supplier quotes one price to a distributor and a different one to a retailer, and neither learns the other's terms — so the deal happens. A company makes payroll without publishing its compensation bands, so it can hire. A firm builds a position, or funds an acquisition, or pays a settlement, without the market front-running it in the same hour. Businesses flourish inside that discretion, and most commercial arrangements we take for granted would simply not be agreed to if the ledger were readable by counterparties, competitors, and strangers.

Bank secrecy has a real cost, of course — it is also where fraud hides, and the last century of financial regulation is largely an argument about how much of it society will tolerate and under what supervision. But the resolution the world arrived at was never _abolish confidentiality_. It was: confidential by default, disclosed to the right party under the right process. Public chains skipped that debate entirely and shipped the opposite default.

Stablecoins — dollar-denominated tokens like USDC and USDT — have quietly become one of the largest payment rails on earth, settling volumes that put them in the same conversation as the card networks. They are used for payroll in Buenos Aires, for supplier invoices in Shenzhen, for remittances into Manila, for treasury operations at funds that would never describe themselves as crypto companies. And essentially all of that traffic runs on ledgers where every transfer is public, permanent, and machine-readable by anyone with a laptop.

The industry has a habit of calling this "transparency." A better word is _gossip_. This post is about what the gossip costs, and about one particular way to stop it: a shielded stablecoin bridge whose privacy is manufactured, on demand, by a competitive market of graphics cards.

---

## Table of contents

---

## 1. Why money needs to stop talking

There is a lazy version of the privacy argument that says people want privacy because they have something to hide. It is worth putting that aside immediately, because the real reasons are more boring and much more serious.

### Business runs on confidential prices

Consider a mid-sized importer paying forty suppliers in stablecoins. On a public chain, a competitor can read the _entire_ supply chain off the ledger in an afternoon: who the suppliers are, how much each one is paid, when payment terms slipped, which relationships are growing and which are dying. Payment data is the single most sensitive dataset a company has, which is why nobody publishes their accounts payable. Yet a company that adopts a public stablecoin for payments publishes it by default, continuously, in real time.

The same problem hits in the other direction for anyone paying salaries. Wire your team in USDC and you have published your compensation bands. Every employee can compute every other employee's pay. So can every recruiter.

### Personal safety is a physical problem

Ledger transparency plus one leaked address equals a targeting list. There is now a grim and well-documented pattern of physical attacks on people known to hold large balances — the industry euphemism is a "wrench attack," and the count of reported incidents has climbed every year since 2021. A public ledger is an unusually good reconnaissance tool: it tells an attacker not only who is worth robbing but exactly how much they can be robbed of, updated by the second.

For a journalist paid by a foreign newsroom, an activist receiving donations, or an ordinary person in a country with an aggressive state, the exposure is not financial. It is a list of who paid them and when.

### Fungibility: the coin that remembers

Cash does not care where it has been. Digital money on a public ledger does. Analytics firms cluster addresses, tag them, and sell the tags; exchanges and payment processors buy the tags and freeze funds whose history includes a hop they dislike — sometimes four or five hops back, through wallets the current owner has never interacted with. The result is a currency where two units are not worth the same amount, because one of them has a past.

This is a quiet but corrosive failure. A dollar that can be refused because of what a stranger did with it three owners ago is not really a dollar.

### The exposure is retroactive

One property makes ledger exposure unlike most privacy problems: it works backwards in time.

Ordinary data leaks are bounded by what someone managed to collect. A public chain is a complete, permanent archive that has _already_ been collected, by everyone, and copied to thousands of machines. A deanonymization technique invented in 2031 applies with full force to a payment you made in 2026. You cannot patch the past, you cannot rotate a key to undo it, and you cannot ask for it to be deleted. Whatever privacy a payment has is fixed at the moment it is made, forever.

That single fact is why the choice of privacy technology matters more here than almost anywhere else — a point we return to at the end, for readers who want the cryptographic version.

### Private, not opaque

The counter-argument arrives on schedule: privacy tooling attracts criminals, and regulators will not tolerate a black box.

Both halves are answerable, and answering them is a design requirement rather than a PR exercise. A well-built shielded system can prove, publicly and continuously, that _no money was created inside the shield_ — that the total hidden supply is exactly the amount that was deposited. It can hand a user a **viewing key** that discloses their own history to an auditor, a tax authority, or a court, without disclosing anyone else's. It can let a merchant prove a payment was received without revealing their balance.

The distinction that matters is between **confidentiality** and **unaccountability**. A bank ledger is confidential; it is not unaccountable. That is the target: the privacy properties of a bank account, with the settlement properties of a public chain, and none of the trust assumptions of either.

---

## 2. The machine: a shielded pool, a bridge, and a market for proofs

Now the constructive part. Rand Protocol is a privacy-preserving chain that runs the Solana Virtual Machine, reaches agreement using HotStuff Byzantine Fault Tolerant consensus, and — this is the unusual part — outsources the expensive privacy mathematics to a permissionless market of GPU owners. It carries two utility tokens: **ATLAS** for public gas, validator stake, and governance, and **SHRUGG** for private gas and prover rewards. The dollar-denominated asset that rides on top is **USDB**.

Here is how a private dollar payment actually happens.

### The coat check

The shielded pool is best understood as a coat check with no attendant.

When you deposit, you write down a description of your money — the amount, the asset, a secret of yours, and a big random number — put it in a sealed envelope, and hang the _sealed envelope_ on a public rack. Everyone can see there are eleven million envelopes on the rack. Nobody can see inside any of them. In the literature the envelope is a **commitment**, and the rack is a Merkle tree whose root is published in every block.

To spend, you do not open your envelope. Instead you publish a short string called a **nullifier**, derived from your secret and that specific envelope's random number. Two facts make this work. The nullifier is _deterministic_, so if you try to spend the same envelope twice you produce the identical string twice and the network rejects the second attempt. And it is _unlinkable_, so seeing the nullifier tells nobody which envelope on the rack it corresponds to.

Alongside the nullifier you publish a **zero-knowledge proof** — a mathematical object that convinces anyone, in a couple of milliseconds, that all of the following are true simultaneously:

- the envelope you are spending is genuinely on the rack;
- you know the secret inside it;
- you have not spent it before;
- the new envelopes you are hanging up contain exactly as much money as the one you took down — no minting, no burning;
- and the asset type didn't change halfway through.

The proof reveals none of the underlying facts. Observers see: a Merkle root, some nullifiers, some new commitments, and a proof that everything adds up. They do not see who paid whom, or how much.

Rand's proofs are **STARKs**. Two things follow from that choice: there is no trusted setup ceremony to go wrong, and the security of the proof rests on nothing more exotic than the difficulty of finding collisions in a hash function. The second property turns out to matter a great deal for a payment record that has to stay private permanently, which is the subject of the last section.

### The bridge: where the dollars come from

Rand does not print dollars. USDB has to be _backed_, which means real reserves have to exist somewhere and be locked while their shielded twin circulates.

The mechanism is a lock-and-mint bridge with a privacy step bolted onto the exit:

1. **Lock.** You send USDC (or USDT, or a tokenized T-bill) to a vault contract on Ethereum or Solana. The reserves stay there, publicly auditable, doing nothing.
2. **Attest.** Rand validators observe the deposit and produce a quorum certificate — a supermajority signature attesting that the lock really happened at that block height.
3. **Mint, shielded.** An equivalent amount of USDB is minted _directly into the shielded pool_ as a fresh commitment addressed to you. It never exists as a public balance.
4. **Circulate.** Inside the pool, USDB moves privately: salaries, invoices, remittances, all of it opaque to observers and provable to auditors who hold the relevant viewing key.
5. **Burn and unlock.** To exit, you prove ownership of shielded notes, burn them, and the vault releases the underlying reserves to an address of your choosing on the origin chain.

Two design details do most of the work here, and both are places where naive implementations leak everything.

**Gas.** If a private transaction pays its fee from a public, identity-linked balance, the privacy is theatre — an observer chains "this public address paid gas for that private transaction" and the sender is unmasked without ever breaking the cryptography. Rand's answer is that private gas is paid in SHRUGG, _inside the proof_, from a shielded note. The fee payment is one more clause in the same zero-knowledge statement. There is no public breadcrumb because there is no public transaction.

**Amounts and timing.** Privacy is a crowd, not a wall. If you deposit \$1,847.32 and someone withdraws \$1,847.32 nine seconds later, no cryptography can save you — the amount and the timing are the fingerprint. Real systems blunt this with standard denominations, deliberate delays before unshielding, and relayers who submit your exit transaction so the destination address is never funded by you. The technical term for the crowd you hide in is the **anonymity set**, and it is the number that actually determines your privacy — far more than the choice of proof system.

### The prover market: renting someone else's GPU

There is an inconvenient fact at the center of all of this: generating one of these proofs is _expensive_. It is seconds of saturated GPU work — hundreds of millions of field operations and tens of millions of hash invocations. Your phone cannot do it. Your laptop can, slowly, with the fans screaming.

So Rand turns proof generation into a market. A user who wants to make a private payment publishes a proving job. GPU operators — anyone from a single gaming rig to a rack of datacenter cards — compete to fulfill it, return the finished proof, and are paid in SHRUGG. This is the permissionless entry point to the network: no stake requirement, no validator election, just a card and a power bill.

**And here is the sharp edge, stated plainly:** to build a proof, the prover normally needs the witness — the very secrets the proof is designed to hide. Handing your witness to a stranger to save five seconds is not privacy. Any honest description of delegated proving has to say what is done about this, and the answer is a layered one:

- **Self-proving is the default for anyone who can.** If you have a GPU, you never delegate, and the question doesn't arise. Delegation is a convenience for phones and light clients.
- **Encrypt to a chosen prover.** The witness is sealed to one specific prover's key using a key encapsulation scheme (CRYSTALS-Kyber), so it is never broadcast. You choose whom to trust, per transaction, and you can rotate.
- **Stake and slash.** Provers post bonds. A prover caught leaking or censoring loses the bond. This converts a privacy risk into a priced, bounded economic one — imperfect, but the same trade every custodial relationship makes.
- **Compartmentalize.** A delegated prover sees one transaction, not an identity graph. Rotating provers across transactions means no single operator accumulates a linkable history.
- **Push the frontier.** The genuinely correct fix is delegating proof generation without revealing the witness at all — the research direction usually filed under _privacy-preserving delegation_ or _proof outsourcing_. It is an active area, it is not solved cheaply yet, and any protocol claiming otherwise deserves scepticism.

That is the honest state of the art: self-prove when you can, delegate with encryption and bonds when you can't, and treat the delegation trust as a known cost rather than pretending it isn't there.

---

## 3. The economics: what a private dollar costs to move

A privacy network is a three-sided market. Users buy confidentiality. Provers sell computation. Validators sell finality. The interesting question is where the price lands.

### The unit cost of one proof

Start from the metal, because everything else is layered on top of it.

A consumer GPU capable of proving — say a card in the RTX 4090 class — costs on the order of \$1,600 and draws around 450 watts under full load. Amortize the card over three years of continuous duty and you get roughly six cents an hour of capital cost. Electricity at ten cents per kilowatt-hour adds about four and a half cents an hour. Call it a dime an hour, all in, before overhead.

If a private transfer proof takes five seconds of that card, the raw resource cost of one proof is:

$$\text{cost}_{\text{proof}} \approx \$0.10/\text{hr} \times \frac{5\ \text{s}}{3600\ \text{s/hr}} \approx \$0.00014$$

Fourteen thousandths of a cent. Even multiplying by ten for orchestration, bandwidth for a 120 KB proof, failed jobs, and operator margin, the _floor_ on private-transaction fees is a fraction of a cent. Privacy, at the level of physics, is cheap. What has historically made it expensive is that nobody built a competitive market for the compute.

### Why the market clears near that floor

Proof generation is close to a commodity. The work is stateless, verifiable, and embarrassingly parallel: a job either produces a valid proof or it doesn't, and any prover's output is interchangeable with any other's. There is no brand, no switching cost, no relationship. Under those conditions, competition drives price toward marginal cost plus a thin risk premium — which is exactly what you want for a payments network, and exactly why the operators' margins will be thin.

Provers do have one lever: **latency**. A user who needs finality in two seconds will pay more than one who is happy to wait a minute. This is the same structure as an electricity market, where the price of a megawatt-hour delivered _right now_ is a different price from one delivered tomorrow at 3 a.m. Expect a spot market for urgent proofs, forward agreements for predictable batch traffic, and a spread between them.

### The thermostat

Left alone, a prover market has a boom-bust problem: demand spikes, rewards spike, everyone buys cards, demand normalizes, capacity is stranded, provers leave, and the next spike has no one to serve it.

Rand's damper is a demand-responsive multiplier on prover rewards, bounded above and below:

$$\text{multiplier}(\text{epoch}) = \max\!\left(0.5,\ \min\!\left(2.0,\ 1 + \frac{\text{proofs}_{\text{epoch}} - \text{target}}{\text{target}}\right)\right)$$

When proof volume runs above target, prover rewards inflate up to a ceiling of $2\times$, pulling capacity in. When volume collapses, rewards deflate to a floor of $0.5\times$, so the network is not paying a standing army to idle. The bounds matter more than the formula: an unbounded subsidy is an invitation to fake demand, and a subsidy with no floor guarantees capacity evaporates in every quiet week.

### Two tokens, and the trap to avoid

The two-token design has a clean justification on the privacy side — private gas has to be spendable inside the shield, or the gas payment deanonymizes the payer. Fine.

The design question that deserves much more scrutiny is what backs **USDB**. The whitepaper describes ATLAS and SHRUGG as partially backing the stablecoin, on the diversification argument that ATLAS tracks validator and public-throughput demand while SHRUGG tracks proving demand, and the two are weakly correlated.

The diversification claim is true and the conclusion is still dangerous. Backing a stablecoin with the protocol's own tokens is **endogenous collateral**, and endogenous collateral has a specific, spectacular failure mode: the value of the backing is correlated with confidence in the peg, so a loss of confidence destroys the collateral precisely when the collateral is needed. That is the mechanism that vaporized \$40 billion in the Terra/UST collapse in May 2022, and no amount of within-protocol diversification changes the sign of the correlation — both tokens go to zero in the same run.

The defensible structure is one that most people building this eventually converge on:

- **Exogenous reserves are the backing.** USDB is redeemable one-for-one against bridged USDC, USDT, or tokenized T-bills held in the vault. That is the peg.
- **Protocol tokens are a subordinate buffer, not backing.** ATLAS and SHRUGG can absorb small deficits, bridge dust, and operational shortfalls. They should never be counted toward the redemption guarantee.
- **The reserve ratio is proved, not asserted.** Because Rand can produce zero-knowledge supply proofs, the network can continuously prove that total USDB in existence — including the shielded portion nobody can see — equals the reserves locked in the vault. That is a materially stronger guarantee than a quarterly attestation from an accounting firm, and it is the single most valuable thing this architecture can offer a stablecoin.

Say the shielded supply is auditable and the peg is exogenous, and you have a credible private dollar. Say the peg is backed by your own governance token, and you have rebuilt UST with better cryptography.

### Where the fees go

The circular flow is simple enough to hold in your head. Users spend SHRUGG on private gas. That SHRUGG splits three ways: the majority to the prover who did the work, a slice to validators for consensus and verification, and a portion burned. The burn is the link between usage and scarcity — more private volume, more SHRUGG destroyed. Validators separately earn ATLAS from staking and public gas, and stand to lose up to a third of their stake for double-signing, which is what makes attacking the chain a losing trade rather than a free option.

### The centralization risk nobody should wave away

Every compute market with real margins consolidates. Bitcoin mining went from CPUs in bedrooms to ASIC farms next to hydroelectric dams in about six years. There is no law of nature preventing proof generation from following the same path — datacenter operators have cheaper power, cheaper capital, better cooling, and higher utilization than you do.

Two things push back, and neither is guaranteed to win. First, unlike ASIC mining, proving runs on general-purpose hardware; a GPU that stops being profitable at proving still renders video and trains models, so the capital is redeployable and the barrier to exit is low. Second, latency is geographic — a user in Jakarta who wants a two-second proof is better served by a card in Jakarta than by a rack in Virginia, which creates durable regional niches that a single mega-operator cannot serve from one location.

Whether that is enough is an empirical question, and it will be answered by the shape of the market in a few years rather than by anything in a whitepaper.

---

## 4. What the GPU is actually doing for those five seconds

The phrase "generates a zero-knowledge proof" hides an enormous amount of machinery. Here is what is happening inside the card.

### The trick underneath: turn a computation into a polynomial

Every proof system starts by rewriting a computation as arithmetic. The prover runs the private transfer step by step and records the entire execution as a giant table — an **execution trace**. Each row is one moment in the computation; each column is one register or intermediate value. For a private transfer with a few inputs and outputs, verifying Merkle paths and computing hashes, the table is on the order of a million rows by a few dozen columns.

The rules of correct execution then become _constraints_ on that table: this cell must equal that cell plus this one, this column must be a valid hash of that one, the sum of these must equal the sum of those. A correct trace satisfies every constraint. A fraudulent one violates at least one.

Now the beautiful part. Interpret each column as the values of a polynomial, and the constraints become polynomial identities. Checking a polynomial identity everywhere is expensive; checking it at a few random points is cheap — and if two different polynomials of bounded degree agree at a randomly chosen point, they were almost certainly the same polynomial to begin with. That gap between "check everywhere" and "spot-check randomly" is where the entire efficiency of the system lives. The verifier does not re-run your computation. It spot-checks a polynomial and does arithmetic on the results.

### The four jobs that eat the GPU

Concretely, the prover's five seconds go into four phases:

**1. Arithmetization.** Build the trace. Cheap relative to what follows, and mostly bookkeeping.

**2. Low-degree extension.** Each column is stretched to a longer domain — with a blowup factor of 8, a $2^{20}$-row column becomes $2^{23}$ evaluations. Mathematically this is polynomial interpolation and evaluation; computationally it is a **Number Theoretic Transform**, which is an FFT done in modular arithmetic instead of complex numbers. This is usually the single largest cost.

**3. Merkle commitment.** Hash every one of those tens of millions of evaluations into a tree so the prover is bound to its answers before the verifier picks challenge points. Rand uses BLAKE3, and this phase is typically the second-largest cost — sometimes the largest, since these commitments happen once per FRI round, not once per proof.

**4. FRI folding.** Repeatedly halve the polynomial, committing at each round, until it is small enough to send outright. Each round is another NTT-plus-hash pass on progressively smaller data. Thirty random queries into the resulting structure buy roughly 100 bits of soundness.

Interleaved throughout is **Fiat–Shamir**: instead of a live verifier sending random challenges, the prover derives them by hashing its own commitments. That is what turns an interactive protocol into a single file you can post to a blockchain.

### Why a GPU and not a CPU

Look at what those four phases actually ask for and the hardware answer writes itself.

The NTT is a **butterfly network**: at each of roughly twenty stages, millions of independent pairs of numbers get combined with a multiply and an add. No pair depends on any other within a stage. That is the exact shape a GPU is built for — thousands of arithmetic units all doing the same operation on different data, which is why the same silicon that shades pixels and multiplies neural network weights also proves cryptographic statements.

Merkle hashing is even simpler to parallelize: one thread per leaf, then one thread per pair, and so on up the tree. Tens of millions of independent BLAKE3 invocations, with a synchronization barrier between levels.

The field is chosen to suit the hardware, not the mathematician. Rand uses the **Goldilocks** prime, $p = 2^{64} - 2^{32} + 1$. It fits in a single 64-bit register, and its special form means reduction modulo $p$ costs a couple of additions and shifts rather than a division. Compare that to a 256-bit prime, where every multiplication becomes a multi-word big-integer routine. The choice of prime is a hardware decision that shows up directly in throughput.

One subtlety worth knowing, because it explains the shape of the hardware market: this workload is usually **memory-bandwidth-bound, not FLOP-bound**. A $2^{23}$-element column is 64 megabytes; several of them, across multiple rounds, blow past any cache, and the NTT's access pattern strides across memory in a way that punishes locality. What determines proving throughput is how fast the card can move field elements between memory and compute units, not its peak arithmetic rate. That is why HBM-equipped datacenter cards dominate on very large traces, while consumer cards with cheaper GDDR often win on cost-per-proof for the small ones — and why "cost per proof" and "proofs per second" pick different winners.

The headline number: proof generation that takes minutes on a well-optimized CPU takes seconds on a GPU. Roughly an order of magnitude, sometimes more. That gap is the difference between a privacy system that is a research curiosity and one you can use to pay for lunch.

### Proofs about proofs

One more idea makes the whole thing scale. Verifying a STARK is itself a computation — so you can write a circuit that _verifies a STARK_, and prove that. Feed a thousand transaction proofs into an aggregation circuit and out comes one proof attesting that all thousand were valid.

This is why block verification stays cheap no matter how much traffic the network carries. Validators do not check a thousand proofs; they check one, in a few milliseconds. The cost of privacy is pushed entirely onto a parallel, competitive, permissionless market of GPU operators who are paid for it — which was the design goal from the start.

### How long it all takes

It is worth putting real numbers on this, because the asymmetry between making a proof and checking one is the single most counterintuitive thing in the system.

Building a private transfer proof on a GPU takes **roughly three to ten seconds**, depending on the card, the number of inputs and outputs, and how deep the Merkle tree is. The same work on a well-optimized CPU takes minutes. Verifying that proof takes **two to five milliseconds**, on one core, on any laptop.

That is a ratio of about a thousand to one. The prover burns five seconds of a saturated graphics card; every validator in the network confirms the result in the time it takes a screen to draw a frame. The finished proof is 50–200 KB — call it 120 KB typical — which is large by blockchain standards and trivial by internet standards.

Stacked into an end-to-end payment, the budget looks like this:

| Step                                      | Time         |
| ----------------------------------------- | ------------ |
| Build the proof (GPU, possibly delegated) | 3–10 s       |
| Broadcast a ~120 KB proof                 | < 1 s        |
| Wait for inclusion in a block             | ~2 s         |
| Verification, by each validator           | 2–5 ms       |
| Deterministic finality (three QC rounds)  | ~6 s         |
| **End to end, submit to irreversible**    | **~10–20 s** |

Note what dominates: the wait is proof generation, not consensus. Consensus contributes about six seconds and is fixed; proving contributes the rest and is the part that gets faster every year.

### What that means for throughput

Three ceilings apply, and the binding one is not what people expect.

**Verification is not the bottleneck.** At three milliseconds per proof, one core checks around 330 proofs per second, and validators can verify in parallel across cores. Thousands of private transactions per second are within reach of the checking side alone.

**Bandwidth is.** A 120 KB proof multiplied by 300 transactions per second is 36 MB every second, arriving at every validator, continuously. That is roughly 290 Mbps of sustained gossip traffic — before blocks, votes, and state sync. Sustained network capacity, not cryptography, is what caps a naive design at something in the low hundreds of private transactions per second. Public, transparent SVM transactions are unaffected and run in the thousands, since they carry signatures rather than proofs.

**Recursion moves the ceiling somewhere else entirely.** Aggregate a thousand transaction proofs into one, and the chain carries a single 200 KB object and performs a single verification regardless of how many payments it represents. On-chain cost becomes nearly constant. The limit then stops being the blockchain and becomes the size of the prover fleet: if one proof needs five GPU-seconds, then a thousand GPUs produce two hundred private transactions per second, and ten thousand GPUs produce two thousand.

Which is the interesting part. Past a certain point, throughput on this design is not a research problem. It is a purchasing decision.

### Why low latency and high throughput are not the priority right now

There is a strong instinct in this industry to compete on transactions per second, and it would be a mistake to optimize for that here — not because speed is bad, but because it is the constraint most likely to relax on its own.

**Fifteen seconds is already faster than everything it replaces.** The workloads that actually want a private dollar are payroll, supplier invoices, remittances, and treasury movements. Today those settle over ACH in one to three business days, over correspondent banking in hours or days with a bank holiday risk attached, or over cards with instant authorization but T+2 settlement and a chargeback window measured in months. Against that field, ten to twenty seconds to _irreversible_ finality is not a compromise. It is an enormous improvement, and no CFO waiting on a Friday wire is going to notice the difference between ten seconds and one.

**The demand does not exist yet.** Building for a hundred thousand transactions per second before you have a hundred is the most reliably repeated mistake in this field. Most chains that shipped enormous capacity run at low single-digit percentages of it. The scarce resources at this stage are the anonymity set, audited bridge security, and someone's willingness to run payroll through the thing — not blockspace.

**Some latency is a privacy feature.** This is the part people miss. Privacy comes from being one of many, and being one of many takes time. Unshield the instant you shield and the timing correlation identifies you no matter how good the cryptography is. Batching, standard denominations, and deliberate delays before exit are how the anonymity set gets built, which means a shielded system optimized down to sub-second latency has partly defeated its own purpose. The right target is _fast enough that people use it_, not _as fast as physically possible_.

**And the speed arrives without a redesign.** Proving time falls along three independent tracks that multiply together: better GPUs, better proof software — where the last few years have repeatedly delivered multiples, not percentages — and better circuits. Throughput scales horizontally by adding cards to a market that already pays them. None of that requires changing the protocol.

Contrast that with the thing that _cannot_ be retrofitted. From the very first section: ledger exposure is retroactive and permanent. A payment made in the clear today can never be made private later. A payment made privately today can be made faster later, for free, just by waiting for the market to buy better hardware.

So build the property that has to be right from the first block, and let the property that improves on its own improve on its own. Slow and private converges to fast and private. Fast and public never converges to anything.

HTTPS is the precedent worth remembering. In the late 1990s, encrypting a web connection carried a large enough performance penalty that serious engineers argued it could never be the default for ordinary browsing — you turned it on for the checkout page and off everywhere else. The performance argument was correct at the time and irrelevant within a decade, because hardware and implementations caught up while the security property stayed necessary. Nobody today runs a plaintext site to save the handshake.

### The asymmetry, in one line

All of this rests on a single asymmetry, and it is worth stating without any mathematics at all: **it is hard to solve a sudoku and easy to check one.** Zero-knowledge proofs industrialize that gap. The prover spends five seconds of a saturated graphics card. The verifier spends five milliseconds. And uniquely, the checker learns that the puzzle was solved correctly without ever seeing the solution.

---

## 5. For the technical reader: privacy with no expiry date

Everything so far works against the adversaries we have today. This section is about the one we don't, and it can be skipped by anyone who has read enough already.

Recall the property from the first section: a public ledger is permanent, and exposure works backwards in time. That has an uncomfortable consequence for any privacy scheme built on the cryptography we currently use.

### Harvest now, decrypt later

Two quantum algorithms threaten classical cryptography, and they threaten it in very different ways.

**Shor's algorithm** factors integers and computes discrete logarithms in polynomial time on a sufficiently large quantum computer. That is not a speedup; it is a demolition. RSA, Diffie–Hellman, and every elliptic-curve scheme — including the signatures securing essentially every blockchain in production — fall to it outright.

**Grover's algorithm** searches an unstructured space of size $N$ in about $\sqrt{N}$ steps instead of $N$. This is a real but survivable speedup: it roughly halves the effective security of symmetric primitives like hash functions, which you compensate for by using longer outputs.

Now combine Shor with permanence. An adversary does not need a quantum computer today to attack today's traffic. They need only to _archive_ today's traffic — which, on a public chain, is free and requires no privileged access — and wait. Whatever is encrypted or hidden behind elliptic curves in 2026 becomes readable the year the machine exists. This is called **harvest now, decrypt later**, and it is the stated motivation behind the multi-year post-quantum migration NIST standardized in 2024.

For ordinary web traffic, this is a manageable problem: most TLS sessions are worthless a decade later, and the ones that aren't can be re-encrypted. For a payment ledger, it is not manageable at all. The records are already public, already permanent, and cannot be re-encrypted after the fact. A privacy guarantee on a public chain is a promise about the entire future, or it is not much of a promise.

### Why STARKs rather than SNARKs

This is where the proof system choice stops being an implementation detail.

Many popular zero-knowledge systems — the SNARK family — build their succinctness on elliptic-curve pairings. They produce beautifully small proofs, a few hundred bytes, verifiable in a millisecond. They also inherit exactly the assumption Shor destroys. A shielded transaction whose privacy rests on a pairing-based proof is private until the day it isn't, and on that day it becomes retroactively public along with every other transaction ever made in the same pool.

A STARK's soundness rests only on the collision resistance of a hash function. No curves, no pairings, no trusted setup ceremony whose toxic waste someone has to have destroyed. The price is size — proofs measured in tens or hundreds of kilobytes rather than hundreds of bytes — which is precisely why the bandwidth column in any honest resource table for this design is marked _high_, and why the GPU market in section 3 exists at all. Rand pays that cost deliberately: a bigger proof today in exchange for a privacy guarantee that does not have an expiry date.

Grover still applies, and the accounting is straightforward. A 256-bit hash offers 128 bits of quantum preimage resistance and roughly 85 bits of quantum collision resistance. Since hash collisions dominate the STARK soundness bound, that is the number that actually matters, and it is comfortable at current parameters with a clear upgrade path — move to 384- or 512-bit digests, accept larger proofs.

### The rest of the stack

Choosing a quantum-resistant proof system buys nothing if the signature scheme underneath it falls over, so the same standard is applied throughout:

- **Signatures:** CRYSTALS-Dilithium, whose hardness rests on lattice problems (Module-LWE and Module-SIS) rather than discrete logarithms. Public keys run about 1.3 KB and signatures about 2.4 KB — considerably larger than an ECDSA signature, which is the tax you pay for the property.
- **Key encapsulation:** CRYSTALS-Kyber, also lattice-based. This is what seals a note to its recipient, and what seals a witness to a chosen prover in the delegated-proving scheme above.
- **Hashing:** SHA-3 and BLAKE3, symmetric constructions that Shor does not touch and Grover only dents.

Under all of it sits one hard problem. Informally: given a random matrix $\mathbf{A}$ over a polynomial ring and a vector $\mathbf{b} = \mathbf{A}\mathbf{s} + \mathbf{e}$ where $\mathbf{s}$ and $\mathbf{e}$ are _small_, tell $\mathbf{b}$ apart from a uniformly random vector. Adding a little noise to a linear system, it turns out, is enough to make it look like nothing at all — and no efficient algorithm, classical or quantum, is known to undo it.

The honest caveat: lattice assumptions are younger than factoring and have had less time under attack. They are the best available answer, not a proof of safety. What can be said with confidence is narrower and still worth saying — this design has no component that a working quantum computer breaks _outright_, which is more than can be said for the ledger your stablecoins are sitting on right now.

---

## What would have to be true

I have tried to describe this as a working machine rather than a promise, so let me be equally concrete about what has to hold for it to matter.

The **anonymity set has to be large**. Cryptography gives you a crowd to hide in; it does not give you the crowd. A shielded pool with two hundred users offers roughly the privacy of a small town. The technology is necessary and nowhere close to sufficient.

The **bridge has to not get robbed**. Bridges are where the money in this industry actually gets stolen — Ronin, Wormhole, Nomad, and BNB together account for well over \$1.7 billion in losses, and none of those were failures of the underlying cryptography. They were failures of key management, of validator sets, and of upgrade authority. The most elegant proof system in the world sits behind a vault contract whose weakest link is entirely conventional.

The **peg has to be exogenous**. Back the dollars with dollars. Use the zero-knowledge supply proofs to make reserve verification continuous and public — which is a genuine improvement on quarterly attestations — and keep the protocol's own tokens firmly out of the redemption guarantee.

And the **delegated proving problem has to keep improving**. Today the honest answer is self-prove when you can, encrypt to a bonded prover when you can't. That is a real trade-off, not a solved problem, and the systems that admit it are the ones worth watching.

None of these are cryptographic questions. They are engineering and governance questions, which is usually where these systems actually live or die.

What I find genuinely interesting about this design is the division of labor. Privacy is expensive to produce and cheap to verify, so put production in a competitive market and verification in consensus. The graphics cards do the hard part — a few seconds of polynomial arithmetic and hashing, paid for in a token, priced by competition, dispatched like electricity. The chain does the easy part and checks the answer. And somewhere in the middle, a payment moves without telling anyone about it.

Which is all money was ever supposed to do.
