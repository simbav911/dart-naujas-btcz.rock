#!/bin/bash

# Add the modified files
git add .github/workflows/hugo.yml

# Commit with a descriptive message
git commit -m "Update GitHub Actions workflow with correct permissions and deployment settings"

# Push to main branch
git push origin main

echo "Changes pushed. Please check GitHub Actions tab for deployment status at:"
echo "https://github.com/simbav911/dart-naujas-btcz.rock/actions"
echo ""
echo "Important: After push, please:"
echo "1. Go to repository Settings"
echo "2. Click 'Pages' in the left sidebar"
echo "3. Under 'Build and deployment', set:"
echo "   - Source: 'Deploy from a branch'"
echo "   - Branch: 'gh-pages'"
echo "   - Folder: '/ (root)'"
echo "4. Click 'Save'"
