/**
 * Slug Validator
 *
 * Validates slugs (lowercase alphanumeric with hyphens)
 *
 * @example
 * ```typescript
 * // In reactive forms
 * slug: ['', [slugValidator()]]
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATION } from '../../../constants/validation.constants';

/**
 * Slug validator function
 *
 * @returns ValidatorFn for slug validation
 */
export function slugValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().trim();
    const isValid = VALIDATION.SLUG_REGEX.test(value);

    return isValid ? null : { slug: { value: control.value } };
  };
}
