import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { OrganizationSessionFacade } from '../../../core/session/organization-session.facade';

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
        <div class="px-sm py-sm text-muted">{{ 'menu.account.organizations' | i18n : 'Organizations' }}</div>
        <ng-container *ngIf="ownedOrganizations.length; else noOwned">
          <div class="px-sm text-muted">{{ 'menu.account.organizations.owned' | i18n : 'Owned' }}</div>
          <div nz-menu-item *ngFor="let org of ownedOrganizations" (click)="selectOrganization(org.id)">
            <i nz-icon nzType="crown" class="mr-sm"></i>{{ org.name }}
          </div>
        </ng-container>
        <ng-template #noOwned>
          <div nz-menu-item class="text-muted">{{ 'menu.account.organizations.noneOwned' | i18n : 'No owned organizations' }}</div>
        </ng-template>
        <li nz-menu-divider></li>
        <div class="px-sm text-muted">{{ 'menu.account.organizations.joined' | i18n : 'Joined' }}</div>
        <ng-container *ngIf="joinedOrganizations.length; else noJoined">
          <div nz-menu-item *ngFor="let org of joinedOrganizations" (click)="selectOrganization(org.id)">
            <i nz-icon nzType="team" class="mr-sm"></i>{{ org.name }}
          </div>
        </ng-container>
        <ng-template #noJoined>
          <div nz-menu-item class="text-muted">{{ 'menu.account.organizations.noneJoined' | i18n : 'No joined organizations' }}</div>
        </ng-template>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="createOrganization()">
          <i nz-icon nzType="plus" class="mr-sm"></i>{{ 'menu.account.organizations.create' | i18n : 'Create organization' }}
        </div>
        <ng-container *ngIf="selectedOrganizationName">
          <div nz-menu-item class="text-muted">{{ selectedOrganizationName }}</div>
          <div nz-menu-item [nzDisabled]="!canCreateTeam" (click)="createTeam()">
            <i nz-icon nzType="team" class="mr-sm"></i>{{ 'menu.account.organizations.createTeam' | i18n : 'Create team' }}
          </div>
          <div nz-menu-item (click)="createPartner()">
            <i nz-icon nzType="user-add" class="mr-sm"></i>{{ 'menu.account.organizations.createPartner' | i18n : 'Create partner' }}
          </div>
        </ng-container>
        <li nz-menu-divider></li>
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
  private readonly organizationFacade = inject(OrganizationSessionFacade);
  private readonly router = inject(Router);

  get user(): User {
    return this.settings.user;
  }

  get ownedOrganizations(): ReadonlyArray<{ id: string; name: string }> {
    return this.organizationFacade.ownedOrganizations();
  }

  get joinedOrganizations(): ReadonlyArray<{ id: string; name: string }> {
    return this.organizationFacade.joinedOrganizations();
  }

  get selectedOrganizationName(): string | null {
    return this.organizationFacade.selectedOrganizationName();
  }

  get canCreateTeam(): boolean {
    return this.organizationFacade.canCreateTeam();
  }

  selectOrganization(orgId: string): void {
    void this.organizationFacade.selectOrganization(orgId);
  }

  createOrganization(): void {
    void this.router.navigate(['/organizations/create']);
  }

  createTeam(): void {
    void this.organizationFacade.createTeam();
  }

  createPartner(): void {
    void this.organizationFacade.createPartner();
  }

  logout(): void {
    void this.organizationFacade.logout();
  }
}
