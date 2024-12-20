# Managing Exchanges in BitcoinZ Homepage

## Adding a New Exchange

To add a new exchange to the BitcoinZ homepage, follow these steps:

1. Navigate to the `content/en/buy/exchanges/` directory
2. Create a new Markdown file with the exchange name, e.g., `newexchange.md`
3. Use the following template for the exchange file:

```markdown
---
title: "Exchange Name"
description: "A brief description of the exchange"
date: YYYY-MM-DDTHH:MM:SSZ
image: "/images/exchanges/ExchangeName.png"
type: "exchange"
categories: ["Exchange"]
features:
  - "Feature 1"
  - "Feature 2"
trading_pairs:
  - "BTCZ/BTC"
  - "BTCZ/USDT"
is_centralized: true  # Set to true for centralized exchanges, false for decentralized
website: "https://exchange-website.com"
kyc_required: true   # Set to true if KYC (Know Your Customer) is required
draft: false
---

Additional details about the exchange can be added here.
```

## Key Fields Explained

- `title`: Full name of the exchange
- `description`: A concise description of the exchange
- `date`: Date of adding the exchange (use current date)
- `image`: Path to the exchange's logo (place in `static/images/exchanges/`)
- `features`: List of key features of the exchange
- `trading_pairs`: List of trading pairs available for BitcoinZ
- `is_centralized`: 
  - `true` for centralized exchanges (controlled by a single organization)
  - `false` for decentralized exchanges (no central authority)
- `website`: Official website of the exchange
- `kyc_required`:
  - `true` if Know Your Customer verification is mandatory
  - `false` if no KYC is needed
- `draft`: 
  - `false` to publish the exchange
  - `true` to keep it hidden

## Editing Existing Exchanges

1. Locate the exchange file in `content/en/buy/exchanges/`
2. Open the file and make necessary updates
3. Ensure all fields are accurate and up-to-date

## Best Practices

- Verify exchange information from official sources
- Keep descriptions concise and informative
- Use clear, descriptive feature lists
- Update trading pairs regularly
- Accurately represent centralization and KYC status

## Adding Exchange Logo

1. Save the exchange logo as a PNG file
2. Place it in the `static/images/exchanges/` directory
3. Use the filename in the `image` field of the exchange file

## Contribution Guidelines

- Provide accurate and current information
- Respect the established file format
- Verify exchange details before submission