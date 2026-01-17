/**
 * Min-Max Validators
 *
 * Enhanced min/max validators with better error messages
 *
 * @example
 * ```typescript
 * // In reactive forms
 * age: ['', [minValidator(18), maxValidator(100)]]
 * price: ['', [rangeValidator(0, 1000)]]
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Minimum value validator
 *
 * @param min Minimum allowed value
 * @returns ValidatorFn for min validation
 */
export function minValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value)) {
      return { min: { min, actual: control.value, type: 'not-a-number' } };
    }

    return value < min ? { min: { min, actual: value } } : null;
  };
}

/**
 * Maximum value validator
 *
 * @param max Maximum allowed value
 * @returns ValidatorFn for max validation
 */
export function maxValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value)) {
      return { max: { max, actual: control.value, type: 'not-a-number' } };
    }

    return value > max ? { max: { max, actual: value } } : null;
  };
}

/**
 * Range validator (min and max combined)
 *
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns ValidatorFn for range validation
 */
export function rangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value)) {
      return { range: { min, max, actual: control.value, type: 'not-a-number' } };
    }

    if (value < min || value > max) {
      return { range: { min, max, actual: value } };
    }

    return null;
  };
}
