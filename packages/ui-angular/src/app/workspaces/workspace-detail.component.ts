import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { WorkspaceService, WorkspaceView } from '@platform-adapters';
import { SHARED_IMPORTS } from '@shared';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-workspace-detail',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ...SHARED_IMPORTS,
    NzDescriptionsModule,
    NzSkeletonModule,
    NzAlertModule
  ],
  template: `
    <page-header [title]="pageTitle()" [breadcrumb]="breadcrumb()"></page-header>

    <nz-card [nzBordered]="false">
      <ng-container *ngIf="workspace(); else loadingTpl">
        <div class="mb-md">
          <div class="d-flex align-items-center">
            <h2 class="mb0 mr-sm">{{ workspace()?.name || 'Workspace' }}</h2>
            <nz-tag nzColor="blue">{{ typeLabel(workspace()?.workspaceType) }}</nz-tag>
          </div>
          <p class="text-muted mb-sm">ID: {{ workspace()?.workspaceId }}</p>
          <p class="text-muted mb0">Owner: {{ workspace()?.ownerAccountId || '—' }}</p>
        </div>

        <nz-descriptions nzBordered [nzColumn]="1">
          <nz-descriptions-item nzTitle="Modules">
            <ng-container *ngIf="workspace()?.modules?.length; else noModulesTpl">
              <nz-tag
                *ngFor="let module of workspace()?.modules"
                [nzColor]="module.enabled ? 'green' : 'default'"
                class="mb-sm"
              >
                {{ module.moduleKey }} · {{ module.moduleType }}
              </nz-tag>
            </ng-container>
          </nz-descriptions-item>

          <nz-descriptions-item nzTitle="Members">
            <ng-container *ngIf="workspace()?.members?.length; else noMembersTpl">
              <nz-list nzSize="small" [nzSplit]="false">
                <nz-list-item *ngFor="let member of workspace()?.members">
                  <nz-list-item-meta
                    [nzTitle]="member.accountId"
                    [nzDescription]="('Role: ' + (member.role || 'member')) + ' · ' + (member.accountType || 'user')"
                  ></nz-list-item-meta>
                </nz-list-item>
              </nz-list>
            </ng-container>
          </nz-descriptions-item>
        </nz-descriptions>
      </ng-container>

      <ng-template #loadingTpl>
        <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 5 }" />
      </ng-template>
    </nz-card>

    <nz-alert
      *ngIf="!loading() && !workspace()"
      class="mt-md"
      nzType="error"
      nzShowIcon
      nzMessage="Workspace not found"
      nzDescription="The requested workspace could not be loaded. Please check the link or return to dashboard."
    ></nz-alert>

    <ng-template #noModulesTpl>
      <span class="text-muted">No modules registered yet.</span>
    </ng-template>

    <ng-template #noMembersTpl>
      <span class="text-muted">No members found.</span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly workspaceService = inject(WorkspaceService);

  private readonly workspaceId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      map(id => id ?? '')
    ),
    { initialValue: '' }
  );

  readonly loading = signal(true);

  readonly workspace = toSignal<WorkspaceView | null>(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        if (!id) return of(null);
        this.loading.set(true);
        return this.workspaceService.getWorkspaceById(id).pipe(catchError(() => of(null)));
      }),
      map(ws => {
        this.loading.set(false);
        return ws;
      })
    ),
    { initialValue: null }
  );

  readonly pageTitle = computed(() => {
    const name = this.workspace()?.name;
    return name ? `${name}` : 'Workspace';
  });

  readonly breadcrumb = computed(() => [
    { title: 'Home', link: '/dashboard' },
    { title: 'Workspaces', link: '/dashboard' },
    { title: this.workspace()?.name ?? this.workspaceId() ?? 'Detail' }
  ]);

  typeLabel(type?: WorkspaceView['workspaceType']): string {
    switch (type) {
      case 'organization':
        return 'Organization';
      case 'team':
        return 'Team';
      case 'partner':
        return 'Partner';
      case 'personal':
        return 'Personal';
      case 'project':
        return 'Project';
      default:
        return 'Workspace';
    }
  }
}
