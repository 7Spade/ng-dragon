import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AuthStore } from '@application/store/auth/stores/auth.store';
import { ContextStore } from '@application/store/context/stores/context.store';
import { Workspace, WorkspaceScope } from '@domain/workspace/models/workspace.model';
import { EventBusStore } from '@application/store/event-bus/stores/event-bus.store';

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  activeWorkspaceId: null,
};

const buildWorkspaceId = (scope: WorkspaceScope, contextId: string) =>
  `${scope}:${contextId}`;

export const WorkspaceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ workspaces, activeWorkspaceId }) => ({
    activeWorkspace: computed(() =>
      workspaces().find((w) => w.id === activeWorkspaceId()) || null
    ),
    byScope: computed(() => {
      const grouped: Record<WorkspaceScope, Workspace[]> = {
        user: [],
        organization: [],
        team: [],
        partner: [],
      };
      workspaces().forEach((ws) => grouped[ws.scope].push(ws));
      return grouped;
    }),
    hasMultiple: computed(() => workspaces().length > 1),
  })),
  withMethods(
    (
      store,
      authStore = inject(AuthStore),
      contextStore = inject(ContextStore),
      eventBus = inject(EventBusStore)
    ) => ({
      syncFromContext(): void {
        const user = authStore.user();
        if (!user) {
          patchState(store, initialState);
          return;
        }

        const contexts = contextStore.available();
        const current = contextStore.current();
        const seeds: Workspace[] = [];

        // Personal workspace
        seeds.push({
          id: buildWorkspaceId('user', user.uid),
          name: user.email || 'My Workspace',
          contextId: user.uid,
          ownerId: user.uid,
          scope: 'user',
          capabilities: [
            'documents:read',
            'documents:write',
            'settings:write',
            'audit:read',
            'journal:write',
            'permissions:manage',
          ],
        });

        contexts.organizations.forEach((org) => {
          seeds.push({
            id: buildWorkspaceId('organization', org.organizationId),
            name: org.name,
            contextId: org.organizationId,
            ownerId: user.uid,
            scope: 'organization',
            capabilities: [
              'documents:read',
              'documents:write',
              'settings:write',
              'audit:read',
              'journal:write',
              'permissions:manage',
            ],
          });
        });

        contexts.teams.forEach((team) => {
          seeds.push({
            id: buildWorkspaceId('team', team.teamId),
            name: team.name,
            contextId: team.teamId,
            ownerId: user.uid,
            scope: 'team',
            capabilities: [
              'documents:read',
              'documents:write',
              'settings:write',
              'audit:read',
              'journal:write',
            ],
          });
        });

        contexts.partners.forEach((partner) => {
          seeds.push({
            id: buildWorkspaceId('partner', partner.partnerId),
            name: partner.name,
            contextId: partner.partnerId,
            ownerId: user.uid,
            scope: 'partner',
            capabilities: ['documents:read', 'audit:read'],
          });
        });

        const resolveContextId = () => {
          if (!current) return null;
          switch (current.type as WorkspaceScope) {
            case 'user':
              return (current as any).userId;
            case 'organization':
              return (current as any).organizationId;
            case 'team':
              return (current as any).teamId;
            case 'partner':
              return (current as any).partnerId;
            default:
              return null;
          }
        };

        const resolvedContextId = resolveContextId();

        patchState(store, {
          workspaces: seeds,
          activeWorkspaceId:
            store.activeWorkspaceId() ||
            (current && resolvedContextId
              ? buildWorkspaceId(current.type as WorkspaceScope, resolvedContextId)
              : seeds[0]?.id ?? null),
        });
      },
      switchWorkspace(workspace: Workspace): void {
        patchState(store, { activeWorkspaceId: workspace.id });
        eventBus.emit({
          type: 'workspace.changed',
          payload: {
            workspaceId: workspace.id,
            scope: workspace.scope,
          },
          scope: 'workspace',
          producer: 'WorkspaceStore',
          timestamp: Date.now(),
        });
      },
    })
  )
);
