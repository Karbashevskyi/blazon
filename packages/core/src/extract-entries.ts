import type { BlazonCountryRegistry } from '@blazon/types';
import type { BlazonLocality } from '@blazon/types';

export function extractEntries(
  registry: BlazonCountryRegistry | readonly BlazonCountryRegistry[] | readonly BlazonLocality[],
): readonly BlazonLocality[] {
  if (Array.isArray(registry)) {
    const arr = registry as readonly (BlazonCountryRegistry | BlazonLocality)[];
    if (arr.length === 0) return [];
    if ('entries' in arr[0]) {
      return (arr as readonly BlazonCountryRegistry[]).flatMap((r) => r.entries);
    }
    return arr as readonly BlazonLocality[];
  }
  return (registry as BlazonCountryRegistry).entries;
}
