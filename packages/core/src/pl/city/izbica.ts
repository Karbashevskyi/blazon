import type { CoatOfArms } from '@blazon/types';

/**
 * Herb Izbica — Polish coat of arms (Izbica)
 * @id pl-city-izbica
 */
const izbica: CoatOfArms = {
  id: 'pl-city-izbica',
  name: 'Herb Izbica',
  description: 'Coat of arms of Izbica (Herb Izbica), a city in Poland.',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 876.2"><title>Herb Izbica</title><path d="M3.713 4.925v526.983h.427C19.084 831.863 205.912 719.037 375 871.325c170.38-155.014 358.89-39.329 371.287-347.971l-1.925-518.43z" style="fill:#fff;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:7.42574263;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m221.031 41.5 128.75 309.75L40.375 222.594V530.5l308.969-128.406L221.03 710.75h307.907L400.625 402.031l309 128.469V222.594L400.188 351.25 528.938 41.5z" style="fill:#e42020;fill-opacity:1;stroke:#000;stroke-width:3.75;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></svg>',
  metadata: {
    countryCode: 'PL',
    type: 'municipal',
    level: 'city',
    region: 'Poland',
    city: 'Izbica',
    updatedAt: '2026-05-08',
  },
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:POL%20Izbica%20COA.svg',
  },
  tags: ['poland', 'izbica', 'city'],
} as const;

export { izbica };
