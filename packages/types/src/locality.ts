import type { BlazonAsset } from './asset.js';
import type { BlazonLicense, BlazonSource } from './license.js';

/**
 * The administrative or geographic kind of a locality.
 *
 * - `country`      — Nation state
 * - `region`       — Province, state, or voivodeship
 * - `county`       — County or powiat
 * - `city`         — City or town
 * - `municipality` — Municipality, village, or gmina
 * - `district`     — Urban district
 * - `historical`   — Historical entity (no longer exists)
 */
export type BlazonLocalityKind =
  | 'country'
  | 'region'
  | 'county'
  | 'city'
  | 'municipality'
  | 'district'
  | 'historical';

/**
 * A geographic or administrative locality with heraldic assets.
 * This is the primary entity in the Blazon registry.
 */
export interface BlazonLocality {
  readonly id: string;
  readonly name: string;
  readonly localName?: string;
  readonly englishName?: string;
  readonly countryCode: string;
  readonly kind: BlazonLocalityKind;
  readonly region?: string;
  readonly aliases?: readonly string[];
  readonly assets: readonly BlazonAsset[];
  readonly sources?: readonly BlazonSource[];
  readonly license?: BlazonLicense;
}
