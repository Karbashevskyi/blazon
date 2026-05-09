# @blazon/poland

> 495 Polish city coats of arms as tree-shakeable named exports.

Part of the [Blazon](https://github.com/blazon-registry/blazon) monorepo.

---

## Installation

```bash
pnpm add @blazon/poland @blazon/types
```

---

## Usage

### Individual localities (tree-shaken)

Import only the cities you need — everything else is excluded from the bundle:

```ts
import { plWarszawa, plKrakow, plWroclaw, plPoznan } from '@blazon/poland';

console.log(plWarszawa.name);                          // 'Herb Warszawy'
console.log(plWarszawa.id);                            // 'pl-city-warszawa'
const svg = plWarszawa.assets.find(a => a.kind === 'arms')?.svg;
```

### Full collection

Use `polandCities` when you need all 495 entries:

```ts
import { polandCities } from '@blazon/poland';

console.log(polandCities.length); // 495
```

### Registry object

Use `polandRegistry` with `@blazon/core` pure functions:

```ts
import { polandRegistry } from '@blazon/poland';
import { search, filterByKind, getById } from '@blazon/core';

const results = search(polandRegistry, 'mermaid');
const cities  = filterByKind(polandRegistry, 'city');
const warsaw  = getById(polandRegistry, 'pl-city-warszawa');
```

### Pre-filtered collections

```ts
import { polandCurrentCities, polandHistoricalCities } from '@blazon/poland';

// Current cities (kind !== 'historical')
console.log(polandCurrentCities.length);

// Historical entries only (kind === 'historical')
console.log(polandHistoricalCities.length);
```

### With `@blazon/ngx` (Angular)

```ts
import { plWarszawa, plKrakow } from '@blazon/poland';
import { provideBlazonIcons } from '@blazon/ngx';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlazonIcons({ plWarszawa, plKrakow }),
  ],
};
```

---

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `plWarszawa`, `plKrakow`, … | `BlazonLocality` | Individual localities (495 total) |
| `polandRegistry` | `BlazonCountryRegistry` | Full registry object |
| `polandCities` | `readonly BlazonLocality[]` | Flat array of all 495 entries |
| `polandCurrentCities` | `readonly BlazonLocality[]` | Non-historical entries |
| `polandHistoricalCities` | `readonly BlazonLocality[]` | Historical entries only |

### Naming convention

`pl` prefix + PascalCase locality name:

- `plWarszawa` → Warsaw
- `plKrakow` → Kraków
- `plAleksandrowKujawski` → Aleksandrów Kujawski
