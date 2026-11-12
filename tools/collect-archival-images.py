#!/usr/bin/env python3
"""
Collect archival/reference photos for Quảng Trị 1972 documentary.
- Source: Wikimedia Commons API (verify licence for each file)
- Download, resize to ≤1920px long side, ~85 quality JPEG
- Delete originals after processing
- Build manifest.json in standard format
"""

import os
import sys
import json
import requests
import tempfile
import shutil
from pathlib import Path
from PIL import Image
from urllib.parse import urlencode, quote

# Config
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "thanh-co-quang-tri" / "img"
MAX_LONG_SIDE = 1920
JPEG_QUALITY = 85
UA_STRING = "Mozilla/5.0"

# Allowed licences (must match exactly or contain substring)
ALLOWED_LICENCES = {
    "Public domain", "PD", "PD-US", "USAF", "US Air Force", "US Navy", "US Army",
    "CC0", "CC BY", "CC BY-SA", "CC BY 4.0", "CC BY-SA 4.0", "CC BY 2.0",
    "CC BY-SA 2.0", "CC BY 3.0", "CC BY-SA 3.0", "PD-Vietnam"
}

# Blocked licences
BLOCKED_KEYWORDS = {"fair use", "AP Photo", "Getty", "press photo", "restricted"}

def is_licence_allowed(licence_str):
    """Check if a licence string is acceptable."""
    if not licence_str:
        return False
    lower = licence_str.lower()
    # Check for blocked keywords first
    for blocked in BLOCKED_KEYWORDS:
        if blocked.lower() in lower:
            return False
    # Check for allowed licences
    for allowed in ALLOWED_LICENCES:
        if allowed.lower() in lower:
            return True
    return False

def query_commons_by_search(query, limit=20):
    """Search Commons by text query using search API, return file names."""
    import time
    time.sleep(0.5)  # Rate limit
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srnamespace": "6",  # File namespace
        "srlimit": limit,
        "sroffset": 0,
        "format": "json"
    }
    headers = {"User-Agent": UA_STRING}
    try:
        resp = requests.get(COMMONS_API, params=params, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        results = data.get("query", {}).get("search", [])
        # Extract filenames from titles like "File:xyz.jpg"
        filenames = []
        for result in results:
            title = result.get("title", "")
            if title.startswith("File:"):
                filenames.append(title[5:])  # Remove "File:" prefix
        return filenames
    except Exception as e:
        print(f"  [WARN] Search failed for '{query}': {e}")
        return []

def get_file_metadata(filename):
    """Fetch licence, author, URL for a Commons file."""
    params = {
        "action": "query",
        "titles": f"File:{filename}",
        "prop": "imageinfo|pageterms",
        "iiprop": "url|extmetadata",
        "format": "json"
    }
    headers = {"User-Agent": UA_STRING}
    try:
        resp = requests.get(COMMONS_API, params=params, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        pages = data.get("query", {}).get("pages", {})
        for page_id, page in pages.items():
            if page_id.startswith("-"):
                continue
            images = page.get("imageinfo", [])
            if not images:
                continue
            img = images[0]
            url = img.get("url", "")
            metadata = img.get("extmetadata", {})

            # Extract licence
            licence_obj = metadata.get("LicenseShortName", {})
            licence = licence_obj.get("value", "Unknown") if isinstance(licence_obj, dict) else licence_obj

            # Extract author
            artist_obj = metadata.get("Artist", {})
            artist = artist_obj.get("value", "Unknown") if isinstance(artist_obj, dict) else artist_obj

            # Extract date
            date_obj = metadata.get("DateTime", {})
            date_val = date_obj.get("value", "") if isinstance(date_obj, dict) else date_obj

            return {
                "url": url,
                "licence": str(licence),
                "artist": str(artist),
                "date": str(date_val),
                "filename": filename,
                "commons_url": f"https://commons.wikimedia.org/wiki/File:{quote(filename)}"
            }
    except Exception as e:
        print(f"  [WARN] Metadata fetch failed for '{filename}': {e}")
        return None
    return None

def download_image(url, temp_file):
    """Download image to temp file."""
    headers = {"User-Agent": UA_STRING}
    try:
        resp = requests.get(url, headers=headers, timeout=30, stream=True)
        resp.raise_for_status()
        with open(temp_file, 'wb') as f:
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        return True
    except Exception as e:
        print(f"  [WARN] Download failed: {e}")
        return False

def resize_and_save_jpeg(input_path, output_path):
    """Resize image so long side ≤ 1920, save as JPEG ~85 quality."""
    try:
        img = Image.open(input_path)
        # Get original dims
        w, h = img.size
        long_side = max(w, h)

        # Resize if needed
        if long_side > MAX_LONG_SIDE:
            ratio = MAX_LONG_SIDE / long_side
            new_w = int(w * ratio)
            new_h = int(h * ratio)
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

        # Convert to RGB if needed (for JPEG)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Save
        img.save(output_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)

        # Get final dims
        final_img = Image.open(output_path)
        final_w, final_h = final_img.size
        return True, final_w, final_h
    except Exception as e:
        print(f"  [WARN] Resize/save failed: {e}")
        return False, 0, 0

def slugify_filename(commons_name):
    """Convert Commons filename to kebab-case slug."""
    # Remove extension
    base = commons_name.rsplit('.', 1)[0] if '.' in commons_name else commons_name
    # Keep only alphanumeric, replace spaces/underscores with dashes
    slug = ''.join(c if c.isalnum() else '-' for c in base.lower())
    # Collapse multiple dashes
    while '--' in slug:
        slug = slug.replace('--', '-')
    slug = slug.strip('-')
    return slug

def collect_images(search_queries):
    """Main collection workflow."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []

    for query_info in search_queries:
        query = query_info["query"]
        subject_vn = query_info["subject_vn"]
        date_era = query_info.get("date_era", "")
        notes = query_info.get("notes", "")

        print(f"\n[SEARCH] {query}")
        filenames = query_commons_by_search(query, limit=30)

        for filename in filenames[:10]:  # Limit per query
            print(f"  Checking: {filename}")

            # Get metadata
            meta = get_file_metadata(filename)
            if not meta:
                print(f"    [SKIP] Metadata fetch failed")
                continue

            # Check licence
            if not is_licence_allowed(meta["licence"]):
                print(f"    [SKIP] Licence not allowed: {meta['licence']}")
                continue

            print(f"    [OK] Licence: {meta['licence']}, Artist: {meta['artist']}")

            # Download
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                temp_path = tmp.name

            if not download_image(meta["url"], temp_path):
                print(f"    [SKIP] Download failed")
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                continue

            # Resize and save
            slug = slugify_filename(filename)
            output_path = OUTPUT_DIR / f"{slug}.jpg"

            success, w, h = resize_and_save_jpeg(temp_path, output_path)
            if not success:
                print(f"    [SKIP] Resize/save failed")
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                continue

            # Delete original
            if os.path.exists(temp_path):
                os.unlink(temp_path)

            print(f"    [SAVED] {output_path.name} ({w}x{h})")

            # Add to manifest
            entry = {
                "file": output_path.name,
                "subject": subject_vn,
                "date_or_era": date_era or meta["date"],
                "credit": meta["artist"],
                "licence": meta["licence"],
                "source_url": meta["commons_url"],
                "width": w,
                "height": h,
                "notes": notes
            }
            manifest.append(entry)

    # Write manifest
    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)

    print(f"\n[DONE] {len(manifest)} images saved to {OUTPUT_DIR}")
    print(f"[MANIFEST] {manifest_path}")
    return manifest

if __name__ == "__main__":
    # Define search queries and metadata - use specific terms that match Commons
    queries = [
        {
            "query": "B-52 Vietnam bombing",
            "subject_vn": "Máy bay B-52 thả bom trên Việt Nam",
            "date_era": "1972",
            "notes": "Arc Light bombing campaign"
        },
        {
            "query": "F-4 Phantom Vietnam",
            "subject_vn": "Máy bay F-4 Phantom",
            "date_era": "1972",
            "notes": "Close air support"
        },
        {
            "query": "A-1 Skyraider",
            "subject_vn": "Máy bay A-1 Skyraider",
            "date_era": "1972",
            "notes": "USAF close support"
        },
        {
            "query": "CH-53 helicopter",
            "subject_vn": "Trực thăng CH-53 Sea Stallion",
            "date_era": "1972",
            "notes": "USMC transport"
        },
        {
            "query": "M48 Patton tank",
            "subject_vn": "Xe tăng M48 Patton",
            "date_era": "1972",
            "notes": "ARVN armor"
        },
        {
            "query": "T-54 tank Vietnam",
            "subject_vn": "Xe tăng T-54",
            "date_era": "1972",
            "notes": "North Vietnamese armor"
        },
        {
            "query": "Vietnam War naval gunfire",
            "subject_vn": "Hỏa lực hải quân 1972",
            "date_era": "1972",
            "notes": "US Navy support"
        },
        {
            "query": "Vietnam War artillery",
            "subject_vn": "Pháo binh Chiến tranh Việt Nam",
            "date_era": "1972",
            "notes": "Military equipment"
        },
        {
            "query": "Vietnam citadel ruins",
            "subject_vn": "Thành cổ tàn tích Việt Nam",
            "date_era": "1972-2024",
            "notes": "Fortifications destroyed in war"
        },
        {
            "query": "USAF Vietnam",
            "subject_vn": "Không quân Mỹ ở Việt Nam",
            "date_era": "1960-1973",
            "notes": "US Air Force operations"
        },
        {
            "query": "US Navy Vietnam",
            "subject_vn": "Hải quân Mỹ ở Việt Nam",
            "date_era": "1960-1973",
            "notes": "Naval operations 7th Fleet"
        },
        {
            "query": "ARVN soldiers",
            "subject_vn": "Binh sĩ Quân Lực Việt Nam Cộng Hòa",
            "date_era": "1972",
            "notes": "South Vietnamese military"
        },
        {
            "query": "Vietnam War 1972",
            "subject_vn": "Chiến tranh Việt Nam 1972",
            "date_era": "1972",
            "notes": "Easter Offensive and Linebacker II"
        },
        {
            "query": "Ho Chi Minh",
            "subject_vn": "Hồ Chí Minh",
            "date_era": "1945-1969",
            "notes": "Vietnamese leader portrait"
        },
        {
            "query": "DMZ Vietnam",
            "subject_vn": "Vũng Đất Phi Quân Sự",
            "date_era": "1954-1973",
            "notes": "Demilitarized zone"
        }
    ]

    manifest = collect_images(queries)
    print(f"\n✓ Collection complete: {len(manifest)} images with verified licences")
