<div align="center">
  <h1>⚜ Blazon</h1>
  <p><strong>Open-source heraldry registry with universal core and framework adapters.</strong></p>

  <p>
    <a href="https://github.com/blazon-registry/blazon/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/blazon-registry/blazon/ci.yml?label=CI&style=flat-square" alt="CI" />
    </a>
    <a href="https://www.npmjs.com/package/@blazon/core">
      <img src="https://img.shields.io/npm/v/@blazon/core?style=flat-square&label=%40blazon%2Fcore" alt="npm @blazon/core" />
    </a>
    <a href="https://www.npmjs.com/package/@blazon/poland">
      <img src="https://img.shields.io/npm/v/@blazon/poland?style=flat-square&label=%40blazon%2Fpoland" alt="npm @blazon/poland" />
    </a>
    <a href="https://www.npmjs.com/package/@blazon/ngx">
      <img src="https://img.shields.io/npm/v/@blazon/ngx?style=flat-square&label=%40blazon%2Fngx" alt="npm @blazon/ngx" />
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License" />
    </a>
  </p>
</div>

---

## Overview

Blazon is a typed, tree-shakeable, framework-agnostic registry for coats of arms and heraldic assets. It provides:

- A **universal core** (`@blazon/core`) — pure functional API: `getById`, `search`, `filterByKind`, `filterByRegion`, `createRegistry`
- **Typed domain models** (`@blazon/types`) — `BlazonLocality`, `BlazonAsset`, `BlazonLicense`, `BlazonCountryRegistry` with zero runtime overhead
- **Country data packages** (`@blazon/poland`, …) — tree-shakeable named exports per locality, import only what you need
- An **Angular adapter** (`@blazon/ngx`) — standalone `<blazon-icon>` component with `provideBlazonIcons` (Angular 16+)
- A **generator CLI** (`@blazon/generator`) — converts SVG files into registry entries
- A growing **asset library** (`assets/`) of CC-licensed heraldic SVGs

---

## Monorepo Structure

```
blazon/
├── packages/
│   ├── types/     @blazon/types    — TypeScript domain types (zero runtime)
│   ├── core/      @blazon/core     — Framework-agnostic pure functional API
│   ├── poland/    @blazon/poland   — 495 Polish city coats of arms
│   └── ngx/       @blazon/ngx     — Angular adapter (v16+)
├── apps/
│   ├── docs/      @blazon/docs    — Interactive documentation (Vite, private)
│   └── game/      @blazon/game    — Heraldry quiz game (WIP, private)
├── tools/
│   └── generator/ @blazon/generator — SVG → registry entry CLI (private)
└── assets/
    └── pl/
        └── city/
            └── warszawa/           — Coat of arms of Warsaw (PL)
```

---

## Quick Start

### Vanilla TypeScript

```bash
pnpm add @blazon/core @blazon/poland @blazon/types
```

**Tree-shakeable static imports** — only the cities you use end up in the bundle:

```ts
import { plWarszawa, plKrakow } from '@blazon/poland';
import { getById, search } from '@blazon/core';
import { polandRegistry } from '@blazon/poland';

// Direct access to a locality
console.log(plWarszawa.name); // 'Herb Warszawy'
console.log(plWarszawa.assets[0].svg); // inline SVG string

// Search across a registry
const results = search(polandRegistry, 'mermaid', { limit: 10 });

// Look up by ID
const warsaw = getById(polandRegistry, 'pl-city-warszawa');
```

### Angular (v16+)

```bash
pnpm add @blazon/ngx @blazon/poland @blazon/types
```

**Provide only what you need — everything else is tree-shaken away:**

```ts
// app.config.ts
import { plWarszawa, plKrakow } from '@blazon/poland';
import { provideBlazonIcons } from '@blazon/ngx';

export const appConfig: ApplicationConfig = {
  providers: [provideBlazonIcons({ plWarszawa, plKrakow })],
};
```

**Or provide the full collection:**

```ts
import { polandRegistry } from '@blazon/poland';
import { provideBlazonIcons } from '@blazon/ngx';

export const appConfig: ApplicationConfig = {
  providers: [provideBlazonIcons(polandRegistry.entries)],
};
```

```ts
// my.component.ts
import { BlazonIcon } from '@blazon/ngx';

@Component({
  imports: [BlazonIcon],
  template: `<blazon-icon id="pl-city-warszawa" [size]="64" />`,
})
export class MyComponent {}
```

---

## Core API

All functions are pure — they take a registry and return results. No singletons.

| Function                                     | Description                                       |
| -------------------------------------------- | ------------------------------------------------- |
| `getById(registry, id)`                      | Look up a locality by unique ID                   |
| `search(registry, query, options?)`          | Full-text search across name, aliases, region     |
| `filterByKind(registry, kind)`               | Filter by locality kind (`'city'`, `'region'`, …) |
| `filterByRegion(registry, region)`           | Filter by region name                             |
| `getAsset(locality, kind)`                   | Get a specific asset (`'arms'`, `'flag'`, …)      |
| `createRegistry(countryCode, name, entries)` | Build a `BlazonCountryRegistry`                   |

---

## Packages

### `@blazon/types`

Zero-runtime TypeScript type definitions.

| Type                    | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `BlazonLocality`        | Primary domain entity — id, name, countryCode, kind, assets, …                                |
| `BlazonAsset`           | An asset within a locality — `{ kind, svg }`                                                  |
| `BlazonAssetKind`       | `'arms' \| 'flag' \| 'seal' \| 'banner' \| 'symbol'`                                          |
| `BlazonLocalityKind`    | `'country' \| 'region' \| 'county' \| 'city' \| 'municipality' \| 'district' \| 'historical'` |
| `BlazonCountryRegistry` | `{ countryCode, name, entries: readonly BlazonLocality[] }`                                   |
| `BlazonLicense`         | SPDX-based license descriptor                                                                 |
| `BlazonSource`          | Source URL reference                                                                          |
| `BlazonSearchOptions`   | `{ limit?, offset? }`                                                                         |
| `BlazonSearchResult`    | `{ items, total, offset, limit }`                                                             |

### `@blazon/core`

Framework-agnostic pure functional API. **No singletons. No side effects.**

```ts
import { getById, search, filterByKind, createRegistry } from '@blazon/core';
```

### `@blazon/poland`

495 Polish city coats of arms as tree-shakeable named exports.

```ts
// Individual localities (tree-shaken)
import { plWarszawa, plKrakow, plWroclaw } from '@blazon/poland';

// Full registry
import { polandRegistry } from '@blazon/poland';

// Pre-filtered collections
import { polandCities, polandCurrentCities, polandHistoricalCities } from '@blazon/poland';
```

Export naming: `pl` prefix + PascalCase city name — e.g. `plWarszawa`, `plAleksandrowKujawski`.

### `@blazon/ngx`

Angular 16+ standalone adapter.

- `provideBlazonIcons(entries)` — accepts `BlazonLocality[]` (array), `Record<string, BlazonLocality>` (map), or `BlazonIconsConfig`
- `BlazonIcon` / `BlazonIconComponent` — standalone `<blazon-icon id="..." [size]="48" [alt]="..." />`
- `BlazonIconsService` — injectable, synchronous lookup from registered entries
- `BLAZON_ICONS_CONFIG_TOKEN`, `BLAZON_ICONS_ENTRIES_TOKEN` — injection tokens for advanced DI

---

## Asset Conventions

Each asset lives in `assets/{cc}/{level}/{slug}/`:

```
assets/pl/city/warszawa/
└── warszawa.svg    # Source SVG (heraldic, accessible markup)
```

### ID convention

`{countryCode}-{kind}-{slug}` — e.g. `pl-city-warszawa`, `pl-region-mazowieckie`

### License

All assets in this repository are licensed as specified per-entry in the `license` field of each `BlazonLocality`. Most Polish city assets are CC BY-SA 3.0 or CC BY-SA 4.0. See each entry for the exact SPDX identifier.

---

## Development

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

### Setup

```bash
git clone https://github.com/blazon-registry/blazon.git
cd blazon
pnpm install
```

### Common commands

```bash
pnpm build          # Build all packages (Turborepo, respects dep graph)
pnpm lint           # ESLint all packages
pnpm format         # Prettier format
pnpm typecheck      # TypeScript across the workspace
```

---

## Architecture

```
@blazon/types       ← Domain language (types only, zero runtime)
      ↑
@blazon/core        ← Pure functions (getById, search, filterByKind, …)
      ↑
@blazon/poland      ← Country data (imports from @blazon/types)
      ↑
@blazon/ngx         ← Angular adapter (imports from @blazon/types)
```

**Design principles:**

- `core` provides pure functions — no singleton, no global state
- Adapters (`ngx`) accept `BlazonLocality[]` or a map — they never load data themselves
- `types` has zero dependencies and zero runtime code
- Country packages are independent — add `@blazon/germany` without touching `core`

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## License

MIT © Blazon Contributors
