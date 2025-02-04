import os
import re
import requests
from datetime import datetime
from bs4 import BeautifulSoup
import logging
from urllib.parse import urljoin

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create necessary directories
os.makedirs('static/images/news', exist_ok=True)
os.makedirs('content/news', exist_ok=True)

def sanitize_filename(title):
    """Convert title to filename-friendly format"""
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

def format_date(date_str):
    """Convert date string to YYYY-MM-DD format"""
    try:
        date_str = date_str.strip()
        date_obj = datetime.strptime(date_str, '%b %d, %Y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError as e:
        logger.error(f"Error parsing date {date_str!r}: {e}")
        return None

def download_image(url, filename):
    """Download image from URL"""
    try:
        response = requests.get(url, verify=False)
        response.raise_for_status()
        with open(filename, 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        logger.error(f"Error downloading image {url}: {e}")
        return False

def process_article(article, base_url):
    """Process a single article"""
    try:
        # Extract title and link
        title_elem = article.find(['h2', 'h3', 'a'], class_=['entry-title'])
        if not title_elem:
            return
        title = title_elem.text.strip()
        logger.info(f"Processing article: {title}")
        
        # Extract date
        date_text = None
        date_elem = article.find(['time', 'span'], class_=['published', 'post-date'])
        if date_elem:
            date_text = date_elem.text.strip()
        else:
            # Try to find date in text content
            for text in article.stripped_strings:
                if re.search(r'[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}', text):
                    date_text = text.strip()
                    break
        
        if not date_text:
            logger.warning(f"No date found for article: {title}")
            return
            
        formatted_date = format_date(date_text)
        if not formatted_date:
            return
        
        # Extract image
        img_elem = article.find('img')
        img_path = ""
        if img_elem:
            img_url = img_elem.get('data-lazy-src') or img_elem.get('src', '')
            if img_url and not img_url.startswith('data:'):
                img_url = urljoin(base_url, img_url)
                img_name = os.path.basename(img_url)
                img_path = f"/images/news/{img_name}"
                full_img_path = f"static{img_path}"
                if download_image(img_url, full_img_path):
                    logger.info(f"Downloaded image: {img_name}")
        
        # Extract content
        content = ""
        content_elem = article.find(['div', 'p'], class_=['entry-content', 'post-content'])
        if content_elem:
            content = content_elem.text.strip()
        else:
            next_p = title_elem.find_next('p')
            if next_p:
                content = next_p.text.strip()
        
        if not content:
            logger.warning(f"No content found for article: {title}")
            return
        
        # Create markdown file
        filename = f"{formatted_date}-{sanitize_filename(title)}.md"
        filepath = f"content/news/{filename}"
        
        with open(filepath, 'w') as f:
            f.write(f"""---
title: "{title}"
date: {formatted_date}T00:00:00Z
draft: false
subject: "Updates"
image: "{img_path}"
---

{content}
""")
        logger.info(f"Created article: {filename}")
        
    except Exception as e:
        logger.error(f"Error processing article: {e}")

def scrape_news(url):
    """Scrape news from a given URL and return the next page URL if it exists"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, verify=False)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        logger.info(f"Successfully fetched page: {url}")

        # Process all articles on the page
        articles = soup.find_all(['article', 'div'], class_=['post', 'et_pb_post'])
        for article in articles:
            process_article(article, url)

        # Find the "Older Entries" link
        older_entries = soup.find('a', string='« Older Entries')
        if older_entries and 'href' in older_entries.attrs:
            return older_entries['href']
        return None

    except Exception as e:
        logger.error(f"Error fetching page {url}: {e}")
        return None

# Start scraping from the first page
current_url = 'https://getbtcz.com/news/'
while current_url:
    logger.info(f"Processing page: {current_url}")
    next_url = scrape_news(current_url)
    if next_url:
        current_url = next_url
    else:
        break

# Create _index.md
index_content = """---
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
"""

with open('content/news/_index.md', 'w') as f:
    f.write(index_content)

logger.info("News update complete!")