import { AccountId, ModuleKey, WorkspaceId } from '@account-domain';
import { ModuleStatus } from '@account-domain';

export interface CreateTeamCommand {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  teamName: string;
  organizationId: WorkspaceId; // Team must belong to an organization
  actorId?: AccountId;
  moduleKey?: ModuleKey;
  modules?: ModuleStatus[];
  causedBy?: string[];
  traceId?: string;
  createdAt?: string;
}
