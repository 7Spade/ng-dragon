import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzResultModule } from 'ng-zorro-antd/result';
import { Subject, takeUntil } from 'rxjs';
import { OrganizationSessionFacade } from '../../core/session/organization-session.facade';

@Component({
  selector: 'page-organization-detail',
  template: `
    <ng-container *ngIf="selectedName as name; else empty">
      <nz-card nzTitle="{{ name }}" class="mb-lg">
        <p class="text-secondary mb-md">Organization ID: {{ organizationId }}</p>
        <div class="d-flex gap-sm">
          <button nz-button nzType="primary" (click)="createTeam()">Create team</button>
          <button nz-button nzType="default" (click)="createPartner()">Create partner</button>
        </div>
      </nz-card>
    </ng-container>
    <ng-template #empty>
      <nz-result nzStatus="404" nzTitle="Organization not found" nzExtra>
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
export class OrganizationDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly organizationFacade = inject(OrganizationSessionFacade);
  private readonly destroy$ = new Subject<void>();

  organizationId: string | null = null;
  selectedName: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const orgId = params.get('id');
      this.organizationId = orgId;
      if (orgId) {
        void this.organizationFacade.selectOrganization(orgId).then(() => {
          this.selectedName = this.organizationFacade.selectedOrganizationName();
        });
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
