---
title: "Security Audit — Full Technical Report"
description: "The detailed engineering report behind the BitcoinZ supply-integrity audit: scope, methodology, every finding, and recommended hardening."
date: 2026-06-09
draft: false
layout: security-audit
eyebrow: "Full Technical Report"
auditDate: "June 2026"
commit: "f9047533e"
scope: "Sprout & Sapling shielded pools"
backURL: "/security-audit/"
backLabel: "Back to Summary"
---

**Target:** `bitcoinz` C++ full node (zcashd-derived) + vendored `src/rust/` (librustzcash) &nbsp;·&nbsp; **Commit:** `f9047533e` &nbsp;·&nbsp; **Date:** 2026-06-09
**Scope:** Sprout (Groth16) and Sapling shielded pools. Orchard not present / not run.
**Primary objective:** detect any flaw permitting creation of shielded value without destroying equivalent value, or any break of the total-supply invariant (the bug class of the 2018 BCTV14 / CVE‑2019‑7167 flaw and the 2026 Orchard EC‑mult soundness flaw).
**Method:** static review only — no build, run, or fuzzing. For each component the invariant was stated and a concrete violation attempted.

> **Scope note.** This report covers the BitcoinZ **full node**, including the zk-SNARK proving and verifying code bundled with it — the components that enforce consensus and are therefore the authority on coin supply. Companion projects such as the light-wallet server (`lightwalletd`) and the transaction-building library (`bitcore-lib-btcz`) are **non-consensus**: they rely on the node for validation and cannot themselves create or inflate coin, so they fall outside this supply-integrity review.

## 1. Executive summary

**No inflation, counterfeiting, double-spend, or network-reachable memory-safety bug was found in the BitcoinZ full node.** Twelve areas were examined across four passes; six are recorded as findings (all Info/Low — none exploitable), and the remaining value-conservation, double-spend, rollback, fee, and memory-safety invariants were verified correct.

The result rests on one decisive structural fact:

> **BitcoinZ verifies shielded proofs against the genuine, hash-pinned Zcash MPC parameters.** `src/init.cpp:869-879` hard-codes the canonical Zcash BLAKE2b parameter hashes for `sapling-spend`, `sapling-output`, and `sprout-groth16`, and `librustzcash_init_zksnark_params` (`src/rust/librustzcash/src/rustzcash.rs:191-280`) **panics on any mismatch**. The verifying keys are derived from those exact files.

Consequently the *circuit-level* soundness bug class — a constraint defined-but-not-enforced (Orchard 2026) or a broken proving system (BCTV14 2018) — **cannot have been introduced by this fork**, because it never regenerated parameters. The vendored circuit `.rs` files are vestigial for verification (verification re-runs no circuit; it checks a Groth16 pairing against Zcash's verifying key). The fork's shielded soundness therefore *reduces to* Zcash's, and the real attack surface is the C++/Rust consensus glue — which was audited directly and found faithful, with the ZIP 209 turnstile enabled as an independent backstop.

The CVE‑2019‑7167 fix is present and active: Sprout uses **Groth16, not BCTV14**, with post-fix parameters.

## 2. Findings

### F1 — Sprout PHGR (BCTV14-era) proofs are accepted unconditionally; safe only via version-binding + checkpoints
- **Severity:** Info (latent High if either guard is ever weakened)
- **Location:** `src/proof_verifier.cpp:25-30` (the `PHGRProof` operator returns `true`)
- **Invariant:** every accepted Sprout JoinSplit must carry a valid zk-proof of its balance statement.
- **Exploit path — could not construct.** The proof *type* is not attacker-selectable: `src/primitives/transaction.h:272` derives `useGroth = fOverwintered && txVersion >= SAPLING_TX_VERSION(4)`, and deserialization binds a Sapling-group tx to exactly v4 (`transaction.h:578-579`). After Sapling, `ContextualCheckTransaction` rejects any tx with `nVersionGroupId != SAPLING_VERSION_GROUP_ID` (`main.cpp:876`) or `nVersion < SAPLING_MIN_TX_VERSION` (`main.cpp:883`) — *before* the proof check — so a PHGR JoinSplit is unreachable in any post-Sapling transaction. Historical PHGR JoinSplits are not re-verified but are locked by checkpoints to height 1,400,000 (`chainparams.cpp:206-234`; `ConnectBlock` disables verification only for ancestors of the last checkpoint, `main.cpp:2458-2473`).
- **Confidence:** High (not currently exploitable).
- **Remediation:** keep this dependency documented; treat the `main.cpp:876/883` version gates as consensus-critical and never relax them; add a checkpoint past 1.4M so the "no-verify" window stays behind PoW + checkpoint protection.

### F2 — Frozen librustzcash vintage; upstream crypto-layer hardening (incl. ZIP 212) not ported
- **Severity:** Low–Medium (divergence/correctness; not a constructed inflation path)
- **Location:** `src/rust/sapling-crypto/Cargo.toml` (`0.0.1`), `src/rust/librustzcash/Cargo.toml` (`0.1.0`); `librustzcash_sapling_check_output` (`rustzcash.rs:793`) has no `zip212_enabled` parameter.
- **Invariant:** security-relevant upstream patches issued after the fork point should be evaluated and ported.
- **Analysis:** the Rust crypto layer is frozen at ~zcashd v2.0.x (Sapling launch, 2018). ZIP 212 (mandatory from Canopy upstream) is **absent** even though BitcoinZ activates Canopy at 1,735,000. ZIP 212 is a note-plaintext/ephemeral-key (privacy/malleability) rule, **not** value conservation; its absence is consistent across all nodes (no chain split) and could not be turned into an inflation path. The broader risk is unknown-unknowns in a frozen crypto layer.
- **Confidence:** High that ZIP 212 is absent; Medium on completeness of "what else is missing" (see Gaps).
- **Remediation:** run the authoritative upstream diff (§6); decide explicitly whether to backport ZIP 212.

### F3 — No independent absolute-supply invariant (only the relative turnstile)
- **Severity:** Info (detectability gap — the reason CVE‑2019‑7167 was invisible on-chain)
- **Location:** turnstile `main.cpp:2494-2521`; pool deltas `main.cpp:3579-3637`; no total-issuance assertion exists.
- **Invariant:** total supply ≤ cumulative issued subsidy.
- **Analysis:** the **relative** invariant is enforced well — ZIP 209 is **enabled on mainnet** (`chainparams.cpp:247`) and rejects any block driving `nChainSproutValue`/`nChainSaplingValue` negative. But nothing checks the transparent monetary base against expected issuance. A hypothetical bug minting value *within* `MoneyRange` without driving a pool negative would be undetected on-chain. Caveat: the turnstile only fires when `nChain*Value` is populated (not `std::nullopt`), i.e. after a reindex / from a known-good height.
- **Confidence:** High (architectural; true of upstream too).
- **Remediation:** add an out-of-consensus watcher comparing chain supply to Σ subsidy(h); confirm `nChain*Value` is populated from the activation height on production nodes.

### F4 — Network-upgrade activation-block hashes never pinned
- **Severity:** Info
- **Location:** `src/consensus/params.h:79` declares `hashActivationBlock`; no assignment exists in `chainparams.cpp`, so the safety abort in `IsInitialBlockDownload` (`main.cpp:1801-1814`) is dormant.
- **Invariant:** a node fed a high-work fake history diverging at an upgrade boundary should refuse to proceed. Currently relies solely on checkpoints (to 1.4M) + `nMinimumChainWork`.
- **Confidence:** High.
- **Remediation:** set `hashActivationBlock` for Overwinter/Sapling/Canopy to re-arm the abort (cheap defense-in-depth).

### F5 — Zhash (Equihash 144,5) infers (N,K) from attacker-controlled solution size
- **Severity:** Low (consensus/DoS hardening; not exploitable today)
- **Location:** `src/pow.cpp:104-140` (`CheckEquihashSolution`), `src/chainparams.cpp:847-882` (`validEHparameterList`/`checkEHParamaters`), `src/main.cpp:3868` + `4006`.
- **Invariant:** PoW must require the height-appropriate Equihash parameters; a miner must not be able to select weaker ones.
- **Exploit path — could not construct.** Unlike upstream (fixed N,K), `CheckEquihashSolution` infers (N,K) from solution size and will validate trivially-weak `(48,5)`/`(96,5)`. Those are **regtest-only** (`chainparams.cpp:698-701`); mainnet uses `(200,9)→(144,5)` (overlap heights 160000–160010). The height-gate `checkEHParamaters` runs in `ContextualCheckBlockHeader` with `fCheckPOW=true` **before any header is added to the index** (`AcceptBlockHeader:4006` precedes `AddToBlockIndex:4010`), rejecting any size invalid for the height. The only ungated call (`ReadBlockFromDisk:1746`) re-reads already-validated blocks.
- **Confidence:** High (not exploitable); concern is fragility.
- **Remediation:** make `CheckEquihashSolution` take the height (or allowed param set) and validate against it, instead of inferring (N,K) from attacker data — so a future refactor dropping the contextual gate cannot silently enable a weak-PoW bypass. Optionally compile the `(48,5)/(96,5)` constants out of non-regtest builds.

### F6 — Blossom and Heartwood network upgrades skipped
- **Severity:** Info
- **Location:** `src/consensus/params.h:31-37` — enum is `BASE_SPROUT, UPGRADE_TESTDUMMY, UPGRADE_OVERWINTER, UPGRADE_SAPLING, UPGRADE_CANOPY`.
- **Analysis:** BitcoinZ jumps Sapling→Canopy, taking only Canopy's ZIP 207 funding streams + Sprout `vpub_old` deprecation (`main.cpp:940-942`). Blossom (block-spacing) is monetary-policy only; Heartwood (shielded coinbase / chain-history root) is not adopted — coinbase stays transparent (output descriptions rejected, `main.cpp:931`) and the header field remains `hashFinalSaplingRoot` (`main.cpp:2708`). **No value-conservation impact.**
- **Confidence:** High.
- **Remediation:** none required; documented for completeness.

## 3. Invariants verified correct (no finding)

| Invariant | Evidence |
|---|---|
| Sprout uses Groth16, not BCTV14 (CVE‑2019‑7167 fixed) | `proof_verifier.cpp:32-49` → `librustzcash_sprout_verify`; params post-fix |
| Sapling value balance / binding signature end-to-end | `rustzcash.rs:677-941`: per-spend `+cv`, per-output `−cv` into `bvk`; `final_check` subtracts `value_balance·G_v` and verifies RedJubjub sig; `compute_value_balance` rejects `i64::MIN` |
| `valueBalance` range-checked and netted with correct signs | `main.cpp:1165-1248`, `primitives/transaction.cpp:234-277` |
| Small-order point rejection on cv/rk/epk | `rustzcash.rs:690, 730, 833` (`is_small_order`) |
| Fee/coinbase cannot mint | `nFees += GetValueIn − GetValueOut`, `GetValueIn` incl. `GetShieldedValueIn` (`coins.cpp:577`); coinbase ≤ nFees+subsidy (`main.cpp:2719-2724`); `Halving` plain integer division (`params.cpp:20-22`) |
| Intra-tx double-spend blocked | duplicate Sprout/Sapling nullifier sets (`main.cpp:1259-1286`); coinbase barred from shielded components (1288-1301) |
| Cross-tx/block double-spend blocked | `HaveShieldedRequirements` checks both nullifier sets + anchor existence (`coins.cpp:584-626`), enforced in `ConnectBlock` (`main.cpp:2596`); `SetNullifiers` persists (`coins.cpp:318-331`) |
| Sapling tree root committed in block | `block.hashFinalSaplingRoot == sapling_tree.root()` (`main.cpp:2708-2713`) |
| DisconnectBlock inverts ConnectBlock exactly | `main.cpp:2257-2392`: `SetNullifiers(tx,false)`, anchors restored from undo / `pprev->hashFinalSaplingRoot`, coins via `ApplyTxInUndo`; pool deltas live in `CBlockIndex` (auto-restored) |
| Network-reachable memory safety | CompactSize bounded `MAX_SIZE=0x02000000` + chunked resize (`serialize.h:737-751`); all shielded structs fixed-size `std::array` → FFI buffers correctly sized; equihash solution size whitelisted before use |
| Mempool gate matches consensus | Strict proof verify (`main.cpp:1342`), `ContextualCheckTransaction` (1347), mempool nullifier-conflict checks (1390-1401) |

## 4. Summary table

| # | Finding | Severity | Inflation-exploitable? |
|---|---------|----------|------------------------|
| F1 | Sprout PHGR proofs skipped (guarded by version-binding + checkpoints) | Info | No (could not construct) |
| F2 | Frozen librustzcash; ZIP212 / later hardening not ported | Low–Med | No (privacy-class) |
| F3 | No absolute-supply invariant; turnstile is relative-only | Info | N/A (detectability) |
| F4 | Activation-block hashes unpinned (abort dormant) | Info | No |
| F5 | Zhash infers (N,K) from solution size; accepts weak params | Low | No (regtest-only + height-gated) |
| F6 | Blossom/Heartwood upgrades skipped | Info | No |
| — | Value-balance, binding-sig, fee, nullifier, anchor, rollback, mem-safety | — | **Verified correct** |

## 5. Top 3 areas most needing a human cryptographer

1. **Authoritative upstream diff of `src/rust/`** against the exact fork commit, scoped to value/proof/nullifier/commitment code — to enumerate every missing post-2018 fix (ZIP 212 confirmed absent; the rest is unverified). Highest-value remaining task (§6).
2. **Trust anchor:** this analysis reduces shielded soundness to Zcash's original Sapling MPC + circuit audit. Verifying *that* is out of scope and needs an independent cryptographer.
3. **Verifier-function equivalence:** confirm `check_spend` / `check_output` / `final_check` / `compute_value_balance` / `sprout_verify` are byte-identical to upstream (no removed check, flipped sign, or swapped generator). Read as correct here; a diff would prove it.

## 6. Recommended actions (prioritized)

1. **Run the verifier byte-diff** (closes the only gap static review couldn't):
   ```
   git diff <your-upstream-commit> -- src/rust/librustzcash/src/rustzcash.rs src/rust/sapling-crypto/src/circuit/
   ```
   Inspect the five functions listed in §5 (item 3) for any logic change.
2. Add a recent checkpoint past height 1,400,000 (F1).
3. Pin `hashActivationBlock` for Overwinter/Sapling/Canopy (F4).
4. Stand up an out-of-consensus supply watcher: chain supply vs Σ subsidy(h); confirm `nChain*Value` populated from activation height (F3).
5. Harden `CheckEquihashSolution` to take height/allowed-params instead of inferring (N,K) from wire data (F5).
6. Decide explicitly on backporting ZIP 212 (F2).

## 7. Explicit gaps in this analysis

- No build / run / tests / fuzzing — static reading only.
- Could not pin the exact upstream commit in this environment, so the verifier byte-diff (§6.1) was **not** performed mechanically; the equivalence conclusion is by inspection (high confidence, not proof).
- The deployed `.params` files were not on disk; their hashes were recognised as canonical Zcash values but not byte-verified (the node enforces this at startup via panic-on-mismatch).
- `IncrementalMerkleTree.cpp` and `NoteEncryption.cpp` were not read line-by-line (a bug there is DoS/divergence, not inflation).
- C++ memory safety covered only network-reachable deserialization paths, not the whole node.
- The non-consensus companion projects (`lightwalletd`, `bitcore-lib-btcz`) were out of scope; they cannot affect coin supply but can be reviewed separately for wallet-side correctness. (The `librustzcash` proving/verifying code is bundled in the node and is covered above.)

---

*Prepared by automated static analysis. This is an engineering review, not a substitute for a formal cryptographic audit of the underlying Zcash Sapling construction. A plain-language summary of these results is available on the [Security Audit summary page](/security-audit/).*
