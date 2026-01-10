import { PermissionType } from '../value-objects/permission';

/**
 * PermissionGrantedEvent
 * 
 * Domain event emitted when a permission is granted.
 */
export interface PermissionGrantedEvent {
  eventType: 'PermissionGranted';
  workspaceId: string;
  actorAccountId: string;
  grantedToAccountId: string;
  permissionType: PermissionType;
  resource?: string;
  occurredAt: Date;
  // metadata: EventMetadata;
}

export function createPermissionGrantedEvent(
  workspaceId: string,
  actorAccountId: string,
  grantedToAccountId: string,
  permissionType: PermissionType,
  resource?: string
): PermissionGrantedEvent {
  return {
    eventType: 'PermissionGranted',
    workspaceId,
    actorAccountId,
    grantedToAccountId,
    permissionType,
    resource,
    occurredAt: new Date()
  };
}
