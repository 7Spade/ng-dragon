/**
 * Factory helper functions for workspace creation
 */
import { WorkspaceAggregate, WorkspaceSnapshot, WorkspaceCreationInput, AccountId } from '@workspace-domain';
/**
 * Raw workspace data (e.g., from API or database)
 */
export interface RawWorkspaceData {
    id: string;
    accountId: string;
    type: string;
    name?: string;
    ownerId?: string;
    members?: Array<{
        accountId: string;
        role: string;
        accountType?: string;
    }>;
    modules?: Array<{
        key: string;
        type: string;
        enabled: boolean;
    }>;
    createdAt?: string;
}
/**
 * Create workspace factory function
 */
export declare function createWorkspaceFactory(defaultActorId: AccountId): (input: WorkspaceCreationInput) => WorkspaceAggregate;
/**
 * Build workspace aggregate from raw data
 */
export declare function buildWorkspaceFromData(data: RawWorkspaceData, actorId: AccountId): WorkspaceAggregate;
/**
 * Create workspace from snapshot
 */
export declare function createFromSnapshot(snapshot: WorkspaceSnapshot): WorkspaceAggregate;
/**
 * Clone workspace aggregate
 */
export declare function cloneWorkspace(aggregate: WorkspaceAggregate): WorkspaceAggregate;
//# sourceMappingURL=factory.d.ts.map