import { Injectable, inject } from '@angular/core';
import { CreateOrganizationService } from '@platform-adapters';

@Injectable({ providedIn: 'root' })
export class CreateProjectService {
  private readonly createWorkspace = inject(CreateOrganizationService);

  async createProject(input: {
    accountId: string;
    projectName: string;
    description?: string;
    organizationId?: string;
    actorId?: string;
  }): Promise<string> {
    return this.createWorkspace.createOrganization({
      accountId: input.accountId,
      organizationId: input.organizationId,
      projectName: input.projectName,
      description: input.description,
      ownerUserId: input.accountId,
      actorId: input.actorId ?? input.accountId,
      workspaceType: 'project'
    });
  }
}
