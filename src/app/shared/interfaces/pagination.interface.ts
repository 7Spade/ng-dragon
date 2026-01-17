/**
 * Pagination Interfaces
 * 
 * 定義應用程式中使用的分頁相關介面
 * 
 * @module SharedInterfaces
 */

import { SortDirection } from '../enums';

/**
 * Pageable 介面
 * 
 * 分頁請求參數
 */
export interface Pageable {
  /**
   * 頁碼 (從 0 開始)
   */
  page: number;

  /**
   * 每頁筆數
   */
  pageSize: number;

  /**
   * 排序條件
   */
  sort?: Sort[];
}

/**
 * Sort 介面
 * 
 * 排序條件
 */
export interface Sort {
  /**
   * 排序欄位
   */
  field: string;

  /**
   * 排序方向
   */
  direction: SortDirection;
}

/**
 * Page 介面
 * 
 * 分頁結果
 */
export interface Page<T> {
  /**
   * 當前頁資料
   */
  content: T[];

  /**
   * 當前頁碼 (從 0 開始)
   */
  page: number;

  /**
   * 每頁筆數
   */
  pageSize: number;

  /**
   * 總筆數
   */
  totalElements: number;

  /**
   * 總頁數
   */
  totalPages: number;

  /**
   * 是否為第一頁
   */
  isFirst: boolean;

  /**
   * 是否為最後一頁
   */
  isLast: boolean;

  /**
   * 是否有上一頁
   */
  hasPrevious: boolean;

  /**
   * 是否有下一頁
   */
  hasNext: boolean;

  /**
   * 是否為空
   */
  isEmpty: boolean;
}

/**
 * PageRequest 介面
 * 
 * 分頁請求 (別名 Pageable)
 */
export type PageRequest = Pageable;

/**
 * PageResponse 介面
 * 
 * 分頁回應 (別名 Page)
 */
export type PageResponse<T> = Page<T>;

/**
 * CursorPageable 介面
 * 
 * 游標分頁請求參數
 */
export interface CursorPageable {
  /**
   * 游標 (從此游標開始查詢)
   */
  cursor: string | null;

  /**
   * 每頁筆數
   */
  pageSize: number;

  /**
   * 排序條件
   */
  sort?: Sort[];
}

/**
 * CursorPage 介面
 * 
 * 游標分頁結果
 */
export interface CursorPage<T> {
  /**
   * 當前頁資料
   */
  content: T[];

  /**
   * 下一頁游標
   */
  nextCursor: string | null;

  /**
   * 上一頁游標
   */
  previousCursor: string | null;

  /**
   * 每頁筆數
   */
  pageSize: number;

  /**
   * 是否有下一頁
   */
  hasNext: boolean;

  /**
   * 是否有上一頁
   */
  hasPrevious: boolean;

  /**
   * 是否為空
   */
  isEmpty: boolean;
}

/**
 * InfiniteScrollPage 介面
 * 
 * 無限滾動分頁結果
 */
export interface InfiniteScrollPage<T> {
  /**
   * 當前頁資料
   */
  content: T[];

  /**
   * 下一頁 token
   */
  nextPageToken: string | null;

  /**
   * 每頁筆數
   */
  pageSize: number;

  /**
   * 是否有更多資料
   */
  hasMore: boolean;
}
