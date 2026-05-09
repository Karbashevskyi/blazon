#!/usr/bin/env python3
"""
Bulk download all SVG coats of arms of Polish cities from Wikimedia Commons,
create asset folders, generate meta.json sidecars, then run the Blazon generator.

Usage:
    python3 tools/scripts/bulk_download_pl_coa.py [--dry-run] [--limit N] [--workers N]
"""

import argparse
import asyncio
import json
import re
import subprocess
import sys
import unicodedata
import urllib.parse
from pathlib import Path

# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #
WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"
CATEGORY = "Category:SVG_coats_of_arms_of_cities_of_Poland"
ASSETS_ROOT = Path(__file__).parent.parent.parent / "assets" / "pl" / "city"
SVGO_CMD = ["npx", "--yes", "svgo", "--multipass"]

# SVG files to skip (known duplicates / outdated versions)
SKIP_PATTERN = re.compile(r"\(\d{4}[-–]\d{4}\)|\(historical\)|\(old\)|\(before\)", re.IGNORECASE)

# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

def slugify(name: str) -> str:
    """Convert a Polish city name to a URL-safe slug."""
    # Handle characters that NFD decomposition doesn't cover
    SPECIAL = str.maketrans({
        "Ł": "l", "ł": "l",
        "Ó": "o", "ó": "o",
        "Ź": "z", "ź": "z",
        "Ż": "z", "ż": "z",
        "Ń": "n", "ń": "n",
        "Ę": "e", "ę": "e",
        "Ą": "a", "ą": "a",
        "Ć": "c", "ć": "c",
        "Ś": "s", "ś": "s",
        "ß": "ss",
    })
    name = name.translate(SPECIAL)
    # NFD decomposition strips remaining diacritics (Á→A, etc.)
    nfd = unicodedata.normalize("NFD", name.lower())
    ascii_only = "".join(c for c in nfd if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", ascii_only).strip("-")


def parse_city_name(filename: str) -> str | None:
    """
    Extract city name from a Wikimedia filename like:
      'POL Kraków COA.svg'  →  'Kraków'
      'POL m. Wrocław COA.svg'  →  'Wrocław'
      'POL Baranów Sandomierski COA.svg'  →  'Baranów Sandomierski'
    Returns None if the name cannot be determined.
    """
    # Strip 'File:' prefix and extension
    stem = re.sub(r"^File:", "", filename, flags=re.IGNORECASE)
    stem = re.sub(r"\.svg$", "", stem, flags=re.IGNORECASE)

    # Pattern: 'POL [optional prefix] CityName COA'
    match = re.match(r"^POL\s+(?:m\.\s+)?(.+?)\s+COA(?:\s+.*)?$", stem, re.IGNORECASE)
    if not match:
        return None
    return match.group(1).strip()


def wikimedia_file_url(filename: str) -> str:
    """Return the direct download URL for a Wikimedia file."""
    name = re.sub(r"^File:", "", filename)
    encoded = urllib.parse.quote(name, safe="")
    return f"https://commons.wikimedia.org/wiki/Special:FilePath/{encoded}"


def wikimedia_commons_page(filename: str) -> str:
    name = re.sub(r"^File:", "", filename)
    encoded = urllib.parse.quote(name, safe="")
    return f"https://commons.wikimedia.org/wiki/File:{encoded}"


# --------------------------------------------------------------------------- #
# Wikimedia API
# --------------------------------------------------------------------------- #

async def fetch_all_files(session, limit: int | None) -> list[str]:
    """Fetch all file titles from the category, paginated."""
    import aiohttp

    files: list[str] = []
    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": CATEGORY,
        "cmtype": "file",
        "cmlimit": "500",
        "format": "json",
    }

    while True:
        async with session.get(WIKIMEDIA_API, params=params) as resp:
            data = await resp.json(content_type=None)

        for member in data["query"]["categorymembers"]:
            title = member["title"]
            # Skip versioned / historical files
            if SKIP_PATTERN.search(title):
                continue
            files.append(title)
            if limit and len(files) >= limit:
                return files

        if "continue" not in data:
            break
        params["cmcontinue"] = data["continue"]["cmcontinue"]

    return files


# --------------------------------------------------------------------------- #
# SVG download + optimize
# --------------------------------------------------------------------------- #

async def download_svg(session, url: str) -> bytes | None:
    """Download an SVG file, following redirects."""
    try:
        async with session.get(url, allow_redirects=True, timeout=30) as resp:
            if resp.status != 200:
                return None
            content = await resp.read()
            if b"<svg" not in content[:4096]:
                return None
            return content
    except Exception as e:
        print(f"  [WARN] download failed: {e}", file=sys.stderr)
        return None


def _parse_length(value: str) -> float | None:
    """Parse an SVG length value (px, mm, pt, cm, in, em, %) to user units (px)."""
    value = value.strip()
    UNITS = {"px": 1, "pt": 1.25, "mm": 3.7795276, "cm": 37.795276, "in": 96, "em": 16, "%": None}
    for unit, factor in UNITS.items():
        if value.endswith(unit):
            try:
                num = float(value[: -len(unit)])
                return num * factor if factor is not None else None
            except ValueError:
                return None
    try:
        return float(value)
    except ValueError:
        return None


def optimize_svg(svg_bytes: bytes, title: str) -> bytes:
    """
    Clean up SVG in-memory:
    - Strip XML declaration, DOCTYPE
    - Synthesize viewBox from width/height if viewBox is missing
    - Remove absolute width/height (keep viewBox for scalability)
    - Strip editor-specific namespaces/metadata from root element
    - Add role="img" and <title>
    - Run SVGO for path optimization
    """
    svg = svg_bytes.decode("utf-8", errors="replace")

    # Strip XML declaration and DOCTYPE
    svg = re.sub(r"<\?xml[^>]*\?>", "", svg)
    svg = re.sub(r"<!DOCTYPE[^>]*>", "", svg)
    svg = svg.strip()

    # If no viewBox exists, synthesize one from width/height before stripping them
    if not re.search(r'\bviewBox\s*=', svg):
        w_match = re.search(r'<svg\b[^>]*\s+width="([^"]*)"', svg)
        h_match = re.search(r'<svg\b[^>]*\s+height="([^"]*)"', svg)
        if w_match and h_match:
            w = _parse_length(w_match.group(1))
            h = _parse_length(h_match.group(1))
            if w and h and w > 0 and h > 0:
                svg = re.sub(r'(<svg\b)', rf'\1 viewBox="0 0 {w:.4g} {h:.4g}"', svg, count=1)

    # Remove absolute width/height from root <svg> so it scales freely
    svg = re.sub(r"(<svg\b[^>]*?)\s+width=\"[^\"]*\"", r"\1", svg)
    svg = re.sub(r"(<svg\b[^>]*?)\s+height=\"[^\"]*\"", r"\1", svg)

    # Remove editor namespaces and inkscape/sodipodi attributes
    svg = re.sub(r'\s+xmlns:(?:dc|cc|rdf|svg|sodipodi|inkscape)="[^"]*"', "", svg)
    svg = re.sub(r'\s+(?:sodipodi|inkscape):[a-zA-Z_-]+="[^"]*"', "", svg)
    svg = re.sub(r'\s+xml:space="[^"]*"', "", svg)

    # Add role="img" if missing
    if 'role="img"' not in svg:
        svg = svg.replace("<svg ", '<svg role="img" ', 1)

    # Inject <title> as first child of <svg>
    title_tag = f"<title>{title}</title>"
    if "<title>" not in svg:
        svg = re.sub(r"(<svg\b[^>]*>)", rf"\1{title_tag}", svg)

    # Write to temp file for SVGO
    import tempfile, os
    with tempfile.NamedTemporaryFile(suffix=".svg", delete=False, mode="w", encoding="utf-8") as tmp:
        tmp.write(svg)
        tmp_path = tmp.name

    try:
        out_path = tmp_path.replace(".svg", "_opt.svg")
        result = subprocess.run(
            [*SVGO_CMD, "-i", tmp_path, "-o", out_path, "--quiet"],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode == 0 and Path(out_path).exists():
            optimized = Path(out_path).read_bytes()
            os.unlink(out_path)
        else:
            optimized = svg.encode("utf-8")
    except Exception:
        optimized = svg.encode("utf-8")
    finally:
        os.unlink(tmp_path)

    return optimized


# --------------------------------------------------------------------------- #
# Asset creation
# --------------------------------------------------------------------------- #

def build_meta(city_name: str, filename: str) -> dict:
    return {
        "name": f"Herb {city_name}",
        "countryCode": "PL",
        "type": "municipal",
        "level": "city",
        "region": "Poland",
        "city": city_name,
        "description": f"Coat of arms of {city_name} (Herb {city_name}), a city in Poland.",
        "license": {
            "spdx": "CC0-1.0",
            "name": "Creative Commons Zero v1.0 Universal",
            "url": "https://creativecommons.org/publicdomain/zero/1.0/",
            "source": wikimedia_commons_page(filename),
        },
        "tags": ["poland", slugify(city_name), "city"],
    }


async def process_file(session, title: str, dry_run: bool, sem: asyncio.Semaphore) -> bool:
    async with sem:
        city_name = parse_city_name(title)
        if not city_name:
            print(f"  [SKIP] cannot parse city name from: {title}", file=sys.stderr)
            return False

        slug = slugify(city_name)
        asset_dir = ASSETS_ROOT / slug
        svg_path = asset_dir / f"{slug}.svg"
        meta_path = asset_dir / f"{slug}.meta.json"

        if svg_path.exists() and meta_path.exists():
            print(f"  [SKIP] already exists: {slug}")
            return True

        url = wikimedia_file_url(title)
        svg_bytes = await download_svg(session, url)

        if svg_bytes is None:
            print(f"  [FAIL] {city_name}: download failed", file=sys.stderr)
            return False

        optimized = optimize_svg(svg_bytes, f"Herb {city_name}")
        meta = build_meta(city_name, title)

        if dry_run:
            print(f"  [DRY]  {city_name:40s}  slug={slug:30s}  svg={len(optimized):6d}b")
            return True

        asset_dir.mkdir(parents=True, exist_ok=True)
        svg_path.write_bytes(optimized)
        meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  [OK]   {city_name:40s}  slug={slug}  svg={len(optimized)}b")
        return True


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

async def main():
    parser = argparse.ArgumentParser(description="Bulk download Polish city COAs from Wikimedia Commons")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing files")
    parser.add_argument("--limit", type=int, default=None, help="Max number of files to process")
    parser.add_argument("--workers", type=int, default=8, help="Parallel download workers (default: 8)")
    args = parser.parse_args()

    try:
        import aiohttp
    except ImportError:
        print("Installing aiohttp...")
        subprocess.run([sys.executable, "-m", "pip", "install", "aiohttp", "-q"], check=True)
        import aiohttp

    print(f"Fetching file list from Wikimedia Commons category…")
    sem = asyncio.Semaphore(args.workers)

    async with aiohttp.ClientSession(headers={"User-Agent": "blazon-bot/1.0 (https://github.com/blazon-registry/blazon)"}) as session:
        files = await fetch_all_files(session, args.limit)
        print(f"Found {len(files)} files to process")
        if args.dry_run:
            print("(dry-run mode — nothing will be written)")

        tasks = [process_file(session, title, args.dry_run, sem) for title in files]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    ok = sum(1 for r in results if r is True)
    failed = sum(1 for r in results if r is False or isinstance(r, Exception))
    print(f"\nDone: {ok} OK, {failed} failed/skipped out of {len(files)} total.")

    if not args.dry_run and ok > 0:
        print("\nRunning blazon generator…")
        subprocess.run(
            ["pnpm", "exec", "tsx", "tools/generator/bin/generate.ts", "--write", str(ASSETS_ROOT)],
            cwd=Path(__file__).parent.parent.parent,
        )


if __name__ == "__main__":
    asyncio.run(main())
