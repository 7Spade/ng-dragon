/**
 * Quota Enforcer Service Interface
 *
 * 定義配額執行服務的契約
 * 負責檢查和執行工作區的使用配額限制
 */

import { Observable } from 'rxjs';
import { WorkspaceId } from '../workspace/value-objects/workspace-id.value-object';
import { WorkspaceQuota } from '../workspace/value-objects/workspace-quota.value-object';

/**
 * 配額檢查結果
 */
export interface QuotaCheckResult {
  /** 是否在配額限制內 */
  readonly isWithinQuota: boolean;
  /** 當前使用量 */
  readonly currentUsage: number;
  /** 配額限制 */
  readonly quotaLimit: number;
  /** 剩餘配額 */
  readonly remaining: number;
  /** 使用百分比 */
  readonly usagePercentage: number;
  /** 超出配額的原因 (當 isWithinQuota 為 false 時) */
  readonly exceededReason?: string;
}

/**
 * 配額類型
 */
export type QuotaType =
  | 'members' // 成員數量
  | 'storage' // 儲存空間
  | 'modules' // 模組數量
  | 'tasks' // 任務數量
  | 'api_calls' // API 呼叫次數
  | 'custom'; // 自定義配額

/**
 * 配額執行服務介面
 *
 * 提供配額檢查和執行功能
 * 確保工作區在配額限制內運作
 */
export interface IQuotaEnforcerService {
  /**
   * 檢查是否可以新增成員
   *
   * @param workspaceId - 工作區 ID
   * @param additionalCount - 要新增的成員數量 (預設為 1)
   * @returns Observable<QuotaCheckResult>
   */
  canAddMembers(
    workspaceId: WorkspaceId,
    additionalCount?: number
  ): Observable<QuotaCheckResult>;

  /**
   * 檢查是否可以使用更多儲存空間
   *
   * @param workspaceId - 工作區 ID
   * @param additionalBytes - 需要的額外空間 (bytes)
   * @returns Observable<QuotaCheckResult>
   */
  canUseStorage(
    workspaceId: WorkspaceId,
    additionalBytes: number
  ): Observable<QuotaCheckResult>;

  /**
   * 檢查是否可以建立更多模組
   *
   * @param workspaceId - 工作區 ID
   * @param additionalCount - 要建立的模組數量 (預設為 1)
   * @returns Observable<QuotaCheckResult>
   */
  canCreateModules(
    workspaceId: WorkspaceId,
    additionalCount?: number
  ): Observable<QuotaCheckResult>;

  /**
   * 檢查是否可以建立更多任務
   *
   * @param workspaceId - 工作區 ID
   * @param additionalCount - 要建立的任務數量 (預設為 1)
   * @returns Observable<QuotaCheckResult>
   */
  canCreateTasks(
    workspaceId: WorkspaceId,
    additionalCount?: number
  ): Observable<QuotaCheckResult>;

  /**
   * 檢查特定配額類型
   *
   * @param workspaceId - 工作區 ID
   * @param quotaType - 配額類型
   * @param additionalUsage - 額外使用量
   * @returns Observable<QuotaCheckResult>
   */
  checkQuota(
    workspaceId: WorkspaceId,
    quotaType: QuotaType,
    additionalUsage: number
  ): Observable<QuotaCheckResult>;

  /**
   * 取得工作區的配額資訊
   *
   * @param workspaceId - 工作區 ID
   * @returns Observable<WorkspaceQuota>
   */
  getWorkspaceQuota(workspaceId: WorkspaceId): Observable<WorkspaceQuota>;

  /**
   * 更新工作區配額 (僅限管理員)
   *
   * @param workspaceId - 工作區 ID
   * @param quota - 新的配額設定
   * @returns Observable<WorkspaceQuota>
   */
  updateWorkspaceQuota(
    workspaceId: WorkspaceId,
    quota: Partial<WorkspaceQuota>
  ): Observable<WorkspaceQuota>;

  /**
   * 檢查是否接近配額限制 (達到 80% 以上)
   *
   * @param workspaceId - 工作區 ID
   * @param quotaType - 配額類型
   * @returns Observable<boolean>
   */
  isApproachingQuota(
    workspaceId: WorkspaceId,
    quotaType: QuotaType
  ): Observable<boolean>;
}
