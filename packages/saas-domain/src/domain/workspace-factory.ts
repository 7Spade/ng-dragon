import { WorkspaceAggregate, WorkspaceSnapshot } from '@account-domain';
import { EventContext } from '@account-domain';
import { WorkspaceType } from '@account-domain';
import { createorganizationcommand } from '../commands/create-organization-command';
import { WorkspaceCreatedEvent } from '../events/workspace-created.event';

export class workspacefactory {
  createOrganization(command: createorganizationcommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const workspaceType: WorkspaceType = 'organization';
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
