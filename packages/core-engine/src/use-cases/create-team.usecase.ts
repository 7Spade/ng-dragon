import { CreateTeamCommand } from '../commands/create-team.command';
import { WorkspaceRepositoryPort, Workspace } from '../ports/workspace.repository.port';

export class CreateTeamUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepositoryPort) {}

  async execute(command: CreateTeamCommand): Promise<string> {
    // Load workspace
    const workspace = await this.workspaceRepository.load(command.workspaceId);
    
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Business rule validation: Only organization workspaces can have teams
    if (workspace.type !== 'organization') {
      throw new Error('Only organization workspaces can have teams');
    }

    // Validate team name
    if (!command.teamName || command.teamName.trim().length === 0) {
      throw new Error('Team name cannot be empty');
    }

    // Business rule: Only workspace members can create teams
    const isWorkspaceMember = workspace.members?.some(m => m.userId === command.createdByUserId);
    if (!isWorkspaceMember) {
      throw new Error('Only workspace members can create teams');
    }

    // Check if team name already exists
    const teamExists = workspace.teams?.some(t => t.teamName === command.teamName.trim());
    if (teamExists) {
      throw new Error('Team with this name already exists in the workspace');
    }

    // Generate team ID
    const teamId = `team-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    const timestamp = new Date().toISOString();

    // Create updated workspace with new team
    const updatedWorkspace: Workspace = {
      ...workspace,
      teams: [
        ...(workspace.teams || []),
        {
          teamId,
          teamName: command.teamName.trim(),
          createdAt: timestamp
        }
      ]
    };

    // Save via repository port
    await this.workspaceRepository.save(updatedWorkspace);
    
    return teamId;
  }
}
