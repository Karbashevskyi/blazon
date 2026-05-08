import type { AdministrativeLevel, CoatType } from './tinctures.js';

/**
 * Query parameters for searching the Blazon registry.
 * All fields are optional and are combined with AND logic.
 */
export interface SearchQuery {
  /** Full-text search across name, description, and blazon fields */
  readonly text?: string;

  /**
   * Filter by ISO 3166-1 alpha-2 country code (case-insensitive).
   * Only entries from the specified country will be returned.
   */
  readonly countryCode?: string;

  /** Filter by coat of arms classification type */
  readonly type?: CoatType;

  /** Filter by administrative level */
  readonly level?: AdministrativeLevel;

  /**
   * Filter by tags — all specified tags must be present (AND semantics).
   * Tags are case-sensitive.
   */
  readonly tags?: readonly string[];

  /** Maximum number of results to return. Defaults to unlimited. */
  readonly limit?: number;

  /** Number of results to skip before returning. Defaults to 0. */
  readonly offset?: number;
}

/**
 * Paginated result wrapper for search operations.
 */
export interface SearchResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number | null;
}
