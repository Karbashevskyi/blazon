import type {
  BlazonAsset,
  BlazonAssetKind,
  BlazonCountryRegistry,
  BlazonLocality,
  BlazonLocalityKind,
} from '@blazon/types';
import { extractEntries } from './extract-entries.js';

/**
 * Returns all localities matching the given `kind`.
 *
 * @param registry - A single registry, an array of registries, or a flat array of localities.
 * @param kind - The locality kind to filter by.
 */
export function filterByKind(
  registry: BlazonCountryRegistry | readonly BlazonCountryRegistry[] | readonly BlazonLocality[],
  kind: BlazonLocalityKind,
): readonly BlazonLocality[] {
  return extractEntries(registry).filter((e) => e.kind === kind);
}

/**
 * Returns all localities in the specified region.
 *
 * @param registry - A single registry, an array of registries, or a flat array of localities.
 * @param region - The region name to filter by (case-insensitive).
 */
export function filterByRegion(
  registry: BlazonCountryRegistry | readonly BlazonCountryRegistry[] | readonly BlazonLocality[],
  region: string,
): readonly BlazonLocality[] {
  const lower = region.toLowerCase();
  return extractEntries(registry).filter((e) => e.region?.toLowerCase() === lower);
}

/**
 * Retrieves the first asset of the given `kind` from a locality.
 *
 * @param locality - The locality to inspect.
 * @param kind - The asset kind to look for.
 * @returns The matching asset, or `undefined`.
 */
export function getAsset(locality: BlazonLocality, kind: BlazonAssetKind): BlazonAsset | undefined {
  return locality.assets.find((a) => a.kind === kind);
}
