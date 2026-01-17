import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditStore } from '@application/store/workspace/stores/audit.store';
import { WorkspaceStore } from '@application/store/workspace/stores/workspace.store';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <h1>📋 Audit Log</h1>

      <div class="actions">
        <button (click)="record('viewed', 'workspace')" class="primary">Record View</button>
        <button (click)="record('updated', 'settings')">Record Update</button>
      </div>

      @if (store.isLoading()) {
        <p>Loading audit log...</p>
      } @else if (!store.hasItems()) {
        <p class="empty">No audit entries for this workspace.</p>
      } @else {
        <div class="log">
          @for (entry of store.items(); track entry.id) {
            <div class="log-row">
              <div class="summary">
                <strong>{{ entry.action }}</strong> on {{ entry.target }}
              </div>
              <div class="meta">
                {{ entry.actor }} • {{ entry.timestamp | date:'short' }}
              </div>
            </div>
          }
        </div>
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
    .actions { display: flex; gap: 8px; margin-bottom: 12px; }
    button { padding: 8px 12px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer; }
    .primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
    .log { border: 1px solid #e0e0e0; border-radius: 12px; background: #fff; }
    .log-row { padding: 12px; border-bottom: 1px solid #e0e0e0; }
    .log-row:last-child { border-bottom: none; }
    .summary { font-weight: 700; }
    .meta { color: #666; font-size: 12px; }
    .empty { color: #777; font-style: italic; }
  `]
})
export class AuditComponent {
  protected store = inject(AuditStore);
  private workspaceStore = inject(WorkspaceStore);

  constructor() {
    effect(
      () => {
        this.workspaceStore.activeWorkspace();
        this.workspaceStore.syncFromContext();
        this.store.load();
      },
      { allowSignalWrites: true }
    );
  }

  record(action: string, target: string): void {
    this.store.record(action, target);
  }
}
