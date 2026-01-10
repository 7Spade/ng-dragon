/**
 * @ng-events/scaffolding
 *
 * Scaffolding utilities to bootstrap workspace-domain package.
 * All utilities must be accessed through this entry point.
 */
// Bootstrap utilities
export { bootstrapWorkspace, createPersonalWorkspace, createOrganizationWorkspace, createTeamWorkspace, initializeWorkspaceDefaults } from './src/bootstrap';
// Factory helpers
export { createWorkspaceFactory, buildWorkspaceFromData, createFromSnapshot, cloneWorkspace } from './src/factory';
// Migration utilities
export { validateWorkspaceSchema, migrateWorkspaceData, normalizeWorkspaceSnapshot, batchValidateWorkspaces } from './src/migration';
//# sourceMappingURL=index.js.map