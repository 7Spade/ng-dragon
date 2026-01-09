import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseAuthBridgeService } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { WorkspaceService, WorkspaceView } from '@platform-adapters';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'header-user',
  template: `
    @if (layout === 'header') {
      <div class="alain-default__nav-item d-flex align-items-center px-sm">
        <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm" />
        {{ user.name }}
      </div>
    } @else {
      <div class="alain-default__aside-user" nz-dropdown [nzDropdownMenu]="userMenu" nzTrigger="click" nzPlacement="bottomLeft">
        <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
        <div class="alain-default__aside-user-info">
          <strong>{{ user.name }}</strong>
          <p class="mb0">{{ user.email }}</p>
        </div>
      </div>
    }
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-lg">
        <div class="px-sm py-sm text-muted">{{ 'menu.account.organizations' | i18n: 'Organizations' }}</div>

        <!-- Owned Organizations -->
        <div class="px-sm text-muted">{{ 'menu.account.organizations.owned' | i18n: 'Owned' }}</div>
        @if ((ownedOrganizations$ | async)?.length) {
          @for (org of ownedOrganizations$ | async; track org.id) {
            <div nz-menu-item (click)="selectOrganization(org.id)"> <i nz-icon nzType="crown" class="mr-sm"></i>{{ org.name }} </div>
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.organizations.noneOwned' | i18n: 'No owned organizations' }}</div>
        }

        <li nz-menu-divider></li>

        <!-- Joined Organizations -->
        <div class="px-sm text-muted">{{ 'menu.account.organizations.joined' | i18n: 'Joined' }}</div>
        @if ((joinedOrganizations$ | async)?.length) {
          @for (org of joinedOrganizations$ | async; track org.id) {
            <div nz-menu-item (click)="selectOrganization(org.id)"> <i nz-icon nzType="team" class="mr-sm"></i>{{ org.name }} </div>
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.organizations.noneJoined' | i18n: 'No joined organizations' }}</div>
        }

        <li nz-menu-divider></li>

        <!-- Create Organization -->
        <div nz-menu-item (click)="createOrganization()">
          <i nz-icon nzType="plus" class="mr-sm"></i>{{ 'menu.account.organizations.create' | i18n: 'Create organization' }}
        </div>

        @if (selectedOrganizationName) {
          <div nz-menu-item class="text-muted">{{ selectedOrganizationName }}</div>
          <div nz-menu-item [nzDisabled]="!isMember(selectedOrganizationId)" (click)="createTeam()">
            <i nz-icon nzType="team" class="mr-sm"></i>{{ 'menu.account.organizations.createTeam' | i18n: 'Create team' }}
          </div>
          <div nz-menu-item (click)="createPartner()">
            <i nz-icon nzType="user-add" class="mr-sm"></i>{{ 'menu.account.organizations.createPartner' | i18n: 'Create partner' }}
          </div>
          <div nz-menu-item (click)="createProject()">
            <i nz-icon nzType="appstore-add" class="mr-sm"></i>{{ 'menu.account.organizations.createProject' | i18n: 'Create project' }}
          </div>
        }

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
  imports: [RouterLink, NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule, AsyncPipe, NgFor, NgIf]
})
export class HeaderUserComponent {
  @Input() layout: 'header' | 'aside' = 'aside';

  private readonly settings = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);

  // Observable streams for owned and joined organizations
  readonly ownedOrganizations$: Observable<WorkspaceView[]>;
  readonly joinedOrganizations$: Observable<WorkspaceView[]>;

  selectedOrganizationId: string | null = null;
  selectedOrganizationName: string | null = null;

  constructor() {
    const user = this.authBridge.getCurrentUser();
    const userId = user?.uid;

    const allWorkspaces$ = this.workspaceService.getUserWorkspaces();

    this.ownedOrganizations$ = allWorkspaces$.pipe(
      map(workspaces => workspaces.filter(ws => ws.workspaceType === 'organization' && ws.ownerAccountId === userId))
    );

    this.joinedOrganizations$ = allWorkspaces$.pipe(
      map(workspaces =>
        workspaces.filter(
          ws => ws.workspaceType === 'organization' && ws.ownerAccountId !== userId && ws.members?.some(m => m.accountId === userId)
        )
      )
    );
  }

  get user(): User {
    return this.settings.user;
  }

  private isMember(orgId: string | null): boolean {
    if (!orgId) return false;
    // TODO: Implement proper membership check
    return true;
  }

  selectOrganization(orgId: string): void {
    this.selectedOrganizationId = orgId;
    this.router.navigateByUrl(`/organizations/${orgId}`).catch(() => void 0);
  }

  createOrganization(): void {
    this.router.navigateByUrl('/workspaces/create').catch(() => void 0);
  }

  createTeam(): void {
    if (!this.isMember(this.selectedOrganizationId)) return;
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
    this.router.navigateByUrl(this.tokenService.login_url!);
  }
}
