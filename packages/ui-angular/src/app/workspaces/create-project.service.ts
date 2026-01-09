import { Injectable, inject } from '@angular/core';
import { CreateProjectCommand, WorkspaceApplicationService } from '@saas-domain';
import { WorkspaceRepositoryClient } from './workspace.repository.client';

/**
 * CreateProjectService
 * 
 * Handles project (logical container) creation with 4 base modules:
 * - Identity/Members Module
 * - Access Control Module
 * - Settings/Profile Module
 * - Audit/Activity Module
 */
@Injectable({ providedIn: 'root' })
export class CreateProjectService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly applicationService: WorkspaceApplicationService;

  constructor() {
    // Wire up dependencies: ApplicationService -> Repository (@angular/fire - client SDK)
    this.applicationService = new WorkspaceApplicationService(this.repository);
  }

  async createProject(command: CreateProjectCommand): Promise<string> {
    const event = await this.applicationService.createProject(command);
    return event.aggregateId;
  }
}
