#!/usr/bin/env python3
"""
Generate TypeScript constant exports for each Polish city coat of arms.
Produces:
  packages/core/src/pl/city/{slug}.ts  — individual city constant
  packages/core/src/pl/index.ts         — barrel re-export of all cities
"""
import json
import pathlib
import re
import sys

ASSETS_DIR = pathlib.Path("assets/pl/city")
OUT_DIR = pathlib.Path("packages/core/src/pl")

TEMPLATE = """\
import type {{ CoatOfArms }} from '@blazon/types';

/**
 * {name} — Polish coat of arms ({city})
 * @id {id}
 */
const {varname}: CoatOfArms = {json_data} as const;

export {{ {varname} }};
"""


def slug_to_camel(slug: str) -> str:
    """Convert kebab-case slug to lowerCamelCase identifier."""
    parts = slug.replace("-", "_").split("_")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def is_valid_ts_identifier(name: str) -> bool:
    return bool(re.match(r'^[a-zA-Z_$][a-zA-Z0-9_$]*$', name))


def generate_city_file(slug: str, entry: dict) -> str:
    varname = slug_to_camel(slug)
    # Ensure varname is a valid TS identifier
    if not is_valid_ts_identifier(varname):
        varname = f"city_{varname}"

    json_data = json.dumps(entry, ensure_ascii=False, indent=2)

    return TEMPLATE.format(
        name=entry.get("name", slug),
        city=entry.get("metadata", {}).get("city", slug),
        id=entry.get("id", slug),
        varname=varname,
        json_data=json_data,
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    city_dir = OUT_DIR / "city"
    city_dir.mkdir(exist_ok=True)

    slugs: list[str] = []
    varnames: list[str] = []

    index_files = sorted(ASSETS_DIR.glob("*/index.json"))
    print(f"Processing {len(index_files)} cities...")

    for index_file in index_files:
        slug = index_file.parent.name
        try:
            entry = json.loads(index_file.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            print(f"  ✗  {slug}: JSON error: {e}", file=sys.stderr)
            continue

        varname = slug_to_camel(slug)
        if not is_valid_ts_identifier(varname):
            varname = f"city_{varname}"

        ts_content = generate_city_file(slug, entry)
        out_file = city_dir / f"{slug}.ts"
        out_file.write_text(ts_content, encoding="utf-8")

        slugs.append(slug)
        varnames.append(varname)

    # Generate city/index.ts — pure re-export barrel
    city_barrel_lines = [
        "// Auto-generated — do not edit by hand. Run tools/scripts/generate_core_exports.py",
        "",
    ]
    for slug, varname in zip(slugs, varnames):
        city_barrel_lines.append(f"export {{ {varname} }} from './{slug}.js';")
    city_barrel_lines.append("")

    city_index = city_dir / "index.ts"
    city_index.write_text("\n".join(city_barrel_lines), encoding="utf-8")

    # Generate pl/index.ts — re-exports + plCities collection
    pl_index_lines = [
        "// Auto-generated — do not edit by hand.",
        "// Polish coat of arms exports — individual cities and collection helper.",
        "",
        "export * from './city/index.js';",
        "",
        "import type { CoatOfArms } from '@blazon/types';",
    ]
    for slug, varname in zip(slugs, varnames):
        pl_index_lines.append(f"import {{ {varname} }} from './city/{slug}.js';")
    pl_index_lines.extend([
        "",
        "/** All Polish city coats of arms — useful for registering the full collection. */",
        "export const plCities: readonly CoatOfArms[] = [",
        "  " + ",\n  ".join(varnames) + ",",
        "];",
        "",
    ])

    (OUT_DIR / "index.ts").write_text("\n".join(pl_index_lines), encoding="utf-8")

    print(f"\n✔ Generated {len(slugs)} city exports in {city_dir}/")
    print(f"  Barrel: {city_dir}/index.ts")
    print(f"  PL index: {OUT_DIR}/index.ts")


if __name__ == "__main__":
    main()
