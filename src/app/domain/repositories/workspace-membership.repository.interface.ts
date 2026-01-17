/**
 * Workspace Membership Repository Interface
 *
 * 定義工作區成員關係儲存庫的契約
 * Infrastructure 層需要實作這個介面
 */

import { Observable } from 'rxjs';
import { WorkspaceMembership } from '../workspace-membership/entities/workspace-membership.entity';
import { MembershipId } from '../workspace-membership/value-objects/membership-id.value-object';
import { WorkspaceId } from '../workspace/value-objects/workspace-id.value-object';
import { MembershipRole } from '../workspace-membership/enums/membership-role.enum';
import { QueryResult } from '../queries/base/query-result';
import { Pagination } from '../queries/base/pagination';

/**
 * 工作區成員關係儲存庫介面
 *
 * 管理工作區與帳戶之間的成員關係
 * 支援角色管理、權限檢查等功能
 */
export interface IWorkspaceMembershipRepository {
  /**
   * 根據 ID 取得成員關係
   *
   * @param id - 成員關係 ID
   * @returns Observable<WorkspaceMembership | null>
   */
  findById(id: MembershipId): Observable<WorkspaceMembership | null>;

  /**
   * 取得工作區的成員關係
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<WorkspaceMembership | null>
   */
  findByWorkspaceAndAccount(
    workspaceId: WorkspaceId,
    accountId: string
  ): Observable<WorkspaceMembership | null>;

  /**
   * 取得工作區的所有成員
   *
   * @param workspaceId - 工作區 ID
   * @param pagination - 分頁選項
   * @param role - 角色過濾 (可選)
   * @returns Observable<QueryResult<WorkspaceMembership>>
   */
  findByWorkspace(
    workspaceId: WorkspaceId,
    pagination?: Pagination,
    role?: MembershipRole
  ): Observable<QueryResult<WorkspaceMembership>>;

  /**
   * 取得帳戶的所有工作區成員關係
   *
   * @param accountId - 帳戶 ID
   * @param pagination - 分頁選項
   * @returns Observable<QueryResult<WorkspaceMembership>>
   */
  findByAccount(
    accountId: string,
    pagination?: Pagination
  ): Observable<QueryResult<WorkspaceMembership>>;

  /**
   * 儲存成員關係 (新增或更新)
   *
   * @param membership - 成員關係實體
   * @returns Observable<WorkspaceMembership>
   */
  save(membership: WorkspaceMembership): Observable<WorkspaceMembership>;

  /**
   * 刪除成員關係
   *
   * @param id - 成員關係 ID
   * @returns Observable<void>
   */
  delete(id: MembershipId): Observable<void>;

  /**
   * 檢查使用者是否為工作區成員
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<boolean>
   */
  isMember(workspaceId: WorkspaceId, accountId: string): Observable<boolean>;

  /**
   * 檢查使用者在工作區中的角色
   *
   * @param workspaceId - 工作區 ID
   * @param accountId - 帳戶 ID
   * @returns Observable<MembershipRole | null>
   */
  getMemberRole(
    workspaceId: WorkspaceId,
    accountId: string
  ): Observable<MembershipRole | null>;

  /**
   * 取得工作區的擁有者
   *
   * @param workspaceId - 工作區 ID
   * @returns Observable<WorkspaceMembership | null>
   */
  findOwner(workspaceId: WorkspaceId): Observable<WorkspaceMembership | null>;
}
