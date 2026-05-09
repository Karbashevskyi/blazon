import type { CoatOfArms } from '@blazon/types';
import type { SearchQuery } from '@blazon/types';

/**
 * Performs in-memory search over a collection of coats of arms.
 * Pure function — no side effects, no external dependencies.
 *
 * All filter conditions are combined with AND logic.
 * An empty query returns all entries (minus pagination).
 */
export function search(entries: readonly CoatOfArms[], query: SearchQuery): readonly CoatOfArms[] {
  let results: readonly CoatOfArms[] = entries;

  if (query.countryCode !== undefined) {
    const code = query.countryCode.toUpperCase();
    results = results.filter((e) => e.metadata.countryCode.toUpperCase() === code);
  }

  if (query.type !== undefined) {
    const { type } = query;
    results = results.filter((e) => e.metadata.type === type);
  }

  if (query.level !== undefined) {
    const { level } = query;
    results = results.filter((e) => e.metadata.level === level);
  }

  if (query.tags !== undefined && query.tags.length > 0) {
    const { tags } = query;
    results = results.filter((e) => tags.every((tag) => e.tags?.includes(tag) ?? false));
  }

  if (query.text !== undefined && query.text.length > 0) {
    const term = query.text.toLowerCase();
    results = results.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        (e.description?.toLowerCase().includes(term) ?? false) ||
        (e.metadata.blazon?.toLowerCase().includes(term) ?? false),
    );
  }

  const total = results.length;
  const offset = query.offset ?? 0;
  const limit = query.limit ?? total;

  return results.slice(offset, offset + limit);
}

/**
 * Returns the total count of matching results without slicing.
 * Useful for building pagination metadata.
 */
export function count(
  entries: readonly CoatOfArms[],
  query: Omit<SearchQuery, 'limit' | 'offset'>,
): number {
  return search(entries, query).length;
}
