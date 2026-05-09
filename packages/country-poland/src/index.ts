/**
 * @blazon/country-poland
 *
 * Tree-shakeable exports for all Polish city coats of arms.
 * Import individual cities or the full collection.
 *
 * @example
 * ```ts
 * // Tree-shakeable: only Warsaw and Kraków end up in the bundle
 * import { warszawa, krakow } from '@blazon/country-poland';
 *
 * // Full collection (not tree-shakeable, use for lazy-loading scenarios)
 * import { plCities } from '@blazon/country-poland';
 * ```
 *
 * @packageDocumentation
 */

export * from './pl/index.js';
export { plCurrentCities } from './pl/current.js';
export { plHistoricalCities } from './pl/historical.js';
