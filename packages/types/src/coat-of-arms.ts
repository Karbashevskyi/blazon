import type { AssetLicense } from './license.js';
import type { CoatMetadata } from './metadata.js';

/**
 * A single coat of arms entry in the Blazon registry.
 * This is the primary domain entity of the system.
 */
export interface CoatOfArms {
  /**
   * Globally unique identifier for this entry.
   * Convention: `{countryCode}-{level}-{slug}`, e.g. "pl-city-warszawa".
   */
  readonly id: string;

  /** Display name of the entity whose arms these are */
  readonly name: string;

  /** Optional prose description of the coat of arms */
  readonly description?: string;

  /**
   * The SVG markup of the coat of arms.
   * Must be a valid, sanitized SVG string.
   */
  readonly svg: string;

  /** Structured heraldic and administrative metadata */
  readonly metadata: CoatMetadata;

  /** License governing the use and redistribution of this asset */
  readonly license: AssetLicense;

  /** Free-form tags for faceted search, e.g. ["mermaid", "capital", "royal"] */
  readonly tags?: readonly string[];
}
