/**
 * @blazon/ngx
 *
 * Angular adapter for the Blazon heraldry registry.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideBlazonIcons } from '@blazon/ngx';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideBlazonIcons({
 *       loaders: { PL: () => import('./data/pl.registry').then(m => m.default) },
 *     }),
 *   ],
 * };
 *
 * // component.ts
 * import { BlazonIcon } from '@blazon/ngx';
 *
 * @Component({
 *   imports: [BlazonIcon],
 *   template: `<blazon-icon id="pl-city-warszawa" [size]="48" />`,
 * })
 * export class MyComponent {}
 * ```
 *
 * @packageDocumentation
 */

export { provideBlazonIcons } from './provide-blazon-icons.js';
export { BlazonIcon } from './blazon-icon.component.js';
/** @deprecated Use `BlazonIcon` instead */
export { BlazonIcon as BlazonIconComponent } from './blazon-icon.component.js';
export { BlazonIconsService, BLAZON_ICONS_CONFIG_TOKEN, BLAZON_ICONS_ENTRIES_TOKEN } from './blazon-icons.service.js';
export { type BlazonIconsConfig } from './blazon-icons.config.js';
