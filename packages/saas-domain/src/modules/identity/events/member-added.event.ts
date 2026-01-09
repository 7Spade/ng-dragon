import { MembershipStatus } from '../value-objects/membership';

/**
 * MemberAddedEvent
 * 
 * Domain event emitted when a member is added to a workspace.
 * Follows Event Sourcing pattern with complete metadata.
 */
export interface MemberAddedEvent {
  eventType: 'MemberAdded';
  memberId: string;
  workspaceId: string;
  actorAccountId: string;      // Who added (Account is actor)
  addedAccountId: string;       // Who was added (Module uses Account)
  membershipStatus: MembershipStatus;
  roleType: string;
  occurredAt: Date;
  // metadata: EventMetadata;   // From Phase 1 (will be integrated)
}

export function createMemberAddedEvent(
  memberId: string,
  workspaceId: string,
  actorAccountId: string,
  addedAccountId: string,
  status: MembershipStatus = 'invited',
  roleType: string = 'member'
): MemberAddedEvent {
  return {
    eventType: 'MemberAdded',
    memberId,
    workspaceId,
    actorAccountId,
    addedAccountId,
    membershipStatus: status,
    roleType,
    occurredAt: new Date()
  };
}
