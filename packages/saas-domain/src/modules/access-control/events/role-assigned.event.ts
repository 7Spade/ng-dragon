import { RoleType } from '../entities/role.entity';

/**
 * RoleAssignedEvent
 * 
 * Domain event emitted when a role is assigned to a member.
 */
export interface RoleAssignedEvent {
  eventType: 'RoleAssigned';
  roleId: string;
  workspaceId: string;
  actorAccountId: string;      // Who assigned
  assigneeAccountId: string;   // To whom
  roleType: RoleType;
  occurredAt: Date;
  // metadata: EventMetadata;
}

export function createRoleAssignedEvent(
  roleId: string,
  workspaceId: string,
  actorAccountId: string,
  assigneeAccountId: string,
  roleType: RoleType
): RoleAssignedEvent {
  return {
    eventType: 'RoleAssigned',
    roleId,
    workspaceId,
    actorAccountId,
    assigneeAccountId,
    roleType,
    occurredAt: new Date()
  };
}
