export type PermissionAction = 'read' | 'write' | 'manage' | 'delete' | 'invite' | 'admin';

export class Permission {
  constructor(public readonly action: PermissionAction, public readonly resource: string = 'workspace') {}

  equals(other: Permission): boolean {
    return this.action === other.action && this.resource === other.resource;
  }
}
