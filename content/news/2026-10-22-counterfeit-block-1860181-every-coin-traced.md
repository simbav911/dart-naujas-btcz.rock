---
title: "The 21 October Counterfeit Block: What Happened and Where Every Coin Went"
date: 2026-10-22T12:00:00Z
description: "Block 1,860,181 created 105 billion BTCZ from nothing. Release 2.3.1 removes it. We traced every counterfeit coin: 510 million reached the wBTCZ bridge, the attacker cashed out 2,892 USDT, and nothing went to any exchange."
image: "/images/news/counterfeit-block-1860181/counterfeit-block-banner.jpg"
draft: false
subject: "Security"
author: "BitcoinZ Community"
categories: ["Announcements"]
tags: ["security", "incident", "2.3.1", "bridge"]
type: "news"
---

On 21 October 2026 at 14:17 UTC, block 1,860,181 created **105,000,000,000 BTCZ out of nothing**. Release **2.3.1** fixes the bug that let it through and removes the block, so on the valid chain these coins never existed. We traced every counterfeit coin. This article covers what happened, what you need to do, and the full on-chain evidence.

<!--more-->

## What you need to do

- **Node, pool and exchange operators:** upgrade to [BitcoinZ 2.3.1](https://github.com/btcz/bitcoinz/releases/tag/2.3.1) if you have not already. Older nodes still accept the counterfeit block.
- **Wallet users:** your coins on the valid chain are not affected. Most transparent transactions from that afternoon were confirmed again on the valid chain. Shielded transactions created between 14:17 UTC and the switch, including Z-TEXT messages, could not be carried over. If a shielded payment or message you sent then never arrived, send it again.

## In short

- On 21 October 2026 at 14:17, block 1,860,181 created **105,000,000,000 BTCZ from nothing**. It used five Sprout JoinSplit transactions with all-zero proofs that a block-validation bug let through.
- Release **2.3.1** fixes the bug and removes the block, so on the valid chain these coins never existed. If you run a node, pool or exchange wallet and have not upgraded, upgrade to 2.3.1.
- The attacker deposited **510,000,000** counterfeit BTCZ into the wBTCZ bridge. The bridge credited three of the deposits and minted **150,000,000 wBTCZ** on BSC.
- The attacker sold the 150M wBTCZ on PancakeSwap for **2,892.18 USDT** and sent the USDT to a deposit address at a centralized exchange. The exchange has been notified.
- **Every counterfeit coin is accounted for.** Apart from the 510M sent to the bridge, none went to SafeTrade, WhiteBIT or any other exchange, and none went into the shielded pool.
- The same person carried out the **June 2026** Sprout theft (block 1,789,967, 56,305,778 BTCZ).

## A correction to our June audit

On 9 June we published a [security audit](/security-audit/) that found no way to counterfeit or inflate BitcoinZ. That finding was wrong. The review missed a bug in how the node checks blocks it receives from other nodes: the zero-knowledge proofs in Sprout transactions inside those blocks were never verified. The same bug was used on 20 June (block 1,789,967) and on 21 October (block 1,860,181). In October an integer overflow also stopped the supply "turnstile" from catching it. Release 2.3.1 fixes the proof check and no longer accepts Sprout JoinSplit transactions from block 1,860,181 on. We have added a correction notice to the audit pages.

## The full on-chain report

No one is named here, only addresses and transactions. Every item below can be checked. All times are UTC.

### How to check this report

- **BSC transactions:** each hash links to BscScan.
- **June 2026 transactions (valid chain):** links go to explorer.btcz.rocks.
- **October BTCZ transactions:** these exist only on the invalid chain that 2.3.1 removed, so explorers on the valid chain do not show them. A node that followed the invalid chain before upgrading still has its blocks on disk. `bitcoinz-cli getchaintips` lists `00000128b2118af53b80c50b389e19a2b29ca16843f356b167838bfe980b1738` (height 1,860,306) with status `invalid`, and `bitcoinz-cli getblock <hash> 2` returns the full transactions. On a node with `txindex=1`, `bitcoinz-cli getrawtransaction <txid> 1` works too.

### 1. The counterfeit block

<div style="overflow-x:auto">

| | |
|---|---|
| Height | 1,860,181 (invalid chain) |
| Hash | `000001963db0caee911c3409e3d1f1b868cb3fbfacc7e7e7422d5d3b80cbb37d` |
| Time | 2026-10-21 14:17:45 |
| Previous block (valid) | 1,860,180, `000002a2a96c4cce6bea19220151116c1a7f6a9ce19fbce3c3286370adb3fd1e` |
| Mined by | `t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm` (coinbase 2,500 BTCZ) |

</div>

None of the five counterfeit transactions has a transparent input. Each has one Sprout JoinSplit with `vpub_new` = 21,000,000,000 BTCZ, and each pays that amount to `t1gcbk…`. Across all five, the proofs, MACs and one-time public keys are all zeros, and the ten note commitments are simply the numbers 1 to 10. The txids are the first five rows of the table in section 2.

On the valid chain, block 1,860,181 is `0000055c669539bb6e35418f2fef774c89648048ab8e0a362b214c4122eb9052`, mined at 22:22.

### 2. Every transaction that moved counterfeit coins

This is every transaction that touched counterfeit coins in blocks 1,860,181 to 1,860,306. Block 1,860,306 (19:36) is the last block of the invalid chain our node received. All 27 transactions spend only counterfeit coins; none mixes in other funds.

<div style="overflow-x:auto">

| Block | UTC | Txid | From | To (BTCZ) |
|---|---|---|---|---|
| 1,860,181 | 14:17 | `68041a36861bd03b23e1b6b815fd523043429b6b5a661430ec2b692d4887c089` | Sprout JoinSplit, all-zero proof (created from nothing) | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 21,000,000,000 |
| 1,860,181 | 14:17 | `c3d5e3fc543130cbb799e7d8b51be95e5311e8144386b17f393c99609b83debc` | Sprout JoinSplit, all-zero proof (created from nothing) | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 21,000,000,000 |
| 1,860,181 | 14:17 | `1bf44af0b8d66387bad6f28e1b3c9fd781d5637095a9a685ade70bb9d1d85c08` | Sprout JoinSplit, all-zero proof (created from nothing) | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 21,000,000,000 |
| 1,860,181 | 14:17 | `72fc051cfb65029dcb63d29fd6b0b504c15a10120eea27571526f53523203602` | Sprout JoinSplit, all-zero proof (created from nothing) | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 21,000,000,000 |
| 1,860,181 | 14:17 | `295a8bf9c682e793b0d48870f7bdce3acc9b641fb5619d557d08c6a310ed98e2` | Sprout JoinSplit, all-zero proof (created from nothing) | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 21,000,000,000 |
| 1,860,189 | 14:33 | `d41f14e039d91f9b72fc56abff742cfe17b4e2c317d80eadca3891274b46ff6c` | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm | t1KgEFBAE9N1rV2gmNKefUcmP9V3n9m8Wob 200,000,000<br>t1fKbsEov5FPYH7GW6zFDWPiYhvhMmCoyKr 20,799,999,999.999897 |
| 1,860,194 | 14:47 | `6d879e97014404245138cac43be2c2124caf65e4a60d9ee608c2043b9e185f29` | t1fKbsEov5FPYH7GW6zFDWPiYhvhMmCoyKr | t1XBzcMnNMGP3zCPxvJsubVtfcEPatnh4pM 10,000,000<br>t1ex16baKxSCmf3HfkTJSot32KxSFfyhiaJ 20,789,999,999.99979401 |
| 1,860,195 | 14:53 | `8bc33b2265bd539548b63a308b2ba179c448f51525ab0ed29db0b1f3c657f997` | t1ex16baKxSCmf3HfkTJSot32KxSFfyhiaJ | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 10,000,000<br>t1T8Jb8rqvjiKWK9hV5Y5TFdjVMqDCGnAtA 20,779,999,999.99969101 |
| 1,860,195 | 14:53 | `f6c02155e50e398bdd7c7301a05ed0d4deb236184941cf280dca7619d63bd3b2` | t1T8Jb8rqvjiKWK9hV5Y5TFdjVMqDCGnAtA | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 10,000,000<br>t1gQbotYbo9dRN1ZWrZ11SifKS7qCfBXKY9 20,769,999,999.99958801 |
| 1,860,195 | 14:53 | `094158aea737032d5492b45079b33b10425b0de7b8f8a26be9a4db582748b791` | t1gQbotYbo9dRN1ZWrZ11SifKS7qCfBXKY9 | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 10,000,000<br>t1QXQYCYxij74z7D8hFFsmFn8EooSc7XSWo 20,759,999,999.99948502 |
| 1,860,196 | 14:55 | `7a42924e8c578b814e4bee5aee7e17a79064bf06af64492c632c134ccbfba542` | t1QXQYCYxij74z7D8hFFsmFn8EooSc7XSWo | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 10,000,000<br>t1TBVKyeoxM5bQBSyb2GqDYfRfrjCg7kj8V 20,749,999,999.99938202 |
| 1,860,196 | 14:55 | `e9507e7ff85c7fd273b41a8e8beca236d9be0e130e5652bc7e13148db001455e` | t1TBVKyeoxM5bQBSyb2GqDYfRfrjCg7kj8V | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 1,000,000,000<br>t1W74qv5aVK9VMnpGBwNwAgM9SH2q2SVWPf 19,749,999,999.99927902 |
| 1,860,196 | 14:55 | `845b8ad87abdf39f5cad5f0b747b5a953cbbe10cc957efec59461416f69c8c3b` | t1W74qv5aVK9VMnpGBwNwAgM9SH2q2SVWPf | t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm 100,000,000<br>t1ex16baKxSCmf3HfkTJSot32KxSFfyhiaJ 19,649,999,999.99917603 |
| 1,860,198 | 14:56 | `912b57132a50f936bef5e098a14f6c4b80041f6a5e6db43c26f94e1093b142f6` | t1XBzcMnNMGP3zCPxvJsubVtfcEPatnh4pM | t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw 9,999,999.9999 |
| 1,860,204 | 15:10 | `6094202ed9baeb8efd19885022ac5c2bc73bb1339d49df54e7afa3e7e5a73909` | t1ex16baKxSCmf3HfkTJSot32KxSFfyhiaJ | t1UXrcLjh5c8qxsCwXtZcoMKdk5yzaH3KkP 50,000,000<br>t1Q7Zh31mWKmJAvbc9kqXguVwFUFDSR79Ze 19,599,999,999.99907303 |
| 1,860,207 | 15:16 | `1e6f44c27d94b23aebc00494b92bd83a2ada04f7c0ba6e06b3be62d92cc1924d` | t1UXrcLjh5c8qxsCwXtZcoMKdk5yzaH3KkP | t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw 49,999,999.9999 |
| 1,860,208 | 15:23 | `b9c8ce8aa6bd9cd15b4e36d3e2f425b959e231b160515b3c82051606e1d4f8af` | t1Q7Zh31mWKmJAvbc9kqXguVwFUFDSR79Ze | t1UC8XdiAr3Cz1UcgSJ44kgwA8nyFMZppyH 90,000,000<br>t1VArYsAJPXzYTCUVp9bECL1krXF7UN2Wum 19,509,999,999.99897003 |
| 1,860,208 | 15:23 | `6cc8ec053955c65ca75f4eb9eda961f8839fe05bff8b97f23d6c3fff92eed103` | t1VArYsAJPXzYTCUVp9bECL1krXF7UN2Wum | t1dQHx7THBfHNT9iaLCWvin6FWyNLk9GMEQ 90,000,000<br>t1JG8FSdu5wuie6Pm7x2omuYpt4ETBiUKpf 19,419,999,999.99886703 |
| 1,860,208 | 15:23 | `e9ef2729ec46d21a8fbd80054f8f033842de5c1e3bb2ba925a78b65ecde54085` | t1JG8FSdu5wuie6Pm7x2omuYpt4ETBiUKpf | t1eMdoubvVnCdUd8KsjfBY3hhmWXBypGMAb 90,000,000<br>t1LnyWNFanvWAWdapR5dc7TPaPS37BMFgMw 19,329,999,999.99876404 |
| 1,860,208 | 15:23 | `be81178972a2e92c96b840227385cf46e928eae298ae69f51761ec9f7f8da1e4` | t1LnyWNFanvWAWdapR5dc7TPaPS37BMFgMw | t1MaJMmrXSfN5b5u54jreJaWFsoNSUsFbYm 90,000,000<br>t1bU3uksVHEqyCNVgGgEBDooNuKCTVfUkqz 19,239,999,999.99866104 |
| 1,860,208 | 15:23 | `2399e94046e8aab3881ef3ad2519b2ef80a31d484ea39425b0a9ca79fed67893` | t1bU3uksVHEqyCNVgGgEBDooNuKCTVfUkqz | t1ZLMMVqywt7xHR3YqgUpv9iAsZ3eR8tt3q 90,000,000<br>t1UvbyYfHU3BE2oZJRgcgXiGrXSAx9dsw8m 19,149,999,999.99855804 |
| 1,860,211 | 15:32 | `841bec7e5abbcfa415d18c91e2fb95ab940feb0f30676592ca55c32a4d8565e1` | t1UC8XdiAr3Cz1UcgSJ44kgwA8nyFMZppyH | t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw 89,999,999.9999 |
| 1,860,211 | 15:32 | `03976f8d9abfb215b27f311359fa787a505216e94e0a3aa0e7b6360f4b26ed19` | t1dQHx7THBfHNT9iaLCWvin6FWyNLk9GMEQ | t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw 89,999,999.9999 |
| 1,860,211 | 15:32 | `07d123dd715ac977e8e3909507a253123fdd6579541bbaa2594f71677999c322` | t1MaJMmrXSfN5b5u54jreJaWFsoNSUsFbYm | t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw 89,999,999.9999 |
| 1,860,211 | 15:32 | `4970434cd026ebd41d74c5c10c741cc64a3d7d36a7c5215d4339fdfa7df1b808` | t1eMdoubvVnCdUd8KsjfBY3hhmWXBypGMAb | t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw 89,999,999.9999 |
| 1,860,211 | 15:32 | `9089e82889c8971b1180137644dead2383b28dff31999d7269c37b7eb2f4f604` | t1ZLMMVqywt7xHR3YqgUpv9iAsZ3eR8tt3q | t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw 89,999,999.9999 |
| 1,860,241 | 16:39 | `2194b3f87cef4d3331b194581db4521c23a815e633409c158a18bae5325455f4` | t1UvbyYfHU3BE2oZJRgcgXiGrXSAx9dsw8m | t1KgEFBAE9N1rV2gmNKefUcmP9V3n9m8Wob 500,000,000<br>t1fjzdHebTmE8BKn4QkM9AY79DtaWfCp7mm 18,649,999,999.99845505 |

</div>

### Addresses involved

**Addresses in the attacker's transaction chain (16):**
`t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm`, `t1fKbsEov5FPYH7GW6zFDWPiYhvhMmCoyKr`, `t1ex16baKxSCmf3HfkTJSot32KxSFfyhiaJ`, `t1T8Jb8rqvjiKWK9hV5Y5TFdjVMqDCGnAtA`, `t1gQbotYbo9dRN1ZWrZ11SifKS7qCfBXKY9`, `t1QXQYCYxij74z7D8hFFsmFn8EooSc7XSWo`, `t1TBVKyeoxM5bQBSyb2GqDYfRfrjCg7kj8V`, `t1W74qv5aVK9VMnpGBwNwAgM9SH2q2SVWPf`, `t1Q7Zh31mWKmJAvbc9kqXguVwFUFDSR79Ze`, `t1VArYsAJPXzYTCUVp9bECL1krXF7UN2Wum`, `t1JG8FSdu5wuie6Pm7x2omuYpt4ETBiUKpf`, `t1LnyWNFanvWAWdapR5dc7TPaPS37BMFgMw`, `t1bU3uksVHEqyCNVgGgEBDooNuKCTVfUkqz`, `t1UvbyYfHU3BE2oZJRgcgXiGrXSAx9dsw8m`, `t1fjzdHebTmE8BKn4QkM9AY79DtaWfCp7mm`, `t1KgEFBAE9N1rV2gmNKefUcmP9V3n9m8Wob`

**wBTCZ bridge deposit addresses (7):** listed in section 3.

**wBTCZ bridge hot wallet:** [`t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw`](https://explorer.btcz.rocks/address/t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw)

### 3. Deposits into the wBTCZ bridge

Each deposit was swept into the bridge hot wallet within minutes, minus a 0.0001 BTCZ fee. All of these transactions are on the invalid chain only.

<div style="overflow-x:auto">

| Deposit address | BTCZ | Deposit txid (block, time) | Sweep txid (block) |
|---|---|---|---|
| `t1XBzcMnNMGP3zCPxvJsubVtfcEPatnh4pM` | 10,000,000 | `6d879e97014404245138cac43be2c2124caf65e4a60d9ee608c2043b9e185f29` (1,860,194, 14:47) | `912b57132a50f936bef5e098a14f6c4b80041f6a5e6db43c26f94e1093b142f6` (1,860,198) |
| `t1UXrcLjh5c8qxsCwXtZcoMKdk5yzaH3KkP` | 50,000,000 | `6094202ed9baeb8efd19885022ac5c2bc73bb1339d49df54e7afa3e7e5a73909` (1,860,204, 15:10) | `1e6f44c27d94b23aebc00494b92bd83a2ada04f7c0ba6e06b3be62d92cc1924d` (1,860,207) |
| `t1UC8XdiAr3Cz1UcgSJ44kgwA8nyFMZppyH` | 90,000,000 | `b9c8ce8aa6bd9cd15b4e36d3e2f425b959e231b160515b3c82051606e1d4f8af` (1,860,208, 15:23) | `841bec7e5abbcfa415d18c91e2fb95ab940feb0f30676592ca55c32a4d8565e1` (1,860,211) |
| `t1dQHx7THBfHNT9iaLCWvin6FWyNLk9GMEQ` | 90,000,000 | `6cc8ec053955c65ca75f4eb9eda961f8839fe05bff8b97f23d6c3fff92eed103` (1,860,208, 15:23) | `03976f8d9abfb215b27f311359fa787a505216e94e0a3aa0e7b6360f4b26ed19` (1,860,211) |
| `t1eMdoubvVnCdUd8KsjfBY3hhmWXBypGMAb` | 90,000,000 | `e9ef2729ec46d21a8fbd80054f8f033842de5c1e3bb2ba925a78b65ecde54085` (1,860,208, 15:23) | `4970434cd026ebd41d74c5c10c741cc64a3d7d36a7c5215d4339fdfa7df1b808` (1,860,211) |
| `t1MaJMmrXSfN5b5u54jreJaWFsoNSUsFbYm` | 90,000,000 | `be81178972a2e92c96b840227385cf46e928eae298ae69f51761ec9f7f8da1e4` (1,860,208, 15:23) | `07d123dd715ac977e8e3909507a253123fdd6579541bbaa2594f71677999c322` (1,860,211) |
| `t1ZLMMVqywt7xHR3YqgUpv9iAsZ3eR8tt3q` | 90,000,000 | `2399e94046e8aab3881ef3ad2519b2ef80a31d484ea39425b0a9ca79fed67893` (1,860,208, 15:23) | `9089e82889c8971b1180137644dead2383b28dff31999d7269c37b7eb2f4f604` (1,860,211) |

</div>

Total: 510,000,000 BTCZ. The bridge credited three of the deposits on BSC: the 10M, the 50M and one of the 90M. The other four 90M deposits were not credited.

### 4. Bridge mints on BSC

- wBTCZ token: [`0xcbbb3e5099f769f6d4e2b8b92dc0e268f7e099d8`](https://bscscan.com/token/0xcbbb3e5099f769f6d4e2b8b92dc0e268f7e099d8)
- Bridge minter: [`0xf9e15aab8d82d5e71fd763074f6bed8d5b48aedb`](https://bscscan.com/address/0xf9e15aab8d82d5e71fd763074f6bed8d5b48aedb)
- Recipient (attacker): [`0x00479d80b4f45730b637679a961f3e8a35af185c`](https://bscscan.com/address/0x00479d80b4f45730b637679a961f3e8a35af185c)

<div style="overflow-x:auto">

| Time | wBTCZ minted | BSC tx |
|---|---|---|
| 15:03:40 | 9,999,999.9999 | [0x40833836f07e9bfa722dfa6911201281fec0bbf3a8b3229b690b4e95c9257c05](https://bscscan.com/tx/0x40833836f07e9bfa722dfa6911201281fec0bbf3a8b3229b690b4e95c9257c05) |
| 15:28:23 | 49,999,999.9999 | [0xcdf06661d1a0b233a27e77771b30ec8f4d33cf34152b9286a1cfd4896755b5c5](https://bscscan.com/tx/0xcdf06661d1a0b233a27e77771b30ec8f4d33cf34152b9286a1cfd4896755b5c5) |
| 15:35:34 | 89,999,999.9999 | [0x206dba0a2fab73c32b49715b9ee39fcc49055688f6a3d6a7128ecc0cb467ee7b](https://bscscan.com/tx/0x206dba0a2fab73c32b49715b9ee39fcc49055688f6a3d6a7128ecc0cb467ee7b) |

</div>

The bridge records mints with its own event, not a standard `Transfer` from the zero address, so a plain token-transfer view may not show them. The rollback of the BTCZ chain does not reverse anything on BSC.

### 5. Sale on PancakeSwap

The attacker's address sold all of it through the PancakeSwap pairs wBTCZ/USDT ([`0x7bd31069afb56370f6ab63ef3d66dcba5565ba73`](https://bscscan.com/address/0x7bd31069afb56370f6ab63ef3d66dcba5565ba73)) and wBTCZ/WBNB ([`0x4e3459f55a72455598d4c26050b7b053a9dba162`](https://bscscan.com/address/0x4e3459f55a72455598d4c26050b7b053a9dba162)):

<div style="overflow-x:auto">

| Time | wBTCZ sold | USDT received | BSC tx |
|---|---|---|---|
| 15:09:34 | 10,000,000 | 336.152433 | [0x60ade951d8fd1095ff8841aa56abe621a6462757fc09bf2b1afee9d42ff5b66a](https://bscscan.com/tx/0x60ade951d8fd1095ff8841aa56abe621a6462757fc09bf2b1afee9d42ff5b66a) |
| 15:48:30 | 30,000,000 | 837.313745 | [0xeeebfc3d7e0a7186fa68619069d906bd1c8420584ed6c3dca733b636a2678ca7](https://bscscan.com/tx/0xeeebfc3d7e0a7186fa68619069d906bd1c8420584ed6c3dca733b636a2678ca7) |
| 15:49:51 | 20,000,000 | 425.270641 | [0xb96efda550e0aa2853d71a28fdbb8358969eb37be9c4e96b93a8146fed7a3f3e](https://bscscan.com/tx/0xb96efda550e0aa2853d71a28fdbb8358969eb37be9c4e96b93a8146fed7a3f3e) |
| 15:50:15 | 22,500,000 | 405.223527 | [0x510c75479c325039957485ebedf96adc6e0d1a155b0da3fb8f77941c3878d25d](https://bscscan.com/tx/0x510c75479c325039957485ebedf96adc6e0d1a155b0da3fb8f77941c3878d25d) |
| 15:50:34 | 16,875,000 | 264.083984 | [0x3a0a25ceae8d5cbc6acf1d6d42136fe4308354f94132ed07f6b7c2c8261bd3d6](https://bscscan.com/tx/0x3a0a25ceae8d5cbc6acf1d6d42136fe4308354f94132ed07f6b7c2c8261bd3d6) |
| 15:50:56 | 25,312,500 | 337.238625 | [0x7b478c22cf07eaead4496ccccdc79e6b254a2393dfb40635344bbdb8d5d9493b](https://bscscan.com/tx/0x7b478c22cf07eaead4496ccccdc79e6b254a2393dfb40635344bbdb8d5d9493b) |
| 15:51:16 | 25,312,500 | 286.899105 | [0x88d12971dd9d01d23fc6eaeda153607568aed4e5db1a928cb866dcd959c2d041](https://bscscan.com/tx/0x88d12971dd9d01d23fc6eaeda153607568aed4e5db1a928cb866dcd959c2d041) |
| **Total** | **150,000,000** | **2,892.18** | |

</div>

### 6. Where the USDT went

<div style="overflow-x:auto">

| Time | From → To | USDT | BSC tx |
|---|---|---|---|
| 16:23:46 | `0x00479d80…` → [`0x11d7868c09f750eecb985480774966d28a086366`](https://bscscan.com/address/0x11d7868c09f750eecb985480774966d28a086366) | 2,892.00 | [0x6013e55704e8a341ef75bdd1a69f9c11beaf2e5025b355f31ddac1dace11c2a5](https://bscscan.com/tx/0x6013e55704e8a341ef75bdd1a69f9c11beaf2e5025b355f31ddac1dace11c2a5) |
| 16:24:59 | `0x11d7868c…` → [`0xb3d3944be93aaeb11b7dafd2eaf7bd8dac6f4b9f`](https://bscscan.com/address/0xb3d3944be93aaeb11b7dafd2eaf7bd8dac6f4b9f) | 2,892.00 | [0x60102480a86592b3498e959617910a7651598a669d33673335846e225695de57](https://bscscan.com/tx/0x60102480a86592b3498e959617910a7651598a669d33673335846e225695de57) |
| 18:15:02 | `0xb3d3944b…` → [`0xe647b0db71985b26a1562be585bf270ea4023b10`](https://bscscan.com/address/0xe647b0db71985b26a1562be585bf270ea4023b10) | 2,892.00 | [0x18a55b303f9a950bed089b1398e49a3ca48d8ea6c5d510f262e7f6ab3ce48b14](https://bscscan.com/tx/0x18a55b303f9a950bed089b1398e49a3ca48d8ea6c5d510f262e7f6ab3ce48b14) |

</div>

`0xb3d3944b…` is a deposit address: it received the USDT once and was swept into `0xe647b0db…`, the hot wallet of a centralized exchange. The exchange has been notified. It will share information only on an official request from law enforcement.

### 7. Where the counterfeit coins ended up

At block 1,860,306, the last block of the invalid chain:

<div style="overflow-x:auto">

| Address | Counterfeit BTCZ |
|---|---|
| `t1gcbkA2YNNgruDc8qmKJ7sQmFgPN2MCAdm` (attacker) | 85,140,000,000.00000000 |
| `t1fjzdHebTmE8BKn4QkM9AY79DtaWfCp7mm` (attacker) | 18,649,999,999.99845505 |
| `t1KgEFBAE9N1rV2gmNKefUcmP9V3n9m8Wob` (attacker) | 700,000,000.00000000 |
| `t1NZg8VE5UhqRyXGxqje518GjbZT1msiMvw` (wBTCZ bridge) | 509,999,999.99930000 |
| **Total** | **104,999,999,999.99775505** |

</div>

The 0.00224495 BTCZ difference from 105,000,000,000 is transaction fees. All of these coins exist only on the invalid chain.

### 8. No counterfeit coins went to any exchange

- Counterfeit coins reached only 24 addresses: the 16 in the attacker's chain, the 7 bridge deposit addresses and the bridge hot wallet.
- None went to SafeTrade, WhiteBIT or any other exchange, and none went into the shielded pool.
- The bridge did not send any of the counterfeit coins on.
- The attacker last moved counterfeit coins at 16:39 (block 1,860,241).
- On BSC, the attacker sold the 150M wBTCZ only on PancakeSwap, and the USDT went only to the deposit address in section 6.

Claims that counterfeit coins were deposited to SafeTrade, WhiteBIT or another exchange are not supported by the chain data.

### 9. Other trading in that window

The rest of the trading that day involved no counterfeit coins and no funds from the attacker's addresses. That includes people selling BTCZ or wBTCZ, and buyers who bought wBTCZ cheaply on PancakeSwap and unwrapped it to BTCZ. Buying low and selling high is normal trading.

### 10. The June 2026 incident: same actor

In June, block 1,789,967 used the same bug to withdraw 56,305,778 BTCZ from the Sprout pool. These transactions are on the valid chain:

<div style="overflow-x:auto">

| Block | Time | Tx | What happened |
|---|---|---|---|
| 1,789,967 | 2026-06-20 15:29 | [02ee84491eee2fc6a7e1558bec4adb34f50e6fd8325378bedd3fa341db5e692d](https://explorer.btcz.rocks/tx/02ee84491eee2fc6a7e1558bec4adb34f50e6fd8325378bedd3fa341db5e692d) | A Sprout JoinSplit with an invalid proof and no inputs pays 56,305,778 BTCZ to [`t1RGJarR9UVinsAVmH2Xxdw7sVW8oeSM6Kn`](https://explorer.btcz.rocks/address/t1RGJarR9UVinsAVmH2Xxdw7sVW8oeSM6Kn) |
| 1,789,967 | 2026-06-20 15:29 | [a4b1fe56a82a0a1085d019a7a12688ea38a202c299a739db8b51ab5a2e4076f8](https://explorer.btcz.rocks/tx/a4b1fe56a82a0a1085d019a7a12688ea38a202c299a739db8b51ab5a2e4076f8) | The same block's coinbase pays 2,500 BTCZ to `t1RGJ…`, so `t1RGJ…` mined the block |
| 1,790,089 | 2026-06-20 20:16 | [102b5a63915fe627aa38659432f4c2f2059a8aa5066ad86f3f9699e7c58a7a33](https://explorer.btcz.rocks/tx/102b5a63915fe627aa38659432f4c2f2059a8aa5066ad86f3f9699e7c58a7a33) | `t1RGJ…` moves 56,308,277.99999 BTCZ into the Sapling pool |
| 1,790,099 | 2026-06-20 20:49 | [3c5e2661e7ea86c2bb55b8d3010f9d8e8b5b1bd40736ae728002ba13e487158b](https://explorer.btcz.rocks/tx/3c5e2661e7ea86c2bb55b8d3010f9d8e8b5b1bd40736ae728002ba13e487158b) | 1,000 BTCZ come out of Sapling to [`t1KgEFBAE9N1rV2gmNKefUcmP9V3n9m8Wob`](https://explorer.btcz.rocks/address/t1KgEFBAE9N1rV2gmNKefUcmP9V3n9m8Wob) |
| 1,790,151 | 2026-06-20 23:17 | [19bd8d5a049099ec5ecaf49c2279f18c6c64e7dc2ef0c253b8aea4f9833badfd](https://explorer.btcz.rocks/tx/19bd8d5a049099ec5ecaf49c2279f18c6c64e7dc2ef0c253b8aea4f9833badfd) | `t1KgEFB…` sends 999.9999979 BTCZ to [`t1a15oHANc8UeP7EHyE8FfodDvagDwuT8os`](https://explorer.btcz.rocks/address/t1a15oHANc8UeP7EHyE8FfodDvagDwuT8os) |
| 1,790,167 | 2026-06-20 23:54 | [aabb5fabf40d7278ff924db6151f99125e14e8cbd2e0d7e83f6de3e4abe1d96f](https://explorer.btcz.rocks/tx/aabb5fabf40d7278ff924db6151f99125e14e8cbd2e0d7e83f6de3e4abe1d96f) | 56,307,277.99997 BTCZ come out of Sapling to `t1KgEFB…` |
| 1,790,218 | 2026-06-21 01:39 | [c7665a7277486d05d44ecb2bcae131f8a8e9767d51a59c7940ca8e88fd5eea0c](https://explorer.btcz.rocks/tx/c7665a7277486d05d44ecb2bcae131f8a8e9767d51a59c7940ca8e88fd5eea0c) | `t1KgEFB…` sends 56,307,277.99996789 BTCZ to `t1a15oHAN…` |

</div>

Exactly the amount that went into Sapling (56,308,277.99999) came back out to `t1KgEFB…` (1,000.00001 + 56,307,277.99998, before fees). `t1a15oHAN…` is a service address with 89,498 transactions since block 308,914.

In October, `t1KgEFB…` received 200,000,000 (tx `d41f14e039d91f9b72fc56abff742cfe17b4e2c317d80eadca3891274b46ff6c`, block 1,860,189) and 500,000,000 (tx `2194b3f87cef4d3331b194581db4521c23a815e633409c158a18bae5325455f4`, block 1,860,241) of the counterfeit coins. The same person controls this address in both incidents.

### If you lost funds or have information

- If you lost funds because of these transactions, file a report with your local police and cite this report and the transaction IDs above.
- If you run an exchange or service and any of these addresses appear in your records, keep those records. Law enforcement may ask for them.
- If you know who controls these addresses, contact the BitcoinZ team on [Discord](https://discord.gg/K59mxyf) or [Telegram](https://t.me/bitcoinzcommunity).
