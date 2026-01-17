/**
 * Base Interfaces
 * 
 * 定義應用程式中使用的基礎介面
 * 
 * @module SharedInterfaces
 */

import { ID } from '../types';

/**
 * Identifiable 介面
 * 
 * 所有具有唯一識別碼的實體都應實作此介面
 */
export interface Identifiable<T = ID> {
  /**
   * 唯一識別碼
   */
  id: T;
}

/**
 * Auditable 介面
 * 
 * 需要記錄建立和更新時間的實體應實作此介面
 */
export interface Auditable {
  /**
   * 建立時間
   */
  createdAt: Date;

  /**
   * 最後更新時間
   */
  updatedAt: Date;
}

/**
 * SoftDeletable 介面
 * 
 * 支援軟刪除的實體應實作此介面
 */
export interface SoftDeletable {
  /**
   * 刪除時間 (null 表示未刪除)
   */
  deletedAt: Date | null;

  /**
   * 是否已刪除
   */
  isDeleted: boolean;
}

/**
 * Versionable 介面
 * 
 * 需要版本控制的實體應實作此介面
 */
export interface Versionable {
  /**
   * 版本號
   */
  version: number;
}

/**
 * Ownable 介面
 * 
 * 需要記錄擁有者的實體應實作此介面
 */
export interface Ownable<T = ID> {
  /**
   * 擁有者 ID
   */
  ownerId: T;
}

/**
 * Activatable 介面
 * 
 * 需要啟用/停用狀態的實體應實作此介面
 */
export interface Activatable {
  /**
   * 是否啟用
   */
  isActive: boolean;
}

/**
 * Nameable 介面
 * 
 * 具有名稱的實體應實作此介面
 */
export interface Nameable {
  /**
   * 名稱
   */
  name: string;
}

/**
 * Describable 介面
 * 
 * 具有描述的實體應實作此介面
 */
export interface Describable {
  /**
   * 描述
   */
  description: string | null;
}

/**
 * Sortable 介面
 * 
 * 需要排序的實體應實作此介面
 */
export interface Sortable {
  /**
   * 排序順序
   */
  order: number;
}

/**
 * Taggable 介面
 * 
 * 支援標籤的實體應實作此介面
 */
export interface Taggable {
  /**
   * 標籤列表
   */
  tags: string[];
}

/**
 * Publishable 介面
 * 
 * 需要發布狀態的實體應實作此介面
 */
export interface Publishable {
  /**
   * 發布時間 (null 表示未發布)
   */
  publishedAt: Date | null;

  /**
   * 是否已發布
   */
  isPublished: boolean;
}

/**
 * Entity 介面
 * 
 * 標準實體介面，組合常用的基礎介面
 */
export interface Entity<T = ID> extends Identifiable<T>, Auditable, Versionable {
  // 繼承 Identifiable, Auditable, Versionable
}

/**
 * SoftDeletableEntity 介面
 * 
 * 支援軟刪除的標準實體介面
 */
export interface SoftDeletableEntity<T = ID> extends Entity<T>, SoftDeletable {
  // 繼承 Entity, SoftDeletable
}
