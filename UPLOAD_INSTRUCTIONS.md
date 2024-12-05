# GitHub Repository Upload Instructions

## Prerequisites
- Git installed
- GitHub CLI installed
- GitHub account

## Upload Steps
1. Make the upload script executable:
```bash
chmod +x upload_to_github.sh
```

2. Run the upload script:
```bash
./upload_to_github.sh
```

3. Follow the prompts:
- Log in to GitHub
- Confirm repository creation
- Authenticate

## Manual Backup Steps
If the script fails, use these manual commands:
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: BitcoinZ website"

# Create repository on GitHub
gh repo create bitcoinz --public

# Push to GitHub
git push -u origin main
```

## Post-Upload Configuration
1. Go to repository Settings
2. Navigate to Pages section
3. Select "main" branch
4. Choose "/root" folder
5. Save settings

## Troubleshooting
- Ensure GitHub CLI is installed
- Check internet connection
- Verify GitHub credentials
