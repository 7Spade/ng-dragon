/**
 * Versionable Interface
 * 
 * 可版本化介面,支援樂觀鎖和版本控制
 * 
 * 適用於需要追蹤版本變更的實體
 */
export interface Versionable {
  /**
   * 版本號 (用於樂觀鎖)
   */
  readonly version: number;
}

/**
 * 增強版可版本化介面 (包含完整的版本歷史資訊)
 */
export interface EnhancedVersionable extends Versionable {
  /**
   * 版本歷史記錄
   */
  readonly versionHistory?: VersionHistoryEntry[];
}

/**
 * 版本歷史條目
 */
export interface VersionHistoryEntry {
  /**
   * 版本號
   */
  version: number;

  /**
   * 變更時間
   */
  changedAt: Date;

  /**
   * 變更者 ID
   */
  changedBy: string;

  /**
   * 變更說明
   */
  changeDescription?: string;

  /**
   * 變更類型
   */
  changeType: 'created' | 'updated' | 'restored' | 'archived' | 'deleted';
}

/**
 * 檢查物件是否為 Versionable
 */
export function isVersionable(obj: unknown): obj is Versionable {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'version' in obj &&
    typeof (obj as Versionable).version === 'number'
  );
}

/**
 * 增加版本號
 */
export function incrementVersion<T extends Versionable>(entity: T): T {
  return {
    ...entity,
    version: entity.version + 1,
  };
}

/**
 * 檢查版本衝突
 * @returns true 如果版本號匹配,false 如果有衝突
 */
export function checkVersionConflict(
  current: Versionable,
  expected: number
): boolean {
  return current.version !== expected;
}

/**
 * 創建版本歷史條目
 */
export function createVersionHistoryEntry(
  version: number,
  userId: string,
  changeType: VersionHistoryEntry['changeType'],
  description?: string
): VersionHistoryEntry {
  return {
    version,
    changedAt: new Date(),
    changedBy: userId,
    changeType,
    changeDescription: description,
  };
}

/**
 * 添加版本歷史條目
 */
export function addVersionHistory<T extends EnhancedVersionable>(
  entity: T,
  userId: string,
  changeType: VersionHistoryEntry['changeType'],
  description?: string
): T {
  const newVersion = entity.version + 1;
  const newEntry = createVersionHistoryEntry(
    newVersion,
    userId,
    changeType,
    description
  );

  return {
    ...entity,
    version: newVersion,
    versionHistory: [...(entity.versionHistory || []), newEntry],
  };
}
