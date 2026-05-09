# @blazon/country-poland

> 495 Polish city coats of arms — tree-shakeable, typed data package for the Blazon registry.

## Install

```bash
pnpm add @blazon/country-poland @blazon/types
```

## Usage

### Tree-shakeable named imports (recommended)

Import only the cities you use. All other exports are removed by your bundler.

```ts
import { warszawa, krakow, wroclaw, poznan } from '@blazon/country-poland';

console.log(warszawa.id); // 'pl-city-warszawa'
console.log(warszawa.name); // 'Herb Warszawy'
console.log(warszawa.svg); // inline SVG string (no external request)
```

### Full collection

Use the `plCities` array when you need all 495 entries, e.g. for lazy-loading:

```ts
import { plCities } from '@blazon/country-poland';

console.log(plCities.length); // 495
```

### With `@blazon/core` — register as a loader

```ts
import { registerCountry } from '@blazon/core';
import { plCities } from '@blazon/country-poland';

registerCountry('PL', async () => ({
  countryCode: 'PL',
  name: 'Poland',
  entries: plCities,
}));
```

### With `@blazon/ngx` — Angular provider

```ts
// app.config.ts
import { warszawa, krakow } from '@blazon/country-poland';
import { provideBlazonIcons } from '@blazon/ngx';

export const appConfig: ApplicationConfig = {
  providers: [
    // Only Warszawa and Kraków end up in the bundle
    provideBlazonIcons([warszawa, krakow]),
  ],
};
```

## Available exports

Each city is exported as a `camelCase` identifier matching its slug:

| Import name | City             | ID                 |
| ----------- | ---------------- | ------------------ |
| `warszawa`  | Herb Warszawy    | `pl-city-warszawa` |
| `krakow`    | Herb Krakowa     | `pl-city-krakow`   |
| `wroclaw`   | Herb Wrocławia   | `pl-city-wroclaw`  |
| `poznan`    | Herb Poznania    | `pl-city-poznan`   |
| `gdansk`    | Herb Gdańska     | `pl-city-gdansk`   |
| `lodz`      | Herb Łodzi       | `pl-city-lodz`     |
| …           | 495 cities total | —                  |

## Data

All SVG assets are licensed under **CC0-1.0** unless otherwise noted in their sidecar `meta.json`.
Source SVGs live under `assets/pl/city/` in the monorepo root.

## Architecture

```
src/
└── pl/
    ├── city/
    │   ├── warszawa.ts        ← const warszawa: CoatOfArms = { … }
    │   ├── krakow.ts
    │   └── … (495 files)
    └── index.ts               ← exports everything + plCities[]
```

Exports are auto-generated from `assets/pl/city/*/index.json` by `tools/scripts/generate_core_exports.py`.
Do not edit `src/pl/` by hand.
