#!/bin/bash

# Loop through all roadmap files
for file in content/roadmap/*.md; do
  # Skip _index.md
  if [[ "$file" == *"_index.md" ]]; then
    continue
  fi
  
  # Extract year from filename (first 4 characters)
  year=$(basename "$file" | cut -c1-4)
  
  # Check if file already has year parameter
  if ! grep -q "^year:" "$file"; then
    # Add year parameter after date line
    sed -i '' "/^date:/a\\
year: $year" "$file"
  fi
done
