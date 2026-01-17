/**
 * 通用 ID 值物件基類
 * 
 * 設計原則:
 * - 不可變性: 一旦創建,值不可改變
 * - 值相等性: 基於值相等,而非引用相等
 * - 類型安全: 使用泛型約束確保類型安全
 * 
 * @template T - ID 的具體類型(string, number等)
 */
export abstract class Id<T = string> {
  protected readonly _value: T;

  constructor(value: T) {
    this.validate(value);
    this._value = value;
  }

  /**
   * 獲取 ID 的值
   */
  get value(): T {
    return this._value;
  }

  /**
   * 驗證 ID 的有效性
   * 子類應該覆寫此方法以實現特定的驗證邏輯
   */
  protected abstract validate(value: T): void;

  /**
   * 值相等性比較
   */
  equals(other: Id<T>): boolean {
    if (!(other instanceof this.constructor)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * 轉換為字串表示
   */
  toString(): string {
    return String(this._value);
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): T {
    return this._value;
  }
}

/**
 * UUID 格式的 ID 值物件
 */
export class UuidId extends Id<string> {
  private static readonly UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  protected validate(value: string): void {
    if (!value) {
      throw new Error('UUID cannot be empty');
    }
    if (!UuidId.UUID_PATTERN.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
  }

  /**
   * 生成新的 UUID
   */
  static generate(): UuidId {
    return new UuidId(crypto.randomUUID());
  }
}

/**
 * 字串 ID 值物件(用於 Firestore 文檔 ID 等)
 */
export class StringId extends Id<string> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 1500; // Firestore 文檔 ID 限制

  protected validate(value: string): void {
    if (!value) {
      throw new Error('String ID cannot be empty');
    }
    if (value.length < StringId.MIN_LENGTH) {
      throw new Error(
        `String ID must be at least ${StringId.MIN_LENGTH} characters`
      );
    }
    if (value.length > StringId.MAX_LENGTH) {
      throw new Error(
        `String ID cannot exceed ${StringId.MAX_LENGTH} characters`
      );
    }
    // Firestore 文檔 ID 不能包含 '/' 字符
    if (value.includes('/')) {
      throw new Error('String ID cannot contain forward slash (/)');
    }
  }
}

/**
 * 數字 ID 值物件
 */
export class NumericId extends Id<number> {
  protected validate(value: number): void {
    if (typeof value !== 'number') {
      throw new Error('Numeric ID must be a number');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Numeric ID must be an integer');
    }
    if (value <= 0) {
      throw new Error('Numeric ID must be positive');
    }
  }
}
