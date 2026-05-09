import { Injectable, inject, InjectionToken, type OnDestroy } from '@angular/core';
import type { CoatOfArms, CountryRegistry } from '@blazon/types';
import { BlazonRegistry } from '@blazon/core';
import type { BlazonIconsConfig } from './blazon-icons.config.js';

/**
 * Angular injection token for the `BlazonIconsConfig`.
 * Provided via `provideBlazonIcons()`.
 */
export const BLAZON_ICONS_CONFIG_TOKEN = new InjectionToken<BlazonIconsConfig>(
  'BLAZON_ICONS_CONFIG',
);

/**
 * Angular injection token for statically-registered `CoatOfArms` entries.
 * Each call to `provideBlazonIcons([...])` contributes a batch.
 * Using `multi: true` so multiple providers merge cleanly.
 */
export const BLAZON_ICONS_ENTRIES_TOKEN = new InjectionToken<readonly CoatOfArms[][]>(
  'BLAZON_ICONS_ENTRIES',
);

/**
 * Angular service that wraps `BlazonRegistry` for use in the Angular DI system.
 *
 * This service is the single point of contact between Angular components
 * and the framework-agnostic core. It does NOT implement any business logic —
 * all logic lives in `@blazon/core`.
 *
 * Provided in root scope via `provideBlazonIcons()`.
 */
@Injectable()
export class BlazonIconsService implements OnDestroy {
  private readonly _registry = BlazonRegistry.getInstance();
  private readonly _config = inject(BLAZON_ICONS_CONFIG_TOKEN);
  private readonly _staticEntries = inject(BLAZON_ICONS_ENTRIES_TOKEN, { optional: true }) ?? [];

  constructor() {
    // Register statically-provided icons (tree-shakeable array API)
    const flat = this._staticEntries.flat();
    if (flat.length > 0) {
      this._registry.registerEntries(flat);
    }

    // Register all configured country loaders
    const { loaders = {} } = this._config;
    for (const [code, loader] of Object.entries(loaders)) {
      this._registry.registerCountry(code, loader);
    }

    // Eagerly pre-load configured countries (fire-and-forget)
    const { preload = [] } = this._config;
    if (preload.length > 0) {
      void this._registry.preload(preload);
    }
  }

  /**
   * Resolves a coat of arms by ID, loading the country registry on demand.
   *
   * If the country registry for the entry's country code is not yet loaded,
   * this method triggers the registered loader first.
   *
   * @param id - Coat of arms identifier, e.g. "pl-city-warszawa"
   * @returns A promise resolving to the entry, or `undefined` if not found
   */
  async resolve(id: string): Promise<CoatOfArms | undefined> {
    // Fast path: check if already loaded
    const immediate = this._registry.getById(id);
    if (immediate !== undefined) return immediate;

    // Derive the country code from the ID convention: {cc}-{level}-{slug}
    const countryCode = deriveCountryCode(id);
    if (countryCode !== undefined) {
      await this._registry.getCountryRegistry(countryCode);
      return this._registry.getById(id);
    }

    return undefined;
  }

  /**
   * Returns the fallback SVG from config, or `null` if none was provided.
   */
  get fallbackSvg(): string | null {
    return this._config.fallbackSvg ?? null;
  }

  /**
   * Loads and returns the full registry for the given country code.
   */
  getCountryRegistry(code: string): Promise<CountryRegistry | undefined> {
    return this._registry.getCountryRegistry(code);
  }

  /**
   * Returns all currently loaded country codes.
   */
  getLoadedCountries(): readonly string[] {
    return this._registry.getLoadedCountries();
  }

  ngOnDestroy(): void {
    // No subscriptions or timers to clean up.
    // The BlazonRegistry singleton outlives individual Angular instances
    // (intentional for SSR re-use across requests).
  }
}

/**
 * Derives the ISO 3166-1 country code from a Blazon ID.
 * Convention: the first segment before the first `-` is the lowercase country code.
 *
 * @example deriveCountryCode('pl-city-warszawa') → 'PL'
 */
function deriveCountryCode(id: string): string | undefined {
  const segment = id.split('-')[0];
  if (segment.length !== 2) return undefined;
  return segment.toUpperCase();
}
