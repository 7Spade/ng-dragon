import { Timestamp } from '../../shared/value-objects';
import { PaginationParams } from './pagination';

/**
 * 查詢基類
 * 
 * 所有查詢都應繼承此基類
 * 
 * 設計原則:
 * - 唯讀操作: 查詢不應該修改系統狀態
 * - 參數化: 所有查詢條件都作為參數傳入
 * - 可追蹤: 包含查詢追蹤資訊
 * 
 * @template TParams - 查詢參數的類型
 */
export abstract class QueryBase<TParams = unknown> {
  /**
   * 查詢類型 (唯一識別查詢種類)
   */
  abstract readonly queryType: string;
  
  /**
   * 查詢 ID (唯一識別)
   */
  readonly queryId: string;
  
  /**
   * 查詢創建時間
   */
  readonly createdAt: Timestamp;
  
  /**
   * 執行查詢的帳戶 ID
   */
  readonly actorId: string;
  
  /**
   * 工作區 ID (WorkspaceScoped 查詢必填)
   */
  readonly workspaceId?: string;
  
  /**
   * 關聯 ID (用於追蹤相關查詢)
   */
  readonly correlationId?: string;
  
  /**
   * 查詢參數
   */
  readonly params: TParams;

  constructor(props: {
    queryId: string;
    actorId: string;
    workspaceId?: string;
    correlationId?: string;
    params: TParams;
  }) {
    this.queryId = props.queryId;
    this.createdAt = Timestamp.now();
    this.actorId = props.actorId;
    this.workspaceId = props.workspaceId;
    this.correlationId = props.correlationId;
    this.params = props.params;
    
    // 確保查詢不可變
    Object.freeze(this.params);
    Object.freeze(this);
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): {
    queryType: string;
    queryId: string;
    createdAt: Date;
    actorId: string;
    workspaceId?: string;
    correlationId?: string;
    params: TParams;
  } {
    return {
      queryType: this.queryType,
      queryId: this.queryId,
      createdAt: this.createdAt.toDate(),
      actorId: this.actorId,
      workspaceId: this.workspaceId,
      correlationId: this.correlationId,
      params: this.params,
    };
  }

  /**
   * 轉換為字串
   */
  toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}

/**
 * WorkspaceScoped 查詢基類
 * 
 * 所有與工作區相關的查詢都應繼承此基類
 * 確保查詢包含 workspaceId
 */
export abstract class WorkspaceScopedQuery<
  TParams = unknown
> extends QueryBase<TParams> {
  constructor(props: {
    queryId: string;
    actorId: string;
    workspaceId: string;
    correlationId?: string;
    params: TParams;
  }) {
    if (!props.workspaceId) {
      throw new Error(
        'WorkspaceScoped query must have workspaceId'
      );
    }
    
    super(props);
  }

  /**
   * 獲取工作區 ID (覆寫父類,確保非 undefined)
   */
  override get workspaceId(): string {
    return super.workspaceId!;
  }
}

/**
 * 列表查詢參數基類
 */
export interface ListQueryParams extends PaginationParams {
  /**
   * 排序欄位
   */
  sortBy?: string;
  
  /**
   * 排序方向
   */
  sortOrder?: 'asc' | 'desc';
  
  /**
   * 搜尋關鍵字
   */
  search?: string;
  
  /**
   * 篩選條件
   */
  filters?: Record<string, unknown>;
}
