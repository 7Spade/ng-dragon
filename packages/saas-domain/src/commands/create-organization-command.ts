import { AccountId, ModuleKey, WorkspaceId, ModuleStatus } from '@account-domain';

export interface CreateOrganizationCommand {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  organizationName: string;
  ownerUserId: AccountId;
  actorId?: AccountId;
  moduleKey?: ModuleKey;
  modules?: ModuleStatus[];
  causedBy?: string[];
  traceId?: string;
  createdAt?: string;
}
