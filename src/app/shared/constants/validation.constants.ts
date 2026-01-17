/**
 * Validation 相關常數
 * 
 * 定義應用程式中使用的驗證相關常數
 * 
 * @module SharedConstants
 */

/**
 * Email 驗證正則表達式
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * URL 驗證正則表達式
 */
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * Slug 驗證正則表達式 (小寫字母、數字、連字符)
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * 手機號碼驗證正則表達式 (台灣)
 */
export const PHONE_REGEX = /^09\d{8}$/;

/**
 * 密碼強度要求
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false,
} as const;

/**
 * 密碼強度正則表達式
 */
export const PASSWORD_STRENGTH_REGEX = {
  weak: /^.{0,7}$/,
  medium: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  veryStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/,
} as const;

/**
 * 工作區名稱長度限制
 */
export const WORKSPACE_NAME_LENGTH = {
  min: 1,
  max: 100,
} as const;

/**
 * 工作區 Slug 長度限制
 */
export const WORKSPACE_SLUG_LENGTH = {
  min: 3,
  max: 63,
} as const;

/**
 * 用戶名稱長度限制
 */
export const USERNAME_LENGTH = {
  min: 2,
  max: 50,
} as const;

/**
 * 描述長度限制
 */
export const DESCRIPTION_LENGTH = {
  min: 0,
  max: 500,
} as const;

/**
 * 標題長度限制
 */
export const TITLE_LENGTH = {
  min: 1,
  max: 200,
} as const;

/**
 * 標籤長度限制
 */
export const TAG_LENGTH = {
  min: 1,
  max: 30,
} as const;

/**
 * 錯誤訊息
 */
export const VALIDATION_MESSAGES = {
  required: '此欄位為必填',
  email: '請輸入有效的 Email 地址',
  url: '請輸入有效的 URL',
  phone: '請輸入有效的手機號碼',
  slug: 'Slug 只能包含小寫字母、數字和連字符',
  minLength: (min: number) => `最少需要 ${min} 個字元`,
  maxLength: (max: number) => `最多只能 ${max} 個字元`,
  min: (min: number) => `最小值為 ${min}`,
  max: (max: number) => `最大值為 ${max}`,
  pattern: '格式不正確',
  match: '兩次輸入不一致',
  unique: '此值已被使用',
  passwordWeak: '密碼強度過低',
  passwordRequirements: '密碼必須包含大小寫字母和數字',
  whitespace: '不能只包含空白字元',
} as const;
