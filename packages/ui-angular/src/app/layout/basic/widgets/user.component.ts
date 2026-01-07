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
        <ng-container *ngIf="selectedOrganizationName">
          <div nz-menu-item class="text-muted">{{ selectedOrganizationName }}</div>
          <div nz-menu-item [nzDisabled]="!isMember(selectedOrganizationId)" (click)="createTeam()">
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

  selectedOrganizationId: string | null = null;

  get user(): User {
    return this.settings.user;
  }

  private findOrg(orgId: string | null) {
    if (!orgId) return null;
    return [...this.ownedOrganizations, ...this.joinedOrganizations].find(o => o.id === orgId) || null;
  }

  private isMember(orgId: string | null): boolean {
    if (!orgId) return false;
    return [...this.ownedOrganizations, ...this.joinedOrganizations].some(o => o.id === orgId);
  }

  get selectedOrganizationName(): string | null {
    return this.findOrg(this.selectedOrganizationId)?.name ?? null;
  }

  selectOrganization(orgId: string): void {
    this.selectedOrganizationId = orgId;
    // TODO: replace with actual navigation / workspace switch facade
    this.router.navigateByUrl(`/organizations/${orgId}`).catch(() => void 0);
  }

  createOrganization(): void {
    // TODO: replace with actual create-organization flow
    this.router.navigateByUrl('/organizations/create').catch(() => void 0);
  }

  createTeam(): void {
    if (!this.isMember(this.selectedOrganizationId)) return;
    // TODO: replace with actual create-team flow via facade/adapters
    this.router.navigateByUrl(`/organizations/${this.selectedOrganizationId}/teams/create`).catch(() => void 0);
  }

  createPartner(): void {
    // Partner creation allowed even if not a member (external/vendor)
    const orgId = this.selectedOrganizationId ?? 'select-org-first';
    this.router.navigateByUrl(`/organizations/${orgId}/partners/create`).catch(() => void 0);
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url!);
  }
}
