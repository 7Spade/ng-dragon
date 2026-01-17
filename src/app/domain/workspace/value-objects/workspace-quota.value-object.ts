/**
 * Workspace Quota 值物件
 * 
 * 封裝 Workspace 的配額限制
 * 用於控制資源使用量
 */
export class WorkspaceQuota {
  private readonly _maxMembers: number;
  private readonly _maxStorage: number; // 單位: MB
  private readonly _maxProjects: number;

  private constructor(
    maxMembers: number,
    maxStorage: number,
    maxProjects: number
  ) {
    this._maxMembers = maxMembers;
    this._maxStorage = maxStorage;
    this._maxProjects = maxProjects;
  }

  /**
   * 創建 WorkspaceQuota
   */
  static create(
    maxMembers: number,
    maxStorage: number,
    maxProjects: number
  ): WorkspaceQuota {
    if (maxMembers < 1) {
      throw new Error('Max members must be at least 1');
    }
    if (maxStorage < 0) {
      throw new Error('Max storage must be non-negative');
    }
    if (maxProjects < 0) {
      throw new Error('Max projects must be non-negative');
    }

    return new WorkspaceQuota(maxMembers, maxStorage, maxProjects);
  }

  /**
   * 創建免費方案配額
   */
  static createFree(): WorkspaceQuota {
    return new WorkspaceQuota(
      5,      // 最多 5 個成員
      1024,   // 1 GB 儲存空間
      3       // 最多 3 個專案
    );
  }

  /**
   * 創建專業方案配額
   */
  static createPro(): WorkspaceQuota {
    return new WorkspaceQuota(
      50,     // 最多 50 個成員
      10240,  // 10 GB 儲存空間
      50      // 最多 50 個專案
    );
  }

  /**
   * 創建企業方案配額
   */
  static createEnterprise(): WorkspaceQuota {
    return new WorkspaceQuota(
      Number.MAX_SAFE_INTEGER,  // 無限成員
      Number.MAX_SAFE_INTEGER,  // 無限儲存空間
      Number.MAX_SAFE_INTEGER   // 無限專案
    );
  }

  /**
   * 創建自訂配額
   */
  static createCustom(
    maxMembers: number,
    maxStorage: number,
    maxProjects: number
  ): WorkspaceQuota {
    return WorkspaceQuota.create(maxMembers, maxStorage, maxProjects);
  }

  /**
   * 獲取最大成員數
   */
  get maxMembers(): number {
    return this._maxMembers;
  }

  /**
   * 獲取最大儲存空間 (MB)
   */
  get maxStorage(): number {
    return this._maxStorage;
  }

  /**
   * 獲取最大專案數
   */
  get maxProjects(): number {
    return this._maxProjects;
  }

  /**
   * 檢查是否允許添加成員
   */
  canAddMember(currentMemberCount: number): boolean {
    return currentMemberCount < this._maxMembers;
  }

  /**
   * 檢查是否允許增加儲存空間
   */
  canIncreaseStorage(currentUsage: number, additionalStorage: number): boolean {
    return currentUsage + additionalStorage <= this._maxStorage;
  }

  /**
   * 檢查是否允許創建專案
   */
  canCreateProject(currentProjectCount: number): boolean {
    return currentProjectCount < this._maxProjects;
  }

  /**
   * 檢查是否為無限配額
   */
  isUnlimited(): boolean {
    return (
      this._maxMembers === Number.MAX_SAFE_INTEGER &&
      this._maxStorage === Number.MAX_SAFE_INTEGER &&
      this._maxProjects === Number.MAX_SAFE_INTEGER
    );
  }

  /**
   * 值相等性比較
   */
  equals(other: WorkspaceQuota): boolean {
    if (!(other instanceof WorkspaceQuota)) {
      return false;
    }
    return (
      this._maxMembers === other._maxMembers &&
      this._maxStorage === other._maxStorage &&
      this._maxProjects === other._maxProjects
    );
  }

  /**
   * 轉換為字串表示
   */
  toString(): string {
    if (this.isUnlimited()) {
      return 'Unlimited Quota';
    }
    return `Quota(members: ${this._maxMembers}, storage: ${this._maxStorage}MB, projects: ${this._maxProjects})`;
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): { maxMembers: number; maxStorage: number; maxProjects: number } {
    return {
      maxMembers: this._maxMembers,
      maxStorage: this._maxStorage,
      maxProjects: this._maxProjects,
    };
  }
}
