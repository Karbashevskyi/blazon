/**
 * Describes the license under which a heraldic asset is distributed.
 * Uses SPDX identifiers for machine-readable license identification.
 *
 * @see https://spdx.org/licenses/
 */
export interface AssetLicense {
  /** SPDX license identifier, e.g. "CC0-1.0", "CC-BY-SA-4.0", "MIT" */
  readonly spdx: string;
  /** Human-readable license name */
  readonly name: string;
  /** URL to the full license text */
  readonly url: string;
  /** Original author or rights holder, if applicable */
  readonly author?: string;
  /** URL to the original source of the asset */
  readonly source?: string;
}
