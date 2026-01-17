import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStore } from '@application/store/auth/stores/auth.store';
import { SidebarStore } from '@application/store/ui/sidebar.store';
import { HeaderComponent } from '@presentation/layouts/header/header.component';
import { SidebarComponent } from '@presentation/layouts/sidebar/sidebar.component';
import { WorkspaceCommandPaletteComponent } from '@shared/components/workspace-command-palette/workspace-command-palette.component';
import { KeyboardShortcutService } from '@shared/services/keyboard-shortcut.service';
import { BREAKPOINTS } from '@shared/constants/breakpoints';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MatDialogModule,
    WorkspaceCommandPaletteComponent,
  ],
  template: `
    @if (authStore.isAuthenticated()) {
      <app-header />
      <app-sidebar />
    }

    <main
      id="maincontent"
      class="app-main"
      [class.authenticated]="authStore.isAuthenticated()"
      [style.marginLeft.px]="authStore.isAuthenticated() ? sidebarOffset() : 0"
    >
      <router-outlet></router-outlet>
    </main>

    @defer (on interaction) {
      <app-workspace-command-palette class="command-palette-preload" />
    } @placeholder {
      <span class="command-palette-placeholder"></span>
    }
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .app-main {
      padding-top: 0;
      min-height: 100vh;
    }

    .app-main.authenticated {
      padding-top: 64px;
    }

    .command-palette-preload {
      display: none;
    }
  `],
})
export class AppComponent {
  private dialog = inject(MatDialog);
  private shortcutService = inject(KeyboardShortcutService);
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  protected authStore = inject(AuthStore);
  protected sidebarStore = inject(SidebarStore);
  protected isMobile = signal(false);
  protected sidebarOffset = computed(() => (this.isMobile() ? 0 : this.sidebarStore.sidebarWidth()));

  constructor() {
    this.breakpointObserver
      .observe([BREAKPOINTS.mobile])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => this.isMobile.set(result.matches));

    this.shortcutService
      .register({ key: 'k', ctrl: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.authStore.isAuthenticated()) {
          return;
        }
        this.dialog.open(WorkspaceCommandPaletteComponent, {
          width: '600px',
          panelClass: 'command-palette-dialog',
        });
      });
  }
}
