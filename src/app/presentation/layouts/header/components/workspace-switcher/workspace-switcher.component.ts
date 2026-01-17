import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkspaceStore } from '@application/store/workspace/stores/workspace.store';
import { Workspace, WorkspaceType } from '@domain/workspace/entities/workspace.entity';
import { BREAKPOINTS } from '@shared/constants/breakpoints';
import { Router } from '@angular/router';
import { WorkspaceSwitcherBottomSheetComponent } from '../workspace-switcher-bottom-sheet/workspace-switcher-bottom-sheet.component';

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatBottomSheetModule,
  ],
  templateUrl: './workspace-switcher.component.html',
  styleUrl: './workspace-switcher.component.scss',
})
export class WorkspaceSwitcherComponent {
  protected workspaceStore = inject(WorkspaceStore);
  private bottomSheet = inject(MatBottomSheet);
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected isMenuOpen = signal(false);
  protected isMobile = signal(false);
  protected searchQuery = signal('');
  protected showArchived = signal(false);

  private searchTimeout: number | null = null;

  private menuTrigger = viewChild(MatMenuTrigger);
  private searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly WorkspaceType = WorkspaceType;
  protected currentWorkspace = this.workspaceStore.currentWorkspace;
  protected groupedWorkspaces = this.workspaceStore.groupedWorkspaces;
  protected archivedWorkspaces = this.workspaceStore.archivedWorkspaces;
  protected filteredWorkspaces = this.workspaceStore.filteredWorkspaces;

  protected useVirtualScroll = computed(() => this.workspaceStore.workspaces().length > 50);

  constructor() {
    this.breakpointObserver
      .observe([BREAKPOINTS.mobile])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => this.isMobile.set(result.matches));
  }

  onTriggerClick(): void {
    if (this.isMobile()) {
      this.bottomSheet.open(WorkspaceSwitcherBottomSheetComponent);
    }
  }

  onMenuOpened(): void {
    this.isMenuOpen.set(true);
    setTimeout(() => this.searchInput()?.nativeElement.focus(), 100);
  }

  onMenuClosed(): void {
    this.isMenuOpen.set(false);
  }

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

  async onSwitchWorkspace(workspace: Workspace): Promise<void> {
    if (workspace.id === this.currentWorkspace()?.id) return;
    await this.workspaceStore.setCurrentWorkspace(workspace.id);
    this.router.navigate(['/workspace', workspace.id, 'overview']);
    this.menuTrigger()?.closeMenu();
  }

  onCreateWorkspace(): void {
    this.menuTrigger()?.closeMenu();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    if (this.searchTimeout) {
      window.clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = window.setTimeout(() => {
      this.workspaceStore.setSearchQuery(query);
    }, 300);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.workspaceStore.setSearchQuery('');
  }

  isFavorite(workspaceId: string): boolean {
    return this.workspaceStore.favorites().includes(workspaceId);
  }

  async onToggleFavorite(event: Event, workspaceId: string): Promise<void> {
    event.stopPropagation();
    await this.workspaceStore.toggleFavorite(workspaceId);
  }

  toggleArchived(): void {
    this.showArchived.update((value) => !value);
  }
}
