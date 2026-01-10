/**
 * @ng-events/scaffolding
 *
 * Scaffolding utilities to bootstrap workspace-domain package.
 * All utilities must be accessed through this entry point.
 */
export { BootstrapWorkspaceConfig, bootstrapWorkspace, createPersonalWorkspace, createOrganizationWorkspace, createTeamWorkspace, initializeWorkspaceDefaults } from './src/bootstrap';
export { RawWorkspaceData, createWorkspaceFactory, buildWorkspaceFromData, createFromSnapshot, cloneWorkspace } from './src/factory';
export { SchemaVersion, SchemaValidationResult, validateWorkspaceSchema, migrateWorkspaceData, normalizeWorkspaceSnapshot, batchValidateWorkspaces } from './src/migration';
//# sourceMappingURL=index.d.ts.map