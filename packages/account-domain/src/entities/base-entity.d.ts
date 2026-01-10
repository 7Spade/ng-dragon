import { EntityId, ModuleKey, WorkspaceId } from '../types/identifiers';
export interface ModuleScopedEntity {
    entityId: EntityId;
    workspaceId: WorkspaceId;
    moduleKey: ModuleKey;
    createdAt: string;
    updatedAt?: string;
}
//# sourceMappingURL=base-entity.d.ts.map