/**
 * Workspace Repository Interface
 *
 * 定義工作區儲存庫的契約
 * Infrastructure 層需要實作這個介面
 */

import { Observable } from 'rxjs';
import { Workspace } from '../workspace/aggregates/workspace.aggregate';
import { WorkspaceId } from '../workspace/value-objects/workspace-id.value-object';
import { QueryResult } from '../queries/base/query-result';
import { Pagination } from '../queries/base/pagination';

/**
 * 工作區儲存庫介面
 *
 * 遵循 Repository 模式，封裝資料存取邏輯
 * 所有方法返回 Observable，支援 Reactive 編程
 */
export interface IWorkspaceRepository {
  /**
   * 根據 ID 取得工作區
   *
   * @param id - 工作區 ID
   * @returns Observable<Workspace | null>
   */
  findById(id: WorkspaceId): Observable<Workspace | null>;

  /**
   * 根據 Slug 取得工作區
   *
   * @param slug - 工作區 Slug
   * @returns Observable<Workspace | null>
   */
  findBySlug(slug: string): Observable<Workspace | null>;

  /**
   * 取得使用者可存取的工作區列表
   *
   * @param accountId - 帳戶 ID
   * @param pagination - 分頁選項
   * @returns Observable<QueryResult<Workspace>>
   */
  findByAccountId(
    accountId: string,
    pagination?: Pagination
  ): Observable<QueryResult<Workspace>>;

  /**
   * 儲存工作區 (新增或更新)
   *
   * @param workspace - 工作區聚合
   * @returns Observable<Workspace>
   */
  save(workspace: Workspace): Observable<Workspace>;

  /**
   * 刪除工作區
   *
   * @param id - 工作區 ID
   * @returns Observable<void>
   */
  delete(id: WorkspaceId): Observable<void>;

  /**
   * 檢查 Slug 是否已存在
   *
   * @param slug - 工作區 Slug
   * @param excludeId - 排除的工作區 ID (用於更新時檢查)
   * @returns Observable<boolean>
   */
  isSlugExists(slug: string, excludeId?: WorkspaceId): Observable<boolean>;

  /**
   * 取得工作區成員數量
   *
   * @param id - 工作區 ID
   * @returns Observable<number>
   */
  getMemberCount(id: WorkspaceId): Observable<number>;
}
