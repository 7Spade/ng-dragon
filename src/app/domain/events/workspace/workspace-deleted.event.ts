import { WorkspaceScopedDomainEvent } from '../base/domain-event.base';
import { EventMetadata } from '../base/event-metadata';

/**
 * Workspace Deleted Event 負載
 */
export interface WorkspaceDeletedPayload {
  readonly workspaceId: string;
  readonly deletedBy: string;
  readonly reason?: string;
}

/**
 * Workspace Deleted Event
 * 
 * 當工作區被刪除時觸發
 */
export class WorkspaceDeletedEvent extends WorkspaceScopedDomainEvent<WorkspaceDeletedPayload> {
  readonly eventType = 'workspace.deleted' as const;

  constructor(metadata: EventMetadata, payload: WorkspaceDeletedPayload) {
    super(metadata, payload);
  }

  /**
   * 創建事件
   */
  static create(props: {
    eventId: string;
    workspaceId: string;
    deletedBy: string;
    reason?: string;
    actorId?: string;
    correlationId?: string;
    causationId?: string;
  }): WorkspaceDeletedEvent {
    const metadata: EventMetadata = {
      eventId: props.eventId,
      occurredAt: new Date() as any,
      version: 1,
      workspaceId: props.workspaceId,
      actorId: props.actorId || props.deletedBy,
      correlationId: props.correlationId,
      causationId: props.causationId,
    };

    const payload: WorkspaceDeletedPayload = {
      workspaceId: props.workspaceId,
      deletedBy: props.deletedBy,
      reason: props.reason,
    };

    return new WorkspaceDeletedEvent(metadata, payload);
  }
}
