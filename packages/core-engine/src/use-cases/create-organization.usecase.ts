import { DomainEvent, EventContext, WorkspaceAggregate, WorkspaceSnapshot } from '@account-domain';

import { CreateOrganizationCommand } from '../commands/create-organization.command';
import { WorkspaceRepositoryPort } from '../ports/workspace.repository.port';

const randomWorkspaceId = () => `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export class CreateOrganizationUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepositoryPort) {}

  async execute(command: CreateOrganizationCommand): Promise<string> {
    if (!command.organizationName || command.organizationName.trim().length === 0) {
      throw new Error('Organization name cannot be empty');
    }

    const workspaceId = command.workspaceId ?? randomWorkspaceId();
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

    await this.workspaceRepository.appendWorkspaceEvent(event as DomainEvent<WorkspaceSnapshot>);
    await this.workspaceRepository.saveWorkspaceSnapshot(aggregate.state);

    return workspaceId;
  }
}
