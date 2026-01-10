export type ActorType = 'user' | 'organization' | 'bot' | 'system';

export class ActorIdentity {
  constructor(public readonly accountId: string, public readonly actorType: ActorType = 'user') {}

  canPerformAction(_actionType: string): boolean {
    // Extendable hook for permission checks; for now allow all for human/system actors.
    return this.actorType !== 'bot' || _actionType !== 'restricted';
  }

  isHumanUser(): boolean {
    return this.actorType === 'user' || this.actorType === 'organization';
  }

  equals(other: ActorIdentity): boolean {
    return this.accountId === other.accountId && this.actorType === other.actorType;
  }
}
