import { ActivityType } from './activity-type';

/**
 * AuditEntry Value Object
 * 
 * Immutable audit record.
 * Every entry tracks: who, what, when, where, why
 */
export class AuditEntry {
  constructor(
    public readonly entryId: string,
    public readonly workspaceId: string,
    public readonly actorAccountId: string,
    public readonly activityType: ActivityType,
    public readonly description: string,
    public readonly occurredAt: Date,
    public readonly metadata: Record<string, any> = {}
  ) {}

  static create(
    workspaceId: string,
    actorAccountId: string,
    activityType: ActivityType,
    description: string,
    metadata: Record<string, any> = {}
  ): AuditEntry {
    const entryId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    return new AuditEntry(
      entryId,
      workspaceId,
      actorAccountId,
      activityType,
      description,
      new Date(),
      metadata
    );
  }

  equals(other: AuditEntry): boolean {
    return this.entryId === other.entryId;
  }

  toString(): string {
    return `AuditEntry(${this.activityType.toString()}, ${this.occurredAt.toISOString()})`;
  }
}
