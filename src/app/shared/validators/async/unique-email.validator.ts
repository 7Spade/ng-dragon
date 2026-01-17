/**
 * Unique Email Validator (Async)
 *
 * Validates that an email address is not already in use
 *
 * @example
 * ```typescript
 * // In reactive forms
 * email: ['', [Validators.required, Validators.email], [uniqueEmailValidator()]]
 * ```
 */

import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// Note: This will need to be implemented when the infrastructure layer is ready
// For now, we'll create a placeholder interface
interface IAccountRepository {
  checkEmailExists(email: string): Observable<boolean>;
}

/**
 * Unique email validator function
 *
 * @param debounceTime Debounce time in milliseconds (default: 300ms)
 * @returns AsyncValidatorFn for unique email validation
 */
export function uniqueEmailValidator(debounceTime = 300): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    // TODO: Inject repository when infrastructure layer is ready
    // const accountRepository = inject(IAccountRepository);

    return timer(debounceTime).pipe(
      switchMap(() => {
        // TODO: Replace with actual repository call
        // return accountRepository.checkEmailExists(control.value);
        
        // Placeholder implementation
        console.warn(
          'uniqueEmailValidator: Repository not implemented yet. Returning mock validation.'
        );
        return of(false); // Mock: email doesn't exist
      }),
      map((exists) =>
        exists ? { uniqueEmail: { value: control.value } } : null
      ),
      catchError(() => of(null)) // On error, allow the value
    );
  };
}
