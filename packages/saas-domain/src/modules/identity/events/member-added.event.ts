import { Member } from '../entities/member.entity';

export class MemberAddedEvent {
  constructor(public readonly member: Member, public readonly workspaceId: string, public readonly occurredAt: string) {}
}
