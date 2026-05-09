import type { CoatOfArms } from '@blazon/types';

/**
 * Herb Krynica Morska — Polish coat of arms (Krynica Morska)
 * @id pl-city-krynica-morska
 */
const krynicaMorska: CoatOfArms = {
  id: 'pl-city-krynica-morska',
  name: 'Herb Krynica Morska',
  description: 'Coat of arms of Krynica Morska (Herb Krynica Morska), a city in Poland.',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-21.23 -24.37 573.15 658.03"><title>Herb Krynica Morska</title><path d="M0 0h530.691L517.66 386.379c-22.828 180.715-163.441 222.043-243.324 222.895-87.738.933-238.348-35.969-259.434-224.754L.008 0" style="stroke:none;fill-rule:evenodd;fill:#222"/><path d="M11.176 9.965h508.347l-12.484 373.742C485.172 558.512 350.48 598.488 273.961 599.309c-84.047.898-228.313-34.793-248.508-217.406L11.188 9.961zM136.18 371.227l4.562-115.778h-4.898v-17.062l15.726-13.047 15.055 13.047v17.062h-4.891l4.223 89.008-27.773 44.168H52.188q1.335-5.187 6.69-9.031c.556-3.234-.554-6.801 1.673-9.703 14.5-16.281 50.418.89 75.625 1.336zm349.8 13.933h-48.628l4.5-16.207c27.203-3.187 45.484-.238 44.128 16.207" style="stroke:none;fill-rule:evenodd;fill:#11b1ee"/><path d="M165.84 341.824c42.512-68.476 82.094-139.3 118.246-212.867-77.41-7.82-131.5 24.735-164.531 66.75-29.516 37.539-51.684 96.762-28.246 168.102 14.73 2.117 31.347 7.176 44.875 7.414l4.562-115.778h-4.898v-17.062l15.726-13.047 15.055 13.047v17.062h-4.891l4.098 86.379zm239.703-137.07c8.687 11.262 15.43 25.52 20.551 38.57l-29.035 57.621c3.894-30.918 8.171-65.277 8.484-96.191m-33.898-35.848c-15.602 33.985-32.43 67.969-49.817 101.954 6.879-39.254 9.559-85.317 13.762-125.239 13.418 5.309 26.207 12.617 36.055 23.285" style="stroke:none;fill-rule:evenodd;fill:#f48628"/><path d="M325.582 57.344a2205 2205 0 0 1-99.047 200.773c-36.359 65.141-77.41 127.825-119.125 190.067 49.524 27.394 97.711 41.785 147.235 22.754 58.808-110.098 75.062-271.364 70.937-413.598zm-5.355 234.242c28.218-50.023 54.32-103.23 78.968-158.613-1.004 133.07-18.179 237.027-54.879 305.847-19.628 10.485-41.714 8.7-64.918 1.336 19.297-47.629 32.235-97.375 40.825-148.574zm46.398 124.481c9.504-27.141 19.344-54.469 25.211-87.672 22.07-35.68 40.582-72.789 56.652-110.875 1.309 76.129-11.117 152.402-36.125 198.972-16.597 7.285-31.543 5.493-45.738-.422" style="stroke:none;fill-rule:evenodd;fill:#fffdfd"/></svg>',
  metadata: {
    countryCode: 'PL',
    type: 'municipal',
    level: 'city',
    region: 'Poland',
    city: 'Krynica Morska',
    updatedAt: '2026-05-08',
  },
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:POL%20Krynica%20Morska%20COA.svg',
  },
  tags: ['poland', 'krynica-morska', 'city'],
} as const;

export { krynicaMorska };
