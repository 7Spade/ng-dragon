/**
 * Workspace Logic Container
 * Encapsulates workspace business logic and validation
 */
import { hasAdminPrivileges, canManageWorkspace } from '../value-objects/member-role';
/**
 * Workspace Logic Container
 * Domain service for workspace business logic
 */
export class WorkspaceLogicContainer {
    /**
     * Validate workspace creation input
     */
    static validateWorkspaceCreation(workspaceType, name, ownerAccountId) {
        const errors = [];
        // Validate workspace type
        if (!workspaceType) {
            errors.push('Workspace type is required');
        }
        // Validate name for non-personal workspaces
        if (workspaceType !== 'personal' && (!name || name.trim().length === 0)) {
            errors.push('Workspace name is required for non-personal workspaces');
        }
        // Validate name length
        if (name && name.length > 100) {
            errors.push('Workspace name must be 100 characters or less');
        }
        // Validate owner account ID
        if (!ownerAccountId || ownerAccountId.trim().length === 0) {
            errors.push('Owner account ID is required');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    /**
     * Check if account can manage workspace
     */
    static canAccountManageWorkspace(workspace, accountId) {
        // Owner always has permission
        if (workspace.ownerAccountId === accountId) {
            return { allowed: true };
        }
        // Check member role
        const member = workspace.members.find(m => m.accountId === accountId);
        if (!member) {
            return { allowed: false, reason: 'Not a member of this workspace' };
        }
        if (canManageWorkspace(member.role)) {
            return { allowed: true };
        }
        return { allowed: false, reason: 'Insufficient permissions' };
    }
    /**
     * Check if account can enable/disable modules
     */
    static canAccountManageModules(workspace, accountId) {
        // Owner always has permission
        if (workspace.ownerAccountId === accountId) {
            return { allowed: true };
        }
        // Check member role - need admin privileges
        const member = workspace.members.find(m => m.accountId === accountId);
        if (!member) {
            return { allowed: false, reason: 'Not a member of this workspace' };
        }
        if (hasAdminPrivileges(member.role)) {
            return { allowed: true };
        }
        return { allowed: false, reason: 'Requires admin privileges' };
    }
    /**
     * Check if account can invite members
     */
    static canAccountInviteMembers(workspace, accountId) {
        return this.canAccountManageWorkspace(workspace, accountId);
    }
    /**
     * Get member role for account
     */
    static getMemberRole(workspace, accountId) {
        const member = workspace.members.find(m => m.accountId === accountId);
        return member?.role ?? null;
    }
    /**
     * Check if workspace is personal
     */
    static isPersonalWorkspace(workspace) {
        return workspace.workspaceType === 'personal';
    }
    /**
     * Check if workspace is organization
     */
    static isOrganizationWorkspace(workspace) {
        return workspace.workspaceType === 'organization';
    }
    /**
     * Get workspace display name
     */
    static getDisplayName(workspace, fallback = 'Workspace') {
        if (workspace.name)
            return workspace.name;
        if (workspace.workspaceType === 'personal')
            return 'Personal';
        return fallback;
    }
    /**
     * Count active modules
     */
    static countActiveModules(workspace) {
        return workspace.modules.filter(m => m.enabled).length;
    }
    /**
     * Count total members
     */
    static countMembers(workspace) {
        return workspace.members.length;
    }
    /**
     * Validate member addition
     */
    static validateMemberAddition(workspace, newMemberAccountId, role) {
        const errors = [];
        // Check if already a member
        if (workspace.members.some(m => m.accountId === newMemberAccountId)) {
            errors.push('Account is already a member of this workspace');
        }
        // Validate role
        if (!role) {
            errors.push('Member role is required');
        }
        // Personal workspaces can only have one member
        if (workspace.workspaceType === 'personal' && workspace.members.length > 0) {
            errors.push('Personal workspaces can only have one member');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
//# sourceMappingURL=workspace-logic-container.js.map