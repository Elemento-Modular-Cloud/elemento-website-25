#!/usr/bin/env python3
"""
Blog Image Path Updater
Updates image URLs in index.json to use local paths from the img folder.
"""

import json
import re
from pathlib import Path

def extract_filename_from_url(url):
    """Extract filename from CDN URL."""
    if not url:
        return None
    
    # Extract filename from URL like:
    # https://cdn.prod.website-files.com/67b5af5e9f134083f33f6b08/67e6b7b833c6aa3fd50c15e3_653694f6030bbb8efb633f56_MAIN%2520%252017.webp
    match = re.search(r'/([^/]+)$', url)
    if match:
        filename = match.group(1)
        # Decode URL encoding
        filename = filename.replace('%2520', ' ')
        filename = filename.replace('%252', '%2')
        return filename
    return None

def update_to_local_paths():
    """Update image URLs to use local paths."""
    
    # Read current index.json
    index_path = Path("index.json")
    if not index_path.exists():
        print("Error: index.json not found!")
        return
    
    with open(index_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    # Get list of available image files
    img_dir = Path("img")
    available_images = set()
    if img_dir.exists():
        for img_file in img_dir.glob("*"):
            available_images.add(img_file.name)
    
    print(f"Found {len(available_images)} images in img folder")
    
    # Update posts with local image paths
    updated_posts = []
    for post in posts:
        updated_post = post.copy()
        
        # Extract filename from main image URL
        main_image_url = post.get('main_image', '')
        main_filename = extract_filename_from_url(main_image_url)
        if main_filename and main_filename in available_images:
            updated_post['main_image'] = f"img/{main_filename}"
        else:
            print(f"Warning: Main image not found for {post.get('title', 'Unknown')}")
            updated_post['main_image'] = ""  # Clear if not found
        
        # Extract filename from thumbnail image URL
        thumbnail_image_url = post.get('thumbnail_image', '')
        thumbnail_filename = extract_filename_from_url(thumbnail_image_url)
        if thumbnail_filename and thumbnail_filename in available_images:
            updated_post['thumbnail_image'] = f"img/{thumbnail_filename}"
        else:
            print(f"Warning: Thumbnail image not found for {post.get('title', 'Unknown')}")
            updated_post['thumbnail_image'] = ""  # Clear if not found
        
        updated_posts.append(updated_post)
        print(f"Updated images for: {post.get('title', 'Unknown')}")
    
    # Write updated index.json
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(updated_posts, f, indent=2, ensure_ascii=False)
    
    print(f"\nUpdated {len(updated_posts)} posts with local image paths")

if __name__ == "__main__":
    # Change to the blog-posts directory
    script_dir = Path(__file__).parent
    import os
    os.chdir(script_dir)
    
    print("Updating image URLs to use local paths...")
    update_to_local_paths()
    print("Done!") 