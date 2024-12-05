#!/bin/bash

# GitHub Repository Upload Script

# Configuration
GITHUB_USERNAME="simbav911"
REPO_NAME="bitcoinz"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME"

# Check if Git is installed
if ! command -v git &> /dev/null
then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI (gh) is not installed. Installing..."
    # Install GitHub CLI (platform-specific)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install gh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # For Linux, adjust based on your distribution
        sudo apt install gh
    else
        echo "Unsupported OS. Please install GitHub CLI manually."
        exit 1
    fi
fi

# Authenticate with GitHub
echo "Authenticating with GitHub..."
gh auth login

# Create repository
echo "Creating GitHub repository..."
gh repo create $REPO_NAME \
    --public \
    --description "BitcoinZ Community Website" \
    --source=. \
    --remote=origin \
    --push

# Configure repository settings
echo "Configuring repository settings..."
gh repo edit $GITHUB_USERNAME/$REPO_NAME \
    --enable-issues=false \
    --enable-wiki=false

# Enable GitHub Pages
echo "Enabling GitHub Pages..."
gh repo edit $GITHUB_USERNAME/$REPO_NAME \
    --enable-pages \
    --pages-source="main"

# Final confirmation
echo "Repository setup complete!"
echo "Repository URL: $REPO_URL"
echo "GitHub Pages: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
