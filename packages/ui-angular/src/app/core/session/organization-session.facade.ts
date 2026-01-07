import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService, ACLType } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import {
  InMemoryOrganizationEventStore,
  OrganizationAggregate,
  OrganizationCreationInput,
  OrganizationMemberRole,
  OrganizationProjectionState,
  createEmptyProjectionState,
  projectOrganizationEvents,
} from '@saas-domain';
import { canManageOrganization } from '@saas-domain';

interface OrganizationSummary {
  id: string;
  name: string;
  role: OrganizationMemberRole;
}

interface PermissionCache {
  role: OrganizationMemberRole | 'guest';
  abilities: Record<string, boolean>;
}

@Injectable({ providedIn: 'root' })
export class OrganizationSessionFacade {
  private readonly router = inject(Router);
  private readonly acl = inject(ACLService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly eventStore = new InMemoryOrganizationEventStore();

  private readonly projectionState = signal<OrganizationProjectionState>(createEmptyProjectionState());
  private readonly selectedOrganizationId = signal<string | null>(null);
  private readonly permissionCache = signal<PermissionCache>({ role: 'guest', abilities: {} });

  readonly ownedOrganizations = computed<OrganizationSummary[]>(() => this.mapMembership('owner'));
  readonly joinedOrganizations = computed<OrganizationSummary[]>(() =>
    this.mapMembership('member').concat(this.mapMembership('admin'))
  );
  readonly selectedOrganizationName = computed<string | null>(() => {
    const all = [...this.ownedOrganizations(), ...this.joinedOrganizations()];
    const found = all.find((org) => org.id === this.selectedOrganizationId());
    return found?.name ?? null;
  });
  readonly activeOrganizationId = computed<string | null>(() => this.selectedOrganizationId());
  readonly permissions = computed<PermissionCache>(() => this.permissionCache());

  constructor() {
    this.seedDefaultOrganizations();
  }

  private currentAccountId(): string {
    const token = this.tokenService.get();
    return (token && (token.uid as string)) || 'anonymous-account';
  }

  private currentWorkspaceId(): string {
    return 'workspace-default';
  }

  private mapMembership(role: OrganizationMemberRole): OrganizationSummary[] {
    const accountId = this.currentAccountId();
    const projections = this.projectionState();
    return Array.from(projections.organizations.values())
      .map((org) => {
        const membership = projections.accountIndex.get(accountId)?.organizationMemberships[org.organizationId];
        return membership && membership === role
          ? { id: org.organizationId, name: org.displayName, role: membership }
          : null;
      })
      .filter((entry): entry is OrganizationSummary => entry !== null);
  }

  async selectOrganization(organizationId: string): Promise<void> {
    const all = [...this.ownedOrganizations(), ...this.joinedOrganizations()];
    if (!all.some((org) => org.id === organizationId)) {
      return;
    }

    this.selectedOrganizationId.set(organizationId);
    this.applyPermissionCache(organizationId);
    await this.router.navigateByUrl(`/organizations/${organizationId}`).catch(() => void 0);
  }

  async createOrganization(): Promise<void> {
    const input: OrganizationCreationInput = {
      organizationId: this.generateId('org'),
      workspaceId: this.currentWorkspaceId(),
      moduleKey: 'organization',
      ownerId: this.currentAccountId(),
      displayName: 'New Organization',
      slug: `org-${Date.now()}`,
    };
    const context = {
      actorId: this.currentAccountId(),
      workspaceId: input.workspaceId,
      moduleKey: input.moduleKey,
      traceId: this.generateId('trace'),
    };
    const { events } = OrganizationAggregate.create(input, context);
    await this.eventStore.appendMany(events);
    await this.refreshProjections();
    this.selectedOrganizationId.set(input.organizationId);
    this.applyPermissionCache(input.organizationId);
    await this.router.navigateByUrl(`/organizations/${input.organizationId}`).catch(() => void 0);
  }

  async createTeam(): Promise<void> {
    const orgId = this.selectedOrganizationId();
    if (!orgId) {
      return;
    }

    const role = this.permissionCache().role;
    if (!canManageOrganization(role === 'guest' ? undefined : role)) {
      return;
    }

    const events = await this.eventStore.load(orgId);
    const aggregate = OrganizationAggregate.fromEvents(events, {
      workspaceId: this.currentWorkspaceId(),
      moduleKey: 'organization',
    });
    const { events: teamEvents } = aggregate.createTeam(
      {
        teamId: this.generateId('team'),
        slug: `team-${Date.now()}`,
        displayName: 'New Team',
        defaultPermission: 'write',
      },
      { actorId: this.currentAccountId(), moduleKey: 'organization', workspaceId: this.currentWorkspaceId() }
    );
    await this.eventStore.appendMany(teamEvents);
    await this.refreshProjections();
  }

  canCreateTeam(): boolean {
    return this.permissionCache().abilities.canCreateTeam ?? false;
  }

  async invitePartner(): Promise<void> {
    const orgId = this.selectedOrganizationId();
    if (!orgId) return;
    await this.router.navigateByUrl(`/organizations/${orgId}/partners/create`).catch(() => void 0);
  }

  async createPartner(): Promise<void> {
    await this.invitePartner();
  }

  async logout(): Promise<void> {
    this.tokenService.clear();
    await this.router.navigateByUrl(this.tokenService.login_url!);
  }

  isMember(organizationId: string | null): boolean {
    if (!organizationId) {
      return false;
    }
    const index = this.projectionState().accountIndex.get(this.currentAccountId());
    return Boolean(index?.organizationMemberships[organizationId]);
  }

  private async refreshProjections(): Promise<void> {
    const events = await this.eventStore.listAll();
    const projected = projectOrganizationEvents(events);
    this.projectionState.set(projected);
    this.applyPermissionCache(this.selectedOrganizationId());
  }

  private applyPermissionCache(organizationId: string | null): void {
    const accountId = this.currentAccountId();
    const index = organizationId ? this.projectionState().accountIndex.get(accountId) : undefined;
    const role = (index?.organizationMemberships[organizationId ?? ''] as OrganizationMemberRole | undefined) ?? 'guest';
    const abilities: Record<string, boolean> = {
      canCreateTeam: canManageOrganization(role === 'guest' ? undefined : role),
      canInviteMember: canManageOrganization(role === 'guest' ? undefined : role),
    };
    this.permissionCache.set({ role, abilities });
    const aclPayload: ACLType = { role: role === 'guest' ? [] : [role], ability: [] };
    aclPayload.ability = Object.keys(abilities).filter((key) => abilities[key]);
    this.acl.set(aclPayload);
  }

  private seedDefaultOrganizations(): void {
    const actorId = this.currentAccountId();
    const workspaceId = this.currentWorkspaceId();
    const context = { actorId, workspaceId, moduleKey: 'organization' as const };

    const { aggregate: ownedAggregate, events: ownedEvents } = OrganizationAggregate.create(
      {
        organizationId: 'org-owned',
        workspaceId,
        moduleKey: 'organization',
        ownerId: actorId,
        displayName: 'Owned Org',
        slug: 'owned-org',
      },
      context
    );

    const memberOrg = OrganizationAggregate.create(
      {
        organizationId: 'org-joined',
        workspaceId,
        moduleKey: 'organization',
        ownerId: 'another-owner',
        displayName: 'Joined Org',
        slug: 'joined-org',
      },
      context
    );

    const { events: joinEvents } = memberOrg.aggregate.addMember(actorId, 'member', context);

    void this.eventStore.appendMany([...ownedEvents, ...memberOrg.events, ...joinEvents]);
    this.projectionState.set(projectOrganizationEvents([...ownedEvents, ...memberOrg.events, ...joinEvents]));
    this.selectedOrganizationId.set(ownedAggregate.state.organizationId);
    this.applyPermissionCache(ownedAggregate.state.organizationId);
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  }
}
