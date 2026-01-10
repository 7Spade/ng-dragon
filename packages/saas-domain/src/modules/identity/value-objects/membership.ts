export type MembershipStatus = 'active' | 'invited' | 'disabled';

export class Membership {
  constructor(public readonly status: MembershipStatus = 'active') {}

  isActive(): boolean {
    return this.status === 'active';
  }
}
