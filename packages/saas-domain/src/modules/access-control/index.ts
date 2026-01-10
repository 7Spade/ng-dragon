// Access Control Module Public API

// Entities
export { Role, type RoleType } from './entities/role.entity';

// Value Objects
export { Permission, type PermissionType } from './value-objects/permission';

// Services
export { AccessPolicy } from './services/access-policy.service';

// Events
export {
  type RoleAssignedEvent,
  createRoleAssignedEvent
} from './events/role-assigned.event';

export {
  type PermissionGrantedEvent,
  createPermissionGrantedEvent
} from './events/permission-granted.event';
