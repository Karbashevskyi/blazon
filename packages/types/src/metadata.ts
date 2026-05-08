import type { AdministrativeLevel, CoatType, HeraldricTincture } from './tinctures.js';

/**
 * Structured metadata describing a coat of arms in heraldic and administrative terms.
 */
export interface CoatMetadata {
  /**
   * ISO 3166-1 alpha-2 country code (uppercase), e.g. "PL", "DE", "GB".
   * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  readonly countryCode: string;

  /** Classification of the entity the coat represents */
  readonly type: CoatType;

  /** Administrative level of the entity */
  readonly level: AdministrativeLevel;

  /** Name of the region or state within the country, if applicable */
  readonly region?: string;

  /** Name of the city or municipality, if applicable */
  readonly city?: string;

  /** Verbal blazon — the heraldic textual description of the arms */
  readonly blazon?: string;

  /** Dominant tinctures appearing in the arms */
  readonly colors?: readonly HeraldricTincture[];

  /** ISO 8601 date when this entry was first added to the registry */
  readonly createdAt?: string;

  /** ISO 8601 date when this entry was last updated */
  readonly updatedAt?: string;
}
