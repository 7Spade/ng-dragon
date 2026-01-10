export class RoleAssignedEvent {
  constructor(public readonly accountId: string, public readonly role: string, public readonly workspaceId: string) {}
}
