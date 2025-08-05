#!/usr/bin/env python3
"""
Blog Image Downloader Script
Downloads images referenced in the CSV file and updates index.json with local paths.
"""

import csv
import json
import os
import requests
from urllib.parse import urlparse
from pathlib import Path

def download_image(url, local_path):
    """Download an image from URL to local path."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        
        # Save the image
        with open(local_path, 'wb') as f:
            f.write(response.content)
        
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def get_filename_from_url(url):
    """Extract filename from URL."""
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    
    # Clean up the filename
    filename = filename.replace('%2520', '_').replace('%20', '_')
    filename = filename.replace('%252F', '_').replace('%2F', '_')
    filename = filename.replace('%2525', '_').replace('%25', '_')
    
    # Remove query parameters
    if '?' in filename:
        filename = filename.split('?')[0]
    
    return filename

def main():
    # Create img directory if it doesn't exist
    img_dir = Path("assets/img/blog")
    img_dir.mkdir(parents=True, exist_ok=True)
    
    # Read the CSV file
    csv_file = "blog-posts/Elemento New Website - Blog posts.csv"
    
    # Read existing index.json
    index_file = "blog-posts/index.json"
    with open(index_file, 'r', encoding='utf-8') as f:
        blog_posts = json.load(f)
    
    # Create a mapping of filenames to blog posts
    filename_to_post = {post['filename']: post for post in blog_posts}
    
    # Read CSV and download images
    downloaded_images = {}
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            slug = row['Slug']
            main_image_url = row['Main Image']
            thumbnail_image_url = row['Thumbnail Image']
            
            # Skip if no images
            if not main_image_url and not thumbnail_image_url:
                continue
            
            print(f"Processing: {slug}")
            
            # Download main image
            if main_image_url and main_image_url.strip():
                main_filename = get_filename_from_url(main_image_url)
                main_local_path = f"assets/img/blog/{main_filename}"
                main_full_path = f"../assets/img/blog/{main_filename}"
                
                if download_image(main_image_url, main_local_path):
                    downloaded_images[slug] = {
                        'main_image': main_full_path,
                        'thumbnail_image': None
                    }
                    print(f"  ✓ Downloaded main image: {main_filename}")
                else:
                    print(f"  ✗ Failed to download main image")
            
            # Download thumbnail image
            if thumbnail_image_url and thumbnail_image_url.strip():
                thumb_filename = get_filename_from_url(thumbnail_image_url)
                thumb_local_path = f"assets/img/blog/{thumb_filename}"
                thumb_full_path = f"../assets/img/blog/{thumb_filename}"
                
                if download_image(thumbnail_image_url, thumb_local_path):
                    if slug in downloaded_images:
                        downloaded_images[slug]['thumbnail_image'] = thumb_full_path
                    else:
                        downloaded_images[slug] = {
                            'main_image': None,
                            'thumbnail_image': thumb_full_path
                        }
                    print(f"  ✓ Downloaded thumbnail: {thumb_filename}")
                else:
                    print(f"  ✗ Failed to download thumbnail")
    
    # Update index.json with image paths
    updated_count = 0
    for post in blog_posts:
        filename = post['filename']
        # Extract slug from filename (remove date and .html extension)
        slug = filename.replace('2025-06-24-', '').replace('.html', '')
        
        if slug in downloaded_images:
            images = downloaded_images[slug]
            if images['main_image']:
                post['main_image'] = images['main_image']
            if images['thumbnail_image']:
                post['thumbnail_image'] = images['thumbnail_image']
            updated_count += 1
    
    # Save updated index.json
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(blog_posts, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Successfully downloaded images and updated index.json")
    print(f"📁 Images saved to: {img_dir}")
    print(f"📝 Updated {updated_count} blog posts with image paths")
    print(f"🖼️  Total images downloaded: {len(downloaded_images)}")

if __name__ == "__main__":
    main() 