import type { BlazonLocality } from './locality.js';

/**
 * Options for searching and filtering localities.
 */
export interface BlazonSearchOptions {
  readonly limit?: number;
  readonly offset?: number;
}

/**
 * Paginated result set returned from a search query.
 */
export interface BlazonSearchResult {
  readonly items: readonly BlazonLocality[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
}
