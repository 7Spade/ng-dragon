/**
 * Get Workspace Members Query
 *
 * 查詢工作區成員列表
 * 支援分頁與角色過濾
 */

import { BaseQuery } from '../base/query.base';
import { Pagination } from '../base/pagination';
import { MembershipRole } from '../../workspace-membership/enums/membership-role.enum';

/**
 * 成員過濾選項
 */
export interface MemberFilterOptions {
  /** 角色過濾 */
  readonly role?: MembershipRole;
  /** 狀態過濾 */
  readonly status?: 'active' | 'invited' | 'suspended';
  /** 名稱或 Email 搜尋 */
  readonly search?: string;
}

/**
 * Get Workspace Members Query
 *
 * @example
 * ```typescript
 * const query = new GetWorkspaceMembersQuery({
 *   workspaceId: 'workspace-123',
 *   pagination: { page: 1, pageSize: 50 },
 *   filter: { role: MembershipRole.MEMBER }
 * });
 * ```
 */
export class GetWorkspaceMembersQuery extends BaseQuery {
  constructor(
    /** 工作區 ID */
    public readonly workspaceId: string,
    /** 分頁選項 */
    public readonly pagination: Pagination = { page: 1, pageSize: 50 },
    /** 過濾選項 */
    public readonly filter: MemberFilterOptions = {}
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
    return `get-workspace-members:${this.workspaceId}:${this.pagination.page}:${this.pagination.pageSize}:${filterKey}`;
  }
}
