#!/usr/bin/env python3
"""
Blog Image URL Fixer
Fixes image URLs in index.json to match the actual image structure from CSV.
"""

import json
import csv
import re
from pathlib import Path

def extract_image_filename_from_url(url):
    """Extract the filename from a CDN URL."""
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

def read_csv_image_data():
    """Read image data from CSV file."""
    csv_path = Path("Elemento New Website - Blog posts.csv")
    if not csv_path.exists():
        print("Error: CSV file not found!")
        return {}
    
    image_data = {}
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            slug = row.get('Slug', '')
            main_image_url = row.get('Main Image', '')
            thumbnail_image_url = row.get('Thumbnail Image', '')
            
            if slug:
                image_data[slug] = {
                    'main_image': main_image_url,
                    'thumbnail_image': thumbnail_image_url
                }
    
    return image_data

def fix_image_urls():
    """Fix image URLs in index.json."""
    
    # Read current index.json
    index_path = Path("index.json")
    if not index_path.exists():
        print("Error: index.json not found!")
        return
    
    with open(index_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    # Read image data from CSV
    csv_image_data = read_csv_image_data()
    print(f"Found image data for {len(csv_image_data)} posts in CSV")
    
    # Update posts with correct image URLs
    updated_posts = []
    for post in posts:
        # Extract slug from filename
        filename = post['filename']
        slug_match = re.match(r'^\d{4}-\d{2}-\d{2}-(.+)\.html$', filename)
        if slug_match:
            slug = slug_match.group(1)
            
            # Find matching image data from CSV
            if slug in csv_image_data:
                image_data = csv_image_data[slug]
                updated_post = post.copy()
                updated_post['main_image'] = image_data['main_image']
                updated_post['thumbnail_image'] = image_data['thumbnail_image']
                updated_posts.append(updated_post)
                print(f"Updated images for: {slug}")
            else:
                # Keep original if not found in CSV
                updated_posts.append(post)
                print(f"No image data found for: {slug}")
        else:
            # Keep original if can't parse slug
            updated_posts.append(post)
            print(f"Could not parse slug from: {filename}")
    
    # Write updated index.json
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(updated_posts, f, indent=2, ensure_ascii=False)
    
    print(f"\nUpdated {len(updated_posts)} posts with correct image URLs")

if __name__ == "__main__":
    # Change to the blog-posts directory
    script_dir = Path(__file__).parent
    import os
    os.chdir(script_dir)
    
    print("Fixing image URLs in index.json...")
    fix_image_urls()
    print("Done!") 