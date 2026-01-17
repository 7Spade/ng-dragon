/**
 * 分頁資訊
 */
export interface Pagination {
  /**
   * 當前頁碼 (從 1 開始)
   */
  readonly page: number;
  
  /**
   * 每頁數量
   */
  readonly pageSize: number;
  
  /**
   * 總數量
   */
  readonly totalCount: number;
  
  /**
   * 總頁數
   */
  readonly totalPages: number;
  
  /**
   * 是否有上一頁
   */
  readonly hasPrevious: boolean;
  
  /**
   * 是否有下一頁
   */
  readonly hasNext: boolean;
}

/**
 * 創建分頁資訊
 */
export function createPagination(props: {
  page: number;
  pageSize: number;
  totalCount: number;
}): Pagination {
  const totalPages = Math.ceil(props.totalCount / props.pageSize);
  
  return {
    page: props.page,
    pageSize: props.pageSize,
    totalCount: props.totalCount,
    totalPages: totalPages,
    hasPrevious: props.page > 1,
    hasNext: props.page < totalPages,
  };
}

/**
 * 分頁參數
 */
export interface PaginationParams {
  /**
   * 頁碼 (從 1 開始,默認 1)
   */
  page?: number;
  
  /**
   * 每頁數量 (默認 20)
   */
  pageSize?: number;
}

/**
 * 獲取默認分頁參數
 */
export function getDefaultPaginationParams(): Required<PaginationParams> {
  return {
    page: 1,
    pageSize: 20,
  };
}

/**
 * 規範化分頁參數
 */
export function normalizePaginationParams(
  params?: PaginationParams
): Required<PaginationParams> {
  const defaults = getDefaultPaginationParams();
  
  return {
    page: Math.max(1, params?.page ?? defaults.page),
    pageSize: Math.max(1, Math.min(100, params?.pageSize ?? defaults.pageSize)),
  };
}
