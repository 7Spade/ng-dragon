import { ActivityType } from './activity-type';

export class AuditEntry {
  constructor(
    public readonly actorId: string,
    public readonly activity: ActivityType,
    public readonly description: string,
    public readonly occurredAt: string
  ) {}
}
