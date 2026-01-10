import { WorkspaceSettings } from '../value-objects/workspace-settings';
import { FeatureFlag } from '../value-objects/feature-flag';

/**
 * WorkspaceProfile Entity
 * 
 * Workspace metadata and configuration.
 */
export class WorkspaceProfile {
  constructor(
    public readonly workspaceId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly logoUrl: string | null,
    public readonly settings: WorkspaceSettings,
    public readonly features: readonly FeatureFlag[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  updateName(name: string): WorkspaceProfile {
    return new WorkspaceProfile(
      this.workspaceId,
      name,
      this.description,
      this.logoUrl,
      this.settings,
      this.features,
      this.createdAt,
      new Date()
    );
  }

  updateDescription(description: string): WorkspaceProfile {
    return new WorkspaceProfile(
      this.workspaceId,
      this.name,
      description,
      this.logoUrl,
      this.settings,
      this.features,
      this.createdAt,
      new Date()
    );
  }

  updateSettings(settings: WorkspaceSettings): WorkspaceProfile {
    return new WorkspaceProfile(
      this.workspaceId,
      this.name,
      this.description,
      this.logoUrl,
      settings,
      this.features,
      this.createdAt,
      new Date()
    );
  }

  toggleFeature(featureName: string): WorkspaceProfile {
    const existingFeature = this.features.find(f => f.featureName === featureName);
    const updatedFeatures = existingFeature
      ? this.features.map(f => f.featureName === featureName ? f.enabled ? f.disable() : f.enable() : f)
      : [...this.features, new FeatureFlag(featureName, true, new Date())];

    return new WorkspaceProfile(
      this.workspaceId,
      this.name,
      this.description,
      this.logoUrl,
      this.settings,
      updatedFeatures,
      this.createdAt,
      new Date()
    );
  }

  isFeatureEnabled(featureName: string): boolean {
    const feature = this.features.find(f => f.featureName === featureName);
    return feature ? feature.isEnabled() : false;
  }

  equals(other: WorkspaceProfile): boolean {
    return this.workspaceId === other.workspaceId;
  }

  toString(): string {
    return `WorkspaceProfile(${this.name}, ${this.settings.planTier})`;
  }
}
