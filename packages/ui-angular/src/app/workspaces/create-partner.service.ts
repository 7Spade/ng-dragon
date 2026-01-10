import { Injectable, inject } from '@angular/core';
import { CreateOrganizationService } from '@platform-adapters';

@Injectable({ providedIn: 'root' })
export class CreatePartnerService {
  private readonly createWorkspace = inject(CreateOrganizationService);

  async createPartner(input: { accountId: string; organizationId?: string; partnerName: string; actorId?: string }): Promise<string> {
    return this.createWorkspace.createOrganization({
      accountId: input.accountId,
      organizationId: input.organizationId,
      partnerName: input.partnerName,
      ownerUserId: input.accountId,
      actorId: input.actorId ?? input.accountId,
      workspaceType: 'partner'
    });
  }
}
