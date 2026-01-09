// Identity/Members Module Public API

// Entities
export { Member } from './entities/member.entity';

// Value Objects
export { MemberId } from './value-objects/member-id';
export { Membership, type MembershipStatus } from './value-objects/membership';

// Events
export { 
  type MemberAddedEvent,
  createMemberAddedEvent 
} from './events/member-added.event';

export {
  type MemberRemovedEvent,
  createMemberRemovedEvent
} from './events/member-removed.event';
