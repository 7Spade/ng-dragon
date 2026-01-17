import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionStore } from '../../../core/workspace/stores/permission.store';
import { Capability } from '../../../core/workspace/models/workspace.model';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <h1>🔒 Permissions</h1>

      @if (store.isLoading()) {
        <p>Loading role matrix...</p>
      } @else {
        <div class="table">
          <div class="header">
            <div class="cell role">Role</div>
            @for (cap of capabilities; track cap) {
              <div class="cell">{{ cap }}</div>
            }
          </div>
          @for (row of store.roles(); track row.role) {
            <div class="row">
              <div class="cell role">{{ row.role }}</div>
              @for (cap of capabilities; track cap) {
                <div class="cell">
                  <input
                    type="checkbox"
                    [checked]="row.capabilities.includes(cap)"
                    (change)="toggle(row.role, cap, $any($event.target).checked)"
                  />
                </div>
              }
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
    .table { border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
    .header, .row { display: grid; grid-template-columns: 160px repeat(auto-fit, minmax(120px, 1fr)); }
    .cell { padding: 10px; border-bottom: 1px solid #e0e0e0; }
    .header .cell { font-weight: 700; background: #f8fafc; }
    .role { font-weight: 700; }
  `]
})
export class PermissionsComponent {
  protected store = inject(PermissionStore);
  protected capabilities: Capability[] = [];

  constructor() {
    effect(
      () => {
        this.store.load();
        this.capabilities = this.store.capabilities();
      },
      { allowSignalWrites: true }
    );
  }

  toggle(role: string, cap: string, enabled: boolean): void {
    this.store.toggle(role, cap as any, enabled);
  }
}
