#!/usr/bin/env python3
"""
Script to fix the blog-post.css link in all blog post HTML files
"""

import os
import glob
import re

def fix_blog_post_css():
    """Fix the blog-post.css link in all blog post HTML files"""
    
    # Get all HTML files in the blog-posts directory
    html_files = glob.glob("*.html")
    
    # Filter out non-blog post files (like Python scripts)
    blog_files = [f for f in html_files if f.endswith('.html') and not f.startswith('fix_')]
    
    print(f"Found {len(blog_files)} blog post files")
    
    for filename in blog_files:
        print(f"Processing: {filename}")
        
        # Read the file
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix the incorrectly added CSS link
        # Remove the incorrectly formatted line
        content = re.sub(r"<link rel=\\\'stylesheet\\\' href=\\\'\.\./css/blog-post\.css\\\'>", "", content)
        
        # Add the correct CSS link after themes.css
        pattern = r'(<link rel=\'stylesheet\' href=\'\.\./css/themes\.css\'>)'
        replacement = r'\1\n  '
        
        # Apply the replacement
        new_content = re.sub(pattern, replacement, content)
        
        # Write the updated content back to the file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  - Fixed blog-post.css in {filename}")

if __name__ == "__main__":
    # Change to the blog-posts directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    fix_blog_post_css()
    print("\nDone! All blog post files have been fixed.") 