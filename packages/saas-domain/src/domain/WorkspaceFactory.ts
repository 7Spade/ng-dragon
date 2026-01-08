import { WorkspaceAggregate, WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { EventContext } from '@account-domain/src/events/domain-event';
import { WorkspaceType } from '@account-domain/src/value-objects/workspace-type';
import { CreateOrganizationCommand } from '../commands/CreateOrganizationCommand';
import { WorkspaceCreatedEvent } from '../events/WorkspaceCreatedEvent';

export class WorkspaceFactory {
  createOrganization(command: CreateOrganizationCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceType: WorkspaceType = 'Organization';
    const context: EventContext = {
      actorId: command.actorId ?? command.accountId,
      traceId: command.traceId,
      causedBy: command.causedBy,
      occurredAt: command.createdAt
    };

    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId: command.workspaceId,
        accountId: command.accountId,
        workspaceType,
        modules: command.modules,
        createdAt: command.createdAt,
        name: command.organizationName
      },
      context
    );

    return { snapshot: aggregate.state, event };
  }
}
