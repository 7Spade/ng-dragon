import { ActivityCategory } from '../value-objects/activity-type';

/**
 * ActivityRecordedEvent
 * 
 * Domain event emitted when an activity is logged.
 */
export interface ActivityRecordedEvent {
  eventType: 'ActivityRecorded';
  auditEntryId: string;
  workspaceId: string;
  actorAccountId: string;
  activityCategory: ActivityCategory;
  activityAction: string;
  description: string;
  occurredAt: Date;
  // metadata: EventMetadata;
}

export function createActivityRecordedEvent(
  auditEntryId: string,
  workspaceId: string,
  actorAccountId: string,
  activityCategory: ActivityCategory,
  activityAction: string,
  description: string
): ActivityRecordedEvent {
  return {
    eventType: 'ActivityRecorded',
    auditEntryId,
    workspaceId,
    actorAccountId,
    activityCategory,
    activityAction,
    description,
    occurredAt: new Date()
  };
}
