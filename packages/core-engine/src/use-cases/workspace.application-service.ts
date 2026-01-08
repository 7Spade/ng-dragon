import { WorkspaceFactory } from '@account-domain';
import { EventContext } from '@account-domain/src/events/domain-event';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { WorkspaceRepository } from '../ports/workspace.repository';
import { CreateOrganizationCommand } from '../commands/create-organization.command';

export class WorkspaceApplicationService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async createOrganization(command: CreateOrganizationCommand): Promise<WorkspaceSnapshot> {
    const workspaceId = this.generateId('ws');
    const context: EventContext = { actorId: command.accountId, traceId: command.traceId };
    const { aggregate, snapshot, event } = WorkspaceFactory.createOrganization(
      {
        workspaceId,
        accountId: command.accountId,
        displayName: command.displayName,
      },
      context
    );

    await this.workspaceRepository.appendEvents(workspaceId, [event]);
    await this.workspaceRepository.saveSnapshot(aggregate.state);
    return snapshot;
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  }
}
