import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Workspace, WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="project-detail" aria-labelledby="project-title">
      <ng-container *ngIf="project$ | async as project; else loading">
        <h1 id="project-title">{{ project?.name || 'Project' }}</h1>
        <p *ngIf="project?.description" class="project-description">{{ project?.description }}</p>
        <dl class="project-meta" *ngIf="project">
          <div>
            <dt>Workspace ID</dt>
            <dd>{{ project.id }}</dd>
          </div>
          <div *ngIf="project.createdAt">
            <dt>Created</dt>
            <dd>{{ project.createdAt }}</dd>
          </div>
          <div *ngIf="project.modules?.length">
            <dt>Modules</dt>
            <dd>{{ project.modules.length }}</dd>
          </div>
        </dl>
      </ng-container>
      <ng-template #loading>
        <p>Loading project...</p>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .project-detail {
        display: block;
        padding: 16px;
      }

      .project-meta {
        display: grid;
        gap: 8px;
      }

      dt {
        font-weight: 600;
      }

      dd {
        margin: 0;
      }
    `
  ]
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly workspaceService = inject(WorkspaceService);

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
    })
  );
}
