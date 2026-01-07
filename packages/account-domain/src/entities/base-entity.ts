import { EntityId, ModuleKey, WorkspaceId } from '../types/identifiers';

// Minimal shape for any module-scoped entity stored within a workspace boundary.
export interface ModuleScopedEntity {
  entityId: EntityId;
  workspaceId: WorkspaceId;
  moduleKey: ModuleKey;
  createdAt: string;
  updatedAt?: string;
}
