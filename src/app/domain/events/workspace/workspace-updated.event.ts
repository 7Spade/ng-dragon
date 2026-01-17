import { WorkspaceScopedDomainEvent } from '../base/domain-event.base';
import { EventMetadata } from '../base/event-metadata';

/**
 * Workspace Updated Event 負載
 */
export interface WorkspaceUpdatedPayload {
  readonly workspaceId: string;
  readonly changes: {
    readonly name?: string;
    readonly slug?: string;
    readonly description?: string;
    readonly type?: string;
    readonly avatar?: string;
    readonly color?: string;
    readonly icon?: string;
  };
}

/**
 * Workspace Updated Event
 * 
 * 當工作區資訊被更新時觸發
 */
export class WorkspaceUpdatedEvent extends WorkspaceScopedDomainEvent<WorkspaceUpdatedPayload> {
  readonly eventType = 'workspace.updated' as const;

  constructor(metadata: EventMetadata, payload: WorkspaceUpdatedPayload) {
    super(metadata, payload);
  }

  /**
   * 創建事件
   */
  static create(props: {
    eventId: string;
    workspaceId: string;
    changes: WorkspaceUpdatedPayload['changes'];
    actorId?: string;
    correlationId?: string;
    causationId?: string;
  }): WorkspaceUpdatedEvent {
    const metadata: EventMetadata = {
      eventId: props.eventId,
      occurredAt: new Date() as any,
      version: 1,
      workspaceId: props.workspaceId,
      actorId: props.actorId,
      correlationId: props.correlationId,
      causationId: props.causationId,
    };

    const payload: WorkspaceUpdatedPayload = {
      workspaceId: props.workspaceId,
      changes: props.changes,
    };

    return new WorkspaceUpdatedEvent(metadata, payload);
  }
}
