import { AccountId, ModuleKey, WorkspaceId } from '@account-domain/src/types/identifiers';
import { ModuleStatus } from '@account-domain/src/value-objects/module-types';

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
