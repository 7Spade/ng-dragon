/**
 * SettingsUpdatedEvent
 * 
 * Domain event emitted when workspace settings are updated.
 */
export interface SettingsUpdatedEvent {
  eventType: 'SettingsUpdated';
  workspaceId: string;
  actorAccountId: string;
  changedFields: string[];
  previousTimezone?: string;
  newTimezone?: string;
  previousLocale?: string;
  newLocale?: string;
  previousPlanTier?: string;
  newPlanTier?: string;
  occurredAt: Date;
  // metadata: EventMetadata;
}

export function createSettingsUpdatedEvent(
  workspaceId: string,
  actorAccountId: string,
  changedFields: string[],
  changes: Record<string, { previous: any; new: any }>
): SettingsUpdatedEvent {
  return {
    eventType: 'SettingsUpdated',
    workspaceId,
    actorAccountId,
    changedFields,
    previousTimezone: changes['timezone']?.previous,
    newTimezone: changes['timezone']?.new,
    previousLocale: changes['locale']?.previous,
    newLocale: changes['locale']?.new,
    previousPlanTier: changes['planTier']?.previous,
    newPlanTier: changes['planTier']?.new,
    occurredAt: new Date()
  };
}
