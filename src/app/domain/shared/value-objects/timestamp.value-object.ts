/**
 * Timestamp 值物件
 * 
 * 設計原則:
 * - 不可變性: 時間戳一旦創建不可變更
 * - 類型安全: 封裝 Date 物件,避免直接操作
 * - 比較: 支援時間比較操作
 * 
 * 使用場景:
 * - 創建時間 (createdAt)
 * - 更新時間 (updatedAt)
 * - 過期時間 (expiresAt)
 * - 歸檔時間 (archivedAt)
 */
export class Timestamp {
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  /**
   * 從 Date 創建 Timestamp
   */
  static fromDate(date: Date): Timestamp {
    if (!(date instanceof Date)) {
      throw new Error('Invalid date object');
    }
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date value');
    }
    return new Timestamp(new Date(date.getTime()));
  }

  /**
   * 從毫秒時間戳創建
   */
  static fromMilliseconds(ms: number): Timestamp {
    if (typeof ms !== 'number' || ms < 0) {
      throw new Error('Invalid milliseconds value');
    }
    return new Timestamp(new Date(ms));
  }

  /**
   * 從 ISO 字串創建
   */
  static fromISO(isoString: string): Timestamp {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid ISO string: ${isoString}`);
    }
    return new Timestamp(date);
  }

  /**
   * 創建當前時間的 Timestamp
   */
  static now(): Timestamp {
    return new Timestamp(new Date());
  }

  /**
   * 獲取 Date 物件的副本 (保護不可變性)
   */
  get value(): Date {
    return new Date(this._value.getTime());
  }

  /**
   * 獲取毫秒時間戳
   */
  get milliseconds(): number {
    return this._value.getTime();
  }

  /**
   * 獲取 ISO 字串表示
   */
  get isoString(): string {
    return this._value.toISOString();
  }

  /**
   * 值相等性比較
   */
  equals(other: Timestamp): boolean {
    if (!(other instanceof Timestamp)) {
      return false;
    }
    return this._value.getTime() === other._value.getTime();
  }

  /**
   * 早於比較
   */
  isBefore(other: Timestamp): boolean {
    return this._value.getTime() < other._value.getTime();
  }

  /**
   * 晚於比較
   */
  isAfter(other: Timestamp): boolean {
    return this._value.getTime() > other._value.getTime();
  }

  /**
   * 在指定時間範圍內
   */
  isBetween(start: Timestamp, end: Timestamp): boolean {
    const time = this._value.getTime();
    return time >= start._value.getTime() && time <= end._value.getTime();
  }

  /**
   * 是否為未來時間
   */
  isFuture(): boolean {
    return this._value.getTime() > Date.now();
  }

  /**
   * 是否為過去時間
   */
  isPast(): boolean {
    return this._value.getTime() < Date.now();
  }

  /**
   * 添加時間
   */
  add(
    amount: number,
    unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days'
  ): Timestamp {
    let ms = amount;
    switch (unit) {
      case 'seconds':
        ms *= 1000;
        break;
      case 'minutes':
        ms *= 60 * 1000;
        break;
      case 'hours':
        ms *= 60 * 60 * 1000;
        break;
      case 'days':
        ms *= 24 * 60 * 60 * 1000;
        break;
    }
    return Timestamp.fromMilliseconds(this._value.getTime() + ms);
  }

  /**
   * 減去時間
   */
  subtract(
    amount: number,
    unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days'
  ): Timestamp {
    return this.add(-amount, unit);
  }

  /**
   * 計算與另一個時間的差異 (毫秒)
   */
  diffInMilliseconds(other: Timestamp): number {
    return this._value.getTime() - other._value.getTime();
  }

  /**
   * 轉換為字串表示
   */
  toString(): string {
    return this._value.toISOString();
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): string {
    return this._value.toISOString();
  }

  /**
   * 格式化顯示 (本地化)
   */
  toLocaleDateString(locale = 'zh-TW'): string {
    return this._value.toLocaleDateString(locale);
  }

  /**
   * 格式化顯示 (日期時間)
   */
  toLocaleString(locale = 'zh-TW'): string {
    return this._value.toLocaleString(locale);
  }
}
