/**
 * Permissions Module Types
 * Provides types for workspace permission management
 */

import { WorkspaceId, AccountId } from '../../types/identifiers';

/**
 * Permission type for workspace resources
 */
export type PermissionType = 
  | 'read'
  | 'write'
  | 'delete'
  | 'manage'
  | 'admin'
  | 'documents.read'
  | 'documents.write'
  | 'documents.delete'
  | 'tasks.read'
  | 'tasks.write'
  | 'tasks.delete'
  | 'members.read'
  | 'members.write'
  | 'settings.read'
  | 'settings.write';

/**
 * Permission scope
 */
export type PermissionScope = 'workspace' | 'document' | 'task' | 'member';

/**
 * Permission entity
 */
export interface Permission {
  permissionId: string;
  workspaceId: WorkspaceId;
  userId: AccountId;
  permission: PermissionType;
  scope: PermissionScope;
  resourceId?: string;
  grantedBy: AccountId;
  grantedAt: string;
  expiresAt?: string;
}

/**
 * Permission grant input
 */
export interface PermissionGrantInput {
  userId: AccountId;
  permission: PermissionType;
  scope: PermissionScope;
  resourceId?: string;
  expiresAt?: string;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  permission: PermissionType;
  reason?: string;
}
