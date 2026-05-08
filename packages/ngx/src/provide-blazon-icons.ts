import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { BlazonIconsService, BLAZON_ICONS_CONFIG_TOKEN } from './blazon-icons.service.js';
import type { BlazonIconsConfig } from './blazon-icons.config.js';

/**
 * Provides the Blazon icons infrastructure in an Angular application.
 *
 * Call this in `app.config.ts` (standalone) or in the root `AppModule` providers.
 * It registers the `BlazonIconsService` and injects the configuration into
 * Angular's DI system.
 *
 * The actual `BlazonRegistry` singleton is initialised inside the service
 * constructor, ensuring loaders are registered before any component renders.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideBlazonIcons } from '@blazon/ngx';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideBlazonIcons({
 *       loaders: {
 *         PL: () => import('./data/pl.registry').then(m => m.default),
 *       },
 *       preload: ['PL'],
 *       fallbackSvg: '<svg>...</svg>',
 *     }),
 *   ],
 * };
 * ```
 */
export function provideBlazonIcons(config: BlazonIconsConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: BLAZON_ICONS_CONFIG_TOKEN,
      useValue: config,
    },
    BlazonIconsService,
  ]);
}
