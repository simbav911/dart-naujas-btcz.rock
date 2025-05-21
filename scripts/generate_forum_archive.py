#!/usr/bin/env python3
"""
BitcoinZ Forum Archive Generator

This script processes a Discourse PostgreSQL database dump and generates
static HTML pages for a forum archive to be integrated into the BitcoinZ website.
"""

import os
import re
import sys
import json
import html
import psycopg2
import argparse
from datetime import datetime
from jinja2 import Environment, FileSystemLoader

# Set up argument parser
parser = argparse.ArgumentParser(description='Generate static HTML pages for BitcoinZ Forum Archive')
parser.add_argument('--db-name', required=True, help='PostgreSQL database name')
parser.add_argument('--db-user', required=True, help='PostgreSQL database user')
parser.add_argument('--db-password', default='', help='PostgreSQL database password (default: empty)')
parser.add_argument('--db-host', default='localhost', help='PostgreSQL database host (default: localhost)')
parser.add_argument('--db-port', default='5432', help='PostgreSQL database port (default: 5432)')
parser.add_argument('--output-dir', default='content/ecosystem/forum-archive', help='Output directory for generated files')
args = parser.parse_args()

# Create output directories
os.makedirs(os.path.join(args.output_dir, 'categories'), exist_ok=True)
os.makedirs(os.path.join(args.output_dir, 'topics'), exist_ok=True)

# Set up Jinja2 templates
template_dir = os.path.join('layouts', 'forum-archive')
if not os.path.exists(template_dir):
    os.makedirs(template_dir, exist_ok=True)

env = Environment(loader=FileSystemLoader(template_dir))

# Connect to the database
try:
    conn = psycopg2.connect(
        dbname=args.db_name,
        user=args.db_user,
        password=args.db_password,
        host=args.db_host,
        port=args.db_port
    )
    cursor = conn.cursor()
    print("Connected to the database successfully!")
    
    # Check if the backup schema exists
    cursor.execute("""SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'backup'""")
    has_backup_schema = cursor.fetchone() is not None
    
    if not has_backup_schema:
        print("Warning: 'backup' schema not found. Will try using the public schema instead.")
        
except Exception as e:
    print(f"Error connecting to the database: {e}")
    sys.exit(1)

def slugify(text):
    """Convert text to a URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def format_date(timestamp):
    """Format a timestamp into a human-readable date"""
    if timestamp is None:
        return "Unknown date"
    try:
        dt = datetime.fromisoformat(str(timestamp).replace('Z', '+00:00'))
        return dt.strftime("%B %d, %Y at %H:%M")
    except:
        return str(timestamp)

def process_post_content(content):
    """Process post content to make it suitable for static HTML display"""
    if content is None:
        return ""
    
    # Convert any Discourse-specific formatting to HTML
    # This is a simplified version and might need enhancements
    
    # Handle code blocks
    content = re.sub(r'```(\w+)?\n(.*?)\n```', r'<pre><code>\2</code></pre>', content, flags=re.DOTALL)
    
    # Handle quotes
    content = re.sub(r'>\s*(.*?)(?:\n\n|\Z)', r'<blockquote>\1</blockquote>', content, flags=re.DOTALL)
    
    # Handle links
    content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', content)
    
    # Convert newlines to <br>
    content = content.replace('\n', '<br>')
    
    return content

def get_categories():
    """Get all categories from the database"""
    try:
        cursor.execute("""
            SELECT id, name, description, slug, position
            FROM public.categories
            WHERE parent_category_id IS NULL
            ORDER BY position
        """)
        return cursor.fetchall()
    except Exception as e:
        print(f"Error getting categories: {e}")
        # Try with just categories table (no schema)
        try:
            cursor.execute("""
                SELECT id, name, description, slug, position
                FROM categories
                WHERE parent_category_id IS NULL
                ORDER BY position
            """)
            return cursor.fetchall()
        except Exception as e2:
            print(f"Error getting categories from categories table: {e2}")
            return []

def get_subcategories(parent_id):
    """Get subcategories for a given parent category"""
    try:
        cursor.execute("""
            SELECT id, name, description, slug, position
            FROM public.categories
            WHERE parent_category_id = %s
            ORDER BY position
        """, (parent_id,))
        return cursor.fetchall()
    except Exception as e:
        print(f"Error getting subcategories: {e}")
        # Try with just categories table (no schema)
        try:
            cursor.execute("""
                SELECT id, name, description, slug, position
                FROM categories
                WHERE parent_category_id = %s
                ORDER BY position
            """, (parent_id,))
            return cursor.fetchall()
        except Exception as e2:
            print(f"Error getting subcategories from categories table: {e2}")
            return []

def get_topics_for_category(category_id):
    """Get topics for a given category"""
    try:
        cursor.execute("""
            SELECT t.id, t.title, t.created_at, t.views, t.posts_count, 
                   u.username as creator_username
            FROM public.topics t
            LEFT JOIN public.users u ON t.user_id = u.id
            WHERE t.category_id = %s
            AND t.deleted_at IS NULL
            ORDER BY t.created_at DESC
        """, (category_id,))
        return cursor.fetchall()
    except Exception as e:
        print(f"Error getting topics for category: {e}")
        # Try with just tables (no schema)
        try:
            cursor.execute("""
                SELECT t.id, t.title, t.created_at, t.views, t.posts_count, 
                       u.username as creator_username
                FROM topics t
                LEFT JOIN users u ON t.user_id = u.id
                WHERE t.category_id = %s
                AND t.deleted_at IS NULL
                ORDER BY t.created_at DESC
            """, (category_id,))
            return cursor.fetchall()
        except Exception as e2:
            print(f"Error getting topics from tables: {e2}")
            return []

def get_posts_for_topic(topic_id):
    """Get posts for a given topic"""
    try:
        cursor.execute("""
            SELECT p.id, p.post_number, p.created_at, p.updated_at, p.cooked as content,
                   u.username, u.name as full_name, u.created_at as user_created_at
            FROM public.posts p
            LEFT JOIN public.users u ON p.user_id = u.id
            WHERE p.topic_id = %s
            AND p.deleted_at IS NULL
            ORDER BY p.post_number
        """, (topic_id,))
        return cursor.fetchall()
    except Exception as e:
        print(f"Error getting posts for topic: {e}")
        # Try with just tables (no schema)
        try:
            cursor.execute("""
                SELECT p.id, p.post_number, p.created_at, p.updated_at, p.cooked as content,
                       u.username, u.name as full_name, u.created_at as user_created_at
                FROM posts p
                LEFT JOIN users u ON p.user_id = u.id
                WHERE p.topic_id = %s
                AND p.deleted_at IS NULL
                ORDER BY p.post_number
            """, (topic_id,))
            return cursor.fetchall()
        except Exception as e2:
            print(f"Error getting posts from tables: {e2}")
            return []

def get_topic_details(topic_id):
    """Get details for a specific topic"""
    try:
        cursor.execute("""
            SELECT t.id, t.title, t.created_at, t.views, t.posts_count, 
                   t.category_id, c.name as category_name, c.slug as category_slug,
                   u.username as creator_username
            FROM public.topics t
            LEFT JOIN public.categories c ON t.category_id = c.id
            LEFT JOIN public.users u ON t.user_id = u.id
            WHERE t.id = %s
        """, (topic_id,))
        return cursor.fetchone()
    except Exception as e:
        print(f"Error getting topic details: {e}")
        # Try with just tables (no schema)
        try:
            cursor.execute("""
                SELECT t.id, t.title, t.created_at, t.views, t.posts_count, 
                       t.category_id, c.name as category_name, c.slug as category_slug,
                       u.username as creator_username
                FROM topics t
                LEFT JOIN categories c ON t.category_id = c.id
                LEFT JOIN users u ON t.user_id = u.id
                WHERE t.id = %s
            """, (topic_id,))
            return cursor.fetchone()
        except Exception as e2:
            print(f"Error getting topic details from tables: {e2}")
            return None

def generate_category_page(category_id, category_name, category_slug, category_description):
    """Generate HTML page for a category"""
    topics = get_topics_for_topic_list(category_id)
    subcategories = get_subcategories(category_id)
    
    # Create category directory
    category_dir = os.path.join(args.output_dir, 'categories', f"{category_id}-{slugify(category_name)}")
    os.makedirs(category_dir, exist_ok=True)
    
    # Create index.html file for the category
    with open(os.path.join(category_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(category_name)} - BitcoinZ Forum Archive</title>
    <link rel="stylesheet" href="/css/forum-archive.css">
</head>
<body>
    <div class="forum-archive-container">
        <div class="breadcrumbs">
            <a href="/ecosystem/forum-archive/">Forum Archive</a> &gt; {html.escape(category_name)}
        </div>
        
        <h1>{html.escape(category_name)}</h1>
        
        <div class="category-description">
            {category_description or ''}
        </div>
        
        {generate_subcategories_html(subcategories) if subcategories else ''}
        
        <div class="topics-list">
            <h2>Topics</h2>
            <table>
                <thead>
                    <tr>
                        <th>Topic</th>
                        <th>Created</th>
                        <th>Replies</th>
                        <th>Views</th>
                    </tr>
                </thead>
                <tbody>
                    {generate_topics_html(topics)}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>""")
    
    print(f"Generated category page: {category_name}")
    
    # Process subcategories
    for subcategory in subcategories:
        generate_category_page(subcategory[0], subcategory[1], subcategory[3], subcategory[2])

def generate_subcategories_html(subcategories):
    """Generate HTML for subcategories list"""
    if not subcategories:
        return ""
    
    html_content = """<div class="subcategories">
        <h2>Subcategories</h2>
        <ul>"""
    
    for subcategory in subcategories:
        subcategory_id, name, description, slug, position = subcategory
        html_content += f"""
            <li>
                <a href="/ecosystem/forum-archive/categories/{subcategory_id}-{slugify(name)}/">
                    {html.escape(name)}
                </a>
                <p>{html.escape(description or '')}</p>
            </li>"""
    
    html_content += """
        </ul>
    </div>"""
    
    return html_content

def generate_topics_html(topics):
    """Generate HTML for topics list"""
    if not topics:
        return "<tr><td colspan='4'>No topics found</td></tr>"
    
    html_content = ""
    
    for topic in topics:
        topic_id, title, created_at, views, posts_count, creator_username = topic
        html_content += f"""
        <tr>
            <td>
                <a href="/ecosystem/forum-archive/topics/{topic_id}-{slugify(title)}/">
                    {html.escape(title)}
                </a>
                <div class="topic-creator">by {creator_username or 'Unknown'}</div>
            </td>
            <td>{format_date(created_at)}</td>
            <td>{posts_count - 1 if posts_count else 0}</td>
            <td>{views or 0}</td>
        </tr>"""
    
    return html_content

def get_topics_for_topic_list(category_id):
    """Get topics for a given category, formatted for the topic list"""
    cursor.execute("""
        SELECT t.id, t.title, t.created_at, t.views, t.posts_count, 
               u.username as creator_username
        FROM backup.topics t
        LEFT JOIN backup.users u ON t.user_id = u.id
        WHERE t.category_id = %s
        AND t.deleted_at IS NULL
        ORDER BY t.created_at DESC
    """, (category_id,))
    return cursor.fetchall()

def generate_topic_page(topic_id):
    """Generate HTML page for a topic"""
    topic_details = get_topic_details(topic_id)
    if not topic_details:
        print(f"Topic {topic_id} not found")
        return
    
    topic_id, title, created_at, views, posts_count, category_id, category_name, category_slug, creator_username = topic_details
    posts = get_posts_for_topic(topic_id)
    
    # Create topic directory
    topic_dir = os.path.join(args.output_dir, 'topics', f"{topic_id}-{slugify(title)}")
    os.makedirs(topic_dir, exist_ok=True)
    
    # Create index.html file for the topic
    with open(os.path.join(topic_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(title)} - BitcoinZ Forum Archive</title>
    <link rel="stylesheet" href="/css/forum-archive.css">
</head>
<body>
    <div class="forum-archive-container">
        <div class="breadcrumbs">
            <a href="/ecosystem/forum-archive/">Forum Archive</a> &gt; 
            <a href="/ecosystem/forum-archive/categories/{category_id}-{slugify(category_name or 'unknown')}/">{html.escape(category_name or 'Unknown Category')}</a> &gt; 
            {html.escape(title)}
        </div>
        
        <h1>{html.escape(title)}</h1>
        
        <div class="topic-meta">
            <span>Created: {format_date(created_at)}</span>
            <span>Views: {views or 0}</span>
            <span>Replies: {posts_count - 1 if posts_count else 0}</span>
        </div>
        
        <div class="posts-list">
            {generate_posts_html(posts)}
        </div>
    </div>
</body>
</html>""")
    
    print(f"Generated topic page: {title}")

def generate_posts_html(posts):
    """Generate HTML for posts list"""
    if not posts:
        return "<div class='no-posts'>No posts found</div>"
    
    html_content = ""
    
    for post in posts:
        post_id, post_number, created_at, updated_at, content, username, full_name, user_created_at = post
        
        # Process the post content
        processed_content = process_post_content(content)
        
        html_content += f"""
        <div class="post" id="post-{post_id}">
            <div class="post-meta">
                <div class="post-author">
                    <span class="username">{html.escape(username or 'Unknown')}</span>
                    {f'<span class="fullname">({html.escape(full_name)})</span>' if full_name else ''}
                    <div class="user-joined">Joined: {format_date(user_created_at)}</div>
                </div>
                <div class="post-date">
                    <span>Posted: {format_date(created_at)}</span>
                    {f'<span>(Edited: {format_date(updated_at)})</span>' if updated_at and updated_at != created_at else ''}
                </div>
                <div class="post-number">#{post_number}</div>
            </div>
            <div class="post-content">
                {processed_content}
            </div>
        </div>"""
    
    return html_content

def generate_main_page():
    """Generate the main forum archive page"""
    categories = get_categories()
    
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
            {generate_categories_html(categories)}
        </div>
    </div>
</body>
</html>""")
    
    print("Generated main forum archive page")

def generate_categories_html(categories):
    """Generate HTML for categories list"""
    if not categories:
        return "<div class='no-categories'>No categories found</div>"
    
    html_content = """<ul>"""
    
    for category in categories:
        category_id, name, description, slug, position = category
        html_content += f"""
        <li>
            <a href="/ecosystem/forum-archive/categories/{category_id}-{slugify(name)}/">
                <h2>{html.escape(name)}</h2>
            </a>
            <p>{html.escape(description or '')}</p>
        </li>"""
    
    html_content += """</ul>"""
    
    return html_content

def generate_css():
    """Generate CSS for the forum archive"""
    css_dir = os.path.join('static', 'css')
    os.makedirs(css_dir, exist_ok=True)
    
    with open(os.path.join(css_dir, 'forum-archive.css'), 'w', encoding='utf-8') as f:
        f.write("""/* BitcoinZ Forum Archive CSS */

/* General styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.forum-archive-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin-bottom: 30px;
}

h1, h2, h3 {
    color: #0f2e53;
}

h1 {
    font-size: 2.2em;
    margin-bottom: 20px;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 10px;
}

h2 {
    font-size: 1.8em;
    margin: 25px 0 15px;
}

a {
    color: #1a73e8;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* Breadcrumbs */
.breadcrumbs {
    margin-bottom: 20px;
    font-size: 0.9em;
    color: #666;
}

.breadcrumbs a {
    color: #1a73e8;
}

/* Categories list */
.categories-list ul {
    list-style: none;
    padding: 0;
}

.categories-list li {
    margin-bottom: 25px;
    padding: 15px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.categories-list li:hover {
    background-color: #f9f9f9;
}

.categories-list h2 {
    margin: 0 0 10px;
    font-size: 1.5em;
}

.categories-list p {
    margin: 0;
    color: #666;
}

/* Subcategories */
.subcategories ul {
    list-style: none;
    padding: 0;
}

.subcategories li {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
}

.subcategories a {
    font-weight: bold;
}

.subcategories p {
    margin: 5px 0 0;
    font-size: 0.9em;
    color: #666;
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
    border-bottom: 1px solid #eaeaea;
}

.topics-list th {
    background-color: #f5f5f5;
    font-weight: bold;
}

.topics-list tr:hover {
    background-color: #f9f9f9;
}

.topic-creator {
    font-size: 0.85em;
    color: #666;
    margin-top: 3px;
}

/* Topic page */
.topic-meta {
    background-color: #f5f5f5;
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 0.9em;
}

.topic-meta span {
    margin-right: 20px;
}

/* Posts */
.post {
    margin-bottom: 30px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    overflow: hidden;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    background-color: #f5f5f5;
    padding: 10px 15px;
    font-size: 0.9em;
    border-bottom: 1px solid #eaeaea;
}

.post-author .username {
    font-weight: bold;
}

.post-author .fullname {
    color: #666;
}

.user-joined {
    font-size: 0.85em;
    color: #666;
    margin-top: 3px;
}

.post-date {
    color: #666;
}

.post-date span {
    display: block;
}

.post-number {
    color: #999;
    font-weight: bold;
}

.post-content {
    padding: 20px;
    overflow-wrap: break-word;
}

.post-content blockquote {
    margin: 10px 0;
    padding: 10px 15px;
    border-left: 3px solid #ddd;
    background-color: #f9f9f9;
    color: #555;
}

.post-content pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
}

.post-content img {
    max-width: 100%;
    height: auto;
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
}
""")
    
    print("Generated CSS file for forum archive")

def main():
    """Main function to generate the forum archive"""
    print("Starting BitcoinZ Forum Archive generation...")
    
    # Generate CSS
    generate_css()
    
    # Generate main page
    generate_main_page()
    
    # Generate category pages
    categories = get_categories()
    if not categories:
        print("No categories found. Please check your database connection and schema.")
        return
        
    print(f"Found {len(categories)} categories to process")
    
    for category in categories:
        category_id, name, description, slug, position = category
        generate_category_page(category_id, name, slug, description)
    
    # Generate topic pages - filter out system messages and focus on meaningful topics
    try:
        cursor.execute("""
            SELECT id FROM public.topics
            WHERE deleted_at IS NULL
            AND title NOT LIKE 'Account temporarily on hold'
            AND title NOT LIKE 'Account no longer on hold'
            AND title NOT LIKE 'Greetings!'
            AND title NOT LIKE 'Thanks for spending time with us'
            AND title NOT LIKE 'You''re a New User of the Month!'
            AND title NOT LIKE 'Congratulations on your trust level promotion!'
            AND title NOT LIKE 'Now that you''ve been promoted%'
            AND title NOT LIKE 'Backup completed successfully'
            AND title NOT LIKE '%post waiting to be reviewed'
            AND title NOT LIKE '%item needs to be reviewed'
            AND title NOT LIKE ':robot:%'
            AND category_id IS NOT NULL
            ORDER BY created_at DESC
        """)
        topics = cursor.fetchall()
    except Exception as e:
        print(f"Error getting topics: {e}")
        # Try with just topics table (no schema)
        try:
            cursor.execute("""
                SELECT id FROM topics
                WHERE deleted_at IS NULL
                AND title NOT LIKE 'Account temporarily on hold'
                AND title NOT LIKE 'Account no longer on hold'
                AND title NOT LIKE 'Greetings!'
                AND title NOT LIKE 'Thanks for spending time with us'
                AND title NOT LIKE 'You''re a New User of the Month!'
                AND title NOT LIKE 'Congratulations on your trust level promotion!'
                AND title NOT LIKE 'Now that you''ve been promoted%'
                AND title NOT LIKE 'Backup completed successfully'
                AND title NOT LIKE '%post waiting to be reviewed'
                AND title NOT LIKE '%item needs to be reviewed'
                AND title NOT LIKE ':robot:%'
                AND category_id IS NOT NULL
                ORDER BY created_at DESC
            """)
            topics = cursor.fetchall()
        except Exception as e2:
            print(f"Error getting topics from topics table: {e2}")
            topics = []
    
    total_topics = len(topics)
    print(f"Found {total_topics} topics to process")
    
    for i, (topic_id,) in enumerate(topics):
        generate_topic_page(topic_id)
        if (i + 1) % 100 == 0:
            print(f"Processed {i + 1}/{total_topics} topics")
    
    # Close database connection
    cursor.close()
    conn.close()
    
    print("BitcoinZ Forum Archive generation completed!")

if __name__ == "__main__":
    main()
