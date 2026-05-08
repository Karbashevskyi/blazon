# @blazon/core

> Framework-agnostic Blazon heraldry registry engine.

## Install

```bash
pnpm add @blazon/core @blazon/types
```

## API

### Module-level helpers (recommended)

```ts
import {
  registerCountry,
  getCountryRegistry,
  getById,
  searchRegistry,
  getRegistry,
} from '@blazon/core';

// Register a lazy country loader
registerCountry('PL', () => fetch('/registries/pl.json').then(r => r.json()));

// Load on demand (cached after first call)
const registry = await getCountryRegistry('PL');

// Get by ID (from already-loaded registries)
const coat = getById('pl-city-warsaw');

// Search with filters and pagination
const results = searchRegistry({
  countryCode: 'PL',
  level: 'city',
  text: 'mermaid',
  limit: 10,
  offset: 0,
});
```

### BlazonRegistry singleton

```ts
import { getRegistry } from '@blazon/core';

const registry = getRegistry();
registry.preload(['PL', 'DE']);
console.log(registry.getLoadedCountries());
```

### Validation

```ts
import { validateCoatOfArms, isCoatOfArms, assertCoatOfArms } from '@blazon/core';

// Returns { valid, errors[] }
const result = validateCoatOfArms(unknownData);

// Type guard
if (isCoatOfArms(unknownData)) { /* narrowed to CoatOfArms */ }

// Throws with descriptive message if invalid
assertCoatOfArms(unknownData, 'loading pl.json');
```

### HTTP loader

```ts
import { createFetchLoader } from '@blazon/core';

registerCountry('PL', createFetchLoader('PL', {
  baseUrl: '/assets/registries/',
}));
```

## Architecture

`@blazon/core` is structured with DDD-inspired layers:

```
src/
├── domain/
│   ├── registry.ts      BlazonRegistry singleton
│   ├── search.ts        Pure search functions
│   └── validation.ts    Schema validation
└── infrastructure/
    └── loader.ts        HTTP loader factory
```

No DOM, no framework, no side effects at module load time.
