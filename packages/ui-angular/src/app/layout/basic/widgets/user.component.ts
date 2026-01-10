import { ChangeDetectionStrategy, Component, Input, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FirebaseAuthBridgeService } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { I18nPipe, MenuService, SettingsService, User } from '@delon/theme';
import { WorkspaceService, WorkspaceView } from '@platform-adapters';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'header-user',
  template: `
    @if (layout === 'header') {
      <div class="alain-default__nav-item d-flex align-items-center px-sm">
        <nz-avatar [nzSrc]="contextAvatar()" nzSize="small" class="mr-sm" />
        {{ contextDisplayName() }}
      </div>
    } @else {
      <div class="alain-default__aside-user" nz-dropdown [nzDropdownMenu]="userMenu" nzTrigger="click" nzPlacement="bottomLeft">
        <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="contextAvatar()" />
        <div class="alain-default__aside-user-info">
          <strong>{{ contextDisplayName() }}</strong>
          <p class="mb0">{{ contextSubline() }}</p>
        </div>
      </div>
    }
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-lg">
        <div class="px-sm py-sm text-muted">{{ 'menu.account.workspaces' | i18n: 'Workspaces' }}</div>

        <div class="px-sm text-muted">{{ 'menu.account.organizations.owned' | i18n: 'Owned' }}</div>
        @if (ownedOrganizations().length) {
          @for (org of ownedOrganizations(); track org.id) {
            <div nz-menu-item [nzSelected]="isActiveWorkspace(org.id)" (click)="selectWorkspace(org)">
              <i nz-icon nzType="crown" class="mr-sm"></i>{{ org.name }}
              <span class="text-muted small ml-sm">({{ typeLabel(org.workspaceType) }})</span>
            </div>
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.organizations.noneOwned' | i18n: 'No owned organizations' }}</div>
        }

        <li nz-menu-divider></li>

        <div class="px-sm text-muted">{{ 'menu.account.organizations.joined' | i18n: 'Joined' }}</div>
        @if (joinedOrganizations().length) {
          @for (org of joinedOrganizations(); track org.id) {
            <div nz-menu-item [nzSelected]="isActiveWorkspace(org.id)" (click)="selectWorkspace(org)">
              <i nz-icon nzType="team" class="mr-sm"></i>{{ org.name }}
              <span class="text-muted small ml-sm">({{ typeLabel(org.workspaceType) }})</span>
            </div>
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.organizations.noneJoined' | i18n: 'No joined organizations' }}</div>
        }

        <li nz-menu-divider></li>

        <div class="px-sm text-muted">{{ 'menu.account.workspaces.teams' | i18n: 'Teams' }}</div>
        @if (teamWorkspaces().length) {
          @for (team of teamWorkspaces(); track team.id) {
            <div nz-menu-item [nzSelected]="isActiveWorkspace(team.id)" (click)="selectWorkspace(team)">
              <i nz-icon nzType="apartment" class="mr-sm"></i>{{ team.name }}
            </div>
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.workspaces.noneTeams' | i18n: 'No teams' }}</div>
        }

        <li nz-menu-divider></li>

        <div class="px-sm text-muted">{{ 'menu.account.workspaces.partners' | i18n: 'Partners' }}</div>
        @if (partnerWorkspaces().length) {
          @for (partner of partnerWorkspaces(); track partner.id) {
            <div nz-menu-item [nzSelected]="isActiveWorkspace(partner.id)" (click)="selectWorkspace(partner)">
              <i nz-icon nzType="user-add" class="mr-sm"></i>{{ partner.name }}
            </div>
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.workspaces.nonePartners' | i18n: 'No partners' }}</div>
        }

        <li nz-menu-divider></li>

        <div class="px-sm text-muted">{{ 'menu.account.workspaces.personal' | i18n: 'Personal' }}</div>
        @if (personalWorkspaces().length) {
          @for (personal of personalWorkspaces(); track personal.id) {
            <div nz-menu-item [nzSelected]="isActiveWorkspace(personal.id)" (click)="selectWorkspace(personal)">
              <i nz-icon nzType="user" class="mr-sm"></i>{{ personal.name }}
            </div>
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.workspaces.nonePersonal' | i18n: 'No personal workspace' }}</div>
        }

        <li nz-menu-divider></li>

        <div nz-menu-item (click)="createOrganization()">
          <i nz-icon nzType="plus" class="mr-sm"></i>{{ 'menu.account.organizations.create' | i18n: 'Create organization' }}
        </div>

        @if (canManageActiveOrganization()) {
          <div nz-menu-item (click)="createTeam()">
            <i nz-icon nzType="team" class="mr-sm"></i>{{ 'menu.account.organizations.createTeam' | i18n: 'Create team' }}
          </div>
          <div nz-menu-item (click)="createPartner()">
            <i nz-icon nzType="user-add" class="mr-sm"></i>{{ 'menu.account.organizations.createPartner' | i18n: 'Create partner' }}
          </div>
        }
        <div nz-menu-item (click)="createProject()">
          <i nz-icon nzType="appstore-add" class="mr-sm"></i>{{ 'menu.account.organizations.createProject' | i18n: 'Create project' }}
        </div>

        <li nz-menu-divider></li>

        <!-- Logout -->
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'menu.account.logout' | i18n }}
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule]
})
export class HeaderUserComponent {
  @Input() layout: 'header' | 'aside' = 'aside';

  private readonly settings = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly menuService = inject(MenuService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);

  private readonly workspaces$: Observable<WorkspaceView[]> = combineLatest([
    this.workspaceService.getUserWorkspaces(),
    this.workspaceService.getUserWorkspacesIncludingMemberships()
  ]).pipe(
    map(([owned, member]) => {
      const organizations = new Map<string, WorkspaceView>();

      const processWorkspace = (ws: WorkspaceView): void => {
        if (organizations.has(ws.id)) return;
        organizations.set(ws.id, ws);
      };

      owned.forEach(processWorkspace);
      member.forEach(processWorkspace);

      return Array.from(organizations.values());
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly workspaces = toSignal(this.workspaces$, { initialValue: [] as WorkspaceView[] });
  private readonly personalFallback = computed<WorkspaceView | null>(() => {
    const personals = this.workspaces().filter(ws => ws.workspaceType === 'personal');
    if (personals.length) return null;
    const uid = this.currentUserId();
    if (!uid) return null;
    return {
      id: `personal-${uid}`,
      workspaceId: `personal-${uid}`,
      accountId: uid,
      ownerAccountId: uid,
      workspaceType: 'personal',
      modules: [],
      createdAt: new Date().toISOString(),
      name: 'Personal',
      members: []
    };
  });
  private readonly availableWorkspaces = computed<WorkspaceView[]>(() => {
    const list = [...this.workspaces()];
    const fallback = this.personalFallback();
    if (fallback && !list.find(ws => ws.id === fallback.id)) {
      list.push(fallback);
    }
    return list;
  });
  readonly currentUserId = signal<string | null>(this.authBridge.getCurrentUser()?.uid ?? null);

  private readonly storedWorkspaceId = signal<string | null>(this.loadStoredWorkspaceId());
  readonly activeWorkspaceId = signal<string | null>(this.storedWorkspaceId());
  private readonly activeWorkspace = computed(() =>
    this.availableWorkspaces().find(ws => ws.id === this.activeWorkspaceId()) ?? null
  );
  readonly activeWorkspaceName = computed(() => {
    const ws = this.activeWorkspace();
    if (!ws) return null;
    if (ws.workspaceType === 'personal') return this.settings.user.name;
    return ws.name ?? null;
  });
  readonly activeWorkspaceType = computed(() => this.activeWorkspace()?.workspaceType ?? null);
  readonly contextDisplayName = computed(() => this.activeWorkspaceName() ?? this.settings.user.name);
  readonly contextSubline = computed(() => {
    const ws = this.activeWorkspace();
    if (ws?.workspaceType === 'personal') return this.settings.user.email;
    const type = ws?.workspaceType;
    return type ? this.typeLabel(type) : this.settings.user.email;
  });
  readonly contextAvatar = computed(() => {
    const id = this.activeWorkspaceId();
    if (!id) return this.settings.user.avatar;
    return this.workspaceAvatarById(id);
  });

  constructor() {
    this.authBridge
      .waitForAuthState()
      .then(user => this.currentUserId.set(user?.uid ?? null))
      .catch(() => this.currentUserId.set(null));

    effect(() => {
       const list = this.availableWorkspaces();
       if (!list.length) return;

      const storedId = this.storedWorkspaceId();
      const stored = storedId ? list.find(ws => ws.id === storedId) : null;
      const fallback = stored ?? this.pickDefaultWorkspace(list);

      if (!fallback) return;
      if (this.activeWorkspaceId() !== fallback.id) {
        this.setActiveWorkspace(fallback, false);
      } else {
        this.applyWorkspaceContext(fallback, false);
      }
    });
  }

  private readonly workspacePartitions = computed(() => {
    const uid = this.currentUserId();
    const membership = new Set<string>();
    const owned: WorkspaceView[] = [];
    const joined: WorkspaceView[] = [];

    if (!uid) return { owned, joined, membership };

    for (const ws of this.availableWorkspaces()) {
      if (ws.ownerAccountId === uid) {
        owned.push(ws);
        membership.add(ws.id);
        continue;
      }

      if (ws.members?.some(m => m.accountId === uid)) {
        joined.push(ws);
        membership.add(ws.id);
      }
    }

    return { owned, joined, membership };
  });

  readonly ownedOrganizations = computed(() => this.workspacePartitions().owned);

  readonly joinedOrganizations = computed(() => this.workspacePartitions().joined);

  readonly teamWorkspaces = computed(() => this.availableWorkspaces().filter(ws => ws.workspaceType === 'team'));

  readonly partnerWorkspaces = computed(() => this.availableWorkspaces().filter(ws => ws.workspaceType === 'partner'));

  readonly personalWorkspaces = computed(() =>
    this.availableWorkspaces().filter(ws => ws.workspaceType === 'personal')
  );

  private readonly membershipLookup = computed(() => this.workspacePartitions().membership);

  get user(): User {
    return this.settings.user;
  }

  isMember(orgId: string | null): boolean {
    if (!orgId) return false;
    return this.membershipLookup().has(orgId);
  }

  selectWorkspace(workspace: WorkspaceView): void {
    this.setActiveWorkspace(workspace, true);
  }

  createOrganization(): void {
    this.router.navigateByUrl('/workspaces/create').catch(() => void 0);
  }

  createTeam(): void {
    const orgId = this.activeWorkspaceId();
    if (!this.isMember(orgId)) return;
    this.router.navigateByUrl('/workspaces/create/team').catch(() => void 0);
  }

  createPartner(): void {
    this.router.navigateByUrl('/workspaces/create/partner').catch(() => void 0);
  }

  createProject(): void {
    this.router.navigateByUrl('/workspaces/create/project').catch(() => void 0);
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url!).catch(() => void 0);
  }

  private setActiveWorkspace(workspace: WorkspaceView, persist: boolean): void {
    this.activeWorkspaceId.set(workspace.id);
    this.applyWorkspaceContext(workspace, persist);
  }

  private applyWorkspaceContext(workspace: WorkspaceView, persist: boolean): void {
    this.settings.setApp({
      name: workspace.name ?? 'NG-EVENTS',
      description: workspace.workspaceType
    });
    this.updateContextMenu(workspace);

    const baseEmail = this.settings.user.email;
    const isPersonal = workspace.workspaceType === 'personal';
    this.settings.setUser({
      ...this.settings.user,
      name: isPersonal ? this.settings.user.name : workspace.name ?? this.settings.user.name,
      avatar: this.workspaceAvatarById(workspace.id),
      email: isPersonal ? this.settings.user.email : baseEmail
    });

    if (persist) {
      this.saveWorkspaceId(workspace.id);
      this.storedWorkspaceId.set(workspace.id);
    }
  }

  canManageActiveOrganization(): boolean {
    const ws = this.activeWorkspace();
    const uid = this.currentUserId();
    if (!ws || ws.workspaceType !== 'organization' || !uid) return false;
    if (ws.ownerAccountId === uid) return true;
    const member = ws.members?.find(m => m.accountId === uid);
    const role = (member as any)?.role?.toString().toLowerCase?.() ?? '';
    return ['owner', 'admin', 'manager'].includes(role);
  }

  private pickDefaultWorkspace(list: WorkspaceView[]): WorkspaceView | null {
    const uid = this.currentUserId();
    if (!list.length) return null;

    const ownedOrg = list.find(ws => ws.workspaceType === 'organization' && ws.ownerAccountId === uid);
    if (ownedOrg) return ownedOrg;

    const joinedOrg = list.find(ws => ws.workspaceType === 'organization');
    if (joinedOrg) return joinedOrg;

    return list[0] ?? null;
  }

  private loadStoredWorkspaceId(): string | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      return localStorage.getItem('workspace.active') || null;
    } catch {
      return null;
    }
  }

  private saveWorkspaceId(id: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem('workspace.active', id);
    } catch {
      // ignore storage errors
    }
  }

  isActiveWorkspace(id: string): boolean {
    return this.activeWorkspaceId() === id;
  }

  private routeForWorkspace(workspace: WorkspaceView): string | null {
    switch (workspace.workspaceType) {
      case 'organization':
        return `/organizations/${workspace.id}`;
      case 'team':
        return `/teams/${workspace.id}`;
      case 'partner':
        return `/partners/${workspace.id}`;
      case 'personal':
        return `/workspaces/${workspace.id}`;
      case 'project':
        return `/projects/${workspace.id}`;
      default:
        return `/workspaces/${workspace.id}`;
    }
  }

  private updateContextMenu(workspace: WorkspaceView): void {
    const route = this.routeForWorkspace(workspace);
    const iconByType: Record<string, string> = {
      organization: 'apartment',
      team: 'team',
      partner: 'user-add',
      personal: 'user'
    };
    const icon = iconByType[workspace.workspaceType] ?? 'appstore';
    const menu = [
      {
        text: '主選單',
        group: true,
        children: [
          {
            text: workspace.name ?? 'Workspace',
            link: route ?? '/dashboard',
            icon
          }
        ]
      }
    ];

    this.menuService.clear();
    this.menuService.add(menu);
  }

  typeLabel(type: WorkspaceView['workspaceType'] | undefined): string {
    switch (type) {
      case 'organization':
        return 'Org';
      case 'team':
        return 'Team';
      case 'partner':
        return 'Partner';
      case 'personal':
        return 'Personal';
      default:
        return 'Workspace';
    }
  }

  private workspaceAvatarById(id: string): string {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(id)}`;
  }
}
