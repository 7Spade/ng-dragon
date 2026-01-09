import { AccountId, ModuleKey, WorkspaceId, ModuleStatus, WorkspaceType } from '@account-domain';

export interface CreateOrganizationCommand {
  workspaceId?: WorkspaceId;
  accountId: AccountId;
  organizationName: string;
  ownerUserId: AccountId;
  actorId?: AccountId;
  moduleKey?: ModuleKey;
  modules?: ModuleStatus[];
  workspaceType?: WorkspaceType;
  causedBy?: string[];
  traceId?: string;
  createdAt?: string;
}
