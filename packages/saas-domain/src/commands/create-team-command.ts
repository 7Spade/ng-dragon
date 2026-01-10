import { AccountId, ModuleStatus, WorkspaceId } from '@account-domain';

export interface CreateTeamCommand {
  workspaceId?: WorkspaceId;
  accountId: AccountId;
  organizationId?: WorkspaceId;
  teamName: string;
  ownerUserId: AccountId;
  actorId?: AccountId;
  modules?: ModuleStatus[];
  traceId?: string;
  causedBy?: string[];
  createdAt?: string;
}
