/**
 * Unique Workspace Slug Validator (Async)
 *
 * Validates that a workspace slug is not already in use
 *
 * @example
 * ```typescript
 * // In reactive forms
 * workspaceSlug: ['', [Validators.required, slugValidator()], [uniqueWorkspaceSlugValidator()]]
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
  checkSlugExists(slug: string): Observable<boolean>;
}

/**
 * Unique workspace slug validator function
 *
 * @param debounceTime Debounce time in milliseconds (default: 300ms)
 * @returns AsyncValidatorFn for unique workspace slug validation
 */
export function uniqueWorkspaceSlugValidator(
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
          'uniqueWorkspaceSlugValidator: Repository not implemented yet. Returning mock validation.'
        );
        return of(false); // Mock: slug doesn't exist
      }),
      map((exists) =>
        exists ? { uniqueWorkspaceSlug: { value: control.value } } : null
      ),
      catchError(() => of(null))
    );
  };
}
