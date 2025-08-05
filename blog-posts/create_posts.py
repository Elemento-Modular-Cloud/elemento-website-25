#!/usr/bin/env python3
"""
Blog Post Generator Script
Generates HTML blog posts from CSV data and updates the blog index.
"""

import csv
import json
import os
import re
from datetime import datetime
from pathlib import Path

def clean_html_content(content):
    """Clean and format HTML content from the CSV."""
    if not content:
        return ""
    
    # Remove extra quotes and escape characters
    content = content.replace('""', '"')
    content = content.replace('\\"', '"')
    
    # Clean up common HTML issues
    content = re.sub(r'<p id="""">', '<p>', content)
    content = re.sub(r'<p id="""">', '<p>', content)
    content = re.sub(r'<h\d+ id="""">', '<h3>', content)
    content = re.sub(r'<h\d+ id="""">', '<h3>', content)
    content = re.sub(r'<li id="""">', '<li>', content)
    content = re.sub(r'<li id="""">', '<li>', content)
    content = re.sub(r'<ol start="""" id="""">', '<ol>', content)
    content = re.sub(r'<ol start="""" id="""">', '<ol>', content)
    content = re.sub(r'<ul id="""">', '<ul>', content)
    content = re.sub(r'<ul id="""">', '<ul>', content)
    content = re.sub(r'<strong id="""">', '<strong>', content)
    content = re.sub(r'<strong id="""">', '<strong>', content)
    content = re.sub(r'<a href="([^"]*)" id="""">', r'<a href="\1">', content)
    content = re.sub(r'<a href="([^"]*)" id="""">', r'<a href="\1">', content)
    
    return content

def parse_date(date_str):
    """Parse date string and return formatted date."""
    if not date_str:
        return "Unknown Date"
    
    try:
        # Handle various date formats
        if "GMT" in date_str:
            # Parse dates like "Fri Mar 28 2025 14:52:41 GMT+0000"
            date_obj = datetime.strptime(date_str.split(" GMT")[0], "%a %b %d %Y %H:%M:%S")
        else:
            # Try other formats
            date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        
        return date_obj.strftime("%Y-%m-%d")
    except:
        return "Unknown Date"

def generate_blog_post_html(post_data):
    """Generate HTML content for a blog post."""
    
    title = post_data.get('Name', 'Untitled')
    author = post_data.get('Authors', 'Unknown Author')
    date = parse_date(post_data.get('Published On') or post_data.get('Created On'))
    summary = post_data.get('Post Summary', '')
    content = clean_html_content(post_data.get('Post body', ''))
    main_image = post_data.get('Main Image', '')
    reference_links = clean_html_content(post_data.get('Data Referance links', ''))
    
    # Generate filename
    slug = post_data.get('Slug', '')
    if not slug:
        # Create slug from title
        slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
        slug = re.sub(r'\s+', '-', slug.strip())
    
    filename = f"{date}-{slug}.html"
    
    html_template = f"""<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>{title} | Elemento Blog</title>
  <meta name="description" content="{summary[:160] if summary else ''}">
  <link rel='stylesheet' href='../css/style.css'>
  <link rel='stylesheet' href='../css/themes.css'>
  <link rel="icon" type="image/svg+xml" href="../assets/favicon/favicon.svg">
</head>
<body class='theme-default'>
  <!-- Background Canvas for animated gradients -->
  
  <!-- Navigation -->
  <div id="navbar-placeholder"></div>
  
  <main class='container'>
    <article class='blog-post'>
      <h1>{title}</h1>
      <p class='blog-meta'>By {author} &mdash; {date}</p>
      <p class='blog-summary'>{summary}</p>
      
      {f'<img src="{main_image}" alt="{title}" class="blog-hero-image">' if main_image else ''}
      
      <div class='blog-content'>
        {content}
        
        {f'<div class="blog-references"><h3>References</h3>{reference_links}</div>' if reference_links else ''}
      </div>
    </article>
  </main>
  
  <div id="footer-placeholder"></div>
  
  <script src="../js/navbar.js"></script>
  <script src="../js/main.js"></script>
  <script src="../js/footer.js"></script>
</body>
</html>"""
    
    return filename, html_template

def update_blog_index(blog_posts_data):
    """Update the blog index.json file."""
    index_data = []
    
    for post_data in blog_posts_data:
        title = post_data.get('Name', 'Untitled')
        author = post_data.get('Authors', 'Unknown Author')
        date = parse_date(post_data.get('Published On') or post_data.get('Created On'))
        summary = post_data.get('Post Summary', '')
        
        # Generate filename
        slug = post_data.get('Slug', '')
        if not slug:
            slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
            slug = re.sub(r'\s+', '-', slug.strip())
        
        filename = f"{date}-{slug}.html"
        
        index_data.append({
            "title": title,
            "author": author,
            "date": date,
            "summary": summary,
            "filename": filename
        })
    
    # Sort by date (newest first)
    index_data.sort(key=lambda x: x['date'], reverse=True)
    
    return index_data

def main():
    """Main function to generate blog posts from CSV."""
    
    # Paths
    csv_file = "blog-posts/Elemento New Website - Blog posts.csv"
    blog_dir = "blog-posts"
    
    # Read CSV file
    blog_posts = []
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Skip empty rows or drafts
            if row.get('Name') and not row.get('Draft', '').lower() == 'true':
                blog_posts.append(row)
    
    print(f"Found {len(blog_posts)} blog posts to generate")
    
    # Generate HTML files
    generated_files = []
    for i, post_data in enumerate(blog_posts, 1):
        try:
            filename, html_content = generate_blog_post_html(post_data)
            file_path = os.path.join(blog_dir, filename)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            generated_files.append(filename)
            print(f"Generated: {filename} ({i}/{len(blog_posts)})")
            
        except Exception as e:
            print(f"Error generating post {i}: {e}")
    
    # Update index.json
    try:
        index_data = update_blog_index(blog_posts)
        index_path = os.path.join(blog_dir, "index.json")
        
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)
        
        print(f"\nUpdated index.json with {len(index_data)} posts")
        
    except Exception as e:
        print(f"Error updating index.json: {e}")
    
    print(f"\nSuccessfully generated {len(generated_files)} blog posts!")
    print("Generated files:")
    for filename in generated_files:
        print(f"  - {filename}")

if __name__ == "__main__":
    main()