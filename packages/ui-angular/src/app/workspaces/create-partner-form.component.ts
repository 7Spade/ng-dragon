import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseAuthBridgeService } from '@core';
import { SHARED_IMPORTS } from '@shared';

import { CreatePartnerService } from './create-partner.service';

@Component({
  selector: 'app-create-partner-form',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  template: `
    <page-header [title]="pageTitle" [breadcrumb]="breadcrumb"></page-header>
    <nz-card>
      <form nz-form [formGroup]="form" (ngSubmit)="submit()" class="block">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="partnerName" nzRequired>{{ nameLabel }}</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <input nz-input id="partnerName" formControlName="partnerName" placeholder="Acme Partners" />
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
export class CreatePartnerFormComponent {
  readonly form = inject(FormBuilder).nonNullable.group({
    partnerName: ['', Validators.required]
  });

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly createPartnerService = inject(CreatePartnerService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly organizationId: string | null = this.route.snapshot.paramMap.get('orgId');

  readonly pageTitle = 'Create Partner';
  readonly nameLabel = 'Partner Name';
  readonly submitLabel = 'Create Partner';
  readonly breadcrumb = [
    { title: 'Home', link: '/dashboard' },
    { title: 'Partners' },
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
        this.errorMessage = 'You must be logged in to create a partner';
        this.cdr.markForCheck();
        return;
      }

      await this.createPartnerService.createPartner({
        accountId: user.uid,
        organizationId: this.organizationId ?? undefined,
        partnerName: this.form.value.partnerName ?? '',
        actorId: user.uid
      });

      this.successMessage = `Partner "${this.form.value.partnerName}" created successfully!`;
      this.form.reset();
      this.cdr.markForCheck();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to create partner';
      console.error('Error creating partner:', error);
      this.cdr.markForCheck();
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }
}
