/**
 * Date Utilities
 * 
 * 提供日期操作的工具函數
 * 
 * @module SharedUtils
 */

import {
  DATE_FORMATS,
  RELATIVE_TIME_UNITS,
  RELATIVE_TIME_LABELS,
} from '../constants/date.constants';

/**
 * 格式化日期
 * 
 * @param date 日期
 * @param format 格式字串
 * @returns 格式化後的字串
 * 
 * @example
 * formatDate(new Date(), 'yyyy/MM/dd') // '2024/01/15'
 */
export function formatDate(date: Date | string | number, format: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const milliseconds = String(d.getMilliseconds()).padStart(3, '0');

  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds);
}

/**
 * 解析日期字串
 * 
 * @param dateString 日期字串
 * @returns Date 物件或 null
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * 取得相對時間文字 (例如：3 分鐘前)
 * 
 * @param date 日期
 * @param now 當前時間 (預設為現在)
 * @returns 相對時間文字
 * 
 * @example
 * getRelativeTime(new Date(Date.now() - 60000)) // '1 分鐘前'
 */
export function getRelativeTime(date: Date | string | number, now: Date = new Date()): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '';
  }

  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return RELATIVE_TIME_LABELS.future;
  }

  if (diffInSeconds < 60) {
    return RELATIVE_TIME_LABELS.justNow;
  }

  if (diffInSeconds < RELATIVE_TIME_UNITS.hour) {
    const minutes = Math.floor(diffInSeconds / RELATIVE_TIME_UNITS.minute);
    return RELATIVE_TIME_LABELS.minutesAgo(minutes);
  }

  if (diffInSeconds < RELATIVE_TIME_UNITS.day) {
    const hours = Math.floor(diffInSeconds / RELATIVE_TIME_UNITS.hour);
    return RELATIVE_TIME_LABELS.hoursAgo(hours);
  }

  if (diffInSeconds < RELATIVE_TIME_UNITS.week) {
    const days = Math.floor(diffInSeconds / RELATIVE_TIME_UNITS.day);
    return RELATIVE_TIME_LABELS.daysAgo(days);
  }

  if (diffInSeconds < RELATIVE_TIME_UNITS.month) {
    const weeks = Math.floor(diffInSeconds / RELATIVE_TIME_UNITS.week);
    return RELATIVE_TIME_LABELS.weeksAgo(weeks);
  }

  if (diffInSeconds < RELATIVE_TIME_UNITS.year) {
    const months = Math.floor(diffInSeconds / RELATIVE_TIME_UNITS.month);
    return RELATIVE_TIME_LABELS.monthsAgo(months);
  }

  const years = Math.floor(diffInSeconds / RELATIVE_TIME_UNITS.year);
  return RELATIVE_TIME_LABELS.yearsAgo(years);
}

/**
 * 計算兩個日期之間的差異
 * 
 * @param date1 第一個日期
 * @param date2 第二個日期
 * @param unit 單位 ('days' | 'hours' | 'minutes' | 'seconds')
 * @returns 差異值
 */
export function dateDiff(
  date1: Date | string | number,
  date2: Date | string | number,
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(d1.getTime() - d2.getTime());

  switch (unit) {
    case 'seconds':
      return Math.floor(diffInMs / 1000);
    case 'minutes':
      return Math.floor(diffInMs / (1000 * 60));
    case 'hours':
      return Math.floor(diffInMs / (1000 * 60 * 60));
    case 'days':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    default:
      return 0;
  }
}

/**
 * 增加天數
 * 
 * @param date 日期
 * @param days 天數
 * @returns 新日期
 */
export function addDays(date: Date | string | number, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * 增加月份
 * 
 * @param date 日期
 * @param months 月份數
 * @returns 新日期
 */
export function addMonths(date: Date | string | number, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * 增加年份
 * 
 * @param date 日期
 * @param years 年份數
 * @returns 新日期
 */
export function addYears(date: Date | string | number, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * 取得日期的開始時間 (00:00:00)
 * 
 * @param date 日期
 * @returns 開始時間
 */
export function startOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 取得日期的結束時間 (23:59:59)
 * 
 * @param date 日期
 * @returns 結束時間
 */
export function endOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 取得月份的開始日期
 * 
 * @param date 日期
 * @returns 月份開始日期
 */
export function startOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 取得月份的結束日期
 * 
 * @param date 日期
 * @returns 月份結束日期
 */
export function endOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 檢查是否為今天
 * 
 * @param date 日期
 * @returns 是否為今天
 */
export function isToday(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * 檢查是否為昨天
 * 
 * @param date 日期
 * @returns 是否為昨天
 */
export function isYesterday(date: Date | string | number): boolean {
  const d = new Date(date);
  const yesterday = addDays(new Date(), -1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * 檢查是否為明天
 * 
 * @param date 日期
 * @returns 是否為明天
 */
export function isTomorrow(date: Date | string | number): boolean {
  const d = new Date(date);
  const tomorrow = addDays(new Date(), 1);
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
}

/**
 * 檢查是否為週末
 * 
 * @param date 日期
 * @returns 是否為週末
 */
export function isWeekend(date: Date | string | number): boolean {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6;
}

/**
 * 檢查是否為工作日
 * 
 * @param date 日期
 * @returns 是否為工作日
 */
export function isWeekday(date: Date | string | number): boolean {
  return !isWeekend(date);
}

/**
 * 檢查日期是否在範圍內
 * 
 * @param date 日期
 * @param start 開始日期
 * @param end 結束日期
 * @returns 是否在範圍內
 */
export function isInRange(
  date: Date | string | number,
  start: Date | string | number,
  end: Date | string | number
): boolean {
  const d = new Date(date).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return d >= s && d <= e;
}

/**
 * 取得年齡
 * 
 * @param birthDate 出生日期
 * @param now 當前日期 (預設為現在)
 * @returns 年齡
 */
export function getAge(birthDate: Date | string | number, now: Date = new Date()): number {
  const birth = new Date(birthDate);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * 檢查是否為有效日期
 * 
 * @param date 日期
 * @returns 是否為有效日期
 */
export function isValidDate(date: any): boolean {
  const d = new Date(date);
  return !isNaN(d.getTime());
}
