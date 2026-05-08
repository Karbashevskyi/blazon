import type { CoatType, AdministrativeLevel, AssetLicense } from '@blazon/types';

/**
 * Input descriptor for the generator CLI.
 * Can be provided via a JSON sidecar file (`.meta.json`) alongside the SVG,
 * or passed directly when using the generator as a library.
 */
export interface GeneratorInput {
  /**
   * Registry ID to assign to this entry.
   * Convention: `{cc}-{level}-{slug}`, e.g. "pl-city-warszawa".
   * If omitted, it is derived from the SVG file path.
   */
  readonly id?: string;

  /** Display name of the entity whose arms these are */
  readonly name: string;

  /** Optional prose description */
  readonly description?: string;

  /** ISO 3166-1 alpha-2 country code (uppercase) */
  readonly countryCode: string;

  /** Classification type */
  readonly type: CoatType;

  /** Administrative level */
  readonly level: AdministrativeLevel;

  /** Region name, if applicable */
  readonly region?: string;

  /** City name, if applicable */
  readonly city?: string;

  /** Verbal blazon description */
  readonly blazon?: string;

  /** License information */
  readonly license: AssetLicense;

  /** Tags for faceted search */
  readonly tags?: readonly string[];
}

/**
 * Result of processing a single SVG file.
 */
export interface GeneratorResult {
  /** The generated registry entry as a JSON-serialisable object */
  readonly entry: GeneratedEntry;
  /** Path to the source SVG file */
  readonly svgPath: string;
  /** Path where the output JSON was (or should be) written */
  readonly outputPath: string;
}

/**
 * Shape of a generated registry entry (CoatOfArms with `svgFile` reference).
 * The `svg` field contains the inlined SVG content.
 */
export interface GeneratedEntry {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly svg: string;
  readonly metadata: {
    readonly countryCode: string;
    readonly type: CoatType;
    readonly level: AdministrativeLevel;
    readonly region?: string;
    readonly city?: string;
    readonly blazon?: string;
    readonly updatedAt: string;
  };
  readonly license: AssetLicense;
  readonly tags?: readonly string[];
}

/**
 * Options that control the generator's behaviour.
 */
export interface GeneratorOptions {
  /**
   * When `true`, the generator writes the output JSON file to disk.
   * When `false` (default), it returns the result without writing.
   */
  readonly write?: boolean;

  /**
   * Whether to strip XML comments from the SVG before inlining.
   * Defaults to `true`.
   */
  readonly stripComments?: boolean;

  /**
   * Whether to trim whitespace-only text nodes from the SVG.
   * Defaults to `true`.
   */
  readonly trimSvg?: boolean;

  /**
   * Custom output directory. Defaults to the same directory as the SVG file.
   */
  readonly outputDir?: string;
}
