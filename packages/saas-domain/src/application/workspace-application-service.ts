import { CreateOrganizationCommand } from '../commands/create-organization-command';
import { CreateTeamCommand } from '../commands/create-team-command';
import { CreatePartnerCommand } from '../commands/create-partner-command';
import { CreateProjectCommand } from '../commands/create-project-command';
import { WorkspaceFactory } from '../domain-services/workspace-factory';
import { WorkspaceCreatedEvent } from '../events/WorkspaceCreatedEvent';
import { WorkspaceRepository } from '../repositories/WorkspaceRepository';
import { WorkspaceSnapshot, WorkspaceType } from '@account-domain';

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

  async createTeam(command: CreateTeamCommand): Promise<WorkspaceCreatedEvent> {
    const { snapshot, event } = this.workspaceFactory.createTeam(command);
    await this.workspaceRepository.appendWorkspaceEvent(event);
    await this.workspaceRepository.saveWorkspaceSnapshot(snapshot);
    return event;
  }

  async createPartner(command: CreatePartnerCommand): Promise<WorkspaceCreatedEvent> {
    const { snapshot, event } = this.workspaceFactory.createPartner(command);
    await this.workspaceRepository.appendWorkspaceEvent(event);
    await this.workspaceRepository.saveWorkspaceSnapshot(snapshot);
    return event;
  }

  async createProject(command: CreateProjectCommand): Promise<WorkspaceCreatedEvent> {
    const { snapshot, event } = this.workspaceFactory.createProject(command);
    await this.workspaceRepository.appendWorkspaceEvent(event);
    await this.workspaceRepository.saveWorkspaceSnapshot(snapshot);
    return event;
  }

  async listWorkspaces(filter?: { workspaceType?: WorkspaceType; accountId?: string }): Promise<WorkspaceSnapshot[]> {
    return this.workspaceRepository.listWorkspaces(filter);
  }

  async listProjects(accountId: string): Promise<WorkspaceSnapshot[]> {
    return this.workspaceRepository.listWorkspaces({ workspaceType: 'project', accountId });
  }
}
