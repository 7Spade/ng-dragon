import { Permission } from '../value-objects/permission';

/**
 * Role Entity
 * 
 * Represents a role within a workspace with associated permissions.
 * Standard roles: owner, admin, member
 */
export type RoleType = 'owner' | 'admin' | 'member' | 'guest';

export class Role {
  constructor(
    public readonly roleId: string,
    public readonly workspaceId: string,
    public readonly roleType: RoleType,
    public readonly permissions: readonly Permission[],
    public readonly displayName?: string
  ) {}

  hasPermission(permission: Permission): boolean {
    return this.permissions.some(p => p.equals(permission) || p.isAtLeast(permission));
  }

  addPermission(permission: Permission): Role {
    if (this.hasPermission(permission)) {
      return this;
    }
    return new Role(
      this.roleId,
      this.workspaceId,
      this.roleType,
      [...this.permissions, permission],
      this.displayName
    );
  }

  removePermission(permission: Permission): Role {
    return new Role(
      this.roleId,
      this.workspaceId,
      this.roleType,
      this.permissions.filter(p => !p.equals(permission)),
      this.displayName
    );
  }

  isOwner(): boolean {
    return this.roleType === 'owner';
  }

  isAdmin(): boolean {
    return this.roleType === 'admin' || this.roleType === 'owner';
  }

  equals(other: Role): boolean {
    return this.roleId === other.roleId;
  }

  toString(): string {
    return `Role(${this.roleType}, ${this.permissions.length} permissions)`;
  }
}
