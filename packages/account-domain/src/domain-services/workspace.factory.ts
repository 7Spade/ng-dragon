import { WorkspaceAggregate } from '../aggregates/workspace.aggregate';
import { DomainEvent, EventContext } from '../events/domain-event';
import { AccountId } from '../types/identifiers';
import { WorkspaceId } from '../value-objects/workspace-id';

export class WorkspaceFactory {
  createProject(params: { orgId: AccountId; name: string; createdAt?: string; context: EventContext }): {
    aggregate: WorkspaceAggregate;
    event: DomainEvent<unknown>;
  } {
    const workspaceId = WorkspaceId.generate();
    const { aggregate, event } = WorkspaceAggregate.create(
      {
        workspaceId,
        accountId: params.orgId,
        workspaceType: 'project',
        modules: [],
        createdAt: params.createdAt,
        name: params.name,
      },
      params.context,
    );

    return { aggregate, event };
  }
}
