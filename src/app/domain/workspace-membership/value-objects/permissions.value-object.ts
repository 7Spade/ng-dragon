/**
 * Permissions 值物件
 * 
 * 封裝成員在 Workspace 中的權限集合
 * 使用位元運算實現高效的權限檢查
 */
export class Permissions {
  /**
   * 權限位元標誌
   */
  public static readonly Permission = {
    // 讀取權限
    READ_WORKSPACE: 1 << 0,       // 0x0001 - 讀取工作區資訊
    READ_MEMBERS: 1 << 1,         // 0x0002 - 讀取成員列表
    READ_PROJECTS: 1 << 2,        // 0x0004 - 讀取專案
    READ_TASKS: 1 << 3,           // 0x0008 - 讀取任務
    READ_DOCUMENTS: 1 << 4,       // 0x0010 - 讀取文件

    // 寫入權限
    WRITE_WORKSPACE: 1 << 5,      // 0x0020 - 修改工作區設定
    WRITE_MEMBERS: 1 << 6,        // 0x0040 - 管理成員
    WRITE_PROJECTS: 1 << 7,       // 0x0080 - 管理專案
    WRITE_TASKS: 1 << 8,          // 0x0100 - 管理任務
    WRITE_DOCUMENTS: 1 << 9,      // 0x0200 - 管理文件

    // 刪除權限
    DELETE_WORKSPACE: 1 << 10,    // 0x0400 - 刪除工作區
    DELETE_MEMBERS: 1 << 11,      // 0x0800 - 移除成員
    DELETE_PROJECTS: 1 << 12,     // 0x1000 - 刪除專案
    DELETE_TASKS: 1 << 13,        // 0x2000 - 刪除任務
    DELETE_DOCUMENTS: 1 << 14,    // 0x4000 - 刪除文件

    // 管理權限
    MANAGE_PERMISSIONS: 1 << 15,  // 0x8000 - 管理權限
    INVITE_MEMBERS: 1 << 16,      // 0x10000 - 邀請成員
    MANAGE_BILLING: 1 << 17,      // 0x20000 - 管理帳單

    // 所有權限
    ALL: ~(~0 << 18),             // 所有權限的組合
  } as const;

  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  /**
   * 從權限值創建
   */
  static fromValue(value: number): Permissions {
    if (value < 0) {
      throw new Error('Permissions value cannot be negative');
    }
    return new Permissions(value);
  }

  /**
   * 從權限陣列創建
   */
  static fromArray(permissions: number[]): Permissions {
    let value = 0;
    for (const permission of permissions) {
      value |= permission;
    }
    return new Permissions(value);
  }

  /**
   * 創建空權限 (無任何權限)
   */
  static none(): Permissions {
    return new Permissions(0);
  }

  /**
   * 創建唯讀權限
   */
  static readOnly(): Permissions {
    return new Permissions(
      Permissions.Permission.READ_WORKSPACE |
      Permissions.Permission.READ_MEMBERS |
      Permissions.Permission.READ_PROJECTS |
      Permissions.Permission.READ_TASKS |
      Permissions.Permission.READ_DOCUMENTS
    );
  }

  /**
   * 創建編輯權限 (讀取 + 寫入,不包含刪除和管理)
   */
  static editor(): Permissions {
    return new Permissions(
      Permissions.Permission.READ_WORKSPACE |
      Permissions.Permission.READ_MEMBERS |
      Permissions.Permission.READ_PROJECTS |
      Permissions.Permission.READ_TASKS |
      Permissions.Permission.READ_DOCUMENTS |
      Permissions.Permission.WRITE_PROJECTS |
      Permissions.Permission.WRITE_TASKS |
      Permissions.Permission.WRITE_DOCUMENTS
    );
  }

  /**
   * 創建管理員權限 (除了刪除工作區和管理帳單外的所有權限)
   */
  static admin(): Permissions {
    return new Permissions(
      Permissions.Permission.ALL &
      ~Permissions.Permission.DELETE_WORKSPACE &
      ~Permissions.Permission.MANAGE_BILLING
    );
  }

  /**
   * 創建擁有者權限 (所有權限)
   */
  static owner(): Permissions {
    return new Permissions(Permissions.Permission.ALL);
  }

  /**
   * 獲取權限值
   */
  get value(): number {
    return this._value;
  }

  /**
   * 檢查是否擁有特定權限
   */
  has(permission: number): boolean {
    return (this._value & permission) === permission;
  }

  /**
   * 檢查是否擁有任一權限
   */
  hasAny(permissions: number[]): boolean {
    return permissions.some((permission) => this.has(permission));
  }

  /**
   * 檢查是否擁有所有權限
   */
  hasAll(permissions: number[]): boolean {
    return permissions.every((permission) => this.has(permission));
  }

  /**
   * 添加權限 (創建新的 Permissions,保持不可變性)
   */
  add(permission: number): Permissions {
    return new Permissions(this._value | permission);
  }

  /**
   * 移除權限 (創建新的 Permissions,保持不可變性)
   */
  remove(permission: number): Permissions {
    return new Permissions(this._value & ~permission);
  }

  /**
   * 合併權限
   */
  merge(other: Permissions): Permissions {
    return new Permissions(this._value | other._value);
  }

  /**
   * 交集權限
   */
  intersect(other: Permissions): Permissions {
    return new Permissions(this._value & other._value);
  }

  /**
   * 值相等性比較
   */
  equals(other: Permissions): boolean {
    if (!(other instanceof Permissions)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * 轉換為權限陣列
   */
  toArray(): number[] {
    const permissions: number[] = [];
    for (let i = 0; i < 32; i++) {
      const permission = 1 << i;
      if (this.has(permission)) {
        permissions.push(permission);
      }
    }
    return permissions;
  }

  /**
   * 轉換為字串表示
   */
  toString(): string {
    return `Permissions(0x${this._value.toString(16)})`;
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): number {
    return this._value;
  }
}
