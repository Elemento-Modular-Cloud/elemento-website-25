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
    
    # Fix double-quote escaping issues
    content = content.replace('""', '"')
    content = content.replace('\\"', '"')
    
    # Clean up problematic HTML attributes
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
    
    # Clean up other problematic patterns
    content = re.sub(r'<ol start="""" id="""">', '<ol>', content)
    content = re.sub(r'<ol start="""" id="""">', '<ol>', content)
    content = re.sub(r'<ol start=""(\d+)"" id="""">', r'<ol start="\1">', content)
    content = re.sub(r'<ol start=""(\d+)"" id="""">', r'<ol start="\1">', content)
    
    # Fix iframe and div attributes
    content = re.sub(r'<iframe width=""(\d+)"" height=""(\d+)""', r'<iframe width="\1" height="\2"', content)
    content = re.sub(r'<div data-rt-embed-type=""true"">', '<div class="embed-container">', content)
    
    # Clean up figure elements
    content = re.sub(r'<figure id="""" class=""([^"]*)""', r'<figure class="\1"', content)
    content = re.sub(r'<div id="""">', '<div>', content)
    content = re.sub(r'<img[^>]*id=""""[^>]*>', lambda m: m.group(0).replace('id=""""', ''), content)
    
    # Fix any remaining double-quote issues in attributes
    content = re.sub(r'([a-zA-Z-]+)=""([^"]*)""', r'\1="\2"', content)
    
    # Fix malformed paragraph tags
    content = re.sub(r'<p id=">', '<p>', content)
    content = re.sub(r'<p id=">', '<p>', content)
    
    # Fix malformed heading tags
    content = re.sub(r'<h\d+ id=">', '<h3>', content)
    content = re.sub(r'<h\d+ id=">', '<h3>', content)
    
    # Fix malformed list item tags
    content = re.sub(r'<li id=">', '<li>', content)
    content = re.sub(r'<li id=">', '<li>', content)
    
    # Fix malformed unordered list tags
    content = re.sub(r'<ul id=">', '<ul>', content)
    content = re.sub(r'<ul id=">', '<ul>', content)
    
    # Fix malformed ordered list tags
    content = re.sub(r'<ol start="[^"]*" id=">', '<ol>', content)
    content = re.sub(r'<ol start="[^"]*" id=">', '<ol>', content)
    
    # Fix remaining malformed list attributes
    content = re.sub(r'<ol start=" id=">', '<ol>', content)
    content = re.sub(r'<ol start=" id=">', '<ol>', content)
    
    # Fix any remaining malformed ol tags
    content = re.sub(r'<ol id=">', '<ol>', content)
    content = re.sub(r'<ol id=">', '<ol>', content)
    
    # Fix malformed strong tags
    content = re.sub(r'<strong id=">', '<strong>', content)
    content = re.sub(r'<strong id=">', '<strong>', content)
    
    # Fix incomplete br tags
    content = re.sub(r'<br>', '<br>', content)
    content = re.sub(r'<br></strong>', '</strong>', content)
    
    # Fix malformed link tags
    content = re.sub(r'<a href="([^"]*)" id=">', r'<a href="\1">', content)
    content = re.sub(r'<a href="([^"]*)" id=">', r'<a href="\1">', content)
    
    # Add proper line breaks between paragraphs and other elements
    # This needs to be done more comprehensively
    content = re.sub(r'></p><p>', '></p>\n        <p>', content)
    content = re.sub(r'></p><h', '></p>\n        <h', content)
    content = re.sub(r'></p><ul', '></p>\n        <ul', content)
    content = re.sub(r'></p><ol', '></p>\n        <ol', content)
    content = re.sub(r'></p><div', '></p>\n        <div', content)
    content = re.sub(r'></p><figure', '></p>\n        <figure', content)
    
    # Add line breaks for other elements
    content = re.sub(r'></h\d><p>', '></h3>\n        <p>', content)
    content = re.sub(r'></ul><p>', '></ul>\n        <p>', content)
    content = re.sub(r'></ol><p>', '></ol>\n        <p>', content)
    content = re.sub(r'></li><li>', '></li>\n          <li>', content)
    
    # Add line breaks for div elements
    content = re.sub(r'></div><div', '></div>\n        <div', content)
    content = re.sub(r'></div><p>', '></div>\n        <p>', content)
    
    # More comprehensive approach - split content and rejoin with proper spacing
    # Split by closing tags and add line breaks
    content = re.sub(r'(</p>)(<p[^>]*>)', r'\1\n        \2', content)
    content = re.sub(r'(</p>)(<h[^>]*>)', r'\1\n        \2', content)
    content = re.sub(r'(</p>)(<ul[^>]*>)', r'\1\n        \2', content)
    content = re.sub(r'(</p>)(<ol[^>]*>)', r'\1\n        \2', content)
    content = re.sub(r'(</p>)(<div[^>]*>)', r'\1\n        \2', content)
    content = re.sub(r'(</p>)(<figure[^>]*>)', r'\1\n        \2', content)
    
    # Handle other element combinations
    content = re.sub(r'(</h[^>]*>)(<p[^>]*>)', r'\1\n        \2', content)
    content = re.sub(r'(</ul[^>]*>)(<p[^>]*>)', r'\1\n        \2', content)
    content = re.sub(r'(</ol[^>]*>)(<p[^>]*>)', r'\1\n        \2', content)
    content = re.sub(r'(</div[^>]*>)(<p[^>]*>)', r'\1\n        \2', content)
    
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
      
      {f'<img src="img/{os.path.basename(main_image).replace("%2520", "_").replace("%20", "_").replace("%252F", "_").replace("%2F", "_").replace("%2525", "_").replace("%25", "_").split("?")[0]}" alt="{title}" class="blog-hero-image">' if main_image else ''}
      
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
        
        # Get image paths
        main_image = post_data.get('Main Image', '')
        thumbnail_image = post_data.get('Thumbnail Image', '')
        
        # Clean image filenames
        if main_image:
            main_filename = os.path.basename(main_image).replace("%2520", "_").replace("%20", "_").replace("%252F", "_").replace("%2F", "_").replace("%2525", "_").replace("%25", "_").split("?")[0]
            main_image_path = f"img/{main_filename}"
        else:
            main_image_path = None
            
        if thumbnail_image:
            thumb_filename = os.path.basename(thumbnail_image).replace("%2520", "_").replace("%20", "_").replace("%252F", "_").replace("%2F", "_").replace("%2525", "_").replace("%25", "_").split("?")[0]
            thumbnail_image_path = f"img/{thumb_filename}"
        else:
            thumbnail_image_path = None
        
        post_entry = {
            "title": title,
            "author": author,
            "date": date,
            "summary": summary,
            "filename": filename
        }
        
        if main_image_path:
            post_entry["main_image"] = main_image_path
        if thumbnail_image_path:
            post_entry["thumbnail_image"] = thumbnail_image_path
            
        index_data.append(post_entry)
    
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