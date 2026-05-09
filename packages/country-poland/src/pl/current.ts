import type { CoatOfArms } from '@blazon/types';
import { plCities } from './index.js';

/** Present-day Polish cities only (excludes cities now in other countries). */
export const plCurrentCities: readonly CoatOfArms[] = plCities.filter(
  (c) => !c.metadata.currentCountryCode
);
