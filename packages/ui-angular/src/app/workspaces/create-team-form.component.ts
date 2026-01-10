import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseAuthBridgeService } from '@core';
import { SHARED_IMPORTS } from '@shared';

import { CreateTeamService } from './create-team.service';

@Component({
  selector: 'app-create-team-form',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  template: `
    <page-header [title]="pageTitle" [breadcrumb]="breadcrumb"></page-header>
    <nz-card>
      <form nz-form [formGroup]="form" (ngSubmit)="submit()" class="block">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="teamName" nzRequired>{{ nameLabel }}</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <input nz-input id="teamName" formControlName="teamName" placeholder="Design Team" />
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
export class CreateTeamFormComponent {
  readonly form = inject(FormBuilder).nonNullable.group({
    teamName: ['', Validators.required]
  });

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly createTeamService = inject(CreateTeamService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly organizationId: string | null = this.route.snapshot.paramMap.get('orgId');

  readonly pageTitle = 'Create Team';
  readonly nameLabel = 'Team Name';
  readonly submitLabel = 'Create Team';
  readonly breadcrumb = [
    { title: 'Home', link: '/dashboard' },
    { title: 'Teams' },
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
        this.errorMessage = 'You must be logged in to create a team';
        this.cdr.markForCheck();
        return;
      }

      await this.createTeamService.createTeam({
        accountId: user.uid,
        organizationId: this.organizationId ?? undefined,
        teamName: this.form.value.teamName ?? '',
        actorId: user.uid
      });

      this.successMessage = `Team "${this.form.value.teamName}" created successfully!`;
      this.form.reset();
      this.cdr.markForCheck();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to create team';
      console.error('Error creating team:', error);
      this.cdr.markForCheck();
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }
}
