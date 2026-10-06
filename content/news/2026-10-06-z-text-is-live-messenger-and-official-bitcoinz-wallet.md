---
title: "Z-TEXT Is Live: A Private Messenger and the New Official BitcoinZ Wallet"
date: 2026-10-06T12:00:00Z
description: "Z-TEXT is publicly available for Android, Windows, macOS, and Linux. It sends every message as a shielded BitcoinZ transaction, needs no phone number or email, and is now the official BitcoinZ wallet."
image: "/images/news/z-text-release/z-text-release-banner.jpg"
draft: false
subject: "Release"
author: "BitcoinZ Community"
categories: ["Announcements"]
tags: ["z-text", "messenger", "wallet", "privacy"]
type: "news"
---

**Z-TEXT** is now publicly available. It is a private messenger built on the BitcoinZ blockchain, and it is now the official BitcoinZ wallet. You can download it today for Android, Windows, macOS, and Linux.

<!--more-->

We [first wrote about Z-TEXT in February](/news/2026-02-25-ztext-encrypted-blockchain-messenger/), when it was still in developer testing. It has since been released to the public, and anyone can install it.

## A messenger with no central servers

Most messengers pass your messages through servers that their company runs. Z-TEXT has no central server in the message path. It runs on BitcoinZ nodes spread across the world. Each message is encrypted on your device and sent as a shielded BitcoinZ transaction, the same way BTCZ itself moves.

That one design choice changes a lot:

- **No phone number and no email.** Your identity is a 24-word seed that only you hold. There is nothing to register.
- **Nothing to seize or switch off.** Messages are never stored on a Z-TEXT server, so there is no database to breach and no account to close.
- **Two layers of encryption.** AES-256-GCM on your device, then a shielded transaction where zk-SNARKs hide the sender, the recipient, and the amount.
- **Your contact never sees your IP address.** Their app picks the message up from the network. There is no direct connection between you.
- **24 words restore everything.** Wallet, messages, and contacts come back on any device, with no cloud backup.
- **Delivery in seconds.** Messages typically arrive in 1 to 5 seconds.

![Three Z-TEXT screens: a chat about setting up with only 24 words, a BTCZ payment attached to a conversation, and a chat about restoring everything on a new phone](/images/news/z-text-release/z-text-screens.jpg)

## The official BitcoinZ wallet

Z-TEXT is also a full BTCZ wallet, and it is now the official one: stable, fast, and secure. Your keys stay on your device, payments are shielded, and you can send BTCZ in the middle of a conversation.

**BitcoinZ Blue is no longer supported.** It will not receive updates or fixes. If you still have funds in it, make sure your seed phrase and private keys are backed up. New users should start with Z-TEXT.

**[Z-TEXT wallet details &rarr;](/wallets/z-text-wallet/)**

## More than chat

- **On-chain channels.** Broadcast to any number of subscribers for the price of a single transaction. There is no central server to seize and no account to suspend.
- **Panic PIN and stealth mode.** An emergency PIN wipes keys, messages, and contacts in one action. Stealth mode re-skins the app so it does not look like a messenger.
- **Post-quantum handshake.** Every contact handshake combines X25519 with ML-KEM-768, protecting the key exchange against a future quantum computer.
- **On-chain vault.** A password manager whose entries are encrypted on your device and restore from your seed.

## What it costs

The wallet is free to use. Sending and receiving BTCZ needs no license, and neither does receiving messages.

Sending messages requires a Z-TEXT license, which you can pay for with BitcoinZ as well as ZEC, BTC, ETH, and more. Each message also carries a network fee of about $0.00003, small enough to go unnoticed and large enough to make spam expensive.

**[See Z-TEXT packages &rarr;](https://z-text.com/packages)**

## The trade-offs

A design this different comes with real limits. Z-TEXT publishes them, and they are worth knowing before you rely on it:

- **Text only.** No files, pictures, or videos.
- **Your seed is everything.** Anyone who gets your 24 words can read every message and spend your funds.
- **Messages are permanent.** What settles on the blockchain cannot be deleted.
- **Your internet provider can see that you connect to BitcoinZ**, unless you add Tor or a VPN.

Z-TEXT also runs a paid bug bounty, with rewards of up to $1,500 for a critical finding. **[Read the full threat model &rarr;](https://z-text.com/docs/security)**

## Why it matters for BitcoinZ

Z-TEXT is not a separate token and not a layer-2 chain. Every message is a BitcoinZ shielded transaction, so every conversation is real activity on the BTCZ network. The privacy technology BitcoinZ has carried since 2017 now has an everyday use beyond payments.

## Get Z-TEXT

**[Download Z-TEXT &rarr;](https://z-text.com/downloads)**

Z-TEXT is available for Android, Windows, macOS, and Linux. Only download it from z-text.com, and check that the SHA-256 checksum of your file matches the one shown on the download page.

**[Why Z-TEXT is different &rarr;](/z-text/)**
