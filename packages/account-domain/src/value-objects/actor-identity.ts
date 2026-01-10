export type ActorType = 'user' | 'organization' | 'bot' | 'system';

export class ActorIdentity {
  constructor(public readonly accountId: string, public readonly actorType: ActorType = 'user') {}

  canPerformAction(_actionType: string): boolean {
    return true;
  }

  isHumanUser(): boolean {
    return this.actorType === 'user';
  }

  equals(other: ActorIdentity): boolean {
    return this.accountId === other.accountId && this.actorType === other.actorType;
  }
}
