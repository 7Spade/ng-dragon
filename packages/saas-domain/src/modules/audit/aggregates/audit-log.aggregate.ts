/**
 * AuditLogAggregate - Event-Sourced Aggregate for Audit Trail
 * 
 * Per Module(業務模組).md:
 * - Audit/Activity is one of the 4 base modules
 * - Records all significant events in workspace
 * - Provides immutable audit trail
 * 
 * Events:
 * - ActivityRecorded
 * 
 * Note: This aggregate primarily listens to OTHER events and records them.
 * It doesn't generate many events itself - it's a projection of the event stream.
 */

import { DomainEvent, EventContext, toEventMetadata } from '../../../../../account-domain/src/events/domain-event';
import { AuditEntry } from '../value-objects/audit-entry';
import { ActivityLog } from '../entities/activity-log.entity';

export interface AuditSnapshot {
  workspaceId: string;
  activityLog: ActivityLog;
  version: number;
}

export interface ActivityRecordedPayload {
  workspaceId: string;
  actorAccountId: string;
  activityType: string;
  description: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export class AuditLogAggregate {
  constructor(private readonly snapshot: AuditSnapshot) {}

  /**
   * Bootstrap empty audit log
   */
  static bootstrap(workspaceId: string): AuditLogAggregate {
    const activityLog = new ActivityLog(workspaceId, []);
    return new AuditLogAggregate({
      workspaceId,
      activityLog,
      version: 0,
    });
  }

  /**
   * Record an activity
   */
  recordActivity(
    activityType: string,
    description: string,
    metadata: Record<string, unknown>,
    context: EventContext
  ): {
    aggregate: AuditLogAggregate;
    event: DomainEvent<ActivityRecordedPayload>;
  } {
    const entry = new AuditEntry(
      `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      context.actorId,
      activityType,
      description,
      metadata,
      new Date()
    );

    const updatedLog = this.snapshot.activityLog.addEntry(entry);

    const nextSnapshot: AuditSnapshot = {
      ...this.snapshot,
      activityLog: updatedLog,
      version: this.snapshot.version + 1,
    };

    const payload: ActivityRecordedPayload = {
      workspaceId: this.snapshot.workspaceId,
      actorAccountId: context.actorId,
      activityType,
      description,
      metadata,
      occurredAt: context.occurredAt ?? new Date().toISOString(),
    };

    const event: DomainEvent<ActivityRecordedPayload> = {
      eventType: 'ActivityRecorded',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: 'audit',
      payload,
      metadata: toEventMetadata(context),
    };

    return {
      aggregate: new AuditLogAggregate(nextSnapshot),
      event,
    };
  }

  /**
   * Get current state
   */
  get state(): AuditSnapshot {
    return this.snapshot;
  }

  /**
   * Get recent activities
   */
  getRecentActivities(count: number = 10): readonly AuditEntry[] {
    return this.snapshot.activityLog.getRecentEntries(count);
  }

  /**
   * Get activities by actor
   */
  getActivitiesByActor(actorAccountId: string): readonly AuditEntry[] {
    return this.snapshot.activityLog.getEntriesByActor(actorAccountId);
  }

  /**
   * Get total activity count
   */
  getTotalActivities(): number {
    return this.snapshot.activityLog.getTotalEntries();
  }
}
