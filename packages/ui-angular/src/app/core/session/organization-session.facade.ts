import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService, ACLType } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { WorkspaceApplicationService } from '@core-engine/src/use-cases/workspace.application-service';
import { CreateOrganizationCommand } from '@core-engine/src/commands/create-organization.command';
import { InMemoryWorkspaceRepository } from './in-memory-workspace.repository';

interface OrganizationSummary {
  id: string;
  name: string;
  role: OrganizationMemberRole;
}

export type OrganizationMemberRole = 'owner' | 'admin' | 'member';

interface PermissionCache {
  role: OrganizationMemberRole | 'guest';
  abilities: Record<string, boolean>;
}

@Injectable({ providedIn: 'root' })
export class OrganizationSessionFacade {
  private readonly router = inject(Router);
  private readonly acl = inject(ACLService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly workspaceRepo = inject(InMemoryWorkspaceRepository);
  private readonly workspaceApp = new WorkspaceApplicationService(this.workspaceRepo);
  private readonly readyPromise: Promise<void>;

  private readonly workspaces = signal<WorkspaceSnapshot[]>([]);
  private readonly membershipIndex = new Map<string, OrganizationMemberRole>();
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
    this.readyPromise = this.init();
  }

  async whenReady(): Promise<void> {
    return this.readyPromise;
  }

  private async init(): Promise<void> {
    await this.refreshFromRepo();
    await this.seedDefaults();
  }

  private currentAccountId(): string {
    const token = this.tokenService.get();
    return (token && (token.uid as string)) || 'anonymous-account';
  }

  private mapMembership(role: OrganizationMemberRole): OrganizationSummary[] {
    const accountId = this.currentAccountId();
    return this.workspaces()
      .map((ws) => {
        const memberRole = this.membershipIndex.get(`${accountId}:${ws.workspaceId}`);
        return memberRole === role
          ? {
              id: ws.workspaceId,
              name: ws.displayName,
              role: memberRole,
            }
          : null;
      })
      .filter((entry): entry is OrganizationSummary => entry !== null);
  }

  async selectOrganization(workspaceId: string): Promise<void> {
    const exists = this.workspaces().some((ws) => ws.workspaceId === workspaceId);
    if (!exists) return;

    this.selectedOrganizationId.set(workspaceId);
    this.applyPermissionCache(workspaceId);
    await this.router.navigate(['/workspaces', workspaceId]).catch(() => void 0);
  }

  async createOrganization(displayName: string): Promise<void> {
    const command: CreateOrganizationCommand = {
      accountId: this.currentAccountId(),
      displayName,
    };
    const snapshot = await this.workspaceApp.createOrganization(command);
    this.membershipIndex.set(`${command.accountId}:${snapshot.workspaceId}`, 'owner');
    await this.refreshFromRepo();
    this.selectedOrganizationId.set(snapshot.workspaceId);
    this.applyPermissionCache(snapshot.workspaceId);
    await this.router.navigate(['/workspaces', snapshot.workspaceId]).catch(() => void 0);
  }

  async createTeam(): Promise<void> {
    const orgId = this.selectedOrganizationId();
    if (!orgId) return;
    // Placeholder navigation for team creation within workspace context
    await this.router.navigate(['/workspaces', orgId, 'teams', 'create']).catch(() => void 0);
  }

  canCreateTeam(): boolean {
    return this.permissionCache().abilities.canCreateTeam ?? false;
  }

  async invitePartner(): Promise<void> {
    const orgId = this.selectedOrganizationId();
    if (!orgId) return;
    await this.router.navigate(['/workspaces', orgId, 'partners', 'create']).catch(() => void 0);
  }

  async createPartner(): Promise<void> {
    await this.invitePartner();
  }

  async logout(): Promise<void> {
    this.tokenService.clear();
    await this.router.navigateByUrl(this.tokenService.login_url!);
  }

  getWorkspaceName(workspaceId: string | null): string | null {
    if (!workspaceId) return null;
    const found = this.workspaces().find(ws => ws.workspaceId === workspaceId);
    return found?.displayName ?? null;
  }

  isMember(workspaceId: string | null): boolean {
    if (!workspaceId) return false;
    const accountId = this.currentAccountId();
    return this.membershipIndex.has(`${accountId}:${workspaceId}`);
  }

  private async refreshFromRepo(): Promise<void> {
    const list = await this.workspaceRepo.list();
    this.workspaces.set(list);
    this.applyPermissionCache(this.selectedOrganizationId());
  }

  private applyPermissionCache(workspaceId: string | null): void {
    const accountId = this.currentAccountId();
    const role: OrganizationMemberRole | 'guest' = workspaceId
      ? this.membershipIndex.get(`${accountId}:${workspaceId}`) ?? 'guest'
      : 'guest';
    const abilities: Record<string, boolean> = {
      canCreateTeam: role === 'owner' || role === 'admin',
      canInviteMember: role === 'owner' || role === 'admin',
    };
    this.permissionCache.set({ role, abilities });
    const aclPayload: ACLType = { role: role === 'guest' ? [] : [role], ability: [] };
    aclPayload.ability = Object.keys(abilities).filter((key) => abilities[key]);
    this.acl.set(aclPayload);
  }

  private async seedDefaults(): Promise<void> {
    if (this.workspaces().length) return;
    const actorId = this.currentAccountId();
    const owned = await this.workspaceApp.createOrganization({ accountId: actorId, displayName: 'Owned Org' });
    this.membershipIndex.set(`${actorId}:${owned.workspaceId}`, 'owner');

    const joined = await this.workspaceApp.createOrganization({ accountId: 'another-owner', displayName: 'Joined Org' });
    this.membershipIndex.set(`${actorId}:${joined.workspaceId}`, 'member');

    await this.refreshFromRepo();
    this.selectedOrganizationId.set(owned.workspaceId);
    this.applyPermissionCache(owned.workspaceId);
  }
}
