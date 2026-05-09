/**
 * Normalizes a search query string for consistent matching.
 * Lowercases, strips diacritics, and collapses whitespace.
 */
export function normalizeQuery(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
