#!/bin/bash

# Check if title is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 \"Your Article Title\""
    echo "Example: $0 \"BitcoinZ Listed in New Exchange\""
    exit 1
fi

# Get the title
TITLE="$1"

# Create filename from title
# Convert to lowercase, replace spaces with hyphens, remove special characters
FILENAME=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')

# Get current date
DATE=$(date +%Y-%m-%d)

# Full filename
FULL_FILENAME="$DATE-$FILENAME.md"

# Create the news article file
cat > "content/news/$FULL_FILENAME" << EOL
---
title: "$TITLE"
date: ${DATE}T00:00:00Z
draft: false
subject: "Updates"
image: "/images/news/your-image-400x250.jpg"
---

Write your article content here...

## Key Points

- Point 1
- Point 2
- Point 3

## Details

Add more details about your news here.

## Conclusion

Wrap up your article with a conclusion.
EOL

echo "Created news article template: content/news/$FULL_FILENAME"
echo "Remember to:"
echo "1. Add your content to the article"
echo "2. Add your image to static/images/news/"
echo "3. Update the image path in the front matter"
echo "4. Test locally with 'hugo server'"
echo "5. Commit and push your changes"