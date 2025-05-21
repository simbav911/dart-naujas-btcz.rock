#!/usr/bin/env python3
"""
Convert BitcoinZ Forum Archive HTML files to Markdown with front matter

This script converts the HTML files in the forum archive to Markdown files with proper
front matter for Hugo to use when generating the site.
"""

import os
import re
import glob
from bs4 import BeautifulSoup
import argparse

def extract_title_from_html(html_file):
    """Extract the title from an HTML file"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Try to find the title in the h1 tag
    h1 = soup.find('h1')
    if h1:
        return h1.text.strip()
    
    # If no h1, try to find it in the title tag
    title_tag = soup.find('title')
    if title_tag:
        title = title_tag.text.strip()
        # Remove " - BitcoinZ Forum Archive" from the title
        title = re.sub(r'\s*-\s*BitcoinZ Forum Archive$', '', title)
        return title
    
    # If no title found, use the filename
    return os.path.basename(os.path.dirname(html_file))

def extract_description_from_html(html_file):
    """Extract a description from an HTML file"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Try to find the first paragraph in the post content
    post_content = soup.find('div', class_='post-content')
    if post_content:
        p = post_content.find('p')
        if p:
            # Limit to 150 characters
            return p.text.strip()[:150]
    
    # If no description found, use a default
    return "A topic from the BitcoinZ forum archive"

def create_markdown_file(html_file, output_dir):
    """Create a Markdown file with front matter from an HTML file"""
    # Extract the title and description
    title = extract_title_from_html(html_file)
    description = extract_description_from_html(html_file)
    
    # Create the output path
    rel_path = os.path.relpath(html_file, output_dir)
    dir_name = os.path.dirname(rel_path)
    
    # Create the markdown content
    markdown_content = f"""---
title: "{title}"
description: "{description}"
layout: "forum-topic"
---

{{% include_html "ecosystem/forum-archive/{rel_path}" %}}
"""
    
    # Create the output file path
    output_file = os.path.join(output_dir, dir_name, "_index.md")
    
    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Write the markdown file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print(f"Created {output_file}")

def process_category_files(output_dir):
    """Process all category HTML files"""
    category_files = glob.glob(os.path.join(output_dir, "categories", "*", "index.html"))
    
    for html_file in category_files:
        create_markdown_file(html_file, output_dir)

def process_topic_files(output_dir):
    """Process all topic HTML files"""
    topic_files = glob.glob(os.path.join(output_dir, "topics", "*", "index.html"))
    
    for html_file in topic_files:
        create_markdown_file(html_file, output_dir)

def main():
    parser = argparse.ArgumentParser(description="Convert forum HTML files to Markdown with front matter")
    parser.add_argument("--output-dir", default="content/ecosystem/forum-archive", help="Output directory for the forum archive")
    
    args = parser.parse_args()
    
    # Process category files
    process_category_files(args.output_dir)
    
    # Process topic files
    process_topic_files(args.output_dir)
    
    print("Conversion complete!")

if __name__ == "__main__":
    main()
