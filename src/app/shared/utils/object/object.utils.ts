/**
 * Object Utility Functions
 * 
 * Provides pure utility functions for object manipulation and transformation.
 */

/**
 * Creates a deep clone of an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Set) return new Set(Array.from(obj).map(item => deepClone(item))) as any;
  if (obj instanceof Map) return new Map(Array.from(obj).map(([key, val]) => [deepClone(key), deepClone(val)])) as any;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Deep merges two objects
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = output[key];
      
      if (isObject(sourceValue) && isObject(targetValue)) {
        output[key] = deepMerge(targetValue as any, sourceValue as any);
      } else {
        output[key] = sourceValue as any;
      }
    }
  }
  
  return output;
}

/**
 * Picks specified properties from an object
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omits specified properties from an object
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

/**
 * Checks if an object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Deep equality check for objects
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => isEqual(a[key], b[key]));
}

/**
 * Deep freezes an object to make it immutable
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });
  return obj as Readonly<T>;
}

/**
 * Maps object keys using a function
 */
export function mapKeys<T extends object>(obj: T, fn: (key: string) => string): any {
  const result: any = {};
  Object.keys(obj).forEach(key => {
    result[fn(key)] = (obj as any)[key];
  });
  return result;
}

/**
 * Maps object values using a function
 */
export function mapValues<T extends object, R>(obj: T, fn: (value: any, key: string) => R): Record<string, R> {
  const result: any = {};
  Object.keys(obj).forEach(key => {
    result[key] = fn((obj as any)[key], key);
  });
  return result;
}

/**
 * Helper to check if value is an object
 */
function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
