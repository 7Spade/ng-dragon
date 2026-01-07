import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'header-user',
  template: `
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
      <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm" />
      {{ user.name }}
    </div>
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
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'menu.account.logout' | i18n }}
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule]
})
export class HeaderUserComponent {
  private readonly settings = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  readonly ownedOrganizations = [
    { id: 'org-001', name: 'Acme Corp' },
    { id: 'org-002', name: 'Beta Labs' }
  ];

  readonly joinedOrganizations = [
    { id: 'org-003', name: 'Gamma Partners' },
    { id: 'org-004', name: 'Delta Studio' }
  ];

  get user(): User {
    return this.settings.user;
  }

  selectOrganization(orgId: string): void {
    // TODO: replace with actual navigation / workspace switch facade
    this.router.navigateByUrl(`/organizations/${orgId}`).catch(() => void 0);
  }

  createOrganization(): void {
    // TODO: replace with actual create-organization flow
    this.router.navigateByUrl('/organizations/create').catch(() => void 0);
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url!);
  }
}
