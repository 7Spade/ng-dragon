/**
 * Slug 值物件
 * 
 * 設計原則:
 * - URL 友善: 只包含小寫字母、數字和連字符
 * - 唯一性: 在同一範圍內唯一
 * - 可讀性: 人類可讀的 URL 路徑
 * 
 * 使用場景:
 * - Workspace Slug (例: /w/my-workspace)
 * - Organization Slug (例: /org/acme-corp)
 * - Document Slug (例: /doc/project-proposal)
 */
export class Slug {
  private static readonly SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 63; // DNS 標籤長度限制

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * 從字串創建 Slug
   * @param value - Slug 字串
   * @throws Error 如果 Slug 格式無效
   */
  static create(value: string): Slug {
    if (!value) {
      throw new Error('Slug cannot be empty');
    }

    const normalized = value.trim().toLowerCase();

    if (normalized.length < Slug.MIN_LENGTH) {
      throw new Error(`Slug must be at least ${Slug.MIN_LENGTH} characters`);
    }

    if (normalized.length > Slug.MAX_LENGTH) {
      throw new Error(`Slug cannot exceed ${Slug.MAX_LENGTH} characters`);
    }

    if (!Slug.SLUG_PATTERN.test(normalized)) {
      throw new Error(
        `Invalid slug format: ${value}. Only lowercase letters, numbers, and hyphens are allowed.`
      );
    }

    // 不能以連字符開始或結束
    if (normalized.startsWith('-') || normalized.endsWith('-')) {
      throw new Error('Slug cannot start or end with a hyphen');
    }

    return new Slug(normalized);
  }

  /**
   * 從任意字串生成 Slug
   * 自動轉換空格為連字符,移除特殊字符
   */
  static fromString(value: string): Slug {
    if (!value) {
      throw new Error('Cannot generate slug from empty string');
    }

    let slug = value
      .toLowerCase()
      .trim()
      // 替換空格為連字符
      .replace(/\s+/g, '-')
      // 移除非字母數字和連字符的字符
      .replace(/[^a-z0-9-]/g, '')
      // 移除連續的連字符
      .replace(/-+/g, '-')
      // 移除開頭和結尾的連字符
      .replace(/^-+|-+$/g, '');

    if (slug.length < Slug.MIN_LENGTH) {
      throw new Error(
        `Generated slug "${slug}" is too short (minimum ${Slug.MIN_LENGTH} characters)`
      );
    }

    if (slug.length > Slug.MAX_LENGTH) {
      slug = slug.substring(0, Slug.MAX_LENGTH).replace(/-+$/, '');
    }

    return new Slug(slug);
  }

  /**
   * 獲取 Slug 值
   */
  get value(): string {
    return this._value;
  }

  /**
   * 值相等性比較
   */
  equals(other: Slug): boolean {
    if (!(other instanceof Slug)) {
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
   * 添加後綴以確保唯一性
   * 例: my-workspace + 2 -> my-workspace-2
   */
  withSuffix(suffix: number | string): Slug {
    const newValue = `${this._value}-${suffix}`;
    return Slug.create(newValue);
  }
}
