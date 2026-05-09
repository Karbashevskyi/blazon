import type { BlazonCountryRegistry, BlazonLocality } from '@blazon/types';

/**
 * Creates a `BlazonCountryRegistry` from a country code, name, and list of localities.
 *
 * @param countryCode - ISO 3166-1 alpha-2 code (uppercase), e.g. `"PL"`.
 * @param name - Human-readable country name in English, e.g. `"Poland"`.
 * @param entries - The localities to include in the registry.
 */
export function createRegistry(
  countryCode: string,
  name: string,
  entries: readonly BlazonLocality[],
): BlazonCountryRegistry {
  return { countryCode, name, entries };
}
