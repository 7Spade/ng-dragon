import { AccountId, ModuleKey, ModuleStatus, WorkspaceId, WorkspaceType } from '@account-domain';

export interface CreateTeamCommand {
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
