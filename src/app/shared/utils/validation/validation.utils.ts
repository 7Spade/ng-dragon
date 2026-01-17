/**
 * Validation Utility Functions
 */

import { VALIDATION_PATTERNS } from '../../constants';

export function isEmail(value: string): boolean {
  return VALIDATION_PATTERNS.EMAIL.test(value);
}

export function isUrl(value: string): boolean {
  return VALIDATION_PATTERNS.URL.test(value);
}

export function isPhone(value: string): boolean {
  return VALIDATION_PATTERNS.PHONE.test(value);
}

export function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}
