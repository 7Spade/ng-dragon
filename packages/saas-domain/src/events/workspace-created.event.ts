import { AccountId, WorkspaceId } from '@account-domain';

export interface WorkspaceCreatedEvent {
  workspaceId: WorkspaceId;
  accountId: AccountId;
  type: 'organization' | 'team' | 'project';
  name: string;
  ownerUserId: string;
  timestamp: string;
}
