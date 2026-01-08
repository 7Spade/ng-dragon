import { Injectable } from '@angular/core';
import { CreateOrganizationUseCase } from '../../../../core-engine/src/use-cases/create-organization.usecase';
import { WorkspaceRepositoryFirebase } from '../../../../platform-adapters/src/firebase-platform/workspace.repository.firebase';
import { CreateOrganizationCommand } from '../../../../core-engine/src/commands/create-organization.command';

@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
  private readonly useCase: CreateOrganizationUseCase;

  constructor() {
    // Wire up dependencies: UseCase -> Repository (firebase-admin)
    const repository = new WorkspaceRepositoryFirebase();
    this.useCase = new CreateOrganizationUseCase(repository);
  }

  async createOrganization(command: CreateOrganizationCommand): Promise<string> {
    return await this.useCase.execute(command);
  }
}
