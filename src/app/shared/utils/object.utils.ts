/**
 * Object Utilities
 * 
 * 提供物件操作的工具函數
 * 
 * @module SharedUtils
 */

/**
 * 深度複製物件
 * 
 * @param obj 要複製的物件
 * @returns 複製後的物件
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * 深度合併物件
 * 
 * @param target 目標物件
 * @param sources 來源物件
 * @returns 合併後的物件
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();
  if (!source) {
    return deepMerge(target, ...sources);
  }

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(target[key] as any, source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * 挑選物件的特定屬性
 * 
 * @param obj 物件
 * @param keys 要挑選的 key
 * @returns 新物件，只包含指定的 key
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * 排除物件的特定屬性
 * 
 * @param obj 物件
 * @param keys 要排除的 key
 * @returns 新物件，不包含指定的 key
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * 檢查物件是否為空 (沒有任何可枚舉屬性)
 * 
 * @param obj 物件
 * @returns 是否為空
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }

  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.length === 0;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }

  return false;
}

/**
 * 檢查物件是否不為空
 * 
 * @param obj 物件
 * @returns 是否不為空
 */
export function isNotEmpty(obj: any): boolean {
  return !isEmpty(obj);
}

/**
 * 檢查是否為物件
 * 
 * @param value 值
 * @returns 是否為物件
 */
export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 檢查是否為純物件 (Plain Object)
 * 
 * @param value 值
 * @returns 是否為純物件
 */
export function isPlainObject(value: any): value is Record<string, any> {
  if (!isObject(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * 取得物件的所有 key
 * 
 * @param obj 物件
 * @returns key 陣列
 */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * 取得物件的所有 value
 * 
 * @param obj 物件
 * @returns value 陣列
 */
export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

/**
 * 取得物件的所有 entries
 * 
 * @param obj 物件
 * @returns entries 陣列
 */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * 從 entries 建立物件
 * 
 * @param entries entries 陣列
 * @returns 物件
 */
export function fromEntries<K extends string | number | symbol, V>(
  entries: [K, V][]
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

/**
 * 檢查物件是否有指定的屬性
 * 
 * @param obj 物件
 * @param key 屬性名稱
 * @returns 是否有該屬性
 */
export function hasOwn<T extends object>(obj: T, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 凍結物件 (深度凍結)
 * 
 * @param obj 物件
 * @returns 凍結後的物件
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });

  return obj;
}

/**
 * 比較兩個物件是否相等 (深度比較)
 * 
 * @param obj1 第一個物件
 * @param obj2 第二個物件
 * @returns 是否相等
 */
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    return obj1.every((item, index) => isEqual(item, obj2[index]));
  }

  if (isPlainObject(obj1) && isPlainObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) => isEqual(obj1[key], obj2[key]));
  }

  return false;
}

/**
 * 依據路徑取得物件的值
 * 
 * @param obj 物件
 * @param path 路徑 (使用點號分隔)
 * @param defaultValue 預設值
 * @returns 值
 * 
 * @example
 * get({a: {b: {c: 1}}}, 'a.b.c') // 1
 * get({a: {b: {c: 1}}}, 'a.b.d', 'default') // 'default'
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue as T;
    }
    result = result[key];
  }

  return result === undefined ? (defaultValue as T) : result;
}

/**
 * 依據路徑設定物件的值
 * 
 * @param obj 物件
 * @param path 路徑 (使用點號分隔)
 * @param value 值
 * 
 * @example
 * set({a: {b: {c: 1}}}, 'a.b.c', 2) // {a: {b: {c: 2}}}
 * set({}, 'a.b.c', 1) // {a: {b: {c: 1}}}
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}
