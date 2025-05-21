#!/usr/bin/env python3
"""
BitcoinZ Forum Scraper

This script scrapes the BitcoinZ forum at https://forum.btcz.rocks/ and generates
static HTML pages for a forum archive to be integrated into the BitcoinZ website.
"""

import os
import re
import sys
import json
import time
import shutil
import argparse
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# Set up argument parser
parser = argparse.ArgumentParser(description='Scrape BitcoinZ forum and generate static HTML archive')
parser.add_argument('--base-url', default='https://forum.btcz.rocks', help='Base URL of the forum')
parser.add_argument('--output-dir', default='content/ecosystem/forum-archive', help='Output directory for generated files')
parser.add_argument('--max-categories', type=int, default=0, help='Maximum number of categories to scrape (0 for all)')
parser.add_argument('--max-topics', type=int, default=0, help='Maximum number of topics per category to scrape (0 for all)')
parser.add_argument('--max-pages', type=int, default=0, help='Maximum number of pages per topic to scrape (0 for all)')
parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests in seconds (default: 1.0)')
parser.add_argument('--debug', action='store_true', help='Enable debug mode to save raw HTML')
parser.add_argument('--clean', action='store_true', help='Clean output directory before scraping')
parser.add_argument('--include-categories', nargs='+', help='List of category IDs to include (space-separated)')
parser.add_argument('--exclude-categories', nargs='+', help='List of category IDs to exclude (space-separated)')
parser.add_argument('--include-topics', nargs='+', help='List of topic IDs to include (space-separated)')
parser.add_argument('--exclude-topics', nargs='+', help='List of topic IDs to exclude (space-separated)')
args = parser.parse_args()

# Base URL of the forum
BASE_URL = args.base_url

# User agent for requests
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

# Headers for requests
HEADERS = {
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
}

# Create output directories
os.makedirs(os.path.join(args.output_dir, 'categories'), exist_ok=True)
os.makedirs(os.path.join(args.output_dir, 'topics'), exist_ok=True)
os.makedirs(os.path.join('static', 'css'), exist_ok=True)

# Function to create a slug from text
def slugify(text):
    """Convert text to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

# Function to normalize URL
def normalize_url(url):
    """Normalize URL to ensure it's properly formatted"""
    # Remove any double domain prefixes
    if url.count(args.base_url) > 1:
        url = url.replace(args.base_url + args.base_url, args.base_url)
    
    # Ensure the URL starts with the base URL
    if not url.startswith('http'):
        url = args.base_url + url
    
    return url

# Function to make a request with retries
def make_request(url, max_retries=3, retry_delay=1):
    """Make a request with retries"""
    # Normalize the URL
    url = normalize_url(url)
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=HEADERS)
            if response.status_code == 200:
                return response
            print(f"Error: Failed to get {url} (status code: {response.status_code})")
        except Exception as e:
            print(f"Error making request to {url}: {e}")
        
        if attempt < max_retries - 1:
            retry_delay *= 2  # Exponential backoff
            print(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
    
    print(f"Failed to retrieve {url} after {max_retries} attempts")
    return None

# Function to get all categories
def get_categories():
    """Get all categories from the forum"""
    print("Getting categories...")
    response = make_request(BASE_URL)
    if not response:
        return []
    
    soup = BeautifulSoup(response.text, 'html.parser')
    categories = []
    
    # Extract categories from links in the page
    category_links = soup.find_all('a', href=re.compile(r'/c/'))
    
    # Keep track of processed categories to avoid duplicates
    processed_categories = set()
    
    for link in category_links:
        try:
            category_url = urljoin(BASE_URL, link['href'])
            # Extract category ID and name from URL
            # URL format: https://forum.btcz.rocks/c/category-name/ID
            parts = category_url.rstrip('/').split('/')
            if len(parts) < 5:
                continue
                
            category_id = parts[-1]
            category_name = link.text.strip()
            
            # Skip if already processed or empty name
            if not category_name or category_url in processed_categories:
                continue
                
            processed_categories.add(category_url)
            
            categories.append({
                'id': category_id,
                'name': category_name,
                'url': category_url,
                'description': f"BitcoinZ {category_name} discussions"
            })
            
            print(f"Found category: {category_name} (ID: {category_id})")
        except Exception as e:
            print(f"Error processing category: {e}")
    
    return categories

# Function to get topics for a category
def get_topics_for_category(category):
    """Get topics for a given category"""
    print(f"Getting topics for category: {category['name']}...")
    
    topics = []
    page = 1
    has_next_page = True
    processed_topic_ids = set()  # Track processed topic IDs to avoid duplicates
    
    while has_next_page:
        # Construct the URL for the current page
        page_url = f"{category['url']}?page={page}"
        print(f"  Fetching page {page}: {page_url}")
        
        # Make the request
        response = make_request(page_url)
        
        if not response:
            print(f"Failed to get page {page} for category {category['name']}")
            break
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Save the raw HTML if debug mode is enabled
        if args.debug:
            debug_dir = os.path.join(args.output_dir, 'debug')
            os.makedirs(debug_dir, exist_ok=True)
            with open(os.path.join(debug_dir, f"category_{category['id']}_page_{page}.html"), 'w', encoding='utf-8') as f:
                f.write(response.text)
        
        # Find all topic rows
        topic_rows = soup.select('tr.topic-list-item')
        
        # If no topics found on this page, break the loop
        if not topic_rows:
            print(f"  No topics found on page {page}")
            break
        
        found_new_topics = False
        
        # Process each topic row
        for row in topic_rows:
            try:
                # Extract topic ID and URL
                topic_link = row.select_one('a.title')
                if not topic_link or not topic_link.text.strip():
                    continue
                
                href = topic_link.get('href', '')
                match = re.search(r'/t/([^/]+)/(\d+)', href)
                if not match:
                    continue
                
                topic_id = match.group(2)
                
                # Skip if already processed
                if topic_id in processed_topic_ids:
                    continue
                
                processed_topic_ids.add(topic_id)
                found_new_topics = True
                
                # Extract topic title
                topic_title = topic_link.text.strip()
                
                # Build the full topic URL
                if href.startswith('http'):
                    topic_url = href
                else:
                    topic_url = f"{args.base_url}{href}"
                
                # Extract metadata
                posts_count = "0"
                views = "0"
                creator = "Unknown"
                
                # Try to get posts count
                posts_elem = row.select_one('td.num.posts')
                if posts_elem:
                    posts_count = posts_elem.text.strip()
                
                # Try to get views
                views_elem = row.select_one('td.num.views')
                if views_elem:
                    views = views_elem.text.strip()
                
                # Try to get creator
                creator_elem = row.select_one('.posters a')
                if creator_elem:
                    creator = creator_elem.get('title', 'Unknown')
                    if not creator or creator == 'Unknown':
                        creator = creator_elem.get('data-user-card', 'Unknown')
                
                # Add the topic to our list
                topics.append({
                    'id': topic_id,
                    'title': topic_title,
                    'url': topic_url,
                    'posts_count': posts_count,
                    'views': views,
                    'creator': creator,
                    'category_id': category['id'],
                    'category_name': category['name']
                })
                
                print(f"  Found topic: {topic_title} (ID: {topic_id})")
                
                # No limit on the number of topics
                # We want to capture all topics
            except Exception as e:
                print(f"Error processing topic: {e}")
        
        # If we didn't find any new topics on this page, break the loop
        if not found_new_topics:
            print(f"  No new topics found on page {page}")
            break
        
        # Check if there's a next page
        next_page_link = soup.select_one('a.btn.btn-icon-text.btn-primary.next-page')
        if not next_page_link:
            # Try alternative selector
            next_page_link = soup.select_one('a.btn.btn-primary.next')
        
        has_next_page = next_page_link is not None
        
        # No limit on the number of pages
        # We want to capture all pages
        
        page += 1
        
        # Add delay between requests
        time.sleep(args.delay)
    
    return topics

# Function to get posts for a topic
def get_posts_for_topic(topic):
    """Get posts for a given topic"""
    print(f"Getting posts for topic: {topic['title']}...")
    
    posts = []
    page = 1
    has_next_page = True
    processed_post_ids = set()  # Track processed post IDs to avoid duplicates
    
    while has_next_page:
        page_url = f"{topic['url']}?page={page}"
        print(f"  Fetching page {page}: {page_url}")
        
        response = make_request(page_url)
        
        if not response:
            print(f"  Failed to get response for {page_url}")
            break
        
        # Save the raw HTML if debug mode is enabled
        if args.debug:
            debug_dir = os.path.join(args.output_dir, 'debug')
            os.makedirs(debug_dir, exist_ok=True)
            with open(os.path.join(debug_dir, f"{topic['id']}_page_{page}.html"), 'w', encoding='utf-8') as f:
                f.write(response.text)
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        found_new_posts = False
        
        # Try to find posts using the Discourse crawler structure
        crawler_posts = soup.select('.crawler-post')
        if crawler_posts:
            print(f"  Found {len(crawler_posts)} posts using Discourse crawler structure")
            
            for post in crawler_posts:
                try:
                    # Extract post ID
                    post_id = post.get('id', '').replace('post_', '')
                    if not post_id:
                        post_id = f"post_{len(posts) + 1}"
                    
                    if post_id in processed_post_ids:
                        continue
                    
                    processed_post_ids.add(post_id)
                    found_new_posts = True
                    
                    # Extract author using multiple methods
                    author = "Unknown"
                    
                    # Method 1: Try to get from the meta section
                    author_elem = post.select_one('.crawler-post-meta [itemprop="name"]')
                    if author_elem:
                        author = author_elem.text.strip()
                    
                    # Method 2: Try to get from the author link
                    if not author or author == "Unknown":
                        author_link = post.select_one('.crawler-post-meta a[itemprop="url"]')
                        if author_link:
                            author_span = author_link.select_one('span[itemprop="name"]')
                            if author_span:
                                author = author_span.text.strip()
                    
                    # Method 3: Try to get from data attributes
                    if not author or author == "Unknown":
                        author_elem = post.select_one('[data-user-card]')
                        if author_elem:
                            author = author_elem.get('data-user-card', 'Unknown')
                    
                    # Method 4: Try to get from the creator section
                    if not author or author == "Unknown":
                        creator_elem = post.select_one('.creator span[itemprop="name"]')
                        if creator_elem:
                            author = creator_elem.text.strip()
                    
                    # Extract date
                    date = ""
                    date_elem = post.select_one('.post-time')
                    if date_elem:
                        date = date_elem.text.strip()
                    
                    # Extract content
                    content = ""
                    content_elem = post.select_one('.post')
                    if content_elem:
                        # Remove the meta section from the content
                        meta_section = content_elem.select_one('.crawler-post-meta')
                        if meta_section:
                            meta_section.extract()
                        content = content_elem.text.strip()
                    
                    # Create post object
                    post_obj = {
                        'id': post_id,
                        'author': author,
                        'date': date,
                        'content': content,
                        'topic_id': topic['id'],
                        'topic_title': topic['title']
                    }
                    
                    posts.append(post_obj)
                    print(f"  Found post by {author}")
                except Exception as e:
                    print(f"  Error processing crawler post: {e}")
        
        # If no crawler posts found or no new posts found, try regular structure
        if not crawler_posts or not found_new_posts:
            regular_posts = soup.select('.topic-post')
            if regular_posts:
                print(f"  Found {len(regular_posts)} posts using regular structure")
                
                for post in regular_posts:
                    try:
                        # Extract post ID
                        post_id = post.get('data-post-id', '')
                        if not post_id:
                            post_id = f"post_{len(posts) + 1}"
                            
                        if post_id in processed_post_ids:
                            continue
                        
                        processed_post_ids.add(post_id)
                        found_new_posts = True
                        
                        # Extract author using multiple methods
                        author = "Unknown"
                        
                        # Method 1: Try to get from the username span
                        author_elem = post.select_one('.names .username')
                        if author_elem:
                            author = author_elem.text.strip()
                        
                        # Method 2: Try to get from data attributes
                        if not author or author == "Unknown":
                            author_elem = post.select_one('[data-user-card]')
                            if author_elem:
                                author = author_elem.get('data-user-card', 'Unknown')
                        
                        # Method 3: Try to get from the poster name
                        if not author or author == "Unknown":
                            poster_elem = post.select_one('.poster-name')
                            if poster_elem:
                                author = poster_elem.text.strip()
                        
                        # Extract date
                        date = ""
                        date_elem = post.select_one('.post-date')
                        if date_elem:
                            date = date_elem.text.strip()
                        
                        # Extract content
                        content = ""
                        content_elem = post.select_one('.cooked')
                        if content_elem:
                            content = content_elem.text.strip()
                        
                        # Create post object
                        post_obj = {
                            'id': post_id,
                            'author': author,
                            'date': date,
                            'content': content,
                            'topic_id': topic['id'],
                            'topic_title': topic['title']
                        }
                        
                        posts.append(post_obj)
                        print(f"  Found post by {author}")
                    except Exception as e:
                        print(f"  Error processing regular post: {e}")
        
        # If we still have no posts and this is the first page, create a dummy post
        if page == 1 and not posts:
            print("  No posts found, creating a dummy post with topic title")
            posts.append({
                'id': 'post_1',
                'author': topic.get('creator', 'Unknown'),
                'date': '',
                'content': f"<p>Topic: {topic['title']}</p>",
                'topic_id': topic['id'],
                'topic_title': topic['title']
            })
            
        # Check if there's a next page - try different selectors
        has_next_page = False
        for next_selector in ['a.btn.btn-primary.next', '.topic-footer-buttons .btn.btn-primary.next', 'a[rel="next"]', '.pagination .next a', 'a.btn.btn-icon-text.btn-primary.next-page']:
            next_page_link = soup.select_one(next_selector)
            if next_page_link:
                has_next_page = True
                break
        
        # No page limit - we want all content
        # Just a safety check to avoid infinite loops (in case of pagination issues)
        if page > 100:  # Set a very high limit just as a safety measure
            print(f"  Reached safety page limit (100) - possible pagination issue")
            has_next_page = False
        
        # Add delay between requests if we're continuing to the next page
        if has_next_page:
            time.sleep(args.delay)
            page += 1
    
    # If we still have no posts, create a dummy post
    if not posts:
        posts.append({
            'id': 'post_1',
            'author': topic.get('author', 'Unknown'),
            'date': '',
            'content': f"<p>No content available for this topic.</p>"
        })
        print("  Created dummy post as no content was found")
    
    return posts

# Function to generate category page
def generate_category_page(category, topics):
    """Generate HTML page for a category"""
    print(f"Generating category page: {category['name']}...")
    
    category_dir = os.path.join(args.output_dir, 'categories', f"{category['id']}-{slugify(category['name'])}")
    os.makedirs(category_dir, exist_ok=True)
    
    with open(os.path.join(category_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{category['name']} - BitcoinZ Forum Archive</title>
    <link rel="stylesheet" href="/css/forum-archive.css">
</head>
<body>
    <div class="forum-archive-container">
        <div class="breadcrumbs">
            <a href="/ecosystem/forum-archive/">Forum Archive</a> &gt; {category['name']}
        </div>
        
        <h1>{category['name']}</h1>
        
        <div class="category-description">
            {category['description']}
        </div>
        
        <div class="topics-list">
            <h2>Topics</h2>
            <table>
                <thead>
                    <tr>
                        <th>Topic</th>
                        <th>Created by</th>
                        <th>Replies</th>
                        <th>Views</th>
                    </tr>
                </thead>
                <tbody>
                    {''.join([f"""
                    <tr>
                        <td>
                            <a href="/ecosystem/forum-archive/topics/{topic['id']}-{slugify(topic['title'])}/">
                                {topic['title']}
                            </a>
                        </td>
                        <td>{topic['creator']}</td>
                        <td>{topic['posts_count']}</td>
                        <td>{topic['views']}</td>
                    </tr>""" for topic in topics if topic['category_id'] == category['id']])}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>""")

# Function to generate topic page
def generate_posts_html(posts):
    """Generate HTML for posts"""
    if not posts:
        return "<div class='no-posts'>No posts found for this topic.</div>"
    
    posts_html = ""
    for post in posts:
        # Clean up post content if needed
        content = post['content']
        if not content or content.strip() == "":
            content = "<p><em>No content available for this post.</em></p>"
            
        posts_html += f"""
        <div class="post" id="post-{post['id']}">
            <div class="post-header">
                <div class="post-author">{post['author']}</div>
                <div class="post-date">{post['date']}</div>
            </div>
            <div class="post-content">
                {content}
            </div>
        </div>
        """
    
    return posts_html

def generate_topic_page(topic, posts):
    """Generate HTML for a topic page"""
    print(f"Generating topic page: {topic['title']}...")
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{topic['title']} - BitcoinZ Forum Archive</title>
    <link rel="stylesheet" href="/css/forum-archive.css">
</head>
<body>
    <div class="forum-archive-container">
        <div class="breadcrumbs">
            <a href="/ecosystem/forum-archive/">Forum Archive</a> &gt; 
            <a href="/ecosystem/forum-archive/categories/{topic['category_id']}-{slugify(topic['category_name'])}/">{ topic['category_name'] }</a> &gt; 
            {topic['title']}
        </div>
        
        <h1>{topic['title']}</h1>
        
        <div class="topic-meta">
            <span>Created by: {topic.get('author', 'Unknown')}</span>
            <span>Replies: {len(posts) - 1 if len(posts) > 0 else 0}</span>
            <span>Views: {topic.get('views', 0)}</span>
        </div>
        
        <div class="posts-list">
            {generate_posts_html(posts)}
        </div>
    </div>
</body>
</html>"""
    
    # Create directory for the topic
    topic_slug = slugify(topic['title'])
    topic_dir = os.path.join(args.output_dir, 'topics', f"{topic['id']}-{topic_slug}")
    os.makedirs(topic_dir, exist_ok=True)
    
    # Write the HTML file
    with open(os.path.join(topic_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
# Function to generate main page
def generate_main_page(categories, all_topics):
    """Generate the main forum archive page"""
    print("Generating main forum archive page...")
    
    with open(os.path.join(args.output_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BitcoinZ Forum Archive</title>
    <link rel="stylesheet" href="/css/forum-archive.css">
</head>
<body>
    <div class="forum-archive-container">
        <h1>BitcoinZ Official Forum Archive</h1>
        
        <div class="archive-description">
            <p>This is a static archive of the official BitcoinZ forum, preserving the community's history and valuable discussions. 
            The original forum has been closed, but its content remains accessible here in a read-only format.</p>
            <p>Browse through the categories below to explore the archived forum content.</p>
        </div>
        
        <div class="categories-list">
            <h2>Forum Categories</h2>
            <ul class="category-grid">
                {''.join([f"""
                <li>
                    <a href="/ecosystem/forum-archive/categories/{category['id']}-{slugify(category['name'])}/">
                        <h2>{category['name']}</h2>
                    </a>
                    <p>{category['description']}</p>
                    <div class="category-stats">
                        <span>{len([t for t in all_topics if t['category_id'] == category['id']])} topics</span>
                    </div>
                </li>""" for category in categories])}
            </ul>
        </div>
        
        <div class="recent-topics">
            <h2>Recent Topics</h2>
            <ul>
                {''.join([f"""
                <li>
                    <a href="/ecosystem/forum-archive/topics/{topic['id']}-{slugify(topic['title'])}/">
                        {topic['title']}
                    </a>
                    <span class="topic-category">{topic['category_name']}</span>
                </li>""" for topic in sorted(all_topics, key=lambda x: x['id'], reverse=True)[:10]])}
            </ul>
        </div>
    </div>
</body>
</html>""")

# Function to generate CSS
def generate_css():
    """Generate CSS for the forum archive"""
    print("Generating CSS file for forum archive...")
    
    with open(os.path.join('static', 'css', 'forum-archive.css'), 'w', encoding='utf-8') as f:
        f.write("""/* BitcoinZ Forum Archive CSS */

/* General styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #e0e0e0;
    background-color: #121212;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.forum-archive-container {
    background-color: #1e1e1e;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    padding: 30px;
    margin-bottom: 30px;
}

h1, h2, h3 {
    color: #f0c419;
}

h1 {
    font-size: 2.2em;
    margin-bottom: 20px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
}

h2 {
    font-size: 1.8em;
    margin: 25px 0 15px;
}

a {
    color: #3498db;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
    color: #2980b9;
}

/* Breadcrumbs */
.breadcrumbs {
    margin-bottom: 20px;
    font-size: 0.9em;
    color: #888;
}

.breadcrumbs a {
    color: #3498db;
}

/* Categories list */
.categories-list h2 {
    margin: 30px 0 15px;
    font-size: 1.8em;
    color: #f0c419;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    list-style: none;
    padding: 0;
}

.categories-list li {
    padding: 15px;
    border: 1px solid #333;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: #252525;
}

.categories-list li:hover {
    background-color: #303030;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.categories-list li h2 {
    margin: 0 0 10px;
    font-size: 1.5em;
    color: #f0c419;
    border-bottom: none;
}

.categories-list p {
    margin: 0 0 10px;
    color: #ccc;
    font-size: 0.9em;
    line-height: 1.5;
}

.category-stats {
    font-size: 0.8em;
    color: #888;
    margin-top: 10px;
}

/* Recent topics */
.recent-topics ul {
    list-style: none;
    padding: 0;
}

.recent-topics li {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #252525;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.recent-topics li:hover {
    background-color: #303030;
}

.topic-category {
    font-size: 0.8em;
    color: #888;
    background-color: #333;
    padding: 3px 8px;
    border-radius: 4px;
}

/* Topics list */
.topics-list table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.topics-list th, .topics-list td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #333;
}

.topics-list th {
    background-color: #252525;
    font-weight: bold;
    color: #f0c419;
}

.topics-list tr:hover {
    background-color: #303030;
}

/* Topic page */
.topic-meta {
    background-color: #252525;
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 0.9em;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.topic-meta span {
    margin-right: 20px;
}

/* Posts */
.post {
    margin-bottom: 30px;
    border: 1px solid #333;
    border-radius: 8px;
    overflow: hidden;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    background-color: #252525;
    padding: 10px 15px;
    font-size: 0.9em;
    border-bottom: 1px solid #333;
}

.post-author .username {
    font-weight: bold;
    color: #3498db;
}

.post-date {
    color: #888;
}

.post-content {
    padding: 20px;
    overflow-wrap: break-word;
}

.post-content blockquote {
    margin: 10px 0;
    padding: 10px 15px;
    border-left: 3px solid #444;
    background-color: #252525;
    color: #ccc;
}

.post-content pre {
    background-color: #252525;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
}

.post-content img {
    max-width: 100%;
    height: auto;
}

.post-content a {
    color: #3498db;
}

.post-content a:hover {
    color: #2980b9;
}

/* Responsive design */
@media (max-width: 768px) {
    .forum-archive-container {
        padding: 15px;
    }
    
    .post-meta {
        flex-direction: column;
    }
    
    .post-author, .post-date {
        margin-bottom: 5px;
    }
    
    .topics-list th:nth-child(3), 
    .topics-list td:nth-child(3),
    .topics-list th:nth-child(4), 
    .topics-list td:nth-child(4) {
        display: none;
    }
    
    .topic-meta {
        flex-direction: column;
    }
    
    .topic-meta span {
        margin-bottom: 5px;
    }
}
""")

# Main function
def main():
    print("Starting BitcoinZ Forum scraper...")
    
    # Clean output directory if requested
    if args.clean:
        print("Cleaning output directory...")
        categories_dir = os.path.join(args.output_dir, 'categories')
        topics_dir = os.path.join(args.output_dir, 'topics')
        debug_dir = os.path.join(args.output_dir, 'debug')
        index_file = os.path.join(args.output_dir, 'index.html')
        
        # Remove existing content
        if os.path.exists(categories_dir):
            shutil.rmtree(categories_dir)
        if os.path.exists(topics_dir):
            shutil.rmtree(topics_dir)
        if os.path.exists(debug_dir):
            shutil.rmtree(debug_dir)
        if os.path.exists(index_file):
            os.remove(index_file)
    
    # Create output directories if they don't exist
    os.makedirs(os.path.join(args.output_dir, 'categories'), exist_ok=True)
    os.makedirs(os.path.join(args.output_dir, 'topics'), exist_ok=True)
    if args.debug:
        os.makedirs(os.path.join(args.output_dir, 'debug'), exist_ok=True)
    
    # Generate CSS file
    generate_css()
    
    # Get categories
    print("Getting categories...")
    categories = get_categories()
    
    # Filter categories based on include/exclude lists
    if args.include_categories:
        include_ids = set(args.include_categories)
        categories = [c for c in categories if str(c['id']) in include_ids]
        print(f"Filtered to {len(categories)} included categories")
    
    if args.exclude_categories:
        exclude_ids = set(args.exclude_categories)
        categories = [c for c in categories if str(c['id']) not in exclude_ids]
        print(f"Excluded {len(exclude_ids)} categories")
    
    print(f"Found {len(categories)} categories to process")
    
    all_topics = []
    
    # Process each category
    for category in categories:
        # Get topics for the category
        topics = get_topics_for_category(category)
        
        # Filter topics based on include/exclude lists
        if args.include_topics:
            include_ids = set(args.include_topics)
            topics = [t for t in topics if str(t['id']) in include_ids]
        
        if args.exclude_topics:
            exclude_ids = set(args.exclude_topics)
            topics = [t for t in topics if str(t['id']) not in exclude_ids]
        
        # Generate category page
        generate_category_page(category, topics)
        
        # Add topics to the list of all topics
        all_topics.extend(topics)
    
    print(f"Found {len(all_topics)} topics in total")
    
    # Process each topic
    for topic in all_topics:
        # Get posts for the topic
        posts = get_posts_for_topic(topic)
        
        # Generate topic page
        generate_topic_page(topic, posts)
    
    # Generate main page
    generate_main_page(categories, all_topics)
    
    print("BitcoinZ Forum scraping and archive generation completed!")

if __name__ == "__main__":
    main()
