/**
 * Check Workspace Access Query
 *
 * 檢查使用者對工作區的存取權限
 * 用於授權檢查
 */

import { BaseQuery } from '../base/query.base';
import { MembershipRole } from '../../workspace-membership/enums/membership-role.enum';

/**
 * 需要檢查的權限類型
 */
export type RequiredPermission =
  | 'read'
  | 'write'
  | 'delete'
  | 'manage_members'
  | 'manage_settings'
  | 'transfer_ownership';

/**
 * Check Workspace Access Query
 *
 * @example
 * ```typescript
 * // 檢查使用者是否有讀取權限
 * const query = new CheckWorkspaceAccessQuery({
 *   workspaceId: 'workspace-123',
 *   accountId: 'account-456',
 *   requiredPermission: 'read'
 * });
 *
 * // 檢查使用者是否有管理成員權限
 * const query = new CheckWorkspaceAccessQuery({
 *   workspaceId: 'workspace-123',
 *   accountId: 'account-456',
 *   requiredPermission: 'manage_members',
 *   minimumRole: MembershipRole.ADMIN
 * });
 * ```
 */
export class CheckWorkspaceAccessQuery extends BaseQuery {
  constructor(
    /** 工作區 ID */
    public readonly workspaceId: string,
    /** 帳戶 ID */
    public readonly accountId: string,
    /** 需要的權限 */
    public readonly requiredPermission: RequiredPermission,
    /** 最低角色要求 (可選) */
    public readonly minimumRole?: MembershipRole
  ) {
    super();
    this.validate();
  }

  /**
   * 驗證查詢參數
   */
  protected validate(): void {
    if (!this.workspaceId) {
      throw new Error('Workspace ID is required');
    }

    if (!this.accountId) {
      throw new Error('Account ID is required');
    }

    if (!this.requiredPermission) {
      throw new Error('Required permission is required');
    }
  }

  /**
   * 取得查詢的唯一識別
   */
  public getKey(): string {
    return `check-workspace-access:${this.workspaceId}:${this.accountId}:${this.requiredPermission}:${this.minimumRole ?? 'none'}`;
  }
}
