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

- A **universal core** (`@blazon/core`) with lazy country loading, full-text search, and validation
- **Typed domain models** (`@blazon/types`) with zero runtime overhead
- An **Angular adapter** (`@blazon/ngx`) with a standalone `<blazon-icon>` component
- A **generator CLI** (`@blazon/generator`) that converts SVG files into registry entries
- A growing **asset library** (`assets/`) of CC0-licensed heraldic SVGs

---

## Monorepo Structure

```
blazon/
├── packages/
│   ├── types/          @blazon/types    — TypeScript domain types (zero runtime)
│   ├── core/           @blazon/core     — Framework-agnostic registry engine
│   └── ngx/            @blazon/ngx      — Angular standalone adapter
├── apps/
│   └── docs/           @blazon/docs     — Interactive documentation (Vite)
├── tools/
│   └── generator/      @blazon/generator — SVG → registry JSON CLI
└── assets/
    └── pl/
        └── city/
            └── warszawa/                — Coat of arms of Warsaw (PL)
```

---

## Quick Start

### Vanilla JavaScript / TypeScript

```bash
pnpm add @blazon/core @blazon/types
```

```ts
import { registerCountry, getCountryRegistry, getById, searchRegistry } from '@blazon/core';

// Register a lazy loader for Poland
registerCountry('PL', () => fetch('/registries/pl.json').then(r => r.json()));

// Load on demand
const registry = await getCountryRegistry('PL');
console.log(`${registry?.entries.length} entries loaded`);

// Find by ID
const warsaw = getById('pl-city-warsaw');

// Search with filters
const cities = searchRegistry({ countryCode: 'PL', level: 'city', limit: 10 });
```

### Angular

```bash
pnpm add @blazon/ngx @blazon/core @blazon/types
```

```ts
// app.config.ts
import { provideBlazonIcons } from '@blazon/ngx';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlazonIcons({
      loaders: {
        PL: () => fetch('/registries/pl.json').then(r => r.json()),
      },
      preload: ['PL'],
    }),
  ],
};
```

```ts
// my.component.ts
import { BlazonIconComponent } from '@blazon/ngx';

@Component({
  standalone: true,
  imports: [BlazonIconComponent],
  template: `<blazon-icon id="pl-city-warsaw" [size]="64" />`,
})
export class MyComponent {}
```

---

## Core API

| Function | Description |
|----------|-------------|
| `registerCountry(code, loader)` | Register a lazy loader for a country's registry data |
| `getCountryRegistry(code)` | Load and return a country's full registry (async, cached) |
| `getById(id)` | Retrieve a coat of arms by unique ID from loaded registries |
| `searchRegistry(query)` | Search all loaded registries with filter + pagination |
| `getRegistry()` | Access the global `BlazonRegistry` singleton directly |

### Search Query

```ts
import type { SearchQuery } from '@blazon/types';

const query: SearchQuery = {
  text: 'mermaid',        // full-text across name, description, blazon
  countryCode: 'PL',      // ISO 3166-1 alpha-2 (case-insensitive)
  level: 'city',          // 'national' | 'state' | 'county' | 'city' | 'district' | 'village'
  type: 'municipal',      // 'national' | 'regional' | 'municipal' | 'historical' | 'ecclesiastical' | 'other'
  tags: ['capital'],      // all tags must match (AND)
  limit: 20,
  offset: 0,
};
```

---

## Packages

### `@blazon/types`

Zero-runtime TypeScript type definitions. All exports are `type`-only.

| Type | Description |
|------|-------------|
| `CoatOfArms` | Primary domain entity — id, name, svg, metadata, license, tags |
| `CountryRegistry` | A country's collection of coats of arms |
| `CoatMetadata` | Heraldic and administrative metadata |
| `AssetLicense` | SPDX-based license descriptor |
| `SearchQuery` | Search and filter parameters |
| `RegistryLoader` | Lazy factory: `() => Promise<CountryRegistry>` |

### `@blazon/core`

Framework-agnostic registry engine.

- `BlazonRegistry` — singleton with full CRUD and search
- `search()` / `count()` — pure search functions
- `validateCoatOfArms()` / `assertCoatOfArms()` / `isCoatOfArms()` — validation layer
- `createFetchLoader()` — HTTP loader for browser/Node.js
- `parseCountryRegistry()` — validates registry JSON at load time

### `@blazon/ngx`

Angular 19+ standalone adapter.

- `provideBlazonIcons(config)` — `EnvironmentProviders` factory for root/feature providers
- `BlazonIconComponent` — standalone `<blazon-icon>` with signal-based loading state
- `BlazonIconsService` — injectable wrapper around `BlazonRegistry`

---

## Asset Conventions

Each asset lives in `assets/{cc}/{level}/{slug}/`:

```
assets/pl/city/warszawa/
├── warszawa.svg           # Source SVG (heraldic, accessible markup)
├── warszawa.meta.json     # Sidecar metadata (GeneratorInput)
└── index.json             # Generated registry entry (do not edit manually)
```

### ID convention

`{countryCode}-{level}-{slug}` — e.g. `pl-city-warsaw`, `de-national`, `gb-county-kent`

### License

All assets in this repository are released under **CC0-1.0** unless noted otherwise in the sidecar `meta.json`. SVGs derived from third-party sources must carry the original source URL.

---

## Generator CLI

```bash
# Dry-run (preview output)
pnpm exec tsx tools/generator/bin/generate.ts assets/pl/city

# Write index.json files
pnpm exec tsx tools/generator/bin/generate.ts --write assets/pl/city

# Generate a full country bundle
pnpm exec tsx tools/generator/bin/generate.ts \
  --write \
  --bundle dist/registries/pl.json \
  --country PL \
  --country-name Poland \
  assets/pl
```

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
pnpm build          # Build all packages
pnpm dev            # Start all dev servers / watchers
pnpm typecheck      # Run TypeScript across the workspace
pnpm lint           # ESLint all packages
pnpm format         # Prettier format
pnpm test           # Run all tests
```

### Adding a new coat of arms

1. Create the folder: `assets/{cc}/{level}/{slug}/`
2. Add `{slug}.svg` — clean, accessible SVG markup
3. Add `{slug}.meta.json` — sidecar metadata (see [Generator CLI](#generator-cli))
4. Run: `pnpm exec tsx tools/generator/bin/generate.ts --write assets/{cc}`
5. Verify the generated `index.json`
6. Open a pull request with the SVG, meta, and generated JSON

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## Architecture

Blazon follows clean DDD-inspired boundaries:

```
@blazon/types       ← Domain language (types only, no logic)
      ↑
@blazon/core        ← Domain logic (registry, search, validation, loading)
      ↑
@blazon/ngx         ← Framework adapter (Angular DI, components — no business logic)
```

**Rules:**
- Adapters (`ngx`, future `react`, `vue`) import from `core` but never duplicate logic
- `core` imports from `types` only
- `types` has zero dependencies

---

## Contributing

Contributions are very welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## License

MIT © Blazon Contributors

Heraldic assets may carry individual licenses — see each entry's `license` field and the sidecar `meta.json`.
