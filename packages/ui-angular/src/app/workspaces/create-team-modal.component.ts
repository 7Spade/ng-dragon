import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SHARED_IMPORTS } from '@shared';
import { FirebaseAuthBridgeService } from '@core';
import { CreateTeamService } from './create-team.service';
import { StartupService } from '../core/startup/startup.service';

@Component({
  selector: 'app-create-team-modal',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label nzRequired>Team Name</nz-form-label>
        <nz-form-control [nzErrorTip]="'Please enter a team name (at least 2 characters)'">
          <input nz-input formControlName="teamName" placeholder="Engineering Team" />
        </nz-form-control>
      </nz-form-item>

      @if (errorMessage) {
        <nz-alert nzType="error" [nzMessage]="errorMessage" nzShowIcon class="mb-md"></nz-alert>
      }

      <div class="text-right">
        <button nz-button nzType="default" (click)="cancel()" class="mr-sm">Cancel</button>
        <button nz-button nzType="primary" [nzLoading]="submitting" [disabled]="form.invalid || submitting">
          Create Team
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTeamModalComponent {
  @Input() workspaceId!: string;

  readonly form = inject(FormBuilder).nonNullable.group({
    teamName: ['', [Validators.required, Validators.minLength(2)]]
  });

  private readonly createTeamService = inject(CreateTeamService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  private readonly startupService = inject(StartupService);
  private readonly modal = inject(NzModalRef);
  private readonly cdr = inject(ChangeDetectorRef);
  
  submitting = false;
  errorMessage = '';

  cancel(): void {
    this.modal.close();
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.submitting) return;
    
    this.submitting = true;
    this.errorMessage = '';

    try {
      const user = this.authBridge.getCurrentUser();
      if (!user) {
        this.errorMessage = 'You must be logged in to create a team';
        this.cdr.markForCheck();
        return;
      }

      // Send command to UseCase via service
      const teamId = await this.createTeamService.createTeam({
        workspaceId: this.workspaceId,
        teamName: this.form.value.teamName ?? '',
        createdByUserId: user.uid
      });

      // Refresh menu to show new team (pass null for teamId as we're staying in org context)
      try {
        await this.startupService.refreshMenuForCurrentContext(this.workspaceId, null);
      } catch (refreshError) {
        console.warn('Menu refresh failed after team creation', refreshError);
      }
      
      // Close modal with success
      this.modal.close({ success: true, teamId });
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
