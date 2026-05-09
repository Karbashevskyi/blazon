/**
 * License information for a heraldic asset.
 */
export interface BlazonLicense {
  readonly spdx: string;
  readonly name: string;
  readonly url: string;
  readonly author?: string;
}

/**
 * Source reference for a heraldic asset.
 */
export interface BlazonSource {
  readonly url: string;
  readonly name?: string;
}
