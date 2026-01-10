import { Role, RoleType } from '../entities/role.entity';
import { Permission } from '../value-objects/permission';

/**
 * AccessPolicy Domain Service
 * 
 * Maps roles to permissions following workspace access rules.
 * This is domain logic, not infrastructure.
 */
export class AccessPolicy {
  private static readonly DEFAULT_PERMISSIONS: Record<RoleType, Permission[]> = {
    owner: [
      Permission.ADMIN,
      Permission.MANAGE,
      Permission.DELETE,
      Permission.WRITE,
      Permission.INVITE,
      Permission.READ
    ],
    admin: [
      Permission.MANAGE,
      Permission.DELETE,
      Permission.WRITE,
      Permission.INVITE,
      Permission.READ
    ],
    member: [
      Permission.WRITE,
      Permission.READ
    ],
    guest: [
      Permission.READ
    ]
  };

  static getDefaultPermissionsForRole(roleType: RoleType): Permission[] {
    return this.DEFAULT_PERMISSIONS[roleType] || [];
  }

  static canPerformAction(role: Role, requiredPermission: Permission): boolean {
    return role.hasPermission(requiredPermission);
  }

  static createDefaultRole(roleId: string, workspaceId: string, roleType: RoleType): Role {
    const permissions = this.getDefaultPermissionsForRole(roleType);
    return new Role(roleId, workspaceId, roleType, permissions);
  }
}
