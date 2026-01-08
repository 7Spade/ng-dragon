import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzResultModule } from 'ng-zorro-antd/result';
import { Subject, takeUntil } from 'rxjs';
import { OrganizationSessionFacade } from '../../core/session/organization-session.facade';

@Component({
  selector: 'page-workspace-detail',
  template: `
    <ng-container *ngIf="name(); else empty">
      <nz-card nzTitle="{{ name() || 'New Workspace' }}" class="mb-lg">
        <p class="text-secondary mb-md">Workspace ID: {{ workspaceId() }}</p>
        <div class="d-flex gap-sm">
          <button nz-button nzType="primary" (click)="createTeam()">Create team</button>
          <button nz-button nzType="default" (click)="createPartner()">Create partner</button>
        </div>
      </nz-card>
    </ng-container>
    <ng-template #empty>
      <nz-result nzStatus="404" nzTitle="Workspace not found" nzExtra>
        <a nz-button nzType="primary" routerLink="/dashboard">Back to dashboard</a>
      </nz-result>
    </ng-template>
  `,
  styles: [
    `
      .gap-sm {
        gap: 8px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterLink, NzCardModule, NzButtonModule, NzResultModule]
})
export class WorkspaceDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly organizationFacade = inject(OrganizationSessionFacade);
  private readonly destroy$ = new Subject<void>();

  workspaceId = signal<string | null>(null);
  name = computed(() => (this.workspaceId() ? this.organizationFacade.getWorkspaceName(this.workspaceId()) : null));

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('workspaceId');
      this.workspaceId.set(id);
      if (id) {
        void this.organizationFacade.selectOrganization(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createTeam(): void {
    void this.organizationFacade.createTeam();
  }

  createPartner(): void {
    void this.organizationFacade.createPartner();
  }
}
