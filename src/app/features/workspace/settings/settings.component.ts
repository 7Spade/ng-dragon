import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsStore } from '../../../core/workspace/stores/settings.store';
import { WorkspaceStore } from '../../../core/workspace/stores/workspace.store';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="module-container">
      <h1>⚙️ Settings</h1>

      @if (store.isLoading()) {
        <p>Loading settings...</p>
      } @else {
        <section class="card">
          <h2>Workspace</h2>
          <p class="hint">Applied to {{ workspaceName }}</p>
          <label class="row">
            <span>Default workspace</span>
            <input
              type="text"
              [value]="store.settings().defaultWorkspaceId || ''"
              (input)="updateDefault($any($event.target).value)"
              placeholder="workspace id"
            />
          </label>
          <label class="row">
            <span>Notifications</span>
            <input
              type="checkbox"
              [checked]="store.settings().notifications"
              (change)="toggle('notifications', $any($event.target).checked)"
            />
          </label>
          <label class="row">
            <span>Theme</span>
            <select
              [ngModel]="store.settings().theme"
              (ngModelChange)="toggleTheme($event)"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label class="row">
            <span>Compact view</span>
            <input
              type="checkbox"
              [checked]="store.settings().preferences['compactView']"
              (change)="togglePreference('compactView', $any($event.target).checked)"
            />
          </label>
          <label class="row">
            <span>Audit email alerts</span>
            <input
              type="checkbox"
              [checked]="store.settings().preferences['auditEmails']"
              (change)="togglePreference('auditEmails', $any($event.target).checked)"
            />
          </label>
        </section>
      }
    </div>
  `,
  styles: [`
    .module-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 { font-size: 2rem; margin-bottom: 1rem; color: #333; }
    .card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 16px; background: #fff; }
    .row { display: flex; align-items: center; justify-content: space-between; margin: 10px 0; }
    .row span { font-weight: 600; }
    input[type='text'], select { min-width: 260px; padding: 6px 8px; }
    .hint { color: #666; margin: 0 0 12px; }
  `]
})
export class SettingsComponent {
  protected store = inject(SettingsStore);
  private workspaceStore = inject(WorkspaceStore);
  protected workspaceName = 'workspace';

  constructor() {
    effect(
      () => {
        this.workspaceStore.activeWorkspace();
        this.workspaceStore.syncFromContext();
        this.workspaceName = this.workspaceStore.activeWorkspace()?.name ?? 'workspace';
        this.store.load();
      },
      { allowSignalWrites: true }
    );
  }

  toggle(key: 'notifications', value: boolean): void {
    this.store.update({ ...this.store.settings(), [key]: value });
  }

  togglePreference(key: string, value: boolean): void {
    const updated = {
      ...this.store.settings().preferences,
      [key]: value,
    };
    this.store.update({ ...this.store.settings(), preferences: updated });
  }

  toggleTheme(theme: 'system' | 'light' | 'dark'): void {
    this.store.update({ ...this.store.settings(), theme });
  }

  updateDefault(value: string): void {
    this.store.update({ ...this.store.settings(), defaultWorkspaceId: value || null });
  }
}
