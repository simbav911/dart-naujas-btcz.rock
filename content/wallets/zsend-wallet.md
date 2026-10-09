---
title: "ZSend Wallet"
description: "A Windows full node wallet for BitcoinZ with transparent and shielded addresses, memos, and private key backup."
date: 2026-10-09T00:00:00Z
type: "wallet"
icon: "images/wallets/zsend.png"
features:
  - "Full Node Wallet"
  - "Transparent (T) and Shielded (Z) Addresses"
  - "Memos on Shielded Transactions"
  - "Balance and Transaction History"
  - "Private Key Import and Export"
  - "Full wallet.dat Key Backup"
  - "Open Source (MIT)"
platforms:
  - name: "Windows"
    download_url: "https://github.com/zalpader/ZSend_Wallet/releases/download/0.98/ZSend_Wallet_0.98-win.zip"
    version: "0.98"
    sha256: "4895e84f7ad8385bdb362d87dc3dfa8b8f7a4f2fb73e71fd4a239b0db40f9a47"
releases_page: "https://github.com/zalpader/ZSend_Wallet/releases"
requirements:
  - "64-bit Windows"
  - "Disk space for the full BitcoinZ blockchain"
  - "Stable internet connection"
draft: false
---

## About ZSend Wallet

ZSend Wallet is a community-built desktop wallet for Windows that runs a full BitcoinZ node. It works with both transparent addresses (T-addresses) and shielded addresses (Z-addresses), so you can send BTCZ publicly or privately from one app.

It is open source under the MIT license and still in active development. The current release is v0.98.

### What you can do

- Create T-addresses (transparent) and Z-addresses (private)
- Send and receive BTCZ
- Add memos to transactions sent to Z-addresses
- View your balance and transaction history
- Export and import private keys for individual addresses
- Export and import all private keys from the whole wallet.dat file
- Manage your addresses from one screen

## Getting Started

1. Download the Windows .zip from the link below
2. Check that the SHA256 of your file matches the one shown here
3. Unzip it and start ZSend Wallet
4. Let the node sync the BitcoinZ blockchain, which takes time on the first run
5. Create an address and start using BTCZ

## Back Up Your Keys

A full node wallet keeps your keys in a wallet.dat file on your computer. Nobody else has a copy.

1. Export your private keys as soon as you create addresses
2. Store the backup offline, away from the computer
3. Never share your private keys with anyone
4. Make a new backup after you create new addresses

## Links

- **Source code**: [github.com/zalpader/ZSend_Wallet](https://github.com/zalpader/ZSend_Wallet)
- **Releases**: [github.com/zalpader/ZSend_Wallet/releases](https://github.com/zalpader/ZSend_Wallet/releases)
