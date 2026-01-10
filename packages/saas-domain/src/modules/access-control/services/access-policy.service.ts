import { Permission, PermissionAction } from '../value-objects/permission';
import { Role } from '../entities/role.entity';

export class AccessPolicyService {
  private readonly defaultPermissions: Record<string, PermissionAction[]> = {
    owner: ['admin', 'manage', 'write', 'read'],
    admin: ['manage', 'write', 'read'],
    member: ['write', 'read'],
    guest: ['read']
  };

  getRole(name: string): Role {
    const actions = this.defaultPermissions[name] ?? [];
    return new Role(name, actions.map(a => new Permission(a)));
  }
}
