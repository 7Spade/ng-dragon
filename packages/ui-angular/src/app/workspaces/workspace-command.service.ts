import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from, Observable } from 'rxjs';
import { CreateProjectWorkspaceCommand, WorkspaceCommandResult } from '@account-domain/src/domain-services/workspace.service';

/**
 * Frontend adapter that calls backend workspace orchestration through
 * Firebase callable functions using @angular/fire. UI never touches
 * firebase-admin directly.
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceCommandService {
  private readonly functions = inject(Functions);

  createProjectWorkspace(command: CreateProjectWorkspaceCommand): Observable<WorkspaceCommandResult> {
    const callable = httpsCallable<CreateProjectWorkspaceCommand, WorkspaceCommandResult>(
      this.functions,
      'workspaces-createProject',
    );

    return from(callable(command));
  }
}
