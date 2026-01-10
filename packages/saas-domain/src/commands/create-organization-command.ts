import { AccountId, ModuleKey, WorkspaceId } from '@account-domain';
import { ModuleStatus } from '@account-domain';

export interface CreateOrganizationCommand {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  organizationName: string;
  actorId?: AccountId;
  moduleKey?: ModuleKey;
  modules?: ModuleStatus[];
  causedBy?: string[];
  traceId?: string;
  createdAt?: string;
}
