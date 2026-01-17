/**
 * Sort Direction 列舉
 * 
 * 定義排序方向
 * 
 * @module SharedEnums
 */

/**
 * 排序方向
 */
export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc',
}

/**
 * 排序方向顯示名稱
 */
export const SORT_DIRECTION_LABELS: Record<SortDirection, string> = {
  [SortDirection.Ascending]: '升序',
  [SortDirection.Descending]: '降序',
};

/**
 * 排序方向圖示
 */
export const SORT_DIRECTION_ICONS: Record<SortDirection, string> = {
  [SortDirection.Ascending]: 'arrow_upward',
  [SortDirection.Descending]: 'arrow_downward',
};
