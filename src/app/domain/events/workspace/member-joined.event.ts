import { WorkspaceScopedDomainEvent } from '../base/domain-event.base';
import { EventMetadata } from '../base/event-metadata';

/**
 * Member Joined Event 負載
 */
export interface MemberJoinedPayload {
  readonly workspaceId: string;
  readonly membershipId: string;
  readonly accountId: string;
  readonly role: string;
  readonly invitedBy?: string;
}

/**
 * Member Joined Event
 * 
 * 當新成員加入工作區時觸發
 */
export class MemberJoinedEvent extends WorkspaceScopedDomainEvent<MemberJoinedPayload> {
  readonly eventType = 'workspace.member.joined' as const;

  constructor(metadata: EventMetadata, payload: MemberJoinedPayload) {
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
    role: string;
    invitedBy?: string;
    actorId?: string;
    correlationId?: string;
    causationId?: string;
  }): MemberJoinedEvent {
    const metadata: EventMetadata = {
      eventId: props.eventId,
      occurredAt: new Date() as any,
      version: 1,
      workspaceId: props.workspaceId,
      actorId: props.actorId || props.accountId,
      correlationId: props.correlationId,
      causationId: props.causationId,
    };

    const payload: MemberJoinedPayload = {
      workspaceId: props.workspaceId,
      membershipId: props.membershipId,
      accountId: props.accountId,
      role: props.role,
      invitedBy: props.invitedBy,
    };

    return new MemberJoinedEvent(metadata, payload);
  }
}
