import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountStore } from '@application/store/account';
import { AuthStore } from '@application/store/auth/stores/auth.store';
import { Account, AccountType } from '@domain/account/entities/account.entity';
import { BREAKPOINTS } from '@shared/constants/breakpoints';
import { KeyboardShortcutService } from '@shared/services/keyboard-shortcut.service';

@Component({
  selector: 'app-account-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './account-switcher.component.html',
  styleUrl: './account-switcher.component.scss',
})
export class AccountSwitcherComponent {
  protected accountStore = inject(AccountStore);
  private authStore = inject(AuthStore);
  private breakpointObserver = inject(BreakpointObserver);
  private shortcutService = inject(KeyboardShortcutService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  protected isMenuOpen = signal(false);
  protected isMobile = signal(false);
  protected isTablet = signal(false);
  protected announceMessage = signal('');

  protected readonly AccountType = AccountType;
  protected groupedAccounts = this.accountStore.groupedAccounts;

  private menuTrigger = viewChild(MatMenuTrigger);

  protected displayName = computed(() => {
    const account = this.accountStore.currentAccount();
    if (!account) return '未登入';
    if (account.type === AccountType.User) {
      return account.displayName || account.name || account.email || 'User';
    }
    return account.name || 'Account';
  });

  protected avatarUrl = computed(() => this.accountStore.accountAvatar());

  protected accountType = computed(() => this.accountStore.currentAccount()?.type);

  protected currentAccountId = computed(() => this.accountStore.currentAccount()?.id ?? null);

  constructor() {
    this.breakpointObserver
      .observe([BREAKPOINTS.mobile])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => this.isMobile.set(result.matches));

    this.breakpointObserver
      .observe([BREAKPOINTS.tablet])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => this.isTablet.set(result.matches));

    this.shortcutService
      .register({ key: 'a', ctrl: true, shift: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.menuTrigger()?.openMenu());

    effect(() => {
      if (this.accountStore.error()) {
        this.snackBar.open('切換帳號失敗,請稍後再試', '關閉', { duration: 4000 });
      }
    });

    effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.accountStore.loadAvailableAccounts(user.uid);
      }
    });
  }

  onMenuOpened(): void {
    this.isMenuOpen.set(true);
  }

  onMenuClosed(): void {
    this.isMenuOpen.set(false);
  }

  getAccountTypeIcon(type: AccountType): string {
    switch (type) {
      case AccountType.Organization:
        return 'business';
      case AccountType.Team:
        return 'groups';
      case AccountType.Partner:
        return 'handshake';
      case AccountType.Bot:
        return 'smart_toy';
      case AccountType.User:
      default:
        return 'person';
    }
  }

  getBadgeColor(type: AccountType): string {
    switch (type) {
      case AccountType.Organization:
        return 'primary';
      case AccountType.Team:
        return 'accent';
      case AccountType.Partner:
        return 'warn';
      default:
        return '';
    }
  }

  async onSwitchAccount(account: Account): Promise<void> {
    if (account.id === this.currentAccountId()) return;
    await this.accountStore.switchAccount(account.id);
    if (!this.accountStore.error()) {
      const label = account.name || account.displayName || '帳號';
      this.announceMessage.set(`已切換至 ${label}`);
      this.snackBar.open(`已切換至 ${label}`, '關閉', { duration: 3000 });
      setTimeout(() => this.announceMessage.set(''), 1000);
      this.menuTrigger()?.closeMenu();
    }
  }

  isCurrentAccount(accountId: string): boolean {
    return accountId === this.currentAccountId();
  }
}
