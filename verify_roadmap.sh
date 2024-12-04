#!/bin/bash

# Loop through all roadmap files
for file in content/roadmap/*.md; do
  # Skip _index.md
  if [[ "$file" == *"_index.md" ]]; then
    continue
  fi
  
  # Extract year from filename (first 4 characters)
  year=$(basename "$file" | cut -c1-4)
  
  # Check if file has year parameter
  if ! grep -q "^year: $year" "$file"; then
    echo "Updating $file with year: $year"
    # Add year parameter after date line if missing
    sed -i '' "/^date:/a\\
year: $year" "$file"
  fi
  
  # Verify section and type parameters
  if ! grep -q "^section: \"roadmap\"" "$file"; then
    echo "Adding section parameter to $file"
    sed -i '' "/^date:/a\\
section: \"roadmap\"" "$file"
  fi
  
  if ! grep -q "^type: \"roadmap\"" "$file"; then
    echo "Adding type parameter to $file"
    sed -i '' "/^section:/a\\
type: \"roadmap\"" "$file"
  fi
done
