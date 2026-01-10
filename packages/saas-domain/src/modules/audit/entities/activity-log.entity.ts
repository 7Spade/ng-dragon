import { AuditEntry } from '../value-objects/audit-entry';

/**
 * ActivityLog Entity
 * 
 * Aggregate root for audit trail within a workspace.
 * Stores immutable audit entries.
 */
export class ActivityLog {
  constructor(
    public readonly workspaceId: string,
    public readonly entries: readonly AuditEntry[]
  ) {}

  addEntry(entry: AuditEntry): ActivityLog {
    return new ActivityLog(
      this.workspaceId,
      [...this.entries, entry]
    );
  }

  getRecentEntries(count: number = 10): readonly AuditEntry[] {
    return this.entries.slice(-count);
  }

  getEntriesByActor(actorAccountId: string): readonly AuditEntry[] {
    return this.entries.filter(e => e.actorAccountId === actorAccountId);
  }

  getEntriesByDateRange(from: Date, to: Date): readonly AuditEntry[] {
    return this.entries.filter(e => 
      e.occurredAt >= from && e.occurredAt <= to
    );
  }

  getTotalEntries(): number {
    return this.entries.length;
  }

  equals(other: ActivityLog): boolean {
    return this.workspaceId === other.workspaceId;
  }

  toString(): string {
    return `ActivityLog(${this.workspaceId}, ${this.entries.length} entries)`;
  }
}
