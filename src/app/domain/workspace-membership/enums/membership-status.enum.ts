/**
 * Membership Status 列舉
 * 
 * 定義成員在 Workspace 中的狀態
 */
export enum MembershipStatus {
  /**
   * 待定: 邀請已發送,等待接受
   */
  Pending = 'pending',

  /**
   * 啟用: 成員已接受邀請並處於活躍狀態
   */
  Active = 'active',

  /**
   * 暫停: 成員暫時被停用
   */
  Suspended = 'suspended',

  /**
   * 已離開: 成員主動離開工作區
   */
  Left = 'left',

  /**
   * 已移除: 成員被管理員移除
   */
  Removed = 'removed',
}

/**
 * 檢查成員是否為活躍狀態
 */
export function isActiveMembership(status: MembershipStatus): boolean {
  return status === MembershipStatus.Active;
}

/**
 * 檢查成員是否為待定狀態
 */
export function isPendingMembership(status: MembershipStatus): boolean {
  return status === MembershipStatus.Pending;
}

/**
 * 檢查成員是否可以訪問工作區
 */
export function canAccessWorkspace(status: MembershipStatus): boolean {
  return (
    status === MembershipStatus.Active ||
    status === MembershipStatus.Pending
  );
}

/**
 * 檢查成員關係是否已終止
 */
export function isMembershipTerminated(status: MembershipStatus): boolean {
  return (
    status === MembershipStatus.Left ||
    status === MembershipStatus.Removed
  );
}

/**
 * 檢查成員關係是否可以恢復
 */
export function canRestoreMembership(status: MembershipStatus): boolean {
  return status === MembershipStatus.Suspended;
}

/**
 * 獲取成員狀態的顯示名稱
 */
export function getMembershipStatusDisplayName(
  status: MembershipStatus
): string {
  const displayNames: Record<MembershipStatus, string> = {
    [MembershipStatus.Pending]: '待定',
    [MembershipStatus.Active]: '啟用',
    [MembershipStatus.Suspended]: '暫停',
    [MembershipStatus.Left]: '已離開',
    [MembershipStatus.Removed]: '已移除',
  };
  return displayNames[status];
}

/**
 * 成員狀態轉換規則
 */
export const MembershipStatusTransitions: Record<
  MembershipStatus,
  MembershipStatus[]
> = {
  [MembershipStatus.Pending]: [
    MembershipStatus.Active,
    MembershipStatus.Removed,
  ],
  [MembershipStatus.Active]: [
    MembershipStatus.Suspended,
    MembershipStatus.Left,
    MembershipStatus.Removed,
  ],
  [MembershipStatus.Suspended]: [
    MembershipStatus.Active,
    MembershipStatus.Removed,
  ],
  [MembershipStatus.Left]: [], // 已離開的成員不能轉換到其他狀態
  [MembershipStatus.Removed]: [], // 已移除的成員不能轉換到其他狀態
};

/**
 * 檢查成員狀態轉換是否允許
 */
export function canTransitionMembershipStatus(
  from: MembershipStatus,
  to: MembershipStatus
): boolean {
  return MembershipStatusTransitions[from].includes(to);
}
