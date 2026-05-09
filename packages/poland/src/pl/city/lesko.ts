import type { BlazonLocality } from '@blazon/types';

/**
 * Herb Lesko — Polish locality
 * @id pl-city-lesko
 */
const plLesko: BlazonLocality = {
  id: 'pl-city-lesko',
  name: 'Herb Lesko',
  countryCode: 'PL',
  kind: 'city',
  region: 'Poland',
  aliases: ['poland', 'lesko', 'city'],
  assets: [
    {
      kind: 'arms',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497.5 615"><title>Herb Lesko</title><path d="M495.337 2.203v322.37c-4.165 155.214-34.153 275.444-246.567 288.216C36.355 600.017 6.368 479.787 2.203 324.572V2.202z" style="fill:#f60503;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:4.40519619;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M87.858 61.196V42.12l9.36 4.538V29.215l-9.36 3.971 4.538-10.778H75.732l4.538 10.778-9.36-3.971v17.444l9.36-4.538v17.16z" style="fill:#e6b169;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" transform="translate(-4.045 -8.626)scale(2.9368)"/><path d="M50.772 53.892v24.393c18.815-.473 22.88 3.31 23.258 10.778v50.772c.757 21.651 19.099 25.717 47.368 24.96v-25.244c-14.654.568-21.367-1.063-22.69-13.614V81.689c-.663-25.292-20.896-27.75-47.936-27.797z" style="fill:#fff;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" transform="translate(-4.045 -8.626)scale(2.9368)"/></svg>',
    },
  ],
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  sources: [{ url: 'https://commons.wikimedia.org/wiki/File:POL%20Lesko%20COA.svg' }],
};

export { plLesko };
