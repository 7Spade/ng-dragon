/**
 * WorkspaceSettings Value Object
 * 
 * Configuration values for a workspace.
 * Immutable - changes create new instance.
 */
export class WorkspaceSettings {
  constructor(
    public readonly timezone: string = 'UTC',
    public readonly locale: string = 'en-US',
    public readonly planTier: 'free' | 'pro' | 'enterprise' = 'free',
    public readonly maxMembers: number = 10,
    public readonly customDomain?: string
  ) {}

  updateTimezone(timezone: string): WorkspaceSettings {
    return new WorkspaceSettings(
      timezone,
      this.locale,
      this.planTier,
      this.maxMembers,
      this.customDomain
    );
  }

  updateLocale(locale: string): WorkspaceSettings {
    return new WorkspaceSettings(
      this.timezone,
      locale,
      this.planTier,
      this.maxMembers,
      this.customDomain
    );
  }

  upgradePlan(tier: 'free' | 'pro' | 'enterprise'): WorkspaceSettings {
    const maxMembers = tier === 'free' ? 10 : tier === 'pro' ? 50 : Number.MAX_SAFE_INTEGER;
    return new WorkspaceSettings(
      this.timezone,
      this.locale,
      tier,
      maxMembers,
      this.customDomain
    );
  }

  equals(other: WorkspaceSettings): boolean {
    return this.timezone === other.timezone &&
           this.locale === other.locale &&
           this.planTier === other.planTier;
  }

  toString(): string {
    return `Settings(${this.planTier}, ${this.timezone}, ${this.locale})`;
  }
}
