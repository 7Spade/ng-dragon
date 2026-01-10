import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Workspace, WorkspaceService } from './workspace.service';

/**
 * Project Detail Component
 * 
 * Displays workspace/project information including:
 * - Basic metadata (name, description, created date)
 * - Enabled modules (4 base modules: identity, access-control, settings, audit)
 * - Module status and descriptions
 * 
 * Per architecture:
 * - Project/Workspace is a logical container
 * - Modules are business capabilities
 * - Shows which modules are active in this workspace
 */
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="project-detail" aria-labelledby="project-title">
      <ng-container *ngIf="project$ | async as project; else loading">
        <header class="project-header">
          <h1 id="project-title">{{ project?.name || 'Project' }}</h1>
          <p *ngIf="project?.description" class="project-description">{{ project?.description }}</p>
        </header>

        <div class="project-info">
          <h2>Workspace Information</h2>
          <dl class="project-meta" *ngIf="project">
            <div>
              <dt>Workspace ID</dt>
              <dd>{{ project.id }}</dd>
            </div>
            <div *ngIf="project.createdAt">
              <dt>Created</dt>
              <dd>{{ project.createdAt | date: 'medium' }}</dd>
            </div>
            <div *ngIf="project.modules?.length">
              <dt>Enabled Modules</dt>
              <dd>{{ project.modules.length }}</dd>
            </div>
          </dl>
        </div>

        <div class="modules-section" *ngIf="baseModules().length > 0">
          <h2>Base Modules</h2>
          <p class="modules-description">
            These are the foundational modules available in this workspace:
          </p>
          <div class="modules-grid">
            <article *ngFor="let module of baseModules()" 
                     class="module-card"
                     [class.module-enabled]="isModuleEnabled(module.key, project)"
                     [class.module-disabled]="!isModuleEnabled(module.key, project)">
              <header class="module-header">
                <h3>{{ module.name }}</h3>
                <span class="module-status" 
                      [attr.aria-label]="isModuleEnabled(module.key, project) ? 'Enabled' : 'Disabled'">
                  {{ isModuleEnabled(module.key, project) ? '✓' : '○' }}
                </span>
              </header>
              <p class="module-description">{{ module.description }}</p>
              <div class="module-capabilities">
                <strong>Capabilities:</strong>
                <ul>
                  <li *ngFor="let capability of module.capabilities">{{ capability }}</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </ng-container>
      <ng-template #loading>
        <div class="loading">
          <p>Loading project details...</p>
        </div>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .project-detail {
        display: block;
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .project-header {
        margin-bottom: 32px;
      }

      .project-header h1 {
        font-size: 2rem;
        margin: 0 0 8px 0;
      }

      .project-description {
        color: #666;
        font-size: 1.1rem;
      }

      .project-info {
        background: #f5f5f5;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 32px;
      }

      .project-info h2 {
        margin-top: 0;
        font-size: 1.2rem;
      }

      .project-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      dt {
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      dd {
        margin: 0;
        color: #666;
      }

      .modules-section {
        margin-top: 32px;
      }

      .modules-section h2 {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      .modules-description {
        color: #666;
        margin-bottom: 24px;
      }

      .modules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .module-card {
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        transition: all 0.2s ease;
      }

      .module-card:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .module-enabled {
        border-color: #4caf50;
        background: #f1f8f4;
      }

      .module-disabled {
        opacity: 0.7;
      }

      .module-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .module-header h3 {
        margin: 0;
        font-size: 1.2rem;
      }

      .module-status {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .module-enabled .module-status {
        color: #4caf50;
      }

      .module-disabled .module-status {
        color: #999;
      }

      .module-description {
        color: #666;
        margin-bottom: 16px;
        line-height: 1.5;
      }

      .module-capabilities {
        border-top: 1px solid #e0e0e0;
        padding-top: 12px;
      }

      .module-capabilities strong {
        display: block;
        margin-bottom: 8px;
        color: #333;
      }

      .module-capabilities ul {
        margin: 0;
        padding-left: 20px;
      }

      .module-capabilities li {
        margin-bottom: 4px;
        color: #666;
      }

      .loading {
        text-align: center;
        padding: 40px;
        color: #999;
      }
    `
  ]
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly workspaceService = inject(WorkspaceService);

  /**
   * Base modules per Module(業務模組).md
   * 1. Identity/Members - workspace membership
   * 2. Access Control - roles and permissions
   * 3. Settings/Profile - workspace configuration
   * 4. Audit/Activity - event audit trail
   */
  readonly baseModules = signal([
    {
      key: 'identity',
      name: 'Identity & Members',
      description: 'Manage workspace members, invitations, and membership lifecycle.',
      capabilities: [
        'Add/remove members',
        'Member status tracking',
        'Role assignment',
        'Invitation management'
      ]
    },
    {
      key: 'access-control',
      name: 'Access Control',
      description: 'Define roles, permissions, and access policies for workspace resources.',
      capabilities: [
        'Role definitions (owner, admin, member)',
        'Permission management',
        'Access policy enforcement',
        'Fine-grained authorization'
      ]
    },
    {
      key: 'settings',
      name: 'Settings & Profile',
      description: 'Configure workspace settings, preferences, and feature flags.',
      capabilities: [
        'Workspace profile (name, logo, description)',
        'Plan tier management',
        'Feature flags',
        'Timezone and locale settings'
      ]
    },
    {
      key: 'audit',
      name: 'Audit & Activity',
      description: 'Track all workspace activities and maintain immutable audit trail.',
      capabilities: [
        'Activity logging',
        'Event audit trail',
        'Historical record',
        'Compliance tracking'
      ]
    }
  ]);

  readonly project$: Observable<Workspace | null> = this.route.paramMap.pipe(
    switchMap(params => {
      const projectId = params.get('projectId');
      if (!projectId) {
        return new Observable<Workspace | null>(observer => {
          observer.next(null);
          observer.complete();
        });
      }
      return this.workspaceService.getWorkspaceById(projectId);
    }),
    tap(project => {
      console.log('Project loaded:', project);
      if (project?.modules) {
        console.log('Enabled modules:', project.modules);
      }
    })
  );

  /**
   * Check if a module is enabled for this workspace
   */
  isModuleEnabled(moduleKey: string, project: Workspace | null): boolean {
    if (!project || !project.modules) {
      return false;
    }
    return project.modules.some(m => 
      m.moduleKey === moduleKey || m.moduleType === moduleKey
    );
  }
}
