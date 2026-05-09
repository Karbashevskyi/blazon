# @blazon/core

> Framework-agnostic pure functional API for the Blazon heraldry registry.

Country data lives in separate packages (e.g. [`@blazon/poland`](../poland)).

---

## Installation

```bash
pnpm add @blazon/core @blazon/types
```

---

## Usage

```ts
import { getById, search, filterByKind, filterByRegion, createRegistry } from '@blazon/core';
import { polandRegistry } from '@blazon/poland';

// Look up by ID
const warsaw = getById(polandRegistry, 'pl-city-warszawa');
console.log(warsaw?.name); // 'Herb Warszawy'

// Full-text search
const results = search(polandRegistry, 'mermaid', { limit: 10 });

// Filter by locality kind
const cities = filterByKind(polandRegistry, 'city');

// Filter by region
const mazovian = filterByRegion(polandRegistry, 'Mazowieckie');
```

### Tree-shaking with `@blazon/poland`

```ts
import { plWarszawa, plKrakow } from '@blazon/poland';

const svg = plWarszawa.assets.find((a) => a.kind === 'arms')?.svg;
```

### Building a custom registry

```ts
import { createRegistry } from '@blazon/core';
import type { BlazonLocality } from '@blazon/types';

const myLocalities: BlazonLocality[] = [
  /* … */
];
const registry = createRegistry('DE', 'Germany', myLocalities);
```

---

## API

| Function         | Signature                                              | Description                    |
| ---------------- | ------------------------------------------------------ | ------------------------------ |
| `getById`        | `(registry, id) → BlazonLocality \| undefined`         | Look up by unique ID           |
| `search`         | `(registry, query, options?) → BlazonLocality[]`       | Full-text search               |
| `filterByKind`   | `(registry, kind) → BlazonLocality[]`                  | Filter by locality kind        |
| `filterByRegion` | `(registry, region) → BlazonLocality[]`                | Filter by region name          |
| `getAsset`       | `(locality, kind) → BlazonAsset \| undefined`          | Get a specific asset           |
| `createRegistry` | `(countryCode, name, entries) → BlazonCountryRegistry` | Build a registry               |
| `normalizeQuery` | `(value) → string`                                     | Lowercase + strip diacritics   |
| `extractEntries` | `(registry) → BlazonLocality[]`                        | Flatten registry to flat array |

All functions are **pure** — no global state, no singletons.

---

## Source layout

```
src/
├── get-by-id.ts        getById()
├── search.ts           search() + matchesQuery()
├── filter.ts           filterByKind(), filterByRegion(), getAsset()
├── create-registry.ts  createRegistry()
├── normalize-query.ts  normalizeQuery()
├── extract-entries.ts  extractEntries()
└── index.ts            barrel exports
```
