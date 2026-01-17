import { MembershipId } from '../value-objects/membership-id.value-object';
import { Permissions } from '../value-objects/permissions.value-object';
import { MembershipRole } from '../enums/membership-role.enum';
import { MembershipStatus } from '../enums/membership-status.enum';
import { Identifiable, Auditable } from '../../shared/interfaces';
import { Timestamp } from '../../shared/value-objects';

/**
 * WorkspaceMembership 實體
 * 
 * 表示帳戶(Account)與工作區(Workspace)之間的成員關係
 * 
 * 設計原則:
 * - 關聯實體: 連接 Account 與 Workspace
 * - 權限管理: 封裝成員的角色與權限
 * - 生命週期: 管理成員關係的狀態變化
 * - 審計追蹤: 記錄關係建立、變更和結束的時間
 * 
 * 實體責任:
 * 1. 維護成員關係的基本資訊
 * 2. 管理成員的角色與權限
 * 3. 追蹤成員關係的狀態
 * 4. 記錄審計資訊
 */
export class WorkspaceMembershipEntity implements Identifiable, Auditable {
  // 識別
  private readonly _id: MembershipId;
  
  // 關聯
  private readonly _workspaceId: string;
  private readonly _accountId: string;
  
  // 角色與權限
  private _role: MembershipRole;
  private _permissions: Permissions;
  
  // 狀態
  private _status: MembershipStatus;
  
  // 邀請資訊
  private readonly _invitedBy?: string;
  private readonly _invitedAt?: Timestamp;
  
  // 審計資訊
  private readonly _createdAt: Timestamp;
  private _updatedAt: Timestamp;
  private _lastAccessedAt?: Timestamp;
  private _suspendedAt?: Timestamp;
  private _removedAt?: Timestamp;

  constructor(props: {
    id: MembershipId;
    workspaceId: string;
    accountId: string;
    role: MembershipRole;
    permissions: Permissions;
    status: MembershipStatus;
    invitedBy?: string;
    invitedAt?: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastAccessedAt?: Timestamp;
    suspendedAt?: Timestamp;
    removedAt?: Timestamp;
  }) {
    this._id = props.id;
    this._workspaceId = props.workspaceId;
    this._accountId = props.accountId;
    this._role = props.role;
    this._permissions = props.permissions;
    this._status = props.status;
    this._invitedBy = props.invitedBy;
    this._invitedAt = props.invitedAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._lastAccessedAt = props.lastAccessedAt;
    this._suspendedAt = props.suspendedAt;
    this._removedAt = props.removedAt;
    
    this.validate();
  }

  // ==================== Getters ====================
  
  get id(): MembershipId {
    return this._id;
  }

  get workspaceId(): string {
    return this._workspaceId;
  }

  get accountId(): string {
    return this._accountId;
  }

  get role(): MembershipRole {
    return this._role;
  }

  get permissions(): Permissions {
    return this._permissions;
  }

  get status(): MembershipStatus {
    return this._status;
  }

  get invitedBy(): string | undefined {
    return this._invitedBy;
  }

  get invitedAt(): Timestamp | undefined {
    return this._invitedAt;
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

  get suspendedAt(): Timestamp | undefined {
    return this._suspendedAt;
  }

  get removedAt(): Timestamp | undefined {
    return this._removedAt;
  }

  // ==================== 業務方法 ====================

  /**
   * 更新成員角色
   */
  updateRole(newRole: MembershipRole): void {
    if (this._status !== MembershipStatus.Active) {
      throw new Error('Cannot update role of inactive membership');
    }
    
    if (this._role === newRole) {
      return; // 角色未變更,不需要操作
    }
    
    this._role = newRole;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 MembershipRoleUpdatedEvent
  }

  /**
   * 更新成員權限
   */
  updatePermissions(newPermissions: Permissions): void {
    if (this._status !== MembershipStatus.Active) {
      throw new Error('Cannot update permissions of inactive membership');
    }
    
    this._permissions = newPermissions;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 MembershipPermissionsUpdatedEvent
  }

  /**
   * 啟用成員關係
   */
  activate(): void {
    if (this._status === MembershipStatus.Active) {
      return; // 已經啟用,不需要重複操作
    }
    
    if (this._status === MembershipStatus.Removed) {
      throw new Error('Cannot activate removed membership');
    }
    
    this._status = MembershipStatus.Active;
    this._suspendedAt = undefined;
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 MembershipActivatedEvent
  }

  /**
   * 暫停成員關係
   */
  suspend(): void {
    if (this._status === MembershipStatus.Removed) {
      throw new Error('Cannot suspend removed membership');
    }
    
    if (this._status === MembershipStatus.Suspended) {
      return; // 已經暫停,不需要重複操作
    }
    
    this._status = MembershipStatus.Suspended;
    this._suspendedAt = Timestamp.now();
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 MembershipSuspendedEvent
  }

  /**
   * 移除成員關係
   */
  remove(): void {
    if (this._status === MembershipStatus.Removed) {
      return; // 已經移除,不需要重複操作
    }
    
    this._status = MembershipStatus.Removed;
    this._removedAt = Timestamp.now();
    this._updatedAt = Timestamp.now();
    
    // TODO: 產生 MembershipRemovedEvent
  }

  /**
   * 記錄最後訪問時間
   */
  recordAccess(): void {
    if (this._status !== MembershipStatus.Active) {
      return; // 非活躍成員不記錄訪問時間
    }
    
    this._lastAccessedAt = Timestamp.now();
    
    // 注意: 這個操作不更新 updatedAt,因為只是訪問記錄
  }

  // ==================== 業務規則檢查 ====================

  /**
   * 驗證實體的業務不變量
   */
  private validate(): void {
    if (!this._id) {
      throw new Error('Membership ID is required');
    }
    
    if (!this._workspaceId || this._workspaceId.trim() === '') {
      throw new Error('Workspace ID is required');
    }
    
    if (!this._accountId || this._accountId.trim() === '') {
      throw new Error('Account ID is required');
    }
    
    if (!this._role) {
      throw new Error('Membership role is required');
    }
    
    if (!this._permissions) {
      throw new Error('Membership permissions are required');
    }
    
    if (this._status === MembershipStatus.Suspended && !this._suspendedAt) {
      throw new Error('Suspended membership must have suspendedAt timestamp');
    }
    
    if (this._status === MembershipStatus.Removed && !this._removedAt) {
      throw new Error('Removed membership must have removedAt timestamp');
    }
  }

  /**
   * 檢查成員關係是否處於活躍狀態
   */
  isActive(): boolean {
    return this._status === MembershipStatus.Active;
  }

  /**
   * 檢查成員關係是否已暫停
   */
  isSuspended(): boolean {
    return this._status === MembershipStatus.Suspended;
  }

  /**
   * 檢查成員關係是否已移除
   */
  isRemoved(): boolean {
    return this._status === MembershipStatus.Removed;
  }

  /**
   * 檢查是否為 Owner 角色
   */
  isOwner(): boolean {
    return this._role === MembershipRole.Owner;
  }

  /**
   * 檢查是否為 Admin 角色
   */
  isAdmin(): boolean {
    return this._role === MembershipRole.Admin;
  }

  /**
   * 檢查是否有特定權限
   */
  hasPermission(permission: string): boolean {
    return this._permissions.has(permission);
  }

  /**
   * 檢查是否有所有指定權限
   */
  hasAllPermissions(permissions: string[]): boolean {
    return this._permissions.hasAll(permissions);
  }

  /**
   * 檢查是否有任一指定權限
   */
  hasAnyPermission(permissions: string[]): boolean {
    return this._permissions.hasAny(permissions);
  }

  // ==================== 工廠方法 ====================

  /**
   * 創建新的成員關係實體
   */
  static create(props: {
    id: MembershipId;
    workspaceId: string;
    accountId: string;
    role: MembershipRole;
    permissions: Permissions;
    invitedBy?: string;
  }): WorkspaceMembershipEntity {
    const now = Timestamp.now();
    
    const membership = new WorkspaceMembershipEntity({
      id: props.id,
      workspaceId: props.workspaceId,
      accountId: props.accountId,
      role: props.role,
      permissions: props.permissions,
      status: MembershipStatus.Active,
      invitedBy: props.invitedBy,
      invitedAt: props.invitedBy ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
    
    // TODO: 產生 MembershipCreatedEvent
    
    return membership;
  }

  /**
   * 從持久化數據重建實體
   */
  static reconstitute(props: {
    id: MembershipId;
    workspaceId: string;
    accountId: string;
    role: MembershipRole;
    permissions: Permissions;
    status: MembershipStatus;
    invitedBy?: string;
    invitedAt?: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastAccessedAt?: Timestamp;
    suspendedAt?: Timestamp;
    removedAt?: Timestamp;
  }): WorkspaceMembershipEntity {
    return new WorkspaceMembershipEntity(props);
  }
}
