import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModuleStore } from '@application/store/modules/stores/module.store';
import { SidebarStore } from '@application/store/ui/sidebar.store';
import { WorkspaceStore } from '@application/store/workspace/stores/workspace.store';
import { ModuleItemComponent } from './components/module-item/module-item.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ModuleItemComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected moduleStore = inject(ModuleStore);
  protected sidebarStore = inject(SidebarStore);
  protected workspaceStore = inject(WorkspaceStore);
  protected router = inject(Router);

  protected modules = computed(() => this.moduleStore.availableModules());
  protected expanded = computed(() => this.sidebarStore.expanded());
  protected workspaceId = computed(() => this.workspaceStore.currentWorkspaceId());
  protected isDragging = signal(false);

  protected toggleSidebar(): void {
    this.sidebarStore.toggle();
  }

  protected onDrop(event: CdkDragDrop<unknown>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const modules = [...this.modules()];
    moveItemInArray(modules, event.previousIndex, event.currentIndex);
  }

  protected navigateToModule(moduleRoute: string): void {
    const workspaceId = this.workspaceId();
    if (workspaceId) {
      this.router.navigate(['/workspace', workspaceId, moduleRoute]);
    }
  }
}
