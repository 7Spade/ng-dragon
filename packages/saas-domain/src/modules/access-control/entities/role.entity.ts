import { Permission } from '../value-objects/permission';

export class Role {
  constructor(public readonly name: string, public readonly permissions: Permission[] = []) {}

  grant(permission: Permission): Role {
    if (this.permissions.find(p => p.equals(permission))) return this;
    return new Role(this.name, [...this.permissions, permission]);
  }
}
