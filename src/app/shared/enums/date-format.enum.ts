/**
 * Date Format 列舉
 * 
 * 定義日期格式選項
 * 
 * @module SharedEnums
 */

/**
 * 日期格式
 */
export enum DateFormat {
  Short = 'short',
  Medium = 'medium',
  Long = 'long',
  Full = 'full',
  ISO = 'iso',
  Time = 'time',
  TimeWithSeconds = 'timeWithSeconds',
  MonthYear = 'monthYear',
  YearOnly = 'yearOnly',
}

/**
 * 日期格式顯示名稱
 */
export const DATE_FORMAT_LABELS: Record<DateFormat, string> = {
  [DateFormat.Short]: '短格式',
  [DateFormat.Medium]: '中等格式',
  [DateFormat.Long]: '長格式',
  [DateFormat.Full]: '完整格式',
  [DateFormat.ISO]: 'ISO 格式',
  [DateFormat.Time]: '時間',
  [DateFormat.TimeWithSeconds]: '時間（含秒）',
  [DateFormat.MonthYear]: '月年',
  [DateFormat.YearOnly]: '年份',
};

/**
 * 日期格式範例
 */
export const DATE_FORMAT_EXAMPLES: Record<DateFormat, string> = {
  [DateFormat.Short]: '2024/01/15',
  [DateFormat.Medium]: '2024年01月15日',
  [DateFormat.Long]: '2024年01月15日 14:30',
  [DateFormat.Full]: '2024年01月15日 14:30:45',
  [DateFormat.ISO]: '2024-01-15T14:30:45.000Z',
  [DateFormat.Time]: '14:30',
  [DateFormat.TimeWithSeconds]: '14:30:45',
  [DateFormat.MonthYear]: '2024年01月',
  [DateFormat.YearOnly]: '2024',
};
