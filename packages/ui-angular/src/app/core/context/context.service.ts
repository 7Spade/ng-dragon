import { Injectable, signal, computed } from '@angular/core';
import { ContextType, ContextInfo } from '@account-domain';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  // Current context state
  private readonly _currentContext = signal<ContextInfo>({
    type: 'user',
    id: null,
    name: undefined
  });

  // Public readonly signal
  readonly currentContext = this._currentContext.asReadonly();

  // Computed signals for context checks
  readonly isUserContext = computed(() => this._currentContext().type === 'user');
  readonly isOrganizationContext = computed(() => this._currentContext().type === 'organization');
  readonly isTeamContext = computed(() => this._currentContext().type === 'team');
  readonly isPartnerContext = computed(() => this._currentContext().type === 'partner');
  readonly contextId = computed(() => this._currentContext().id);
  readonly contextName = computed(() => this._currentContext().name);

  /**
   * Switch to user (personal) context
   */
  switchToUserContext(): void {
    this._currentContext.set({
      type: 'user',
      id: null,
      name: undefined
    });
  }

  /**
   * Switch to organization context
   */
  switchToOrganizationContext(organizationId: string, organizationName?: string): void {
    this._currentContext.set({
      type: 'organization',
      id: organizationId,
      name: organizationName
    });
  }

  /**
   * Switch to team context
   */
  switchToTeamContext(teamId: string, teamName?: string): void {
    this._currentContext.set({
      type: 'team',
      id: teamId,
      name: teamName
    });
  }

  /**
   * Switch to partner context
   */
  switchToPartnerContext(partnerId: string, partnerName?: string): void {
    this._currentContext.set({
      type: 'partner',
      id: partnerId,
      name: partnerName
    });
  }
}
