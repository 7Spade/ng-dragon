/**
 * FeatureToggledEvent
 * 
 * Domain event emitted when a feature flag is toggled.
 */
export interface FeatureToggledEvent {
  eventType: 'FeatureToggled';
  workspaceId: string;
  actorAccountId: string;
  featureName: string;
  enabled: boolean;
  occurredAt: Date;
  // metadata: EventMetadata;
}

export function createFeatureToggledEvent(
  workspaceId: string,
  actorAccountId: string,
  featureName: string,
  enabled: boolean
): FeatureToggledEvent {
  return {
    eventType: 'FeatureToggled',
    workspaceId,
    actorAccountId,
    featureName,
    enabled,
    occurredAt: new Date()
  };
}
