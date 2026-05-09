import type { BlazonLocality } from '@blazon/types';

/**
 * Herb Stryków — Polish locality
 * @id pl-city-strykow
 */
const plStrykow: BlazonLocality = {
  id: 'pl-city-strykow',
  name: 'Herb Stryków',
  countryCode: 'PL',
  kind: 'city',
  region: 'Poland',
  aliases: ['poland', 'strykow', 'city'],
  assets: [
    {
      kind: 'arms',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-25.98 -30.46 801.96 948.41"><title>Herb Stryków</title><path d="M3.718 4.67 5.29 574.684C15.312 755.508 177.963 882.83 375.92 882.83c204.411 0 370.362-153.31 370.362-342.396L745.546 4.67z" style="fill:#075cd6;fill-opacity:1;stroke:#000;stroke-width:7.43563509;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m-233.357 97.88-51.41-13.207-14.268 51.126-14.268-51.126-51.41 13.207 37.142-37.92-37.142-37.918 51.41 13.206 14.268-51.125 14.268 51.125 51.41-13.206L-270.5 59.96z" style="opacity:1;fill:#fffd26;fill-opacity:1;stroke:#000;stroke-width:1.10500038;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(1389.824 104.273)scale(3.39366)"/><path d="M375.265 768.497c-196.982 0-375.313-233.807-259.938-433.231-8.404 192.547 116.14 302.574 259.636 302.574s268.04-110.027 259.635-302.574c115.376 199.424-62.352 433.23-259.333 433.23z" style="fill:#fffd26;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:3.75;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></svg>',
    },
  ],
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  sources: [{ url: 'https://commons.wikimedia.org/wiki/File:POL%20Stryk%C3%B3w%20COA.svg' }],
};

export { plStrykow };
