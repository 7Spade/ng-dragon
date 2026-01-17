import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Account, AccountType } from '@domain/account/entities/account.entity';
import { AccountService } from '@infrastructure/account/services/account.service';
import { AuthStore } from '@application/store/auth/stores/auth.store';
import { ContextStore } from '@application/store/context/stores/context.store';
import { initialAccountState } from './account.state';

export const AccountStore = signalStore(
  { providedIn: 'root' },
  withState(initialAccountState),
  withComputed(({ currentAccount, accounts }) => ({
    isAuthenticated: computed(() => currentAccount() !== null),
    accountName: computed(() => currentAccount()?.name || currentAccount()?.displayName || ''),
    accountAvatar: computed(() => currentAccount()?.photoURL || currentAccount()?.avatar || null),
    availableAccounts: computed(() => accounts()),
    groupedAccounts: computed(() => {
      const items = accounts();
      return {
        user: items.filter((account) => account.type === AccountType.User),
        organizations: items.filter((account) => account.type === AccountType.Organization),
        teams: items.filter((account) => account.type === AccountType.Team),
        partners: items.filter((account) => account.type === AccountType.Partner),
      };
    }),
  })),
  withMethods(
    (
      store,
      accountService = inject(AccountService),
      authStore = inject(AuthStore),
      contextStore = inject(ContextStore)
    ) => {
      const resolveContextAccount = (accountId: string, type: AccountType) => {
        const available = contextStore.available();
        if (type === AccountType.Organization) {
          return available.organizations.find((org) => org.organizationId === accountId);
        }
        if (type === AccountType.Team) {
          return available.teams.find((team) => team.teamId === accountId);
        }
        if (type === AccountType.Partner) {
          return available.partners.find((partner) => partner.partnerId === accountId);
        }
        return null;
      };

      const switchContextForAccount = (account: Account) => {
        if (account.type === AccountType.User) {
          const user = authStore.user();
          if (user) {
            contextStore.switchContext({
              type: 'user',
              userId: user.uid,
              email: user.email || '',
              displayName: user.displayName ?? null,
            });
          }
          return;
        }

        const match = resolveContextAccount(account.id, account.type);
        if (match) {
          contextStore.switchContext(match);
        }
      };

      return {
        syncFromContext(): void {
          const user = authStore.user();
          if (!user) {
            patchState(store, initialAccountState);
            return;
          }

          const available = contextStore.available();
          const accounts: Account[] = [
            {
              id: user.uid,
              type: AccountType.User,
              name: user.displayName || user.email || 'User',
              email: user.email || '',
              displayName: user.displayName || user.email || '',
              memberCount: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              ...(user.photoURL ? { photoURL: user.photoURL } : {}),
            },
            ...available.organizations.map((org) => ({
              id: org.organizationId,
              type: AccountType.Organization,
              name: org.name,
              memberCount: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
            ...available.teams.map((team) => ({
              id: team.teamId,
              type: AccountType.Team,
              name: team.name,
              memberCount: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
            ...available.partners.map((partner) => ({
              id: partner.partnerId,
              type: AccountType.Partner,
              name: partner.name,
              companyName: partner.name,
              memberCount: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          ];

          const persisted = accountService.getCurrentAccountId();
          const current =
            accounts.find((account) => account.id === persisted) ?? accounts[0] ?? null;

          patchState(store, {
            accounts,
            currentAccount: current,
            loading: false,
            error: null,
          });

          if (current) {
            switchContextForAccount(current);
          }
        },
        async loadCurrentAccount(accountId: string): Promise<void> {
          patchState(store, { loading: true, error: null });
          try {
            const account = await firstValueFrom(accountService.getAccount(accountId));
            patchState(store, {
              currentAccount: account,
              loading: false,
              error: null,
            });
          } catch (error: any) {
            patchState(store, { loading: false, error: error?.message ?? 'Load failed' });
          }
        },
        async loadAvailableAccounts(userId: string): Promise<void> {
          patchState(store, { loading: true, error: null });
          try {
            const accounts = await firstValueFrom(accountService.getUserAccounts(userId));
            patchState(store, {
              accounts,
              loading: false,
              error: null,
            });
          } catch (error: any) {
            patchState(store, { loading: false, error: error?.message ?? 'Load failed' });
          }
        },
        async switchAccount(accountId: string): Promise<void> {
          if (store.currentAccount()?.id === accountId) return;
          patchState(store, { loading: true, error: null });
          try {
            const account = await firstValueFrom(accountService.switchAccount(accountId));
            if (account) {
              patchState(store, { currentAccount: account, loading: false, error: null });
              switchContextForAccount(account);
            } else {
              patchState(store, { loading: false, error: 'Account not found' });
            }
          } catch (error: any) {
            patchState(store, { loading: false, error: error?.message ?? 'Switch failed' });
          }
        },
        setCurrentAccount(account: Account | null): void {
          patchState(store, { currentAccount: account });
        },
        reset(): void {
          patchState(store, initialAccountState);
        },
      };
    }
  ),
  withHooks({
    onInit(store) {
      const authStore = inject(AuthStore);
      const contextStore = inject(ContextStore);

      effect(() => {
        authStore.user();
        contextStore.available();
        store.syncFromContext();
      });
    },
  })
);
