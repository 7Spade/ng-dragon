/**
 * Workspace Logic Container
 * Encapsulates workspace business logic and validation
 */
import { AccountId } from '../types/identifiers';
import { WorkspaceSnapshot } from '../aggregates/workspace.aggregate';
import { WorkspaceType } from '../value-objects/workspace-type';
import { MemberRole } from '../value-objects/member-role';
/**
 * Workspace validation result
 */
export interface WorkspaceValidationResult {
    isValid: boolean;
    errors: string[];
}
/**
 * Workspace permission check result
 */
export interface PermissionCheckResult {
    allowed: boolean;
    reason?: string;
}
/**
 * Workspace Logic Container
 * Domain service for workspace business logic
 */
export declare class WorkspaceLogicContainer {
    /**
     * Validate workspace creation input
     */
    static validateWorkspaceCreation(workspaceType: WorkspaceType, name: string | undefined, ownerAccountId: AccountId): WorkspaceValidationResult;
    /**
     * Check if account can manage workspace
     */
    static canAccountManageWorkspace(workspace: WorkspaceSnapshot, accountId: AccountId): PermissionCheckResult;
    /**
     * Check if account can enable/disable modules
     */
    static canAccountManageModules(workspace: WorkspaceSnapshot, accountId: AccountId): PermissionCheckResult;
    /**
     * Check if account can invite members
     */
    static canAccountInviteMembers(workspace: WorkspaceSnapshot, accountId: AccountId): PermissionCheckResult;
    /**
     * Get member role for account
     */
    static getMemberRole(workspace: WorkspaceSnapshot, accountId: AccountId): MemberRole | null;
    /**
     * Check if workspace is personal
     */
    static isPersonalWorkspace(workspace: WorkspaceSnapshot): boolean;
    /**
     * Check if workspace is organization
     */
    static isOrganizationWorkspace(workspace: WorkspaceSnapshot): boolean;
    /**
     * Get workspace display name
     */
    static getDisplayName(workspace: WorkspaceSnapshot, fallback?: string): string;
    /**
     * Count active modules
     */
    static countActiveModules(workspace: WorkspaceSnapshot): number;
    /**
     * Count total members
     */
    static countMembers(workspace: WorkspaceSnapshot): number;
    /**
     * Validate member addition
     */
    static validateMemberAddition(workspace: WorkspaceSnapshot, newMemberAccountId: AccountId, role: MemberRole): WorkspaceValidationResult;
}
//# sourceMappingURL=workspace-logic-container.d.ts.map