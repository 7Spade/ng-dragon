/**
 * Whitespace Validator
 *
 * Validates that a value is not only whitespace
 *
 * @example
 * ```typescript
 * // In reactive forms
 * name: ['', [Validators.required, noWhitespaceValidator()]]
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * No whitespace validator function
 *
 * Ensures the value is not empty or only whitespace
 *
 * @returns ValidatorFn for whitespace validation
 */
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString();
    const isWhitespace = value.trim().length === 0;

    return isWhitespace ? { whitespace: true } : null;
  };
}

/**
 * No leading/trailing whitespace validator
 *
 * Ensures the value doesn't start or end with whitespace
 *
 * @returns ValidatorFn for leading/trailing whitespace validation
 */
export function noLeadingTrailingWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString();
    const hasLeadingOrTrailing = value !== value.trim();

    return hasLeadingOrTrailing ? { leadingTrailingWhitespace: true } : null;
  };
}
