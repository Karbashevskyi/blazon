import type { BlazonLocality } from '@blazon/types';

/**
 * Herb Grodzisk Mazowiecki — Polish locality
 * @id pl-city-grodzisk-mazowiecki
 */
const plGrodziskMazowiecki: BlazonLocality = {
  id: 'pl-city-grodzisk-mazowiecki',
  name: 'Herb Grodzisk Mazowiecki',
  countryCode: 'PL',
  kind: 'city',
  region: 'Poland',
  aliases: ['poland', 'grodzisk-mazowiecki', 'city'],
  assets: [
    {
      kind: 'arms',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22.66 -30.79 611.72 831.22"><title>Herb Grodzisk Mazowiecki</title><path d="M566.407 0v394.383c0 375.262-566.407 375.266-566.407 0V0z" style="stroke:none;fill-rule:evenodd;fill:#222"/><path d="M558.633 8.418v383.59c0 364.992-550.856 364.992-550.856 0V8.418z" style="stroke:none;fill-rule:evenodd;fill:#ec2a32"/><path d="M91.5 261.551 284.466 70.836l190.902 190.79h-83.582l-94.176-151 19.36 199.64h-68.621l23.05-199.66-97.863 150.945zm0 123.582 192.965 190.715 190.902-190.789h-83.582l-94.176 151 19.36-199.641h-68.621l23.05 199.661-97.863-150.946z" style="stroke:none;fill-rule:evenodd;fill:#fffdfd"/></svg>',
    },
  ],
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  sources: [
    { url: 'https://commons.wikimedia.org/wiki/File:POL%20Grodzisk%20Mazowiecki%20COA.svg' },
  ],
};

export { plGrodziskMazowiecki };
