# @blazon/generator

> CLI and library for converting SVG files into Blazon registry entries.

## Usage (CLI)

```bash
# Dry-run — preview what would be generated
pnpm exec tsx tools/generator/bin/generate.ts assets/pl/city

# Write index.json next to each SVG
pnpm exec tsx tools/generator/bin/generate.ts --write assets/pl/city

# Generate a full country bundle
pnpm exec tsx tools/generator/bin/generate.ts \
  --write \
  --bundle dist/registries/pl.json \
  --country PL \
  --country-name Poland \
  assets/pl
```

## Sidecar file format

Each SVG must have a `{name}.meta.json` (or `meta.json`) in the same directory:

```json
{
  "name": "Herb Warszawy",
  "countryCode": "PL",
  "type": "municipal",
  "level": "city",
  "region": "Masovian Voivodeship",
  "city": "Warsaw",
  "description": "...",
  "blazon": "Gules, a mermaid or...",
  "license": {
    "spdx": "CC0-1.0",
    "name": "Creative Commons Zero v1.0 Universal",
    "url": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  "tags": ["poland", "warsaw", "mermaid"]
}
```

## Programmatic API

```ts
import { generateEntry, generateFromDirectory, generateCountryBundle } from '@blazon/generator';

// Single file
const result = await generateEntry('assets/pl/city/warsaw/warsaw.svg', meta, { write: true });

// Directory scan
const results = await generateFromDirectory('assets/pl', { write: true });

// Full country bundle
await generateCountryBundle('assets/pl', 'PL', 'Poland', 'dist/pl.json');
```
