import { WorkspaceSnapshot } from '../aggregates/workspace.aggregate';
import { WorkspaceCreatedEvent } from '../events/workspace-created.event';

export interface WorkspaceRepository {
  appendWorkspaceEvent(event: WorkspaceCreatedEvent): Promise<void>;
  saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void>;
  getWorkspaceSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null>;
  listWorkspaces(): Promise<WorkspaceSnapshot[]>;
}
