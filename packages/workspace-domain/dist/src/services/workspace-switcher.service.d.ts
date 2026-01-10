/**
 * Workspace Switcher Service
 * Abstract domain service for workspace switching logic
 */
import { WorkspaceId, AccountId } from '../types/identifiers';
import { WorkspaceSnapshot } from '../aggregates/workspace.aggregate';
import { WorkspaceType } from '../value-objects/workspace-type';
/**
 * Workspace view for UI/presentation layer
 */
export interface WorkspaceView {
    id: string;
    workspaceId: WorkspaceId;
    accountId: AccountId;
    workspaceType: WorkspaceType;
    name?: string;
    ownerAccountId?: AccountId;
    memberIds?: AccountId[];
    modules: Array<{
        moduleKey: string;
        moduleType: string;
        enabled: boolean;
    }>;
    members: Array<{
        accountId: AccountId;
        role: string;
        accountType: string;
    }>;
    createdAt: string;
}
/**
 * Workspace selection state
 */
export interface WorkspaceSelectionState {
    activeWorkspaceId: WorkspaceId | null;
    previousWorkspaceId: WorkspaceId | null;
    selectionTimestamp: string;
}
/**
 * Workspace switcher configuration
 */
export interface WorkspaceSwitcherConfig {
    defaultWorkspaceType: WorkspaceType;
    enablePersistence: boolean;
    persistenceKey?: string;
}
/**
 * Abstract workspace switcher service
 * Domain service for managing workspace selection and switching
 */
export declare abstract class WorkspaceSwitcher {
    /**
     * Select and activate a workspace
     */
    abstract selectWorkspace(workspaceId: WorkspaceId, accountId: AccountId): Promise<void>;
    /**
     * Get currently active workspace
     */
    abstract getActiveWorkspace(): Promise<WorkspaceView | null>;
    /**
     * Get active workspace ID
     */
    abstract getActiveWorkspaceId(): WorkspaceId | null;
    /**
     * List available workspaces for an account
     */
    abstract listAvailableWorkspaces(accountId: AccountId): Promise<WorkspaceView[]>;
    /**
     * Switch to a specific workspace type (e.g., personal, organization)
     */
    abstract switchToWorkspaceType(type: WorkspaceType, accountId: AccountId): Promise<void>;
    /**
     * Reset to default workspace
     */
    abstract resetToDefault(accountId: AccountId): Promise<void>;
    /**
     * Get workspace selection state
     */
    abstract getSelectionState(): WorkspaceSelectionState;
    /**
     * Check if account is member of workspace
     */
    abstract isMemberOfWorkspace(workspaceId: WorkspaceId, accountId: AccountId): Promise<boolean>;
}
/**
 * Workspace switcher utilities
 */
export declare class WorkspaceSwitcherUtils {
    /**
     * Convert workspace snapshot to view
     */
    static snapshotToView(snapshot: WorkspaceSnapshot): WorkspaceView;
    /**
     * Filter workspaces by type
     */
    static filterByType(workspaces: WorkspaceView[], type: WorkspaceType): WorkspaceView[];
    /**
     * Filter workspaces owned by account
     */
    static filterOwnedBy(workspaces: WorkspaceView[], accountId: AccountId): WorkspaceView[];
    /**
     * Filter workspaces where account is member
     */
    static filterMemberships(workspaces: WorkspaceView[], accountId: AccountId): WorkspaceView[];
    /**
     * Pick default workspace from list
     */
    static pickDefaultWorkspace(workspaces: WorkspaceView[], accountId: AccountId): WorkspaceView | null;
}
//# sourceMappingURL=workspace-switcher.service.d.ts.map