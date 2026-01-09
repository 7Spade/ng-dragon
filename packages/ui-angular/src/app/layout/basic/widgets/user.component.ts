import { ChangeDetectionStrategy, Component, Input, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { WorkspaceService, Workspace } from '../../../workspaces/workspace.service';
import { FirebaseAuthBridgeService, ContextService } from '@core';

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
        <!-- Current Context Display -->
        @if (contextService.currentContext(); as context) {
          <div class="px-sm py-sm bg-light">
            <div class="text-muted small">Current Context</div>
            <div class="font-weight-bold">
              @switch (context.type) {
                @case ('user') { <i nz-icon nzType="user"></i> Personal }
                @case ('organization') { <i nz-icon nzType="crown"></i> {{ context.name || 'Organization' }} }
                @case ('team') { <i nz-icon nzType="team"></i> {{ context.name || 'Team' }} }
                @case ('partner') { <i nz-icon nzType="user-add"></i> {{ context.name || 'Partner' }} }
              }
            </div>
          </div>
          <li nz-menu-divider></li>
        }
        
        <!-- Switch to Personal Context -->
        <div nz-menu-item (click)="switchToUserContext()">
          <i nz-icon nzType="user" class="mr-sm"></i>{{ 'menu.context.personal' | i18n : 'Personal Context' }}
        </div>
        
        <li nz-menu-divider></li>
        
        <div class="px-sm py-sm text-muted">{{ 'menu.account.organizations' | i18n : 'Organizations' }}</div>
        
        <!-- Owned Organizations -->
        <div class="px-sm text-muted small">{{ 'menu.account.organizations.owned' | i18n : 'Owned' }}</div>
        @if ((ownedOrganizations$ | async)?.length) {
          @for (org of ownedOrganizations$ | async; track org.id) {
            <div nz-menu-item (click)="selectOrganization(org.id, org.name)">
              <i nz-icon nzType="crown" class="mr-sm"></i>{{ org.name }}
            </div>
          }
        } @else {
          <div nz-menu-item class="text-muted small">{{ 'menu.account.organizations.noneOwned' | i18n : 'No owned organizations' }}</div>
        }
        
        <li nz-menu-divider></li>
        
        <!-- Joined Organizations -->
        <div class="px-sm text-muted small">{{ 'menu.account.organizations.joined' | i18n : 'Joined' }}</div>
        @if ((joinedOrganizations$ | async)?.length) {
          @for (org of joinedOrganizations$ | async; track org.id) {
            <div nz-menu-item (click)="selectOrganization(org.id, org.name)">
              <i nz-icon nzType="team" class="mr-sm"></i>{{ org.name }}
            </div>
          }
        } @else {
          <div nz-menu-item class="text-muted small">{{ 'menu.account.organizations.noneJoined' | i18n : 'No joined organizations' }}</div>
        }
        
        <li nz-menu-divider></li>
        
        <!-- Create Organization -->
        <div nz-menu-item (click)="createOrganization()">
          <i nz-icon nzType="plus" class="mr-sm"></i>{{ 'menu.account.organizations.create' | i18n : 'Create organization' }}
        </div>
        
        <!-- Context Actions (shown when in organization context AND user can manage) -->
        @if (contextService.isOrganizationContext() && contextService.contextId() && (canManageCurrentOrg$ | async)) {
          <li nz-menu-divider></li>
          <div class="px-sm py-sm text-muted small">{{ 'menu.context.organizationActions' | i18n : 'Organization Actions' }}</div>
          <div nz-menu-item (click)="createTeam()">
            <i nz-icon nzType="team" class="mr-sm"></i>{{ 'menu.account.organizations.createTeam' | i18n : 'Create team' }}
          </div>
          <div nz-menu-item (click)="createPartner()">
            <i nz-icon nzType="user-add" class="mr-sm"></i>{{ 'menu.account.organizations.createPartner' | i18n : 'Create partner' }}
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
  imports: [NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule, AsyncPipe]
})
export class HeaderUserComponent {
  @Input() layout: 'header' | 'aside' = 'aside';

  private readonly settings = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  readonly contextService = inject(ContextService);

  // Observable streams for owned and joined organizations
  readonly ownedOrganizations$: Observable<Workspace[]>;
  readonly joinedOrganizations$: Observable<Workspace[]>;
  
  // Computed observable for permission check
  readonly canManageCurrentOrg$: Observable<boolean>;

  constructor() {
    const user = this.authBridge.getCurrentUser();
    const userId = user?.uid;

    // Get all user workspaces and split into owned and joined
    const allWorkspaces$ = this.workspaceService.getUserWorkspaces();

    // Owned organizations (where user is the owner)
    this.ownedOrganizations$ = allWorkspaces$.pipe(
      map(workspaces => 
        workspaces.filter(ws => 
          ws.type === 'organization' && ws.ownerUserId === userId
        )
      )
    );

    // Joined organizations (where user is a member but not owner)
    this.joinedOrganizations$ = allWorkspaces$.pipe(
      map(workspaces => 
        workspaces.filter(ws => 
          ws.type === 'organization' && 
          ws.ownerUserId !== userId &&
          ws.members?.some(m => m.userId === userId)
        )
      )
    );

    // Permission check observable - recomputes when context changes
    this.canManageCurrentOrg$ = allWorkspaces$.pipe(
      map(workspaces => {
        const contextId = this.contextService.contextId();
        if (!contextId || !this.contextService.isOrganizationContext()) {
          return false;
        }

        const org = workspaces.find(ws => ws.id === contextId);
        if (!org) return false;

        // User is owner
        if (org.ownerUserId === userId) return true;

        // User is admin member
        const userMember = org.members?.find(m => m.userId === userId);
        return userMember?.role === 'admin';
      })
    );
  }

  get user(): User {
    return this.settings.user;
  }

  switchToUserContext(): void {
    this.contextService.switchToUserContext();
    this.router.navigateByUrl('/dashboard').catch(() => void 0);
  }

  selectOrganization(orgId: string, orgName: string): void {
    this.contextService.switchToOrganizationContext(orgId, orgName);
    // Switch to dashboard instead of organization-specific route to avoid 404
    this.router.navigateByUrl('/dashboard').catch(() => void 0);
  }

  createOrganization(): void {
    this.router.navigateByUrl('/workspaces/create').catch(() => void 0);
  }

  createTeam(): void {
    const orgId = this.contextService.contextId();
    if (!orgId) {
      console.error('No organization context for creating team');
      return;
    }
    this.router.navigateByUrl(`/organizations/${orgId}/teams/create`).catch(() => void 0);
  }

  createPartner(): void {
    const orgId = this.contextService.contextId();
    if (!orgId) {
      console.error('No organization context for creating partner');
      return;
    }
    this.router.navigateByUrl(`/organizations/${orgId}/partners/create`).catch(() => void 0);
  }

  logout(): void {
    this.contextService.switchToUserContext(); // Reset context on logout
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url!);
  }
}
