import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { FirebaseAuthBridgeService } from '@core';
import { CreateTeamService } from './create-team.service';
import { ContextService } from '../core/context/context.service';

@Component({
  selector: 'app-create-team-form',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  template: `
    <page-header [title]="'Create Team'" [breadcrumb]="breadcrumb"></page-header>
    <nz-card>
      <form nz-form [formGroup]="form" (ngSubmit)="submit()" class="block">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="teamName" nzRequired>Team Name</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <input nz-input id="teamName" formControlName="teamName" placeholder="Engineering Team" />
          </nz-form-control>
        </nz-form-item>

        <div class="text-right">
          <button nz-button nzType="default" (click)="cancel()" class="mr-sm">Cancel</button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting" [disabled]="form.invalid || submitting">
            Create Team
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

  readonly breadcrumb = [
    { title: 'Home', link: '/dashboard' },
    { title: 'Teams' },
    { title: 'Create' }
  ];

  private readonly createTeamService = inject(CreateTeamService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  private readonly contextService = inject(ContextService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  submitting = false;
  errorMessage = '';
  successMessage = '';
  
  private organizationId: string | null = null;

  constructor() {
    // Get organization ID from route or context
    this.route.paramMap.subscribe(params => {
      this.organizationId = params.get('orgId');
    });

    // If no orgId in route, try to get from context
    if (!this.organizationId) {
      this.organizationId = this.contextService.contextId();
    }
  }

  cancel(): void {
    if (this.organizationId) {
      this.router.navigate(['/organizations', this.organizationId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
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

      if (!this.organizationId) {
        this.errorMessage = 'Organization context is required to create a team';
        this.cdr.markForCheck();
        return;
      }

      // Generate workspace ID for team
      const workspaceId = `ws-team-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Send command to application service
      const resultWorkspaceId = await this.createTeamService.createTeam({
        workspaceId,
        accountId: user.uid,
        teamName: this.form.value.teamName ?? '',
        organizationId: this.organizationId,
        actorId: user.uid,
        createdAt: new Date().toISOString()
      });

      this.successMessage = `Team "${this.form.value.teamName}" created successfully!`;
      this.cdr.markForCheck();
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        this.router.navigate(['/organizations', this.organizationId]);
      }, 1500);
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
