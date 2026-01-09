/**
 * Minimal event shape to avoid cross-layer coupling with domain packages.
 * Domain events (e.g. account-domain DomainEvent) are structurally compatible.
 */
export interface WorkspaceEvent<TPayload = unknown> {
  aggregateId: string;
  payload: TPayload;
  metadata: {
    actorId: string;
    traceId?: string;
    causedBy?: string[];
    occurredAt: string;
  };
  eventType?: string;
  accountId?: string;
  workspaceId?: string;
  moduleKey?: string;
}

// Minimal snapshot shape; richer domain snapshots remain structurally compatible.
export interface WorkspaceSnapshotBase {
  workspaceId: string;
  accountId?: string;
  workspaceType?: string;
  modules?: unknown[];
  createdAt?: string;
  name?: string;
  members?: unknown[];
  ownerAccountId?: string;
}

/**
 * Workspace repository port shared by domain/application layers.
 * Implements Event Sourcing persistence with workspace-scoped metadata.
 */
export interface WorkspaceRepository<TSnapshot = WorkspaceSnapshotBase, TEvent = WorkspaceEvent<TSnapshot>> {
  appendWorkspaceEvent(event: TEvent): Promise<void>;
  saveWorkspaceSnapshot(snapshot: TSnapshot): Promise<void>;
  getWorkspaceSnapshot(workspaceId: string): Promise<TSnapshot | null>;
  listWorkspaces(): Promise<TSnapshot[]>;
}
