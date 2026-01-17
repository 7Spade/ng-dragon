/**
 * 命令執行結果
 * 
 * 表示命令執行的結果狀態
 */
export interface CommandResult<TData = unknown, TError = Error> {
  /**
   * 是否成功執行
   */
  readonly success: boolean;
  
  /**
   * 執行結果數據
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
   * 額外的元數據
   */
  readonly metadata?: Record<string, unknown>;
}

/**
 * 創建成功的命令結果
 */
export function createSuccessResult<TData = unknown>(
  data: TData,
  metadata?: Record<string, unknown>
): CommandResult<TData> {
  return {
    success: true,
    data,
    timestamp: new Date(),
    metadata,
  };
}

/**
 * 創建失敗的命令結果
 */
export function createFailureResult<TError = Error>(
  error: TError,
  metadata?: Record<string, unknown>
): CommandResult<unknown, TError> {
  return {
    success: false,
    error,
    timestamp: new Date(),
    metadata,
  };
}
