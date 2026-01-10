import { CreateOrganizationCommand } from '../commands/create-organization-command';
import { WorkspaceFactory } from '../domain/workspace-factory';
import { WorkspaceCreatedEvent } from '../events/workspace-created.event';
import { WorkspaceRepository } from '../repositories/workspace-repository';

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

  async createTeam(command: CreateOrganizationCommand): Promise<WorkspaceCreatedEvent> {
    const { snapshot, event } = this.workspaceFactory.createWorkspace(command, 'team');
    await this.workspaceRepository.appendWorkspaceEvent(event);
    await this.workspaceRepository.saveWorkspaceSnapshot(snapshot);
    return event;
  }

  async createPartner(command: CreateOrganizationCommand): Promise<WorkspaceCreatedEvent> {
    const { snapshot, event } = this.workspaceFactory.createWorkspace(command, 'partner');
    await this.workspaceRepository.appendWorkspaceEvent(event);
    await this.workspaceRepository.saveWorkspaceSnapshot(snapshot);
    return event;
  }

  async createProject(command: CreateOrganizationCommand): Promise<WorkspaceCreatedEvent> {
    const { snapshot, event } = this.workspaceFactory.createWorkspace(command, 'project');
    await this.workspaceRepository.appendWorkspaceEvent(event);
    await this.workspaceRepository.saveWorkspaceSnapshot(snapshot);
    return event;
  }
}
