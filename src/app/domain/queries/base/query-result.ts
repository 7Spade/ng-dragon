import { Pagination } from './pagination';

/**
 * 查詢執行結果
 * 
 * 表示查詢執行的結果狀態
 */
export interface QueryResult<TData = unknown, TError = Error> {
  /**
   * 是否成功執行
   */
  readonly success: boolean;
  
  /**
   * 查詢結果數據
   */
  readonly data?: TData;
  
  /**
   * 錯誤資訊
   */
  readonly error?: TError;
  
  /**
   * 執行時間戳
   */
  readonly timestamp: Date;
  
  /**
   * 分頁資訊 (列表查詢時使用)
   */
  readonly pagination?: Pagination;
  
  /**
   * 額外的元數據
   */
  readonly metadata?: Record<string, unknown>;
}

/**
 * 創建成功的查詢結果
 */
export function createSuccessQueryResult<TData = unknown>(
  data: TData,
  pagination?: Pagination,
  metadata?: Record<string, unknown>
): QueryResult<TData> {
  return {
    success: true,
    data,
    timestamp: new Date(),
    pagination,
    metadata,
  };
}

/**
 * 創建失敗的查詢結果
 */
export function createFailureQueryResult<TError = Error>(
  error: TError,
  metadata?: Record<string, unknown>
): QueryResult<unknown, TError> {
  return {
    success: false,
    error,
    timestamp: new Date(),
    metadata,
  };
}

/**
 * 分頁查詢結果
 */
export interface PagedQueryResult<TData = unknown> {
  /**
   * 數據列表
   */
  readonly items: readonly TData[];
  
  /**
   * 分頁資訊
   */
  readonly pagination: Pagination;
}

/**
 * 創建分頁查詢結果
 */
export function createPagedQueryResult<TData = unknown>(
  items: readonly TData[],
  pagination: Pagination
): PagedQueryResult<TData> {
  return {
    items,
    pagination,
  };
}
