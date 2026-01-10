import { Injectable, inject } from '@angular/core';
import { CreateOrganizationCommand, WorkspaceApplicationService } from '@saas-domain';
import { WorkspaceRepositoryClient } from './workspace.repository.client';

/**
 * Angular service for creating organizations
 * Uses WorkspaceApplicationService from saas-domain with client-side repository
 */
@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly applicationService: WorkspaceApplicationService;

  constructor() {
    // Wire up dependencies: ApplicationService -> Repository (@angular/fire - client SDK)
    this.applicationService = new WorkspaceApplicationService(this.repository);
  }

  async createOrganization(command: CreateOrganizationCommand): Promise<string> {
    const event = await this.applicationService.createOrganization(command);
    return event.aggregateId;
  }
}
