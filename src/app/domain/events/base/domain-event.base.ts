import { EventMetadata } from './event-metadata';

/**
 * 領域事件基類
 * 
 * 所有領域事件都應繼承此基類
 * 
 * 設計原則:
 * - 不可變性: 事件一旦產生就不可變
 * - 過去式命名: 事件名稱使用過去式,表示已發生的事實
 * - 完整資訊: 包含完整的事件資訊,無需查詢其他來源
 * - 元數據: 包含追蹤和審計所需的元數據
 * 
 * @template TPayload - 事件負載的類型
 */
export abstract class DomainEventBase<TPayload = unknown> {
  /**
   * 事件類型 (唯一識別事件種類)
   */
  abstract readonly eventType: string;
  
  /**
   * 事件元數據
   */
  readonly metadata: EventMetadata;
  
  /**
   * 事件負載 (業務數據)
   */
  readonly payload: TPayload;

  constructor(metadata: EventMetadata, payload: TPayload) {
    this.metadata = metadata;
    this.payload = payload;
    
    // 確保事件不可變
    Object.freeze(this.metadata);
    Object.freeze(this.payload);
    Object.freeze(this);
  }

  /**
   * 獲取事件 ID
   */
  get eventId(): string {
    return this.metadata.eventId;
  }

  /**
   * 獲取事件發生時間
   */
  get occurredAt(): Date {
    return this.metadata.occurredAt.toDate();
  }

  /**
   * 獲取事件版本
   */
  get version(): number {
    return this.metadata.version;
  }

  /**
   * 獲取工作區 ID
   */
  get workspaceId(): string | undefined {
    return this.metadata.workspaceId;
  }

  /**
   * 獲取觸發者 ID
   */
  get actorId(): string | undefined {
    return this.metadata.actorId;
  }

  /**
   * 獲取關聯 ID
   */
  get correlationId(): string | undefined {
    return this.metadata.correlationId;
  }

  /**
   * 獲取因果 ID
   */
  get causationId(): string | undefined {
    return this.metadata.causationId;
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): {
    eventType: string;
    metadata: EventMetadata;
    payload: TPayload;
  } {
    return {
      eventType: this.eventType,
      metadata: this.metadata,
      payload: this.payload,
    };
  }

  /**
   * 轉換為字串
   */
  toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}

/**
 * WorkspaceScoped 領域事件基類
 * 
 * 所有與工作區相關的事件都應繼承此基類
 * 確保事件包含 workspaceId
 */
export abstract class WorkspaceScopedDomainEvent<
  TPayload = unknown
> extends DomainEventBase<TPayload> {
  constructor(metadata: EventMetadata, payload: TPayload) {
    if (!metadata.workspaceId) {
      throw new Error(
        'WorkspaceScoped event must have workspaceId in metadata'
      );
    }
    
    super(metadata, payload);
  }

  /**
   * 獲取工作區 ID (覆寫父類,確保非 undefined)
   */
  override get workspaceId(): string {
    return this.metadata.workspaceId!;
  }
}
