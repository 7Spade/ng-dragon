import { CreateOrganizationCommand } from '../commands/create-organization-command';
import { WorkspaceFactory } from '../domain/workspace-factory';
import { WorkspaceCreatedEvent } from '../events/WorkspaceCreatedEvent';
import { WorkspaceRepository } from '../repositories/WorkspaceRepository';

export class WorkspaceApplicationService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceFactory: WorkspaceFactory = new WorkspaceFactory()
  ) {}

  async createOrganization(command: CreateOrganizationCommand): Promise<WorkspaceCreatedEvent> {
    const { snapshot, event } = this.workspaceFactory.createOrganization(command);
    await this.workspaceRepository.appendWorkspaceEvent(event);
    await this.workspaceRepository.saveWorkspaceSnapshot(snapshot);
    return event;
  }
}
