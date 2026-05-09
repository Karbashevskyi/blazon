import type { BlazonLocality } from '@blazon/types';

/**
 * Herb Dąbrowa Tarnowska — Polish locality
 * @id pl-city-dabrowa-tarnowska
 */
const plDabrowaTarnowska: BlazonLocality = {
  id: 'pl-city-dabrowa-tarnowska',
  name: 'Herb Dąbrowa Tarnowska',
  countryCode: 'PL',
  kind: 'city',
  region: 'Poland',
  aliases: ['poland', 'dabrowa-tarnowska', 'city'],
  assets: [
    {
      kind: 'arms',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22.00 -28.71 593.94 775.17"><title>Herb Dąbrowa Tarnowska</title><path d="M0 .004h549.945v303.055l-1.863 34.07c-15.887 145.887-132.437 259.766-273.105 259.766-140.664 0-257.22-113.875-273.11-259.766l-1.863-34.07V0" style="stroke:none;fill-rule:evenodd;fill:#222"/><path d="M8.258 7.516h195.789v190.793H8.257zm331.644 0h201.782v190.793H339.902zm200.082 326.648-.105 1.996C527 455.043 445.875 552.102 339.906 580.758V334.164h200.082zM204.051 579.063C101.027 548.426 22.707 452.801 10.071 336.164l-.106-1.996h194.09v244.895" style="stroke:none;fill-rule:evenodd;fill:#ec2a32"/></svg>',
    },
  ],
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  sources: [
    { url: 'https://commons.wikimedia.org/wiki/File:POL%20D%C4%85browa%20Tarnowska%20COA.svg' },
  ],
};

export { plDabrowaTarnowska };
