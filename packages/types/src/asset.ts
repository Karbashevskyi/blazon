/**
 * Represents the visual asset kind for a heraldic entity.
 *
 * - `arms`   — Coat of arms (most common)
 * - `flag`   — Flag or banner variant
 * - `seal`   — Official seal or stamp
 * - `banner` — Heraldic banner
 * - `symbol` — Other official symbol
 */
export type BlazonAssetKind = 'arms' | 'flag' | 'seal' | 'banner' | 'symbol';

/**
 * A single visual asset (SVG) associated with a locality.
 */
export interface BlazonAsset {
  readonly kind: BlazonAssetKind;
  readonly svg: string;
}
