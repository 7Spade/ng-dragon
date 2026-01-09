import { DomainEvent, WorkspaceId, WorkspaceSnapshot } from '@account-domain';

export interface WorkspaceRepository {
  appendWorkspaceEvent(event: DomainEvent<WorkspaceSnapshot>): Promise<void>;
  saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void>;
  getWorkspaceSnapshot(workspaceId: WorkspaceId): Promise<WorkspaceSnapshot | null>;
  listWorkspaces(): Promise<WorkspaceSnapshot[]>;
}
