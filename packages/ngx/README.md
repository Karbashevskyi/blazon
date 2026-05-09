# @blazon/ngx

> Angular adapter for the Blazon heraldry registry. Angular 16+.

Part of the [Blazon](https://github.com/blazon-registry/blazon) monorepo.

---

## Installation

```bash
pnpm add @blazon/ngx @blazon/poland @blazon/types
```

---

## Setup

### 1. Provide icons

In `app.config.ts`, register the localities you want to use:

```ts
import { provideBlazonIcons } from '@blazon/ngx';
import { plWarszawa, plKrakow, plWroclaw } from '@blazon/poland';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlazonIcons({ plWarszawa, plKrakow, plWroclaw }),
  ],
};
```

`provideBlazonIcons` accepts:
- `BlazonLocality[]` — an array
- `Record<string, BlazonLocality>` — a map (named imports object)
- `BlazonIconsConfig` — config object with optional `fallbackSvg`

### 2. Use the component

```ts
import { BlazonIcon } from '@blazon/ngx';

@Component({
  standalone: true,
  imports: [BlazonIcon],
  template: `
    <blazon-icon id="pl-city-warszawa" [size]="64" />
    <blazon-icon id="pl-city-krakow" alt="Coat of arms of Kraków" />
  `,
})
export class MyComponent {}
```

---

## API

### `provideBlazonIcons(entries)`

Registers localities in Angular's DI system. Call once in `app.config.ts` or a feature module.

### `<blazon-icon>`

| Input | Type | Description |
|-------|------|-------------|
| `id` | `string` (required) | Locality ID, e.g. `"pl-city-warszawa"` |
| `size` | `number` | Pixel size applied as `width` and `height` |
| `alt` | `string` | Accessible label (`aria-label`). Defaults to `locality.name` |

### `BlazonIconsService`

Injectable service with synchronous access to registered localities:

```ts
import { BlazonIconsService } from '@blazon/ngx';

@Injectable()
export class MyService {
  private readonly icons = inject(BlazonIconsService);

  getSvg(id: string): string | undefined {
    return this.icons.getById(id)?.assets.find(a => a.kind === 'arms')?.svg;
  }
}
```

---

## Full collection example

```ts
import { polandRegistry } from '@blazon/poland';
import { provideBlazonIcons } from '@blazon/ngx';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlazonIcons(polandRegistry.entries),
  ],
};
```

---

## Peer dependencies

| Package | Version |
|---------|---------|
| `@angular/core` | `>=16.0.0` |
| `@angular/common` | `>=16.0.0` |
| `@angular/platform-browser` | `>=16.0.0` |
