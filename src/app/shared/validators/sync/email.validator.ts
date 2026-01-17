/**
 * Email Validator
 *
 * Validates email addresses against RFC 5322 standard
 *
 * @example
 * ```typescript
 * // In reactive forms
 * email: ['', [Validators.required, emailValidator()]]
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATION } from '../../../constants/validation.constants';

/**
 * Email validator function
 *
 * @returns ValidatorFn for email validation
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values (use Validators.required for that)
    }

    const value = control.value.toString().trim();
    const isValid = VALIDATION.EMAIL_REGEX.test(value);

    return isValid ? null : { email: { value: control.value } };
  };
}
