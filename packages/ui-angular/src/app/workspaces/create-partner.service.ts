import { Injectable, inject } from '@angular/core';
import { CreatePartnerCommand, WorkspaceApplicationService } from '@saas-domain';
import { WorkspaceRepositoryClient } from './workspace.repository.client';

/**
 * Angular service for creating partners
 * Uses WorkspaceApplicationService from saas-domain with client-side repository
 */
@Injectable({ providedIn: 'root' })
export class CreatePartnerService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly applicationService: WorkspaceApplicationService;

  constructor() {
    // Wire up dependencies: ApplicationService -> Repository (@angular/fire - client SDK)
    this.applicationService = new WorkspaceApplicationService(this.repository);
  }

  async createPartner(command: CreatePartnerCommand): Promise<string> {
    const event = await this.applicationService.createPartner(command);
    return event.aggregateId;
  }
}
