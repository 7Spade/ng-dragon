/**
 * Permission Value Object
 * 
 * Represents a granular permission within a workspace.
 * Examples: read, write, manage, delete, invite
 */
export type PermissionType = 'read' | 'write' | 'manage' | 'delete' | 'invite' | 'admin';

export class Permission {
  constructor(
    public readonly type: PermissionType,
    public readonly resource?: string  // Optional resource scoping (e.g., 'tasks', 'members')
  ) {}

  static READ = new Permission('read');
  static WRITE = new Permission('write');
  static MANAGE = new Permission('manage');
  static DELETE = new Permission('delete');
  static INVITE = new Permission('invite');
  static ADMIN = new Permission('admin');

  isAtLeast(required: Permission): boolean {
    const hierarchy: Record<PermissionType, number> = {
      read: 1,
      write: 2,
      invite: 3,
      delete: 4,
      manage: 5,
      admin: 6
    };
    return hierarchy[this.type] >= hierarchy[required.type];
  }

  equals(other: Permission): boolean {
    return this.type === other.type && this.resource === other.resource;
  }

  toString(): string {
    return this.resource ? `${this.type}:${this.resource}` : this.type;
  }
}
