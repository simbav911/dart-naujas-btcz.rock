# GitHub Pages Configuration Guide

## Repository: simbav911/dart-naujas-btcz.rock

### 1. GitHub Pages Setup

#### A. Repository Settings
1. Go to repository Settings
2. Navigate to "Pages" section
3. Configure as follows:
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/root`
   - Save changes

### 2. Hugo Deployment Configuration

#### Update hugo.toml
```toml
baseURL = "https://simbav911.github.io/dart-naujas-btcz.rock/"
```

### 3. GitHub Actions Workflow
- Existing workflow file: `.github/workflows/hugo.yml`
- Ensures automatic deployment on push to main branch

### 4. Deployment Verification
- Wait 2-3 minutes after pushing changes
- Check Actions tab in GitHub repository
- Verify deployment status

### Troubleshooting
- Ensure workflow file is correctly configured
- Check repository settings
- Verify branch protection rules

### Access Your Site
URL: `https://simbav911.github.io/dart-naujas-btcz.rock/`

## Next Steps
1. Push changes to repository
2. Wait for GitHub Actions to complete
3. Visit deployed website
