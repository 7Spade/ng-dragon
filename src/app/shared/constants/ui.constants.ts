/**
 * UI 相關常數
 * 
 * 定義應用程式中使用的 UI 相關常數
 * 
 * @module SharedConstants
 */

/**
 * Avatar 尺寸選項
 */
export const AVATAR_SIZES = {
  small: 32,
  medium: 40,
  large: 56,
  xlarge: 72,
} as const;

/**
 * 動畫持續時間 (毫秒)
 */
export const ANIMATION_DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Z-Index 層級
 */
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * Chip 尺寸選項
 */
export const CHIP_SIZES = {
  small: 'small',
  medium: 'medium',
} as const;

/**
 * 載入狀態相關常數
 */
export const LOADING_STATES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

/**
 * 空狀態預設訊息
 */
export const EMPTY_STATE_MESSAGES = {
  noData: '沒有資料',
  noResults: '找不到符合的結果',
  noWorkspaces: '目前沒有工作區',
  noTasks: '目前沒有任務',
  noMembers: '目前沒有成員',
} as const;

/**
 * 預設分頁大小選項
 */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/**
 * 預設分頁大小
 */
export const DEFAULT_PAGE_SIZE = 25;

/**
 * 對話框預設寬度
 */
export const DIALOG_WIDTHS = {
  small: '400px',
  medium: '600px',
  large: '800px',
  xlarge: '1000px',
} as const;

/**
 * Snackbar 持續時間 (毫秒)
 */
export const SNACKBAR_DURATION = {
  short: 2000,
  medium: 3000,
  long: 5000,
} as const;

/**
 * Debounce 延遲時間 (毫秒)
 */
export const DEBOUNCE_TIME = {
  search: 300,
  input: 500,
  resize: 200,
  scroll: 100,
} as const;
