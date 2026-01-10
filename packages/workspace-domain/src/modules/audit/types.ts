/**
 * Audit Module Types
 * Provides types for workspace audit logging
 */

import { WorkspaceId, AccountId } from '../../types/identifiers';

/**
 * Audit action type
 */
export type AuditActionType =
  | 'workspace.created'
  | 'workspace.updated'
  | 'workspace.deleted'
  | 'document.created'
  | 'document.updated'
  | 'document.deleted'
  | 'task.created'
  | 'task.updated'
  | 'task.deleted'
  | 'member.added'
  | 'member.removed'
  | 'member.role_updated'
  | 'permission.granted'
  | 'permission.revoked'
  | 'settings.updated';

/**
 * Audit action severity
 */
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Audit action input
 */
export interface AuditAction {
  actionType: AuditActionType;
  actorId: AccountId;
  resourceType: string;
  resourceId: string;
  details?: Record<string, any>;
  severity?: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit log entry
 */
export interface AuditLog {
  logId: string;
  workspaceId: WorkspaceId;
  actionType: AuditActionType;
  actorId: AccountId;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  severity: AuditSeverity;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit query options
 */
export interface AuditQueryOptions {
  actionType?: AuditActionType;
  actorId?: AccountId;
  resourceType?: string;
  resourceId?: string;
  severity?: AuditSeverity;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
