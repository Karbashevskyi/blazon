/**
 * @blazon/generator
 *
 * Programmatic API for the Blazon SVG → registry entry generator.
 *
 * @packageDocumentation
 */

export { generateEntry, generateFromDirectory, generateCountryBundle, buildCountryBundle, deriveId, slugify } from './registry-generator.js';
export { processSvg, stripComments, trimWhitespace, ensureXmlns, assertIsSvg } from './svg-parser.js';
export type { GeneratorInput, GeneratorResult, GeneratorOptions, GeneratedEntry } from './types.js';
