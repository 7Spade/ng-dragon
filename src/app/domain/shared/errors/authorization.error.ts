import { DomainError } from './domain.error';

/**
 * Authorization Error
 * 
 * 授權錯誤,當用戶沒有權限執行操作時拋出
 */
export class AuthorizationError extends DomainError {
  /**
   * 請求的操作
   */
  public readonly action: string;

  /**
   * 請求的資源
   */
  public readonly resource: string;

  /**
   * 用戶 ID
   */
  public readonly userId: string;

  constructor(
    action: string,
    resource: string,
    userId: string,
    message?: string,
    context?: Record<string, unknown>
  ) {
    const defaultMessage = `User "${userId}" is not authorized to ${action} ${resource}`;
    super(
      message || defaultMessage,
      'AUTHORIZATION_ERROR',
      { action, resource, userId, ...context }
    );
    this.action = action;
    this.resource = resource;
    this.userId = userId;
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      return `您沒有權限執行此操作: ${this.action} ${this.resource}`;
    }
    return `You are not authorized to ${this.action} ${this.resource}`;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      action: this.action,
      resource: this.resource,
      userId: this.userId,
    };
  }
}

/**
 * 未認證錯誤
 */
export class UnauthenticatedError extends DomainError {
  constructor(message = 'User is not authenticated', context?: Record<string, unknown>) {
    super(message, 'UNAUTHENTICATED', context);
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      return '您尚未登入,請先登入後再執行此操作';
    }
    return 'You are not authenticated. Please login first.';
  }
}

/**
 * 權限不足錯誤
 */
export class InsufficientPermissionError extends AuthorizationError {
  /**
   * 需要的權限
   */
  public readonly requiredPermission: string;

  /**
   * 用戶當前的權限
   */
  public readonly currentPermissions: string[];

  constructor(
    action: string,
    resource: string,
    userId: string,
    requiredPermission: string,
    currentPermissions: string[],
    context?: Record<string, unknown>
  ) {
    super(
      action,
      resource,
      userId,
      `User "${userId}" lacks required permission "${requiredPermission}" to ${action} ${resource}`,
      { requiredPermission, currentPermissions, ...context }
    );
    this.requiredPermission = requiredPermission;
    this.currentPermissions = currentPermissions;
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      return `您缺少執行此操作所需的權限: ${this.requiredPermission}`;
    }
    return `You lack the required permission: ${this.requiredPermission}`;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      requiredPermission: this.requiredPermission,
      currentPermissions: this.currentPermissions,
    };
  }
}

/**
 * 角色不足錯誤
 */
export class InsufficientRoleError extends AuthorizationError {
  /**
   * 需要的角色
   */
  public readonly requiredRole: string;

  /**
   * 用戶當前的角色
   */
  public readonly currentRole: string;

  constructor(
    action: string,
    resource: string,
    userId: string,
    requiredRole: string,
    currentRole: string,
    context?: Record<string, unknown>
  ) {
    super(
      action,
      resource,
      userId,
      `User "${userId}" requires role "${requiredRole}" to ${action} ${resource}, but has role "${currentRole}"`,
      { requiredRole, currentRole, ...context }
    );
    this.requiredRole = requiredRole;
    this.currentRole = currentRole;
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      return `您需要 "${this.requiredRole}" 角色才能執行此操作`;
    }
    return `You need the "${this.requiredRole}" role to perform this action`;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      requiredRole: this.requiredRole,
      currentRole: this.currentRole,
    };
  }
}

/**
 * 資源擁有者錯誤 (只有資源擁有者才能執行操作)
 */
export class NotResourceOwnerError extends AuthorizationError {
  /**
   * 資源擁有者 ID
   */
  public readonly ownerId: string;

  constructor(
    action: string,
    resource: string,
    userId: string,
    ownerId: string,
    context?: Record<string, unknown>
  ) {
    super(
      action,
      resource,
      userId,
      `User "${userId}" is not the owner of ${resource}. Only the owner can ${action}`,
      { ownerId, ...context }
    );
    this.ownerId = ownerId;
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      return '只有資源擁有者才能執行此操作';
    }
    return 'Only the resource owner can perform this action';
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      ownerId: this.ownerId,
    };
  }
}

/**
 * 配額超限錯誤
 */
export class QuotaExceededError extends DomainError {
  /**
   * 配額類型
   */
  public readonly quotaType: string;

  /**
   * 當前使用量
   */
  public readonly currentUsage: number;

  /**
   * 配額限制
   */
  public readonly limit: number;

  constructor(
    quotaType: string,
    currentUsage: number,
    limit: number,
    context?: Record<string, unknown>
  ) {
    super(
      `Quota exceeded for "${quotaType}". Current usage: ${currentUsage}, Limit: ${limit}`,
      'QUOTA_EXCEEDED',
      { quotaType, currentUsage, limit, ...context }
    );
    this.quotaType = quotaType;
    this.currentUsage = currentUsage;
    this.limit = limit;
  }

  toUserMessage(locale = 'zh-TW'): string {
    if (locale === 'zh-TW') {
      return `已達到 ${this.quotaType} 的配額限制 (${this.limit})`;
    }
    return `Quota limit for ${this.quotaType} has been reached (${this.limit})`;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      quotaType: this.quotaType,
      currentUsage: this.currentUsage,
      limit: this.limit,
    };
  }
}
