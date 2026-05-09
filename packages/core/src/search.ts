import type { BlazonCountryRegistry, BlazonLocality, BlazonSearchOptions } from '@blazon/types';
import { extractEntries } from './extract-entries.js';
import { normalizeQuery } from './normalize-query.js';

function matchesQuery(locality: BlazonLocality, normalized: string): boolean {
  if (normalizeQuery(locality.name).includes(normalized)) return true;
  if (locality.localName && normalizeQuery(locality.localName).includes(normalized)) return true;
  if (locality.englishName && normalizeQuery(locality.englishName).includes(normalized))
    return true;
  if (locality.region && normalizeQuery(locality.region).includes(normalized)) return true;
  if (locality.aliases?.some((a) => normalizeQuery(a).includes(normalized))) return true;
  if (locality.id.includes(normalized.replace(/\s+/g, '-'))) return true;
  return false;
}

/**
 * Searches localities by a text query with optional pagination.
 *
 * @param registry - A single registry, an array of registries, or a flat array of localities.
 * @param query - The search query string.
 * @param options - Optional pagination: `limit` and `offset`.
 * @returns A filtered and optionally paginated array of localities.
 */
export function search(
  registry: BlazonCountryRegistry | readonly BlazonCountryRegistry[] | readonly BlazonLocality[],
  query: string,
  options?: BlazonSearchOptions,
): readonly BlazonLocality[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return extractEntries(registry);
  const matched = extractEntries(registry).filter((e) => matchesQuery(e, normalized));
  const { offset = 0, limit = matched.length } = options ?? {};
  return matched.slice(offset, offset + limit);
}
