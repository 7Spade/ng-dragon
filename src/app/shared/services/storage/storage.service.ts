/**
 * Storage Service
 *
 * 提供 LocalStorage, SessionStorage, IndexedDB 統一 API
 * 支援型別安全、錯誤處理、序列化
 *
 * @example
 * ```typescript
 * // LocalStorage
 * this.storageService.local.set('user', { id: 1, name: 'John' });
 * const user = this.storageService.local.get<User>('user');
 * this.storageService.local.remove('user');
 * this.storageService.local.clear();
 *
 * // SessionStorage
 * this.storageService.session.set('token', 'abc123');
 * const token = this.storageService.session.get<string>('token');
 * ```
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * LocalStorage 操作
   */
  readonly local = {
    /**
     * 設定值
     */
    set: <T>(key: string, value: T): boolean => {
      try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
      } catch (error) {
        console.error(`Failed to set localStorage key "${key}":`, error);
        return false;
      }
    },

    /**
     * 取得值
     */
    get: <T>(key: string): T | null => {
      try {
        const item = localStorage.getItem(key);
        if (item === null) {
          return null;
        }
        return JSON.parse(item) as T;
      } catch (error) {
        console.error(`Failed to get localStorage key "${key}":`, error);
        return null;
      }
    },

    /**
     * 移除值
     */
    remove: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove localStorage key "${key}":`, error);
      }
    },

    /**
     * 清空所有
     */
    clear: (): void => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    },

    /**
     * 檢查是否存在
     */
    has: (key: string): boolean => {
      return localStorage.getItem(key) !== null;
    },

    /**
     * 取得所有 keys
     */
    keys: (): string[] => {
      return Object.keys(localStorage);
    },

    /**
     * 取得大小 (bytes)
     */
    size: (): number => {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    },
  };

  /**
   * SessionStorage 操作
   */
  readonly session = {
    /**
     * 設定值
     */
    set: <T>(key: string, value: T): boolean => {
      try {
        const serialized = JSON.stringify(value);
        sessionStorage.setItem(key, serialized);
        return true;
      } catch (error) {
        console.error(`Failed to set sessionStorage key "${key}":`, error);
        return false;
      }
    },

    /**
     * 取得值
     */
    get: <T>(key: string): T | null => {
      try {
        const item = sessionStorage.getItem(key);
        if (item === null) {
          return null;
        }
        return JSON.parse(item) as T;
      } catch (error) {
        console.error(`Failed to get sessionStorage key "${key}":`, error);
        return null;
      }
    },

    /**
     * 移除值
     */
    remove: (key: string): void => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove sessionStorage key "${key}":`, error);
      }
    },

    /**
     * 清空所有
     */
    clear: (): void => {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Failed to clear sessionStorage:', error);
      }
    },

    /**
     * 檢查是否存在
     */
    has: (key: string): boolean => {
      return sessionStorage.getItem(key) !== null;
    },

    /**
     * 取得所有 keys
     */
    keys: (): string[] => {
      return Object.keys(sessionStorage);
    },
  };

  /**
   * 檢查 Storage API 是否可用
   */
  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}
