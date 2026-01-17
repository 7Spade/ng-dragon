import { WorkspaceScopedDomainEvent } from '../base/domain-event.base';
import { EventMetadata } from '../base/event-metadata';

/**
 * Member Left Event 負載
 */
export interface MemberLeftPayload {
  readonly workspaceId: string;
  readonly membershipId: string;
  readonly accountId: string;
  readonly removedBy?: string;
  readonly reason?: string;
}

/**
 * Member Left Event
 * 
 * 當成員離開工作區時觸發
 */
export class MemberLeftEvent extends WorkspaceScopedDomainEvent<MemberLeftPayload> {
  readonly eventType = 'workspace.member.left' as const;

  constructor(metadata: EventMetadata, payload: MemberLeftPayload) {
    super(metadata, payload);
  }

  /**
   * 創建事件
   */
  static create(props: {
    eventId: string;
    workspaceId: string;
    membershipId: string;
    accountId: string;
    removedBy?: string;
    reason?: string;
    actorId?: string;
    correlationId?: string;
    causationId?: string;
  }): MemberLeftEvent {
    const metadata: EventMetadata = {
      eventId: props.eventId,
      occurredAt: new Date() as any,
      version: 1,
      workspaceId: props.workspaceId,
      actorId: props.actorId || props.removedBy || props.accountId,
      correlationId: props.correlationId,
      causationId: props.causationId,
    };

    const payload: MemberLeftPayload = {
      workspaceId: props.workspaceId,
      membershipId: props.membershipId,
      accountId: props.accountId,
      removedBy: props.removedBy,
      reason: props.reason,
    };

    return new MemberLeftEvent(metadata, payload);
  }
}
