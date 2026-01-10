import { Injectable, inject } from '@angular/core';
import { ModuleStatus } from '@account-domain';
import {
  WorkspaceApplicationService,
  CreateOrganizationCommand,
  CreateTeamCommand,
  CreatePartnerCommand,
  CreateProjectCommand
} from '@saas-domain';

import { WorkspaceRepositoryClient } from './workspace.repository.client';

export type WorkspaceTypeOption = 'organization' | 'project' | 'personal' | 'team' | 'partner';

export interface CreateOrganizationRequest {
  workspaceId?: string;
  accountId: string;
  organizationName?: string;
  teamName?: string;
  partnerName?: string;
  projectName?: string;
  description?: string;
  organizationId?: string;
  ownerUserId: string;
  actorId?: string;
  workspaceType?: WorkspaceTypeOption;
  modules?: ModuleStatus[] | string[];
  traceId?: string;
  causedBy?: string[];
  createdAt?: string;
}

const randomWorkspaceId = () => `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const DEFAULT_MODULES: ModuleStatus[] = [
  { moduleKey: 'identity', moduleType: 'core', enabled: true },
  { moduleKey: 'access-control', moduleType: 'core', enabled: true },
  { moduleKey: 'settings', moduleType: 'core', enabled: true },
  { moduleKey: 'audit', moduleType: 'core', enabled: true }
];

const normalizeModules = (modules?: ModuleStatus[] | string[]): ModuleStatus[] => {
  if (!modules) return DEFAULT_MODULES;
  if (modules.length && typeof modules[0] === 'string') {
    return (modules as string[]).map(moduleKey => ({ moduleKey, moduleType: 'core' as const, enabled: true }));
  }
  return modules as ModuleStatus[];
};

@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly application = new WorkspaceApplicationService(this.repository);

  async createOrganization(request: CreateOrganizationRequest): Promise<string> {
    const workspaceId = request.workspaceId ?? randomWorkspaceId();
    const modules = normalizeModules(request.modules);
    const baseMetadata = {
      traceId: request.traceId ?? `trace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      causedBy: request.causedBy ?? ['user-action'],
      createdAt: request.createdAt ?? new Date().toISOString()
    };

    const workspaceType = request.workspaceType ?? 'organization';
    const payload = this.buildPayload(workspaceType, {
      ...request,
      workspaceId,
      modules,
      actorId: request.actorId ?? request.ownerUserId,
      workspaceType,
      ...baseMetadata
    });

    const handlerMap: Record<WorkspaceTypeOption, (p: any) => Promise<WorkspaceCreatedEvent>> = {
      organization: p => this.application.createOrganization(p),
      team: p => this.application.createTeam(p),
      partner: p => this.application.createPartner(p),
      project: p => this.application.createProject(p),
      personal: p => this.application.createOrganization(p)
    };

    const event = await (handlerMap[workspaceType] ?? handlerMap.organization)(payload as any);

    return (event as any).workspaceId ?? workspaceId;
  }

  private buildPayload(
    workspaceType: WorkspaceTypeOption,
    request: CreateOrganizationRequest & {
      workspaceId: string;
      modules: ModuleStatus[];
      actorId: string;
      workspaceType: WorkspaceTypeOption;
      traceId: string;
      causedBy: string[];
      createdAt: string;
    }
  ): CreateOrganizationCommand | CreateTeamCommand | CreatePartnerCommand | CreateProjectCommand {
    switch (workspaceType) {
      case 'team':
        return {
          workspaceId: request.workspaceId,
          accountId: request.accountId,
          teamName: request.teamName ?? request.organizationName ?? 'Team',
          ownerUserId: request.ownerUserId,
          actorId: request.actorId,
          modules: request.modules as ModuleStatus[],
          traceId: request.traceId,
          causedBy: request.causedBy,
          createdAt: request.createdAt
        } satisfies CreateTeamCommand;
      case 'partner':
        return {
          workspaceId: request.workspaceId,
          accountId: request.accountId,
          partnerName: request.partnerName ?? request.organizationName ?? 'Partner',
          ownerUserId: request.ownerUserId,
          actorId: request.actorId,
          modules: request.modules as ModuleStatus[],
          traceId: request.traceId,
          causedBy: request.causedBy,
          createdAt: request.createdAt
        } satisfies CreatePartnerCommand;
      case 'project':
        return {
          workspaceId: request.workspaceId,
          accountId: request.accountId,
          organizationId: request.organizationId,
          projectName: request.projectName ?? request.organizationName ?? 'Project',
          description: request.description,
          ownerUserId: request.ownerUserId,
          actorId: request.actorId,
          modules: request.modules as ModuleStatus[],
          traceId: request.traceId,
          causedBy: request.causedBy,
          createdAt: request.createdAt
        } satisfies CreateProjectCommand;
      default:
        return {
          workspaceId: request.workspaceId,
          accountId: request.accountId,
          organizationName: request.organizationName ?? 'Organization',
          ownerUserId: request.ownerUserId,
          actorId: request.actorId,
          workspaceType: request.workspaceType,
          modules: request.modules as ModuleStatus[],
          traceId: request.traceId,
          causedBy: request.causedBy,
          createdAt: request.createdAt
        } satisfies CreateOrganizationCommand;
    }
  }
}

type WorkspaceCreatedEvent = Awaited<ReturnType<WorkspaceApplicationService['createOrganization']>>;
