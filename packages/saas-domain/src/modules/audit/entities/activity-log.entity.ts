import { AuditEntry } from '../value-objects/audit-entry';

export class ActivityLog {
  constructor(public readonly workspaceId: string, public readonly entries: AuditEntry[] = []) {}

  record(entry: AuditEntry): ActivityLog {
    return new ActivityLog(this.workspaceId, [...this.entries, entry]);
  }
}
