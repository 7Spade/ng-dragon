/**
 * MemberRemovedEvent
 * 
 * Domain event emitted when a member is removed from a workspace.
 */
export interface MemberRemovedEvent {
  eventType: 'MemberRemoved';
  memberId: string;
  workspaceId: string;
  actorAccountId: string;       // Who removed
  removedAccountId: string;     // Who was removed
  reason?: string;
  occurredAt: Date;
  // metadata: EventMetadata;    // From Phase 1
}

export function createMemberRemovedEvent(
  memberId: string,
  workspaceId: string,
  actorAccountId: string,
  removedAccountId: string,
  reason?: string
): MemberRemovedEvent {
  return {
    eventType: 'MemberRemoved',
    memberId,
    workspaceId,
    actorAccountId,
    removedAccountId,
    reason,
    occurredAt: new Date()
  };
}
