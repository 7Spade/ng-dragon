import { AccountId, EntityId } from '@account-domain/src/types/identifiers';
import { DomainEvent } from '../events/domain-event';
import {
  OrgMemberAddedPayload,
  OrgMemberRemovedPayload,
  OrgMemberRoleUpdatedPayload,
  OrgProjectLinkedPayload,
  OrganizationCreatedPayload,
  TeamCreatedPayload,
  TeamMemberAddedPayload,
  TeamMemberRemovedPayload,
} from '../events/organization-events';
import { OrganizationMemberRole, TeamRole } from '../value-objects/organization-roles';

export interface OrganizationDoc {
  organizationId: EntityId;
  workspaceId: string;
  displayName: string;
  slug: string;
  ownerId: AccountId;
  stats: { memberCount: number; teamCount: number; projectCount: number };
  createdAt: string;
  updatedAt: string;
}

export interface OrgMemberDoc {
  organizationId: EntityId;
  accountId: AccountId;
  role: OrganizationMemberRole;
  joinedAt: string;
}

export interface TeamMemberDoc {
  accountId: AccountId;
  role: TeamRole;
  joinedAt: string;
}

export interface TeamDoc {
  organizationId: EntityId;
  teamId: EntityId;
  slug: string;
  displayName: string;
  defaultPermission: 'admin' | 'write' | 'read' | 'none';
  memberCount: number;
  members: TeamMemberDoc[];
  createdAt: string;
}

export interface AccountDenormalization {
  organizationMemberships: Record<EntityId, OrganizationMemberRole>;
  teamMemberships: Record<EntityId, { teamId: EntityId; organizationId: EntityId; role: TeamRole }[]>;
  projectPermissions: Record<EntityId, string>;
}

export interface OrganizationProjectionState {
  organizations: Map<EntityId, OrganizationDoc>;
  members: Map<string, OrgMemberDoc>;
  teams: Map<EntityId, TeamDoc>;
  accountIndex: Map<AccountId, AccountDenormalization>;
}

export function createEmptyProjectionState(): OrganizationProjectionState {
  return {
    organizations: new Map<EntityId, OrganizationDoc>(),
    members: new Map<string, OrgMemberDoc>(),
    teams: new Map<EntityId, TeamDoc>(),
    accountIndex: new Map<AccountId, AccountDenormalization>(),
  };
}

function ensureAccountIndex(state: OrganizationProjectionState, accountId: AccountId): AccountDenormalization {
  const current = state.accountIndex.get(accountId);
  if (current) {
    return current;
  }

  const created: AccountDenormalization = {
    organizationMemberships: {},
    teamMemberships: {},
    projectPermissions: {},
  };
  state.accountIndex.set(accountId, created);
  return created;
}

function memberKey(orgId: EntityId, accountId: AccountId): string {
  return `${orgId}:${accountId}`;
}

export function projectOrganizationEvent(event: DomainEvent<unknown>, state: OrganizationProjectionState): OrganizationProjectionState {
  switch (event.eventType) {
    case 'OrganizationCreated': {
      const payload = event.payload as OrganizationCreatedPayload;
      state.organizations.set(payload.organizationId, {
        organizationId: payload.organizationId,
        workspaceId: payload.workspaceId,
        displayName: payload.displayName,
        slug: payload.slug,
        ownerId: payload.ownerId,
        stats: { memberCount: 1, teamCount: 0, projectCount: 0 },
        createdAt: payload.createdAt,
        updatedAt: payload.createdAt,
      });

      const ownerIndex = ensureAccountIndex(state, payload.ownerId);
      ownerIndex.organizationMemberships[payload.organizationId] = 'owner';
      state.members.set(memberKey(payload.organizationId, payload.ownerId), {
        organizationId: payload.organizationId,
        accountId: payload.ownerId,
        role: 'owner',
        joinedAt: payload.createdAt,
      });
      return state;
    }
    case 'OrgMemberAdded': {
      const payload = event.payload as OrgMemberAddedPayload;
      const org = state.organizations.get(payload.organizationId);
      if (org) {
        org.stats.memberCount += 1;
        org.updatedAt = payload.joinedAt;
      }
      const memberDoc: OrgMemberDoc = {
        organizationId: payload.organizationId,
        accountId: payload.accountId,
        role: payload.role,
        joinedAt: payload.joinedAt,
      };
      state.members.set(memberKey(payload.organizationId, payload.accountId), memberDoc);
      ensureAccountIndex(state, payload.accountId).organizationMemberships[payload.organizationId] = payload.role;
      return state;
    }
    case 'OrgMemberRoleUpdated': {
      const payload = event.payload as OrgMemberRoleUpdatedPayload;
      const existing = state.members.get(memberKey(payload.organizationId, payload.accountId));
      if (existing) {
        existing.role = payload.role;
      }
      const org = state.organizations.get(payload.organizationId);
      if (org) {
        org.updatedAt = payload.updatedAt;
      }
      ensureAccountIndex(state, payload.accountId).organizationMemberships[payload.organizationId] = payload.role;
      return state;
    }
    case 'OrgMemberRemoved': {
      const payload = event.payload as OrgMemberRemovedPayload;
      const org = state.organizations.get(payload.organizationId);
      if (org && org.stats.memberCount > 0) {
        org.stats.memberCount -= 1;
        org.updatedAt = payload.removedAt;
      }
      state.members.delete(memberKey(payload.organizationId, payload.accountId));
      const accountIndex = ensureAccountIndex(state, payload.accountId);
      delete accountIndex.organizationMemberships[payload.organizationId];
      return state;
    }
    case 'TeamCreated': {
      const payload = event.payload as TeamCreatedPayload;
      state.teams.set(payload.teamId, {
        organizationId: payload.organizationId,
        teamId: payload.teamId,
        slug: payload.slug,
        displayName: payload.displayName,
        defaultPermission: payload.defaultPermission,
        memberCount: 0,
        members: [],
        createdAt: payload.createdAt,
      });
      const org = state.organizations.get(payload.organizationId);
      if (org) {
        org.stats.teamCount += 1;
        org.updatedAt = payload.createdAt;
      }
      return state;
    }
    case 'TeamMemberAdded': {
      const payload = event.payload as TeamMemberAddedPayload;
      const team = state.teams.get(payload.teamId);
      if (team) {
        team.members = [...team.members, { accountId: payload.accountId, role: payload.role, joinedAt: payload.joinedAt }];
        team.memberCount = team.members.length;
      }
      const org = state.organizations.get(payload.organizationId);
      if (org) {
        org.updatedAt = payload.joinedAt;
      }
      const index = ensureAccountIndex(state, payload.accountId);
      const orgTeams = index.teamMemberships[payload.organizationId] ?? [];
      index.teamMemberships[payload.organizationId] = [...orgTeams, { teamId: payload.teamId, organizationId: payload.organizationId, role: payload.role }];
      return state;
    }
    case 'TeamMemberRemoved': {
      const payload = event.payload as TeamMemberRemovedPayload;
      const team = state.teams.get(payload.teamId);
      if (team) {
        team.members = team.members.filter((m) => m.accountId !== payload.accountId);
        team.memberCount = team.members.length;
      }
      const org = state.organizations.get(payload.organizationId);
      if (org) {
        org.updatedAt = payload.removedAt;
      }
      const index = ensureAccountIndex(state, payload.accountId);
      const orgTeams = index.teamMemberships[payload.organizationId] ?? [];
      index.teamMemberships[payload.organizationId] = orgTeams.filter((membership) => membership.teamId !== payload.teamId);
      return state;
    }
    case 'OrgProjectLinked': {
      const payload = event.payload as OrgProjectLinkedPayload;
      const org = state.organizations.get(payload.organizationId);
      if (org) {
        org.stats.projectCount += 1;
        org.updatedAt = payload.linkedAt;
      }
      state.accountIndex.forEach((denorm) => {
        if (denorm.organizationMemberships[payload.organizationId]) {
          denorm.projectPermissions[payload.projectId] = denorm.organizationMemberships[payload.organizationId];
        }
      });
      return state;
    }
    default:
      return state;
  }
}

export function projectOrganizationEvents(events: DomainEvent<unknown>[]): OrganizationProjectionState {
  return events.reduce((state, event) => projectOrganizationEvent(event, state), createEmptyProjectionState());
}
