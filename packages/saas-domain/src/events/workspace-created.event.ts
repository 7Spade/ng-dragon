export interface WorkspaceCreatedEvent {
  workspaceId: string;
  accountId: string;
  type: 'organization' | 'team' | 'project';
  name: string;
  ownerUserId: string;
  timestamp: string;
}
