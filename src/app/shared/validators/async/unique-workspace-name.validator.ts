/**
 * Unique Workspace Name Validator (Async)
 *
 * Validates that a workspace name is not already in use
 *
 * @example
 * ```typescript
 * // In reactive forms
 * workspaceName: ['', [Validators.required], [uniqueWorkspaceNameValidator()]]
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
interface IWorkspaceRepository {
  checkNameExists(name: string, accountId: string): Observable<boolean>;
}

/**
 * Unique workspace name validator function
 *
 * @param accountId Account ID to check workspace name within
 * @param debounceTime Debounce time in milliseconds (default: 300ms)
 * @returns AsyncValidatorFn for unique workspace name validation
 */
export function uniqueWorkspaceNameValidator(
  accountId: string,
  debounceTime = 300
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    // TODO: Inject repository when infrastructure layer is ready
    // const workspaceRepository = inject(IWorkspaceRepository);

    return timer(debounceTime).pipe(
      switchMap(() => {
        // TODO: Replace with actual repository call
        console.warn(
          'uniqueWorkspaceNameValidator: Repository not implemented yet. Returning mock validation.'
        );
        return of(false); // Mock: name doesn't exist
      }),
      map((exists) =>
        exists ? { uniqueWorkspaceName: { value: control.value } } : null
      ),
      catchError(() => of(null))
    );
  };
}
