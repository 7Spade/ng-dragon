import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateProjectService } from './create-project.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CreateProjectCommand } from '@saas-domain';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * CreateProjectFormComponent
 * 
 * Form for creating a new Project (Logical Container)
 * 
 * Automatically activates 4 base modules:
 * 1. Identity/Members Module
 * 2. Access Control Module
 * 3. Settings/Profile Module
 * 4. Audit/Activity Module
 */
@Component({
  selector: 'app-create-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  template: `
    <form nz-form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Project Name</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input project name!">
          <input nz-input formControlName="projectName" placeholder="Enter project name" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">Description</nz-form-label>
        <nz-form-control [nzSpan]="14">
          <textarea 
            nz-input 
            formControlName="description" 
            placeholder="Enter project description (optional)"
            [nzAutosize]="{ minRows: 3, maxRows: 6 }">
          </textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control [nzSpan]="14" [nzOffset]="6">
          <button nz-button nzType="primary" type="submit" [disabled]="!projectForm.valid || submitting">
            {{ submitting ? 'Creating...' : 'Create Project' }}
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class CreateProjectFormComponent {
  private fb = inject(FormBuilder);
  private createProjectService = inject(CreateProjectService);
  private auth = inject(Auth);
  private router = inject(Router);
  private message = inject(NzMessageService);

  projectForm: FormGroup;
  submitting = false;

  constructor() {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.projectForm.valid || this.submitting) {
      return;
    }

    const user = this.auth.currentUser;
    if (!user) {
      this.message.error('User not authenticated');
      return;
    }

    this.submitting = true;

    try {
      const workspaceId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const traceId = `trace-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

      const command: CreateProjectCommand = {
        workspaceId,
        projectName: this.projectForm.value.projectName,
        description: this.projectForm.value.description,
        accountId: user.uid,
        actorId: user.uid,
        traceId,
        causedBy: ['user-action'],
        modules: ['identity', 'access-control', 'settings', 'audit'], // 4 base modules
        createdAt: new Date().toISOString()
      };

      await this.createProjectService.createProject(command);

      this.message.success('Project created successfully!');
      this.projectForm.reset();
    } catch (error) {
      console.error('Error creating project:', error);
      this.message.error('Failed to create project. Please try again.');
    } finally {
      this.submitting = false;
    }
  }
}
