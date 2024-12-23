#!/bin/bash

# Git Commit and Push Script

# Check if there are any changes
if [[ -z $(git status -s) ]]; then
    echo "No changes to commit."
    exit 0
fi

# Add all changes
git add .

# Prompt for commit message
read -p "Enter commit message: " commit_message

# Commit changes
git commit -m "${commit_message:-"Update project configuration and GitHub Pages workflow"}"

# Push to main branch
git push origin main

echo "Changes committed and pushed successfully!"
