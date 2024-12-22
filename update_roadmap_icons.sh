#!/bin/bash

# Update Node Maintenance
sed -i '' 's/icon: ".*"/icon: "images\/icons\/update.svg"/' content/roadmap/2024-08-15-node-maintenance.md

# Update Collaborations & Bridges
sed -i '' 's/icon: ".*"/icon: "images\/icons\/exchange.svg"/' content/roadmap/2024-08-20-collaborations-bridges.md

# Update Wallet Development
sed -i '' 's/icon: ".*"/icon: "images\/icons\/wallet.svg"/' content/roadmap/2024-08-25-wallet-development.md

# Update Marketing & Liquidity
sed -i '' 's/icon: ".*"/icon: "images\/icons\/chart.svg"/' content/roadmap/2024-08-28-marketing-liquidity.md

# Update Community Fee
sed -i '' 's/icon: ".*"/icon: "images\/icons\/community.svg"/' content/roadmap/2024-08-30-community-fee-upgrade.md

# Update Infrastructure
sed -i '' 's/icon: ".*"/icon: "images\/icons\/scalability.svg"/' content/roadmap/2024-08-31-infrastructure.md

# Update Layer-2
sed -i '' 's/icon: ".*"/icon: "images\/icons\/launch.svg"/' content/roadmap/2024-09-10-layer2-smart-contracts.md

# Update Website Launch
sed -i '' 's/icon: ".*"/icon: "images\/icons\/document.svg"/' content/roadmap/2024-12-22-new-website-launch.md

# Update Messenger
sed -i '' 's/icon: ".*"/icon: "images\/icons\/media.svg"/' content/roadmap/2024-12-22-btcz-messenger.md

# Update No-KYC Purchases
sed -i '' 's/icon: ".*"/icon: "images\/icons\/privacy.svg"/' content/roadmap/2024-12-22-no-kyc-btcz-purchases.md

# Update Lightweight Wallet
sed -i '' 's/icon: ".*"/icon: "images\/icons\/mobile.svg"/' content/roadmap/2024-12-22-lightweight-wallet-2025.md

echo "Updated all roadmap icons!"
