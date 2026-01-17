/**
 * Identifiable Interface
 * 
 * 可識別介面,確保實體有唯一識別ID
 * 
 * @template TId - ID 的類型
 */
export interface Identifiable<TId = string> {
  /**
   * 唯一識別ID
   */
  readonly id: TId;
}

/**
 * 檢查物件是否為 Identifiable
 */
export function isIdentifiable<TId = string>(
  obj: unknown
): obj is Identifiable<TId> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    obj.id !== undefined &&
    obj.id !== null
  );
}

/**
 * 從 Identifiable 陣列中提取 ID 陣列
 */
export function extractIds<TId = string>(
  items: Identifiable<TId>[]
): TId[] {
  return items.map((item) => item.id);
}

/**
 * 根據 ID 查找 Identifiable 物件
 */
export function findById<T extends Identifiable<TId>, TId = string>(
  items: T[],
  id: TId
): T | undefined {
  return items.find((item) => item.id === id);
}

/**
 * 根據 ID 過濾 Identifiable 物件
 */
export function filterByIds<T extends Identifiable<TId>, TId = string>(
  items: T[],
  ids: TId[]
): T[] {
  return items.filter((item) => ids.includes(item.id));
}

/**
 * 檢查 ID 是否存在於陣列中
 */
export function hasId<T extends Identifiable<TId>, TId = string>(
  items: T[],
  id: TId
): boolean {
  return items.some((item) => item.id === id);
}
