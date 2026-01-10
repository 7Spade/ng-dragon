import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseAuthBridgeService } from '@core';
import { SHARED_IMPORTS } from '@shared';

import { CreateProjectService } from './create-project.service';

@Component({
  selector: 'app-create-project-form',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  template: `
    <page-header [title]="pageTitle" [breadcrumb]="breadcrumb"></page-header>
    <nz-card>
      <form nz-form [formGroup]="form" (ngSubmit)="submit()" class="block">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="projectName" nzRequired>{{ nameLabel }}</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <input nz-input id="projectName" formControlName="projectName" placeholder="New Project" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="description">Description</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <textarea nz-input id="description" formControlName="description" rows="3"></textarea>
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
export class CreateProjectFormComponent {
  readonly form = inject(FormBuilder).nonNullable.group({
    projectName: ['', Validators.required],
    description: ['']
  });

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly createProjectService = inject(CreateProjectService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly organizationId: string | null = this.route.snapshot.paramMap.get('orgId');

  readonly pageTitle = 'Create Project';
  readonly nameLabel = 'Project Name';
  readonly submitLabel = 'Create Project';
  readonly breadcrumb = [
    { title: 'Home', link: '/dashboard' },
    { title: 'Projects' },
    { title: 'Create' }
  ];

  submitting = false;
  errorMessage = '';
  successMessage = '';

  cancel(): void {
    const fallback = this.organizationId ? `/organizations/${this.organizationId}` : '/dashboard';
    this.router.navigate([fallback]);
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const user = this.authBridge.getCurrentUser();
      if (!user) {
        this.errorMessage = 'You must be logged in to create a project';
        this.cdr.markForCheck();
        return;
      }

      await this.createProjectService.createProject({
        accountId: user.uid,
        organizationId: this.organizationId ?? undefined,
        projectName: this.form.value.projectName ?? '',
        description: this.form.value.description ?? '',
        actorId: user.uid
      });

      this.successMessage = `Project "${this.form.value.projectName}" created successfully!`;
      this.form.reset();
      this.cdr.markForCheck();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      console.error('Error creating project:', error);
      this.cdr.markForCheck();
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }
}
