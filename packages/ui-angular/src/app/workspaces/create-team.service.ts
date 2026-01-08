import { Injectable, inject } from '@angular/core';
import { CreateTeamUseCase } from '@core-engine';
import { WorkspaceRepositoryClient } from './workspace.repository.client';
import { CreateTeamCommand } from '@core-engine';

@Injectable({ providedIn: 'root' })
export class CreateTeamService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly useCase: CreateTeamUseCase;

  constructor() {
    // Wire up dependencies: UseCase -> Repository (@angular/fire - client SDK)
    this.useCase = new CreateTeamUseCase(this.repository);
  }

  async createTeam(command: CreateTeamCommand): Promise<string> {
    return await this.useCase.execute(command);
  }
}
