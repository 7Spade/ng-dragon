/**
 * String Utilities
 * 
 * 提供字串操作的工具函數
 * 
 * @module SharedUtils
 */

/**
 * 首字母大寫
 * 
 * @param str 字串
 * @returns 首字母大寫的字串
 * 
 * @example
 * capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 首字母小寫
 * 
 * @param str 字串
 * @returns 首字母小寫的字串
 * 
 * @example
 * uncapitalize('Hello') // 'hello'
 */
export function uncapitalize(str: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * 轉換為標題格式 (每個單字首字母大寫)
 * 
 * @param str 字串
 * @returns 標題格式的字串
 * 
 * @example
 * titleCase('hello world') // 'Hello World'
 */
export function titleCase(str: string): string {
  if (!str) {
    return str;
  }
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * 轉換為駝峰式命名 (camelCase)
 * 
 * @param str 字串
 * @returns 駝峰式命名的字串
 * 
 * @example
 * camelCase('hello world') // 'helloWorld'
 * camelCase('hello-world') // 'helloWorld'
 */
export function camelCase(str: string): string {
  if (!str) {
    return str;
  }
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toLowerCase());
}

/**
 * 轉換為帕斯卡命名 (PascalCase)
 * 
 * @param str 字串
 * @returns 帕斯卡命名的字串
 * 
 * @example
 * pascalCase('hello world') // 'HelloWorld'
 * pascalCase('hello-world') // 'HelloWorld'
 */
export function pascalCase(str: string): string {
  if (!str) {
    return str;
  }
  const camel = camelCase(str);
  return capitalize(camel);
}

/**
 * 轉換為短橫線命名 (kebab-case)
 * 
 * @param str 字串
 * @returns 短橫線命名的字串
 * 
 * @example
 * kebabCase('helloWorld') // 'hello-world'
 * kebabCase('HelloWorld') // 'hello-world'
 */
export function kebabCase(str: string): string {
  if (!str) {
    return str;
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * 轉換為蛇形命名 (snake_case)
 * 
 * @param str 字串
 * @returns 蛇形命名的字串
 * 
 * @example
 * snakeCase('helloWorld') // 'hello_world'
 * snakeCase('HelloWorld') // 'hello_world'
 */
export function snakeCase(str: string): string {
  if (!str) {
    return str;
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * 截斷字串
 * 
 * @param str 字串
 * @param maxLength 最大長度
 * @param suffix 後綴 (預設為 '...')
 * @returns 截斷後的字串
 * 
 * @example
 * truncate('Hello World', 5) // 'Hello...'
 * truncate('Hello World', 5, '…') // 'Hello…'
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 移除字串前後的空白字元
 * 
 * @param str 字串
 * @returns 移除空白後的字串
 */
export function trim(str: string): string {
  return str?.trim() || '';
}

/**
 * 移除字串中的所有空白字元
 * 
 * @param str 字串
 * @returns 移除空白後的字串
 */
export function removeWhitespace(str: string): string {
  return str?.replace(/\s+/g, '') || '';
}

/**
 * 將字串轉換為 slug (用於 URL)
 * 
 * @param str 字串
 * @returns slug 字串
 * 
 * @example
 * slugify('Hello World!') // 'hello-world'
 * slugify('Hello  World') // 'hello-world'
 */
export function slugify(str: string): string {
  if (!str) {
    return str;
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 清理 HTML 標籤
 * 
 * @param str 字串
 * @returns 清理後的字串
 */
export function stripHtml(str: string): string {
  if (!str) {
    return str;
  }
  return str.replace(/<[^>]*>/g, '');
}

/**
 * 跳脫 HTML 特殊字元
 * 
 * @param str 字串
 * @returns 跳脫後的字串
 */
export function escapeHtml(str: string): string {
  if (!str) {
    return str;
  }
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 反跳脫 HTML 特殊字元
 * 
 * @param str 字串
 * @returns 反跳脫後的字串
 */
export function unescapeHtml(str: string): string {
  if (!str) {
    return str;
  }
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || '';
}

/**
 * 計算字串中的字數
 * 
 * @param str 字串
 * @returns 字數
 */
export function wordCount(str: string): number {
  if (!str) {
    return 0;
  }
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * 反轉字串
 * 
 * @param str 字串
 * @returns 反轉後的字串
 */
export function reverse(str: string): string {
  if (!str) {
    return str;
  }
  return str.split('').reverse().join('');
}

/**
 * 檢查字串是否為空 (null, undefined, 或只有空白)
 * 
 * @param str 字串
 * @returns 是否為空
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * 檢查字串是否不為空
 * 
 * @param str 字串
 * @returns 是否不為空
 */
export function isNotEmpty(str: string | null | undefined): boolean {
  return !isEmpty(str);
}

/**
 * 填充字串至指定長度 (左側填充)
 * 
 * @param str 字串
 * @param length 目標長度
 * @param char 填充字元
 * @returns 填充後的字串
 */
export function padStart(str: string, length: number, char = ' '): string {
  return str.padStart(length, char);
}

/**
 * 填充字串至指定長度 (右側填充)
 * 
 * @param str 字串
 * @param length 目標長度
 * @param char 填充字元
 * @returns 填充後的字串
 */
export function padEnd(str: string, length: number, char = ' '): string {
  return str.padEnd(length, char);
}

/**
 * 重複字串
 * 
 * @param str 字串
 * @param count 重複次數
 * @returns 重複後的字串
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * 檢查字串是否包含指定的子字串
 * 
 * @param str 字串
 * @param search 要搜尋的子字串
 * @param caseSensitive 是否區分大小寫
 * @returns 是否包含
 */
export function contains(str: string, search: string, caseSensitive = true): boolean {
  if (!caseSensitive) {
    return str.toLowerCase().includes(search.toLowerCase());
  }
  return str.includes(search);
}

/**
 * 檢查字串是否以指定的子字串開頭
 * 
 * @param str 字串
 * @param search 要搜尋的子字串
 * @param caseSensitive 是否區分大小寫
 * @returns 是否以指定字串開頭
 */
export function startsWith(str: string, search: string, caseSensitive = true): boolean {
  if (!caseSensitive) {
    return str.toLowerCase().startsWith(search.toLowerCase());
  }
  return str.startsWith(search);
}

/**
 * 檢查字串是否以指定的子字串結尾
 * 
 * @param str 字串
 * @param search 要搜尋的子字串
 * @param caseSensitive 是否區分大小寫
 * @returns 是否以指定字串結尾
 */
export function endsWith(str: string, search: string, caseSensitive = true): boolean {
  if (!caseSensitive) {
    return str.toLowerCase().endsWith(search.toLowerCase());
  }
  return str.endsWith(search);
}

/**
 * 產生隨機字串
 * 
 * @param length 長度
 * @param charset 字元集 (預設為英數字)
 * @returns 隨機字串
 */
export function randomString(length: number, charset?: string): string {
  const chars = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 產生 UUID v4
 * 
 * @returns UUID 字串
 */
export function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
