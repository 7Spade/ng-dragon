export class MemberRemovedEvent {
  constructor(public readonly memberId: string, public readonly workspaceId: string, public readonly occurredAt: string) {}
}
