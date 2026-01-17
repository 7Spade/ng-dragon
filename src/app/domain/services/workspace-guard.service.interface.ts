/**
 * Workspace Guard Service Interface
 *
 * 定義工作區守衛服務的契約
 * 負責檢查使用者對工作區的存取權限
 */

import { Observable } from 'rxjs';
import { WorkspaceId } from '../workspace/value-objects/workspace-id.value-object';
import { MembershipRole } from '../workspace-membership/enums/membership-role.enum';

/**
 * 工作區存取結果
 */
export interface WorkspaceAccessResult {
  /** 是否有存取權限 */
  readonly hasAccess: boolean;
  /** 使用者在工作區中的角色 */
  readonly role: MembershipRole | null;
  /** 拒絕原因 (當 hasAccess 為 false 時) */
  readonly deniedReason?: string;
}

/**
 * 工作區守衛服務介面
 *
 * 提供工作區權限檢查功能
 * 這是一個領域服務，封裝了複雜的業務規則
 */
export interface IWorkspaceGuardService {
  /**
   * 檢查使用者是否可以存取工作區
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<WorkspaceAccessResult>
   */
  checkAccess(
    workspaceId: WorkspaceId,
    accountId: string
  ): Observable<WorkspaceAccessResult>;

  /**
   * 檢查使用者是否為工作區擁有者
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<boolean>
   */
  isOwner(workspaceId: WorkspaceId, accountId: string): Observable<boolean>;

  /**
   * 檢查使用者是否有管理員權限
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<boolean>
   */
  isAdmin(workspaceId: WorkspaceId, accountId: string): Observable<boolean>;

  /**
   * 檢查使用者是否可以邀請新成員
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<boolean>
   */
  canInviteMember(
    workspaceId: WorkspaceId,
    accountId: string
  ): Observable<boolean>;

  /**
   * 檢查使用者是否可以移除成員
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID (執行操作者)
   * @param targetAccountId - 目標帳戶 ID (被移除者)
   * @returns Observable<boolean>
   */
  canRemoveMember(
    workspaceId: WorkspaceId,
    accountId: string,
    targetAccountId: string
  ): Observable<boolean>;

  /**
   * 檢查使用者是否可以更新工作區設定
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<boolean>
   */
  canUpdateSettings(
    workspaceId: WorkspaceId,
    accountId: string
  ): Observable<boolean>;

  /**
   * 檢查使用者是否可以刪除工作區
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<boolean>
   */
  canDeleteWorkspace(
    workspaceId: WorkspaceId,
    accountId: string
  ): Observable<boolean>;
}
