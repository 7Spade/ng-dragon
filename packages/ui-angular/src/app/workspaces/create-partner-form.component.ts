import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CreatePartnerService } from './create-partner.service';
import { FirebaseAuthBridgeService, ContextService } from '@core';
import { CreatePartnerCommand } from '@saas-domain';

@Component({
  selector: 'app-create-partner-form',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzCardModule],
  template: `
    <nz-card nzTitle="Create Partner" [nzExtra]="extraTemplate">
      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Partner Name</nz-form-label>
          <nz-form-control [nzSpan]="14" nzErrorTip="Please enter partner name">
            <input nz-input formControlName="name" placeholder="Enter partner name" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6">Description</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <textarea nz-input formControlName="description" placeholder="Optional description" [nzAutosize]="{ minRows: 3, maxRows: 6 }"></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control [nzSpan]="14" [nzOffset]="6">
            <button nz-button nzType="primary" type="submit" [disabled]="!form.valid || submitting">
              {{ submitting ? 'Creating...' : 'Create Partner' }}
            </button>
            <button nz-button type="button" (click)="cancel()" class="ml-sm">Cancel</button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
    <ng-template #extraTemplate>
      <small class="text-muted">Create a new partner workspace in this organization</small>
    </ng-template>
  `
})
export class CreatePartnerFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly createPartnerService = inject(CreatePartnerService);
  private readonly authBridge = inject(FirebaseAuthBridgeService);
  private readonly contextService = inject(ContextService);

  form: FormGroup;
  submitting = false;
  organizationId: string;

  constructor() {
    // Get organization ID from route params
    this.organizationId = this.route.snapshot.paramMap.get('orgId') || '';
    
    // Verify we're in organization context
    if (!this.contextService.isOrganizationContext() || this.contextService.contextId() !== this.organizationId) {
      console.warn('Not in correct organization context for partner creation');
      // Switch to the organization context
      this.contextService.switchToOrganizationContext(this.organizationId, '');
    }

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid || this.submitting) return;

    this.submitting = true;
    try {
      const user = this.authBridge.getCurrentUser();
      if (!user) {
        console.error('No authenticated user');
        this.submitting = false;
        return;
      }

      // Generate workspace ID using timestamp-based pattern (matching organization creation)
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const workspaceId = `ws-${timestamp}-${randomSuffix}`;
      
      // Generate trace ID for event sourcing
      const traceId = `trace-${timestamp}-${randomSuffix}`;

      const command: CreatePartnerCommand = {
        workspaceId,
        accountId: user.uid,
        partnerName: this.form.value.name,
        organizationId: this.organizationId,
        actorId: user.uid,
        traceId,
        createdAt: new Date().toISOString(),
        causedBy: ['user-action'],
        modules: []
      };

      const partnerId = await this.createPartnerService.createPartner(command);
      console.log('Partner created successfully:', partnerId);
      
      // Navigate back to dashboard
      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      console.error('Error creating partner:', error);
      this.submitting = false;
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
