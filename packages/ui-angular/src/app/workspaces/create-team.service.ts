import { Injectable, inject } from '@angular/core';
import { CreateTeamCommand } from '@core-engine/commands/create-team.command';
import { CreateTeamUseCase } from '@core-engine/use-cases/create-team.usecase';
import { WorkspaceRepositoryClient } from './workspace.repository.client';
import { FirebaseAuthBridgeService } from '@core';

/**
 * Angular service that wires CreateTeamUseCase with repository
 * Follows clean architecture: UI -> Service -> UseCase -> Repository
 */
@Injectable({ providedIn: 'root' })
export class CreateTeamService {
  private authService = inject(FirebaseAuthBridgeService);
  private repository = new WorkspaceRepositoryClient();

  async createTeam(command: CreateTeamCommand): Promise<string> {
    // Get current user from auth
    const currentUser = await this.authService.currentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Fill in creatorUserId from auth context
    const fullCommand: CreateTeamCommand = {
      ...command,
      creatorUserId: currentUser.uid
    };

    // Create use case instance with repository
    const useCase = new CreateTeamUseCase(this.repository);
    
    // Execute use case
    return await useCase.execute(fullCommand);
  }
}
