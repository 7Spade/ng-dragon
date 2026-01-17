/**
 * Unique Username Validator (Async)
 *
 * Validates that a username is not already in use
 *
 * @example
 * ```typescript
 * // In reactive forms
 * username: ['', [Validators.required], [uniqueUsernameValidator()]]
 * ```
 */

import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// Placeholder interface
interface IAccountRepository {
  checkUsernameExists(username: string): Observable<boolean>;
}

/**
 * Unique username validator function
 *
 * @param debounceTime Debounce time in milliseconds (default: 300ms)
 * @returns AsyncValidatorFn for unique username validation
 */
export function uniqueUsernameValidator(debounceTime = 300): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    // TODO: Inject repository when infrastructure layer is ready
    // const accountRepository = inject(IAccountRepository);

    return timer(debounceTime).pipe(
      switchMap(() => {
        // TODO: Replace with actual repository call
        console.warn(
          'uniqueUsernameValidator: Repository not implemented yet. Returning mock validation.'
        );
        return of(false); // Mock: username doesn't exist
      }),
      map((exists) =>
        exists ? { uniqueUsername: { value: control.value } } : null
      ),
      catchError(() => of(null))
    );
  };
}
