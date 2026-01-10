/**
 * @ng-events/workspace-domain
 *
 * Pure TypeScript domain layer for workspace management.
 * All features must be accessed through this entry point.
 * Direct imports from internal files are not allowed.
 */
// Aggregates
export { WorkspaceAggregate } from './src/aggregates/workspace.aggregate';
// Value Objects
export { isValidWorkspaceType, getWorkspaceTypeLabel, getWorkspaceTypeIcon } from './src/value-objects/workspace-type';
export { isValidMemberRole, hasAdminPrivileges, canManageWorkspace, getRoleLevel } from './src/value-objects/member-role';
export { createModuleStatus, isModuleEnabled } from './src/value-objects/module-status';
// Services
export { WorkspaceSwitcher, WorkspaceSwitcherUtils } from './src/services/workspace-switcher.service';
export { WorkspaceLogicContainer } from './src/services/workspace-logic-container';
//# sourceMappingURL=index.js.map