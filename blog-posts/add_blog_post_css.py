#!/usr/bin/env python3
"""
Script to add blog-post.css link to all blog post HTML files
"""

import os
import glob
import re

def add_blog_post_css():
    """Add blog-post.css link to all blog post HTML files"""
    
    # Get all HTML files in the blog-posts directory
    html_files = glob.glob("*.html")
    
    # Filter out non-blog post files (like Python scripts)
    blog_files = [f for f in html_files if f.endswith('.html') and not f.startswith('add_')]
    
    print(f"Found {len(blog_files)} blog post files")
    
    for filename in blog_files:
        print(f"Processing: {filename}")
        
        # Read the file
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if blog-post.css is already included
        if 'blog-post.css' in content:
            print(f"  - blog-post.css already included in {filename}")
            continue
        
        # Find the position to insert the CSS link
        # Look for the line after themes.css
        pattern = r'(<link rel=\'stylesheet\' href=\'\.\./css/themes\.css\'>)'
        replacement = r'\1\n  '
        
        # Apply the replacement
        new_content = re.sub(pattern, replacement, content)
        
        # Write the updated content back to the file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  - Added blog-post.css to {filename}")

if __name__ == "__main__":
    # Change to the blog-posts directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    add_blog_post_css()
    print("\nDone! All blog post files have been updated.") 