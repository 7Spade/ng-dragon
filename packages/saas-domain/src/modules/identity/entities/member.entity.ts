import { MemberId } from '../value-objects/member-id';
import { Membership } from '../value-objects/membership';

export class Member {
  constructor(
    public readonly id: MemberId,
    public readonly accountId: string,
    public readonly role: 'owner' | 'admin' | 'member' | 'guest' = 'member',
    public membership: Membership = new Membership()
  ) {}

  activate(): void {
    this.membership = new Membership('active');
  }
}
