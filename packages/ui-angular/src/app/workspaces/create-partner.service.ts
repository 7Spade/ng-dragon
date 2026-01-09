import { Injectable, inject } from '@angular/core';
import { WorkspaceApplicationService, CreatePartnerCommand } from '@saas-domain';

@Injectable({ providedIn: 'root' })
export class CreatePartnerService {
  private readonly workspaceAppService = inject(WorkspaceApplicationService);

  async createPartner(command: CreatePartnerCommand): Promise<string> {
    return this.workspaceAppService.createPartner(command);
  }
}
