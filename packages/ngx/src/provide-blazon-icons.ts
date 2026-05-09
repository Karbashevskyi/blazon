import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import type { CoatOfArms } from '@blazon/types';
import { BlazonIconsService, BLAZON_ICONS_CONFIG_TOKEN, BLAZON_ICONS_ENTRIES_TOKEN } from './blazon-icons.service.js';
import type { BlazonIconsConfig } from './blazon-icons.config.js';

/**
 * Provides the Blazon icons infrastructure in an Angular application.
 *
 * **Array API (tree-shakeable):** Pass individual coat of arms entries.
 * Only the icons you import will be included in the bundle.
 *
 * @example
 * ```ts
 * import { warsaw, krakow } from '@blazon/core';
 * import { provideBlazonIcons } from '@blazon/ngx';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideBlazonIcons([warsaw, krakow])],
 * };
 * ```
 *
 * **Config API (lazy loaders):** Pass a config object to register lazy
 * country loaders. Registries are fetched on demand.
 *
 * @example
 * ```ts
 * import { provideBlazonIcons } from '@blazon/ngx';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideBlazonIcons({
 *       loaders: {
 *         PL: () => fetch('/registries/pl.json').then(r => r.json()),
 *       },
 *       preload: ['PL'],
 *     }),
 *   ],
 * };
 * ```
 */
export function provideBlazonIcons(
  iconsOrConfig?: CoatOfArms[] | BlazonIconsConfig,
): EnvironmentProviders {
  if (Array.isArray(iconsOrConfig)) {
    // Tree-shakeable path: static icon array
    return makeEnvironmentProviders([
      { provide: BLAZON_ICONS_CONFIG_TOKEN, useValue: {} as BlazonIconsConfig },
      { provide: BLAZON_ICONS_ENTRIES_TOKEN, useValue: iconsOrConfig, multi: true },
      BlazonIconsService,
    ]);
  }

  // Config object path: lazy loaders
  return makeEnvironmentProviders([
    { provide: BLAZON_ICONS_CONFIG_TOKEN, useValue: iconsOrConfig ?? {} },
    BlazonIconsService,
  ]);
}
