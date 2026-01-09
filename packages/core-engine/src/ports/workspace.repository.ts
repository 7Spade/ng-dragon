import { DomainEvent, WorkspaceId, WorkspaceSnapshot } from '@account-domain';

/**
 * Workspace repository port shared by domain/application layers.
 * Implements Event Sourcing persistence with workspace-scoped metadata.
 */
export interface WorkspaceRepository {
  appendWorkspaceEvent(event: DomainEvent<WorkspaceSnapshot>): Promise<void>;
  saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void>;
  getWorkspaceSnapshot(workspaceId: WorkspaceId): Promise<WorkspaceSnapshot | null>;
  listWorkspaces(): Promise<WorkspaceSnapshot[]>;
}
