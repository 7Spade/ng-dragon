import { Injectable } from '@angular/core';
import { CreateOrganizationCommand, CreateOrganizationUseCase } from '@ng-events/core-engine';
import { WorkspaceClientRepository } from './workspace.repository.client';

// Frontend-safe organization creation using @angular/fire repository
@Injectable({ providedIn: 'root' })
export class CreateOrganizationClient {
  private readonly useCase: CreateOrganizationUseCase;

  constructor(private readonly repository: WorkspaceClientRepository) {
    this.useCase = new CreateOrganizationUseCase(this.repository);
  }

  async createOrganization(command: CreateOrganizationCommand): Promise<string> {
    return this.useCase.execute(command);
  }
}
