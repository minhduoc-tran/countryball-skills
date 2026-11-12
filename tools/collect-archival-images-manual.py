#!/usr/bin/env python3
"""
Download and process specific Wikimedia Commons files for Quảng Trị documentary.
Uses a pre-curated list of file names to avoid rate limiting.
"""

import os
import sys
import json
import requests
import tempfile
import time
from pathlib import Path
from PIL import Image
from urllib.parse import quote

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "thanh-co-quang-tri" / "img"
MAX_LONG_SIDE = 1920
JPEG_QUALITY = 85
UA_STRING = "Mozilla/5.0"
DELAY = 2.0  # Seconds between requests

# Pre-curated list of specific Commons files with their metadata
# Load files from manifest
MANIFEST_FILE = Path(__file__).parent / "commonsfiles-manifest.json"

def load_manual_files():
    """Load file list from JSON manifest."""
    try:
        with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to load manifest: {e}")
        return []

def get_file_metadata(filename):
    """Fetch licence, author, URL for a Commons file."""
    time.sleep(DELAY)
    params = {
        "action": "query",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
        "format": "json"
    }
    headers = {"User-Agent": UA_STRING}
    try:
        resp = requests.get(COMMONS_API, params=params, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        pages = data.get("query", {}).get("pages", {})
        for page_id, page in pages.items():
            if page_id.startswith("-"):
                print(f"    [SKIP] File not found on Commons")
                return None
            images = page.get("imageinfo", [])
            if not images:
                return None
            img = images[0]
            url = img.get("url", "")
            metadata = img.get("extmetadata", {})

            licence_obj = metadata.get("LicenseShortName", {})
            licence = licence_obj.get("value", "Unknown") if isinstance(licence_obj, dict) else licence_obj

            artist_obj = metadata.get("Artist", {})
            artist = artist_obj.get("value", "Unknown") if isinstance(artist_obj, dict) else artist_obj

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
        print(f"    [WARN] Metadata fetch failed: {e}")
        return None
    return None

def download_image(url, temp_file):
    """Download image to temp file."""
    time.sleep(DELAY)
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
        print(f"    [WARN] Download failed: {e}")
        return False

def resize_and_save_jpeg(input_path, output_path):
    """Resize image so long side ≤ 1920, save as JPEG ~85 quality."""
    try:
        img = Image.open(input_path)
        w, h = img.size
        long_side = max(w, h)

        if long_side > MAX_LONG_SIDE:
            ratio = MAX_LONG_SIDE / long_side
            new_w = int(w * ratio)
            new_h = int(h * ratio)
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

        if img.mode != 'RGB':
            img = img.convert('RGB')

        img.save(output_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)

        final_img = Image.open(output_path)
        final_w, final_h = final_img.size
        return True, final_w, final_h
    except Exception as e:
        print(f"    [WARN] Resize/save failed: {e}")
        return False, 0, 0

def slugify_filename(commons_name):
    """Convert Commons filename to kebab-case slug."""
    base = commons_name.rsplit('.', 1)[0] if '.' in commons_name else commons_name
    slug = ''.join(c if c.isalnum() else '-' for c in base.lower())
    while '--' in slug:
        slug = slug.replace('--', '-')
    slug = slug.strip('-')
    return slug

def process_files(file_list):
    """Download and process specific files."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []

    for entry in file_list:
        filename = entry["filename"]
        subject_vn = entry["subject_vn"]
        date_era = entry.get("date_era", "")
        notes = entry.get("notes", "")

        print(f"[PROCESS] {filename}")

        # Get metadata
        meta = get_file_metadata(filename)
        if not meta:
            print(f"  [SKIP] Metadata unavailable")
            continue

        print(f"  Licence: {meta['licence']}, Artist: {meta['artist']}")

        # Download
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            temp_path = tmp.name

        if not download_image(meta["url"], temp_path):
            print(f"  [SKIP] Download failed")
            if os.path.exists(temp_path):
                os.unlink(temp_path)
            continue

        # Resize and save
        slug = slugify_filename(filename)
        output_path = OUTPUT_DIR / f"{slug}.jpg"

        success, w, h = resize_and_save_jpeg(temp_path, output_path)
        if not success:
            print(f"  [SKIP] Resize/save failed")
            if os.path.exists(temp_path):
                os.unlink(temp_path)
            continue

        # Delete original
        if os.path.exists(temp_path):
            os.unlink(temp_path)

        print(f"  [SAVED] {output_path.name} ({w}x{h})")

        # Add to manifest
        entry_obj = {
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
        manifest.append(entry_obj)

    # Write manifest
    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)

    print(f"\n[DONE] {len(manifest)} images processed to {OUTPUT_DIR}")
    print(f"[MANIFEST] {manifest_path}")
    return manifest

if __name__ == "__main__":
    files = load_manual_files()
    if not files:
        print("[ERROR] No files to process")
        sys.exit(1)
    print(f"[INFO] Processing {len(files)} files from manifest")
    manifest = process_files(files)
    print(f"\n✓ Complete: {len(manifest)} images")
