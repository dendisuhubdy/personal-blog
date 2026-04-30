---
title: "The Edge of Mathematics Research: A Citation-Grounded Survey of Open Problems and Recent Breakthroughs (2019–2026)"
author: Dendi Suhubdy
pubDatetime: 2026-05-01T12:00:00Z
featured: false
draft: false
tags:
  - mathematics
  - number-theory
  - algebraic-geometry
  - topology
  - geometric-analysis
  - pde
  - probability
  - combinatorics
  - logic
  - representation-theory
  - harmonic-analysis
  - dynamics
  - category-theory
  - mathematical-physics
  - formalization
  - langlands
  - kakeya
  - prismatic-cohomology
  - condensed-mathematics
  - roth-theorem
  - geometric-langlands
description: "A subfield-by-subfield survey of the mathematics research frontier, grounded in specific papers from Annals, Inventiones, JAMS, Acta, Publications of the IHÉS, and the work of recent Fields medalists. Covers number theory, algebraic geometry, topology, geometric analysis, PDE, probability, combinatorics, logic, representation theory, harmonic analysis, dynamics, mathematical physics, and the rise of formalization. The through-line: mathematics in the 2020s is fusing — Langlands now spans number theory, geometry, and physics; condensed and prismatic methods unify analysis and arithmetic; and Lean is starting to absorb the load-bearing proofs."
---

There is a version of this post that is just a list of conjectures. I want to write the version that explains *why* each subfield's open problems matter, what the load-bearing recent papers are, and where the frontier has actually moved — because, like in deep learning, the field has fragmented enough that mathematicians in one subfield often cannot read the load-bearing references of an adjacent one.

Mathematics doesn't have ICML/ICLR/NeurIPS. The closest equivalent is the four "top" generalist journals — **Annals of Mathematics**, **Inventiones Mathematicae**, **Journal of the AMS**, **Acta Mathematica** — plus **Publications mathématiques de l'IHÉS** for the most foundational work, and the proceedings of the **International Congress of Mathematicians** (ICM) every four years for the canonical surveys. I'll cite those, plus arxiv preprints, since increasingly the most important results — Geometric Langlands, the Kakeya proof, the Polynomial Freiman–Ruzsa conjecture — circulate as preprints for years before journal publication.

The through-line, before specifics: **mathematics in the 2020s is fusing across subfields more than at any point since Grothendieck**. Langlands now spans number theory, algebraic geometry, representation theory, and quantum field theory. Condensed and prismatic methods unify p-adic analysis with arithmetic geometry. Probability and combinatorics share methods (entropy, Fourier, polynomial method) with harmonic analysis. And Lean/mathlib is starting to absorb the load-bearing proofs of these sprawling programs, which changes what "the frontier" even means.

---

## 1. Number Theory

Number theory in the 2020s is dominated by two programs: the **Langlands correspondence** (matching Galois representations to automorphic forms), and **explicit arithmetic statistics** (heights, ranks, gaps, distributions of L-values). Both are receiving major influxes of new technique.

### The Langlands program and modularity

The modularity revolution that began with Wiles and Taylor (1995) has continued through automorphy lifting theorems. The defining recent result is the proof that **all elliptic curves over imaginary quadratic fields are modular** ([Caraiani–Newton, 2023, arxiv](https://arxiv.org/abs/2301.10509)), extending the Wiles–Taylor–Breuil–Conrad–Diamond program past totally real fields for the first time at full generality. This is one branch of a larger **10-author potential automorphy** project ([Allen–Calegari–Caraiani–Gee–Helm–Le Hung–Newton–Scholze–Taylor–Thorne, Inventiones 2023](https://arxiv.org/abs/1812.09603)).

The open problems being attacked:
- **The Birch–Swinnerton-Dyer conjecture (Millennium)** — connecting L-function order of vanishing to rank of an elliptic curve. Recent progress: **Smith's proof** that 100% of Selmer rank parities are equidistributed for congruent number curves ([Smith, Annals 2023](https://arxiv.org/abs/1702.02325)) settled Goldfeld's conjecture for that family.
- **The Fontaine–Mazur conjecture** — characterizing which Galois representations come from geometry. Largely proven in dimension 2 (Kisin), open in higher rank.
- **The Sato–Tate conjecture** — proven for elliptic curves over totally real fields (Barnet-Lamb–Geraghty–Harris–Taylor), open for higher symmetric powers and other automorphic forms.

### Prime gaps and additive number theory

The Maynard–Tao revolution (small gaps between primes) continues. **Maynard's proof of the Duffin–Schaeffer conjecture** with Koukoulopoulos ([Annals 2020](https://arxiv.org/abs/1907.04593)) settled a 1941 problem on metric Diophantine approximation by reducing it to additive combinatorics. Maynard's subsequent work on **primes with missing digits** ([Inventiones 2019](https://arxiv.org/abs/1604.01041)) and **large gaps between primes** ([with Ford, Green, Konyagin, Tao, JAMS 2018](https://arxiv.org/abs/1408.4505)) reshaped what is known about prime distribution at both ends.

### Iwasawa theory and p-adic L-functions

The Bloch–Kato conjecture and the **Iwasawa main conjectures** in their various formulations remain the central engine for connecting analytic and algebraic invariants. Recent work by Skinner–Urban (2014), then Castella–Wan and Burungale–Castella has pushed these into the non-ordinary case. The **Equivariant Tamagawa Number Conjecture** is the unifying framework — still open in most cases.

### What's truly open

- **Riemann Hypothesis** — no plausible attack vector despite enormous indirect activity.
- **abc conjecture** — Mochizuki's IUT proof remains rejected by most of the community; Scholze and Stix's 2018 critique has not been answered. Functionally still open.
- **Twin Primes** and **Goldbach** — the Maynard–Tao machinery gets close to but does not reach twin primes.

---

## 2. Algebraic Geometry

Algebraic geometry has split into two frontiers. The **arithmetic** frontier (prismatic cohomology, p-adic Hodge theory, the Fargues–Fontaine curve) has reorganized how we think about p-adic geometry. The **birational/categorical** frontier (minimal model program, derived categories, mirror symmetry) is mostly continuing programs Mori, Kontsevich, and Bridgeland set in motion.

### Prismatic cohomology and p-adic Hodge theory

The defining recent development is **prismatic cohomology** ([Bhatt–Scholze, Annals 2022](https://arxiv.org/abs/1905.08229)), which provides a single cohomology theory specializing to crystalline, étale, and de Rham cohomologies. This subsumed and clarified essentially all prior p-adic cohomology theories. The follow-up — **absolute prismatic cohomology** ([Bhatt–Lurie, 2022](https://arxiv.org/abs/2201.06120)) and **the prismatization stack** — is the active frontier.

The open problems this attacks:
- A **uniform theory of p-adic comparison isomorphisms** (now largely solved).
- **Integral p-adic Hodge theory** for varieties with bad reduction (the Breuil–Kisin–Fargues machinery).
- **The crystalline conjecture in mixed characteristic** for general schemes.

### Geometric Langlands

The proof of the **categorical geometric Langlands correspondence** ([Gaitsgory et al., five-paper series 2024](https://people.mpim-bonn.mpg.de/gaitsgde/GLC/)) is the largest single mathematical event of the decade. It conjecturally relates D-modules on the moduli of G-bundles on a curve to quasi-coherent sheaves on the moduli of $\check G$-local systems, and the 2024 proof finally established this in full categorical generality, building on work of Beilinson, Drinfeld, Frenkel, Gaitsgory, Lurie, Raskin, and others over 30 years.

The frontier now: **quantum geometric Langlands**, the **arithmetic** version (Fargues–Scholze on the local Langlands correspondence via the Fargues–Fontaine curve, [arxiv 2021](https://arxiv.org/abs/2102.13459)), and the relationship to **physical Langlands** (Kapustin–Witten reduction of N=4 SYM).

### Minimal Model Program (MMP)

Birkar's Fields Medal (2018) recognized **boundedness of Fano varieties** ([Birkar, Annals 2021](https://arxiv.org/abs/1609.05543)) — a conjecture of Borisov–Alexeev–Borisov from 1995. The MMP in characteristic p is making progress (Hacon–Witaszek), and the **Abundance Conjecture** in dimension ≥ 4 in characteristic 0 remains the main open problem.

### Derived and condensed mathematics

**Condensed mathematics** ([Clausen–Scholze, lectures 2019–2022](https://www.math.uni-bonn.de/people/scholze/Condensed.pdf)) replaces topological spaces with "condensed sets" to fix the failure of topological vector spaces to form an abelian category. The **Liquid Tensor Experiment** — the formalization of the main theorem of liquid vector spaces in Lean ([Commelin, Topaz et al. 2021–22](https://leanprover-community.github.io/blog/posts/lte-final/)) — was a watershed moment for both condensed mathematics and formalization.

### What's truly open

- **The Hodge conjecture (Millennium)** — known in low degree, wide open in general.
- **Standard conjectures on algebraic cycles** (Grothendieck) — open since 1969.
- **Tate conjecture** — partial results (Madapusi Pera for K3s).
- **Resolution of singularities in characteristic p > 0** — open in dimension ≥ 4 despite Hironaka's characteristic 0 result.

---

## 3. Topology and Geometric Topology

Topology cleaves into **algebraic topology** (homotopy theory, chromatic methods), **low-dimensional topology** (3- and 4-manifolds, knots), and **high-dimensional manifold theory**.

### Chromatic and equivariant homotopy theory

The resolution of the **Kervaire invariant problem** ([Hill–Hopkins–Ravenel, Annals 2016](https://arxiv.org/abs/0908.3724)) was the defining event of the decade prior. The follow-up program — computing **higher real K-theories** $EO_n$ at large primes, and the **telescope conjecture** — is the active frontier. The telescope conjecture was recently **disproved** at chromatic height 2 ([Burklund–Hahn–Levy–Schlank, 2023](https://arxiv.org/abs/2310.17459)), one of the most surprising results of the decade.

### Low-dimensional topology

The **smooth 4-dimensional Poincaré conjecture** — does every smooth 4-manifold homeomorphic to $S^4$ admit a diffeomorphism to $S^4$? — remains the central open problem. Multiple candidate counterexamples (Cappell–Shaneson spheres, Gluck twists) have been ruled out, but no proof or counterexample exists. **Manolescu's Pin(2)-equivariant Floer homology** ([JAMS 2016](https://arxiv.org/abs/1303.2354)) disproved the high-dimensional triangulation conjecture and reshaped the toolkit.

For knots: **Khovanov homology** detects the unknot ([Kronheimer–Mrowka, IHÉS 2011](https://arxiv.org/abs/1005.4346)), and the question of whether it detects the trefoil and figure-eight has been resolved ([Baldwin–Sivek, JEMS 2022](https://arxiv.org/abs/2005.09960)). The slice-ribbon conjecture remains open.

**Watanabe's disproof of the Smale conjecture** in dimension 4 ([Watanabe, 2018](https://arxiv.org/abs/1812.02448)) — that $\text{Diff}(S^4)$ is not homotopy equivalent to $O(5)$ — was a landmark.

### What's truly open

- **Smooth 4D Poincaré conjecture**.
- **Slice–ribbon conjecture** (Fox 1962).
- **Volume conjecture** (Kashaev–Murakami) connecting quantum invariants to hyperbolic volumes.
- **Andrews–Curtis conjecture** in combinatorial group theory.

---

## 4. Differential Geometry and Geometric Analysis

This is the field where **scalar curvature**, **minimal surfaces**, and **Ricci flow** live, and where Gromov, Perelman, and Schoen–Yau set the agenda.

### Minimal surfaces and the Yau conjecture

**Marques and Neves' proof of the Willmore conjecture** ([Annals 2014](https://arxiv.org/abs/1202.6036)) and their subsequent proof of **Yau's conjecture** that every closed Riemannian 3-manifold contains infinitely many smooth, embedded minimal surfaces ([Inventiones 2017, with Liokumovich](https://arxiv.org/abs/1607.08721); generic case [Irie–Marques–Neves, Annals 2018](https://arxiv.org/abs/1710.10752)) used min-max methods on the Almgren–Pitts theory. **Song's proof of the full Yau conjecture for all closed manifolds in dim 3 to 7** ([Song, Annals 2023](https://arxiv.org/abs/1806.08816)) finished the program.

### Scalar curvature

Gromov's "scalar curvature is the most subtle Riemannian invariant" program continues. **Gromov's dihedral rigidity** and the resolution of various positive mass theorems for non-spin manifolds (Schoen–Yau via $\mu$-bubbles, [arxiv 2017](https://arxiv.org/abs/1704.05490)) are the live frontiers. The **stability of the positive mass theorem** is the active question.

### Ricci flow and singularity analysis

Perelman's program left open the classification of singularities in higher dimension. **Bamler's compactness theory for Ricci flow** ([three-paper series, arxiv 2020](https://arxiv.org/abs/2008.09298)) and his joint work with **Kleiner on the uniqueness of weak Ricci flow** in dimension 3 ([Acta 2017](https://arxiv.org/abs/1709.04018)) extended Perelman's framework substantially.

### What's truly open

- **The Schoen–Yau positive mass theorem in dimension ≥ 8** without spin assumption — partially resolved.
- **Stability of solitons** in mean curvature flow.
- **Generic regularity for minimal surfaces** in higher codimension.

---

## 5. Partial Differential Equations

PDE has the most Millennium Prize Problems (Navier–Stokes, plus Yang–Mills as a PDE/QFT problem) and the most cross-pollination with probability and harmonic analysis.

### Navier–Stokes and Euler

The Millennium problem — global existence and smoothness for 3D incompressible Navier–Stokes — remains open. The state of play: Tao constructed a **finite-time blowup for an averaged Navier–Stokes** ([JAMS 2016](https://arxiv.org/abs/1402.0290)), suggesting the smooth solutions question may be genuinely false. **Buckmaster–Vicol's proof of non-uniqueness of weak solutions** ([Annals 2019](https://arxiv.org/abs/1709.10033)) using convex integration showed that the standard Leray–Hopf weak solution is the wrong notion. The **Onsager conjecture** for Euler was settled by **Isett** ([Annals 2018](https://arxiv.org/abs/1608.08301)) using related convex integration.

### Free boundary problems and regularity

**Figalli's Fields Medal** (2018) was for work on optimal transport and the Monge–Ampère equation, with applications to free boundary problems. **De Philippis–Figalli** on the Monge–Ampère equation ([Inventiones 2014](https://arxiv.org/abs/1308.4571)) established $W^{2,1}$ regularity. The **stability of the isoperimetric inequality** — quantified — has been active (Figalli–Maggi–Pratelli, Cicalese–Leonardi).

### Kinetic theory and Boltzmann

The Boltzmann equation's **regularity for the non-cutoff case** has progressed (Imbert–Mouhot–Silvestre). **Hairer's regularity structures** for SPDEs ([Inventiones 2014](https://arxiv.org/abs/1303.5113)) — Fields Medal 2014 — established a unified framework for singular SPDEs that has continued to expand (Bruned–Chandra–Chevyrev–Hairer for renormalization).

### General relativity: Kerr stability

The **nonlinear stability of slowly rotating Kerr black holes** ([Klainerman–Szeftel, three-paper series 2021–2023](https://arxiv.org/abs/2104.11857), with [Giorgi–Klainerman–Szeftel for the linear case](https://arxiv.org/abs/2205.14808)) is one of the monumental PDE results of the decade — roughly 2000 pages establishing that small perturbations of a Kerr metric with $|a|/M$ small enough decay back to a nearby Kerr solution. Independently, **Dafermos–Holzegel–Rodnianski–Taylor** have an alternative program for the same problem ([arxiv 2021](https://arxiv.org/abs/2104.08222)). The full subextremal range $|a| < M$ remains open, as does **Penrose's strong cosmic censorship** in full generality.

### What's truly open

- **Navier–Stokes (Millennium)**.
- **Yang–Mills mass gap (Millennium)** — see §13.
- **De Giorgi conjecture** in dimension ≥ 9 (open since 1978; settled in dim ≤ 8 by Savin and del Pino–Kowalczyk–Wei).
- **Regularity for the harmonic map heat flow** in higher target dimension.
- **Kerr stability for the full subextremal range** $|a| < M$, and **Penrose's strong cosmic censorship**.

---

## 6. Probability and Mathematical Physics

This is arguably the most fruitful intersection in 2020s mathematics: rigorous statistical mechanics has produced multiple Fields Medals and reshaped how mathematicians think about randomness.

### KPZ universality

The **Kardar–Parisi–Zhang equation** and its universality class — the conjectured limit for a vast family of growth processes — has been the engine. Hairer's regularity structures gave a meaning to the KPZ equation itself. **Quastel–Sarkar** on the KPZ fixed point ([Acta 2023](https://arxiv.org/abs/1701.00018), with Matetski) constructed the universal scaling limit. **Virág's directed landscape** ([Acta 2022, with Dauvergne–Ortmann](https://arxiv.org/abs/1812.00309)) provided the four-parameter scaling limit object.

### SLE and conformal probability

**Schramm–Loewner Evolution** continues to be the rigorous backbone of 2D conformal field theory. **Kupiainen–Rhodes–Vargas's rigorous construction of Liouville CFT** ([Annals 2020](https://arxiv.org/abs/1707.08785)), then the **DOZZ formula proof** ([Kupiainen–Rhodes–Vargas, Inventiones 2018](https://arxiv.org/abs/1707.08785)) and the **bootstrap proof** ([Guillarmou–Kupiainen–Rhodes–Vargas, 2020](https://arxiv.org/abs/2005.11530)) brought a non-trivial 2D quantum field theory under full mathematical control. This is arguably the single largest achievement in mathematical physics this decade.

### Random matrices and spin glasses

**Talagrand's Abel Prize (2024)** was for spin glasses, concentration inequalities, and stochastic processes. The Parisi formula was proven by **Panchenko** ([Annals 2013](https://arxiv.org/abs/1112.4409)), and **Auffinger–Chen–Sellke** continue to push the structure of the Parisi solution.

### Phase transitions and statistical mechanics

**Duminil-Copin's Fields Medal (2022)** recognized a decade of work on phase transitions in lattice models — the central program in rigorous statistical mechanics. Highlights include the proof of **sharpness of the phase transition** for Bernoulli percolation and the random cluster model in arbitrary dimension ([Duminil-Copin–Tassion, CMP 2016](https://arxiv.org/abs/1502.03050)), the **continuity of the phase transition for $q \leq 4$** in the planar random cluster model ([Duminil-Copin–Sidoravicius–Tassion, Annals 2017](https://arxiv.org/abs/1505.04159)), and — most strikingly — the proof with **Aizenman that $\phi^4_4$ is trivial** ([Annals 2021](https://arxiv.org/abs/1912.07973)). The triviality result settled a 40-year question and dashed hopes that the lattice $\phi^4$ in four dimensions would converge to a non-Gaussian QFT, with consequences for what rigorous constructive QFT can hope to achieve.

### Lattice gauge theory

**Chatterjee** and others have made progress on rigorous lattice gauge theory in 4D ([Chatterjee, CMP 2019](https://arxiv.org/abs/1804.01356)), and **Cao–Chatterjee** on the master loop equation. The Yang–Mills mass gap remains open, but the Wilson loop and string tension are now under rigorous study.

### What's truly open

- **Yang–Mills existence and mass gap (Millennium)**.
- **Convergence of lattice $\phi^4_4$ to a non-Gaussian limit** — Aizenman–Duminil-Copin (Annals 2021) proved triviality, surprising many.
- **Universality of bulk and edge eigenvalue statistics** for non-mean-field random matrix models.

---

## 7. Combinatorics and Additive Combinatorics

Combinatorics has had the most spectacular recent breakthroughs of any subfield, partly because the polynomial method, the slice rank method, and entropy compression are still relatively young tools.

### Roth's theorem and the Polynomial Freiman–Ruzsa conjecture

**Kelley–Meka's quasi-polynomial bound on Roth's theorem** ([Kelley–Meka, FOCS 2023, Annals to appear](https://arxiv.org/abs/2302.05537)) — improving on Behrend's 1946 lower bound and shattering the Bourgain–Sanders ceiling — is the breakthrough of the decade in additive combinatorics. They showed that any subset of $\{1, \ldots, N\}$ of density $\delta \geq \exp(-(\log N)^{1/12})$ contains a 3-term arithmetic progression.

**Gowers–Green–Manners–Tao's proof of the Polynomial Freiman–Ruzsa conjecture** in $\mathbb{F}_2^n$ ([2023, arxiv](https://arxiv.org/abs/2311.05762)), then formalized in Lean within weeks, settled a 25-year-old conjecture and demonstrated that a major piece of contemporary research mathematics could be machine-verified essentially in real time.

### The polynomial method and cap sets

The **Croot–Lev–Pach / Ellenberg–Gijswijt cap set theorem** ([Annals 2017](https://arxiv.org/abs/1605.09223)) — the largest subset of $\mathbb{F}_3^n$ with no 3-term arithmetic progression has size $O(2.756^n)$, exponentially smaller than $3^n$ — was proven in a few pages using the polynomial method. This sparked a wave of polynomial-method results across combinatorics.

### Sunflowers and the Kahn–Kalai conjecture

**Alweiss–Lovett–Wu–Zhang's near-resolution of the sunflower conjecture** ([Annals 2021](https://arxiv.org/abs/1908.08483)) gave the first polynomial improvement on Erdős–Ko–Rado–style bounds in over fifty years. **Park–Pham's proof of the Kahn–Kalai expectation threshold conjecture** ([Annals 2024](https://arxiv.org/abs/2203.17207)) — that the expectation threshold and the threshold function for monotone properties are within a logarithmic factor — was a 2-page miracle that resolved a major open problem in random graph theory.

### Erdős and Ramsey theory

**Campos–Griffiths–Morris–Sahasrabudhe's exponential improvement on Ramsey numbers** ([Campos et al. 2023, Annals to appear](https://arxiv.org/abs/2303.09521)) — proving $R(s, s) \leq (4 - \epsilon)^s$ for some $\epsilon > 0$, the first exponential improvement on Erdős–Szekeres in 88 years — was another defining moment. The diagonal Ramsey number bound had been stuck at $4^s$ since 1935.

### What's truly open

- **The Erdős–Hajnal conjecture** on induced subgraphs.
- **The Hadwiger conjecture** in graph coloring.
- **The Union-Closed Sets conjecture** — Gilmer's 2022 entropy-based attack improved the bound from 0 to 0.38; subsequent work pushed it to ~0.5.
- **The Ryser conjecture** on Latin squares.

---

## 8. Logic, Set Theory, and Model Theory

This subfield remains relatively closed off from the rest of mathematics — but with major exceptions.

### Inner model theory and the HOD conjecture

**Woodin's HOD conjecture** is the central organizing question. The conjecture states (roughly) that if there is an extendible cardinal, then the universe of sets is "close" to its HOD (hereditarily ordinal-definable) submodel. If true, it would settle most large-cardinal-related independence questions. The state of play: still open, but Woodin's **Ultimate L** program continues.

### Model theory and o-minimality

**Hrushovski's model-theoretic methods** continue to bear fruit far outside logic. **Pila–Wilkie** counting theorems via o-minimality have driven progress on the **André–Oort conjecture** (proven by **Pila–Tsimerman–Klingler–Ullmo–Yafaev**, [Pila–Shankar–Tsimerman with appendix by Esnault–Groechenig, Annals 2023](https://arxiv.org/abs/2109.08788)). This is arguably the most successful application of pure logic to mainstream mathematics this decade.

### The MIP* = RE result

**Ji–Natarajan–Vidick–Wright–Yuen's proof that MIP* = RE** ([2020, arxiv](https://arxiv.org/abs/2001.04383)) — the entangled-prover interactive proof class equals the recursively enumerable languages — incidentally **resolved Connes' embedding problem in the negative**. This collapsed a 40-year-old conjecture in operator algebras via a complexity-theoretic argument, and remains one of the most striking cross-disciplinary results of the decade.

### What's truly open

- **The HOD conjecture**.
- **Shelah's main gap** in classification theory (largely resolved, but extensions to abstract elementary classes are open).
- **Definability of Haar measure** in continuous logic.

---

## 9. Representation Theory

Representation theory is downstream of, and feeding into, the Langlands program — but it has its own internal program around **categorification**, **modular representation theory**, and **Hecke categories**.

### Categorification and Hecke algebras

**Elias–Williamson's algebraic proof of Soergel's conjecture** ([Annals 2014](https://arxiv.org/abs/1212.0791)) — and the resulting positivity of Kazhdan–Lusztig polynomials in full generality — was a landmark. Williamson's subsequent **counterexamples to Lusztig's modular representation theory conjecture** ([Annals 2017](https://arxiv.org/abs/1309.5055)) showed that the conjecture as stated was wrong in characteristic p, redirecting the field.

### Modular representation theory and the local Langlands

**Fargues–Scholze's geometrization of local Langlands** ([2021, arxiv](https://arxiv.org/abs/2102.13459), 350 pages) constructs the local Langlands correspondence for any reductive group over a local field as a sheaf on $\text{Bun}_G$ on the Fargues–Fontaine curve. This is the most foundational result in p-adic representation theory in twenty years.

### Relative Langlands duality

The most important new conceptual framework in the Langlands program since the geometric correspondence itself is the **relative Langlands duality** of [Ben-Zvi–Sakellaridis–Venkatesh ("Relative Langlands Duality", 2024, arxiv, ~450 pages)](https://arxiv.org/abs/2409.04677). The framework reorganizes period integrals (the Sakellaridis–Venkatesh program for spherical varieties) and L-values into a duality between **Hamiltonian** spaces for a group $G$ and Hamiltonian spaces for its Langlands dual $\check G$, parallel to the symplectic duality / 3D mirror symmetry observed by physicists. This unifies a vast set of previously ad hoc relations between automorphic periods and special values of L-functions, and points toward a "physical Langlands" formulation.

### What's truly open

- **The Lusztig conjecture** in modular representation theory — known to be wrong in its original form, the right replacement is being worked out.
- **Construction of the local Langlands correspondence** for $GL_n$ in equal characteristic (largely settled by Genestier–Lafforgue using shtukas).
- **The Vogan–Arthur conjectures** for unitary representations.

---

## 10. Harmonic Analysis and Geometric Measure Theory

This subfield has had its largest result in 50 years extremely recently.

### The Kakeya conjecture in $\mathbb{R}^3$

**Wang–Zahl's proof of the Kakeya set conjecture in $\mathbb{R}^3$** ([2025, arxiv](https://arxiv.org/abs/2502.17655)) — every Kakeya set in $\mathbb{R}^3$ has Hausdorff dimension 3 — is the headline result of harmonic analysis this decade. The conjecture was open for over 100 years and is connected to the **restriction conjecture**, the **Bochner–Riesz multiplier conjecture**, and the **local smoothing conjecture** for the wave equation. The proof builds on Guth's polynomial partitioning and on Wang's earlier work on the Furstenberg set problem.

### Decoupling and restriction

**Bourgain–Demeter's $\ell^2$ decoupling theorem** ([Annals 2015](https://arxiv.org/abs/1403.5335)) — a sharp Fourier-analytic estimate that has applications to the Riemann zeta function (Bourgain), additive combinatorics, and number theory — remains the central modern technique. **Guth's polynomial partitioning** is the other key tool.

### What's truly open

- **The Kakeya conjecture in $\mathbb{R}^n$** for $n \geq 4$.
- **The restriction conjecture** for the paraboloid in $\mathbb{R}^n$ for $n \geq 3$ — partial progress (Guth, Wang, Hickman–Rogers).
- **The Bochner–Riesz conjecture** in dimension $\geq 3$.
- **Falconer's distance set conjecture** — improvements continue (Du–Iosevich–Ou–Wang–Zhang).

---

## 11. Ergodic Theory and Dynamical Systems

Dynamics borders both probability and number theory (via equidistribution and Diophantine results).

### Homogeneous dynamics and Diophantine approximation

**Lindenstrauss's Fields Medal (2010)** was for measure rigidity in homogeneous dynamics. **Einsiedler–Katok–Lindenstrauss's progress on the Littlewood conjecture** ([Annals 2006](https://arxiv.org/abs/math/0512273)) — that the set of exceptions to the Littlewood conjecture has Hausdorff dimension zero — remains the state of the art.

### Teichmüller dynamics: the magic wand

**Eskin–Mirzakhani–Mohammadi's "magic wand" theorem** ([Annals 2018](https://arxiv.org/abs/1305.3015)) — orbit closures of the $SL(2,\mathbb{R})$ action on moduli spaces of abelian differentials are affine — was Mirzakhani's defining late work and reshaped the field. **Mirzakhani's Fields Medal (2014)** recognized her broader program.

### Furstenberg-style multiple recurrence

**Tao–Ziegler's proof of the inverse theorem for the Gowers norms** in finite-field models ([Annals 2010](https://arxiv.org/abs/0810.5527)), and the subsequent **Manners' proof in the integer case** ([JAMS 2018](https://arxiv.org/abs/1811.00718)), provide the engine for higher-order Fourier analysis used in number theory (Green–Tao).

### What's truly open

- **The Furstenberg ×2 ×3 conjecture** in its strongest form — known progress under positive entropy assumptions.
- **The Margulis conjecture** for non-arithmetic lattices in higher rank.
- **The Zimmer program** — largely resolved by Brown–Fisher–Hurtado, [Annals 2022](https://arxiv.org/abs/2009.05201).

---

## 12. Category Theory, Higher Categories, and Foundations

The foundational landscape has shifted more in the past decade than in the preceding fifty years.

### ∞-categories

**Lurie's Higher Topos Theory** (2009) and **Higher Algebra** (ongoing) made $(\infty,1)$-categories a working tool for working algebraists and topologists. The follow-up — $(\infty,n)$-categories, derived algebraic geometry, spectral algebraic geometry — is now mainstream rather than frontier.

### Univalent foundations and Homotopy Type Theory

**Voevodsky's univalence axiom** and the **HoTT book** (2013) reframed type theory as a foundation in which mathematical equivalences are first-class. The **cubical type theory** machinery (Cohen–Coquand–Huber–Mörtberg) makes univalence computational.

### Condensed mathematics (revisited)

See §2. The Clausen–Scholze condensed/pyknotic framework is the most influential foundational rethinking of analysis in the decade. The Liquid Tensor Experiment formalization in Lean is the proof-of-concept that human review of foundational mathematics may be augmented by machines from now on.

### What's truly open

- **A satisfactory foundation for derived algebraic geometry over the sphere spectrum** that all working algebraic geometers can use.
- **A computational/synthetic theory of $(\infty, n)$-categories** for $n \geq 2$ usable by non-experts.
- **Univalent foundations of measure theory and analysis**.

---

## 13. Mathematical Physics

The Yang–Mills mass gap remains the most famous open problem in this subfield, but the active frontier has moved to **rigorous CFT**, **integrable probability**, and **gauge theory in low dimensions**.

### Rigorous CFT

See §6 — the Liouville CFT proof is the headline. The next frontier: **rigorous minimal models**, **rigorous WZW models**, and the relationship between the SLE/CLE bootstrap and the algebraic CFT bootstrap.

### Yang–Mills and gauge theory

Beyond Chatterjee's lattice work (see §6), **Witten's TQFT framework** and the **Geometric Langlands–Yang–Mills connection** (Kapustin–Witten) is the conceptual frame. A rigorous proof of the mass gap in 4D pure Yang–Mills would resolve the Millennium problem.

### Integrable systems

**The KPZ universality class**, the **Toda lattice**, the **six-vertex model**, and the **Bethe ansatz** continue to interconnect. **Borodin–Olshanski's program** on infinite-dimensional integrability and the **Macdonald processes** ([Borodin–Corwin, Duke 2014](https://arxiv.org/abs/1111.4408)) tie integrable probability to representation theory.

### What's truly open

- **Yang–Mills existence and mass gap (Millennium)**.
- **Rigorous construction of $\phi^4_3$** (done by Glimm–Jaffe), **$\phi^4_4$** (proven trivial by Aizenman–Duminil-Copin).
- **Rigorous AdS/CFT correspondence**.

---

## 14. Formalization and Computer-Assisted Mathematics

This is the meta-frontier. As of 2026, formalization is no longer a curiosity — it is increasingly load-bearing.

### Lean and mathlib

**The Lean theorem prover** and its **mathlib** library (~1.5M lines of formalized mathematics, growing) have absorbed:
- The **Liquid Tensor Experiment** (Scholze's challenge, completed 2022).
- The **Polynomial Freiman–Ruzsa conjecture** (Tao et al., formalized weeks after the proof, 2023).
- Major chunks of **algebraic number theory**, **measure theory**, **functional analysis**, and **scheme theory**.

The active push: formalizing **Fermat's Last Theorem** (Buzzard's program, ongoing), formalizing the **Brauer–Nesbitt theorem and modularity lifting** (Buzzard–Commelin), and integrating **AI-assisted tactic suggestion** (LeanDojo, Llemma, AlphaProof, AlphaGeometry).

### Coq/Rocq, Isabelle, and the broader ecosystem

Lean dominates the contemporary narrative because mathlib's social structure (a single, monotonically growing, mathematician-curated library) matches how research mathematics is organized. But the formalization ecosystem is much older than Lean's mathlib and remains active in other systems.

**Coq** (recently renamed **Rocq**) hosts the most consequential formalization of the pre-Lean era: the **Feit–Thompson odd-order theorem** ([Gonthier et al., 2012](https://hal.inria.fr/hal-00816699), 170,000 lines), proving that every finite group of odd order is solvable. The Coq mathematical components library (SSReflect-based) was the methodological precursor that mathlib later absorbed and scaled. Coq remains the dominant system in **programming-language semantics** and **CompCert**-style verified compilers, where Lean has yet to make inroads.

**Isabelle/HOL** and its **Archive of Formal Proofs** (~1000 entries, ~3M lines as of 2026) host classical-mathematics formalizations of remarkable depth — the **prime number theorem**, large parts of **complex analysis** and **measure theory**, and **Gödel's incompleteness theorems**. Isabelle's Sledgehammer tool, which delegates to external SMT solvers and ATPs, is still the gold standard for "press a button and a proof appears" automation that Lean tooling has not matched.

The takeaway: when people say "formalization is taking off," they often mean *Lean is taking off in research mathematics*. Coq/Rocq and Isabelle remain dominant in adjacent areas (verified software, classical analysis), and the long-run question is whether the ecosystems consolidate, fragment further, or interoperate via shared logical foundations.

### Autoformalization

A distinct AI-for-math program is **autoformalization** — using language models to translate informal LaTeX mathematics into formal proof-assistant code. **Wu et al. ("Autoformalization with Large Language Models", NeurIPS 2022)** ([arxiv](https://arxiv.org/abs/2205.12615)) demonstrated that few-shot prompting could produce usable Isabelle/HOL statements directly from natural-language theorem statements. **Jiang et al. ("Draft, Sketch, and Prove", ICLR 2023)** ([arxiv](https://arxiv.org/abs/2210.12283)) extended this from statements to *proofs* by having the model produce a draft proof in natural language, sketch it formally, and dispatch atomic steps to Sledgehammer.

Autoformalization is a different problem from proof search. Proof search asks: given a formal goal, find a formal proof. Autoformalization asks: given the *informal mathematical literature* — three centuries of LaTeX, textbooks, and arxiv preprints — translate it into formal libraries fast enough to keep pace with new research. If autoformalization works at scale, the bottleneck on formal mathematics shifts from "writing formal proofs" to "checking that the formal statements faithfully encode the informal ones." That is a much friendlier bottleneck.

### AI-assisted proof discovery

**DeepMind's AlphaProof and AlphaGeometry 2** ([2024 IMO silver-medal performance](https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/)) is the headline. The architecture matters because it shows where the bottleneck actually sits. AlphaProof is a fine-tuned **Gemini** model that proposes Lean tactics, with a Lean kernel verifying each step and a tree-search procedure (closer to AlphaZero than to plain RL) that prunes the search space using value estimates from self-play. It is not "RL over Lean" in the sense of model-free policy gradient; it is search-augmented inference in which the model proposes and the kernel disposes.

The reason this distinction matters: as of 2026, the bottleneck for AlphaProof on IMO-class problems is not the proposer's mathematical taste — it is **search efficiency**. The model has high-quality candidate steps; what the system needs is to explore the proof tree faster than $b^d$ for non-trivial branching factor $b$ and depth $d$. This is the same bottleneck that shaped AlphaGo and AlphaZero, and it is the reason the most likely near-term gains come from better verifiers, better value functions, and learned heuristics — not from larger models per se.

As of 2026, top systems are at the level of **strong IMO contestants**, not yet at the level of research mathematicians — but the gap is narrowing on a timescale of months, not years.

### The sociological question

The technical questions about formalization are mostly settled (it works; it scales; mathlib will keep growing). The unsettled questions are sociological:

- **Will journals require formal proofs?** *Annals* will not, in the near term. But *Journal of Formalized Reasoning* exists, and the precedent of the **Liquid Tensor Experiment** — where Scholze publicly stated he would treat the formalization as part of the proof's trustworthiness — has made it acceptable for high-status mathematicians to demand formalization of results they doubt. The natural endpoint is a two-tier system: formalized results carry an additional certification, and journals begin to flag which submissions have been verified.
- **Will it change credit assignment?** Currently, the formalizer of someone else's theorem gets a fraction of the credit the original prover got. As autoformalization scales, this fraction may go to zero (formalizing becomes routine), which changes the incentives for whether anyone bothers. Alternatively, formalizing a *false* or *gappy* proof becomes the high-status activity — the formalizer who finds the gap in a famous proof gets the credit for a mistake correction.
- **Will it change what counts as a proof?** The conservative answer: no, because mathematicians have always treated proof as a social process and formalization is just one more form of social check. The radical answer: yes, because once formalization is cheap, the *expectation* shifts — and a proof that resists formalization (Mochizuki's IUT being the obvious test case) starts to look not just unverified but unverifiable.

The open question for the field: **what does mathematical research look like when proof checking is free, proof search is cheap, and the expensive resource is taste?** The honest answer is that nobody knows yet.

---

## What this list does not contain

I have left out:
- **Numerical analysis and applied math** as fields in their own right.
- **Optimization theory** beyond optimal transport.
- **Mathematical biology, mathematical finance, and mathematical neuroscience**.
- **Theoretical computer science** (P vs NP, complexity, cryptography), which has its own enormous frontier and increasingly overlaps with combinatorics and number theory.

Each of these would be a separate post.

## What didn't move

The narrative above is one of fusion and acceleration. That narrative is honest but partial. The honest counterweight is that several of the field's defining open problems are **as open in 2026 as they were in 2019**, and the absence of progress is itself diagnostic.

- **The Riemann Hypothesis** — no plausible attack vector. The Bombieri–Lagarias and de Bruijn–Newman programs have not produced a path. The conjecture's connection to random matrix theory (Montgomery–Odlyzko) is suggestive but has not become an attack. RH is genuinely stuck.
- **P vs NP** — every plausible technique (relativization, algebrization, natural proofs, geometric complexity theory) has been ruled out as a self-contained route. Mulmuley's GCT program produced beautiful representation theory but no separation. The lower-bound community has settled into the view that this problem may simply not be solvable with current tools.
- **Yang–Mills existence and mass gap** — Chatterjee's lattice work is real progress but is many steps short of the continuum theory. The fact that $\phi^4_4$ turned out to be trivial (Aizenman–Duminil-Copin) was a *negative* result for naive constructive approaches.
- **Navier–Stokes regularity (Millennium)** — Tao's averaged blowup and Buckmaster–Vicol's non-uniqueness suggest the smooth solutions formulation may be genuinely false, but a counterexample for the actual equation is no closer than it was a decade ago.
- **The smooth 4-dimensional Poincaré conjecture** — every candidate counterexample has been killed; no positive proof technique exists. This problem is the textbook example of a question with neither attack nor counterexample after 40 years.
- **The Hodge conjecture (Millennium)** — partial in low degree, no plausible route in general.
- **The Birch–Swinnerton-Dyer conjecture (Millennium)** — Smith's Goldfeld result is real but the full conjecture remains essentially untouched in most ranks.
- **The abc conjecture** — functionally still open, and the Mochizuki saga is a sociological cautionary tale rather than a mathematical advance.

The structural reason these specific problems remain stuck is consistent across the list: they all require either an **entirely new framework** (RH and the Langlands group; P vs NP and circuit complexity) or a **deep regularity result that the existing PDE toolkit cannot reach** (Navier–Stokes, Yang–Mills mass gap). The methods that drove the 2019–2026 fusion — perfectoid spaces, prismatic cohomology, condensed mathematics, regularity structures, polynomial methods, ∞-categories — are powerful precisely because they unify *adjacent* fields. They are not, so far, producing the kind of foundational shift that the truly stuck problems would require.

This matters because most field-level optimism implicitly assumes that breakthroughs propagate. Some do — geometric Langlands fed Fargues–Scholze fed local Langlands fed relative Langlands. But the Millennium problems, with the partial exception of Poincaré (resolved in 2003), have proven inert to that kind of propagation. The fusion is real; the acceleration is real; but the problems mathematicians have always called "the deep ones" remain deep.

## The pattern

The pattern across all fourteen subfields: **the methods that worked in 2010 are not the methods that work in 2026**.
- Number theory absorbed perfectoid spaces and prismatic cohomology.
- Algebraic geometry absorbed condensed mathematics and ∞-categories.
- Combinatorics absorbed the polynomial method, the slice rank method, and entropy compression.
- Analysis absorbed regularity structures, decoupling, and convex integration.
- Representation theory absorbed categorification and Hecke categories.
- Foundations absorbed univalence and condensed mathematics.
- And the entire field is increasingly absorbing **Lean formalization** and **AI-assisted proof search** as basic tools.

The Fields medalists of the next two cycles (2026, 2030) will, I would guess, almost all work in subfields that fuse two or more of the above — not in any single classical subfield. The pure number theorist, the pure algebraic geometer, the pure analyst is going extinct, in the same way that the pure NLP researcher and the pure CV researcher in deep learning are going extinct. The interesting frontier is the seam.

But the analogy to deep learning has a sharp limit worth naming. In ML, the fusion across subfields was forced by a **shared architecture** — the transformer absorbed NLP, then vision, then audio, then video, then code, because the same computational primitive turned out to work everywhere. There is no analogous shared architecture in mathematics. **∞-categories** is a candidate — it is the language in which derived algebraic geometry, geometric Langlands, condensed mathematics, and chromatic homotopy theory all increasingly speak. **Lean** is another candidate — it is the substrate in which all subfields could in principle be made to interoperate at the level of definitions. But neither has the universality the transformer has in ML, and there is a real possibility that mathematics simply has no such unifier and the fusion is happening in an ad hoc, area-by-area fashion. That difference is worth holding onto: ML's fusion was driven from below by an architecture; math's fusion is driven from above by a few people (Scholze, Lurie, Tao, Gaitsgory) whose individual programs span subfields. The latter is harder to scale.

That fusion — bounded as it is — is why mathematics, despite being older than every other research field by an order of magnitude, is one of the most exciting intellectual environments of the decade. And the stubborn problems are why the excitement should not be confused with imminent triumph.
