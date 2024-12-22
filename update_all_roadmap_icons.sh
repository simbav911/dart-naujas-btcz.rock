#!/bin/bash

# Function to update icon based on filename and content
update_icon() {
    local file=$1
    local filename=$(basename "$file")
    local content=$(cat "$file")
    local new_icon=""

    # Check filename and content for keywords
    if [[ $filename == *"wallet"* ]] || [[ $content == *"wallet"* ]]; then
        new_icon="wallet.svg"
    elif [[ $filename == *"mining"* ]] || [[ $content == *"mining"* ]]; then
        new_icon="mining.svg"
    elif [[ $filename == *"exchange"* ]] || [[ $content == *"exchange"* ]]; then
        new_icon="exchange.svg"
    elif [[ $filename == *"community"* ]] || [[ $content == *"community"* ]]; then
        new_icon="community.svg"
    elif [[ $filename == *"privacy"* ]] || [[ $content == *"privacy"* ]]; then
        new_icon="privacy.svg"
    elif [[ $filename == *"mobile"* ]] || [[ $content == *"mobile"* ]]; then
        new_icon="mobile.svg"
    elif [[ $filename == *"payment"* ]] || [[ $content == *"payment"* ]]; then
        new_icon="payment.svg"
    elif [[ $filename == *"media"* ]] || [[ $content == *"media"* ]]; then
        new_icon="media.svg"
    elif [[ $filename == *"update"* ]] || [[ $content == *"update"* ]]; then
        new_icon="update.svg"
    elif [[ $filename == *"launch"* ]] || [[ $content == *"launch"* ]]; then
        new_icon="launch.svg"
    elif [[ $filename == *"anniversary"* ]] || [[ $content == *"anniversary"* ]]; then
        new_icon="community.svg"
    elif [[ $filename == *"infrastructure"* ]] || [[ $content == *"infrastructure"* ]]; then
        new_icon="scalability.svg"
    elif [[ $filename == *"chart"* ]] || [[ $content == *"chart"* ]]; then
        new_icon="chart.svg"
    elif [[ $filename == *"app"* ]] || [[ $content == *"app"* ]]; then
        new_icon="app.svg"
    elif [[ $filename == *"video"* ]] || [[ $content == *"video"* ]]; then
        new_icon="video.svg"
    else
        new_icon="document.svg"  # Default icon
    fi

    # Update the icon in the file
    sed -i '' 's/icon: ".*"/icon: "images\/icons\/'"$new_icon"'"/' "$file"
    echo "Updated $filename with icon $new_icon"
}

# Process all markdown files in the roadmap directory
for file in content/roadmap/*.md; do
    if [ -f "$file" ]; then
        update_icon "$file"
    fi
done

echo "All roadmap icons have been updated!"
