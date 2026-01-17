import { DomainError } from './domain.error';

/**
 * Validation Error
 * 
 * 驗證錯誤,當輸入資料不符合驗證規則時拋出
 */
export class ValidationError extends DomainError {
  /**
   * 驗證失敗的欄位
   */
  public readonly fields: ValidationFieldError[];

  constructor(
    message: string,
    fields: ValidationFieldError[],
    context?: Record<string, unknown>
  ) {
    super(message, 'VALIDATION_ERROR', { fields, ...context });
    this.fields = fields;
  }

  /**
   * 創建單一欄位驗證錯誤
   */
  static forField(
    field: string,
    message: string,
    value?: unknown
  ): ValidationError {
    return new ValidationError(`Validation failed for field: ${field}`, [
      { field, message, value },
    ]);
  }

  /**
   * 創建多欄位驗證錯誤
   */
  static forFields(
    errors: ValidationFieldError[],
    message = 'Validation failed'
  ): ValidationError {
    return new ValidationError(message, errors);
  }

  /**
   * 添加欄位錯誤
   */
  addFieldError(field: string, message: string, value?: unknown): void {
    this.fields.push({ field, message, value });
  }

  /**
   * 檢查特定欄位是否有錯誤
   */
  hasFieldError(field: string): boolean {
    return this.fields.some((error) => error.field === field);
  }

  /**
   * 獲取特定欄位的所有錯誤
   */
  getFieldErrors(field: string): ValidationFieldError[] {
    return this.fields.filter((error) => error.field === field);
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      const fieldMessages = this.fields
        .map((f) => `${f.field}: ${f.message}`)
        .join(', ');
      return `驗證失敗: ${fieldMessages}`;
    }

    const fieldMessages = this.fields
      .map((f) => `${f.field}: ${f.message}`)
      .join(', ');
    return `Validation failed: ${fieldMessages}`;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      fields: this.fields,
    };
  }
}

/**
 * 驗證欄位錯誤
 */
export interface ValidationFieldError {
  /**
   * 欄位名稱
   */
  field: string;

  /**
   * 錯誤訊息
   */
  message: string;

  /**
   * 欄位值 (可選,用於除錯)
   */
  value?: unknown;

  /**
   * 驗證規則代碼 (可選)
   */
  ruleCode?: string;
}

/**
 * 必填驗證錯誤
 */
export class RequiredFieldError extends ValidationError {
  constructor(field: string, context?: Record<string, unknown>) {
    super(`Field "${field}" is required`, [
      {
        field,
        message: 'This field is required',
        ruleCode: 'REQUIRED',
      },
    ], context);
  }
}

/**
 * 格式驗證錯誤
 */
export class InvalidFormatError extends ValidationError {
  constructor(
    field: string,
    expectedFormat: string,
    actualValue?: unknown,
    context?: Record<string, unknown>
  ) {
    super(`Field "${field}" has invalid format. Expected: ${expectedFormat}`, [
      {
        field,
        message: `Invalid format. Expected: ${expectedFormat}`,
        value: actualValue,
        ruleCode: 'INVALID_FORMAT',
      },
    ], context);
  }
}

/**
 * 範圍驗證錯誤
 */
export class OutOfRangeError extends ValidationError {
  constructor(
    field: string,
    min?: number,
    max?: number,
    actualValue?: unknown,
    context?: Record<string, unknown>
  ) {
    const rangeMessage =
      min !== undefined && max !== undefined
        ? `between ${min} and ${max}`
        : min !== undefined
          ? `greater than or equal to ${min}`
          : `less than or equal to ${max}`;

    super(`Field "${field}" is out of range. Expected: ${rangeMessage}`, [
      {
        field,
        message: `Value out of range. Expected: ${rangeMessage}`,
        value: actualValue,
        ruleCode: 'OUT_OF_RANGE',
      },
    ], { min, max, ...context });
  }
}

/**
 * 長度驗證錯誤
 */
export class InvalidLengthError extends ValidationError {
  constructor(
    field: string,
    minLength?: number,
    maxLength?: number,
    actualLength?: number,
    context?: Record<string, unknown>
  ) {
    const lengthMessage =
      minLength !== undefined && maxLength !== undefined
        ? `between ${minLength} and ${maxLength} characters`
        : minLength !== undefined
          ? `at least ${minLength} characters`
          : `at most ${maxLength} characters`;

    super(`Field "${field}" has invalid length. Expected: ${lengthMessage}`, [
      {
        field,
        message: `Invalid length. Expected: ${lengthMessage}`,
        value: actualLength,
        ruleCode: 'INVALID_LENGTH',
      },
    ], { minLength, maxLength, actualLength, ...context });
  }
}

/**
 * 唯一性驗證錯誤
 */
export class DuplicateValueError extends ValidationError {
  constructor(
    field: string,
    value: unknown,
    context?: Record<string, unknown>
  ) {
    super(`Field "${field}" must be unique. Value already exists.`, [
      {
        field,
        message: 'Value already exists. This field must be unique.',
        value,
        ruleCode: 'DUPLICATE_VALUE',
      },
    ], context);
  }
}
