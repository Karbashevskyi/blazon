/**
 * @blazon/ngx
 *
 * Angular adapter for the Blazon heraldry registry.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideBlazonIcons } from '@blazon/ngx';
 * import { plWarszawa, plKrakow } from '@blazon/poland';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideBlazonIcons({ plWarszawa, plKrakow }),
 *   ],
 * };
 *
 * // component.ts
 * import { BlazonIconComponent } from '@blazon/ngx';
 *
 * @Component({
 *   imports: [BlazonIconComponent],
 *   template: `<blazon-icon id="pl-city-warszawa" [size]="48" />`,
 * })
 * export class MyComponent {}
 * ```
 *
 * @packageDocumentation
 */

export { provideBlazonIcons } from './provide-blazon-icons.js';
export { BlazonIcon as BlazonIconComponent } from './blazon-icon.component.js';
export {
  BlazonIconsService,
  BLAZON_ICONS_CONFIG_TOKEN,
  BLAZON_ICONS_ENTRIES_TOKEN,
} from './blazon-icons.service.js';
export { type BlazonIconsConfig } from './blazon-icons.config.js';
