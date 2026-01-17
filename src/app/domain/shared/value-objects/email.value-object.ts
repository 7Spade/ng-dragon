/**
 * Email 值物件
 * 
 * 設計原則:
 * - 不可變性: Email 一旦創建不可變更
 * - 驗證: 創建時驗證 Email 格式
 * - 正規化: 自動轉換為小寫
 * 
 * 使用場景:
 * - 用戶 Email
 * - 組織聯絡 Email
 * - 邀請 Email
 */
export class Email {
  private static readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static readonly MAX_LENGTH = 254; // RFC 5321 標準

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * 創建 Email 值物件
   * @param value - Email 字串
   * @throws Error 如果 Email 格式無效
   */
  static create(value: string): Email {
    if (!value) {
      throw new Error('Email cannot be empty');
    }

    const normalized = value.trim().toLowerCase();

    if (normalized.length > Email.MAX_LENGTH) {
      throw new Error(`Email cannot exceed ${Email.MAX_LENGTH} characters`);
    }

    if (!Email.EMAIL_PATTERN.test(normalized)) {
      throw new Error(`Invalid email format: ${value}`);
    }

    return new Email(normalized);
  }

  /**
   * 獲取 Email 值
   */
  get value(): string {
    return this._value;
  }

  /**
   * 獲取 Email 的本地部分 (@ 符號前)
   */
  get localPart(): string {
    return this._value.split('@')[0];
  }

  /**
   * 獲取 Email 的域名部分 (@ 符號後)
   */
  get domain(): string {
    return this._value.split('@')[1];
  }

  /**
   * 值相等性比較
   */
  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * 轉換為字串表示
   */
  toString(): string {
    return this._value;
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): string {
    return this._value;
  }

  /**
   * 遮罩 Email (用於顯示,保護隱私)
   * 例: john.doe@example.com -> j***@example.com
   */
  mask(): string {
    const [local, domain] = this._value.split('@');
    if (local.length <= 1) {
      return `*@${domain}`;
    }
    return `${local[0]}***@${domain}`;
  }
}
