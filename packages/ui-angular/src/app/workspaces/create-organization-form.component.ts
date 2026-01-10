import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseAuthBridgeService } from '@core';
import { CreateOrganizationService, CreateOrganizationRequest, WorkspaceTypeOption } from '@platform-adapters';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-create-organization-form',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  template: `
    <page-header [title]="pageTitle" [breadcrumb]="breadcrumb"></page-header>
    <nz-card>
      <form nz-form [formGroup]="form" (ngSubmit)="submit()" class="block">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="organizationName" nzRequired>{{ nameLabel }}</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <input nz-input id="organizationName" formControlName="organizationName" placeholder="Acme Inc" />
          </nz-form-control>
        </nz-form-item>

        <div class="text-right">
          <button nz-button nzType="default" (click)="cancel()" class="mr-sm">Cancel</button>
          <button nz-button nzType="primary" [nzLoading]="submitting" [disabled]="form.invalid || submitting">
            {{ submitLabel }}
          </button>
        </div>

        @if (errorMessage) {
          <nz-alert nzType="error" [nzMessage]="errorMessage" nzShowIcon class="mt-md"></nz-alert>
        }

        @if (successMessage) {
          <nz-alert nzType="success" [nzMessage]="successMessage" nzShowIcon class="mt-md"></nz-alert>
        }
      </form>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrganizationFormComponent {
  readonly form = inject(FormBuilder).nonNullable.group({
    organizationName: ['', Validators.required]
  });

  private readonly route = inject(ActivatedRoute);
  readonly workspaceType: WorkspaceTypeOption = this.toWorkspaceType(this.route.snapshot.data['workspaceType']);
  private readonly workspaceLabel = this.toWorkspaceLabel(this.workspaceType);

  readonly pageTitle = `Create ${this.workspaceLabel}`;
  readonly nameLabel = `${this.workspaceLabel} Name`;
  readonly submitLabel = `Create ${this.workspaceLabel}`;
  readonly breadcrumb = [{ title: 'Home', link: '/dashboard' }, { title: `${this.workspaceLabel}s` }, { title: 'Create' }];

  private readonly createOrgService = inject(CreateOrganizationService);
  private readonly router = inject(Router);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  private readonly cdr = inject(ChangeDetectorRef);

  submitting = false;
  errorMessage = '';
  successMessage = '';

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const user = this.authBridge.getCurrentUser();
      if (!user) {
        this.errorMessage = `You must be logged in to create a ${this.workspaceLabel.toLowerCase()}`;
        this.cdr.markForCheck();
        return;
      }

      // Send command to UseCase via service
      const payload: CreateOrganizationRequest = {
        accountId: user.uid,
        organizationName: this.form.value.organizationName ?? '',
        ownerUserId: user.uid,
        actorId: user.uid,
        workspaceType: this.workspaceType
      };

      await this.createOrgService.createOrganization(payload);

      this.successMessage = `${this.workspaceLabel} "${this.form.value.organizationName}" created successfully!`;
      this.cdr.markForCheck();

      // Navigate after a short delay to show success message
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to create organization';
      console.error('Error creating organization:', error);
      this.cdr.markForCheck();
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }

  private toWorkspaceType(value: unknown): WorkspaceTypeOption {
    const supported: WorkspaceTypeOption[] = ['organization', 'project', 'personal', 'team', 'partner'];
    return supported.includes(value as WorkspaceTypeOption) ? (value as WorkspaceTypeOption) : 'organization';
  }

  private toWorkspaceLabel(type: WorkspaceTypeOption): string {
    switch (type) {
      case 'team':
        return 'Team';
      case 'partner':
        return 'Partner';
      case 'project':
        return 'Project';
      case 'personal':
        return 'Workspace';
      default:
        return 'Organization';
    }
  }
}
