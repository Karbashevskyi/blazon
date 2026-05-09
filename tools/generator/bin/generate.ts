#!/usr/bin/env node
/**
 * blazon-generate CLI
 *
 * Converts SVG files + sidecar .meta.json files into Blazon registry entries.
 *
 * Usage:
 *   blazon-generate [options] <input-dir>
 *
 * Options:
 *   --write              Write generated JSON files to disk (default: dry-run)
 *   --bundle <output>    Generate a country bundle JSON at the given path
 *   --country <code>     Country code for bundle generation (e.g. PL)
 *   --country-name <n>   Country name for bundle generation (e.g. Poland)
 *   --no-comments        Strip XML comments from SVG content
 *   --no-trim            Do not trim whitespace from SVG content
 *   --help               Show this help message
 *
 * Examples:
 *   # Dry-run: print what would be generated
 *   blazon-generate assets/pl/city
 *
 *   # Write index.json files next to each SVG
 *   blazon-generate --write assets/pl/city
 *
 *   # Generate a full country bundle
 *   blazon-generate --write --bundle dist/registries/pl.json --country PL --country-name Poland assets/pl
 */

import { resolve } from 'node:path';
import { generateFromDirectory, generateCountryBundle } from '../src/registry-generator.js';

interface ParsedArgs {
  inputDir: string;
  write: boolean;
  bundleOutput?: string;
  countryCode?: string;
  countryName?: string;
  stripComments: boolean;
  trimSvg: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const parsed: ParsedArgs = {
    inputDir: '',
    write: false,
    stripComments: true,
    trimSvg: true,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--write':
        parsed.write = true;
        break;
      case '--bundle':
        parsed.bundleOutput = args[++i];
        break;
      case '--country':
        parsed.countryCode = args[++i];
        break;
      case '--country-name':
        parsed.countryName = args[++i];
        break;
      case '--no-comments':
        parsed.stripComments = false;
        break;
      case '--no-trim':
        parsed.trimSvg = false;
        break;
      case '--help':
      case '-h':
        parsed.help = true;
        break;
      default:
        if (!arg.startsWith('--')) {
          parsed.inputDir = arg;
        }
    }
  }

  return parsed;
}

function printHelp(): void {
  process.stdout.write(`
blazon-generate — Convert SVG files into Blazon registry entries

Usage:
  blazon-generate [options] <input-dir>

Options:
  --write              Write generated JSON files to disk (default: dry-run)
  --bundle <output>    Generate a country bundle JSON at the given path
  --country <code>     ISO 3166-1 alpha-2 country code (e.g. PL)
  --country-name <n>   Full country name for the bundle (e.g. Poland)
  --no-comments        Strip XML comments from SVG content (default: strip)
  --no-trim            Do not trim whitespace from SVG content
  --help               Show this help message

Sidecar files:
  Each SVG file must have a companion <name>.meta.json or meta.json file
  in the same directory containing the GeneratorInput fields.

  Example sidecar (warszawa.meta.json):
  {
    "name": "Herb Warszawy",
    "countryCode": "PL",
    "type": "municipal",
    "level": "city",
    "city": "Warsaw",
    "license": {
      "spdx": "CC0-1.0",
      "name": "Creative Commons Zero v1.0 Universal",
      "url": "https://creativecommons.org/publicdomain/zero/1.0/"
    }
  }

Examples:
  blazon-generate assets/pl/city
  blazon-generate --write assets/pl/city
  blazon-generate --write --bundle dist/pl.json --country PL --country-name Poland assets/pl
`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  if (args.help || args.inputDir === '') {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const inputDir = resolve(args.inputDir);
  const options = {
    write: args.bundleOutput === undefined ? args.write : false,
    stripComments: args.stripComments,
    trimSvg: args.trimSvg,
  };

  if (args.bundleOutput !== undefined) {
    if (args.countryCode === undefined) {
      process.stderr.write('Error: --country is required when using --bundle\n');
      process.exit(1);
    }

    await generateCountryBundle(
      inputDir,
      args.countryCode,
      args.countryName ?? args.countryCode,
      resolve(args.bundleOutput),
      options,
    );
  } else {
    const results = await generateFromDirectory(inputDir, options);

    if (!args.write) {
      for (const result of results) {
        process.stdout.write(`\n[DRY RUN] Would write: ${result.outputPath}\n`);
        process.stdout.write(JSON.stringify(result.entry, null, 2) + '\n');
      }
      process.stdout.write(
        `\n[DRY RUN] ${String(results.length)} entries found. Run with --write to persist.\n`,
      );
    } else {
      process.stdout.write(`\n✔ Generated ${String(results.length)} registry entries.\n`);
    }
  }
}

main().catch((err: unknown) => {
  process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
