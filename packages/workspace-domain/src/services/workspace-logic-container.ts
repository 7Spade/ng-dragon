/**
 * Workspace Logic Container
 * Encapsulates workspace business logic and validation
 */

import { AccountId, WorkspaceId } from '../types/identifiers';
import { WorkspaceSnapshot, WorkspaceMember } from '../aggregates/workspace.aggregate';
import { WorkspaceType } from '../value-objects/workspace-type';
import { MemberRole, hasAdminPrivileges, canManageWorkspace } from '../value-objects/member-role';

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
export class WorkspaceLogicContainer {
  /**
   * Validate workspace creation input
   */
  static validateWorkspaceCreation(
    workspaceType: WorkspaceType,
    name: string | undefined,
    ownerAccountId: AccountId
  ): WorkspaceValidationResult {
    const errors: string[] = [];

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
  static canAccountManageWorkspace(
    workspace: WorkspaceSnapshot,
    accountId: AccountId
  ): PermissionCheckResult {
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
  static canAccountManageModules(
    workspace: WorkspaceSnapshot,
    accountId: AccountId
  ): PermissionCheckResult {
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
  static canAccountInviteMembers(
    workspace: WorkspaceSnapshot,
    accountId: AccountId
  ): PermissionCheckResult {
    return this.canAccountManageWorkspace(workspace, accountId);
  }

  /**
   * Get member role for account
   */
  static getMemberRole(
    workspace: WorkspaceSnapshot,
    accountId: AccountId
  ): MemberRole | null {
    const member = workspace.members.find(m => m.accountId === accountId);
    return member?.role ?? null;
  }

  /**
   * Check if workspace is personal
   */
  static isPersonalWorkspace(workspace: WorkspaceSnapshot): boolean {
    return workspace.workspaceType === 'personal';
  }

  /**
   * Check if workspace is organization
   */
  static isOrganizationWorkspace(workspace: WorkspaceSnapshot): boolean {
    return workspace.workspaceType === 'organization';
  }

  /**
   * Get workspace display name
   */
  static getDisplayName(workspace: WorkspaceSnapshot, fallback: string = 'Workspace'): string {
    if (workspace.name) return workspace.name;
    if (workspace.workspaceType === 'personal') return 'Personal';
    return fallback;
  }

  /**
   * Count active modules
   */
  static countActiveModules(workspace: WorkspaceSnapshot): number {
    return workspace.modules.filter(m => m.enabled).length;
  }

  /**
   * Count total members
   */
  static countMembers(workspace: WorkspaceSnapshot): number {
    return workspace.members.length;
  }

  /**
   * Validate member addition
   */
  static validateMemberAddition(
    workspace: WorkspaceSnapshot,
    newMemberAccountId: AccountId,
    role: MemberRole
  ): WorkspaceValidationResult {
    const errors: string[] = [];

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
