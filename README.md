# BitcoinZ Website

## Project Overview
A community-driven cryptocurrency website built with Hugo, Netlify CMS, and GitHub Pages.

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
# Run both Hugo server and admin panel
npm run dev

# This will start:
# - Hugo server at http://localhost:1313
# - Admin panel at http://localhost:3000/admin
```

The admin panel is only accessible when running locally and provides interfaces for managing:
- News articles
- Roadmap items
- Wallet information
- Why BitcoinZ content

### 4. GitHub Pages Deployment
- Repository settings must have GitHub Pages enabled
- Branch: `main`
- Folder: `/root`

### 5. Netlify CMS Setup
- Create GitHub OAuth Application
- Configure repository secrets
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `SITE_URL`

### 6. Admin Access
For production:
- Navigate to `/admin/` on deployed site
- Login with GitHub account

For local development:
- Run `npm run dev`
- Access admin panel at http://localhost:3000/admin
- No login required for local development

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
  - `static/admin/`: Admin panel files
  - `static/images/`: Image assets
- `i18n/`: Multilingual support
- `server.js`: Admin panel server

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## Technologies
- Hugo
- Netlify CMS
- GitHub Pages
- Tailwind CSS
- Express.js (admin panel)
- Node.js

## License
[Specify your license]
