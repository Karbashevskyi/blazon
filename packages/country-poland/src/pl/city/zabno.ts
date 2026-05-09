import type { CoatOfArms } from '@blazon/types';

/**
 * Herb Żabno — Polish coat of arms (Żabno)
 * @id pl-city-zabno
 */
const zabno: CoatOfArms = {
  id: 'pl-city-zabno',
  name: 'Herb Żabno',
  description: 'Coat of arms of Żabno (Herb Żabno), a city in Poland.',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-68.45 -22.09 630.06 631.32"><title>Herb Żabno</title><path d="M251.598 585.852c136.056 0 250.302-134.802 250.302-251.856V1.296H1.296v332.7c0 117.054 114.247 251.856 250.302 251.856z" style="fill:#0172b8;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:2.59264135;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M411.73 70.801H220.504V45.926h191.224c15.05 0 14.425 24.875 0 24.875z" style="fill:#f9cf00;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:2.59264135;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M270.254 41.718H121.006v164.795h200.552s.974-38.652-113.49-54.414c-35.074-4.83-38.867-77.733-38.867-77.733h80.843c6.128-3.996 10.834-6.907 10.174-16.436-.66-9.532 10.156-9.953 10.036-16.212z" style="fill:#fff;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:2.59264135;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M55.71 93.022c0 281.593 382.449 283.476 382.449 0 100.113 373.626-483.273 376.28-382.45 0z" style="fill:#f9cf00;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:2.59264135;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m28.108 64.762 5.955.725 2.49-5.457 2.35 5.519 5.97-.572-3.605 4.794 3.48 4.885-5.953-.725-2.49 5.457-2.35-5.519-5.97.572 3.604-4.794z" style="fill:#f9cf00;fill-opacity:1;stroke:#000;stroke-width:.3359724;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(-32.624 -56.243)scale(7.71683)"/></svg>',
  metadata: {
    countryCode: 'PL',
    type: 'municipal',
    level: 'city',
    region: 'Poland',
    city: 'Żabno',
    updatedAt: '2026-05-08',
  },
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:POL%20%C5%BBabno%20COA.svg',
  },
  tags: ['poland', 'zabno', 'city'],
} as const;

export { zabno };
