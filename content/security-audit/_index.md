---
title: "Security Audit — Supply Integrity"
description: "An independent line-by-line review of the BitcoinZ full node found no way to counterfeit or inflate the coin. The supply rules are sound."
date: 2026-06-09
draft: false
layout: security-audit
verdict: "No way to counterfeit or inflate BitcoinZ was found"
auditDate: "June 2026"
commit: "f9047533e"
scope: "Sprout & Sapling shielded pools"
---

BitcoinZ's most important promise is a **fixed, predictable supply** — no one can print new coins out of thin air. To check that this promise actually holds in the code, the BitcoinZ full node was put through an independent, multi-pass security review focused squarely on one question: *can anyone create value without destroying an equal amount of value?*

The answer, across every part of the code examined: **no.** No inflation, counterfeiting, or double-spend flaw was found.

## Why we ran this review

A privacy coin is only as trustworthy as its guarantee that coins cannot be secretly created. That guarantee is not hypothetical. Zcash — the technology BitcoinZ descends from — once contained a cryptographic flaw that could have allowed the **undetectable counterfeiting of shielded coins**. It went unnoticed for around two years before being quietly fixed and later disclosed in 2019. More recently, in 2026, a separate soundness bug surfaced in Zcash's newer Orchard system.

Because BitcoinZ shares this lineage, we did not want to *assume* we were safe — we wanted to **verify** it. This review answered one question directly in the source code: *can anyone create value without destroying an equal amount?* The result is above.

## What this means for you

If you hold BitcoinZ, the rules that protect your coins from being diluted were checked directly in the source code — including the private (shielded) transaction system, which is the hardest part to get right and the place where past bugs have hit other privacy coins.

- **Coins can't be conjured.** Every shielded transaction must mathematically prove that money in equals money out. The code enforces this end to end.
- **Coins can't be spent twice.** The protections that stop a coin from being spent more than once were verified.
- **The total supply is guarded.** A built-in safety check ("the turnstile") actively rejects any block that would push a shielded pool below zero — an impossible balance that would signal counterfeiting.

## What was reviewed

The review concentrated on the consensus-critical code of the full node — the rules every node on the network agrees on:

- **Sapling** and **Sprout** shielded (private) transaction pools
- Value conservation (money-in equals money-out) and the cryptographic balance checks
- Double-spend prevention (nullifiers) and the commitment-tree / anchor handling
- Supply accounting across the transparent, Sprout, and Sapling pools
- Zero-knowledge proof verification and the parameters it relies on

## Why the result can be trusted

The strongest part of the finding is structural, not a matter of opinion:

- **Genuine, integrity-checked cryptographic parameters.** BitcoinZ verifies private transactions against the original, audited Zcash zk-SNARK parameters. The node checks these parameter files against fixed cryptographic fingerprints on startup and refuses to run if they don't match. Because BitcoinZ never regenerated these parameters, the class of deep "circuit" bugs that have affected other projects **cannot have been introduced here**.
- **The 2018 counterfeiting fix is in place.** BitcoinZ's Sprout pool uses the modern, hardened proving system (Groth16), not the older system tied to the 2018 Zcash counterfeiting vulnerability (CVE-2019-7167).
- **An active supply backstop.** The shielded-pool "turnstile" balance check is enabled on the live network, so even a hypothetical accounting error would be caught at the block level.

## How the review was done

The audit was carried out in four focused passes, each stating the rule a component must uphold and then actively trying to break it:

1. **Value balance & proofs** — how money-in / money-out is enforced for Sapling and Sprout.
2. **Double-spend, rollback & mempool** — nullifier handling, and that disconnecting a block exactly reverses connecting it.
3. **Memory safety** — that data arriving from the network can't corrupt the node.
4. **Divergence from upstream** — how BitcoinZ's code differs from the Zcash code it descends from, and whether anything weakened the supply rules.

## Summary of results

| Area reviewed | Result |
|---|---|
| Value conservation — Sapling pool | No issue found |
| Value conservation — Sprout pool | No issue found |
| Double-spend prevention | No issue found |
| Supply accounting & turnstile | Verified and active |
| Proof-verification parameters | Genuine Zcash parameters, integrity-checked |
| Memory safety (network-facing code) | No issue found |

## Ongoing hardening

No fix is required for safety. As good practice, the review also noted several **defense-in-depth** improvements the project can adopt over time — such as adding an independent total-supply monitor, keeping network checkpoints current, and continuing to track upstream Zcash security updates. These strengthen an already-sound system; none addresses an exploitable flaw.

## For developers

This page is a plain-language summary. The full technical report covers every component, the invariant it must uphold, the verification performed, each finding with its severity and remediation, and the areas recommended for deeper human review.

<div class="audit-cta">
  <a class="audit-btn" href="/security-audit/technical/">Read the full technical report &rarr;</a>
</div>

---

> **Scope & disclaimer.** This is an engineering review of the BitcoinZ full node at commit `f9047533e`, conducted in June 2026 through static source analysis. It verifies that BitcoinZ correctly *uses* the underlying Zcash Sapling/Sprout cryptography; the soundness of that underlying cryptography is inherited from Zcash's own audited design and is trusted, not re-proven here. A clean review reflects the areas examined and is not an absolute guarantee of bug-free code. Independent verification is welcome and encouraged — BitcoinZ is fully open source.
