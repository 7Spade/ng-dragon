import { WorkspaceSnapshot } from '@account-domain';
import { WorkspaceCreatedEvent } from '../events/WorkspaceCreatedEvent';
import { WorkspaceType } from '@account-domain';

export interface WorkspaceRepository {
  appendWorkspaceEvent(event: WorkspaceCreatedEvent): Promise<void>;
  saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void>;
  getWorkspaceSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null>;
  listWorkspaces(filter?: { workspaceType?: WorkspaceType; accountId?: string }): Promise<WorkspaceSnapshot[]>;
}
