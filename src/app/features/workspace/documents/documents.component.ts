import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentStore } from '../../../core/workspace/stores/document.store';
import { WorkspaceStore } from '../../../core/workspace/stores/workspace.store';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <h1>📄 Documents</h1>
      <p class="hint">Workspace-scoped documents stored in Firebase Storage.</p>

      <div class="upload">
        <label class="file-label">
          <input type="file" (change)="onFileSelect($event)" />
          <span>Upload file to {{ workspaceName() }}</span>
        </label>
        @if (docStore.isUploading()) {
          <span class="badge">Uploading...</span>
        }
      </div>

      @if (docStore.error()) {
        <div class="error">{{ docStore.error() }}</div>
      }

      @if (!docStore.hasDocuments()) {
        <p class="empty">No documents uploaded yet.</p>
      } @else {
        <div class="docs-grid">
          @for (doc of docStore.items(); track doc.id) {
            <article class="doc-card">
              <header>
                <strong>{{ doc.name }}</strong>
                <span class="meta">{{ doc.contentType }}</span>
              </header>
              <p class="meta">Uploaded {{ doc.uploadedAt | date:'short' }}</p>
              <a class="link" [href]="doc.downloadUrl" target="_blank" rel="noreferrer">Download</a>
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
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #333; }
    .hint { color: #666; margin-bottom: 1rem; }
    .upload { margin-bottom: 1rem; display: flex; align-items: center; gap: 12px; }
    .file-label { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px dashed #ccc; border-radius: 8px; cursor: pointer; }
    input[type='file'] { display: none; }
    .badge { background: #eef2ff; color: #4338ca; padding: 6px 10px; border-radius: 12px; font-size: 12px; }
    .error { color: #b91c1c; margin: 8px 0; }
    .empty { color: #777; font-style: italic; }
    .docs-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
    .doc-card { border: 1px solid #e0e0e0; border-radius: 10px; padding: 12px; background: #fff; }
    .doc-card header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .meta { color: #666; font-size: 12px; }
    .link { color: #4f46e5; text-decoration: none; font-weight: 600; }
  `]
})
export class DocumentsComponent {
  protected docStore = inject(DocumentStore);
  private workspaceStore = inject(WorkspaceStore);
  protected workspaceName = signal('workspace');

  constructor() {
    effect(
      () => {
        this.workspaceStore.activeWorkspace();
        this.workspaceStore.syncFromContext();
        this.workspaceName.set(
          this.workspaceStore.activeWorkspace()?.name || 'workspace'
        );
        this.docStore.load();
      },
      { allowSignalWrites: true }
    );
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.docStore.upload(file);
      (event.target as HTMLInputElement).value = '';
    }
  }
}
