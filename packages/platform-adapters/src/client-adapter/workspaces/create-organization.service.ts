import { Injectable, inject } from '@angular/core';
import { WorkspaceApplicationService, CreateOrganizationCommand } from '@saas-domain';

import { WorkspaceRepositoryClient } from './workspace.repository.client';

const randomWorkspaceId = () => `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly application = new WorkspaceApplicationService(this.repository);

  async createOrganization(command: CreateOrganizationCommand): Promise<string> {
    const workspaceId = command.workspaceId ?? randomWorkspaceId();

    const event = await this.application.createOrganization({
      ...command,
      workspaceId,
      actorId: command.actorId ?? command.ownerUserId,
      workspaceType: command.workspaceType ?? 'organization'
    });

    return event.workspaceId ?? workspaceId;
  }
}
