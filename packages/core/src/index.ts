/**
 * @blazon/core
 *
 * Framework-agnostic Blazon heraldry registry core.
 * Provides the registry singleton, search engine, validation layer,
 * and lazy-loading infrastructure.
 *
 * Country-specific data lives in separate packages:
 *   - Poland → `@blazon/country-poland`
 *
 * @example
 * ```ts
 * import { registerCountry, getById, searchRegistry } from '@blazon/core';
 * import { warszawa, krakow } from '@blazon/country-poland';
 *
 * registerCountry('PL', () => fetch('/registries/pl.json').then(r => r.json()));
 * const warsaw = getById('pl-city-warszawa');
 * const cities = searchRegistry({ countryCode: 'PL', level: 'city' });
 * ```
 *
 * @packageDocumentation
 */

// ─── Domain ────────────────────────────────────────────────────────────────

export { BlazonRegistry } from './domain/registry.js';
export { search, count } from './domain/search.js';
export {
  validateCoatOfArms,
  isCoatOfArms,
  assertCoatOfArms,
  type ValidationResult,
  type ValidationError,
} from './domain/validation.js';

// ─── Infrastructure ────────────────────────────────────────────────────────

export {
  createFetchLoader,
  parseCountryRegistry,
  type FetchOptions,
} from './infrastructure/loader.js';

// ─── Convenience facade ────────────────────────────────────────────────────
//
// Module-level functions that delegate to the global singleton registry.

import type { CoatOfArms, CountryRegistry, RegistryLoader, SearchQuery } from '@blazon/types';
import { BlazonRegistry } from './domain/registry.js';

/**
 * Returns the global `BlazonRegistry` singleton.
 */
export function getRegistry(): BlazonRegistry {
  return BlazonRegistry.getInstance();
}

/**
 * Registers a lazy loader for a country's data against the global registry.
 */
export function registerCountry(code: string, loader: RegistryLoader): void {
  BlazonRegistry.getInstance().registerCountry(code, loader);
}

/**
 * Retrieves a coat of arms by ID from already-loaded registries.
 */
export function getById(id: string): CoatOfArms | undefined {
  return BlazonRegistry.getInstance().getById(id);
}

/**
 * Searches all loaded registries using the given query.
 */
export function searchRegistry(query: SearchQuery): readonly CoatOfArms[] {
  return BlazonRegistry.getInstance().search(query);
}

/**
 * Loads and returns the registry for a given country.
 * Triggers the registered loader if the country has not been loaded yet.
 */
export function getCountryRegistry(code: string): Promise<CountryRegistry | undefined> {
  return BlazonRegistry.getInstance().getCountryRegistry(code);
}
