/**
 * FeatureFlag Value Object
 * 
 * Represents a feature toggle state.
 */
export class FeatureFlag {
  constructor(
    public readonly featureName: string,
    public readonly enabled: boolean,
    public readonly enabledAt?: Date
  ) {}

  enable(): FeatureFlag {
    return new FeatureFlag(this.featureName, true, new Date());
  }

  disable(): FeatureFlag {
    return new FeatureFlag(this.featureName, false);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  equals(other: FeatureFlag): boolean {
    return this.featureName === other.featureName && this.enabled === other.enabled;
  }

  toString(): string {
    return `Feature(${this.featureName}: ${this.enabled ? 'ON' : 'OFF'})`;
  }
}
