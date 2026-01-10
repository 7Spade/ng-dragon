/**
 * WorkspaceSettingsAggregate - Event-Sourced Aggregate for Workspace Settings
 * 
 * Per Module(業務模組).md:
 * - Settings/Profile is one of the 4 base modules
 * - Manages workspace metadata and configuration
 * - Tracks feature flags and preferences
 * 
 * Events:
 * - SettingsUpdated
 * - FeatureToggled
 * - ProfileUpdated
 */

import { DomainEvent, EventContext, toEventMetadata } from '../../../../../account-domain/src/events/domain-event';
import { WorkspaceSettings } from '../value-objects/workspace-settings';
import { FeatureFlag } from '../value-objects/feature-flag';
import { WorkspaceProfile } from '../entities/workspace-profile.entity';

export interface SettingsSnapshot {
  workspaceId: string;
  profile: WorkspaceProfile;
  version: number;
}

export interface SettingsUpdatedPayload {
  workspaceId: string;
  settings: WorkspaceSettings;
  updatedByAccountId: string;
}

export interface FeatureToggledPayload {
  workspaceId: string;
  featureName: string;
  enabled: boolean;
  toggledByAccountId: string;
}

export interface ProfileUpdatedPayload {
  workspaceId: string;
  name?: string;
  description?: string;
  logoUrl?: string | null;
  updatedByAccountId: string;
}

export class WorkspaceSettingsAggregate {
  constructor(private readonly snapshot: SettingsSnapshot) {}

  /**
   * Bootstrap with default settings
   */
  static bootstrap(
    workspaceId: string,
    name: string,
    description: string = ''
  ): WorkspaceSettingsAggregate {
    const now = new Date();
    const settings = new WorkspaceSettings(
      'free',
      'UTC',
      'en',
      {}
    );
    const profile = new WorkspaceProfile(
      workspaceId,
      name,
      description,
      null,
      settings,
      [],
      now,
      now
    );

    return new WorkspaceSettingsAggregate({
      workspaceId,
      profile,
      version: 0,
    });
  }

  /**
   * Update workspace settings
   */
  updateSettings(
    settings: WorkspaceSettings,
    context: EventContext
  ): {
    aggregate: WorkspaceSettingsAggregate;
    event: DomainEvent<SettingsUpdatedPayload>;
  } {
    const updatedProfile = this.snapshot.profile.updateSettings(settings);
    
    const nextSnapshot: SettingsSnapshot = {
      ...this.snapshot,
      profile: updatedProfile,
      version: this.snapshot.version + 1,
    };

    const payload: SettingsUpdatedPayload = {
      workspaceId: this.snapshot.workspaceId,
      settings,
      updatedByAccountId: context.actorId,
    };

    const event: DomainEvent<SettingsUpdatedPayload> = {
      eventType: 'SettingsUpdated',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: 'settings',
      payload,
      metadata: toEventMetadata(context),
    };

    return {
      aggregate: new WorkspaceSettingsAggregate(nextSnapshot),
      event,
    };
  }

  /**
   * Toggle a feature flag
   */
  toggleFeature(
    featureName: string,
    context: EventContext
  ): {
    aggregate: WorkspaceSettingsAggregate;
    event: DomainEvent<FeatureToggledPayload>;
  } {
    const updatedProfile = this.snapshot.profile.toggleFeature(featureName);
    const enabled = updatedProfile.isFeatureEnabled(featureName);

    const nextSnapshot: SettingsSnapshot = {
      ...this.snapshot,
      profile: updatedProfile,
      version: this.snapshot.version + 1,
    };

    const payload: FeatureToggledPayload = {
      workspaceId: this.snapshot.workspaceId,
      featureName,
      enabled,
      toggledByAccountId: context.actorId,
    };

    const event: DomainEvent<FeatureToggledPayload> = {
      eventType: 'FeatureToggled',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: 'settings',
      payload,
      metadata: toEventMetadata(context),
    };

    return {
      aggregate: new WorkspaceSettingsAggregate(nextSnapshot),
      event,
    };
  }

  /**
   * Update workspace profile
   */
  updateProfile(
    updates: {
      name?: string;
      description?: string;
      logoUrl?: string | null;
    },
    context: EventContext
  ): {
    aggregate: WorkspaceSettingsAggregate;
    event: DomainEvent<ProfileUpdatedPayload>;
  } {
    let updatedProfile = this.snapshot.profile;

    if (updates.name) {
      updatedProfile = updatedProfile.updateName(updates.name);
    }
    if (updates.description !== undefined) {
      updatedProfile = updatedProfile.updateDescription(updates.description);
    }

    const nextSnapshot: SettingsSnapshot = {
      ...this.snapshot,
      profile: updatedProfile,
      version: this.snapshot.version + 1,
    };

    const payload: ProfileUpdatedPayload = {
      workspaceId: this.snapshot.workspaceId,
      ...updates,
      updatedByAccountId: context.actorId,
    };

    const event: DomainEvent<ProfileUpdatedPayload> = {
      eventType: 'ProfileUpdated',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: 'settings',
      payload,
      metadata: toEventMetadata(context),
    };

    return {
      aggregate: new WorkspaceSettingsAggregate(nextSnapshot),
      event,
    };
  }

  /**
   * Get current state
   */
  get state(): SettingsSnapshot {
    return this.snapshot;
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    return this.snapshot.profile.isFeatureEnabled(featureName);
  }

  /**
   * Get plan tier
   */
  getPlanTier(): string {
    return this.snapshot.profile.settings.planTier;
  }
}
