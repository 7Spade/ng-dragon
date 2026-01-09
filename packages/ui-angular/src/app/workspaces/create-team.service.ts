import { Injectable, inject } from '@angular/core';
import { CreateTeamCommand, WorkspaceApplicationService } from '@saas-domain';
import { WorkspaceRepositoryClient } from './workspace.repository.client';

/**
 * Angular service for creating teams
 * Uses WorkspaceApplicationService from saas-domain with client-side repository
 */
@Injectable({ providedIn: 'root' })
export class CreateTeamService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly applicationService: WorkspaceApplicationService;

  constructor() {
    // Wire up dependencies: ApplicationService -> Repository (@angular/fire - client SDK)
    this.applicationService = new WorkspaceApplicationService(this.repository);
  }

  async createTeam(command: CreateTeamCommand): Promise<string> {
    const event = await this.applicationService.createTeam(command);
    return event.aggregateId;
  }
}
