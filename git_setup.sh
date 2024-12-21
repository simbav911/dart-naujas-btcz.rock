#!/bin/bash

# Git Repository Setup Script for BitcoinZ Website

# Check if Git is installed
if ! command -v git &> /dev/null
then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Repository Details
GITHUB_USERNAME="simbav911"
REPO_NAME="bitcoinz"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Initialize Git repository
git init

# Add all project files
git add .

# Create initial commit
git commit -m "Initial commit: BitcoinZ website setup with Netlify CMS and GitHub Pages"

# Add remote repository
git remote add origin "$REPO_URL"

# Push to GitHub
git branch -M main
git push -u origin main

echo "Repository setup complete!"
echo "Repository URL: $REPO_URL"
