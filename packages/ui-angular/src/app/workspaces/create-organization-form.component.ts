import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injectable, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SHARED_IMPORTS } from '@shared';
import { CreateOrganizationCommand } from '@saas-domain/src/commands/CreateOrganizationCommand';
import { WorkspaceApplicationService } from '@saas-domain/src/application/WorkspaceApplicationService';
import { WorkspaceFactory } from '@saas-domain/src/domain/WorkspaceFactory';
import { WorkspaceRepository } from '@saas-domain/src/repositories/WorkspaceRepository';
import { WorkspaceCreatedEvent } from '@saas-domain/src/events/WorkspaceCreatedEvent';
import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';

class WorkspaceHttpRepository implements WorkspaceRepository {
  constructor(private readonly http: HttpClient) {}

  async appendWorkspaceEvent(event: WorkspaceCreatedEvent): Promise<void> {
    await firstValueFrom(
      this.http
        .post('/api/workspace-events', event, { responseType: 'text' })
        .pipe(catchError(() => of('')))
    );
  }

  async saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
    await firstValueFrom(
      this.http.post('/api/workspaces', snapshot).pipe(catchError(() => of(snapshot)))
    );
  }

  async getWorkspaceSnapshot(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    const result = await firstValueFrom(
      this.http.get<WorkspaceSnapshot>(`/api/workspaces/${workspaceId}`).pipe(catchError(() => of(null)))
    );
    return result;
  }

  async listWorkspaces(): Promise<WorkspaceSnapshot[]> {
    const result = await firstValueFrom(
      this.http.get<WorkspaceSnapshot[]>(`/api/workspaces`).pipe(catchError(() => of([])))
    );
    return result ?? [];
  }
}

@Injectable({ providedIn: 'root' })
export class WorkspaceApplicationClient {
  private readonly service: WorkspaceApplicationService;

  constructor(private readonly http: HttpClient) {
    this.service = new WorkspaceApplicationService(new WorkspaceHttpRepository(http), new WorkspaceFactory());
  }

  createOrganization(command: CreateOrganizationCommand): Promise<WorkspaceCreatedEvent> {
    return this.service.createOrganization(command);
  }
}

@Component({
  selector: 'app-create-organization-form',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()" class="block">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzFor="organizationName" nzRequired>Organization Name</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input id="organizationName" formControlName="organizationName" placeholder="Acme Inc" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzFor="accountId" nzRequired>Account Id</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input id="accountId" formControlName="accountId" placeholder="actor-account-id" />
        </nz-form-control>
      </nz-form-item>

      <div class="text-right">
        <button nz-button nzType="primary" [disabled]="form.invalid || submitting">Create Organization</button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrganizationFormComponent {
  readonly form = inject(FormBuilder).nonNullable.group({
    organizationName: ['', Validators.required],
    accountId: ['', Validators.required]
  });

  private readonly client = inject(WorkspaceApplicationClient);
  private readonly router = inject(Router);
  submitting = false;

  async submit(): Promise<void> {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;

    const workspaceId = this.createWorkspaceId();
    const accountId = this.form.value.accountId ?? '';
    const command: CreateOrganizationCommand = {
      workspaceId,
      accountId,
      organizationName: this.form.value.organizationName ?? '',
      actorId: accountId,
      traceId: workspaceId
    };

    try {
      const event = await this.client.createOrganization(command);
      const targetWorkspaceId = event.workspaceId ?? workspaceId;
      await this.router.navigate(['/workspaces', targetWorkspaceId]);
    } finally {
      this.submitting = false;
    }
  }

  private createWorkspaceId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `ws-${Date.now()}`;
  }
}
