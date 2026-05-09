import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import type { BlazonLocality } from '@blazon/types';
import {
  BlazonIconsService,
  BLAZON_ICONS_CONFIG_TOKEN,
  BLAZON_ICONS_ENTRIES_TOKEN,
} from './blazon-icons.service.js';
import type { BlazonIconsConfig } from './blazon-icons.config.js';

/**
 * Provides the Blazon icons infrastructure in an Angular application.
 *
 * Accepts localities as a named-export map (tree-shakeable), a flat array,
 * or a config object for global options.
 *
 * @example Named-export map (recommended — tree-shakeable)
 * ```ts
 * import { plWarszawa, plKrakow } from '@blazon/poland';
 * import { provideBlazonIcons } from '@blazon/ngx';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideBlazonIcons({ plWarszawa, plKrakow })],
 * };
 * ```
 *
 * @example Array API
 * ```ts
 * import { plWarszawa, plKrakow } from '@blazon/poland';
 *
 * providers: [provideBlazonIcons([plWarszawa, plKrakow])]
 * ```
 *
 * @example Config object (for global fallback SVG)
 * ```ts
 * providers: [provideBlazonIcons({ fallbackSvg: '<svg>...</svg>' })]
 * ```
 */
export function provideBlazonIcons(
  iconsOrConfig?: BlazonLocality[] | Record<string, BlazonLocality> | BlazonIconsConfig,
): EnvironmentProviders {
  let entries: BlazonLocality[] = [];
  let config: BlazonIconsConfig = {};

  if (Array.isArray(iconsOrConfig)) {
    entries = iconsOrConfig;
  } else if (iconsOrConfig != null && isLocalityMap(iconsOrConfig)) {
    entries = Object.values(iconsOrConfig);
  } else if (iconsOrConfig != null) {
    config = iconsOrConfig;
  }

  return makeEnvironmentProviders([
    { provide: BLAZON_ICONS_CONFIG_TOKEN, useValue: config },
    ...(entries.length > 0
      ? [{ provide: BLAZON_ICONS_ENTRIES_TOKEN, useValue: entries, multi: true }]
      : []),
    BlazonIconsService,
  ]);
}

function isLocalityMap(v: object): v is Record<string, BlazonLocality> {
  const values = Object.values(v);
  if (values.length === 0) return false;
  const first: unknown = values[0];
  return typeof first === 'object' && first !== null && 'assets' in first && 'countryCode' in first;
}
