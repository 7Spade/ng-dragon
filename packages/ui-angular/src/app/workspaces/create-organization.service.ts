import { Injectable, inject } from '@angular/core';
import { CreateOrganizationUseCase } from '@core-engine';
import { WorkspaceRepositoryClient } from './workspace.repository.client';
import { CreateOrganizationCommand } from '@core-engine';

@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
  private readonly repository = inject(WorkspaceRepositoryClient);
  private readonly useCase: CreateOrganizationUseCase;

  constructor() {
    // Wire up dependencies: UseCase -> Repository (@angular/fire - client SDK)
    this.useCase = new CreateOrganizationUseCase(this.repository);
  }

  async createOrganization(command: CreateOrganizationCommand): Promise<string> {
    return await this.useCase.execute(command);
  }
}
