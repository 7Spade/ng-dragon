export class FeatureToggledEvent {
  constructor(public readonly workspaceId: string, public readonly featureKey: string, public readonly enabled: boolean) {}
}
