# BitcoinZ Website

## Project Overview
A community-driven cryptocurrency website built with Hugo and GitHub Pages.

## Prerequisites
- Git
- Hugo (extended version)
- Node.js and npm
- GitHub Account

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/simbav911/bitcoinz.git
cd bitcoinz
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Hugo (if not already installed)
brew install hugo  # macOS
# Or use appropriate method for your OS
```

### 3. Local Development
```bash
# Run Hugo server
npm run dev

# This will start:
# - Hugo server at http://localhost:1313
```

### 4. GitHub Pages Deployment
- Repository settings must have GitHub Pages enabled
- Branch: `main`
- Folder: `/root`

## Project Structure
- `content/`: Website content
  - `content/en/`: English content
    - News articles
    - Roadmap items
    - Wallet information
  - `content/es/`: Spanish content
  - `content/zh/`: Chinese content
- `layouts/`: Hugo templates
- `static/`: Static assets
  - `static/images/`: Image assets
- `i18n/`: Multilingual support

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## Technologies
- Hugo
- GitHub Pages
- Tailwind CSS
- Node.js

## License
[Specify your license]
