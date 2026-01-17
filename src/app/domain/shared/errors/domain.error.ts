/**
 * Domain Error 基類
 * 
 * 所有領域錯誤的基類
 * 提供統一的錯誤處理和追蹤機制
 */
export abstract class DomainError extends Error {
  /**
   * 錯誤代碼 (用於國際化和錯誤分類)
   */
  public readonly code: string;

  /**
   * 錯誤上下文 (額外的錯誤資訊)
   */
  public readonly context?: Record<string, unknown>;

  /**
   * 錯誤發生時間
   */
  public readonly timestamp: Date;

  /**
   * 原始錯誤 (如果有的話)
   */
  public readonly cause?: Error;

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.timestamp = new Date();
    this.cause = cause;

    // 保持正確的原型鏈
    Object.setPrototypeOf(this, new.target.prototype);

    // 捕獲堆疊追蹤
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 將錯誤序列化為 JSON
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
      cause: this.cause
        ? {
            name: this.cause.name,
            message: this.cause.message,
            stack: this.cause.stack,
          }
        : undefined,
    };
  }

  /**
   * 將錯誤轉換為用戶友好的訊息
   */
  abstract toUserMessage(locale?: string): string;
}

/**
 * 檢查錯誤是否為 DomainError
 */
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}

/**
 * 從未知錯誤創建 DomainError
 */
export function fromUnknownError(
  error: unknown,
  defaultCode = 'UNKNOWN_ERROR',
  defaultMessage = 'An unknown error occurred'
): DomainError {
  if (isDomainError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new GenericDomainError(error.message, defaultCode, undefined, error);
  }

  return new GenericDomainError(
    defaultMessage,
    defaultCode,
    { originalError: error }
  );
}

/**
 * 通用領域錯誤 (當沒有更具體的錯誤類型時使用)
 */
export class GenericDomainError extends DomainError {
  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, code, context, cause);
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      return `發生錯誤: ${this.message}`;
    }
    return `Error: ${this.message}`;
  }
}

/**
 * 未找到錯誤
 */
export class NotFoundError extends DomainError {
  constructor(
    entityType: string,
    identifier: string,
    context?: Record<string, unknown>
  ) {
    super(
      `${entityType} with identifier "${identifier}" not found`,
      'NOT_FOUND',
      { entityType, identifier, ...context }
    );
  }

  toUserMessage(locale = 'zh-TW'): string {
    const entityType = this.context?.entityType as string;
    const identifier = this.context?.identifier as string;

    if (locale === 'zh-TW') {
      return `找不到 ${entityType}: ${identifier}`;
    }
    return `${entityType} "${identifier}" not found`;
  }
}

/**
 * 衝突錯誤
 */
export class ConflictError extends DomainError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'CONFLICT', context, cause);
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      return `衝突: ${this.message}`;
    }
    return `Conflict: ${this.message}`;
  }
}

/**
 * 業務規則違反錯誤
 */
export class BusinessRuleViolationError extends DomainError {
  constructor(
    rule: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message, 'BUSINESS_RULE_VIOLATION', { rule, ...context });
  }

  toUserMessage(locale = 'zh-TW'): string {
    const rule = this.context?.rule as string;

    if (locale === 'zh-TW') {
      return `違反業務規則 "${rule}": ${this.message}`;
    }
    return `Business rule "${rule}" violated: ${this.message}`;
  }
}
