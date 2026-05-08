import type { RegistryLoader } from '@blazon/types';

/**
 * Configuration options for `provideBlazonIcons()`.
 */
export interface BlazonIconsConfig {
  /**
   * Country loaders to register at bootstrap time.
   * These are lazy — they are only invoked when the corresponding
   * country is first requested.
   *
   * @example
   * ```ts
   * provideBlazonIcons({
   *   loaders: {
   *     PL: () => import('@blazon/data-pl'),
   *     DE: () => import('@blazon/data-de'),
   *   },
   * });
   * ```
   */
  readonly loaders?: Record<string, RegistryLoader>;

  /**
   * Country codes to eagerly pre-load after the application bootstraps.
   * Useful for server-side rendering or eliminating loading states for
   * known-needed countries.
   */
  readonly preload?: readonly string[];

  /**
   * Fallback SVG content rendered when a coat of arms cannot be found.
   * If omitted, the component renders an empty `<span>`.
   */
  readonly fallbackSvg?: string;

  /**
   * Base URL for fetching country registry JSON files via HTTP.
   * Only used when `createFetchLoader` is used internally.
   * Defaults to `/registries/`.
   */
  readonly registriesBaseUrl?: string;
}

/**
 * Injection token key used to provide `BlazonIconsConfig` in Angular's DI tree.
 * @internal
 */
export const BLAZON_ICONS_CONFIG = 'BLAZON_ICONS_CONFIG' as const;
