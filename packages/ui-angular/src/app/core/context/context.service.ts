import { Injectable, signal } from '@angular/core';
import { WorkspaceView } from '@platform-adapters';

@Injectable({ providedIn: 'root' })
export class ContextService {
  readonly activeWorkspace = signal<WorkspaceView | null>(null);

  setActive(workspace: WorkspaceView | null): void {
    this.activeWorkspace.set(workspace);
  }
}
