/**
 * AccessControlAggregate - Event-Sourced Aggregate for Access Control
 * 
 * Per Module(業務模組).md:
 * - Access Control is one of the 4 base modules
 * - Manages roles and permissions
 * - Enforces authorization policies
 * 
 * Events:
 * - RoleAssigned
 * - RoleRevoked
 * - PermissionGranted
 * - PermissionRevoked
 */

import { DomainEvent, EventContext, toEventMetadata } from '../../../../../account-domain/src/events/domain-event';
import { Role, RoleType } from '../entities/role.entity';
import { Permission } from '../value-objects/permission';

export interface AccessControlSnapshot {
  workspaceId: string;
  roles: Role[];
  version: number;
}

export interface RoleAssignedPayload {
  workspaceId: string;
  accountId: string;
  roleType: RoleType;
  assignedByAccountId: string;
}

export interface RoleRevokedPayload {
  workspaceId: string;
  accountId: string;
  roleType: RoleType;
  revokedByAccountId: string;
}

export interface PermissionGrantedPayload {
  workspaceId: string;
  roleId: string;
  permission: string;
  grantedByAccountId: string;
}

export class AccessControlAggregate {
  constructor(private readonly snapshot: AccessControlSnapshot) {}

  /**
   * Bootstrap with default roles
   */
  static bootstrap(workspaceId: string): AccessControlAggregate {
    const defaultRoles: Role[] = [
      new Role(
        `role-owner-${workspaceId}`,
        workspaceId,
        'owner',
        [
          new Permission('workspace', 'delete'),
          new Permission('workspace', 'manage'),
          new Permission('members', 'manage'),
          new Permission('roles', 'manage'),
          new Permission('settings', 'manage'),
        ],
        'Owner'
      ),
      new Role(
        `role-admin-${workspaceId}`,
        workspaceId,
        'admin',
        [
          new Permission('workspace', 'manage'),
          new Permission('members', 'manage'),
          new Permission('settings', 'write'),
        ],
        'Administrator'
      ),
      new Role(
        `role-member-${workspaceId}`,
        workspaceId,
        'member',
        [
          new Permission('workspace', 'read'),
          new Permission('workspace', 'write'),
        ],
        'Member'
      ),
      new Role(
        `role-guest-${workspaceId}`,
        workspaceId,
        'guest',
        [
          new Permission('workspace', 'read'),
        ],
        'Guest'
      ),
    ];

    return new AccessControlAggregate({
      workspaceId,
      roles: defaultRoles,
      version: 0,
    });
  }

  /**
   * Grant permission to a role
   */
  grantPermission(
    roleType: RoleType,
    permission: Permission,
    context: EventContext
  ): {
    aggregate: AccessControlAggregate;
    event: DomainEvent<PermissionGrantedPayload>;
  } {
    const role = this.snapshot.roles.find((r) => r.roleType === roleType);
    if (!role) {
      throw new Error(`Role ${roleType} not found in workspace ${this.snapshot.workspaceId}`);
    }

    const updatedRole = role.addPermission(permission);
    const nextSnapshot: AccessControlSnapshot = {
      ...this.snapshot,
      roles: this.snapshot.roles.map((r) =>
        r.roleType === roleType ? updatedRole : r
      ),
      version: this.snapshot.version + 1,
    };

    const payload: PermissionGrantedPayload = {
      workspaceId: this.snapshot.workspaceId,
      roleId: role.roleId,
      permission: permission.toString(),
      grantedByAccountId: context.actorId,
    };

    const event: DomainEvent<PermissionGrantedPayload> = {
      eventType: 'PermissionGranted',
      aggregateId: this.snapshot.workspaceId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: 'access-control',
      payload,
      metadata: toEventMetadata(context),
    };

    return {
      aggregate: new AccessControlAggregate(nextSnapshot),
      event,
    };
  }

  /**
   * Check if a role has a specific permission
   */
  hasPermission(roleType: RoleType, permission: Permission): boolean {
    const role = this.snapshot.roles.find((r) => r.roleType === roleType);
    return role ? role.hasPermission(permission) : false;
  }

  /**
   * Get role by type
   */
  getRole(roleType: RoleType): Role | undefined {
    return this.snapshot.roles.find((r) => r.roleType === roleType);
  }

  /**
   * Get all roles
   */
  getAllRoles(): readonly Role[] {
    return this.snapshot.roles;
  }

  /**
   * Get current state
   */
  get state(): AccessControlSnapshot {
    return this.snapshot;
  }
}
