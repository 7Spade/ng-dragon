/**
 * Permission Checker Service Interface
 *
 * 定義權限檢查服務的契約
 * 負責檢查使用者是否擁有特定權限
 */

import { Observable } from 'rxjs';
import { WorkspaceId } from '../workspace/value-objects/workspace-id.value-object';
import { MembershipRole } from '../workspace-membership/enums/membership-role.enum';
import { Permissions } from '../workspace-membership/value-objects/permissions.value-object';

/**
 * 權限檢查結果
 */
export interface PermissionCheckResult {
  /** 是否有權限 */
  readonly hasPermission: boolean;
  /** 使用者當前角色 */
  readonly currentRole: MembershipRole | null;
  /** 使用者當前權限集合 */
  readonly currentPermissions: Permissions | null;
  /** 拒絕原因 (當 hasPermission 為 false 時) */
  readonly deniedReason?: string;
}

/**
 * 權限類型
 */
export type PermissionType =
  | 'workspace.read'
  | 'workspace.write'
  | 'workspace.delete'
  | 'workspace.settings.update'
  | 'member.invite'
  | 'member.remove'
  | 'member.role.update'
  | 'module.create'
  | 'module.read'
  | 'module.update'
  | 'module.delete'
  | 'task.create'
  | 'task.read'
  | 'task.update'
  | 'task.delete'
  | 'task.assign';

/**
 * 權限檢查服務介面
 *
 * 提供細粒度的權限檢查功能
 * 支援基於角色和自定義權限的檢查
 */
export interface IPermissionCheckerService {
  /**
   * 檢查使用者是否有特定權限
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @param permission - 權限類型
   * @returns Observable<PermissionCheckResult>
   */
  checkPermission(
    workspaceId: WorkspaceId,
    accountId: string,
    permission: PermissionType
  ): Observable<PermissionCheckResult>;

  /**
   * 檢查使用者是否有多個權限中的任一個 (OR 邏輯)
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @param permissions - 權限類型陣列
   * @returns Observable<PermissionCheckResult>
   */
  checkAnyPermission(
    workspaceId: WorkspaceId,
    accountId: string,
    permissions: PermissionType[]
  ): Observable<PermissionCheckResult>;

  /**
   * 檢查使用者是否有所有指定權限 (AND 邏輯)
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @param permissions - 權限類型陣列
   * @returns Observable<PermissionCheckResult>
   */
  checkAllPermissions(
    workspaceId: WorkspaceId,
    accountId: string,
    permissions: PermissionType[]
  ): Observable<PermissionCheckResult>;

  /**
   * 取得使用者在工作區的所有權限
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<Permissions | null>
   */
  getUserPermissions(
    workspaceId: WorkspaceId,
    accountId: string
  ): Observable<Permissions | null>;

  /**
   * 檢查使用者角色是否滿足最低要求
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @param minimumRole - 最低角色要求
   * @returns Observable<boolean>
   */
  hasMinimumRole(
    workspaceId: WorkspaceId,
    accountId: string,
    minimumRole: MembershipRole
  ): Observable<boolean>;
}
