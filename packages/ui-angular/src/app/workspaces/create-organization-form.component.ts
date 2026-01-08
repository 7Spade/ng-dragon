import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { SHARED_IMPORTS } from '@shared';
import { FirebaseAuthBridgeService } from '@core';

interface CreateOrganizationResponse {
  success: boolean;
  workspaceId: string;
  organizationName: string;
  message: string;
}

@Component({
  selector: 'app-create-organization-form',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  template: `
    <page-header [title]="'Create Organization'" [breadcrumb]="breadcrumb"></page-header>
    <nz-card>
      <form nz-form [formGroup]="form" (ngSubmit)="submit()" class="block">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="organizationName" nzRequired>Organization Name</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <input nz-input id="organizationName" formControlName="organizationName" placeholder="Acme Inc" />
          </nz-form-control>
        </nz-form-item>

        <div class="text-right">
          <button nz-button nzType="default" (click)="cancel()" class="mr-sm">Cancel</button>
          <button nz-button nzType="primary" [nzLoading]="submitting" [disabled]="form.invalid || submitting">
            Create Organization
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

  readonly breadcrumb = [
    { title: 'Home', link: '/dashboard' },
    { title: 'Organizations' },
    { title: 'Create' }
  ];

  private readonly functions = inject(Functions);
  private readonly router = inject(Router);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  
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
        this.errorMessage = 'You must be logged in to create an organization';
        return;
      }

      // Call the Cloud Function that uses firebase-admin
      const createOrgFunction = httpsCallable<{ organizationName: string }, CreateOrganizationResponse>(
        this.functions,
        'createOrganization'
      );

      const result = await createOrgFunction({
        organizationName: this.form.value.organizationName ?? ''
      });

      this.successMessage = result.data.message;
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to create organization';
      console.error('Error creating organization:', error);
    } finally {
      this.submitting = false;
    }
  }
}
