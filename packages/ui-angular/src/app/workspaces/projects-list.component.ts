import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { Workspace, WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="projects-list" aria-labelledby="projects-heading">
      <h1 id="projects-heading">My Projects</h1>
      <ng-container *ngIf="projects$ | async as projects">
        <p *ngIf="projects.length === 0" class="empty-state">No projects found. Create your first project to get started.</p>
        <ul *ngIf="projects.length > 0" class="project-items">
          <li *ngFor="let project of projects" class="project-item">
            <a [routerLink]="['/projects', project.id]" class="project-link">{{ project.name || 'Untitled project' }}</a>
            <span *ngIf="project.description" class="project-description"> — {{ project.description }}</span>
          </li>
        </ul>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .projects-list {
        display: block;
        padding: 16px;
      }

      .project-items {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .project-item + .project-item {
        margin-top: 8px;
      }

      .project-link {
        font-weight: 600;
      }

      .project-description {
        color: rgba(0, 0, 0, 0.65);
      }
    `
  ]
})
export class ProjectsListComponent {
  private readonly workspaceService = inject(WorkspaceService);

  readonly projects$: Observable<Workspace[]> = this.workspaceService.getUserWorkspaces('project');
}
