/**
 * Utility Types
 * 
 * 定義應用程式中使用的工具型別
 * 
 * @module SharedTypes
 */

/**
 * Override 型別 (覆寫型別)
 */
export type Override<T, U> = Omit<T, keyof U> & U;

/**
 * RequireAtLeastOne 型別 (至少需要一個屬性)
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * RequireOnlyOne 型別 (只需要一個屬性)
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

/**
 * Mutable 型別 (移除 readonly)
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * DeepMutable 型別 (遞迴移除 readonly)
 */
export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

/**
 * PartialBy 型別 (部分屬性設為 Optional)
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * RequiredBy 型別 (部分屬性設為 Required)
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * NonNullableFields 型別 (所有屬性設為 NonNullable)
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Modify 型別 (修改特定屬性的型別)
 */
export type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Merge 型別 (合併兩個型別)
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Equals 型別 (判斷兩個型別是否相等)
 */
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;

/**
 * IsAny 型別 (判斷是否為 any)
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * IsUnknown 型別 (判斷是否為 unknown)
 */
export type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
  ? true
  : false;

/**
 * Writeable 型別 (移除 readonly，別名 Mutable)
 */
export type Writeable<T> = Mutable<T>;

/**
 * UnionToIntersection 型別 (Union 轉 Intersection)
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * Exact 型別 (精確型別匹配)
 */
export type Exact<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;
