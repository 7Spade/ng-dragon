/**
 * Pattern Validator
 *
 * Enhanced pattern validator with custom error messages
 *
 * @example
 * ```typescript
 * // In reactive forms
 * username: ['', [
 *   patternValidator(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores allowed')
 * ]]
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Pattern validator with custom error message
 *
 * @param pattern Regular expression pattern
 * @param errorMessage Custom error message
 * @returns ValidatorFn for pattern validation
 */
export function patternValidator(
  pattern: RegExp | string,
  errorMessage?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString();
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const isValid = regex.test(value);

    return isValid
      ? null
      : {
          pattern: {
            requiredPattern: regex.toString(),
            actualValue: value,
            ...(errorMessage && { message: errorMessage }),
          },
        };
  };
}
