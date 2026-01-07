import { AccountId, EntityId, ModuleKey, WorkspaceId } from '@account-domain/src/types/identifiers';
import { DomainEvent, EventContext, toEventMetadata } from '../events/domain-event';
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

export interface OrganizationTeam {
  teamId: EntityId;
  slug: string;
  displayName: string;
  defaultPermission: 'admin' | 'write' | 'read' | 'none';
  members: Record<AccountId, TeamRole>;
  createdAt: string;
}

export interface OrganizationSnapshot {
  organizationId: EntityId;
  workspaceId: WorkspaceId;
  moduleKey: ModuleKey;
  ownerId: AccountId;
  displayName: string;
  slug: string;
  members: Record<AccountId, OrganizationMemberRole>;
  teams: Record<EntityId, OrganizationTeam>;
  projects: EntityId[];
  stats: { memberCount: number; teamCount: number; projectCount: number };
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationCreationInput {
  organizationId: EntityId;
  workspaceId: WorkspaceId;
  moduleKey: ModuleKey;
  ownerId: AccountId;
  displayName: string;
  slug: string;
  createdAt?: string;
}

export class OrganizationAggregate {
  constructor(private readonly snapshot: OrganizationSnapshot) {}

  static create(input: OrganizationCreationInput, context: EventContext): {
    aggregate: OrganizationAggregate;
    events: DomainEvent<OrganizationCreatedPayload>[];
  } {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const snapshot: OrganizationSnapshot = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      moduleKey: input.moduleKey,
      ownerId: input.ownerId,
      displayName: input.displayName,
      slug: input.slug,
      members: { [input.ownerId]: 'owner' },
      teams: {},
      projects: [],
      stats: { memberCount: 1, teamCount: 0, projectCount: 0 },
      createdAt,
      updatedAt: createdAt,
    };

    const event: DomainEvent<OrganizationCreatedPayload> = {
      eventType: 'OrganizationCreated',
      aggregateId: snapshot.organizationId,
      organizationId: snapshot.organizationId,
      workspaceId: snapshot.workspaceId,
      moduleKey: snapshot.moduleKey,
      accountId: snapshot.ownerId,
      payload: {
        organizationId: snapshot.organizationId,
        workspaceId: snapshot.workspaceId,
        ownerId: snapshot.ownerId,
        displayName: snapshot.displayName,
        slug: snapshot.slug,
        createdAt: snapshot.createdAt,
      },
      metadata: toEventMetadata({ ...context, occurredAt: createdAt }),
    };

    return { aggregate: new OrganizationAggregate(snapshot), events: [event] };
  }

  addMember(accountId: AccountId, role: OrganizationMemberRole, context: EventContext): {
    aggregate: OrganizationAggregate;
    events: DomainEvent<OrgMemberAddedPayload>[];
  } {
    if (this.snapshot.members[accountId]) {
      throw new Error('Member already exists');
    }

    const nextSnapshot: OrganizationSnapshot = {
      ...this.snapshot,
      members: { ...this.snapshot.members, [accountId]: role },
      stats: { ...this.snapshot.stats, memberCount: this.snapshot.stats.memberCount + 1 },
      updatedAt: context.occurredAt ?? new Date().toISOString(),
    };

    const event: DomainEvent<OrgMemberAddedPayload> = {
      eventType: 'OrgMemberAdded',
      aggregateId: this.snapshot.organizationId,
      organizationId: this.snapshot.organizationId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: this.snapshot.moduleKey,
      accountId,
      payload: {
        organizationId: this.snapshot.organizationId,
        accountId,
        role,
        joinedAt: nextSnapshot.updatedAt,
      },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new OrganizationAggregate(nextSnapshot), events: [event] };
  }

  updateMemberRole(accountId: AccountId, role: OrganizationMemberRole, context: EventContext): {
    aggregate: OrganizationAggregate;
    events: DomainEvent<OrgMemberRoleUpdatedPayload>[];
  } {
    if (!this.snapshot.members[accountId]) {
      throw new Error('Member not found');
    }

    if (this.snapshot.members[accountId] === role) {
      throw new Error('Role unchanged');
    }

    if (this.snapshot.ownerId === accountId) {
      throw new Error('Owner role cannot be changed');
    }

    const nextSnapshot: OrganizationSnapshot = {
      ...this.snapshot,
      members: { ...this.snapshot.members, [accountId]: role },
      updatedAt: context.occurredAt ?? new Date().toISOString(),
    };

    const event: DomainEvent<OrgMemberRoleUpdatedPayload> = {
      eventType: 'OrgMemberRoleUpdated',
      aggregateId: this.snapshot.organizationId,
      organizationId: this.snapshot.organizationId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: this.snapshot.moduleKey,
      accountId,
      payload: {
        organizationId: this.snapshot.organizationId,
        accountId,
        role,
        updatedAt: nextSnapshot.updatedAt,
      },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new OrganizationAggregate(nextSnapshot), events: [event] };
  }

  removeMember(accountId: AccountId, context: EventContext): {
    aggregate: OrganizationAggregate;
    events: DomainEvent<OrgMemberRemovedPayload>[];
  } {
    if (!this.snapshot.members[accountId]) {
      throw new Error('Member not found');
    }

    if (accountId === this.snapshot.ownerId) {
      throw new Error('Owner cannot be removed');
    }

    const members = { ...this.snapshot.members };
    delete members[accountId];

    const nextSnapshot: OrganizationSnapshot = {
      ...this.snapshot,
      members,
      stats: { ...this.snapshot.stats, memberCount: Math.max(0, this.snapshot.stats.memberCount - 1) },
      updatedAt: context.occurredAt ?? new Date().toISOString(),
    };

    const event: DomainEvent<OrgMemberRemovedPayload> = {
      eventType: 'OrgMemberRemoved',
      aggregateId: this.snapshot.organizationId,
      organizationId: this.snapshot.organizationId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: this.snapshot.moduleKey,
      accountId,
      payload: {
        organizationId: this.snapshot.organizationId,
        accountId,
        removedAt: nextSnapshot.updatedAt,
      },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new OrganizationAggregate(nextSnapshot), events: [event] };
  }

  createTeam(input: {
    teamId: EntityId;
    slug: string;
    displayName: string;
    defaultPermission?: 'admin' | 'write' | 'read' | 'none';
  }, context: EventContext): { aggregate: OrganizationAggregate; events: DomainEvent<TeamCreatedPayload>[] } {
    if (this.snapshot.teams[input.teamId]) {
      throw new Error('Team already exists');
    }

    const createdAt = context.occurredAt ?? new Date().toISOString();
    const nextTeams: Record<EntityId, OrganizationTeam> = {
      ...this.snapshot.teams,
      [input.teamId]: {
        teamId: input.teamId,
        slug: input.slug,
        displayName: input.displayName,
        defaultPermission: input.defaultPermission ?? 'read',
        members: {},
        createdAt,
      },
    };

    const nextSnapshot: OrganizationSnapshot = {
      ...this.snapshot,
      teams: nextTeams,
      stats: { ...this.snapshot.stats, teamCount: this.snapshot.stats.teamCount + 1 },
      updatedAt: createdAt,
    };

    const event: DomainEvent<TeamCreatedPayload> = {
      eventType: 'TeamCreated',
      aggregateId: this.snapshot.organizationId,
      organizationId: this.snapshot.organizationId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: this.snapshot.moduleKey,
      payload: {
        organizationId: this.snapshot.organizationId,
        teamId: input.teamId,
        slug: input.slug,
        displayName: input.displayName,
        defaultPermission: nextTeams[input.teamId].defaultPermission,
        createdAt,
      },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new OrganizationAggregate(nextSnapshot), events: [event] };
  }

  addTeamMember(teamId: EntityId, accountId: AccountId, role: TeamRole, context: EventContext): {
    aggregate: OrganizationAggregate;
    events: DomainEvent<TeamMemberAddedPayload>[];
  } {
    const team = this.snapshot.teams[teamId];
    if (!team) {
      throw new Error('Team not found');
    }

    if (!this.snapshot.members[accountId]) {
      throw new Error('Member must join organization before joining a team');
    }

    if (team.members[accountId]) {
      throw new Error('Team member already exists');
    }

    const joinedAt = context.occurredAt ?? new Date().toISOString();
    const nextTeams: Record<EntityId, OrganizationTeam> = {
      ...this.snapshot.teams,
      [teamId]: { ...team, members: { ...team.members, [accountId]: role } },
    };

    const nextSnapshot: OrganizationSnapshot = {
      ...this.snapshot,
      teams: nextTeams,
      updatedAt: joinedAt,
    };

    const event: DomainEvent<TeamMemberAddedPayload> = {
      eventType: 'TeamMemberAdded',
      aggregateId: this.snapshot.organizationId,
      organizationId: this.snapshot.organizationId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: this.snapshot.moduleKey,
      accountId,
      payload: {
        organizationId: this.snapshot.organizationId,
        teamId,
        accountId,
        role,
        joinedAt,
      },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new OrganizationAggregate(nextSnapshot), events: [event] };
  }

  removeTeamMember(teamId: EntityId, accountId: AccountId, context: EventContext): {
    aggregate: OrganizationAggregate;
    events: DomainEvent<TeamMemberRemovedPayload>[];
  } {
    const team = this.snapshot.teams[teamId];
    if (!team || !team.members[accountId]) {
      throw new Error('Team member not found');
    }

    const members = { ...team.members };
    delete members[accountId];

    const removedAt = context.occurredAt ?? new Date().toISOString();
    const nextTeams: Record<EntityId, OrganizationTeam> = {
      ...this.snapshot.teams,
      [teamId]: { ...team, members },
    };

    const nextSnapshot: OrganizationSnapshot = { ...this.snapshot, teams: nextTeams, updatedAt: removedAt };

    const event: DomainEvent<TeamMemberRemovedPayload> = {
      eventType: 'TeamMemberRemoved',
      aggregateId: this.snapshot.organizationId,
      organizationId: this.snapshot.organizationId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: this.snapshot.moduleKey,
      accountId,
      payload: {
        organizationId: this.snapshot.organizationId,
        teamId,
        accountId,
        removedAt,
      },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new OrganizationAggregate(nextSnapshot), events: [event] };
  }

  linkProject(projectId: EntityId, context: EventContext): {
    aggregate: OrganizationAggregate;
    events: DomainEvent<OrgProjectLinkedPayload>[];
  } {
    if (this.snapshot.projects.includes(projectId)) {
      throw new Error('Project already linked');
    }

    const linkedAt = context.occurredAt ?? new Date().toISOString();
    const nextSnapshot: OrganizationSnapshot = {
      ...this.snapshot,
      projects: [...this.snapshot.projects, projectId],
      stats: { ...this.snapshot.stats, projectCount: this.snapshot.stats.projectCount + 1 },
      updatedAt: linkedAt,
    };

    const event: DomainEvent<OrgProjectLinkedPayload> = {
      eventType: 'OrgProjectLinked',
      aggregateId: this.snapshot.organizationId,
      organizationId: this.snapshot.organizationId,
      workspaceId: this.snapshot.workspaceId,
      moduleKey: this.snapshot.moduleKey,
      payload: {
        organizationId: this.snapshot.organizationId,
        projectId,
        linkedAt,
      },
      metadata: toEventMetadata(context),
    };

    return { aggregate: new OrganizationAggregate(nextSnapshot), events: [event] };
  }

  static fromEvents(events: DomainEvent<unknown>[], fallbackContext?: { workspaceId: WorkspaceId; moduleKey: ModuleKey }): OrganizationAggregate {
    const sortedEvents = [...events].sort((a, b) => a.metadata.occurredAt.localeCompare(b.metadata.occurredAt));
    const created = sortedEvents.find((e) => e.eventType === 'OrganizationCreated');

    if (!created || !('payload' in created)) {
      throw new Error('OrganizationCreated event required to rebuild aggregate');
    }

    const base: OrganizationSnapshot = {
      organizationId: created.aggregateId,
      workspaceId: (created as DomainEvent<OrganizationCreatedPayload>).payload.workspaceId ?? fallbackContext?.workspaceId ?? '',
      moduleKey: created.moduleKey ?? fallbackContext?.moduleKey ?? 'organization',
      ownerId: (created as DomainEvent<OrganizationCreatedPayload>).payload.ownerId,
      displayName: (created as DomainEvent<OrganizationCreatedPayload>).payload.displayName,
      slug: (created as DomainEvent<OrganizationCreatedPayload>).payload.slug,
      members: {},
      teams: {},
      projects: [],
      stats: { memberCount: 0, teamCount: 0, projectCount: 0 },
      createdAt: (created as DomainEvent<OrganizationCreatedPayload>).payload.createdAt,
      updatedAt: (created as DomainEvent<OrganizationCreatedPayload>).payload.createdAt,
    };

    let aggregate = new OrganizationAggregate(base);
    sortedEvents.forEach((event) => {
      aggregate = aggregate.apply(event);
    });

    return aggregate;
  }

  private apply(event: DomainEvent<unknown>): OrganizationAggregate {
    switch (event.eventType) {
      case 'OrganizationCreated': {
        const payload = event.payload as OrganizationCreatedPayload;
        return new OrganizationAggregate({
          organizationId: payload.organizationId,
          workspaceId: payload.workspaceId,
          moduleKey: event.moduleKey,
          ownerId: payload.ownerId,
          displayName: payload.displayName,
          slug: payload.slug,
          members: { [payload.ownerId]: 'owner' },
          teams: {},
          projects: [],
          stats: { memberCount: 1, teamCount: 0, projectCount: 0 },
          createdAt: payload.createdAt,
          updatedAt: payload.createdAt,
        });
      }
      case 'OrgMemberAdded': {
        const payload = event.payload as OrgMemberAddedPayload;
        const members = { ...this.snapshot.members, [payload.accountId]: payload.role };
        return new OrganizationAggregate({
          ...this.snapshot,
          members,
          stats: { ...this.snapshot.stats, memberCount: Object.keys(members).length },
          updatedAt: payload.joinedAt,
        });
      }
      case 'OrgMemberRoleUpdated': {
        const payload = event.payload as OrgMemberRoleUpdatedPayload;
        return new OrganizationAggregate({
          ...this.snapshot,
          members: { ...this.snapshot.members, [payload.accountId]: payload.role },
          updatedAt: payload.updatedAt,
        });
      }
      case 'OrgMemberRemoved': {
        const payload = event.payload as OrgMemberRemovedPayload;
        const members = { ...this.snapshot.members };
        delete members[payload.accountId];
        return new OrganizationAggregate({
          ...this.snapshot,
          members,
          stats: { ...this.snapshot.stats, memberCount: Object.keys(members).length },
          updatedAt: payload.removedAt,
        });
      }
      case 'TeamCreated': {
        const payload = event.payload as TeamCreatedPayload;
        const teams: Record<EntityId, OrganizationTeam> = {
          ...this.snapshot.teams,
          [payload.teamId]: {
            teamId: payload.teamId,
            slug: payload.slug,
            displayName: payload.displayName,
            defaultPermission: payload.defaultPermission,
            members: {},
            createdAt: payload.createdAt,
          },
        };
        return new OrganizationAggregate({
          ...this.snapshot,
          teams,
          stats: { ...this.snapshot.stats, teamCount: Object.keys(teams).length },
          updatedAt: payload.createdAt,
        });
      }
      case 'TeamMemberAdded': {
        const payload = event.payload as TeamMemberAddedPayload;
        const team = this.snapshot.teams[payload.teamId];
        const members = { ...team.members, [payload.accountId]: payload.role };
        const teams: Record<EntityId, OrganizationTeam> = {
          ...this.snapshot.teams,
          [payload.teamId]: { ...team, members },
        };
        return new OrganizationAggregate({ ...this.snapshot, teams, updatedAt: payload.joinedAt });
      }
      case 'TeamMemberRemoved': {
        const payload = event.payload as TeamMemberRemovedPayload;
        const team = this.snapshot.teams[payload.teamId];
        const members = { ...team.members };
        delete members[payload.accountId];
        const teams: Record<EntityId, OrganizationTeam> = {
          ...this.snapshot.teams,
          [payload.teamId]: { ...team, members },
        };
        return new OrganizationAggregate({ ...this.snapshot, teams, updatedAt: payload.removedAt });
      }
      case 'OrgProjectLinked': {
        const payload = event.payload as OrgProjectLinkedPayload;
        const projects = [...this.snapshot.projects, payload.projectId];
        return new OrganizationAggregate({
          ...this.snapshot,
          projects,
          stats: { ...this.snapshot.stats, projectCount: projects.length },
          updatedAt: payload.linkedAt,
        });
      }
      default:
        return this;
    }
  }

  get state(): OrganizationSnapshot {
    return this.snapshot;
  }
}
