/**
 * Callback Types
 * 
 * 定義應用程式中使用的回調函數型別
 * 
 * @module SharedTypes
 */

/**
 * 無參數無返回值的回調函數
 */
export type VoidCallback = () => void;

/**
 * 無參數有返回值的回調函數
 */
export type Callback<T> = () => T;

/**
 * 有參數無返回值的回調函數
 */
export type Action<T> = (value: T) => void;

/**
 * 有參數有返回值的回調函數
 */
export type Func<T, R> = (value: T) => R;

/**
 * Predicate 函數 (返回 boolean)
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Comparator 函數 (比較函數)
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Transform 函數 (轉換函數)
 */
export type Transform<T, R> = (value: T) => R;

/**
 * Mapper 函數 (映射函數)
 */
export type Mapper<T, R> = Transform<T, R>;

/**
 * Reducer 函數 (聚合函數)
 */
export type Reducer<T, R> = (accumulator: R, current: T, index?: number) => R;

/**
 * Consumer 函數 (消費函數)
 */
export type Consumer<T> = Action<T>;

/**
 * Supplier 函數 (供應函數)
 */
export type Supplier<T> = Callback<T>;

/**
 * BiFunction 函數 (雙參數函數)
 */
export type BiFunction<T1, T2, R> = (arg1: T1, arg2: T2) => R;

/**
 * ErrorHandler 函數 (錯誤處理函數)
 */
export type ErrorHandler = (error: Error) => void;

/**
 * AsyncCallback 函數 (非同步回調函數)
 */
export type AsyncCallback<T> = () => Promise<T>;

/**
 * AsyncAction 函數 (非同步動作函數)
 */
export type AsyncAction<T> = (value: T) => Promise<void>;

/**
 * AsyncFunc 函數 (非同步函數)
 */
export type AsyncFunc<T, R> = (value: T) => Promise<R>;

/**
 * EventHandler 函數 (事件處理函數)
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * ChangeHandler 函數 (變更處理函數)
 */
export type ChangeHandler<T> = (value: T, previousValue: T) => void;
