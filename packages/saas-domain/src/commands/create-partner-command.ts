import { AccountId, ModuleKey, WorkspaceId } from '@account-domain';
import { ModuleStatus } from '@account-domain';

/**
 * Command to create a new partner workspace
 * Partners are sub-units of organizations, similar to teams
 */
export interface CreatePartnerCommand {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  partnerName: string;
  organizationId: WorkspaceId; // Partner must belong to an organization
  actorId?: AccountId;
  moduleKey?: ModuleKey;
  modules?: ModuleStatus[];
  causedBy?: string[];
  traceId?: string;
  createdAt?: string;
}
