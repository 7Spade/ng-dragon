import { Slug } from '../../shared/value-objects';

/**
 * Workspace Identity 值物件
 * 
 * 封裝 Workspace 的身份識別資訊
 * 包含名稱和 Slug (URL 友善的標識符)
 */
export class WorkspaceIdentity {
  private readonly _name: string;
  private readonly _slug: Slug;

  private constructor(name: string, slug: Slug) {
    this._name = name;
    this._slug = slug;
  }

  /**
   * 創建 WorkspaceIdentity
   * 
   * @param name - Workspace 名稱
   * @param slug - 可選的 Slug,如果不提供則從名稱自動生成
   */
  static create(name: string, slug?: string): WorkspaceIdentity {
    if (!name || name.trim().length === 0) {
      throw new Error('Workspace name cannot be empty');
    }

    const trimmedName = name.trim();

    if (trimmedName.length > 100) {
      throw new Error('Workspace name cannot exceed 100 characters');
    }

    // 如果提供了 slug 就使用它,否則從名稱生成
    const workspaceSlug = slug ? Slug.create(slug) : Slug.fromString(trimmedName);

    return new WorkspaceIdentity(trimmedName, workspaceSlug);
  }

  /**
   * 獲取 Workspace 名稱
   */
  get name(): string {
    return this._name;
  }

  /**
   * 獲取 Workspace Slug
   */
  get slug(): Slug {
    return this._slug;
  }

  /**
   * 更新名稱 (創建新的 WorkspaceIdentity,保持不可變性)
   */
  changeName(newName: string): WorkspaceIdentity {
    return WorkspaceIdentity.create(newName, this._slug.value);
  }

  /**
   * 更新 Slug (創建新的 WorkspaceIdentity,保持不可變性)
   */
  changeSlug(newSlug: string): WorkspaceIdentity {
    return WorkspaceIdentity.create(this._name, newSlug);
  }

  /**
   * 值相等性比較
   */
  equals(other: WorkspaceIdentity): boolean {
    if (!(other instanceof WorkspaceIdentity)) {
      return false;
    }
    return this._name === other._name && this._slug.equals(other._slug);
  }

  /**
   * 轉換為字串表示
   */
  toString(): string {
    return `${this._name} (${this._slug.value})`;
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): { name: string; slug: string } {
    return {
      name: this._name,
      slug: this._slug.value,
    };
  }
}
