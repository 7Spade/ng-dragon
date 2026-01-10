import { Permission } from '../value-objects/permission';

export class Role {
  constructor(public readonly name: string, public readonly permissions: Permission[] = []) {}
}
