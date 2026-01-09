import { Workspace, WorkspaceSnapshot } from '../aggregates/workspace.aggregate';
import { CreateOrganizationCommand } from '../commands/create-organization-command';
import { WorkspaceCreatedEvent } from '../events/workspace-created.event';

export class WorkspaceFactory {
  createOrganization(command: CreateOrganizationCommand): {
    snapshot: WorkspaceSnapshot;
    event: WorkspaceCreatedEvent;
  } {
    const { workspace, event } = Workspace.createOrganization({
      workspaceId: command.workspaceId,
      accountId: command.accountId,
      name: command.organizationName,
      ownerUserId: command.ownerUserId,
      modules: command.modules,
      createdAt: command.createdAt
    });

    return { snapshot: workspace.toSnapshot(), event };
  }
}
