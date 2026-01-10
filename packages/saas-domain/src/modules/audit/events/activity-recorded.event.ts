import { DomainEvent } from '@account-domain';
import { AuditEntry } from '../value-objects/audit-entry';

export interface ActivityRecordedPayload {
  workspaceId: string;
  entry: AuditEntry;
}

export type ActivityRecordedEvent = DomainEvent<ActivityRecordedPayload>;
