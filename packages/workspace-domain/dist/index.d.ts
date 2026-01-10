/**
 * @ng-events/workspace-domain
 *
 * Pure TypeScript domain layer for workspace management.
 * All features must be accessed through this entry point.
 * Direct imports from internal files are not allowed.
 */
export { WorkspaceAggregate, WorkspaceSnapshot, WorkspaceMember, WorkspaceCreationInput, WorkspaceCreatedEvent, ModuleToggledEvent, EventContext } from './src/aggregates/workspace.aggregate';
export { WorkspaceType, isValidWorkspaceType, getWorkspaceTypeLabel, getWorkspaceTypeIcon } from './src/value-objects/workspace-type';
export { MemberRole, isValidMemberRole, hasAdminPrivileges, canManageWorkspace, getRoleLevel } from './src/value-objects/member-role';
export { ModuleStatus, ModuleType, createModuleStatus, isModuleEnabled } from './src/value-objects/module-status';
export { WorkspaceId, AccountId, ModuleKey } from './src/types/identifiers';
export { WorkspaceRepository, WorkspaceEvent } from './src/repositories/workspace.repository';
export { WorkspaceSwitcher, WorkspaceView, WorkspaceSelectionState, WorkspaceSwitcherConfig, WorkspaceSwitcherUtils } from './src/services/workspace-switcher.service';
export { WorkspaceLogicContainer, WorkspaceValidationResult, PermissionCheckResult } from './src/services/workspace-logic-container';
//# sourceMappingURL=index.d.ts.map