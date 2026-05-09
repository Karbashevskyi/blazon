#!/usr/bin/env python3
"""
Regenerates the city/index.ts and pl/index.ts files for @blazon/poland
using the new pl-prefixed naming convention.

Usage:
  python3 tools/scripts/regenerate_poland_index.py
"""
import re
import sys
from pathlib import Path

CITY_DIR = Path('packages/country-poland/src/pl/city')
CITY_INDEX = CITY_DIR / 'index.ts'
PL_INDEX = Path('packages/country-poland/src/pl/index.ts')


def get_export_name(path: Path) -> str | None:
    """Extract the exported variable name from a migrated city file."""
    content = path.read_text(encoding='utf-8')
    m = re.search(r'export\s*\{\s*(\w+)\s*\}', content)
    return m.group(1) if m else None


def main() -> None:
    if not CITY_DIR.exists():
        print(f'ERROR: {CITY_DIR} does not exist', file=sys.stderr)
        sys.exit(1)

    ts_files = sorted(f for f in CITY_DIR.glob('*.ts') if f.name != 'index.ts')
    entries: list[tuple[str, str]] = []  # (file_stem, export_name)

    for ts_file in ts_files:
        name = get_export_name(ts_file)
        if name is None:
            print(f'  WARN: could not find export in {ts_file.name}', file=sys.stderr)
            continue
        entries.append((ts_file.stem, name))

    if not entries:
        print('ERROR: no entries found', file=sys.stderr)
        sys.exit(1)

    print(f'Found {len(entries)} entries')

    # ── Generate city/index.ts ────────────────────────────────────────────────
    city_lines = [
        '// Auto-generated — do not edit by hand.',
        '',
    ]
    for stem, export_name in entries:
        city_lines.append(f"export {{ {export_name} }} from './{stem}.js';")
    city_lines.append('')

    CITY_INDEX.write_text('\n'.join(city_lines), encoding='utf-8')
    print(f'Wrote {CITY_INDEX}')

    # ── Generate pl/index.ts ──────────────────────────────────────────────────
    pl_lines = [
        '// Auto-generated — do not edit by hand.',
        '// Polish locality exports — individual cities and collection helpers.',
        '',
        "export * from './city/index.js';",
        '',
        "import type { BlazonLocality, BlazonCountryRegistry } from '@blazon/types';",
    ]

    for stem, export_name in entries:
        pl_lines.append(f"import {{ {export_name} }} from './city/{stem}.js';")

    pl_lines += [
        '',
        'export const polandCities: readonly BlazonLocality[] = [',
    ]

    for _, export_name in entries:
        pl_lines.append(f'  {export_name},')

    pl_lines += [
        '];',
        '',
        'export const polandRegistry: BlazonCountryRegistry = {',
        "  countryCode: 'PL',",
        "  name: 'Poland',",
        '  entries: polandCities,',
        '};',
        '',
    ]

    PL_INDEX.write_text('\n'.join(pl_lines), encoding='utf-8')
    print(f'Wrote {PL_INDEX}')


if __name__ == '__main__':
    main()
