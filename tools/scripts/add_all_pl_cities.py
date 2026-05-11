#!/usr/bin/env python3
"""
Add ALL missing Polish cities/towns to the Blazon registry using Wikidata SPARQL.

Queries Wikidata for all Polish entities with coat of arms SVGs, then downloads
and integrates missing ones into the package structure.

Usage (from repo root):
    python3 tools/scripts/add_all_pl_cities.py
"""

import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent.parent
ASSETS_DIR = ROOT / "assets" / "pl" / "city"
CITY_SRC = ROOT / "packages" / "poland" / "src" / "pl" / "city"
CITY_INDEX = CITY_SRC / "index.ts"
PL_INDEX = ROOT / "packages" / "poland" / "src" / "pl" / "index.ts"
CITY_NAMES_FILE = ROOT / "apps" / "game" / "src" / "city-names.ts"

WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"

# Categories to scan (city coat of arms on Wikimedia Commons)
CATEGORIES = [
    "Category:SVG_coats_of_arms_of_cities_of_Poland",
    "Category:SVG_coats_of_arms_of_towns_of_Poland",
]

# Skip versioned / historical file variants
SKIP_FILE_PATTERN = re.compile(
    r"(\(\d{4}[-–]\d{4}\)|\(historical\)|\(old\)|\(before\)|variant|wariant)",
    re.IGNORECASE,
)

LICENSE = {
    "spdx": "CC0-1.0",
    "name": "Creative Commons Zero v1.0 Universal",
    "url": "https://creativecommons.org/publicdomain/zero/1.0/",
}

# ── Transliteration ───────────────────────────────────────────────────────────
POLISH_CHARS = str.maketrans({
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n',
    'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z',
})

def transliterate(text: str) -> str:
    text = text.translate(POLISH_CHARS)
    text = unicodedata.normalize('NFD', text)
    return ''.join(c for c in text if unicodedata.category(c) != 'Mn')


def name_to_slug(name: str) -> str:
    slug = transliterate(name).lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')


def slug_to_var(slug: str) -> str:
    return 'pl' + ''.join(p.capitalize() for p in slug.split('-'))


def parse_city_name(filename: str) -> str | None:
    """Extract city name from a Wikimedia filename like 'POL Kraków COA.svg'."""
    stem = re.sub(r'^File:', '', filename, flags=re.IGNORECASE)
    stem = re.sub(r'\.svg$', '', stem, flags=re.IGNORECASE)
    m = re.match(r'^POL\s+(?:m\.\s+)?(.+?)\s+COA(?:\s+.*)?$', stem, re.IGNORECASE)
    if not m:
        return None
    return m.group(1).strip()


def wikimedia_file_url(filename: str) -> str:
    name = re.sub(r'^File:', '', filename)
    encoded = urllib.parse.quote(name, safe='')
    return f"https://commons.wikimedia.org/wiki/Special:FilePath/{encoded}"


# ── Wikimedia Commons API ─────────────────────────────────────────────────────
def fetch_category_files(category: str) -> list[str]:
    """Return all file titles from a Wikimedia Commons category (paginated)."""
    files: list[str] = []
    params: dict[str, str] = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": category,
        "cmtype": "file",
        "cmlimit": "500",
        "format": "json",
    }
    while True:
        url = WIKIMEDIA_API + "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={
            "User-Agent": "blazon-generator/1.0 (https://github.com/Karbashevskyi/blazon)",
        })
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read())
        for member in data.get("query", {}).get("categorymembers", []):
            title = member["title"]
            if not SKIP_FILE_PATTERN.search(title):
                files.append(title)
        cont = data.get("continue", {})
        if "cmcontinue" not in cont:
            break
        params["cmcontinue"] = cont["cmcontinue"]
    return files


def download_svg(url: str, retries: int = 3) -> str:
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "blazon-generator/1.0"},
            )
            with urllib.request.urlopen(req, timeout=60) as r:
                raw = r.read()
            try:
                return raw.decode("utf-8")
            except UnicodeDecodeError:
                return raw.decode("latin-1")
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code == 429:
                wait = 15 * (attempt + 1)
                print(f"\n  ⚠ Rate limited (429), sleeping {wait}s…", flush=True)
                time.sleep(wait)
            else:
                raise
        except Exception as e:
            last_err = e
            if attempt < retries - 1:
                time.sleep(5)
    raise Exception(f"Download failed after {retries} attempts: {last_err}")


# ── SVG helpers ───────────────────────────────────────────────────────────────
def clean_svg(svg: str) -> str:
    svg = re.sub(r'<!--.*?-->', '', svg, flags=re.DOTALL)
    return svg.replace('\r\n', '\n').replace('\r', '\n').strip()


def escape_svg(svg: str) -> str:
    return svg.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')


# ── TypeScript template ───────────────────────────────────────────────────────
TS_TEMPLATE = """\
import type {{ BlazonLocality }} from '@blazon/types';

/**
 * Herb {city} — Polish locality
 * @id pl-city-{slug}
 */
const {var_name}: BlazonLocality = {{
  id: 'pl-city-{slug}',
  name: 'Herb {city}',
  countryCode: 'PL',
  kind: 'city',
  region: 'Poland',
  aliases: ['poland', '{slug}', 'city'],
  assets: [
    {{
      kind: 'arms',
      svg: '{svg_escaped}',
    }},
  ],
  license: {{
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  }},
  sources: [{{ url: '{source_url}' }}],
}};
export {{ {var_name} }};
"""


# ── Index file helpers ────────────────────────────────────────────────────────
def insert_export_in_city_index(slug: str, var_name: str) -> bool:
    content = CITY_INDEX.read_text(encoding='utf-8')
    new_line = f"export {{ {var_name} }} from './{slug}.js';\n"
    if new_line.strip() in content:
        return False
    lines = content.splitlines(keepends=True)
    insert_at = len(lines)
    for i, line in enumerate(lines):
        m = re.match(r"export \{ \w+ \} from '\./([^']+)\.js';", line)
        if m and m.group(1) > slug:
            insert_at = i
            break
    lines.insert(insert_at, new_line)
    CITY_INDEX.write_text(''.join(lines), encoding='utf-8')
    return True


def insert_import_in_pl_index(slug: str, var_name: str) -> bool:
    content = PL_INDEX.read_text(encoding='utf-8')
    new_import = f"import {{ {var_name} }} from './city/{slug}.js';\n"
    if new_import.strip() in content:
        return False
    lines = content.splitlines(keepends=True)
    last_import_idx = 0
    insert_at = None
    for i, line in enumerate(lines):
        m = re.match(r"import \{ \w+ \} from './city/([^']+)\.js';", line)
        if m:
            last_import_idx = i
            if insert_at is None and m.group(1) > slug:
                insert_at = i
    if insert_at is None:
        insert_at = last_import_idx + 1
    lines.insert(insert_at, new_import)
    PL_INDEX.write_text(''.join(lines), encoding='utf-8')
    return True


def insert_var_in_array(var_name: str) -> bool:
    content = PL_INDEX.read_text(encoding='utf-8')
    m = re.search(r'(const polandCities[^=]*=\s*\[)(.*?)(\];)', content, re.DOTALL)
    if not m:
        print(f"  ⚠ Could not find polandCities array", file=sys.stderr)
        return False
    array_body = m.group(2)
    if re.search(rf'\b{re.escape(var_name)},', array_body):
        return False
    lines = array_body.splitlines(keepends=True)
    new_entry = f'  {var_name},\n'
    insert_at = len(lines)
    for i, line in enumerate(lines):
        em = re.match(r'\s+(pl\w+),', line)
        if em and em.group(1) > var_name:
            insert_at = i
            break
    lines.insert(insert_at, new_entry)
    new_content = content[:m.start(2)] + ''.join(lines) + content[m.end(2):]
    PL_INDEX.write_text(new_content, encoding='utf-8')
    return True


def insert_city_name(slug: str, city_name: str) -> bool:
    content = CITY_NAMES_FILE.read_text(encoding='utf-8')
    city_id = f'pl-city-{slug}'
    if city_id in content:
        return False
    en_name = transliterate(city_name)
    # Escape any apostrophes in city names for TS string literals
    city_name_safe = city_name.replace("'", "\\'")
    en_name_safe = en_name.replace("'", "\\'")
    new_entry = (
        f"  '{city_id}': {{\n"
        f"    en: '{en_name_safe}',\n"
        f"    pl: '{city_name_safe}',\n"
        f"  }},\n"
    )
    lines = content.splitlines(keepends=True)
    insert_at = None
    for i, line in enumerate(lines):
        mm = re.match(r"  '(pl-city-[^']+)':", line)
        if mm and mm.group(1) > city_id:
            insert_at = i
            break
    if insert_at is None:
        for i, line in enumerate(lines):
            if re.match(r'^} (as const|satisfies)', line.strip()) or line.strip() == '};':
                insert_at = i
                break
    if insert_at is None:
        return False
    lines.insert(insert_at, new_entry)
    CITY_NAMES_FILE.write_text(''.join(lines), encoding='utf-8')
    return True


# ── Main processing ───────────────────────────────────────────────────────────
def process_city(city_name: str, coa_url: str) -> tuple[str, str]:
    """Create all files for a city. Returns (status, error_msg)."""
    slug = name_to_slug(city_name)
    var_name = slug_to_var(slug)
    ts_file = CITY_SRC / f'{slug}.ts'

    if ts_file.exists():
        # Still ensure index files are up to date
        insert_export_in_city_index(slug, var_name)
        insert_import_in_pl_index(slug, var_name)
        insert_var_in_array(var_name)
        insert_city_name(slug, city_name)
        return 'exists', ''

    # Download SVG
    try:
        svg_raw = download_svg(coa_url)
    except Exception as e:
        return 'failed', str(e)

    svg = clean_svg(svg_raw)
    if not svg.strip().startswith('<'):
        return 'failed', 'not a valid SVG'

    # Create asset directory and files
    asset_dir = ASSETS_DIR / slug
    asset_dir.mkdir(parents=True, exist_ok=True)

    (asset_dir / f'{slug}.svg').write_text(svg, encoding='utf-8')

    meta = {
        "name": f"Herb {city_name}",
        "countryCode": "PL",
        "type": "municipal",
        "level": "city",
        "region": "Poland",
        "city": city_name,
        "description": f"Coat of arms of {city_name}, a locality in Poland.",
        "license": {**LICENSE, "source": coa_url},
        "tags": ["poland", slug, "city"],
    }
    (asset_dir / f'{slug}.meta.json').write_text(
        json.dumps(meta, indent=2, ensure_ascii=False), encoding='utf-8')

    idx = {
        "id": f"pl-city-{slug}",
        "name": f"Herb {city_name}",
        "description": f"Coat of arms of {city_name}, a locality in Poland.",
        "svg": svg,
        "metadata": {
            "countryCode": "PL",
            "type": "municipal",
            "level": "city",
            "region": "Poland",
            "city": city_name,
            "updatedAt": "2026-05-11",
        },
        "license": {**LICENSE, "source": coa_url},
        "tags": ["poland", slug, "city"],
    }
    (asset_dir / 'index.json').write_text(
        json.dumps(idx, indent=2, ensure_ascii=False), encoding='utf-8')

    city_safe = city_name.replace("'", "\\'")
    ts_content = TS_TEMPLATE.format(
        city=city_safe,
        slug=slug,
        var_name=var_name,
        svg_escaped=escape_svg(svg),
        source_url=coa_url,
    )
    ts_file.write_text(ts_content, encoding='utf-8')

    # Update index files
    insert_export_in_city_index(slug, var_name)
    insert_import_in_pl_index(slug, var_name)
    insert_var_in_array(var_name)
    insert_city_name(slug, city_name)

    return 'added', ''


def main():
    # Collect files from all categories
    all_files: list[str] = []
    for cat in CATEGORIES:
        print(f"Fetching file list from {cat}…")
        try:
            files = fetch_category_files(cat)
            print(f"  → {len(files)} files")
            all_files.extend(files)
        except Exception as e:
            print(f"  ⚠ Failed to fetch category: {e}", file=sys.stderr)

    print(f"\nTotal files found: {len(all_files)}")

    # Existing slugs
    existing = {d.name for d in ASSETS_DIR.iterdir() if d.is_dir()}
    print(f"Already in package: {len(existing)} cities")

    # Build candidate list
    to_process: list[tuple[str, str, str]] = []  # (city_name, slug, url)
    seen: set[str] = set()
    skipped_parse = 0
    skipped_exists = 0

    for filename in all_files:
        city_name = parse_city_name(filename)
        if not city_name:
            skipped_parse += 1
            continue
        slug = name_to_slug(city_name)
        if not slug or slug in seen:
            continue
        if slug in existing:
            seen.add(slug)
            skipped_exists += 1
            continue
        seen.add(slug)
        url = wikimedia_file_url(filename)
        to_process.append((city_name, slug, url))

    print(f"Skipped (bad filename): {skipped_parse}")
    print(f"Already exists: {skipped_exists}")
    print(f"New cities to add: {len(to_process)}")

    if not to_process:
        print("Nothing to add!")
        return

    added = 0
    failed = 0
    failed_list: list[str] = []

    for i, (city_name, slug, coa_url) in enumerate(to_process, 1):
        print(f"[{i:4d}/{len(to_process)}] {city_name} ({slug})", end=" … ", flush=True)

        status, err = process_city(city_name, coa_url)

        if status == 'added':
            added += 1
            print("✔ added")
            if i < len(to_process):
                time.sleep(2)  # Be polite to Wikimedia
        elif status == 'exists':
            print("ℹ exists")
        else:
            failed += 1
            failed_list.append(f"{city_name}: {err}")
            print(f"✗ failed: {err}")
            if i < len(to_process):
                time.sleep(1)

    print(f"\n{'=' * 60}")
    print(f"Done!  Added: {added}  |  Failed: {failed}")
    if failed_list:
        print("\nFailed cities:")
        for f in failed_list:
            print(f"  - {f}")
    print("\nRun `pnpm --filter @blazon/poland typecheck` to verify TypeScript.")


if __name__ == "__main__":
    main()
