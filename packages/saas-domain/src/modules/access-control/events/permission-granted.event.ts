export class PermissionGrantedEvent {
  constructor(
    public readonly accountId: string,
    public readonly permission: string,
    public readonly workspaceId: string,
    public readonly grantedAt: string
  ) {}
}
