# @blazon/types

> TypeScript domain types for the Blazon heraldry registry — zero runtime code, zero dependencies.

## Install

```bash
pnpm add @blazon/types
```

## Exports

| Type                    | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `BlazonLocality`        | Primary domain entity — id, name, countryCode, kind, assets, …                                |
| `BlazonAsset`           | An asset within a locality — `{ kind, svg }`                                                  |
| `BlazonAssetKind`       | `'arms' \| 'flag' \| 'seal' \| 'banner' \| 'symbol'`                                          |
| `BlazonLocalityKind`    | `'country' \| 'region' \| 'county' \| 'city' \| 'municipality' \| 'district' \| 'historical'` |
| `BlazonCountryRegistry` | `{ countryCode, name, entries: readonly BlazonLocality[] }`                                   |
| `BlazonLicense`         | SPDX-based license descriptor — `{ spdx, name, url, author? }`                                |
| `BlazonSource`          | Source URL reference — `{ url, name? }`                                                       |
| `BlazonSearchOptions`   | `{ limit?, offset? }`                                                                         |
| `BlazonSearchResult<T>` | `{ items, total, offset, limit }`                                                             |

## Example

```ts
import type { BlazonLocality, BlazonLocalityKind, BlazonCountryRegistry } from '@blazon/types';

const kind: BlazonLocalityKind = 'city';

const locality: BlazonLocality = {
  id: 'pl-city-warszawa',
  name: 'Herb Warszawy',
  countryCode: 'PL',
  kind: 'city',
  region: 'Mazowieckie',
  assets: [{ kind: 'arms', svg: '<svg>…</svg>' }],
  license: {
    spdx: 'CC-BY-SA-3.0',
    name: 'Creative Commons',
    url: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
};
```

This package contains **only type declarations**. No JavaScript is emitted.
