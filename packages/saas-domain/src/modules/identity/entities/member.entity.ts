import { MemberId } from '../value-objects/member-id';
import { Membership } from '../value-objects/membership';

/**
 * Member Entity
 * 
 * Represents a workspace member.
 * Note: Member USES accountId but does NOT OWN Account.
 * Account ownership remains with account-domain.
 */
export class Member {
  constructor(
    public readonly memberId: MemberId,
    public readonly workspaceId: string,
    public readonly accountId: string,  // USES Account, not owns
    public readonly membership: Membership,
    public readonly roleType: string = 'member'
  ) {}

  isActive(): boolean {
    return this.membership.isActive();
  }

  activate(): Member {
    return new Member(
      this.memberId,
      this.workspaceId,
      this.accountId,
      this.membership.activate(),
      this.roleType
    );
  }

  disable(): Member {
    return new Member(
      this.memberId,
      this.workspaceId,
      this.accountId,
      this.membership.disable(),
      this.roleType
    );
  }

  changeRole(newRole: string): Member {
    return new Member(
      this.memberId,
      this.workspaceId,
      this.accountId,
      this.membership,
      newRole
    );
  }

  equals(other: Member): boolean {
    return this.memberId.equals(other.memberId);
  }

  toString(): string {
    return `Member(${this.memberId.getValue()}, ${this.membership.status})`;
  }
}
