import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkspaceService, Workspace, Team } from '../../../workspaces/workspace.service';
import { WorkspaceContextService } from '../../../workspaces/workspace-context.service';
import { FirebaseAuthBridgeService } from '@core';

interface OrganizationWithTeams {
  organization: Workspace;
  teams: Team[];
  isOwner: boolean;
}

@Component({
  selector: 'header-user',
  template: `
    @if (layout === 'header') {
      <div class="alain-default__nav-item d-flex align-items-center px-sm">
        <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm" />
        {{ user.name }}
      </div>
    } @else {
      <div
        class="alain-default__aside-user"
        nz-dropdown
        [nzDropdownMenu]="userMenu"
        nzTrigger="click"
        nzPlacement="bottomLeft"
      >
        <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
        <div class="alain-default__aside-user-info">
          <strong>{{ user.name }}</strong>
          <p class="mb0">{{ user.email }}</p>
        </div>
      </div>
    }
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-lg">
        <div class="px-sm py-sm text-muted">{{ 'menu.account.organizations' | i18n : 'Organizations' }}</div>
        
        <!-- Owned Organizations with Teams -->
        <div class="px-sm text-muted">{{ 'menu.account.organizations.owned' | i18n : 'Owned' }}</div>
        @if ((ownedOrganizationsWithTeams$ | async)?.length) {
          @for (item of ownedOrganizationsWithTeams$ | async; track item.organization.id) {
            <!-- Organization -->
            <div nz-menu-item (click)="selectOrganization(item.organization.id)">
              <i nz-icon nzType="crown" class="mr-sm"></i>{{ item.organization.name }}
            </div>
            <!-- Teams under owned organization -->
            @if (item.teams?.length) {
              @for (team of item.teams; track team.teamId) {
                <div nz-menu-item (click)="selectTeam(item.organization.id, team.teamId)" class="pl-lg">
                  <i nz-icon nzType="team" class="mr-sm"></i>{{ team.teamName }}
                </div>
              }
            }
            <!-- Create Team option (only for owners) -->
            <div nz-menu-item (click)="createTeam(item.organization.id)" class="pl-lg text-primary">
              <i nz-icon nzType="plus" class="mr-sm"></i>{{ 'menu.account.organizations.createTeam' | i18n : 'Create team' }}
            </div>
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.organizations.noneOwned' | i18n : 'No owned organizations' }}</div>
        }
        
        <li nz-menu-divider></li>
        
        <!-- Joined Organizations with Teams -->
        <div class="px-sm text-muted">{{ 'menu.account.organizations.joined' | i18n : 'Joined' }}</div>
        @if ((joinedOrganizationsWithTeams$ | async)?.length) {
          @for (item of joinedOrganizationsWithTeams$ | async; track item.organization.id) {
            <!-- Organization -->
            <div nz-menu-item (click)="selectOrganization(item.organization.id)">
              <i nz-icon nzType="team" class="mr-sm"></i>{{ item.organization.name }}
            </div>
            <!-- Teams under joined organization (only teams user is member of) -->
            @if (item.teams?.length) {
              @for (team of item.teams; track team.teamId) {
                <div nz-menu-item (click)="selectTeam(item.organization.id, team.teamId)" class="pl-lg">
                  <i nz-icon nzType="team" class="mr-sm"></i>{{ team.teamName }}
                </div>
              }
            }
          }
        } @else {
          <div nz-menu-item class="text-muted">{{ 'menu.account.organizations.noneJoined' | i18n : 'No joined organizations' }}</div>
        }
        
        <li nz-menu-divider></li>
        
        <!-- Create Organization -->
        <div nz-menu-item (click)="createOrganization()">
          <i nz-icon nzType="plus" class="mr-sm"></i>{{ 'menu.account.organizations.create' | i18n : 'Create organization' }}
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
  imports: [RouterLink, NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule, AsyncPipe, NgFor, NgIf]
})
export class HeaderUserComponent {
  @Input() layout: 'header' | 'aside' = 'aside';

  private readonly settings = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly contextService = inject(WorkspaceContextService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);

  // Observable streams for owned and joined organizations with teams
  readonly ownedOrganizationsWithTeams$: Observable<OrganizationWithTeams[]>;
  readonly joinedOrganizationsWithTeams$: Observable<OrganizationWithTeams[]>;

  constructor() {
    const user = this.authBridge.getCurrentUser();
    const userId = user?.uid;

    // Get all user workspaces
    const allWorkspaces$ = this.workspaceService.getUserWorkspaces();

    // Owned organizations with their teams
    this.ownedOrganizationsWithTeams$ = allWorkspaces$.pipe(
      map(workspaces => {
        const ownedOrgs = workspaces.filter(ws => 
          ws.type === 'organization' && ws.ownerUserId === userId
        );
        
        return ownedOrgs.map(org => ({
          organization: org,
          teams: org.teams || [],
          isOwner: true
        }));
      })
    );

    // Joined organizations with teams user is member of
    this.joinedOrganizationsWithTeams$ = allWorkspaces$.pipe(
      map(workspaces => {
        const joinedOrgs = workspaces.filter(ws => 
          ws.type === 'organization' && 
          ws.ownerUserId !== userId &&
          ws.members?.some(m => m.userId === userId)
        );
        
        return joinedOrgs.map(org => ({
          organization: org,
          teams: org.teams || [],
          isOwner: false
        }));
      })
    );
  }

  get user(): User {
    return this.settings.user;
  }

  /**
   * Select organization and update context to refresh sidebar menu
   */
  selectOrganization(orgId: string): void {
    // Update context - this triggers menu refresh via StartupService
    this.contextService.selectOrganization(orgId);
    
    // Navigate to organization page
    this.router.navigateByUrl(`/organizations/${orgId}`).catch(() => void 0);
  }

  /**
   * Select team and update context to refresh sidebar menu
   */
  selectTeam(orgId: string, teamId: string): void {
    // Update context - this triggers menu refresh via StartupService
    this.contextService.selectTeam(orgId, teamId);
    
    // Navigate to team page
    this.router.navigateByUrl(`/organizations/${orgId}/teams/${teamId}`).catch(() => void 0);
  }

  createOrganization(): void {
    this.router.navigateByUrl('/workspaces/create').catch(() => void 0);
  }

  createTeam(orgId: string): void {
    this.router.navigateByUrl(`/organizations/${orgId}/teams/create`).catch(() => void 0);
  }

  logout(): void {
    // Clear workspace context on logout
    this.contextService.clearContext();
    
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url!);
  }
}
