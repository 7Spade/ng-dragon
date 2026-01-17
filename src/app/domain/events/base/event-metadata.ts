import { Timestamp } from '../../shared/value-objects';

/**
 * 事件元數據
 * 
 * 記錄事件的追蹤資訊,用於審計和調試
 */
export interface EventMetadata {
  /**
   * 事件 ID (唯一識別)
   */
  readonly eventId: string;
  
  /**
   * 事件發生時間
   */
  readonly occurredAt: Timestamp;
  
  /**
   * 事件版本 (用於事件演化)
   */
  readonly version: number;
  
  /**
   * 工作區 ID (WorkspaceScoped 事件必填)
   */
  readonly workspaceId?: string;
  
  /**
   * 觸發事件的帳戶 ID
   */
  readonly actorId?: string;
  
  /**
   * 關聯 ID (用於追蹤相關事件)
   */
  readonly correlationId?: string;
  
  /**
   * 因果 ID (用於追蹤事件鏈)
   */
  readonly causationId?: string;
  
  /**
   * 額外的追蹤資訊
   */
  readonly metadata?: Record<string, unknown>;
}

/**
 * 創建事件元數據
 */
export function createEventMetadata(props: {
  eventId: string;
  version?: number;
  workspaceId?: string;
  actorId?: string;
  correlationId?: string;
  causationId?: string;
  metadata?: Record<string, unknown>;
}): EventMetadata {
  return {
    eventId: props.eventId,
    occurredAt: Timestamp.now(),
    version: props.version ?? 1,
    workspaceId: props.workspaceId,
    actorId: props.actorId,
    correlationId: props.correlationId,
    causationId: props.causationId,
    metadata: props.metadata,
  };
}
