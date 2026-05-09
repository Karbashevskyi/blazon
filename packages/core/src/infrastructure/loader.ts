import type { CountryRegistry } from '@blazon/types';
import { assertCoatOfArms } from '../domain/validation.js';

/**
 * Options for `fetchCountryRegistry`.
 */
export interface FetchOptions {
  /**
   * Base URL from which country JSON files are resolved.
   * Defaults to `/registries/`.
   */
  readonly baseUrl?: string;

  /**
   * Custom fetch implementation (e.g. for testing or SSR environments).
   * Defaults to the global `fetch`.
   */
  readonly fetcher?: typeof fetch;
}

/**
 * Creates a `RegistryLoader` that fetches a country's registry JSON from a URL.
 *
 * This is the standard infrastructure-level loader for browser and Node.js
 * environments. Each entry in the returned registry is validated on load.
 *
 * @example
 * ```ts
 * registry.registerCountry('PL', createFetchLoader('PL', {
 *   baseUrl: '/assets/registries/',
 * }));
 * ```
 */
export function createFetchLoader(
  countryCode: string,
  options: FetchOptions = {},
): () => Promise<CountryRegistry> {
  const { baseUrl = '/registries/', fetcher = fetch } = options;
  const normalized = countryCode.toUpperCase();
  const url = `${baseUrl}${normalized.toLowerCase()}.json`;

  return async (): Promise<CountryRegistry> => {
    const response = await fetcher(url);

    if (!response.ok) {
      throw new Error(
        `Failed to load registry for country "${normalized}": HTTP ${String(response.status)} from ${url}`,
      );
    }

    const data: unknown = await response.json();

    return parseCountryRegistry(data, normalized);
  };
}

/**
 * Parses and validates a raw JSON payload as a `CountryRegistry`.
 * Throws a descriptive error for any invalid entry.
 */
export function parseCountryRegistry(raw: unknown, context = ''): CountryRegistry {
  if (raw === null || typeof raw !== 'object') {
    throw new Error(`${context}: Registry must be a non-null object`);
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.countryCode !== 'string') {
    throw new Error(`${context}: Registry must have a string "countryCode" field`);
  }

  if (typeof obj.name !== 'string') {
    throw new Error(`${context}: Registry must have a string "name" field`);
  }

  if (!Array.isArray(obj.entries)) {
    throw new Error(`${context}: Registry "entries" must be an array`);
  }

  const entries = obj.entries as unknown[];

  for (const [i, entry] of entries.entries()) {
    assertCoatOfArms(entry, `${context}.entries[${String(i)}]`);
  }

  return obj as unknown as CountryRegistry;
}
