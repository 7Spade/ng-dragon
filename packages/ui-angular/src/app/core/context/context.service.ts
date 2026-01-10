import { Injectable, computed, effect, signal } from '@angular/core';

export type ContextType = 'personal' | 'organization' | 'team' | 'partner' | 'project' | 'user';

export interface ContextState {
  type: ContextType;
  id?: string | null;
  name?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ContextService {
  private readonly stored = this.loadStoredContext();
  private readonly current = signal<ContextState>(this.stored ?? { type: 'personal', id: null, name: 'Personal' });

  private readonly menuByContext: Record<ContextType, any[]> = {
    personal: [
      {
        text: 'Main',
        group: true,
        children: [
          { text: 'Dashboard', link: '/dashboard', icon: { type: 'icon', value: 'dashboard' } },
          { text: 'My Tasks', link: '/tasks/my', icon: { type: 'icon', value: 'check-circle' } },
          { text: 'Create Task', link: '/tasks/create', icon: { type: 'icon', value: 'plus' } },
          {
            text: 'Projects',
            icon: { type: 'icon', value: 'appstore' },
            children: [
              { text: 'Create Project', link: '/projects/create', icon: { type: 'icon', value: 'appstore-add' } },
              { text: 'My Projects', link: '/projects', icon: { type: 'icon', value: 'folder-open' } }
            ]
          }
        ]
      }
    ],
    organization: [
      {
        text: 'Organization',
        group: true,
        children: [
          { text: 'Dashboard', link: '/dashboard', icon: { type: 'icon', value: 'apartment' } },
          { text: 'Teams', link: '/teams', icon: { type: 'icon', value: 'team' } },
          { text: 'Members', link: '/members', icon: { type: 'icon', value: 'user' } },
          {
            text: 'Project Management',
            icon: { type: 'icon', value: 'project' },
            children: [{ text: 'Create Project', link: '/projects/create', icon: { type: 'icon', value: 'appstore-add' } }]
          },
          { text: 'Create Task', link: '/tasks/create', icon: { type: 'icon', value: 'plus' } },
          { text: 'Task List', link: '/tasks', icon: { type: 'icon', value: 'unordered-list' } }
        ]
      }
    ],
    team: [
      {
        text: 'Team',
        group: true,
        children: [
          { text: 'Team Dashboard', link: '/dashboard', icon: { type: 'icon', value: 'team' } },
          { text: 'Team Tasks', link: '/tasks/team', icon: { type: 'icon', value: 'unordered-list' } },
          { text: 'Create Task', link: '/tasks/create', icon: { type: 'icon', value: 'plus' } }
        ]
      }
    ],
    partner: [
      {
        text: 'Partner',
        group: true,
        children: [
          { text: 'Partner Dashboard', link: '/dashboard', icon: { type: 'icon', value: 'user-add' } },
          { text: 'Collaborations', link: '/collaborations', icon: { type: 'icon', value: 'share-alt' } }
        ]
      }
    ],
    project: [
      {
        text: 'Project',
        group: true,
        children: [
          { text: 'Project Dashboard', link: '/dashboard', icon: { type: 'icon', value: 'project' } },
          { text: 'Task List', link: '/tasks', icon: { type: 'icon', value: 'unordered-list' } }
        ]
      }
    ],
    user: []
  };

  readonly context = computed(() => this.current());
  readonly menu = computed(() => this.menuByContext[this.current().type] ?? []);

  constructor() {
    effect(() => {
      const ctx = this.current();
      this.persistContext(ctx);
    });
  }

  setContext(state: ContextState): void {
    this.current.set(state);
  }

  reset(): void {
    this.current.set({ type: 'personal', id: null, name: 'Personal' });
  }

  private loadStoredContext(): ContextState | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem('workspace.context');
      return raw ? (JSON.parse(raw) as ContextState) : null;
    } catch {
      return null;
    }
  }

  private persistContext(ctx: ContextState): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem('workspace.context', JSON.stringify(ctx));
    } catch {
      // ignore storage failures
    }
  }
}
