# @blazon/types

> TypeScript domain types for the Blazon heraldry registry — zero runtime code, zero dependencies.

## Install

```bash
pnpm add @blazon/types
```

## Exports

| Type                  | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `CoatOfArms`          | Primary domain entity                                |
| `CountryRegistry`     | A country's collection of coats of arms              |
| `RegistryLoader`      | Lazy factory: `() => Promise<CountryRegistry>`       |
| `CoatMetadata`        | Heraldic and administrative metadata                 |
| `AssetLicense`        | SPDX-based license descriptor                        |
| `SearchQuery`         | Search and filter parameters                         |
| `SearchResult<T>`     | Paginated result wrapper                             |
| `CoatType`            | `'national' \| 'regional' \| 'municipal' \| ...`     |
| `AdministrativeLevel` | `'national' \| 'state' \| 'county' \| 'city' \| ...` |
| `HeraldricTincture`   | Classic heraldic colours and metals                  |

## Example

```ts
import type { CoatOfArms, SearchQuery, CoatMetadata } from '@blazon/types';

const query: SearchQuery = {
  countryCode: 'PL',
  level: 'city',
  text: 'mermaid',
  limit: 20,
};
```

This package contains **only type declarations**. No JavaScript is emitted.
