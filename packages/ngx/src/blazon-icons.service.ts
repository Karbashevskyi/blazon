import { Injectable, inject, InjectionToken } from '@angular/core';
import type { BlazonLocality } from '@blazon/types';
import type { BlazonIconsConfig } from './blazon-icons.config.js';

/**
 * Angular injection token for the `BlazonIconsConfig`.
 * Provided via `provideBlazonIcons()`.
 */
export const BLAZON_ICONS_CONFIG_TOKEN = new InjectionToken<BlazonIconsConfig>(
  'BLAZON_ICONS_CONFIG',
);

/**
 * Angular injection token for statically-registered `BlazonLocality` entries.
 * Using `multi: true` so multiple `provideBlazonIcons()` calls merge cleanly.
 */
export const BLAZON_ICONS_ENTRIES_TOKEN = new InjectionToken<readonly BlazonLocality[][]>(
  'BLAZON_ICONS_ENTRIES',
);

/**
 * Angular service that manages heraldic locality icons in the Angular DI system.
 *
 * This service stores registered localities in an in-memory Map and provides
 * fast lookup by ID. It does NOT manage async loading — all entries must be
 * registered up front via `provideBlazonIcons()`.
 */
@Injectable()
export class BlazonIconsService {
  private readonly _entries = new Map<string, BlazonLocality>();
  private readonly _config = inject(BLAZON_ICONS_CONFIG_TOKEN);
  private readonly _staticEntries = inject(BLAZON_ICONS_ENTRIES_TOKEN, { optional: true }) ?? [];

  constructor() {
    for (const batch of this._staticEntries) {
      for (const entry of batch) {
        this._entries.set(entry.id, entry);
      }
    }
  }

  /**
   * Retrieves a locality by its registry ID.
   *
   * @param id - Locality identifier, e.g. `"pl-city-warszawa"`
   * @returns The matching locality, or `undefined` if not registered.
   */
  getById(id: string): BlazonLocality | undefined {
    return this._entries.get(id);
  }

  /**
   * Returns the configured fallback SVG, or `null` if none was provided.
   */
  get fallbackSvg(): string | null {
    return this._config.fallbackSvg ?? null;
  }
}
