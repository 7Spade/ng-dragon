/**
 * Workspace Enums
 */

export {
  WorkspaceType,
  isPersonalWorkspace,
  isCollaborativeWorkspace,
  getWorkspaceTypeDisplayName,
  getWorkspaceTypeDescription,
} from './workspace-type.enum';

export {
  WorkspaceLifecycle,
  isWorkspaceActive,
  isWorkspaceAccessible,
  isWorkspaceTerminated,
  canRestoreWorkspace,
  canPermanentlyDeleteWorkspace,
} from './workspace-lifecycle.enum';
