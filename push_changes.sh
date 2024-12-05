#!/bin/bash

# Add the modified files
git add hugo.toml .github/workflows/hugo.yml

# Commit with a descriptive message
git commit -m "Update Hugo configuration and GitHub Pages workflow for correct deployment"

# Push to main branch
git push origin main

echo "Changes pushed. Please check GitHub Actions tab for deployment status at:"
echo "https://github.com/simbav911/dart-naujas-btcz.rock/actions"
