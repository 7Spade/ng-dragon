import { Injectable } from '@angular/core';
import { CreateOrganizationClient, CreateOrganizationCommand } from '@ng-events/platform-adapters';

@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
  constructor(private readonly client: CreateOrganizationClient) {}

  async createOrganization(command: CreateOrganizationCommand): Promise<string> {
    return this.client.createOrganization(command);
  }
}
