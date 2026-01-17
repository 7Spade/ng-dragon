/**
 * Array Utilities
 * 
 * 提供陣列操作的工具函數
 * 
 * @module SharedUtils
 */

/**
 * 將陣列分塊
 * 
 * @param array 要分塊的陣列
 * @param size 每塊的大小
 * @returns 分塊後的二維陣列
 * 
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * 展平陣列 (一層)
 * 
 * @param array 要展平的陣列
 * @returns 展平後的陣列
 * 
 * @example
 * flatten([[1, 2], [3, 4], [5]]) // [1, 2, 3, 4, 5]
 */
export function flatten<T>(array: T[][]): T[] {
  return array.flat();
}

/**
 * 深度展平陣列
 * 
 * @param array 要展平的陣列
 * @returns 展平後的陣列
 * 
 * @example
 * flattenDeep([[1, [2]], [3, [4, [5]]]]) // [1, 2, 3, 4, 5]
 */
export function flattenDeep<T>(array: any[]): T[] {
  return array.flat(Infinity) as T[];
}

/**
 * 移除陣列中的重複項目
 * 
 * @param array 要去重的陣列
 * @param key 可選的 key 函數，用於比較複雜物件
 * @returns 去重後的陣列
 * 
 * @example
 * unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 * unique([{id: 1}, {id: 2}, {id: 1}], item => item.id) // [{id: 1}, {id: 2}]
 */
export function unique<T>(array: T[], key?: (item: T) => any): T[] {
  if (!key) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter((item) => {
    const k = key(item);
    if (seen.has(k)) {
      return false;
    }
    seen.add(k);
    return true;
  });
}

/**
 * 根據條件分組
 * 
 * @param array 要分組的陣列
 * @param key 分組的 key 函數
 * @returns 分組後的 Map
 * 
 * @example
 * groupBy([{type: 'a', val: 1}, {type: 'b', val: 2}, {type: 'a', val: 3}], item => item.type)
 * // Map { 'a' => [{type: 'a', val: 1}, {type: 'a', val: 3}], 'b' => [{type: 'b', val: 2}] }
 */
export function groupBy<T, K>(array: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  array.forEach((item) => {
    const k = key(item);
    const group = map.get(k) || [];
    group.push(item);
    map.set(k, group);
  });
  return map;
}

/**
 * 排序陣列
 * 
 * @param array 要排序的陣列
 * @param key 排序的 key 函數
 * @param direction 排序方向 ('asc' | 'desc')
 * @returns 排序後的陣列 (新陣列)
 * 
 * @example
 * sortBy([{name: 'Bob', age: 30}, {name: 'Alice', age: 25}], item => item.age)
 * // [{name: 'Alice', age: 25}, {name: 'Bob', age: 30}]
 */
export function sortBy<T>(
  array: T[],
  key: (item: T) => any,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = key(a);
    const bVal = key(b);
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * 取得陣列中的隨機項目
 * 
 * @param array 陣列
 * @returns 隨機項目
 */
export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 打亂陣列順序
 * 
 * @param array 要打亂的陣列
 * @returns 打亂後的陣列 (新陣列)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 計算陣列的總和
 * 
 * @param array 數字陣列
 * @param key 可選的 key 函數，用於取得數字
 * @returns 總和
 */
export function sum<T>(array: T[], key?: (item: T) => number): number {
  if (!key) {
    return (array as number[]).reduce((acc, val) => acc + val, 0);
  }
  return array.reduce((acc, item) => acc + key(item), 0);
}

/**
 * 計算陣列的平均值
 * 
 * @param array 數字陣列
 * @param key 可選的 key 函數，用於取得數字
 * @returns 平均值
 */
export function average<T>(array: T[], key?: (item: T) => number): number {
  if (array.length === 0) {
    return 0;
  }
  return sum(array, key) / array.length;
}

/**
 * 取得陣列中的最大值
 * 
 * @param array 數字陣列
 * @param key 可選的 key 函數，用於取得數字
 * @returns 最大值
 */
export function max<T>(array: T[], key?: (item: T) => number): number | undefined {
  if (array.length === 0) {
    return undefined;
  }
  if (!key) {
    return Math.max(...(array as number[]));
  }
  return Math.max(...array.map(key));
}

/**
 * 取得陣列中的最小值
 * 
 * @param array 數字陣列
 * @param key 可選的 key 函數，用於取得數字
 * @returns 最小值
 */
export function min<T>(array: T[], key?: (item: T) => number): number | undefined {
  if (array.length === 0) {
    return undefined;
  }
  if (!key) {
    return Math.min(...(array as number[]));
  }
  return Math.min(...array.map(key));
}

/**
 * 取得陣列的差集 (在 array1 但不在 array2 中的項目)
 * 
 * @param array1 第一個陣列
 * @param array2 第二個陣列
 * @param key 可選的 key 函數，用於比較複雜物件
 * @returns 差集陣列
 */
export function difference<T>(array1: T[], array2: T[], key?: (item: T) => any): T[] {
  if (!key) {
    const set = new Set(array2);
    return array1.filter((item) => !set.has(item));
  }

  const set = new Set(array2.map(key));
  return array1.filter((item) => !set.has(key(item)));
}

/**
 * 取得陣列的交集 (在 array1 和 array2 中都存在的項目)
 * 
 * @param array1 第一個陣列
 * @param array2 第二個陣列
 * @param key 可選的 key 函數，用於比較複雜物件
 * @returns 交集陣列
 */
export function intersection<T>(array1: T[], array2: T[], key?: (item: T) => any): T[] {
  if (!key) {
    const set = new Set(array2);
    return array1.filter((item) => set.has(item));
  }

  const set = new Set(array2.map(key));
  return array1.filter((item) => set.has(key(item)));
}

/**
 * 取得陣列的聯集 (array1 和 array2 的所有不重複項目)
 * 
 * @param array1 第一個陣列
 * @param array2 第二個陣列
 * @param key 可選的 key 函數，用於比較複雜物件
 * @returns 聯集陣列
 */
export function union<T>(array1: T[], array2: T[], key?: (item: T) => any): T[] {
  return unique([...array1, ...array2], key);
}

/**
 * 檢查陣列是否為空
 * 
 * @param array 陣列
 * @returns 是否為空
 */
export function isEmpty<T>(array: T[] | null | undefined): boolean {
  return !array || array.length === 0;
}

/**
 * 檢查陣列是否不為空
 * 
 * @param array 陣列
 * @returns 是否不為空
 */
export function isNotEmpty<T>(array: T[] | null | undefined): boolean {
  return !isEmpty(array);
}
