import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { WorkspaceStore } from '@application/store/workspace/stores/workspace.store';
import { WorkspaceType } from '@domain/workspace/entities/workspace.entity';

@Component({
  selector: 'app-workspace-switcher-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './workspace-switcher-bottom-sheet.component.html',
  styleUrl: './workspace-switcher-bottom-sheet.component.scss',
})
export class WorkspaceSwitcherBottomSheetComponent {
  private bottomSheetRef = inject(MatBottomSheetRef<WorkspaceSwitcherBottomSheetComponent>);
  protected workspaceStore = inject(WorkspaceStore);
  private router = inject(Router);
  protected searchQuery = signal('');

  protected filteredWorkspaces = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.workspaceStore.workspaces().filter((workspace) =>
      workspace.name.toLowerCase().includes(query)
    );
  });

  protected currentWorkspace = this.workspaceStore.currentWorkspace;

  getWorkspaceGradient(type: WorkspaceType): string {
    const gradients: Record<WorkspaceType, string> = {
      [WorkspaceType.Project]: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      [WorkspaceType.Department]: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      [WorkspaceType.Client]: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      [WorkspaceType.Campaign]: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      [WorkspaceType.Product]: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      [WorkspaceType.Internal]: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    };

    return gradients[type] || gradients[WorkspaceType.Project];
  }

  async selectWorkspace(workspaceId: string): Promise<void> {
    await this.workspaceStore.setCurrentWorkspace(workspaceId);
    this.router.navigate(['/workspace', workspaceId, 'overview']);
    this.bottomSheetRef.dismiss();
  }
}
