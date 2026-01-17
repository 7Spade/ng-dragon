import { WorkspaceScopedDomainEvent } from '../base/domain-event.base';
import { EventMetadata } from '../base/event-metadata';

/**
 * Workspace Created Event 負載
 */
export interface WorkspaceCreatedPayload {
  readonly workspaceId: string;
  readonly name: string;
  readonly slug: string;
  readonly type: string;
  readonly ownerId: string;
  readonly accountId?: string;
  readonly contextId?: string;
}

/**
 * Workspace Created Event
 * 
 * 當新工作區被創建時觸發
 */
export class WorkspaceCreatedEvent extends WorkspaceScopedDomainEvent<WorkspaceCreatedPayload> {
  readonly eventType = 'workspace.created' as const;

  constructor(metadata: EventMetadata, payload: WorkspaceCreatedPayload) {
    super(metadata, payload);
  }

  /**
   * 創建事件
   */
  static create(props: {
    eventId: string;
    workspaceId: string;
    name: string;
    slug: string;
    type: string;
    ownerId: string;
    accountId?: string;
    contextId?: string;
    actorId?: string;
    correlationId?: string;
    causationId?: string;
  }): WorkspaceCreatedEvent {
    const metadata: EventMetadata = {
      eventId: props.eventId,
      occurredAt: new Date() as any, // Timestamp 類型
      version: 1,
      workspaceId: props.workspaceId,
      actorId: props.actorId,
      correlationId: props.correlationId,
      causationId: props.causationId,
    };

    const payload: WorkspaceCreatedPayload = {
      workspaceId: props.workspaceId,
      name: props.name,
      slug: props.slug,
      type: props.type,
      ownerId: props.ownerId,
      accountId: props.accountId,
      contextId: props.contextId,
    };

    return new WorkspaceCreatedEvent(metadata, payload);
  }
}
