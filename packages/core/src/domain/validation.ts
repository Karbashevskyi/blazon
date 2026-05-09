import type { CoatOfArms } from '@blazon/types';

const VALID_COAT_TYPES = new Set([
  'national',
  'regional',
  'municipal',
  'historical',
  'ecclesiastical',
  'other',
]);
const VALID_LEVELS = new Set(['national', 'state', 'county', 'city', 'district', 'village']);

/**
 * Represents a single field-level validation failure.
 */
export interface ValidationError {
  /** Dot-separated path to the invalid field, e.g. "metadata.countryCode" */
  readonly field: string;
  /** Human-readable explanation of the constraint that was violated */
  readonly message: string;
}

/**
 * The result of validating a coat of arms entry.
 */
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly ValidationError[];
}

/**
 * Validates a raw unknown value against the CoatOfArms schema.
 * Use this at system boundaries — when loading data from JSON, APIs, or user input.
 *
 * This is the primary validation entry point. Internal domain logic
 * should only operate on already-validated CoatOfArms objects.
 */
export function validateCoatOfArms(raw: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (raw === null || typeof raw !== 'object') {
    return { valid: false, errors: [{ field: '', message: 'Value must be a non-null object' }] };
  }

  const obj = raw as Record<string, unknown>;

  validateString(obj, 'id', errors, { required: true, minLength: 1 });
  validateString(obj, 'name', errors, { required: true, minLength: 1 });
  validateString(obj, 'svg', errors, { required: true, minLength: 1 });

  if (obj.metadata !== undefined) {
    errors.push(...validateMetadata(obj.metadata));
  } else {
    errors.push({ field: 'metadata', message: 'metadata is required' });
  }

  if (obj.license !== undefined) {
    errors.push(...validateLicense(obj.license));
  } else {
    errors.push({ field: 'license', message: 'license is required' });
  }

  if (obj.tags !== undefined) {
    if (!Array.isArray(obj.tags) || !obj.tags.every((t) => typeof t === 'string')) {
      errors.push({ field: 'tags', message: 'tags must be an array of strings' });
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateMetadata(raw: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (raw === null || typeof raw !== 'object') {
    return [{ field: 'metadata', message: 'metadata must be a non-null object' }];
  }

  const m = raw as Record<string, unknown>;

  if (typeof m.countryCode !== 'string' || !/^[A-Z]{2}$/.test(m.countryCode)) {
    errors.push({
      field: 'metadata.countryCode',
      message: 'countryCode must be a 2-letter ISO 3166-1 alpha-2 code (uppercase)',
    });
  }

  if (typeof m.type !== 'string' || !VALID_COAT_TYPES.has(m.type)) {
    errors.push({
      field: 'metadata.type',
      message: `type must be one of: ${[...VALID_COAT_TYPES].join(', ')}`,
    });
  }

  if (typeof m.level !== 'string' || !VALID_LEVELS.has(m.level)) {
    errors.push({
      field: 'metadata.level',
      message: `level must be one of: ${[...VALID_LEVELS].join(', ')}`,
    });
  }

  if (m.createdAt !== undefined && !isIso8601Date(m.createdAt)) {
    errors.push({
      field: 'metadata.createdAt',
      message: 'createdAt must be an ISO 8601 date string',
    });
  }

  if (m.updatedAt !== undefined && !isIso8601Date(m.updatedAt)) {
    errors.push({
      field: 'metadata.updatedAt',
      message: 'updatedAt must be an ISO 8601 date string',
    });
  }

  return errors;
}

function validateLicense(raw: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (raw === null || typeof raw !== 'object') {
    return [{ field: 'license', message: 'license must be a non-null object' }];
  }

  const l = raw as Record<string, unknown>;

  validateString(l, 'spdx', errors, { required: true, prefix: 'license.' });
  validateString(l, 'name', errors, { required: true, prefix: 'license.' });
  validateString(l, 'url', errors, { required: true, prefix: 'license.' });

  return errors;
}

interface StringValidationOptions {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly prefix?: string;
}

function validateString(
  obj: Record<string, unknown>,
  key: string,
  errors: ValidationError[],
  { required = false, minLength = 0, prefix = '' }: StringValidationOptions,
): void {
  const field = `${prefix}${key}`;
  const value = obj[key];

  if (value === undefined || value === null) {
    if (required) {
      errors.push({ field, message: `${field} is required` });
    }
    return;
  }

  if (typeof value !== 'string') {
    errors.push({ field, message: `${field} must be a string` });
    return;
  }

  if (value.length < minLength) {
    errors.push({
      field,
      message: `${field} must have at least ${String(minLength)} character(s)`,
    });
  }
}

function isIso8601Date(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]+)?$/.test(value);
}

/**
 * Type guard — narrows an unknown value to CoatOfArms if it passes validation.
 * Prefer `validateCoatOfArms` when you need error details.
 */
export function isCoatOfArms(raw: unknown): raw is CoatOfArms {
  return validateCoatOfArms(raw).valid;
}

/**
 * Asserts that a value is a valid CoatOfArms, throwing a descriptive error if not.
 * Use at system boundaries where recovery is not possible.
 */
export function assertCoatOfArms(raw: unknown, context = ''): asserts raw is CoatOfArms {
  const result = validateCoatOfArms(raw);
  if (!result.valid) {
    const prefix = context ? `[${context}] ` : '';
    const details = result.errors.map((e) => `  • ${e.field}: ${e.message}`).join('\n');
    throw new Error(`${prefix}Invalid CoatOfArms:\n${details}`);
  }
}
