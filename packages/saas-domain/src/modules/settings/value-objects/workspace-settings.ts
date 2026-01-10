export class WorkspaceSettings {
  constructor(
    public readonly timezone: string = 'UTC',
    public readonly locale: string = 'en-US',
    public readonly planTier: string = 'free'
  ) {}
}
