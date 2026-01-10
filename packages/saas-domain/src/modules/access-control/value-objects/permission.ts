export type PermissionAction = 'read' | 'write' | 'manage' | 'delete' | 'invite' | 'admin';

export class Permission {
  constructor(public readonly action: PermissionAction) {}
}
