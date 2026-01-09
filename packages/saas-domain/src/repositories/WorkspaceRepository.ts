import { WorkspaceSnapshot } from '@account-domain';
import { WorkspaceCreatedEvent } from '../events/WorkspaceCreatedEvent';

export interface WorkspaceRepository {
  appendWorkspaceEvent(event: WorkspaceCreatedEvent): Promise<void>;
  saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void>;
  getWorkspaceSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null>;
  listWorkspaces(): Promise<WorkspaceSnapshot[]>;
}
