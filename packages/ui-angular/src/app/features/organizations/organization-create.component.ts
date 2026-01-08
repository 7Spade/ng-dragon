import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrganizationSessionFacade } from '../../core/session/organization-session.facade';

@Component({
  selector: 'page-organization-create',
  template: `
    <nz-card nzTitle="Create organization" class="mt-lg">
      <form nz-form [formGroup]="form" (ngSubmit)="submit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="name" nzRequired>Name</nz-form-label>
          <nz-form-control [nzSpan]="18" nzErrorTip="Please input organization name">
            <input nz-input id="name" formControlName="name" placeholder="Organization name" />
          </nz-form-control>
        </nz-form-item>
        <div class="d-flex gap-sm">
          <button nz-button nzType="primary" [disabled]="form.invalid || submitting" [nzLoading]="submitting">Create</button>
          <a nz-button routerLink="/dashboard">Cancel</a>
        </div>
      </form>
    </nz-card>
  `,
  styles: [
    `
      .mt-lg {
        margin-top: 24px;
      }
      .gap-sm {
        gap: 8px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzCardModule, RouterLink]
})
export class OrganizationCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(OrganizationSessionFacade);
  private readonly message = inject(NzMessageService);

  submitting = false;
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.submitting = true;
    const name = this.form.value.name ?? 'New Organization';
    try {
      await this.facade.createOrganization(name);
      this.message.success('Organization created');
    } finally {
      this.submitting = false;
    }
  }
}
