export class FeatureFlag {
  constructor(public readonly key: string, public readonly enabled: boolean = true) {}
}
