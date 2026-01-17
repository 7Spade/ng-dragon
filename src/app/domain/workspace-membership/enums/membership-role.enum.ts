/**
 * Membership Role 列舉
 * 
 * 定義成員在 Workspace 中的角色
 */
export enum MembershipRole {
  /**
   * 擁有者: 完全控制權限
   */
  Owner = 'owner',

  /**
   * 管理員: 除了刪除工作區和管理帳單外的所有權限
   */
  Admin = 'admin',

  /**
   * 編輯者: 可以編輯內容但不能管理成員
   */
  Editor = 'editor',

  /**
   * 觀察者: 只能查看內容
   */
  Viewer = 'viewer',

  /**
   * 訪客: 有限的查看權限
   */
  Guest = 'guest',
}

/**
 * 角色層級 (數字越大,權限越高)
 */
export const RoleHierarchy: Record<MembershipRole, number> = {
  [MembershipRole.Guest]: 1,
  [MembershipRole.Viewer]: 2,
  [MembershipRole.Editor]: 3,
  [MembershipRole.Admin]: 4,
  [MembershipRole.Owner]: 5,
};

/**
 * 檢查角色是否為擁有者
 */
export function isOwnerRole(role: MembershipRole): boolean {
  return role === MembershipRole.Owner;
}

/**
 * 檢查角色是否為管理員或擁有者
 */
export function isAdminOrOwner(role: MembershipRole): boolean {
  return role === MembershipRole.Admin || role === MembershipRole.Owner;
}

/**
 * 檢查角色是否可以編輯
 */
export function canEditRole(role: MembershipRole): boolean {
  return (
    role === MembershipRole.Editor ||
    role === MembershipRole.Admin ||
    role === MembershipRole.Owner
  );
}

/**
 * 檢查角色是否可以查看
 */
export function canViewRole(role: MembershipRole): boolean {
  return true; // 所有角色都可以查看
}

/**
 * 比較角色權限
 * @returns 正數: role1 權限高於 role2, 0: 相等, 負數: role1 權限低於 role2
 */
export function compareRoles(
  role1: MembershipRole,
  role2: MembershipRole
): number {
  return RoleHierarchy[role1] - RoleHierarchy[role2];
}

/**
 * 檢查是否可以修改目標角色
 * (只能修改權限低於自己的角色)
 */
export function canModifyRole(
  currentRole: MembershipRole,
  targetRole: MembershipRole
): boolean {
  return compareRoles(currentRole, targetRole) > 0;
}

/**
 * 獲取角色的顯示名稱
 */
export function getRoleDisplayName(role: MembershipRole): string {
  const displayNames: Record<MembershipRole, string> = {
    [MembershipRole.Owner]: '擁有者',
    [MembershipRole.Admin]: '管理員',
    [MembershipRole.Editor]: '編輯者',
    [MembershipRole.Viewer]: '觀察者',
    [MembershipRole.Guest]: '訪客',
  };
  return displayNames[role];
}

/**
 * 獲取角色的描述
 */
export function getRoleDescription(role: MembershipRole): string {
  const descriptions: Record<MembershipRole, string> = {
    [MembershipRole.Owner]: '完全控制工作區,包括刪除和帳單管理',
    [MembershipRole.Admin]: '管理工作區和成員,但不能刪除工作區或管理帳單',
    [MembershipRole.Editor]: '可以創建和編輯內容,但不能管理成員',
    [MembershipRole.Viewer]: '只能查看內容,不能編輯',
    [MembershipRole.Guest]: '有限的查看權限,通常用於臨時訪問',
  };
  return descriptions[role];
}
