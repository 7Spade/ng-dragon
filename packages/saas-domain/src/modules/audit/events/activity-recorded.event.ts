import { AuditEntry } from '../value-objects/audit-entry';

export class ActivityRecordedEvent {
  constructor(public readonly workspaceId: string, public readonly entry: AuditEntry) {}
}
