import { Role } from '../entities/role.entity';
import { Permission, PermissionAction } from '../value-objects/permission';

const DEFAULT_POLICY: Record<string, PermissionAction[]> = {
  owner: ['read', 'write', 'manage', 'delete', 'invite', 'admin'],
  admin: ['read', 'write', 'manage', 'invite'],
  member: ['read', 'write'],
  guest: ['read']
};

export class AccessPolicyService {
  private readonly roles: Map<string, Role>;

  constructor(policy: Record<string, PermissionAction[]> = DEFAULT_POLICY) {
    this.roles = new Map(
      Object.entries(policy).map(([name, actions]) => [name, new Role(name, actions.map(a => new Permission(a)))])
    );
  }

  getRole(name: string): Role | undefined {
    return this.roles.get(name);
  }
}
