#!/usr/bin/env python3
"""
Migrates @blazon/country-poland city entry files from CoatOfArms to BlazonLocality shape.

Usage:
  python3 tools/scripts/migrate_city_entries.py
"""
import re
import json
import sys
from pathlib import Path

CITY_DIR = Path('packages/country-poland/src/pl/city')

LEVEL_MAP: dict[str, str] = {
    'national': 'country',
    'state': 'region',
    'county': 'county',
    'city': 'city',
    'district': 'district',
    'village': 'municipality',
    'historical': 'historical',
}


def add_pl_prefix(var_name: str) -> str:
    """Add 'pl' prefix: 'aleksandrowKujawski' -> 'plAleksandrowKujawski'"""
    return 'pl' + var_name[0].upper() + var_name[1:]


def extract_string_field(text: str, field: str) -> str | None:
    """Extract a single-quoted string field value from TypeScript object literal."""
    # Match: field: 'value', or field: 'value'\n
    m = re.search(rf"^\s+{re.escape(field)}:\s+'((?:[^'\\]|\\.)*)'", text, re.MULTILINE)
    return m.group(1) if m else None


def process_file(path: Path) -> bool:
    content = path.read_text(encoding='utf-8')

    # Skip already-migrated files
    if 'BlazonLocality' in content:
        print(f'  SKIP (already migrated): {path.name}')
        return False

    # ── Variable name ────────────────────────────────────────────────────────
    var_match = re.search(r'const\s+(\w+)\s*:\s*CoatOfArms\s*=\s*\{', content)
    if not var_match:
        print(f'  WARN: no CoatOfArms declaration in {path.name}', file=sys.stderr)
        return False
    old_name = var_match.group(1)
    new_name = add_pl_prefix(old_name)

    # ── ID ───────────────────────────────────────────────────────────────────
    id_match = re.search(r"^\s+id:\s+'([^']+)'", content, re.MULTILINE)
    id_val = id_match.group(1) if id_match else ''

    # ── Name ─────────────────────────────────────────────────────────────────
    name_match = re.search(r"^\s+name:\s+'((?:[^'\\]|\\.)*)'", content, re.MULTILINE)
    name_val = name_match.group(1) if name_match else ''

    # ── SVG ──────────────────────────────────────────────────────────────────
    # The SVG is always on one very long single line: "  svg: '<svg...>',"
    svg_line_match = re.search(r"^  svg:\s+'(.+)',\s*$", content, re.MULTILINE)
    if not svg_line_match:
        print(f'  WARN: could not extract SVG in {path.name}', file=sys.stderr)
        return False
    svg_raw = svg_line_match.group(1)

    # ── Metadata ─────────────────────────────────────────────────────────────
    meta_match = re.search(r'metadata:\s*\{([^}]+)\}', content, re.DOTALL)
    if not meta_match:
        print(f'  WARN: no metadata in {path.name}', file=sys.stderr)
        return False
    meta_text = meta_match.group(1)

    level = extract_string_field(meta_text, 'level') or 'city'
    kind = LEVEL_MAP.get(level, level)
    region = extract_string_field(meta_text, 'region')

    # ── License ───────────────────────────────────────────────────────────────
    lic_match = re.search(r'license:\s*\{([^}]+)\}', content, re.DOTALL)
    if not lic_match:
        print(f'  WARN: no license in {path.name}', file=sys.stderr)
        return False
    lic_text = lic_match.group(1)

    lic_spdx = extract_string_field(lic_text, 'spdx') or ''
    lic_name = extract_string_field(lic_text, 'name') or ''
    lic_url = extract_string_field(lic_text, 'url') or ''
    lic_source = extract_string_field(lic_text, 'source')
    lic_author = extract_string_field(lic_text, 'author')

    # ── Tags → aliases ────────────────────────────────────────────────────────
    tags_match = re.search(r'tags:\s*\[([^\]]*)\]', content, re.DOTALL)
    aliases: list[str] = []
    if tags_match:
        raw_tags = tags_match.group(1)
        aliases = [t.strip().strip("'\"") for t in raw_tags.split(',') if t.strip().strip("'\"")]

    # ── Build new file ────────────────────────────────────────────────────────
    lines: list[str] = [
        "import type { BlazonLocality } from '@blazon/types';",
        '',
        '/**',
        f" * {name_val} — Polish locality",
        f' * @id {id_val}',
        ' */',
        f'const {new_name}: BlazonLocality = {{',
        f"  id: '{id_val}',",
        f"  name: '{name_val}',",
        "  countryCode: 'PL',",
        f"  kind: '{kind}',",
    ]

    if region:
        # Escape any single quotes in region
        region_escaped = region.replace("'", "\\'")
        lines.append(f"  region: '{region_escaped}',")

    if aliases:
        lines.append(f'  aliases: {json.dumps(aliases)},')

    lines += [
        '  assets: [',
        f"    {{ kind: 'arms', svg: '{svg_raw}' }},",
        '  ],',
        '  license: {',
        f"    spdx: '{lic_spdx}',",
        f"    name: '{lic_name}',",
        f"    url: '{lic_url}',",
    ]

    if lic_author:
        lic_author_escaped = lic_author.replace("'", "\\'")
        lines.append(f"    author: '{lic_author_escaped}',")

    lines.append('  },')

    if lic_source:
        lic_source_escaped = lic_source.replace("'", "\\'")
        lines += [
            '  sources: [',
            f"    {{ url: '{lic_source_escaped}' }},",
            '  ],',
        ]

    lines += [
        '};',
        '',
        f'export {{ {new_name} }};',
        '',
    ]

    new_content = '\n'.join(lines)
    path.write_text(new_content, encoding='utf-8')
    return True


def main() -> None:
    if not CITY_DIR.exists():
        print(f'ERROR: {CITY_DIR} does not exist', file=sys.stderr)
        sys.exit(1)

    ts_files = sorted(f for f in CITY_DIR.glob('*.ts') if f.name != 'index.ts')
    migrated = 0
    skipped = 0
    errors = 0

    for ts_file in ts_files:
        try:
            result = process_file(ts_file)
            if result:
                migrated += 1
                print(f'  OK: {ts_file.name}')
            else:
                skipped += 1
        except Exception as exc:
            print(f'  ERROR: {ts_file.name}: {exc}', file=sys.stderr)
            errors += 1

    print(f'\nDone: {migrated} migrated, {skipped} skipped, {errors} errors.')


if __name__ == '__main__':
    main()
