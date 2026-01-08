import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WorkspaceContext {
  organizationId: string | null;
  teamId: string | null;
}

/**
 * Service to manage current workspace context (selected organization/team)
 * Used to dynamically refresh sidebar menu based on context
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceContextService {
  private contextSubject = new BehaviorSubject<WorkspaceContext>({
    organizationId: null,
    teamId: null
  });

  readonly context$ = this.contextSubject.asObservable();

  get currentContext(): WorkspaceContext {
    return this.contextSubject.value;
  }

  /**
   * Set organization context (clears team)
   */
  selectOrganization(organizationId: string): void {
    this.contextSubject.next({
      organizationId,
      teamId: null
    });
  }

  /**
   * Set team context (requires organization)
   */
  selectTeam(organizationId: string, teamId: string): void {
    this.contextSubject.next({
      organizationId,
      teamId
    });
  }

  /**
   * Clear context
   */
  clearContext(): void {
    this.contextSubject.next({
      organizationId: null,
      teamId: null
    });
  }
}
