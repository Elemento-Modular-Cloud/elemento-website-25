#!/usr/bin/env python3
"""
Blog Local Image Path Fixer
Fixes local image paths with proper URL decoding.
"""

import json
import re
import urllib.parse
from pathlib import Path

def extract_filename_from_url(url):
    """Extract filename from CDN URL with proper decoding."""
    if not url:
        return None
    
    # Extract filename from URL like:
    # https://cdn.prod.website-files.com/67b5af5e9f134083f33f6b08/67e6b7b833c6aa3fd50c15e3_653694f6030bbb8efb633f56_MAIN%2520%252017.webp
    match = re.search(r'/([^/]+)$', url)
    if match:
        filename = match.group(1)
        # Properly decode URL encoding
        filename = urllib.parse.unquote(filename)
        return filename
    return None

def find_matching_image(filename, available_images):
    """Find the best matching image file."""
    if not filename:
        return None
    
    # Direct match
    if filename in available_images:
        return filename
    
    # Try without URL encoding
    decoded_filename = urllib.parse.unquote(filename)
    if decoded_filename in available_images:
        return decoded_filename
    
    # Try with different encoding variations
    variations = [
        filename.replace('%2520', ' '),
        filename.replace('%252', '%2'),
        filename.replace('%20', ' '),
        filename.replace('%2', '%'),
    ]
    
    for variation in variations:
        if variation in available_images:
            return variation
    
    return None

def fix_local_paths():
    """Fix local image paths with proper URL decoding."""
    
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
        if main_image_url and main_image_url.startswith('http'):
            main_filename = extract_filename_from_url(main_image_url)
            matching_main = find_matching_image(main_filename, available_images)
            if matching_main:
                updated_post['main_image'] = f"img/{matching_main}"
            else:
                print(f"Warning: Main image not found for {post.get('title', 'Unknown')}")
                updated_post['main_image'] = ""
        elif main_image_url and main_image_url.startswith('img/'):
            # Already a local path, keep it
            updated_post['main_image'] = main_image_url
        else:
            updated_post['main_image'] = ""
        
        # Extract filename from thumbnail image URL
        thumbnail_image_url = post.get('thumbnail_image', '')
        if thumbnail_image_url and thumbnail_image_url.startswith('http'):
            thumbnail_filename = extract_filename_from_url(thumbnail_image_url)
            matching_thumbnail = find_matching_image(thumbnail_filename, available_images)
            if matching_thumbnail:
                updated_post['thumbnail_image'] = f"img/{matching_thumbnail}"
            else:
                print(f"Warning: Thumbnail image not found for {post.get('title', 'Unknown')}")
                updated_post['thumbnail_image'] = ""
        elif thumbnail_image_url and thumbnail_image_url.startswith('img/'):
            # Already a local path, keep it
            updated_post['thumbnail_image'] = thumbnail_image_url
        else:
            updated_post['thumbnail_image'] = ""
        
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
    
    print("Fixing local image paths with proper URL decoding...")
    fix_local_paths()
    print("Done!") 