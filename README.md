# BitcoinZ Website

## Project Overview
A community-driven cryptocurrency website built with Hugo, Netlify CMS, and GitHub Pages.

## Prerequisites
- Git
- Hugo (extended version)
- GitHub Account

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/simbav911/bitcoinz.git
cd bitcoinz
```

### 2. Local Development
```bash
# Install Hugo (if not already installed)
brew install hugo  # macOS
# Or use appropriate method for your OS

# Run local server
hugo server
```

### 3. GitHub Pages Deployment
- Repository settings must have GitHub Pages enabled
- Branch: `main`
- Folder: `/root`

### 4. Netlify CMS Setup
- Create GitHub OAuth Application
- Configure repository secrets
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `SITE_URL`

### 5. Admin Access
- Navigate to `/admin/` on deployed site
- Login with GitHub account

## Project Structure
- `content/`: Website content
- `layouts/`: Hugo templates
- `static/`: Static assets
- `i18n/`: Multilingual support

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

## License
[Specify your license]
