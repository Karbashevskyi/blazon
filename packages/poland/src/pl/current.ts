import type { BlazonLocality } from '@blazon/types';
import { polandCities } from './index.js';

/** Present-day Polish localities (excludes historical entries). */
export const polandCurrentCities: readonly BlazonLocality[] = polandCities.filter(
  (c) => c.kind !== 'historical',
);
