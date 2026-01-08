import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { CreateTeamService } from './create-team.service';
import { StartupService } from '../core/startup/startup.service';

/**
 * Modal component for creating a team within an organization
 * Follows DDD: UI sends command only, no direct domain logic
 */
@Component({
  selector: 'app-create-team-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Team Name</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="Please enter team name">
          <input nz-input formControlName="teamName" placeholder="Enter team name" />
        </nz-form-control>
      </nz-form-item>

      <div class="modal-footer">
        <button nz-button type="button" (click)="cancel()">Cancel</button>
        <button nz-button nzType="primary" type="submit" [nzLoading]="loading" [disabled]="!form.valid">
          Create Team
        </button>
      </div>
    </form>
  `,
  styles: [`
    .modal-footer {
      text-align: right;
      margin-top: 24px;
    }
    .modal-footer button {
      margin-left: 8px;
    }
  `]
})
export class CreateTeamModalComponent {
  @Input() organizationId!: string;

  private fb = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private message = inject(NzMessageService);
  private createTeamService = inject(CreateTeamService);
  private startupService = inject(StartupService);

  form: FormGroup;
  loading = false;

  constructor() {
    this.form = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  async submit(): Promise<void> {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    this.loading = true;
    try {
      const { teamName } = this.form.value;
      
      // Call CreateTeamUseCase via service
      const teamId = await this.createTeamService.createTeam({
        workspaceId: this.organizationId,
        teamName,
        creatorUserId: '' // Will be filled by service from auth context
      });

      this.message.success('Team created successfully');
      
      // Refresh menu to show new team
      this.startupService.refreshMenuForCurrentContext(this.organizationId, null);
      
      this.modal.close(teamId);
    } catch (error: any) {
      this.message.error(error?.message || 'Failed to create team');
      this.loading = false;
    }
  }

  cancel(): void {
    this.modal.close();
  }
}
