/**
 * Match Validator
 *
 * Validates that two form fields have matching values
 *
 * @example
 * ```typescript
 * // In reactive forms
 * const form = new FormGroup({
 *   password: new FormControl('', [Validators.required]),
 *   confirmPassword: new FormControl('', [Validators.required])
 * }, { validators: matchValidator('password', 'confirmPassword') });
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Match validator function (for FormGroup)
 *
 * @param controlName First control name
 * @param matchingControlName Second control name to match
 * @returns ValidatorFn for match validation
 */
export function matchValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    // Skip if either control is empty
    if (!control.value || !matchingControl.value) {
      return null;
    }

    // Check if values match
    if (control.value !== matchingControl.value) {
      // Set error on matching control
      matchingControl.setErrors({ match: { expected: controlName } });
      return { match: { controlName, matchingControlName } };
    } else {
      // Clear match error if it exists
      const errors = matchingControl.errors;
      if (errors && errors['match']) {
        delete errors['match'];
        matchingControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }

    return null;
  };
}

/**
 * Match field validator (for single FormControl)
 *
 * @param otherControlName Name of the control to match against
 * @returns ValidatorFn for match validation
 */
export function matchFieldValidator(otherControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !control.parent) {
      return null;
    }

    const otherControl = control.parent.get(otherControlName);

    if (!otherControl || !otherControl.value) {
      return null;
    }

    return control.value === otherControl.value
      ? null
      : { matchField: { expected: otherControlName } };
  };
}
