import type { CoatOfArms } from './coat-of-arms.js';

/**
 * A collection of coats of arms for a single country.
 * Countries are the top-level organisational unit of the registry.
 */
export interface CountryRegistry {
  /**
   * ISO 3166-1 alpha-2 country code (uppercase), e.g. "PL", "DE", "GB".
   */
  readonly countryCode: string;

  /** Human-readable country name in English */
  readonly name: string;

  /** All coat of arms entries belonging to this country */
  readonly entries: readonly CoatOfArms[];
}

/**
 * A lazy-loading factory function for a CountryRegistry.
 * Enables code-splitting: each country's data is only fetched on demand.
 */
export type RegistryLoader = () => Promise<CountryRegistry>;
