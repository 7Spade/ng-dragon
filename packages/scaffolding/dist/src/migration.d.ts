/**
 * Migration utilities for existing workspace data
 */
import { WorkspaceSnapshot } from '@workspace-domain';
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
export declare function validateWorkspaceSchema(data: RawWorkspaceData): SchemaValidationResult;
/**
 * Migrate workspace data from legacy format
 */
export declare function migrateWorkspaceData(legacyData: any, targetVersion?: SchemaVersion): RawWorkspaceData;
/**
 * Normalize workspace snapshot for export
 */
export declare function normalizeWorkspaceSnapshot(snapshot: WorkspaceSnapshot): RawWorkspaceData;
/**
 * Batch validate workspace data
 */
export declare function batchValidateWorkspaces(dataList: RawWorkspaceData[]): Map<string, SchemaValidationResult>;
//# sourceMappingURL=migration.d.ts.map