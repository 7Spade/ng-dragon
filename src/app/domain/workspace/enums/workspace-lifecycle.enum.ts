import { LifecycleStatus } from '../../shared/enums';

/**
 * Workspace Lifecycle 列舉
 * 
 * 定義 Workspace 的生命週期狀態
 * 繼承自共享的 LifecycleStatus
 */
export { LifecycleStatus as WorkspaceLifecycle } from '../../shared/enums';

/**
 * Workspace 特定的狀態檢查函數
 */

/**
 * 檢查 Workspace 是否處於啟用狀態
 */
export function isWorkspaceActive(status: LifecycleStatus): boolean {
  return status === LifecycleStatus.Active;
}

/**
 * 檢查 Workspace 是否可以被訪問
 */
export function isWorkspaceAccessible(status: LifecycleStatus): boolean {
  return (
    status === LifecycleStatus.Active ||
    status === LifecycleStatus.Draft
  );
}

/**
 * 檢查 Workspace 是否已被歸檔或刪除
 */
export function isWorkspaceTerminated(status: LifecycleStatus): boolean {
  return (
    status === LifecycleStatus.Archived ||
    status === LifecycleStatus.Deleted
  );
}

/**
 * 檢查 Workspace 是否可以被恢復
 */
export function canRestoreWorkspace(status: LifecycleStatus): boolean {
  return (
    status === LifecycleStatus.Suspended ||
    status === LifecycleStatus.Archived
  );
}

/**
 * 檢查 Workspace 是否可以被永久刪除
 */
export function canPermanentlyDeleteWorkspace(
  status: LifecycleStatus
): boolean {
  return status === LifecycleStatus.Deleted;
}
