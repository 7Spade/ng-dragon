/**
 * Migration utilities for existing workspace data
 */
import { isValidWorkspaceType } from '@workspace-domain';
/**
 * Validate workspace schema
 */
export function validateWorkspaceSchema(data) {
    const errors = [];
    const warnings = [];
    // Required fields
    if (!data.id) {
        errors.push('Missing required field: id');
    }
    if (!data.accountId) {
        errors.push('Missing required field: accountId');
    }
    if (!data.type) {
        errors.push('Missing required field: type');
    }
    else if (!isValidWorkspaceType(data.type)) {
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
export function migrateWorkspaceData(legacyData, targetVersion = 'v2') {
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
export function normalizeWorkspaceSnapshot(snapshot) {
    return {
        id: snapshot.workspaceId,
        accountId: snapshot.accountId,
        type: snapshot.workspaceType,
        name: snapshot.name,
        ownerId: snapshot.ownerAccountId,
        members: snapshot.members.map((m) => ({
            accountId: m.accountId,
            role: m.role,
            accountType: m.accountType
        })),
        modules: snapshot.modules.map((m) => ({
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
export function batchValidateWorkspaces(dataList) {
    const results = new Map();
    for (const data of dataList) {
        const result = validateWorkspaceSchema(data);
        results.set(data.id, result);
    }
    return results;
}
//# sourceMappingURL=migration.js.map