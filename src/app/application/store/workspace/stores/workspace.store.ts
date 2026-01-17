import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '@application/store/auth/stores/auth.store';
import { ContextStore } from '@application/store/context/stores/context.store';
import {
  Workspace,
  WorkspaceGroup,
  WorkspaceScope,
  WorkspaceStatus,
  WorkspaceType,
} from '@domain/workspace/entities/workspace.entity';
import { AppContext } from '@domain/context/entities/context.entity';
import { EventBusStore } from '@application/store/event-bus/stores/event-bus.store';
import { WorkspaceService } from '@infrastructure/workspace/services/workspace.service';
import { PersistenceService } from '@shared/services/persistence.service';
import { initialWorkspaceState } from './workspace.state';

const buildWorkspaceId = (scope: WorkspaceScope, contextId: string) =>
  `${scope}:${contextId}`;

const scopeToType: Record<WorkspaceScope, WorkspaceType> = {
  user: WorkspaceType.Internal,
  organization: WorkspaceType.Department,
  team: WorkspaceType.Project,
  partner: WorkspaceType.Client,
};

export const WorkspaceStore = signalStore(
  { providedIn: 'root' },
  withState(initialWorkspaceState),
  withComputed(({ workspaces, currentWorkspaceId, favorites, recents, searchQuery }) => ({
    activeWorkspaceId: computed(() => currentWorkspaceId()),
    currentWorkspace: computed(() =>
      workspaces().find((w) => w.id === currentWorkspaceId()) || null
    ),
    activeWorkspace: computed(() =>
      workspaces().find((w) => w.id === currentWorkspaceId()) || null
    ),
    filteredWorkspaces: computed(() => {
      const query = searchQuery().toLowerCase();
      if (!query) return workspaces();
      return workspaces().filter(
        (workspace) =>
          workspace.name.toLowerCase().includes(query) ||
          workspace.description?.toLowerCase().includes(query)
      );
    }),
    recentWorkspaces: computed(() => {
      const list = workspaces();
      return recents()
        .map((id) => list.find((workspace) => workspace.id === id))
        .filter((workspace): workspace is Workspace => Boolean(workspace))
        .slice(0, 5);
    }),
    favoriteWorkspaces: computed(() =>
      workspaces().filter((workspace) => favorites().includes(workspace.id))
    ),
    archivedWorkspaces: computed(() =>
      workspaces().filter((workspace) => workspace.status === WorkspaceStatus.Archived)
    ),
    activeWorkspaces: computed(() =>
      workspaces().filter((workspace) => workspace.status === WorkspaceStatus.Active)
    ),
    groupedWorkspaces: computed((): WorkspaceGroup[] => {
      const filtered = workspaces().filter((workspace) =>
        workspace.name.toLowerCase().includes(searchQuery().toLowerCase())
      );
      const groups: WorkspaceGroup[] = [];

      const recent = recents()
        .map((id) => filtered.find((workspace) => workspace.id === id))
        .filter((workspace): workspace is Workspace => Boolean(workspace))
        .slice(0, 5);
      if (recent.length > 0) {
        groups.push({ title: '最近使用', workspaces: recent });
      }

      const favorite = filtered.filter((workspace) => favorites().includes(workspace.id));
      if (favorite.length > 0) {
        groups.push({ title: '我的最愛', workspaces: favorite });
      }

      const primary = filtered.filter(
        (workspace) =>
          !favorites().includes(workspace.id) && !recents().slice(0, 5).includes(workspace.id)
      );
      if (primary.length > 0) {
        groups.push({ title: '我的工作區', workspaces: primary });
      }

      return groups;
    }),
    hasMultiple: computed(() => workspaces().length > 1),
    byScope: computed(() => {
      const grouped: Record<WorkspaceScope, Workspace[]> = {
        user: [],
        organization: [],
        team: [],
        partner: [],
      };
      workspaces().forEach((workspace) => {
        if (workspace.scope) {
          grouped[workspace.scope].push(workspace);
        }
      });
      return grouped;
    }),
  })),
  withMethods(
    (
      store,
      authStore = inject(AuthStore),
      contextStore = inject(ContextStore),
      eventBus = inject(EventBusStore),
      workspaceService = inject(WorkspaceService),
      persistence = inject(PersistenceService)
    ) => {
      const seedWorkspace = (
        scope: WorkspaceScope,
        contextId: string,
        name: string,
        ownerId: string,
        capabilities: string[]
      ): Workspace => ({
        id: buildWorkspaceId(scope, contextId),
        name,
        description: '',
        type: scopeToType[scope],
        status: WorkspaceStatus.Active,
        ownerId,
        accountId: contextId,
        contextId,
        scope,
        memberCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        capabilities,
      });

      const persistPreferences = async (userId: string) => {
        try {
          await firstValueFrom(
            workspaceService.saveUserPreferences(userId, store.favorites(), store.recents())
          );
        } catch (error) {
          console.error('[WorkspaceStore] Failed to persist preferences', error);
        }
      };

      return {
        syncFromContext(): void {
          const user = authStore.user();
          if (!user) {
            patchState(store, initialWorkspaceState);
            return;
          }

          const contexts = contextStore.available();
          const current = contextStore.current();
          const seeds: Workspace[] = [
            seedWorkspace(
              'user',
              user.uid,
              user.email || 'My Workspace',
              user.uid,
              [
                'documents:read',
                'documents:write',
                'settings:write',
                'audit:read',
                'journal:write',
                'permissions:manage',
              ]
            ),
            ...contexts.organizations.map((org) =>
              seedWorkspace('organization', org.organizationId, org.name, user.uid, [
                'documents:read',
                'documents:write',
                'settings:write',
                'audit:read',
                'journal:write',
                'permissions:manage',
              ])
            ),
            ...contexts.teams.map((team) =>
              seedWorkspace('team', team.teamId, team.name, user.uid, [
                'documents:read',
                'documents:write',
                'settings:write',
                'audit:read',
                'journal:write',
              ])
            ),
            ...contexts.partners.map((partner) =>
              seedWorkspace('partner', partner.partnerId, partner.name, user.uid, [
                'documents:read',
                'audit:read',
              ])
            ),
          ];

          const resolveContextId = (context: AppContext) => {
            switch (context.type) {
              case 'user':
                return context.userId;
              case 'organization':
                return context.organizationId;
              case 'team':
                return context.teamId;
              case 'partner':
                return context.partnerId;
            }
          };

          const persistedId = persistence.loadCurrentWorkspace();
          const resolvedContextId = current ? resolveContextId(current) : null;
          const persistedMatch = persistedId
            ? seeds.find((workspace) => workspace.id === persistedId)?.id
            : null;
          const nextWorkspaceId =
            persistedMatch ||
            (current && resolvedContextId
              ? buildWorkspaceId(current.type as WorkspaceScope, resolvedContextId)
              : seeds[0]?.id ?? null);
          patchState(store, {
            workspaces: seeds,
            currentWorkspaceId: nextWorkspaceId,
            favorites: persistence.loadFavorites(),
            recents: persistence.loadRecents(),
          });
        },
        async loadWorkspaces(accountId: string): Promise<void> {
          patchState(store, { loading: true, error: null });
          try {
            const workspaces = await firstValueFrom(
              workspaceService.getWorkspacesByAccount(accountId)
            );
            patchState(store, { workspaces, loading: false, error: null });
          } catch (error: any) {
            patchState(store, { loading: false, error: error?.message ?? 'Load failed' });
          }
        },
        async syncPreferences(): Promise<void> {
          const user = authStore.user();
          if (!user) return;
          try {
            const prefs = await firstValueFrom(workspaceService.getUserPreferences(user.uid));
            if (prefs) {
              patchState(store, {
                favorites: prefs.favoriteWorkspaceIds,
                recents: prefs.recentWorkspaceIds,
              });
            }
          } catch (error) {
            console.error('[WorkspaceStore] Failed to load preferences', error);
          }
        },
        async setCurrentWorkspace(workspaceId: string): Promise<void> {
          const workspace = store.workspaces().find((ws) => ws.id === workspaceId) ?? null;
          if (!workspace) return;

          const recents = [workspaceId, ...store.recents().filter((id) => id !== workspaceId)].slice(
            0,
            10
          );

          patchState(store, {
            currentWorkspaceId: workspaceId,
            recents,
          });

          persistence.saveCurrentWorkspace(workspaceId);
          persistence.saveRecents(recents);

          const user = authStore.user();
          if (user) {
            await persistPreferences(user.uid);
          }

          eventBus.emit({
            type: 'workspace.changed',
            payload: { workspaceId, scope: workspace.scope ?? 'user' },
            scope: 'workspace',
            producer: 'WorkspaceStore',
            timestamp: Date.now(),
          });
        },
        switchWorkspace(workspace: Workspace): void {
          void this.setCurrentWorkspace(workspace.id);
        },
        setSearchQuery(query: string): void {
          patchState(store, { searchQuery: query });
        },
        async toggleFavorite(workspaceId: string): Promise<void> {
          const favorites = store.favorites();
          const nextFavorites = favorites.includes(workspaceId)
            ? favorites.filter((id) => id !== workspaceId)
            : [...favorites, workspaceId];

          patchState(store, { favorites: nextFavorites });
          persistence.saveFavorites(nextFavorites);

          const user = authStore.user();
          if (user) {
            await persistPreferences(user.uid);
          }
        },
        reset(): void {
          patchState(store, initialWorkspaceState);
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
        store.syncPreferences();
      });
    },
  })
);
