/**
 * URL Validator
 *
 * Validates URLs against standard URL format
 *
 * @example
 * ```typescript
 * // In reactive forms
 * website: ['', [urlValidator()]]
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATION } from '../../../constants/validation.constants';

/**
 * URL validator function
 *
 * @returns ValidatorFn for URL validation
 */
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().trim();
    const isValid = VALIDATION.URL_REGEX.test(value);

    return isValid ? null : { url: { value: control.value } };
  };
}
