import { DomainEvent } from '@account-domain';

export interface RoleAssignedPayload {
  accountId: string;
  workspaceId: string;
  role: string;
}

export type RoleAssignedEvent = DomainEvent<RoleAssignedPayload>;
