import { WorkspaceId } from '../value-objects/workspace-id.value-object';
import { WorkspaceIdentity } from '../value-objects/workspace-identity.value-object';
import { WorkspaceQuota } from '../value-objects/workspace-quota.value-object';
import { WorkspaceType } from '../enums/workspace-type.enum';
import { WorkspaceLifecycle } from '../enums/workspace-lifecycle.enum';
import { Identifiable, Auditable } from '../../shared/interfaces';
import { Timestamp } from '../../shared/value-objects';

/**
 * Workspace 聚合根
 * 
 * 設計原則:
 * - 一致性邊界: 確保工作區的一致性邊界
 * - 業務規則封裝: 所有工作區相關的業務規則都在這裡
 * - 不可變性: 狀態變更透過方法,而非直接修改
 * - 領域事件: 重要的狀態變更會產生領域事件
 * 
 * 聚合根責任:
 * 1. 維護工作區的業務不變量
 * 2. 管理工作區生命週期(創建、更新、歸檔、刪除)
 * 3. 控制成員的加入和離開
 * 4. 管理配額和權限
 */
export class WorkspaceAggregate implements Identifiable, Auditable {
  // 識別與身份
  private readonly _id: WorkspaceId;
  private _identity: WorkspaceIdentity;
  
  // 基本屬性
  private _type: WorkspaceType;
  private _lifecycle: WorkspaceLifecycle;
  
  // 配額與資源
  private _quota: WorkspaceQuota;
  
  // 所有權
  private _ownerId: string;
  private _accountId?: string;
  private _contextId?: string;
  
  // 成員數量
  private _memberCount: number;
  
  // 審計資訊
  private readonly _createdAt: Timestamp;
  private _updatedAt: Timestamp;
  private _lastAccessedAt?: Timestamp;
  private _archivedAt?: Timestamp;
  
  // 領域事件集合 (待實作事件系統後使用)
  private _domainEvents: unknown[] = [];

  constructor(props: {
    id: WorkspaceId;
    identity: WorkspaceIdentity;
    type: WorkspaceType;
    lifecycle: WorkspaceLifecycle;
    quota: WorkspaceQuota;
    ownerId: string;
    accountId?: string;
    contextId?: string;
    memberCount?: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastAccessedAt?: Timestamp;
    archivedAt?: Timestamp;
  }) {
    this._id = props.id;
    this._identity = props.identity;
    this._type = props.type;
    this._lifecycle = props.lifecycle;
    this._quota = props.quota;
    this._ownerId = props.ownerId;
    this._accountId = props.accountId;
    this._contextId = props.contextId;
    this._memberCount = props.memberCount ?? 1; // 至少包含 owner
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._lastAccessedAt = props.lastAccessedAt;
    this._archivedAt = props.archivedAt;
    
    this.validate();
  }

  // ==================== Getters ====================
  
  get id(): WorkspaceId {
    return this._id;
  }

  get identity(): WorkspaceIdentity {
    return this._identity;
  }

  get type(): WorkspaceType {
    return this._type;
  }

  get lifecycle(): WorkspaceLifecycle {
    return this._lifecycle;
  }

  get quota(): WorkspaceQuota {
    return this._quota;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get accountId(): string | undefined {
    return this._accountId;
  }

  get contextId(): string | undefined {
    return this._contextId;
  }

  get memberCount(): number {
    return this._memberCount;
  }

  get createdAt(): Timestamp {
    return this._createdAt;
  }

  get updatedAt(): Timestamp {
    return this._updatedAt;
  }

  get lastAccessedAt(): Timestamp | undefined {
    return this._lastAccessedAt;
  }

  get archivedAt(): Timestamp | undefined {
    return this._archivedAt;
  }

  get domainEvents(): readonly unknown[] {
    return [...this._domainEvents];
  }

  // ==================== 業務方法 ====================

  /**
   * 更新工作區身份資訊
   */
  updateIdentity(identity: WorkspaceIdentity): void {
    if (this._lifecycle === WorkspaceLifecycle.Deleted) {
      throw new Error('Cannot update deleted workspace');
    }
    
    this._identity = identity;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 WorkspaceUpdatedEvent
  }

  /**
   * 更新工作區類型
   */
  updateType(type: WorkspaceType): void {
    if (this._lifecycle === WorkspaceLifecycle.Deleted) {
      throw new Error('Cannot update deleted workspace');
    }
    
    this._type = type;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 WorkspaceUpdatedEvent
  }

  /**
   * 歸檔工作區
   */
  archive(): void {
    if (this._lifecycle === WorkspaceLifecycle.Deleted) {
      throw new Error('Cannot archive deleted workspace');
    }
    
    if (this._lifecycle === WorkspaceLifecycle.Archived) {
      return; // 已經歸檔,不需要重複操作
    }
    
    this._lifecycle = WorkspaceLifecycle.Archived;
    this._archivedAt = Timestamp.now();
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 WorkspaceArchivedEvent
  }

  /**
   * 恢復已歸檔的工作區
   */
  unarchive(): void {
    if (this._lifecycle !== WorkspaceLifecycle.Archived) {
      throw new Error('Can only unarchive archived workspaces');
    }
    
    this._lifecycle = WorkspaceLifecycle.Active;
    this._archivedAt = undefined;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 WorkspaceUpdatedEvent
  }

  /**
   * 刪除工作區 (軟刪除)
   */
  delete(): void {
    if (this._lifecycle === WorkspaceLifecycle.Deleted) {
      return; // 已經刪除,不需要重複操作
    }
    
    this._lifecycle = WorkspaceLifecycle.Deleted;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 WorkspaceDeletedEvent
  }

  /**
   * 記錄最後訪問時間
   */
  recordAccess(): void {
    this._lastAccessedAt = Timestamp.now();
    
    // 注意: 這個操作不更新 updatedAt,因為只是訪問記錄
  }

  /**
   * 增加成員
   */
  addMember(): void {
    if (this._lifecycle === WorkspaceLifecycle.Deleted) {
      throw new Error('Cannot add member to deleted workspace');
    }
    
    // 檢查配額
    if (!this._quota.canAddMember(this._memberCount)) {
      throw new Error('Workspace member quota exceeded');
    }
    
    this._memberCount++;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 MemberJoinedEvent
  }

  /**
   * 移除成員
   */
  removeMember(): void {
    if (this._memberCount <= 1) {
      throw new Error('Cannot remove last member from workspace');
    }
    
    this._memberCount--;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 MemberLeftEvent
  }

  /**
   * 轉移所有權
   */
  transferOwnership(newOwnerId: string): void {
    if (this._lifecycle === WorkspaceLifecycle.Deleted) {
      throw new Error('Cannot transfer ownership of deleted workspace');
    }
    
    if (!newOwnerId || newOwnerId.trim() === '') {
      throw new Error('New owner ID is required');
    }
    
    if (this._ownerId === newOwnerId) {
      return; // 已經是 owner,不需要轉移
    }
    
    this._ownerId = newOwnerId;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 OwnershipTransferredEvent
  }

  /**
   * 更新配額
   */
  updateQuota(quota: WorkspaceQuota): void {
    if (this._lifecycle === WorkspaceLifecycle.Deleted) {
      throw new Error('Cannot update quota of deleted workspace');
    }
    
    // 檢查當前成員數是否超過新配額
    if (!quota.canAddMember(this._memberCount - 1)) {
      throw new Error('New quota is lower than current member count');
    }
    
    this._quota = quota;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 WorkspaceUpdatedEvent
  }

  // ==================== 業務規則驗證 ====================

  /**
   * 驗證聚合的業務不變量
   */
  private validate(): void {
    if (!this._id) {
      throw new Error('Workspace ID is required');
    }
    
    if (!this._identity) {
      throw new Error('Workspace identity is required');
    }
    
    if (!this._ownerId || this._ownerId.trim() === '') {
      throw new Error('Workspace owner ID is required');
    }
    
    if (this._memberCount < 1) {
      throw new Error('Workspace must have at least one member');
    }
    
    if (this._lifecycle === WorkspaceLifecycle.Archived && !this._archivedAt) {
      throw new Error('Archived workspace must have archivedAt timestamp');
    }
  }

  /**
   * 檢查工作區是否處於活躍狀態
   */
  isActive(): boolean {
    return this._lifecycle === WorkspaceLifecycle.Active;
  }

  /**
   * 檢查工作區是否已歸檔
   */
  isArchived(): boolean {
    return this._lifecycle === WorkspaceLifecycle.Archived;
  }

  /**
   * 檢查工作區是否已刪除
   */
  isDeleted(): boolean {
    return this._lifecycle === WorkspaceLifecycle.Deleted;
  }

  /**
   * 檢查是否可以添加新成員
   */
  canAddMember(): boolean {
    return (
      this._lifecycle === WorkspaceLifecycle.Active &&
      this._quota.canAddMember(this._memberCount)
    );
  }

  // ==================== 工廠方法 ====================

  /**
   * 創建新的工作區聚合
   */
  static create(props: {
    id: WorkspaceId;
    identity: WorkspaceIdentity;
    type: WorkspaceType;
    quota: WorkspaceQuota;
    ownerId: string;
    accountId?: string;
    contextId?: string;
  }): WorkspaceAggregate {
    const now = Timestamp.now();
    
    const workspace = new WorkspaceAggregate({
      id: props.id,
      identity: props.identity,
      type: props.type,
      lifecycle: WorkspaceLifecycle.Active,
      quota: props.quota,
      ownerId: props.ownerId,
      accountId: props.accountId,
      contextId: props.contextId,
      memberCount: 1,
      createdAt: now,
      updatedAt: now,
    });
    
    // TODO: 產生 WorkspaceCreatedEvent
    
    return workspace;
  }

  /**
   * 從持久化數據重建聚合
   */
  static reconstitute(props: {
    id: WorkspaceId;
    identity: WorkspaceIdentity;
    type: WorkspaceType;
    lifecycle: WorkspaceLifecycle;
    quota: WorkspaceQuota;
    ownerId: string;
    accountId?: string;
    contextId?: string;
    memberCount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastAccessedAt?: Timestamp;
    archivedAt?: Timestamp;
  }): WorkspaceAggregate {
    return new WorkspaceAggregate(props);
  }

  // ==================== 事件管理 ====================

  /**
   * 清除領域事件
   */
  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * 添加領域事件
   */
  private addDomainEvent(event: unknown): void {
    this._domainEvents.push(event);
  }
}
