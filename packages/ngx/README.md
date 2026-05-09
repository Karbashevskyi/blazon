# @blazon/ngx

> Angular 16+ adapter for the Blazon heraldry registry.
> Provides `provideBlazonIcons()` and the standalone `<blazon-icon>` component.

## Requirements

- Angular ≥ 16
- `@blazon/core` ≥ 0.1.0

## Install

```bash
pnpm add @blazon/ngx @blazon/core @blazon/country-poland @blazon/types
```

## Setup

### Option 1 — Tree-shakeable static imports (recommended for known icons)

Import only the cities you need. Everything else is tree-shaken out of the bundle:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { warszawa, krakow, wroclaw } from '@blazon/country-poland';
import { provideBlazonIcons } from '@blazon/ngx';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlazonIcons([warszawa, krakow, wroclaw]),
  ],
};
```

### Option 2 — Lazy HTTP loader (for large or dynamic collections)

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideBlazonIcons } from '@blazon/ngx';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlazonIcons({
      // Lazy loaders — invoked at most once per country
      loaders: {
        PL: () => fetch('/registries/pl.json').then(r => r.json()),
        DE: () => import('./registries/de').then(m => m.default),
      },
      // Eagerly pre-load on bootstrap (optional)
      preload: ['PL'],
      // SVG shown when an ID is not found (optional)
      fallbackSvg: '<svg>...</svg>',
    }),
  ],
};
```

## `<blazon-icon>` Component

```ts
import { BlazonIconComponent } from '@blazon/ngx';

@Component({
  imports: [BlazonIconComponent],
  template: `
    <!-- Basic usage -->
    <blazon-icon id="pl-city-warszawa" />

    <!-- With explicit size and accessible label -->
    <blazon-icon id="pl-city-warszawa" [size]="64" alt="Warsaw coat of arms" />

    <!-- CSS custom property for responsive sizing -->
    <blazon-icon id="pl-city-warszawa" style="--blazon-size: 3rem" />
  `,
})
export class MyComponent {}
```

### Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Registry ID, e.g. `"pl-city-warszawa"` |
| `alt` | `string` | — | Accessible label (`aria-label`). Defaults to the entry's `name`. |
| `size` | `number` | — | Pixel size applied to width and height. |

## `BlazonIconsService`

Access the service directly for programmatic use:

```ts
import { inject } from '@angular/core';
import { BlazonIconsService } from '@blazon/ngx';

@Injectable()
export class MyService {
  private readonly blazon = inject(BlazonIconsService);

  async getWarsaw() {
    return this.blazon.resolve('pl-city-warsaw');
  }
}
```

## Architecture notes

- `BlazonIconsService` is a thin Angular wrapper — no business logic
- All registry logic lives in `@blazon/core`
- The component uses `ChangeDetectionStrategy.OnPush` and Angular signals
- SVG content is sanitized via Angular's `DomSanitizer` before rendering
