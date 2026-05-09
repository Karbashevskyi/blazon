import type { BlazonLocality } from '@blazon/types';

/**
 * Herb Mogilno — Polish locality
 * @id pl-city-mogilno
 */
const plMogilno: BlazonLocality = {
  id: 'pl-city-mogilno',
  name: 'Herb Mogilno',
  countryCode: 'PL',
  kind: 'city',
  region: 'Poland',
  aliases: ['poland', 'mogilno', 'city'],
  assets: [
    {
      kind: 'arms',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 875"><title>Herb Mogilno</title><path d="M746.247 493.108c0 208.016-166.209 376.651-371.258 376.651S3.75 701.124 3.75 493.108V5.241h742.5v487.867" style="fill:#08047f;fill-opacity:1;stroke:#fdfe6b;stroke-width:7.5;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M225.37 413.362c6.389 12.509 21.852 15.631 33.353 8.991l91.969-53.127v212.507h-77.685c-10.702 0-18.795 10.44-18.795 21.3 0 11.782 9.638 21.302 21.551 21.302h74.929v59.892c0 13.28 10.778 24.058 24.057 24.058 13.28 0 24.058-10.778 24.058-24.058v-59.892h75.179c11.913 0 21.551-9.52 21.551-21.301s-9.638-21.3-21.551-21.3h-75.18V368.975l92.471 53.377c15.125 8.732 26.189 2.73 32.828-8.77.415-.72.92-1.515 1.253-2.256.022-.033.23-.215.251-.25 4.633-11.011.34-24.196-10.274-30.323l-92.47-53.377 184.188-106.003 37.59 65.155c5.957 10.318 18.866 13.91 29.069 8.02s13.722-19.001 7.769-29.32l-37.59-65.156 51.874-30.071c11.5-6.64 15.41-21.328 8.77-32.829-6.64-11.5-21.339-15.43-32.828-8.77l-51.873 30.071-37.34-64.905c-5.94-10.326-19.117-13.91-29.32-8.019-9.405 5.43-13.173 16.951-9.02 26.814l38.842 67.41-184.19 106.254V179.524c0-13.28-10.777-24.057-24.057-24.057-11.882 0-24.057 12.072-24.057 24.057v106.254L167.004 179.775l38.843-67.41c4.152-9.864.431-21.357-9.022-26.815-9.453-5.457-25.514 1.404-29.32 8.02l-37.339 64.904-51.873-30.072c-11.49-6.66-26.189-2.73-32.829 8.771-6.64 11.5-2.73 26.189 8.771 32.829l51.874 30.071-37.59 65.156c-5.953 10.319-2.684 23.429 7.518 29.32 10.203 5.89 23.363 2.298 29.32-8.02l37.59-65.155 183.938 106.003-92.22 53.377c-10.606 6.14-15.683 20.1-9.294 32.608" style="fill:#fdfe6b;fill-opacity:1;stroke:none;stroke-width:.67718714;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></svg>',
    },
  ],
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  sources: [{ url: 'https://commons.wikimedia.org/wiki/File:POL%20Mogilno%20COA%20old.svg' }],
};

export { plMogilno };
