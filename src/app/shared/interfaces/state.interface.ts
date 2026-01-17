/**
 * State Interfaces
 * 
 * 定義應用程式中使用的狀態相關介面
 * 
 * @module SharedInterfaces
 */

/**
 * LoadingState 介面
 * 
 * 載入狀態
 */
export interface LoadingState {
  /**
   * 是否載入中
   */
  isLoading: boolean;

  /**
   * 錯誤訊息
   */
  error: string | null;
}

/**
 * DataState 介面
 * 
 * 資料狀態 (含資料、載入狀態和錯誤)
 */
export interface DataState<T> extends LoadingState {
  /**
   * 資料
   */
  data: T | null;
}

/**
 * ListState 介面
 * 
 * 列表狀態 (含列表資料、載入狀態和錯誤)
 */
export interface ListState<T> extends LoadingState {
  /**
   * 列表資料
   */
  items: T[];

  /**
   * 總筆數
   */
  total: number;
}

/**
 * SelectionState 介面
 * 
 * 選取狀態
 */
export interface SelectionState<T = string> {
  /**
   * 已選取項目 ID 列表
   */
  selectedIds: T[];

  /**
   * 是否全選
   */
  isAllSelected: boolean;

  /**
   * 是否部分選取
   */
  isIndeterminate: boolean;
}

/**
 * FilterState 介面
 * 
 * 篩選狀態
 */
export interface FilterState<T = Record<string, any>> {
  /**
   * 篩選條件
   */
  filters: T;

  /**
   * 是否有啟用的篩選
   */
  hasActiveFilters: boolean;
}

/**
 * SearchState 介面
 * 
 * 搜尋狀態
 */
export interface SearchState {
  /**
   * 搜尋關鍵字
   */
  query: string;

  /**
   * 是否搜尋中
   */
  isSearching: boolean;

  /**
   * 搜尋結果數量
   */
  resultCount: number;
}

/**
 * FormState 介面
 * 
 * 表單狀態
 */
export interface FormState {
  /**
   * 是否送出中
   */
  isSubmitting: boolean;

  /**
   * 是否已送出
   */
  isSubmitted: boolean;

  /**
   * 是否有效
   */
  isValid: boolean;

  /**
   * 是否骯髒 (已修改)
   */
  isDirty: boolean;

  /**
   * 錯誤訊息
   */
  errors: Record<string, string>;
}

/**
 * UIState 介面
 * 
 * UI 狀態
 */
export interface UIState {
  /**
   * 側邊欄是否開啟
   */
  isSidebarOpen: boolean;

  /**
   * 是否行動裝置檢視
   */
  isMobileView: boolean;

  /**
   * 主題模式
   */
  theme: 'light' | 'dark' | 'auto';
}

/**
 * AsyncState 介面
 * 
 * 非同步狀態 (狀態機模式)
 */
export type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

/**
 * RemoteData 介面
 * 
 * 遠端資料狀態 (別名 AsyncState)
 */
export type RemoteData<T, E = Error> = AsyncState<T, E>;
