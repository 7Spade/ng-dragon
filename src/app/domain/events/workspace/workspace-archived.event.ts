import { WorkspaceScopedDomainEvent } from '../base/domain-event.base';
import { EventMetadata } from '../base/event-metadata';

/**
 * Workspace Archived Event 負載
 */
export interface WorkspaceArchivedPayload {
  readonly workspaceId: string;
  readonly archivedBy: string;
  readonly reason?: string;
}

/**
 * Workspace Archived Event
 * 
 * 當工作區被歸檔時觸發
 */
export class WorkspaceArchivedEvent extends WorkspaceScopedDomainEvent<WorkspaceArchivedPayload> {
  readonly eventType = 'workspace.archived' as const;

  constructor(metadata: EventMetadata, payload: WorkspaceArchivedPayload) {
    super(metadata, payload);
  }

  /**
   * 創建事件
   */
  static create(props: {
    eventId: string;
    workspaceId: string;
    archivedBy: string;
    reason?: string;
    actorId?: string;
    correlationId?: string;
    causationId?: string;
  }): WorkspaceArchivedEvent {
    const metadata: EventMetadata = {
      eventId: props.eventId,
      occurredAt: new Date() as any,
      version: 1,
      workspaceId: props.workspaceId,
      actorId: props.actorId || props.archivedBy,
      correlationId: props.correlationId,
      causationId: props.causationId,
    };

    const payload: WorkspaceArchivedPayload = {
      workspaceId: props.workspaceId,
      archivedBy: props.archivedBy,
      reason: props.reason,
    };

    return new WorkspaceArchivedEvent(metadata, payload);
  }
}
