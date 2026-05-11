#!/usr/bin/env python3
"""Add the 4 remaining major Polish cities: Wrocław, Kielce, Opole, Rzeszów."""
import json
import re
import sys
import time
import urllib.request
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
ASSETS_DIR = ROOT / "assets" / "pl" / "city"
CITY_SRC = ROOT / "packages" / "poland" / "src" / "pl" / "city"
CITY_INDEX = CITY_SRC / "index.ts"
PL_INDEX = ROOT / "packages" / "poland" / "src" / "pl" / "index.ts"
CITY_NAMES_FILE = ROOT / "apps" / "game" / "src" / "city-names.ts"
WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"

CITIES = [
    {
        "slug": "wroclaw",
        "name": "Herb Wrocław",
        "city": "Wrocław",
        "region": "Lower Silesian Voivodeship",
        "wikimedia_file": "Herb wroclaw.svg",
        "source_url": "https://commons.wikimedia.org/wiki/File:Herb_wroclaw.svg",
        "var": "plWroclaw",
        "translations": {"en": "Wroclaw", "pl": "Wrocław", "uk": "Вроцлав", "de": "Breslau"},
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


def fetch_wikimedia_svg(filename: str) -> str | None:
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
                # Strip query string (utm params added by Wikimedia)
                image_url = image_url.split("?")[0]
                print(f"  → {image_url}")
                svg_req = urllib.request.Request(image_url, headers={"User-Agent": "blazon-generator/1.0"})
                with urllib.request.urlopen(svg_req, timeout=60) as svg_resp:
                    return svg_resp.read().decode("utf-8")
    except Exception as exc:
        print(f"  ⚠  Could not fetch {filename}: {exc}", file=sys.stderr)
    return None


def clean_svg(svg: str) -> str:
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.DOTALL)
    return svg.replace("\r\n", "\n").replace("\r", "\n").strip()


def escape_svg_for_ts(svg: str) -> str:
    return svg.replace("\\", "\\\\").replace("'", "\\'")


TS_TEMPLATE = """\
import type {{ BlazonLocality }} from '@blazon/types';

/**
 * Herb {city} — Polish locality
 * @id pl-city-{slug}
 */
const {var_name}: BlazonLocality = {{
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

export {{ {var_name} }};
"""


def make_ts_file(city: dict, svg: str) -> str:
    return TS_TEMPLATE.format(
        city=city["city"],
        slug=city["slug"],
        var_name=city["var"],
        name=city["name"],
        region=city["region"],
        svg_escaped=escape_svg_for_ts(svg),
        source_url=city["source_url"],
    )


def insert_export_in_city_index(slug: str, var_name: str) -> None:
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
    content = PL_INDEX.read_text(encoding="utf-8")
    new_import = f"import {{ {var_name} }} from './city/{slug}.js';\n"
    if new_import.strip() in content:
        print(f"  ℹ  {slug} import already in pl/index.ts")
        return
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
    PL_INDEX.write_text("".join(lines), encoding="utf-8")
    print(f"  ✔  Added import to pl/index.ts at line {insert_at + 1}")


def insert_var_in_poland_cities_array(slug: str, var_name: str) -> None:
    content = PL_INDEX.read_text(encoding="utf-8")
    array_pattern = re.compile(r"(const polandCities[^=]*=\s*\[)(.*?)(\];)", re.DOTALL)
    m = array_pattern.search(content)
    if not m:
        print(f"  ⚠  Could not find polandCities array", file=sys.stderr)
        return
    array_body = m.group(2)
    # Check if already in array (not just anywhere in file)
    if re.search(rf"\b{re.escape(var_name)},", array_body):
        print(f"  ℹ  {var_name} already in polandCities array")
        return
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
    lines = content.splitlines(keepends=True)
    insert_at = None
    for i, line in enumerate(lines):
        m = re.match(r"  '(pl-city-[^']+)':", line)
        if m and m.group(1) > city_id:
            insert_at = i
            break
    if insert_at is None:
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


def main() -> None:
    for idx, city in enumerate(CITIES):
        slug = city["slug"]
        print(f"\n{'='*60}")
        print(f"Processing: {city['city']} ({slug})")
        print(f"{'='*60}")

        # Rate-limit delay between cities (skip before first)
        if idx > 0:
            print("  ⏳  Waiting 5s to avoid rate limiting…")
            time.sleep(5)

        # Skip if TS file already exists
        ts_file = CITY_SRC / f"{slug}.ts"
        if ts_file.exists():
            print(f"  ℹ  {slug}.ts already exists, skipping download")
            svg = None
        else:
            print("  Fetching SVG from Wikimedia Commons…")
            svg = fetch_wikimedia_svg(city["wikimedia_file"])
            if svg is None:
                print(f"  ✗  Skipping {slug} — could not download SVG", file=sys.stderr)
                continue
            svg = clean_svg(svg)
            print(f"  ✔  SVG downloaded ({len(svg):,} chars)")

            # Create asset directory
            asset_dir = ASSETS_DIR / slug
            asset_dir.mkdir(parents=True, exist_ok=True)

            # Write SVG
            (asset_dir / f"{slug}.svg").write_text(svg, encoding="utf-8")
            print(f"  ✔  Written: assets/pl/city/{slug}/{slug}.svg")

            # Write meta.json
            meta = {
                "name": city["name"],
                "countryCode": "PL",
                "type": "municipal",
                "level": "city",
                "region": city["region"],
                "city": city["city"],
                "description": f"Coat of arms of {city['city']} ({city['name']}), a city in Poland.",
                "license": {**LICENSE, "source": city["source_url"]},
                "tags": ["poland", slug, "city"],
            }
            (asset_dir / f"{slug}.meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"  ✔  Written: assets/pl/city/{slug}/{slug}.meta.json")

            # Write index.json
            index_json = {
                "id": f"pl-city-{slug}",
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
                "tags": ["poland", slug, "city"],
            }
            (asset_dir / "index.json").write_text(json.dumps(index_json, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"  ✔  Written: assets/pl/city/{slug}/index.json")

            # Write TypeScript file
            ts_content = make_ts_file(city, svg)
            ts_file.write_text(ts_content, encoding="utf-8")
            print(f"  ✔  Written: packages/poland/src/pl/city/{slug}.ts")

        # Update index files regardless
        insert_export_in_city_index(slug, city["var"])
        insert_import_in_pl_index(slug, city["var"])
        insert_var_in_poland_cities_array(slug, city["var"])
        insert_city_name_translation(city)

    print("\n" + "="*60)
    print("Done! Run `pnpm typecheck` to verify TypeScript types.")
    print("="*60)


if __name__ == "__main__":
    main()
