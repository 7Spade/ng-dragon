/**
 * Membership Value Object
 * 
 * Represents member status and metadata within a workspace.
 * Status: active (full access), invited (pending), disabled (suspended)
 */
export type MembershipStatus = 'active' | 'invited' | 'disabled';

export class Membership {
  constructor(
    public readonly status: MembershipStatus,
    public readonly joinedAt: Date,
    public readonly invitedBy?: string, // accountId
    public readonly disabledAt?: Date
  ) {}

  isActive(): boolean {
    return this.status === 'active';
  }

  isInvited(): boolean {
    return this.status === 'invited';
  }

  isDisabled(): boolean {
    return this.status === 'disabled';
  }

  activate(): Membership {
    return new Membership('active', this.joinedAt, this.invitedBy);
  }

  disable(): Membership {
    return new Membership('disabled', this.joinedAt, this.invitedBy, new Date());
  }

  equals(other: Membership): boolean {
    return this.status === other.status && 
           this.joinedAt.getTime() === other.joinedAt.getTime();
  }

  toString(): string {
    return `Membership(${this.status})`;
  }
}
