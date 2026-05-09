import type { BlazonLocality } from '@blazon/types';
import { polandCities } from './index.js';

/** Historically Polish localities (kind === 'historical'). */
export const polandHistoricalCities: readonly BlazonLocality[] = polandCities.filter(
  (c) => c.kind === 'historical',
);
