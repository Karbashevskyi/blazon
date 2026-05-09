import type { BlazonCountryRegistry, BlazonLocality } from '@blazon/types';
import { extractEntries } from './extract-entries.js';

/**
 * Looks up a single locality by its unique ID.
 *
 * @param registry - A single registry, an array of registries, or a flat array of localities.
 * @param id - The locality ID, e.g. `"pl-city-warszawa"`.
 * @returns The matching locality, or `undefined` if not found.
 */
export function getById(
  registry: BlazonCountryRegistry | readonly BlazonCountryRegistry[] | readonly BlazonLocality[],
  id: string,
): BlazonLocality | undefined {
  return extractEntries(registry).find((e) => e.id === id);
}
