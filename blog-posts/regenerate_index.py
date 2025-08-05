#!/usr/bin/env python3
"""
Blog Index Regenerator
Regenerates index.json based on current HTML files with their new dates.
"""

import json
import os
import re
import csv
from datetime import datetime
from pathlib import Path

def parse_date_from_filename(filename):
    """Extract date from filename."""
    date_match = re.match(r'^(\d{4}-\d{2}-\d{2})-', filename)
    if date_match:
        return date_match.group(1)
    return None

def extract_title_from_filename(filename):
    """Extract title from filename."""
    # Remove date prefix and .html extension
    title_part = re.sub(r'^\d{4}-\d{2}-\d{2}-', '', filename)
    title_part = re.sub(r'\.html$', '', title_part)
    
    # Convert kebab-case to title case
    title = title_part.replace('-', ' ').title()
    
    # Handle special cases
    title = title.replace('Iaas', 'IaaS')
    title = title.replace('Paas', 'PaaS')
    title = title.replace('Saas', 'SaaS')
    title = title.replace('Tco', 'TCO')
    title = title.replace('Ecc', 'ECC')
    
    return title

def get_image_paths(slug):
    """Get main and thumbnail image paths for a post."""
    # This is a simplified version - you may need to adjust based on your actual image structure
    main_image = f"img/{slug}_main.webp"
    thumbnail_image = f"img/{slug}_thumb.webp"
    return main_image, thumbnail_image

def regenerate_index():
    """Regenerate index.json based on current HTML files."""
    
    # Get all HTML files
    html_files = list(Path('.').glob('*.html'))
    html_files.sort()  # Sort to maintain consistent order
    
    print(f"Found {len(html_files)} HTML files")
    
    index_data = []
    
    for file_path in html_files:
        filename = file_path.name
        
        # Extract date from filename
        date = parse_date_from_filename(filename)
        if not date:
            print(f"Warning: Could not parse date from {filename}")
            continue
        
        # Extract title from filename
        title = extract_title_from_filename(filename)
        
        # Extract slug from filename
        slug_match = re.match(r'^\d{4}-\d{2}-\d{2}-(.+)\.html$', filename)
        if slug_match:
            slug = slug_match.group(1)
        else:
            print(f"Warning: Could not parse slug from {filename}")
            continue
        
        # Get image paths
        main_image, thumbnail_image = get_image_paths(slug)
        
        # Create index entry
        index_entry = {
            "title": title,
            "author": "Giulia Borgoni",  # Default author
            "date": date,
            "summary": f"Summary for {title}...",  # Placeholder summary
            "filename": filename,
            "main_image": main_image,
            "thumbnail_image": thumbnail_image
        }
        
        index_data.append(index_entry)
        print(f"Added: {filename} ({date})")
    
    # Sort by date (newest first)
    index_data.sort(key=lambda x: x['date'], reverse=True)
    
    # Write index.json
    with open('index.json', 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nRegenerated index.json with {len(index_data)} posts")
    print("Posts are sorted by date (newest first)")

if __name__ == "__main__":
    # Change to the blog-posts directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    print("Regenerating index.json based on current HTML files...")
    regenerate_index()
    print("Done!") 