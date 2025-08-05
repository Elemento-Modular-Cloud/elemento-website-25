#!/usr/bin/env python3
"""
Blog Missing Images Fixer
Fixes missing images by improving URL decoding and matching logic.
"""

import json
import csv
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
    """Find the best matching image file with improved matching."""
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
        filename.replace('%2520', '_'),
        filename.replace('%20', '_'),
    ]
    
    for variation in variations:
        if variation in available_images:
            return variation
    
    # Try partial matching by extracting the ID part
    # Extract the ID part from filename like: 67e6b7b833c6aa3fd50c15e3_653694f6030bbb8efb633f56_MAIN%2520%252017.webp
    id_match = re.match(r'([a-f0-9]+_[a-f0-9]+)', filename)
    if id_match:
        id_part = id_match.group(1)
        for img in available_images:
            if img.startswith(id_part):
                return img
    
    return None

def fix_missing_images():
    """Fix missing images by improving matching logic."""
    
    # Read current index.json
    index_path = Path("index.json")
    if not index_path.exists():
        print("Error: index.json not found!")
        return
    
    with open(index_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    # Read CSV file
    csv_path = Path("Elemento New Website - Blog posts.csv")
    if not csv_path.exists():
        print("Error: CSV file not found!")
        return
    
    # Get list of available image files
    img_dir = Path("img")
    available_images = set()
    if img_dir.exists():
        for img_file in img_dir.glob("*"):
            available_images.add(img_file.name)
    
    print(f"Found {len(available_images)} images in img folder")
    
    # Read CSV data
    csv_data = {}
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            slug = row.get('Slug', '')
            main_image = row.get('Main Image', '')
            thumbnail_image = row.get('Thumbnail Image', '')
            if slug:
                csv_data[slug] = {
                    'main_image': main_image,
                    'thumbnail_image': thumbnail_image
                }
    
    print(f"Found {len(csv_data)} posts in CSV")
    
    # Update posts with images from CSV
    updated_posts = []
    for post in posts:
        updated_post = post.copy()
        
        # Extract slug from filename
        filename = post.get('filename', '')
        slug = None
        if filename:
            # Extract slug from filename like: 2025-05-30-within-2026-cloud-security-will-be-manager-by-socs-trend-micros-predictions.html
            slug_match = re.search(r'\d{4}-\d{2}-\d{2}-(.+)\.html$', filename)
            if slug_match:
                slug = slug_match.group(1)
        
        # Get images from CSV
        if slug and slug in csv_data:
            csv_images = csv_data[slug]
            
            # Map main image
            main_image_url = csv_images.get('main_image', '')
            if main_image_url:
                main_filename = extract_filename_from_url(main_image_url)
                matching_main = find_matching_image(main_filename, available_images)
                if matching_main:
                    updated_post['main_image'] = f"img/{matching_main}"
                    print(f"✅ Mapped main image for: {post.get('title', 'Unknown')}")
                else:
                    print(f"❌ Main image not found for: {post.get('title', 'Unknown')}")
                    updated_post['main_image'] = ""
            else:
                updated_post['main_image'] = ""
            
            # Map thumbnail image
            thumbnail_image_url = csv_images.get('thumbnail_image', '')
            if thumbnail_image_url:
                thumbnail_filename = extract_filename_from_url(thumbnail_image_url)
                matching_thumbnail = find_matching_image(thumbnail_filename, available_images)
                if matching_thumbnail:
                    updated_post['thumbnail_image'] = f"img/{matching_thumbnail}"
                    print(f"✅ Mapped thumbnail for: {post.get('title', 'Unknown')}")
                else:
                    print(f"❌ Thumbnail not found for: {post.get('title', 'Unknown')}")
                    updated_post['thumbnail_image'] = ""
            else:
                updated_post['thumbnail_image'] = ""
        else:
            print(f"⚠️  No CSV data found for: {post.get('title', 'Unknown')}")
            updated_post['main_image'] = ""
            updated_post['thumbnail_image'] = ""
        
        updated_posts.append(updated_post)
    
    # Write updated index.json
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(updated_posts, f, indent=2, ensure_ascii=False)
    
    print(f"\nUpdated {len(updated_posts)} posts with images from CSV")

if __name__ == "__main__":
    # Change to the blog-posts directory
    script_dir = Path(__file__).parent
    import os
    os.chdir(script_dir)
    
    print("Fixing missing images with improved matching...")
    fix_missing_images()
    print("Done!") 