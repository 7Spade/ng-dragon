/**
 * List Workspaces Query
 *
 * 查詢使用者可存取的工作區列表
 * 支援分頁、排序與過濾
 */

import { BaseQuery } from '../base/query.base';
import { Pagination } from '../base/pagination';

/**
 * 工作區排序選項
 */
export interface WorkspaceSortOptions {
  /** 排序欄位 */
  readonly field: 'name' | 'createdAt' | 'updatedAt' | 'memberCount';
  /** 排序方向 */
  readonly direction: 'asc' | 'desc';
}

/**
 * 工作區過濾選項
 */
export interface WorkspaceFilterOptions {
  /** 工作區類型過濾 */
  readonly type?: 'personal' | 'team' | 'enterprise';
  /** 生命週期狀態過濾 */
  readonly lifecycle?: 'active' | 'archived' | 'deleted';
  /** 名稱搜尋 */
  readonly nameContains?: string;
  /** 只顯示擁有的工作區 */
  readonly ownedOnly?: boolean;
}

/**
 * List Workspaces Query
 *
 * @example
 * ```typescript
 * const query = new ListWorkspacesQuery({
 *   accountId: 'account-123',
 *   pagination: { page: 1, pageSize: 20 },
 *   sort: { field: 'updatedAt', direction: 'desc' },
 *   filter: { lifecycle: 'active', ownedOnly: false }
 * });
 * ```
 */
export class ListWorkspacesQuery extends BaseQuery {
  constructor(
    /** 帳戶 ID */
    public readonly accountId: string,
    /** 分頁選項 */
    public readonly pagination: Pagination = { page: 1, pageSize: 20 },
    /** 排序選項 */
    public readonly sort: WorkspaceSortOptions = {
      field: 'updatedAt',
      direction: 'desc',
    },
    /** 過濾選項 */
    public readonly filter: WorkspaceFilterOptions = {}
  ) {
    super();
    this.validate();
  }

  /**
   * 驗證查詢參數
   */
  protected validate(): void {
    if (!this.accountId) {
      throw new Error('Account ID is required');
    }

    if (this.pagination.page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (this.pagination.pageSize < 1 || this.pagination.pageSize > 100) {
      throw new Error('Page size must be between 1 and 100');
    }
  }

  /**
   * 取得查詢的唯一識別
   */
  public getKey(): string {
    const filterKey = JSON.stringify(this.filter);
    return `list-workspaces:${this.accountId}:${this.pagination.page}:${this.pagination.pageSize}:${this.sort.field}:${this.sort.direction}:${filterKey}`;
  }
}
