import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { WorkspaceStore } from '@application/store/workspace/stores/workspace.store';

@Component({
  selector: 'app-workspace-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './workspace-command-palette.component.html',
  styleUrl: './workspace-command-palette.component.scss',
})
export class WorkspaceCommandPaletteComponent {
  private dialogRef = inject(MatDialogRef<WorkspaceCommandPaletteComponent>);
  private workspaceStore = inject(WorkspaceStore);
  private router = inject(Router);

  protected searchQuery = signal('');

  protected filteredWorkspaces = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const workspaces = this.workspaceStore.workspaces();
    if (!query) return workspaces.slice(0, 10);
    return workspaces.filter((workspace) => workspace.name.toLowerCase().includes(query));
  });

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  async selectWorkspace(workspaceId: string): Promise<void> {
    await this.workspaceStore.setCurrentWorkspace(workspaceId);
    this.router.navigate(['/workspace', workspaceId, 'overview']);
    this.dialogRef.close();
  }
}
