/**
 * Password Strength Validator
 *
 * Validates password strength based on configurable requirements
 *
 * @example
 * ```typescript
 * // In reactive forms
 * password: ['', [
 *   Validators.required,
 *   passwordStrengthValidator({
 *     minLength: 8,
 *     requireUppercase: true,
 *     requireLowercase: true,
 *     requireNumbers: true,
 *     requireSpecialChars: true
 *   })
 * ]]
 * ```
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATION } from '../../../constants/validation.constants';

export interface PasswordStrengthConfig {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

/**
 * Password strength validator function
 *
 * @param config Password strength configuration
 * @returns ValidatorFn for password strength validation
 */
export function passwordStrengthValidator(
  config: PasswordStrengthConfig = {}
): ValidatorFn {
  const {
    minLength = VALIDATION.PASSWORD.MIN_LENGTH,
    requireUppercase = VALIDATION.PASSWORD.REQUIRE_UPPERCASE,
    requireLowercase = VALIDATION.PASSWORD.REQUIRE_LOWERCASE,
    requireNumbers = VALIDATION.PASSWORD.REQUIRE_NUMBER,
    requireSpecialChars = VALIDATION.PASSWORD.REQUIRE_SPECIAL_CHAR,
  } = config;

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString();
    const errors: ValidationErrors = {};

    // Check minimum length
    if (value.length < minLength) {
      errors['minLength'] = { required: minLength, actual: value.length };
    }

    // Check for uppercase letter
    if (requireUppercase && !/[A-Z]/.test(value)) {
      errors['requireUppercase'] = true;
    }

    // Check for lowercase letter
    if (requireLowercase && !/[a-z]/.test(value)) {
      errors['requireLowercase'] = true;
    }

    // Check for number
    if (requireNumbers && !/[0-9]/.test(value)) {
      errors['requireNumbers'] = true;
    }

    // Check for special character
    if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      errors['requireSpecialChars'] = true;
    }

    return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
  };
}
