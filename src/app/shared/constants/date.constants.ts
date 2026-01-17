/**
 * Date 相關常數
 * 
 * 定義應用程式中使用的日期時間相關常數
 * 
 * @module SharedConstants
 */

/**
 * 日期格式
 */
export const DATE_FORMATS = {
  short: 'yyyy/MM/dd',
  medium: 'yyyy年MM月dd日',
  long: 'yyyy年MM月dd日 HH:mm',
  full: 'yyyy年MM月dd日 HH:mm:ss',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  time: 'HH:mm',
  timeWithSeconds: 'HH:mm:ss',
  monthYear: 'yyyy年MM月',
  yearOnly: 'yyyy',
} as const;

/**
 * 相對時間單位 (秒)
 */
export const RELATIVE_TIME_UNITS = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,
  year: 31536000,
} as const;

/**
 * 相對時間文字
 */
export const RELATIVE_TIME_LABELS = {
  justNow: '剛剛',
  secondsAgo: (n: number) => `${n} 秒前`,
  minutesAgo: (n: number) => `${n} 分鐘前`,
  hoursAgo: (n: number) => `${n} 小時前`,
  daysAgo: (n: number) => `${n} 天前`,
  weeksAgo: (n: number) => `${n} 週前`,
  monthsAgo: (n: number) => `${n} 個月前`,
  yearsAgo: (n: number) => `${n} 年前`,
  future: '未來',
} as const;

/**
 * 星期幾文字
 */
export const WEEKDAY_LABELS = {
  short: ['日', '一', '二', '三', '四', '五', '六'],
  long: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
} as const;

/**
 * 月份文字
 */
export const MONTH_LABELS = {
  short: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  long: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
} as const;

/**
 * 時區
 */
export const TIMEZONE = {
  default: 'Asia/Taipei',
  utc: 'UTC',
} as const;

/**
 * 日期選擇器預設選項
 */
export const DATEPICKER_DEFAULTS = {
  minDate: null,
  maxDate: null,
  startView: 'month' as const,
  touchUi: false,
} as const;
