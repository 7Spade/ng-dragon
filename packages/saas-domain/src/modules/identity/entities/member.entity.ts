import { MemberRole } from '@account-domain';
import { MemberId } from '../value-objects/member-id';
import { Membership } from '../value-objects/membership';

export class Member {
  constructor(
    public readonly id: MemberId,
    public readonly accountId: string,
    public readonly role: MemberRole = 'member',
    public readonly membership: Membership = new Membership('active')
  ) {}
}
