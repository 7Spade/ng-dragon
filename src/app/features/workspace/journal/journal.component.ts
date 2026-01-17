import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalStore } from '../../../core/workspace/stores/journal.store';
import { WorkspaceStore } from '../../../core/workspace/stores/workspace.store';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="module-container">
      <h1>📖 Journal</h1>

      <form class="card" (ngSubmit)="addEntry()">
        <div class="row">
          <label>Title</label>
          <input type="text" [(ngModel)]="title" name="title" required />
        </div>
        <div class="row">
          <label>Body</label>
          <textarea [(ngModel)]="body" name="body" rows="3" required></textarea>
        </div>
        <button type="submit" class="primary">Add entry</button>
      </form>

      @if (store.isLoading()) {
        <p>Loading journal...</p>
      } @else if (!store.hasEntries()) {
        <p class="empty">No journal entries for this workspace.</p>
      } @else {
        <div class="list">
          @for (entry of store.entries(); track entry.id) {
            <article class="entry">
              <header>
                <strong>{{ entry.title }}</strong>
                <span class="meta">v{{ entry.version }} • {{ entry.updatedAt | date:'short' }}</span>
              </header>
              <p>{{ entry.body }}</p>
              <button (click)="edit(entry.id)">Edit</button>
            </article>
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
    .card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 12px; background: #fff; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 10px; }
    .row { display: flex; flex-direction: column; gap: 6px; }
    input, textarea { width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .primary { align-self: flex-start; padding: 8px 12px; border-radius: 8px; border: none; background: #4f46e5; color: #fff; cursor: pointer; }
    .list { display: grid; gap: 10px; }
    .entry { border: 1px solid #e0e0e0; border-radius: 10px; padding: 12px; background: #fff; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .meta { color: #666; font-size: 12px; }
    .empty { color: #777; font-style: italic; }
  `]
})
export class JournalComponent {
  protected store = inject(JournalStore);
  private workspaceStore = inject(WorkspaceStore);
  protected title = '';
  protected body = '';

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

  addEntry(): void {
    if (!this.title || !this.body) return;
    this.store.add(this.title, this.body);
    this.title = '';
    this.body = '';
  }

  edit(id: string): void {
    const updated = prompt('Update entry text:');
    const entry = this.store.entries().find((e) => e.id === id);
    if (entry && updated !== null) {
      this.store.edit(id, entry.title, updated);
    }
  }
}
