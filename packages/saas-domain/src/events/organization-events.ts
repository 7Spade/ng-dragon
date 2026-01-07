import { AccountId, EntityId, WorkspaceId } from '@account-domain/src/types/identifiers';
import { OrganizationMemberRole, TeamRole } from '../value-objects/organization-roles';
import { DomainEvent } from './domain-event';

export interface OrganizationCreatedPayload {
  organizationId: EntityId;
  workspaceId: WorkspaceId;
  ownerId: AccountId;
  displayName: string;
  slug: string;
  createdAt: string;
}

export interface OrgMemberAddedPayload {
  organizationId: EntityId;
  accountId: AccountId;
  role: OrganizationMemberRole;
  joinedAt: string;
}

export interface OrgMemberRoleUpdatedPayload {
  organizationId: EntityId;
  accountId: AccountId;
  role: OrganizationMemberRole;
  updatedAt: string;
}

export interface OrgMemberRemovedPayload {
  organizationId: EntityId;
  accountId: AccountId;
  removedAt: string;
}

export interface TeamCreatedPayload {
  organizationId: EntityId;
  teamId: EntityId;
  slug: string;
  displayName: string;
  defaultPermission: 'admin' | 'write' | 'read' | 'none';
  createdAt: string;
}

export interface TeamMemberAddedPayload {
  organizationId: EntityId;
  teamId: EntityId;
  accountId: AccountId;
  role: TeamRole;
  joinedAt: string;
}

export interface TeamMemberRemovedPayload {
  organizationId: EntityId;
  teamId: EntityId;
  accountId: AccountId;
  removedAt: string;
}

export interface OrgProjectLinkedPayload {
  organizationId: EntityId;
  projectId: EntityId;
  linkedAt: string;
}

export type OrganizationDomainEvent =
  | DomainEvent<OrganizationCreatedPayload>
  | DomainEvent<OrgMemberAddedPayload>
  | DomainEvent<OrgMemberRoleUpdatedPayload>
  | DomainEvent<OrgMemberRemovedPayload>
  | DomainEvent<TeamCreatedPayload>
  | DomainEvent<TeamMemberAddedPayload>
  | DomainEvent<TeamMemberRemovedPayload>
  | DomainEvent<OrgProjectLinkedPayload>;
