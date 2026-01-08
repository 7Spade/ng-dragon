export interface TeamCreatedEvent {
  workspaceId: string;
  teamId: string;
  teamName: string;
  createdByUserId: string;
  timestamp: string;
}
