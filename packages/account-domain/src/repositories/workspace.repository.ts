import { AccountId, WorkspaceId } from '../types/identifiers';

/**
 * Minimal event shape for workspace-scoped event sourcing.
 * Kept generic to stay compatible with DomainEvent without introducing cross-package dependencies.
 */
export interface WorkspaceEvent<TPayload = unknown> {
  aggregateId: string;
  payload: TPayload;
  metadata: {
    actorId: AccountId;
    traceId?: string;
    causedBy?: string[];
    occurredAt: string;
  };
  eventType?: string;
  accountId?: AccountId;
  workspaceId?: WorkspaceId;
  moduleKey?: string;
}

/**
 * Minimal workspace snapshot shape; richer domain snapshots remain structurally compatible.
 */
export interface WorkspaceSnapshotBase {
  workspaceId: WorkspaceId;
  accountId?: AccountId;
  workspaceType?: string;
  modules?: unknown[];
  createdAt?: string;
  name?: string;
  members?: unknown[];
  ownerAccountId?: AccountId;
}

/**
 * Workspace repository port shared by domain/application layers.
 */
export interface WorkspaceRepository<
  TSnapshot = WorkspaceSnapshotBase,
  TEvent = WorkspaceEvent<TSnapshot>
> {
  appendWorkspaceEvent(event: TEvent): Promise<void>;
  saveWorkspaceSnapshot(snapshot: TSnapshot): Promise<void>;
  getWorkspaceSnapshot(workspaceId: WorkspaceId): Promise<TSnapshot | null>;
  listWorkspaces(): Promise<TSnapshot[]>;
}
