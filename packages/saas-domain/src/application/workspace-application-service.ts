import { createorganizationcommand } from '../commands/create-organization-command';
import { workspacefactory } from '../domain/workspace-factory';
import { WorkspaceCreatedEvent } from '../events/WorkspaceCreatedEvent';
import { WorkspaceRepository } from '../repositories/WorkspaceRepository';

export class workspaceapplicationservice {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceFactory: workspacefactory = new workspacefactory()
  ) {}

  async createOrganization(command: createorganizationcommand): Promise<WorkspaceCreatedEvent> {
    const { snapshot, event } = this.workspaceFactory.createOrganization(command);
    await this.workspaceRepository.appendWorkspaceEvent(event);
    await this.workspaceRepository.saveWorkspaceSnapshot(snapshot);
    return event;
  }
}
