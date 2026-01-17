/**
 * Common Types
 * 
 * 定義應用程式中使用的通用型別
 * 
 * @module SharedTypes
 */

/**
 * ID 型別 (可以是 string 或 number)
 */
export type ID = string | number;

/**
 * Nullable 型別
 */
export type Nullable<T> = T | null;

/**
 * Optional 型別
 */
export type Optional<T> = T | undefined;

/**
 * Maybe 型別 (可能為 null 或 undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * DeepPartial 型別 (遞迴 Partial)
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * DeepReadonly 型別 (遞迴 Readonly)
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Primitive 型別
 */
export type Primitive = string | number | boolean | null | undefined;

/**
 * Dictionary 型別
 */
export type Dictionary<T = any> = Record<string, T>;

/**
 * StringKeys 型別 (取得 string 類型的 key)
 */
export type StringKeys<T> = Extract<keyof T, string>;

/**
 * ValueOf 型別 (取得物件的值型別)
 */
export type ValueOf<T> = T[keyof T];

/**
 * Constructor 型別
 */
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * AbstractConstructor 型別
 */
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

/**
 * Awaited 型別 (取得 Promise 的返回型別)
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * ArrayElement 型別 (取得陣列元素型別)
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * NonEmptyArray 型別 (非空陣列)
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Entries 型別 (Object.entries 返回型別)
 */
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Keys 型別 (Object.keys 返回型別)
 */
export type Keys<T> = (keyof T)[];

/**
 * Values 型別 (Object.values 返回型別)
 */
export type Values<T> = T[keyof T][];
