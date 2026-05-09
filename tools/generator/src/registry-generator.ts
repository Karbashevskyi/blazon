import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, basename, extname, dirname, resolve } from 'node:path';
import { processSvg } from './svg-parser.js';
import type { GeneratorInput, GeneratorResult, GeneratedEntry, GeneratorOptions } from './types.js';

/**
 * Derives a Blazon registry ID from a file path.
 *
 * Convention: path segments relative to the assets root are used.
 * Example: `assets/pl/city/warszawa/warszawa.svg` → `pl-city-warszawa`
 */
export function deriveId(
  svgPath: string,
  input: Pick<GeneratorInput, 'countryCode' | 'level' | 'city' | 'region'>,
): string {
  const parts: string[] = [input.countryCode.toLowerCase()];

  if (input.level === 'city' || input.level === 'district' || input.level === 'village') {
    parts.push(input.level);
    const name = input.city ?? basename(dirname(svgPath));
    parts.push(slugify(name));
  } else if (input.level === 'state' || input.level === 'county') {
    parts.push(input.level);
    const name = input.region ?? basename(dirname(svgPath));
    parts.push(slugify(name));
  } else {
    parts.push(input.level);
  }

  return parts.join('-');
}

/**
 * Converts a name string to a URL-safe slug.
 */
export function slugify(name: string): string {
  // Handle characters that NFD decomposition doesn't cover (e.g. Polish Ł, ł)
  const special: Record<string, string> = {
    Ł: 'l',
    ł: 'l',
    Ó: 'o',
    ó: 'o',
    Ź: 'z',
    ź: 'z',
    Ż: 'z',
    ż: 'z',
    Ń: 'n',
    ń: 'n',
    Ę: 'e',
    ę: 'e',
    Ą: 'a',
    ą: 'a',
    Ć: 'c',
    ć: 'c',
    Ś: 's',
    ś: 's',
  };
  return name
    .split('')
    .map((c) => special[c] ?? c)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip remaining diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Processes a single SVG file and its accompanying metadata,
 * returning a `GeneratorResult` (and optionally writing the JSON to disk).
 */
export async function generateEntry(
  svgPath: string,
  input: GeneratorInput,
  options: GeneratorOptions = {},
): Promise<GeneratorResult> {
  const { write = false, stripComments = true, trimSvg = true, outputDir } = options;

  const rawSvg = await readFile(svgPath, 'utf-8');
  const svg = processSvg(rawSvg, svgPath, { stripComments, trimSvg });

  const id = input.id ?? deriveId(svgPath, input);

  const entry: GeneratedEntry = {
    id,
    name: input.name,
    ...(input.description !== undefined && { description: input.description }),
    svg,
    metadata: {
      countryCode: input.countryCode.toUpperCase(),
      type: input.type,
      level: input.level,
      ...(input.region !== undefined && { region: input.region }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.blazon !== undefined && { blazon: input.blazon }),
      updatedAt: new Date().toISOString().split('T')[0] ?? new Date().toISOString(),
    },
    license: input.license,
    ...(input.tags !== undefined && { tags: input.tags }),
  };

  const dir = outputDir ?? dirname(svgPath);
  const outputPath = join(dir, 'index.json');

  if (write) {
    await writeFile(outputPath, JSON.stringify(entry, null, 2) + '\n', 'utf-8');
  }

  return { entry, svgPath, outputPath };
}

/**
 * Scans a directory tree for SVG files paired with `.meta.json` sidecar files,
 * generates entries for each, and optionally writes them to disk.
 *
 * A sidecar file must live in the same directory as the SVG and be named
 * `<basename>.meta.json` or simply `meta.json`.
 */
export async function generateFromDirectory(
  rootDir: string,
  options: GeneratorOptions = {},
): Promise<GeneratorResult[]> {
  const svgFiles = await findSvgFiles(rootDir);
  const results: GeneratorResult[] = [];

  for (const svgPath of svgFiles) {
    const meta = await loadSidecarMeta(svgPath);
    if (meta === null) {
      process.stderr.write(`[blazon-generate] Skipping ${svgPath}: no .meta.json sidecar found\n`);
      continue;
    }

    const result = await generateEntry(svgPath, meta, options);
    results.push(result);

    if (options.write === true) {
      process.stdout.write(`[blazon-generate] ✔ ${result.outputPath}\n`);
    }
  }

  return results;
}

/**
 * Recursively finds all `.svg` files under a directory.
 */
async function findSvgFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      const nested = await findSvgFiles(fullPath);
      results.push(...nested);
    } else if (extname(entry).toLowerCase() === '.svg') {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Tries to load a `.meta.json` sidecar file for a given SVG path.
 * Looks for `<name>.meta.json` first, then `meta.json` in the same directory.
 */
async function loadSidecarMeta(svgPath: string): Promise<GeneratorInput | null> {
  const dir = dirname(svgPath);
  const base = basename(svgPath, '.svg');

  const candidates = [join(dir, `${base}.meta.json`), join(dir, 'meta.json')];

  for (const candidate of candidates) {
    try {
      const raw = await readFile(candidate, 'utf-8');
      return JSON.parse(raw) as GeneratorInput;
    } catch {
      // Not found — try the next candidate
    }
  }

  return null;
}

/**
 * Builds a `CountryRegistry`-shaped JSON from a list of `GeneratedEntry` objects.
 * Useful when generating a full country bundle.
 */
export function buildCountryBundle(
  countryCode: string,
  countryName: string,
  entries: readonly GeneratedEntry[],
): unknown {
  return {
    countryCode: countryCode.toUpperCase(),
    name: countryName,
    entries,
  };
}

/**
 * Generates a full country bundle from an assets directory and writes it to a file.
 */
export async function generateCountryBundle(
  assetsDir: string,
  countryCode: string,
  countryName: string,
  outputPath: string,
  options: Omit<GeneratorOptions, 'write'> = {},
): Promise<void> {
  const results = await generateFromDirectory(assetsDir, { ...options, write: false });
  const entries = results.map((r) => r.entry);
  const bundle = buildCountryBundle(countryCode, countryName, entries);

  await writeFile(outputPath, JSON.stringify(bundle, null, 2) + '\n', 'utf-8');

  process.stdout.write(
    `[blazon-generate] Bundle written → ${resolve(outputPath)} (${String(entries.length)} entries)\n`,
  );
}
