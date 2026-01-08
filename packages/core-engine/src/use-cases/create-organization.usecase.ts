import { CreateOrganizationCommand } from '../commands/create-organization.command';
import { WorkspaceRepositoryPort, Workspace } from '../ports/workspace.repository.port';

export class CreateOrganizationUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepositoryPort) {}

  async execute(command: CreateOrganizationCommand): Promise<string> {
    // Validate
    if (!command.name || command.name.trim().length === 0) {
      throw new Error('Organization name cannot be empty');
    }

    // Create workspace with organization type
    const workspaceId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    const workspace: Workspace = {
      workspaceId,
      accountId: command.accountId,
      type: 'organization',
      name: command.name.trim(),
      ownerUserId: command.ownerUserId,
      members: [
        {
          userId: command.ownerUserId,
          role: 'owner'
        }
      ],
      createdAt: new Date().toISOString(),
      modules: []
    };

    // Save via repository port
    return await this.workspaceRepository.save(workspace);
  }
}
