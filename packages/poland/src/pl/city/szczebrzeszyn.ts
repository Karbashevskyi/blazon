import type { BlazonLocality } from '@blazon/types';

/**
 * Herb Szczebrzeszyn — Polish locality
 * @id pl-city-szczebrzeszyn
 */
const plSzczebrzeszyn: BlazonLocality = {
  id: 'pl-city-szczebrzeszyn',
  name: 'Herb Szczebrzeszyn',
  countryCode: 'PL',
  kind: 'city',
  region: 'Poland',
  aliases: ['poland', 'szczebrzeszyn', 'city'],
  assets: [
    {
      kind: 'arms',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-25.98 -30.46 801.96 948.41"><title>Herb Szczebrzeszyn</title><path d="m.765 87.101 1.572 570.015C12.359 837.94 175.01 965.26 372.967 965.26c204.411 0 370.362-153.31 370.362-342.396L742.593 87.1z" style="fill:#e00101;fill-opacity:1;stroke:#000;stroke-width:7.43563509;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(2.953 -82.431)"/><path d="M44.661 261.099c8.118 39.88 16.436 81.21 22.713 112.006H676.72c6.276-30.797 14.595-72.126 22.712-112.006zm42.936 210.79c7.835 38.444 15.208 74.984 22.401 110.295h524.098c7.193-35.311 14.566-71.85 22.401-110.295zm42.625 209.079c7.961 39.097 15.51 75.657 22.557 110.295h438.537c7.046-34.638 14.595-71.198 22.557-110.295z" style="fill:#fff;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:3.75;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(2.953 -82.431)"/></svg>',
    },
  ],
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  sources: [{ url: 'https://commons.wikimedia.org/wiki/File:POL%20Szczebrzeszyn%20COA.svg' }],
};

export { plSzczebrzeszyn };
