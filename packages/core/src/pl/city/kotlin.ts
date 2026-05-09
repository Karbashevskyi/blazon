import type { CoatOfArms } from '@blazon/types';

/**
 * Herb Kotlin — Polish coat of arms (Kotlin)
 * @id pl-city-kotlin
 */
const kotlin: CoatOfArms = {
  id: 'pl-city-kotlin',
  name: 'Herb Kotlin',
  description: 'Coat of arms of Kotlin (Herb Kotlin), a city in Poland.',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-21.99 -4.62 801.98 1129.50"><title>Herb Kotlin</title><path d="M749.378 37.213H8.622s-.1 76.38-.91 324.376C37.622 748.847 221.792 953.784 379 1083.042c157.207-129.258 341.378-334.195 371.287-721.453-.81-247.997-.91-324.376-.91-324.376z" style="fill:#de5a39;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:7.4257431px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" transform="translate(-4 -33.5)"/><path d="M380.207 581.427c-118.624 0-151.785 93.834-156.503 201.485-82.531-1.865 23.48.88-73.727 0-3.542-169.478 74.417-227.164 186.366-274.429 3.873-135.166 2.048-266.236 2.048-266.236l-106.342 124.32-120.376-3.11L379 69.837l267.326 293.62-120.376 3.11-106.342-124.32s-1.825 131.07 2.048 266.236c111.949 47.265 189.908 104.951 186.366 274.429-97.207.88 8.804-1.865-73.727 0-1.835-107.651-35.463-201.485-154.088-201.485" style="fill:#f7f7ee;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:7.4257431px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" transform="translate(-4 -33.5)"/></svg>',
  metadata: {
    countryCode: 'PL',
    type: 'municipal',
    level: 'city',
    region: 'Poland',
    city: 'Kotlin',
    updatedAt: '2026-05-08',
  },
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:POL%20Kotlin%20COA.svg',
  },
  tags: ['poland', 'kotlin', 'city'],
} as const;

export { kotlin };
