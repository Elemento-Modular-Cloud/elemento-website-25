#!/usr/bin/env python3
"""
Blog Post Date Redistributor
Redistributes publication dates from 2023 to June 2025 for existing HTML files.
"""

import os
import re
from datetime import datetime, timedelta
from pathlib import Path
import random

def generate_redistributed_dates(num_posts, start_year=2023, end_year=2025, end_month=6):
    """
    Generate dates from start_year to end_year/end_month.
    Ensures no dates exceed June 2025.
    """
    # Create a list of dates from 2023-01-01 to 2025-06-30
    start_date = datetime(start_year, 1, 1)
    end_date = datetime(end_year, end_month, 30)  # June 30, 2025
    
    # Generate all possible dates
    all_dates = []
    current_date = start_date
    while current_date <= end_date:
        all_dates.append(current_date)
        current_date += timedelta(days=1)
    
    # Select dates evenly distributed across the range
    selected_dates = []
    step = len(all_dates) // num_posts if num_posts > 0 else 1
    
    for i in range(num_posts):
        if i * step < len(all_dates):
            selected_dates.append(all_dates[i * step])
        else:
            # If we run out of dates, use the last available date
            selected_dates.append(all_dates[-1])
    
    return selected_dates

def redistribute_dates():
    """Redistribute dates for existing HTML files."""
    
    # Get all HTML files
    html_files = list(Path('.').glob('*.html'))
    html_files.sort()  # Sort to maintain consistent order
    
    print(f"Found {len(html_files)} HTML files")
    
    # Generate redistributed dates
    redistributed_dates = generate_redistributed_dates(len(html_files))
    
    # Sort dates to ensure chronological order
    redistributed_dates.sort()
    
    # Rename files with new dates
    renamed_count = 0
    for i, file_path in enumerate(html_files):
        old_filename = file_path.name
        new_date = redistributed_dates[i].strftime("%Y-%m-%d")
        
        # Extract the slug part (everything after the date)
        slug_match = re.match(r'^\d{4}-\d{2}-\d{2}-(.+)', old_filename)
        if slug_match:
            slug = slug_match.group(1)
            new_filename = f"{new_date}-{slug}"
            
            new_file_path = Path(new_filename)
            
            try:
                file_path.rename(new_file_path)
                print(f"Renamed: {old_filename} → {new_filename}")
                renamed_count += 1
            except Exception as e:
                print(f"Error renaming {old_filename}: {e}")
        else:
            print(f"Warning: Could not parse filename {old_filename}")
    
    print(f"\nRenamed {renamed_count} files with dates from 2023 to June 2025")
    print("All dates are now within the specified range")

if __name__ == "__main__":
    # Change to the blog-posts directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    print("Redistributing blog post dates from 2023 to June 2025...")
    redistribute_dates()
    print("Done!") 