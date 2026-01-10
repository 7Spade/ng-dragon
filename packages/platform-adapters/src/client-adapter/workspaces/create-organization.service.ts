import { Injectable, inject } from '@angular/core';
import { WorkspaceApplicationService, CreateOrganizationCommand } from '@saas-domain';

import { WorkspaceRepositoryClient } from './workspace.repository.client';

export type WorkspaceTypeOption = 'organization' | 'project' | 'personal' | 'team' | 'partner';

export interface CreateOrganizationRequest {
  workspaceId?: string;
  accountId: string;
  organizationName: string;
  ownerUserId: string;
  actorId?: string;
  workspaceType?: WorkspaceTypeOption;
}

const randomWorkspaceId = () => `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly application = new WorkspaceApplicationService(this.repository);

  async createOrganization(request: CreateOrganizationRequest): Promise<string> {
    const workspaceId = request.workspaceId ?? randomWorkspaceId();

    const payload: CreateOrganizationCommand = {
      ...request,
      workspaceId,
      actorId: request.actorId ?? request.ownerUserId,
      workspaceType: request.workspaceType ?? 'organization'
    };

    const handlerMap: Record<
      WorkspaceTypeOption,
      (p: typeof payload) => Promise<Awaited<ReturnType<WorkspaceApplicationService['createOrganization']>>>
    > = {
      organization: p => this.application.createOrganization(p),
      team: p => this.application.createTeam(p),
      partner: p => this.application.createPartner(p),
      project: p => this.application.createProject(p),
      personal: p => this.application.createOrganization(p)
    };

    const workspaceType = payload.workspaceType ?? 'organization';
    const event = await (handlerMap[workspaceType] ?? handlerMap.organization)(payload);

    return event.workspaceId ?? workspaceId;
  }
}
