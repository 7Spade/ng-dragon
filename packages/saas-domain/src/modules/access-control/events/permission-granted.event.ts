import { DomainEvent } from '@account-domain';

export interface PermissionGrantedPayload {
  permission: string;
  workspaceId: string;
  granteeId: string;
}

export type PermissionGrantedEvent = DomainEvent<PermissionGrantedPayload>;
