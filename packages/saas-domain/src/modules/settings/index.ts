// Settings/Profile Module Public API

// Entities
export { WorkspaceProfile } from './entities/workspace-profile.entity';

// Value Objects
export { WorkspaceSettings } from './value-objects/workspace-settings';
export { FeatureFlag } from './value-objects/feature-flag';

// Events
export {
  type SettingsUpdatedEvent,
  createSettingsUpdatedEvent
} from './events/settings-updated.event';

export {
  type FeatureToggledEvent,
  createFeatureToggledEvent
} from './events/feature-toggled.event';
