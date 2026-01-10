import { AccountId, ModuleStatus, WorkspaceId } from '@account-domain';

export interface CreatePartnerCommand {
  workspaceId?: WorkspaceId;
  accountId: AccountId;
  organizationId?: WorkspaceId;
  partnerName: string;
  ownerUserId: AccountId;
  actorId?: AccountId;
  modules?: ModuleStatus[];
  traceId?: string;
  causedBy?: string[];
  createdAt?: string;
}
