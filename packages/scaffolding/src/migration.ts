/**
 * Migration utilities for existing workspace data
 */

import {
  WorkspaceSnapshot,
  WorkspaceType,
  isValidWorkspaceType,
  ModuleStatus,
  WorkspaceMember
} from '@workspace-domain';
import { RawWorkspaceData } from './factory';

/**
 * Workspace schema version
 */
export type SchemaVersion = 'v1' | 'v2';

/**
 * Schema validation result
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate workspace schema
 */
export function validateWorkspaceSchema(data: RawWorkspaceData): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.id) {
    errors.push('Missing required field: id');
  }
  if (!data.accountId) {
    errors.push('Missing required field: accountId');
  }
  if (!data.type) {
    errors.push('Missing required field: type');
  } else if (!isValidWorkspaceType(data.type)) {
    errors.push(`Invalid workspace type: ${data.type}`);
  }

  // Optional fields validation
  if (data.name && data.name.length > 100) {
    warnings.push('Workspace name exceeds 100 characters');
  }

  if (data.members && !Array.isArray(data.members)) {
    errors.push('Members must be an array');
  }

  if (data.modules && !Array.isArray(data.modules)) {
    errors.push('Modules must be an array');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Migrate workspace data from legacy format
 */
export function migrateWorkspaceData(
  legacyData: any,
  targetVersion: SchemaVersion = 'v2'
): RawWorkspaceData {
  // Handle v1 to v2 migration
  if (targetVersion === 'v2') {
    return {
      id: legacyData.workspaceId || legacyData.id,
      accountId: legacyData.accountId || legacyData.userId,
      type: legacyData.workspaceType || legacyData.type || 'personal',
      name: legacyData.name,
      ownerId: legacyData.ownerAccountId || legacyData.ownerId || legacyData.accountId,
      members: legacyData.members || [],
      modules: legacyData.modules || [],
      createdAt: legacyData.createdAt || new Date().toISOString()
    };
  }

  // Default: return as-is
  return legacyData;
}

/**
 * Normalize workspace snapshot for export
 */
export function normalizeWorkspaceSnapshot(snapshot: WorkspaceSnapshot): RawWorkspaceData {
  return {
    id: snapshot.workspaceId,
    accountId: snapshot.accountId,
    type: snapshot.workspaceType,
    name: snapshot.name,
    ownerId: snapshot.ownerAccountId,
    members: snapshot.members.map((m: WorkspaceMember) => ({
      accountId: m.accountId,
      role: m.role,
      accountType: m.accountType
    })),
    modules: snapshot.modules.map((m: ModuleStatus) => ({
      key: m.moduleKey,
      type: m.moduleType,
      enabled: m.enabled
    })),
    createdAt: snapshot.createdAt
  };
}

/**
 * Batch validate workspace data
 */
export function batchValidateWorkspaces(
  dataList: RawWorkspaceData[]
): Map<string, SchemaValidationResult> {
  const results = new Map<string, SchemaValidationResult>();

  for (const data of dataList) {
    const result = validateWorkspaceSchema(data);
    results.set(data.id, result);
  }

  return results;
}
