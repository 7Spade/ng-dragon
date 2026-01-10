import { AccountId, ModuleStatus, WorkspaceId } from '@account-domain';

export interface CreateProjectCommand {
  workspaceId?: WorkspaceId;
  accountId: AccountId;
  organizationId?: WorkspaceId;
  projectName: string;
  description?: string;
  ownerUserId: AccountId;
  actorId?: AccountId;
  modules?: ModuleStatus[];
  traceId?: string;
  causedBy?: string[];
  createdAt?: string;
}
