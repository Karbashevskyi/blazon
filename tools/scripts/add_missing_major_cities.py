#!/usr/bin/env python3
"""
Add 8 missing major Polish cities (Wrocław, Łódź, Katowice, Szczecin,
Kielce, Olsztyn, Opole, Rzeszów) to the Blazon registry.

Run from the repo root:
    python3 tools/scripts/add_missing_major_cities.py
"""
import json
import re
import sys
import unicodedata
import urllib.request
import urllib.parse
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent.parent
ASSETS_DIR = ROOT / "assets" / "pl" / "city"
CITY_SRC = ROOT / "packages" / "poland" / "src" / "pl" / "city"
CITY_INDEX = CITY_SRC / "index.ts"
PL_INDEX = ROOT / "packages" / "poland" / "src" / "pl" / "index.ts"
CITY_NAMES_FILE = ROOT / "apps" / "game" / "src" / "city-names.ts"

WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"

# ── City definitions ───────────────────────────────────────────────────────────
CITIES = [
    {
        "slug": "wroclaw",
        "name": "Herb Wrocław",
        "city": "Wrocław",
        "region": "Lower Silesian Voivodeship",
        "wikimedia_file": "POL Wrocław COA.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:POL_Wroc%C5%82aw_COA.svg",
        "var": "plWroclaw",
        "translations": {"en": "Wroclaw", "pl": "Wrocław", "uk": "Вроцлав", "de": "Breslau"},
    },
    {
        "slug": "lodz",
        "name": "Herb Łódź",
        "city": "Łódź",
        "region": "Łódź Voivodeship",
        "wikimedia_file": "POL Łódź COA.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:POL_%C5%81%C3%B3d%C5%BA_COA.svg",
        "var": "plLodz",
        "translations": {"en": "Lodz", "pl": "Łódź", "uk": "Лодзь", "de": "Lodz"},
    },
    {
        "slug": "katowice",
        "name": "Herb Katowice",
        "city": "Katowice",
        "region": "Silesian Voivodeship",
        "wikimedia_file": "POL Katowice COA.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:POL_Katowice_COA.svg",
        "var": "plKatowice",
        "translations": {"en": "Katowice", "pl": "Katowice", "uk": "Катовіце", "de": "Kattowitz"},
    },
    {
        "slug": "szczecin",
        "name": "Herb Szczecin",
        "city": "Szczecin",
        "region": "West Pomeranian Voivodeship",
        "wikimedia_file": "POL Szczecin COA.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:POL_Szczecin_COA.svg",
        "var": "plSzczecin",
        "translations": {"en": "Szczecin", "pl": "Szczecin", "uk": "Щецін", "de": "Stettin"},
    },
    {
        "slug": "kielce",
        "name": "Herb Kielce",
        "city": "Kielce",
        "region": "Świętokrzyskie Voivodeship",
        "wikimedia_file": "POL Kielce COA.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:POL_Kielce_COA.svg",
        "var": "plKielce",
        "translations": {"en": "Kielce", "pl": "Kielce", "uk": "Кельце", "de": "Kielce"},
    },
    {
        "slug": "olsztyn",
        "name": "Herb Olsztyn",
        "city": "Olsztyn",
        "region": "Warmian-Masurian Voivodeship",
        "wikimedia_file": "POL Olsztyn COA.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:POL_Olsztyn_COA.svg",
        "var": "plOlsztyn",
        "translations": {"en": "Olsztyn", "pl": "Olsztyn", "uk": "Ольштин", "de": "Allenstein"},
    },
    {
        "slug": "opole",
        "name": "Herb Opole",
        "city": "Opole",
        "region": "Opole Voivodeship",
        "wikimedia_file": "POL Opole COA.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:POL_Opole_COA.svg",
        "var": "plOpole",
        "translations": {"en": "Opole", "pl": "Opole", "uk": "Ополе", "de": "Oppeln"},
    },
    {
        "slug": "rzeszow",
        "name": "Herb Rzeszów",
        "city": "Rzeszów",
        "region": "Subcarpathian Voivodeship",
        "wikimedia_file": "POL Rzeszów COA.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:POL_Rzesz%C3%B3w_COA.svg",
        "var": "plRzeszow",
        "translations": {"en": "Rzeszow", "pl": "Rzeszów", "uk": "Жешув", "de": "Rzeszów"},
    },
]

LICENSE = {
    "spdx": "CC0-1.0",
    "name": "Creative Commons Zero v1.0 Universal",
    "url": "https://creativecommons.org/publicdomain/zero/1.0/",
}


# ── Helpers ────────────────────────────────────────────────────────────────────
def fetch_wikimedia_svg(filename: str) -> str | None:
    """Fetch SVG content from Wikimedia Commons given a file title."""
    params = urllib.parse.urlencode({
        "action": "query",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url",
        "format": "json",
    })
    url = f"{WIKIMEDIA_API}?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "blazon-generator/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            image_url = page.get("imageinfo", [{}])[0].get("url")
            if image_url:
                svg_req = urllib.request.Request(
                    image_url, headers={"User-Agent": "blazon-generator/1.0"}
                )
                with urllib.request.urlopen(svg_req, timeout=60) as svg_resp:
                    return svg_resp.read().decode("utf-8")
    except Exception as exc:
        print(f"  ⚠  Could not fetch {filename}: {exc}", file=sys.stderr)
    return None


def strip_xml_comments(svg: str) -> str:
    return re.sub(r"<!--.*?-->", "", svg, flags=re.DOTALL)


def clean_svg(svg: str) -> str:
    svg = strip_xml_comments(svg)
    # Normalise line endings
    svg = svg.replace("\r\n", "\n").replace("\r", "\n")
    # Strip leading/trailing whitespace
    svg = svg.strip()
    return svg


def escape_svg_for_ts(svg: str) -> str:
    """Escape SVG string for embedding in a TypeScript template literal via single quotes."""
    # We embed the SVG as a single-quoted JS string inside the .ts file
    return svg.replace("\\", "\\\\").replace("'", "\\'")


# ── File generators ────────────────────────────────────────────────────────────
def make_meta_json(city: dict) -> dict:
    return {
        "name": city["name"],
        "countryCode": "PL",
        "type": "municipal",
        "level": "city",
        "region": city["region"],
        "city": city["city"],
        "description": f"Coat of arms of {city['city']} ({city['name']}), a city in Poland.",
        "license": {**LICENSE, "source": city["source_url"]},
        "tags": ["poland", city["slug"], "city"],
    }


def make_index_json(city: dict, svg: str) -> dict:
    return {
        "id": f"pl-city-{city['slug']}",
        "name": city["name"],
        "description": f"Coat of arms of {city['city']} ({city['name']}), a city in Poland.",
        "svg": svg,
        "metadata": {
            "countryCode": "PL",
            "type": "municipal",
            "level": "city",
            "region": city["region"],
            "city": city["city"],
            "updatedAt": "2025-01-01",
        },
        "license": {**LICENSE, "source": city["source_url"]},
        "tags": ["poland", city["slug"], "city"],
    }


TS_TEMPLATE = """\
import type {{ BlazonLocality }} from '@blazon/types';

/**
 * Herb {city} — Polish locality
 * @id pl-city-{slug}
 */
const {var}: BlazonLocality = {{
  id: 'pl-city-{slug}',
  name: '{name}',
  countryCode: 'PL',
  kind: 'city',
  region: '{region}',
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

export {{ {var} }};
"""


def make_ts_file(city: dict, svg: str) -> str:
    svg_escaped = escape_svg_for_ts(svg)
    return TS_TEMPLATE.format(
        city=city["city"],
        slug=city["slug"],
        **{"var": city["var"]},
        name=city["name"],
        region=city["region"],
        svg_escaped=svg_escaped,
        source_url=city["source_url"],
    )


# ── Index file updaters ────────────────────────────────────────────────────────
def insert_export_in_city_index(slug: str, var_name: str) -> None:
    """Insert `export { plXxx } from './xxx.js';` in the right alphabetical position."""
    content = CITY_INDEX.read_text(encoding="utf-8")
    new_line = f"export {{ {var_name} }} from './{slug}.js';\n"

    if new_line.strip() in content:
        print(f"  ℹ  {slug} already in city/index.ts")
        return

    lines = content.splitlines(keepends=True)
    insert_at = len(lines)
    for i, line in enumerate(lines):
        m = re.match(r"export \{ \w+ \} from '\./([^']+)\.js';", line)
        if m and m.group(1) > slug:
            insert_at = i
            break

    lines.insert(insert_at, new_line)
    CITY_INDEX.write_text("".join(lines), encoding="utf-8")
    print(f"  ✔  Added export to city/index.ts at line {insert_at + 1}")


def insert_import_in_pl_index(slug: str, var_name: str) -> None:
    """Insert the import line in pl/index.ts in alphabetical order."""
    content = PL_INDEX.read_text(encoding="utf-8")
    new_import = f"import {{ {var_name} }} from './city/{slug}.js';\n"

    if new_import.strip() in content:
        print(f"  ℹ  {slug} import already in pl/index.ts")
        return

    lines = content.splitlines(keepends=True)
    # Find import block and insert alphabetically
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
    CITY_INDEX_CONTENT = "".join(lines)

    # Now add to polandCities array
    # Find the array and insert the variable name
    PL_INDEX.write_text(CITY_INDEX_CONTENT, encoding="utf-8")
    print(f"  ✔  Added import to pl/index.ts at line {insert_at + 1}")


def insert_var_in_poland_cities_array(slug: str, var_name: str) -> None:
    """Insert variable into the polandCities array in pl/index.ts alphabetically."""
    content = PL_INDEX.read_text(encoding="utf-8")

    # Find polandCities array entries and insert alphabetically
    # Pattern: lines like "  plXxx," inside the array
    array_pattern = re.compile(r"(const polandCities[^=]*=\s*\[)(.*?)(\];)", re.DOTALL)
    m = array_pattern.search(content)
    if not m:
        print(f"  ⚠  Could not find polandCities array in pl/index.ts", file=sys.stderr)
        return

    # Check if already present
    if var_name in content:
        print(f"  ℹ  {var_name} already in polandCities array")
        return

    array_body = m.group(2)
    array_lines = array_body.splitlines(keepends=True)

    new_entry = f"  {var_name},\n"
    insert_at = len(array_lines)
    for i, line in enumerate(array_lines):
        entry_m = re.match(r"\s+(pl\w+),", line)
        if entry_m and entry_m.group(1) > var_name:
            insert_at = i
            break

    array_lines.insert(insert_at, new_entry)
    new_array_body = "".join(array_lines)
    new_content = content[: m.start(2)] + new_array_body + content[m.end(2):]
    PL_INDEX.write_text(new_content, encoding="utf-8")
    print(f"  ✔  Added {var_name} to polandCities array")


def insert_city_name_translation(city: dict) -> None:
    """Insert city translation into city-names.ts."""
    content = CITY_NAMES_FILE.read_text(encoding="utf-8")
    city_id = f"pl-city-{city['slug']}"

    if city_id in content:
        print(f"  ℹ  {city_id} already in city-names.ts")
        return

    t = city["translations"]
    new_entry = (
        f"  '{city_id}': {{\n"
        f"    en: '{t['en']}',\n"
        f"    pl: '{t['pl']}',\n"
        f"    uk: '{t['uk']}',\n"
        f"    de: '{t['de']}',\n"
        f"  }},\n"
    )

    # Insert before the closing `};` of CITY_NAMES
    # Find the last entry and insert after it alphabetically
    lines = content.splitlines(keepends=True)
    insert_at = None

    for i, line in enumerate(lines):
        m = re.match(r"  '(pl-city-[^']+)':", line)
        if m and m.group(1) > city_id:
            insert_at = i
            break

    if insert_at is None:
        # Find closing `};`
        for i, line in enumerate(lines):
            if line.strip() in ("};", "} as const;", "} satisfies"):
                insert_at = i
                break

    if insert_at is None:
        print(f"  ⚠  Could not find insertion point in city-names.ts", file=sys.stderr)
        return

    lines.insert(insert_at, new_entry)
    CITY_NAMES_FILE.write_text("".join(lines), encoding="utf-8")
    print(f"  ✔  Added {city_id} to city-names.ts")


# ── Main ───────────────────────────────────────────────────────────────────────
def main() -> None:
    for city in CITIES:
        slug = city["slug"]
        print(f"\n{'='*60}")
        print(f"Processing: {city['city']} ({slug})")
        print(f"{'='*60}")

        # 1. Download SVG
        print(f"  Fetching SVG from Wikimedia Commons…")
        svg = fetch_wikimedia_svg(city["wikimedia_file"])
        if svg is None:
            print(f"  ✗  Skipping {slug} — could not download SVG", file=sys.stderr)
            continue

        svg = clean_svg(svg)
        print(f"  ✔  SVG downloaded ({len(svg):,} chars)")

        # 2. Create asset directory
        asset_dir = ASSETS_DIR / slug
        asset_dir.mkdir(parents=True, exist_ok=True)

        # Write raw SVG
        svg_path = asset_dir / f"{slug}.svg"
        svg_path.write_text(svg, encoding="utf-8")
        print(f"  ✔  Written: {svg_path.relative_to(ROOT)}")

        # Write meta.json sidecar
        meta = make_meta_json(city)
        meta_path = asset_dir / f"{slug}.meta.json"
        meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  ✔  Written: {meta_path.relative_to(ROOT)}")

        # Write index.json
        idx = make_index_json(city, svg)
        idx_path = asset_dir / "index.json"
        idx_path.write_text(json.dumps(idx, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  ✔  Written: {idx_path.relative_to(ROOT)}")

        # 3. Create TypeScript file
        ts_content = make_ts_file(city, svg)
        ts_path = CITY_SRC / f"{slug}.ts"
        if ts_path.exists():
            print(f"  ℹ  TypeScript file already exists: {ts_path.relative_to(ROOT)}")
        else:
            ts_path.write_text(ts_content, encoding="utf-8")
            print(f"  ✔  Written: {ts_path.relative_to(ROOT)}")

        # 4. Update city/index.ts
        insert_export_in_city_index(slug, city["var"])

        # 5. Update pl/index.ts (import + array)
        insert_import_in_pl_index(slug, city["var"])
        insert_var_in_poland_cities_array(slug, city["var"])

        # 6. Update city-names.ts
        insert_city_name_translation(city)

    print(f"\n{'='*60}")
    print("Done! All cities processed.")
    print("Run `pnpm typecheck` to verify TypeScript types.")


if __name__ == "__main__":
    main()
