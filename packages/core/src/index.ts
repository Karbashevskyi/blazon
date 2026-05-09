/**
 * @blazon/core
 *
 * Framework-agnostic, functional API for the Blazon heraldry registry.
 * All functions are pure — no singletons, no global state.
 *
 * Country-specific data lives in separate packages:
 *   - Poland → `@blazon/poland`
 *
 * @example
 * ```ts
 * import { getById, search, filterByKind } from '@blazon/core';
 * import { polandRegistry } from '@blazon/poland';
 *
 * const warsaw = getById(polandRegistry, 'pl-city-warszawa');
 * const cities = filterByKind(polandRegistry, 'city');
 * const results = search(polandRegistry, 'kraków');
 * ```
 *
 * @packageDocumentation
 */

export { getById } from './get-by-id.js';
export { search } from './search.js';
export { filterByKind, filterByRegion, getAsset } from './filter.js';
export { createRegistry } from './create-registry.js';
export { normalizeQuery } from './normalize-query.js';
