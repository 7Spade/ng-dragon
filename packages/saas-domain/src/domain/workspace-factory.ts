import {
  DomainEvent,
  EventContext,
  ModuleStatus,
  WorkspaceAggregate,
  WorkspaceSnapshot
} from '@account-domain';

import { CreateOrganizationCommand } from '../commands/create-organization-command';
import { WorkspaceCreatedEvent } from '../events/workspace-created.event';

export class WorkspaceFactory {
  private static readonly DEFAULT_MODULES: ModuleStatus[] = [
    { moduleKey: 'identity', moduleType: 'core', enabled: true },
    { moduleKey: 'access-control', moduleType: 'core', enabled: true },
    { moduleKey: 'settings', moduleType: 'core', enabled: true },
    { moduleKey: 'audit', moduleType: 'core', enabled: true }
  ];

  createOrganization(command: CreateOrganizationCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceId = command.workspaceId ?? `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const context: EventContext = {
      actorId: command.actorId ?? command.ownerUserId,
      traceId: command.traceId ?? `trace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      causedBy: command.causedBy ?? ['user-action'],
      occurredAt: command.createdAt ?? new Date().toISOString()
    };
    const modules = command.modules ?? WorkspaceFactory.DEFAULT_MODULES;

    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId,
        accountId: command.accountId,
        workspaceType: command.workspaceType ?? 'organization',
        createdAt: command.createdAt ?? context.occurredAt,
        modules,
        name: command.organizationName,
        members: [{ accountId: command.ownerUserId, role: 'owner', accountType: 'user' }],
        ownerAccountId: command.ownerUserId
      },
      context
    );

    return { snapshot: aggregate.state, event: event as DomainEvent<WorkspaceSnapshot> };
  }
}
