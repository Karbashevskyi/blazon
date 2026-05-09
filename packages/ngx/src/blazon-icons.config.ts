/**
 * Configuration options for `provideBlazonIcons()`.
 */
export interface BlazonIconsConfig {
  /**
   * Fallback SVG content rendered when a locality cannot be found.
   * If omitted, the component renders nothing.
   */
  readonly fallbackSvg?: string;
}

/**
 * Injection token key for `BlazonIconsConfig` in Angular's DI tree.
 * @internal
 */
export const BLAZON_ICONS_CONFIG = 'BLAZON_ICONS_CONFIG' as const;
