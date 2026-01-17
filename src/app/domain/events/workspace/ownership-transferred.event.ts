import { WorkspaceScopedDomainEvent } from '../base/domain-event.base';
import { EventMetadata } from '../base/event-metadata';

/**
 * Ownership Transferred Event 負載
 */
export interface OwnershipTransferredPayload {
  readonly workspaceId: string;
  readonly previousOwnerId: string;
  readonly newOwnerId: string;
  readonly transferredBy: string;
}

/**
 * Ownership Transferred Event
 * 
 * 當工作區所有權轉移時觸發
 */
export class OwnershipTransferredEvent extends WorkspaceScopedDomainEvent<OwnershipTransferredPayload> {
  readonly eventType = 'workspace.ownership.transferred' as const;

  constructor(metadata: EventMetadata, payload: OwnershipTransferredPayload) {
    super(metadata, payload);
  }

  /**
   * 創建事件
   */
  static create(props: {
    eventId: string;
    workspaceId: string;
    previousOwnerId: string;
    newOwnerId: string;
    transferredBy: string;
    actorId?: string;
    correlationId?: string;
    causationId?: string;
  }): OwnershipTransferredEvent {
    const metadata: EventMetadata = {
      eventId: props.eventId,
      occurredAt: new Date() as any,
      version: 1,
      workspaceId: props.workspaceId,
      actorId: props.actorId || props.transferredBy,
      correlationId: props.correlationId,
      causationId: props.causationId,
    };

    const payload: OwnershipTransferredPayload = {
      workspaceId: props.workspaceId,
      previousOwnerId: props.previousOwnerId,
      newOwnerId: props.newOwnerId,
      transferredBy: props.transferredBy,
    };

    return new OwnershipTransferredEvent(metadata, payload);
  }
}
