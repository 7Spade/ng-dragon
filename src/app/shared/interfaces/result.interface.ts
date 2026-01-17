/**
 * Result Interfaces
 * 
 * 定義應用程式中使用的結果封裝介面
 * 
 * @module SharedInterfaces
 */

/**
 * Result 介面
 * 
 * 操作結果封裝
 */
export interface Result<T, E = Error> {
  /**
   * 是否成功
   */
  isSuccess: boolean;

  /**
   * 是否失敗
   */
  isFailure: boolean;

  /**
   * 成功時的資料
   */
  data?: T;

  /**
   * 失敗時的錯誤
   */
  error?: E;
}

/**
 * Success Result 介面
 * 
 * 成功結果
 */
export interface SuccessResult<T> extends Result<T, never> {
  isSuccess: true;
  isFailure: false;
  data: T;
  error?: never;
}

/**
 * Failure Result 介面
 * 
 * 失敗結果
 */
export interface FailureResult<E = Error> extends Result<never, E> {
  isSuccess: false;
  isFailure: true;
  data?: never;
  error: E;
}

/**
 * ApiResult 介面
 * 
 * API 回應結果
 */
export interface ApiResult<T> {
  /**
   * 是否成功
   */
  success: boolean;

  /**
   * 資料
   */
  data: T | null;

  /**
   * 錯誤訊息
   */
  message: string | null;

  /**
   * 錯誤代碼
   */
  errorCode: string | null;

  /**
   * 時間戳記
   */
  timestamp: Date;
}

/**
 * ApiResponse 介面
 * 
 * API 回應 (別名 ApiResult)
 */
export type ApiResponse<T> = ApiResult<T>;

/**
 * ValidationResult 介面
 * 
 * 驗證結果
 */
export interface ValidationResult {
  /**
   * 是否有效
   */
  isValid: boolean;

  /**
   * 錯誤訊息列表
   */
  errors: ValidationError[];
}

/**
 * ValidationError 介面
 * 
 * 驗證錯誤
 */
export interface ValidationError {
  /**
   * 欄位名稱
   */
  field: string;

  /**
   * 錯誤訊息
   */
  message: string;

  /**
   * 錯誤代碼
   */
  code?: string;

  /**
   * 附加資訊
   */
  meta?: Record<string, any>;
}

/**
 * OperationResult 介面
 * 
 * 操作結果 (含訊息)
 */
export interface OperationResult {
  /**
   * 是否成功
   */
  success: boolean;

  /**
   * 訊息
   */
  message: string;

  /**
   * 附加資訊
   */
  meta?: Record<string, any>;
}
