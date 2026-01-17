import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WorkspaceStore } from '@application/store/workspace/stores/workspace.store';
import { NotificationStore } from '@application/store/ui/notification.store';
import { WorkspaceSwitcherComponent } from './components/workspace-switcher/workspace-switcher.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { AccountSwitcherComponent } from './components/account-switcher/account-switcher.component';
import { AccountMenuComponent } from './components/account-menu/account-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    WorkspaceSwitcherComponent,
    GlobalSearchComponent,
    AccountSwitcherComponent,
    AccountMenuComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected workspaceStore = inject(WorkspaceStore);
  protected notificationStore = inject(NotificationStore);
  protected isScrolled = signal(false);
  protected unreadCount = computed(() => this.notificationStore.unreadCount());

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 0);
      });
    }
  }

  protected openNotifications(): void {
    this.notificationStore.toggleDrawer();
  }
}
