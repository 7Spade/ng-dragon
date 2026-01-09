// Re-export the workspace repository port from the domain layer to keep dependency
// direction flowing from core-engine -> account-domain (never the inverse).
export type {
  WorkspaceEvent,
  WorkspaceRepository,
  WorkspaceSnapshotBase,
} from '@account-domain';
