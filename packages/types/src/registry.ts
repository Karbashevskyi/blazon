import type { BlazonLocality } from './locality.js';

/**
 * A collection of heraldic localities for a single country.
 */
export interface BlazonCountryRegistry {
  readonly countryCode: string;
  readonly name: string;
  readonly entries: readonly BlazonLocality[];
}
