/**
 * @blazon/poland
 *
 * Tree-shakeable exports for all Polish locality heraldic data.
 * Import individual localities or the full collection.
 *
 * @example
 * ```ts
 * // Tree-shakeable: only Warsaw and Kraków end up in the bundle
 * import { plWarszawa, plKrakow } from '@blazon/poland';
 *
 * // Full collection (use for lazy-loading scenarios)
 * import { polandRegistry, polandCities } from '@blazon/poland';
 * ```
 *
 * @packageDocumentation
 */

export * from './pl/index.js';
export { polandCurrentCities } from './pl/current.js';
export { polandHistoricalCities } from './pl/historical.js';
