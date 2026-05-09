import type { CoatOfArms, CountryRegistry, RegistryLoader, SearchQuery } from '@blazon/types';
import { search, count } from './search.js';

/**
 * BlazonRegistry is the central domain service of the Blazon system.
 *
 * Responsibilities:
 * - Maintains a map of loaded country registries (in-memory store)
 * - Accepts lazy loaders for on-demand country data fetching
 * - Provides querying across all loaded registries
 * - Deduplicates concurrent loads of the same country
 *
 * This class is a singleton — use `BlazonRegistry.getInstance()`.
 * Framework adapters should delegate to this class, never duplicate its logic.
 */
export class BlazonRegistry {
  private static _instance: BlazonRegistry | null = null;

  private readonly _registries = new Map<string, CountryRegistry>();
  private readonly _loaders = new Map<string, RegistryLoader>();
  private readonly _pendingLoads = new Map<string, Promise<CountryRegistry>>();

  private constructor() {}

  /**
   * Returns the global singleton instance of the registry.
   */
  static getInstance(): BlazonRegistry {
    BlazonRegistry._instance ??= new BlazonRegistry();
    return BlazonRegistry._instance;
  }

  /**
   * Resets the singleton — intended for testing only.
   * @internal
   */
  static _reset(): void {
    BlazonRegistry._instance = null;
  }

  // ─── Registration ──────────────────────────────────────────────────────────

  /**
   * Registers a lazy loader for a country's coat of arms data.
   * The loader is invoked at most once per country; results are cached.
   *
   * @param code - ISO 3166-1 alpha-2 country code (case-insensitive)
   * @param loader - Async factory returning the country's registry data
   */
  registerCountry(code: string, loader: RegistryLoader): void {
    this._loaders.set(normalizeCode(code), loader);
  }

  /**
   * Registers individual coat of arms entries directly (tree-shakeable API).
   * Entries are grouped by country code and stored immediately — no loader
   * needed. Duplicate IDs within a country are ignored.
   *
   * Use this when bundling only the icons you need:
   * @example
   * ```ts
   * import { warsaw } from '@blazon/core';
   * registry.registerEntries([warsaw]);
   * ```
   */
  registerEntries(entries: readonly CoatOfArms[]): void {
    const byCountry = new Map<string, CoatOfArms[]>();
    for (const entry of entries) {
      const code = normalizeCode(entry.metadata.countryCode);
      const bucket = byCountry.get(code) ?? [];
      bucket.push(entry);
      byCountry.set(code, bucket);
    }

    for (const [code, newEntries] of byCountry) {
      const existing = this._registries.get(code);
      if (existing !== undefined) {
        const existingIds = new Set(existing.entries.map((e) => e.id));
        const toAdd = newEntries.filter((e) => !existingIds.has(e.id));
        if (toAdd.length > 0) {
          this._registries.set(code, {
            ...existing,
            entries: [...existing.entries, ...toAdd],
          });
        }
      } else {
        this._registries.set(code, {
          countryCode: code,
          name: code,
          entries: newEntries,
        });
      }
    }
  }

  // ─── Querying ──────────────────────────────────────────────────────────────

  /**
   * Retrieves a single coat of arms by its unique ID.
   * Only searches already-loaded registries.
   *
   * @param id - The unique coat of arms identifier
   * @returns The matching entry, or `undefined` if not found
   */
  getById(id: string): CoatOfArms | undefined {
    for (const registry of this._registries.values()) {
      const found = registry.entries.find((e) => e.id === id);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  /**
   * Searches all loaded registries using the provided query.
   *
   * @param query - Search and filter parameters
   * @returns Matching entries, respecting pagination parameters
   */
  search(query: SearchQuery): readonly CoatOfArms[] {
    const all = this._allLoadedEntries();
    return search(all, query);
  }

  /**
   * Returns the total number of entries matching a query (ignores pagination).
   */
  count(query: Omit<SearchQuery, 'limit' | 'offset'>): number {
    return count(this._allLoadedEntries(), query);
  }

  // ─── Country loading ───────────────────────────────────────────────────────

  /**
   * Returns (and lazily loads if needed) the registry for a given country.
   * Concurrent calls for the same country are deduplicated — the loader
   * is invoked exactly once.
   *
   * @param code - ISO 3166-1 alpha-2 country code (case-insensitive)
   * @returns The country registry, or `undefined` if no loader was registered
   */
  async getCountryRegistry(code: string): Promise<CountryRegistry | undefined> {
    const normalized = normalizeCode(code);

    const cached = this._registries.get(normalized);
    if (cached !== undefined) return cached;

    const pending = this._pendingLoads.get(normalized);
    if (pending !== undefined) return pending;

    const loader = this._loaders.get(normalized);
    if (loader === undefined) return undefined;

    const load = loader().then((registry) => {
      this._registries.set(normalized, registry);
      this._pendingLoads.delete(normalized);
      return registry;
    });

    this._pendingLoads.set(normalized, load);
    return load;
  }

  /**
   * Eagerly pre-loads multiple countries in parallel.
   * Useful for server-side rendering or prefetching.
   *
   * @param codes - Array of ISO 3166-1 alpha-2 country codes
   */
  preload(codes: readonly string[]): Promise<ReadonlyArray<CountryRegistry | undefined>> {
    return Promise.all(codes.map((code) => this.getCountryRegistry(code)));
  }

  // ─── Introspection ─────────────────────────────────────────────────────────

  /** Returns the codes of all currently loaded countries */
  getLoadedCountries(): readonly string[] {
    return [...this._registries.keys()];
  }

  /** Returns the codes of all registered countries (loaded or not) */
  getRegisteredCountries(): readonly string[] {
    return [...this._loaders.keys()];
  }

  /** Returns `true` if a registry has been loaded for the given country code */
  isLoaded(code: string): boolean {
    return this._registries.has(normalizeCode(code));
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private _allLoadedEntries(): readonly CoatOfArms[] {
    return [...this._registries.values()].flatMap((r) => [...r.entries]);
  }
}

function normalizeCode(code: string): string {
  return code.toUpperCase();
}
