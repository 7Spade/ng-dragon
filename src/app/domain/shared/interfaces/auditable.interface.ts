/**
 * Auditable Interface
 * 
 * 可審計介面,追蹤實體的創建、更新和操作者資訊
 * 
 * 適用於需要審計追蹤的實體
 */
export interface Auditable {
  /**
   * 創建時間
   */
  readonly createdAt: Date;

  /**
   * 創建者 ID
   */
  readonly createdBy: string;

  /**
   * 最後更新時間
   */
  readonly updatedAt: Date;

  /**
   * 最後更新者 ID
   */
  readonly updatedBy: string;
}

/**
 * 部分可審計介面 (僅追蹤時間,不追蹤操作者)
 */
export interface PartiallyAuditable {
  /**
   * 創建時間
   */
  readonly createdAt: Date;

  /**
   * 最後更新時間
   */
  readonly updatedAt: Date;
}

/**
 * 檢查物件是否為 Auditable
 */
export function isAuditable(obj: unknown): obj is Auditable {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'createdAt' in obj &&
    'createdBy' in obj &&
    'updatedAt' in obj &&
    'updatedBy' in obj
  );
}

/**
 * 檢查物件是否為 PartiallyAuditable
 */
export function isPartiallyAuditable(
  obj: unknown
): obj is PartiallyAuditable {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'createdAt' in obj &&
    'updatedAt' in obj
  );
}

/**
 * 創建審計元數據
 */
export function createAuditMetadata(userId: string): {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
} {
  const now = new Date();
  return {
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
    updatedBy: userId,
  };
}

/**
 * 更新審計元數據
 */
export function updateAuditMetadata(
  current: Auditable,
  userId: string
): Auditable {
  return {
    ...current,
    updatedAt: new Date(),
    updatedBy: userId,
  };
}
