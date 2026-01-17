/**
 * Phone Validator
 *
 * Validates phone numbers (supports international formats)
 *
 * @example
 * ```typescript
 * // In reactive forms
 * phone: ['', [phoneValidator()]]
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATION } from '../../../constants/validation.constants';

/**
 * Phone validator function
 *
 * @returns ValidatorFn for phone number validation
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().trim();
    const isValid = VALIDATION.PHONE_REGEX.test(value);

    return isValid ? null : { phone: { value: control.value } };
  };
}
