/**
 * 生命週期狀態列舉
 * 
 * 用於表示領域實體的生命週期狀態
 * 適用於需要追蹤生命週期的實體 (Workspace, Account, Task 等)
 */
export enum LifecycleStatus {
  /**
   * 草稿: 實體已創建但尚未啟用
   */
  Draft = 'draft',

  /**
   * 啟用: 實體處於正常運行狀態
   */
  Active = 'active',

  /**
   * 暫停: 暫時停用,可恢復
   */
  Suspended = 'suspended',

  /**
   * 歸檔: 不再使用但保留歷史記錄
   */
  Archived = 'archived',

  /**
   * 已刪除: 標記為刪除,可能在未來被永久移除
   */
  Deleted = 'deleted',
}

/**
 * 檢查狀態是否為活躍狀態
 */
export function isActiveLifecycle(status: LifecycleStatus): boolean {
  return status === LifecycleStatus.Active;
}

/**
 * 檢查狀態是否可恢復
 */
export function isRecoverableLifecycle(status: LifecycleStatus): boolean {
  return (
    status === LifecycleStatus.Suspended ||
    status === LifecycleStatus.Archived
  );
}

/**
 * 檢查狀態是否已終止
 */
export function isTerminatedLifecycle(status: LifecycleStatus): boolean {
  return status === LifecycleStatus.Deleted;
}

/**
 * 獲取生命週期狀態的顯示名稱
 */
export function getLifecycleStatusDisplayName(
  status: LifecycleStatus
): string {
  const displayNames: Record<LifecycleStatus, string> = {
    [LifecycleStatus.Draft]: '草稿',
    [LifecycleStatus.Active]: '啟用',
    [LifecycleStatus.Suspended]: '暫停',
    [LifecycleStatus.Archived]: '已歸檔',
    [LifecycleStatus.Deleted]: '已刪除',
  };
  return displayNames[status];
}

/**
 * 生命週期狀態轉換規則
 */
export const LifecycleTransitions: Record<
  LifecycleStatus,
  LifecycleStatus[]
> = {
  [LifecycleStatus.Draft]: [LifecycleStatus.Active, LifecycleStatus.Deleted],
  [LifecycleStatus.Active]: [
    LifecycleStatus.Suspended,
    LifecycleStatus.Archived,
    LifecycleStatus.Deleted,
  ],
  [LifecycleStatus.Suspended]: [
    LifecycleStatus.Active,
    LifecycleStatus.Deleted,
  ],
  [LifecycleStatus.Archived]: [
    LifecycleStatus.Active,
    LifecycleStatus.Deleted,
  ],
  [LifecycleStatus.Deleted]: [], // 已刪除的實體不能轉換到其他狀態
};

/**
 * 檢查生命週期狀態轉換是否允許
 */
export function canTransitionLifecycle(
  from: LifecycleStatus,
  to: LifecycleStatus
): boolean {
  return LifecycleTransitions[from].includes(to);
}
