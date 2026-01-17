/**
 * Account Repository Interface
 *
 * 定義帳戶儲存庫的契約
 * Infrastructure 層需要實作這個介面
 */

import { Observable } from 'rxjs';

/**
 * 帳戶基本資訊
 *
 * 簡化的帳戶模型，只包含必要資訊
 * 完整的帳戶領域模型應在 Account Domain 中定義
 */
export interface AccountBasicInfo {
  /** 帳戶 ID (Firebase UID) */
  readonly id: string;
  /** Email */
  readonly email: string;
  /** 顯示名稱 */
  readonly displayName: string;
  /** 頭像 URL */
  readonly photoURL?: string;
  /** 帳戶建立時間 */
  readonly createdAt: Date;
  /** 最後登入時間 */
  readonly lastLoginAt?: Date;
}

/**
 * 帳戶儲存庫介面
 *
 * 提供帳戶相關的查詢功能
 * 注意: 帳戶的建立與更新應透過 Firebase Authentication 處理
 */
export interface IAccountRepository {
  /**
   * 根據 ID 取得帳戶基本資訊
   *
   * @param id - 帳戶 ID (Firebase UID)
   * @returns Observable<AccountBasicInfo | null>
   */
  findById(id: string): Observable<AccountBasicInfo | null>;

  /**
   * 根據 Email 取得帳戶基本資訊
   *
   * @param email - Email 地址
   * @returns Observable<AccountBasicInfo | null>
   */
  findByEmail(email: string): Observable<AccountBasicInfo | null>;

  /**
   * 批次取得多個帳戶的基本資訊
   *
   * @param ids - 帳戶 ID 列表
   * @returns Observable<AccountBasicInfo[]>
   */
  findByIds(ids: string[]): Observable<AccountBasicInfo[]>;

  /**
   * 檢查 Email 是否已被註冊
   *
   * @param email - Email 地址
   * @returns Observable<boolean>
   */
  isEmailRegistered(email: string): Observable<boolean>;

  /**
   * 更新帳戶最後登入時間
   *
   * @param id - 帳戶 ID
   * @returns Observable<void>
   */
  updateLastLoginAt(id: string): Observable<void>;
}
