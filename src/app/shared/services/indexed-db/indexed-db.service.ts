/**
 * IndexedDB Service
 *
 * 提供 IndexedDB 操作,支援大量資料儲存
 * 適用於離線應用、資料快取
 *
 * @example
 * ```typescript
 * // Initialize database
 * await this.indexedDBService.init('myDB', 1, (db) => {
 *   db.createObjectStore('users', { keyPath: 'id' });
 * });
 *
 * // Add data
 * await this.indexedDBService.add('users', { id: 1, name: 'John' });
 *
 * // Get data
 * const user = await this.indexedDBService.get('users', 1);
 *
 * // Query data
 * const users = await this.indexedDBService.getAll('users');
 * ```
 */

import { Injectable } from '@angular/core';

export interface IndexedDBConfig {
  name: string;
  version: number;
  upgrade: (db: IDBDatabase, oldVersion: number, newVersion: number | null) => void;
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private dbName: string = '';
  private dbVersion: number = 1;

  /**
   * 初始化資料庫
   *
   * @param name - 資料庫名稱
   * @param version - 版本號
   * @param upgrade - 升級回調
   * @returns Promise<IDBDatabase>
   */
  init(
    name: string,
    version: number,
    upgrade: (db: IDBDatabase, oldVersion: number, newVersion: number | null) => void
  ): Promise<IDBDatabase> {
    this.dbName = name;
    this.dbVersion = version;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${name}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        upgrade(db, event.oldVersion, event.newVersion);
      };
    });
  }

  /**
   * 新增資料
   *
   * @param storeName - Object Store 名稱
   * @param value - 資料
   * @returns Promise<IDBValidKey>
   */
  add<T>(storeName: string, value: T): Promise<IDBValidKey> {
    return this.performTransaction(storeName, 'readwrite', (store) => {
      return store.add(value);
    });
  }

  /**
   * 更新資料
   *
   * @param storeName - Object Store 名稱
   * @param value - 資料
   * @returns Promise<IDBValidKey>
   */
  put<T>(storeName: string, value: T): Promise<IDBValidKey> {
    return this.performTransaction(storeName, 'readwrite', (store) => {
      return store.put(value);
    });
  }

  /**
   * 取得資料
   *
   * @param storeName - Object Store 名稱
   * @param key - 鍵值
   * @returns Promise<T | undefined>
   */
  get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    return this.performTransaction(storeName, 'readonly', (store) => {
      return store.get(key);
    });
  }

  /**
   * 取得所有資料
   *
   * @param storeName - Object Store 名稱
   * @returns Promise<T[]>
   */
  getAll<T>(storeName: string): Promise<T[]> {
    return this.performTransaction(storeName, 'readonly', (store) => {
      return store.getAll();
    });
  }

  /**
   * 刪除資料
   *
   * @param storeName - Object Store 名稱
   * @param key - 鍵值
   * @returns Promise<void>
   */
  delete(storeName: string, key: IDBValidKey): Promise<void> {
    return this.performTransaction(storeName, 'readwrite', (store) => {
      return store.delete(key);
    });
  }

  /**
   * 清空 Object Store
   *
   * @param storeName - Object Store 名稱
   * @returns Promise<void>
   */
  clear(storeName: string): Promise<void> {
    return this.performTransaction(storeName, 'readwrite', (store) => {
      return store.clear();
    });
  }

  /**
   * 取得資料數量
   *
   * @param storeName - Object Store 名稱
   * @returns Promise<number>
   */
  count(storeName: string): Promise<number> {
    return this.performTransaction(storeName, 'readonly', (store) => {
      return store.count();
    });
  }

  /**
   * 執行事務
   *
   * @param storeName - Object Store 名稱
   * @param mode - 模式
   * @param callback - 回調
   * @returns Promise<T>
   */
  private performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = callback(store);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 關閉資料庫
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * 刪除資料庫
   *
   * @param name - 資料庫名稱
   * @returns Promise<void>
   */
  deleteDatabase(name?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const dbName = name || this.dbName;
      
      if (!dbName) {
        reject(new Error('Database name not provided'));
        return;
      }

      this.close();

      const request = indexedDB.deleteDatabase(dbName);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete database: ${dbName}`));
      };
    });
  }
}
