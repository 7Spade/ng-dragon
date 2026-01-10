import { Injectable, inject } from '@angular/core';
import { CreateOrganizationService } from '@platform-adapters';

@Injectable({ providedIn: 'root' })
export class CreateTeamService {
  private readonly createWorkspace = inject(CreateOrganizationService);

  async createTeam(input: { accountId: string; organizationId?: string; teamName: string; actorId?: string }): Promise<string> {
    return this.createWorkspace.createOrganization({
      accountId: input.accountId,
      organizationId: input.organizationId,
      teamName: input.teamName,
      ownerUserId: input.accountId,
      actorId: input.actorId ?? input.accountId,
      workspaceType: 'team'
    });
  }
}
