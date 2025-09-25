---
title: "BitcoinZ Blue - Official Light Wallet"
description: "The official light wallet for BitcoinZ with instant sync, privacy features, and cross-platform support"
date: 2025-09-25T10:00:00Z
type: "wallet"
image: "images/wallets/btcz-blue.webp"
icon: "images/wallets/icon_blue.png"
official: true
featured: true
badge: "Official BitcoinZ Wallet"
theme_color: "blue"
features:
  - "Official BitcoinZ Light Wallet"
  - "Instant Blockchain Sync"
  - "Shielded Transactions (z-addresses)"
  - "Cross-Platform Support"
  - "PIN Protection & Encryption"
  - "Multi-Currency Display"
  - "Contact Management"
  - "Open Source"
  - "Large Amount Support (>21M BTCZ)"
  - "HD Address Discovery"
  - "Enhanced Key Import/Export"
platforms:
  - name: "Windows"
    download_url: "https://github.com/z-bitcoinz/BitcoinZ_Blue/releases/download/v2.0.0/BitcoinZ-Blue-Windows-Installer.zip"
    portable_url: "https://github.com/z-bitcoinz/BitcoinZ_Blue/releases/download/v2.0.0/BitcoinZ-Blue-Windows-Portable.zip"
    version: "2.0.0"
    sha256_installer: "TBD"
    sha256_portable: "TBD"
  - name: "macOS (Apple Silicon)"
    download_url: "https://github.com/z-bitcoinz/BitcoinZ_Blue/releases/download/v2.0.0/BitcoinZ-Blue-macOS-AppleSilicon.zip"
    version: "2.0.0"
    sha256: "TBD"
  - name: "macOS (Intel)"
    download_url: "https://github.com/z-bitcoinz/BitcoinZ_Blue/releases/download/v2.0.0/BitcoinZ-Blue-macOS-Intel.zip"
    version: "2.0.0"
    sha256: "TBD"
  - name: "Linux (AppImage)"
    download_url: "https://github.com/z-bitcoinz/BitcoinZ_Blue/releases/download/v2.0.0/BitcoinZ-Blue-Linux-AppImage.zip"
    version: "2.0.0"
    sha256: "TBD"
  - name: "Linux (DEB)"
    download_url: "https://github.com/z-bitcoinz/BitcoinZ_Blue/releases/download/v2.0.0/BitcoinZ-Blue-Linux-DEB.zip"
    version: "2.0.0"
    sha256: "TBD"
requirements:
  - "4GB RAM (8GB recommended)"
  - "500MB free disk space"
  - "Internet connection"
  - "Windows 10/11, macOS 10.15+, or Ubuntu 20.04+"
source_code: "https://github.com/z-bitcoinz/BitcoinZ_Blue"
releases_page: "https://github.com/z-bitcoinz/BitcoinZ_Blue/releases/tag/v2.0.0"
draft: false
---

## About BitcoinZ Blue

BitcoinZ Blue is the official light wallet for BitcoinZ, developed and supported by the BitcoinZ community. This modern, user-friendly wallet provides instant access to your BTCZ funds while maintaining the highest standards of privacy and security.

### Bulletproof Security Architecture

**Your private keys never leave your device.** BitcoinZ Blue employs bulletproof technology that ensures your private keys are generated, stored, and managed exclusively on your local device. No sensitive cryptographic material is ever transmitted to servers or external services.

**100% Non-Custodial Design:** The wallet operates on a completely non-custodial architecture where you maintain absolute control over your funds. Our bulletproof security model eliminates counterparty risk entirely - only you have access to your private keys, ensuring maximum security and financial sovereignty.

**Local Cryptographic Operations:** All transaction signing and cryptographic operations are performed locally on your device using bulletproof encryption standards. The light wallet servers only provide blockchain synchronization data, never accessing or storing your private information.

### Key Features

- **Bulletproof Security**: Private keys never leave your device - 100% non-custodial architecture
- **Light Client Architecture**: No need to download the entire blockchain - connect instantly
- **Privacy First**: Shielded transactions (z-addresses) by default for maximum privacy
- **Local Key Management**: All cryptographic operations performed exclusively on your device
- **Cross-Platform**: Available for Windows, macOS, and Linux
- **User-Friendly**: Clean, intuitive interface designed for both beginners and advanced users
- **Fast Sync**: Ready to use in seconds with instant blockchain synchronization
- **Multi-Currency Display**: View your balance in multiple fiat currencies
- **Contact Management**: Save and backup your frequently used addresses
- **Enterprise-Grade Encryption**: PIN protection and bulletproof encryption for your private keys
- **Large Amount Support**: Handle amounts up to 21 billion BTCZ with precision mathematics
- **HD Address Discovery**: Complete wallet recovery with automatic address discovery
- **Enhanced Key Import/Export**: Support for multiple key formats with improved user interface
- **Protocol Compatibility**: BitcoinZ-specific protocol implementation for optimal performance

### Technical Specifications

- **Security Model**: Bulletproof non-custodial architecture - private keys never transmitted
- **Sapling Support**: Full support for shielded Sapling transactions
- **Address Types**: Supports both transparent (t-addresses) and shielded (z-addresses)
- **Network**: Connects to official BitcoinZ lightwalletd servers for blockchain data only
- **Cryptographic Operations**: All signing and key management performed locally
- **Open Source**: Fully auditable code available on GitHub for transparency

### System Requirements

**Minimum Requirements:**
- 4GB RAM
- 500MB free disk space
- Internet connection
- Windows 10/11, macOS 10.15+, or Ubuntu 20.04+

**Recommended:**
- 8GB RAM
- 1GB free disk space
- Stable broadband connection

## Security & Privacy Guarantee

### Bulletproof Technology
BitcoinZ Blue implements bulletproof security technology that ensures your private keys **never leave your device**. This non-custodial architecture provides 100% security by design:

- **Local Key Generation**: Private keys are generated using cryptographically secure random number generation exclusively on your device
- **Zero Server Transmission**: No private key data is ever sent to lightwalletd servers or any external service
- **Local Transaction Signing**: All transactions are signed locally using your private keys before broadcasting to the network
- **Complete User Control**: You maintain absolute sovereignty over your funds with no counterparty risk

### Privacy Protection
- **Shielded by Default**: z-addresses provide bulletproof privacy for your transactions
- **No Data Collection**: The wallet does not collect, store, or transmit any personal information
- **Anonymous Usage**: No registration, KYC, or identity verification required

### Enterprise-Grade Security
- **Military-Grade Encryption**: AES-256 encryption protects your wallet data
- **Secure Key Storage**: Private keys are encrypted and stored locally using industry-standard security practices
- **PIN Protection**: Additional layer of security with customizable PIN authentication
- **Backup Security**: Encrypted seed phrase backups ensure recovery while maintaining security

**Your funds are 100% safe with bulletproof technology - private keys never leave your device.**

## Version History

### v2.0.0 (September 25, 2025) - Protocol & Reliability Update

**Major Release Highlights:**
- **Protocol Upgrade**: Migrated to BitcoinZ-specific forks of librustzcash and orchard to support >21M BTCZ supply
- **Enhanced Recovery**: HD address discovery on restore for complete account recovery
- **Improved Key Management**: Redesigned export modal with enhanced copy/download functionality
- **Large Amount Support**: Proper handling of amounts up to 21 billion BTCZ with precision math
- **Windows Reliability**: Fixed transaction errors and improved balance persistence

**Key Features Added:**
- Import transparent private keys (WIF format)
- BitcoinZ-specific HRP support for key import
- Enhanced export modal with Copy All and Download options
- PIN/lock state persistence across app restarts
- Improved balance change detection and conversion accuracy

**Bug Fixes:**
- Fixed zatoshis→BTCZ conversion in balance detection
- Resolved EUR→BTCZ rounding issues preventing validation errors
- Fixed Windows "Missing inputs" transaction errors
- Improved balance persistence after app restart
- Enhanced loading and recovery flow

### v1.2.6 (August 2, 2025) - Initial Release

**First Official Release:**
- Complete light wallet implementation with instant sync
- Shielded transaction support (z-addresses)
- Cross-platform support (Windows, macOS, Linux)
- Non-custodial architecture with local key management
- PIN protection and enterprise-grade encryption
- Multi-currency display and contact management

## Terms and Conditions

**By downloading and using BitcoinZ Blue wallet, you acknowledge and agree to the following terms:**

### 1. Software License
BitcoinZ Blue is released under the MIT License. You are free to use, modify, and distribute this software in accordance with the license terms.

### 2. No Warranty
This software is provided "as is," without warranty of any kind, express or implied. The BitcoinZ community and contributors make no warranties regarding the functionality, security, or fitness for any particular purpose.

### 3. User Responsibility
- **Private Key Security**: You are solely responsible for securing your wallet's private keys and seed phrase. Loss of these will result in permanent loss of funds.
- **Backup Responsibility**: You must maintain secure backups of your wallet data. The developers are not responsible for any loss of funds due to inadequate backups.
- **Transaction Verification**: You are responsible for verifying all transaction details before sending funds.

### 4. Risk Acknowledgment
- **Cryptocurrency Risks**: You understand that cryptocurrency transactions are irreversible and that the value of BitcoinZ may fluctuate.
- **Software Risks**: You acknowledge that software may contain bugs or vulnerabilities that could result in loss of funds.
- **Network Risks**: You understand that network issues or attacks could affect your ability to access or use your funds.

### 5. Privacy
- **No Data Collection**: BitcoinZ Blue does not collect personal information or usage analytics.
- **Blockchain Privacy**: While shielded transactions provide privacy, blockchain data is permanent and public.

### 6. Compliance
You are responsible for complying with all applicable laws and regulations in your jurisdiction regarding the use of cryptocurrency.

### 7. Indemnification
You agree to indemnify and hold harmless the BitcoinZ community, developers, and contributors from any claims, damages, or losses arising from your use of this software.

### 8. Updates and Modifications
- The software may be updated periodically. You are responsible for keeping your wallet updated.
- These terms may be modified. Continued use of the wallet constitutes acceptance of any modifications.

### 9. Age Requirement
You must be at least 18 years old or the age of majority in your jurisdiction to use this wallet.

### 10. Acceptance
By downloading and using BitcoinZ Blue, you confirm that you have read, understood, and agree to be bound by these terms and conditions.

## Support

- **GitHub Issues**: [Report Issues](https://github.com/z-bitcoinz/BitcoinZ_Blue/issues)
- **Community Discord**: [Join BitcoinZ Discord](https://discord.com/invite/K59mxyf)
- **Documentation**: [BitcoinZ Blue Docs](https://github.com/z-bitcoinz/BitcoinZ_Blue)
- **BitcoinZ Website**: [https://getbtcz.com](https://getbtcz.com)