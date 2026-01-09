import { DomainEvent, EventContext, WorkspaceAggregate, WorkspaceSnapshot } from '@account-domain';

import { CreateOrganizationCommand } from '../commands/create-organization-command';
import { WorkspaceCreatedEvent } from '../events/workspace-created.event';

export class WorkspaceFactory {
  createOrganization(command: CreateOrganizationCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceId = command.workspaceId ?? `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const context: EventContext = {
      actorId: command.actorId ?? command.ownerUserId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: command.createdAt
    };

    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId,
        accountId: command.accountId,
        workspaceType: command.workspaceType ?? 'organization',
        createdAt: command.createdAt,
        modules: command.modules,
        name: command.organizationName,
        members: [{ accountId: command.ownerUserId, role: 'owner', accountType: 'user' }],
        ownerAccountId: command.ownerUserId
      },
      context
    );

    return { snapshot: aggregate.state, event: event as DomainEvent<WorkspaceSnapshot> };
  }
}
