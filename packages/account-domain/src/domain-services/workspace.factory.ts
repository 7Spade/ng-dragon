import { WorkspaceAggregate, WorkspaceCreationInput, WorkspaceSnapshot } from '../aggregates/workspace.aggregate';
import { EventContext, DomainEvent } from '../events/domain-event';
import { WorkspaceType } from '../value-objects/workspace-type';
import { WorkspaceId, AccountId } from '../types/identifiers';

export interface WorkspaceCreatedEventPayload {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  workspaceType: WorkspaceType;
  displayName: string;
  createdAt: string;
}

export class WorkspaceFactory {
  static createOrganization(
    input: { workspaceId: WorkspaceId; accountId: AccountId; displayName: string; createdAt?: string },
    context: EventContext
  ): { aggregate: WorkspaceAggregate; event: DomainEvent<WorkspaceSnapshot>; snapshot: WorkspaceSnapshot } {
    const creation: WorkspaceCreationInput = {
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      workspaceType: 'organization',
      displayName: input.displayName,
      createdAt: input.createdAt,
    };

    const { aggregate, event } = WorkspaceAggregate.create(creation, context);

    return { aggregate, event, snapshot: aggregate.state };
  }
}
