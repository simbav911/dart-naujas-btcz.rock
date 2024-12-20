#!/bin/bash

# Create necessary directories
mkdir -p static/images/news
mkdir -p content/en/news

# Function to convert title to filename
to_filename() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/-$//'
}

# Function to format date
format_date() {
    date -j -f "%b %d, %Y" "$1" "+%Y-%m-%d" 2>/dev/null || date -d "$1" "+%Y-%m-%d"
}

# Download and process news from getbtcz.com
curl -s https://getbtcz.com/news/ | while IFS= read -r line; do
    if [[ $line =~ \[([^\]]+)\]\(https://getbtcz.com/([^/)]+)/ ]]; then
        title="${BASH_REMATCH[1]}"
        if [[ $title != *"read more"* && $title != *"NEWS"* && $title != *"Pin It"* ]]; then
            # Get the date from the next line
            read -r date_line
            if [[ $date_line =~ ([A-Z][a-z]+ [0-9]{1,2}, [0-9]{4}) ]]; then
                date="${BASH_REMATCH[1]}"
                formatted_date=$(format_date "$date")
                filename="$formatted_date-$(to_filename "$title").md"
                
                # Extract image URL if present
                read -r image_line
                if [[ $image_line =~ https://getbtcz.com/wp-content/uploads/[^\"]+\.jpg ]]; then
                    image_url="${BASH_REMATCH[0]}"
                    image_name=$(basename "$image_url")
                    # Download image
                    curl -s "$image_url" -o "static/images/news/$image_name"
                    
                    # Read content (next line after image)
                    read -r content_line
                    
                    # Create markdown file
                    cat > "content/en/news/$filename" << EOF
---
title: "$title"
date: ${formatted_date}T00:00:00Z
draft: false
subject: "Updates"
image: "/images/news/$image_name"
---

$content_line
EOF
                    echo "Created $filename with image $image_name"
                fi
            fi
        fi
    fi
done

# Create _index.md if it doesn't exist
cat > content/en/news/_index.md << EOF
---
title: "Latest News & Updates"
description: "Stay up to date with the latest BitcoinZ developments, community updates, and announcements"
type: "section"
layout: "news"
---

Welcome to the BitcoinZ News Center. Here you'll find the latest updates about:

- Development Progress
- Community Events
- Technical Updates
- Exchange Listings
- Partnership Announcements
EOF

echo "News update complete!"