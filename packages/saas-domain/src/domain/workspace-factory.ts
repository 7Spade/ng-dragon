import {
  DomainEvent,
  EventContext,
  ModuleStatus,
  WorkspaceAggregate,
  WorkspaceSnapshot,
  WorkspaceMember
} from '@account-domain';

import { CreateOrganizationCommand } from '../commands/create-organization-command';
import { CreatePartnerCommand } from '../commands/create-partner-command';
import { CreateProjectCommand } from '../commands/create-project-command';
import { CreateTeamCommand } from '../commands/create-team-command';
import { WorkspaceCreatedEvent } from '../events/workspace-created.event';

const DEFAULT_MODULES: ModuleStatus[] = [
  { moduleKey: 'identity', moduleType: 'core', enabled: true },
  { moduleKey: 'access-control', moduleType: 'core', enabled: true },
  { moduleKey: 'settings', moduleType: 'core', enabled: true },
  { moduleKey: 'audit', moduleType: 'core', enabled: true }
];

export type WorkspaceCreationCommand =
  | CreateOrganizationCommand
  | CreateTeamCommand
  | CreatePartnerCommand
  | CreateProjectCommand;

export class WorkspaceFactory {
  createOrganization(command: CreateOrganizationCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    return this.createWorkspace(command, command.workspaceType ?? 'organization');
  }

  createTeam(command: CreateTeamCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    return this.createWorkspace(command, 'team');
  }

  createPartner(command: CreatePartnerCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    return this.createWorkspace(command, 'partner');
  }

  createProject(command: CreateProjectCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    return this.createWorkspace(command, 'project');
  }

  private createWorkspace(
    command: WorkspaceCreationCommand,
    workspaceType: WorkspaceSnapshot['workspaceType']
  ): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceId = command.workspaceId ?? `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const traceId = command.traceId ?? `trace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const createdAt = command.createdAt ?? new Date().toISOString();

    const context: EventContext = {
      actorId: command.actorId ?? command.ownerUserId,
      traceId,
      causedBy: command.causedBy ?? ['user-action'],
      occurredAt: createdAt
    };

    const modules = command.modules ?? DEFAULT_MODULES;
    const members: WorkspaceMember[] = [
      { accountId: command.ownerUserId, role: 'owner', accountType: 'user' },
      ...(command.actorId && command.actorId !== command.ownerUserId
        ? [{ accountId: command.actorId, role: 'admin' as const, accountType: 'user' as const }]
        : [])
    ];
    const memberIds = members.map(member => member.accountId);

    const displayName =
      (command as CreateOrganizationCommand).organizationName ||
      (command as CreateTeamCommand).teamName ||
      (command as CreatePartnerCommand).partnerName ||
      (command as CreateProjectCommand).projectName ||
      'Workspace';

    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId,
        accountId: command.accountId,
        workspaceType,
        createdAt,
        modules,
        name: displayName,
        members,
        ownerAccountId: command.ownerUserId,
        memberIds
      },
      context
    );

    return { snapshot: aggregate.state, event: event as DomainEvent<WorkspaceSnapshot> };
  }
}
