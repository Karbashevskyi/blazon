import type { CoatOfArms } from '@blazon/types';

/**
 * Herb Miejsce Piastowe — Polish coat of arms (Miejsce Piastowe)
 * @id pl-city-miejsce-piastowe
 */
const miejscePiastowe: CoatOfArms = {
  id: 'pl-city-miejsce-piastowe',
  name: 'Herb Miejsce Piastowe',
  description: 'Coat of arms of Miejsce Piastowe (Herb Miejsce Piastowe), a city in Poland.',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-25.95 -28.95 801.90 882.90"><title>Herb Miejsce Piastowe</title><path d="m3.75 3.75 1.572 475.38c0 214.638 172.524 342.12 370.464 342.12 204.393 0 370.464-136.462 370.464-342.12l-.736-475.38z" style="fill:#ff2119;fill-opacity:1;stroke:#000;stroke-width:7.50000048;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M391.319 293.29h-32.566l10.855-256.188h10.856zm37.357 28.948-23.028-23.028 188.827-173.476 7.676 7.676zm5.945 46.884v-32.566l256.187 10.855v10.856zm-28.949 37.357L428.7 383.45l173.476 188.83-7.676 7.676zm-46.884 5.945h32.566L380.5 668.612h-10.855zm-37.357-28.948 23.028 23.028L155.631 579.98l-7.675-7.676zm-5.945-46.885v32.567L59.3 358.302v-10.855zm28.949-37.356-23.028 23.028L147.93 133.435l7.676-7.675z" style="fill:#916e49;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:3.75;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M602.204 580.008c125.419-125.418 125.419-328.99 0-454.408s-328.99-125.42-454.408 0-125.418 328.99 0 454.408 328.99 125.418 454.408 0zM553.197 531c-98.301 98.301-257.942 98.151-356.243-.15-98.301-98.3-98.301-257.792 0-356.093 98.3-98.3 257.792-98.3 356.093 0 98.3 98.301 98.45 257.942.15 356.243z" style="fill:#916e49;fill-opacity:1;stroke:#000;stroke-width:3.75;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M373.184 278.527c-39.549 0-71.64 32.09-71.64 71.638s32.091 71.64 71.64 71.64 71.638-32.091 71.638-71.64-32.09-71.638-71.638-71.638zm0 28.189c23.968 0 43.45 19.48 43.45 43.45 0 23.968-19.482 43.449-43.45 43.449-23.97 0-43.238-19.481-43.238-43.45 0-23.968 19.269-43.45 43.238-43.45z" style="fill:#916e49;fill-opacity:1;stroke:#000;stroke-width:3.75;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M373.184 298.026c-28.763 0-51.928 23.377-51.928 52.14 0 28.762 23.165 52.139 51.928 52.139s52.14-23.377 52.14-52.14c0-28.762-23.378-52.14-52.14-52.14zm0 21.83c16.778 0 30.52 13.531 30.52 30.31 0 16.777-13.742 30.52-30.52 30.52s-30.31-13.743-30.31-30.52c0-16.779 13.532-30.31 30.31-30.31z" style="fill:#916e49;fill-opacity:1;stroke:#000;stroke-width:3.75;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M252.12 55.956c-2.035.843-3.98 1.83-5.989 2.71l26.604 64.227c2.006-.892 3.949-1.865 5.99-2.71 2.04-.845 4.101-1.53 6.15-2.318l-26.603-64.228c-2.043.798-4.116 1.475-6.152 2.319m213.25 532 26.523 64.031c2.043-.798 4.116-1.475 6.151-2.319s3.98-1.83 5.99-2.71l-26.523-64.032c-2.006.892-3.95 1.866-5.99 2.71-2.04.846-4.102 1.532-6.151 2.32M80.823 223.95c-.856 1.958-1.783 3.912-2.604 5.896-.842 2.031-1.45 4.169-2.247 6.207l64.247 26.612c.792-2.064 1.395-4.153 2.246-6.207.832-2.007 1.728-3.923 2.605-5.897zm529.204 219.203c-.776 2.015-1.496 4.004-2.328 6.011-.85 2.055-1.901 3.958-2.8 5.978l64.523 26.726c.886-2.02 1.676-4.044 2.524-6.092.822-1.984 1.549-4.02 2.328-6.011zM492.036 53.62l-26.612 64.246c2.016.776 4.005 1.497 6.011 2.328 1.983.821 3.946 1.739 5.897 2.605l26.612-64.247c-1.959-.857-3.913-1.783-5.897-2.605-2.02-.836-3.984-1.535-6.011-2.327m-219.4 529.284-26.611 64.247c2.02.885 4.045 1.675 6.092 2.524 2.031.84 4.17 1.45 6.207 2.246l26.498-63.97c-2.016-.775-4.005-1.496-6.012-2.327-2.075-.86-4.133-1.811-6.173-2.72M75.989 469.818c.774 1.977 1.422 3.986 2.238 5.956.843 2.035 1.83 3.98 2.71 5.99l64.032-26.524c-.892-2.005-1.866-3.95-2.71-5.989-.818-1.974-1.474-3.973-2.238-5.955zm529.29-219.239c.861 1.942 1.616 3.902 2.433 5.875.845 2.04 1.531 4.102 2.319 6.151l64.227-26.604c-.798-2.042-1.475-4.115-2.318-6.151-.816-1.97-1.779-3.848-2.63-5.793z" style="fill:#000;fill-opacity:1;stroke:none;stroke-width:3.75;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M375 519.031c-101.582 0-101.574 58.813-203.156 58.813-75.01 0-122.304-24.037-162.375-42.532C22.337 620.26 64.357 688.568 124 737.095c14.631 2.203 30.506 3.531 47.844 3.531 101.582 0 101.574-58.812 203.156-58.812s101.574 58.812 203.156 58.812c17.41 0 33.35-1.311 48.032-3.531 60.782-49.525 102.895-118.862 115.842-202.47-40.388 18.58-87.94 43.219-163.875 43.219-101.582 0-101.574-58.813-203.156-58.813z" style="fill:#2e61c7;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:3.75;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></svg>',
  metadata: {
    countryCode: 'PL',
    type: 'municipal',
    level: 'city',
    region: 'Poland',
    city: 'Miejsce Piastowe',
    updatedAt: '2026-05-08',
  },
  license: {
    spdx: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:POL%20Miejsce%20Piastowe%20COA.svg',
  },
  tags: ['poland', 'miejsce-piastowe', 'city'],
} as const;

export { miejscePiastowe };
