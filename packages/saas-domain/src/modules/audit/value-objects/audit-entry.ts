import { ActivityType } from './activity-type';

export class AuditEntry {
  constructor(
    public readonly activity: ActivityType,
    public readonly actorId: string,
    public readonly message: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
