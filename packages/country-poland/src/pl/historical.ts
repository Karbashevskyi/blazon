import type { CoatOfArms } from '@blazon/types';
import { plCities } from './index.js';

/** Historically Polish cities now located in other countries. */
export const plHistoricalCities: readonly CoatOfArms[] = plCities.filter(
  (c) => !!c.metadata.currentCountryCode
);
