/**
 * @blazon/core
 *
 * Framework-agnostic Blazon heraldry registry core.
 * Provides the registry singleton, search engine, validation layer,
 * and lazy-loading infrastructure.
 *
 * @example
 * ```ts
 * import { getRegistry, registerCountry, getById, search } from '@blazon/core';
 *
 * registerCountry('PL', () => import('./data/pl.json'));
 *
 * const warsaw = await getById('pl-city-warszawa');
 * const cities = search({ countryCode: 'PL', level: 'city' });
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

export { createFetchLoader, parseCountryRegistry, type FetchOptions } from './infrastructure/loader.js';

// ─── Polish coat of arms ───────────────────────────────────────────────────
//
// Tree-shakeable exports: import individual cities or the full collection.
//
// @example
// ```ts
// import { warsaw } from '@blazon/core';
// import { plCities } from '@blazon/core';
// ```

export * from './pl/index.js';

// ─── Convenience facade ────────────────────────────────────────────────────
//
// These module-level functions delegate to the global singleton registry.
// They are the recommended public API for most consumers.

import type { CoatOfArms, CountryRegistry, RegistryLoader, SearchQuery } from '@blazon/types';
import { BlazonRegistry } from './domain/registry.js';

/**
 * Returns the global `BlazonRegistry` singleton.
 * Use the module-level helpers (`getById`, `search`, etc.) in most cases.
 */
export function getRegistry(): BlazonRegistry {
  return BlazonRegistry.getInstance();
}

/**
 * Registers a lazy loader for a country's data against the global registry.
 *
 * @param code - ISO 3166-1 alpha-2 country code
 * @param loader - Async factory that resolves to the country's registry data
 */
export function registerCountry(code: string, loader: RegistryLoader): void {
  BlazonRegistry.getInstance().registerCountry(code, loader);
}

/**
 * Retrieves a coat of arms by ID from already-loaded registries.
 *
 * @param id - The unique coat of arms identifier
 */
export function getById(id: string): CoatOfArms | undefined {
  return BlazonRegistry.getInstance().getById(id);
}

/**
 * Searches all loaded registries using the given query.
 *
 * @param query - Search filters and pagination options
 */
export function searchRegistry(query: SearchQuery): readonly CoatOfArms[] {
  return BlazonRegistry.getInstance().search(query);
}

/**
 * Loads and returns the registry for a given country.
 * Triggers the registered loader if the country has not been loaded yet.
 *
 * @param code - ISO 3166-1 alpha-2 country code
 */
export function getCountryRegistry(code: string): Promise<CountryRegistry | undefined> {
  return BlazonRegistry.getInstance().getCountryRegistry(code);
}
