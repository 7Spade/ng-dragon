import { Routes } from '@angular/router';
import { startPageGuard } from '@core';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';

import { LayoutBasicComponent } from '../layout';
import { CreateOrganizationFormComponent } from '../workspaces/create-organization-form.component';
import { WorkspaceDetailComponent } from '../workspaces/workspace-detail.component';
import { ContextPlaceholderComponent } from './context-placeholder.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    canActivate: [startPageGuard, authSimpleCanActivate],
    canActivateChild: [authSimpleCanActivateChild],
    data: {},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/routes').then(m => m.routes)
      },
      {
        path: 'tasks/create',
        component: ContextPlaceholderComponent,
        data: { title: 'Create Task' }
      },
      {
        path: 'tasks/list',
        component: ContextPlaceholderComponent,
        data: { title: 'Task List' }
      },
      {
        path: 'tasks/my',
        component: ContextPlaceholderComponent,
        data: { title: 'My Tasks' }
      },
      {
        path: 'projects',
        component: ContextPlaceholderComponent,
        data: { title: 'Projects' }
      },
      {
        path: 'projects/mine',
        component: ContextPlaceholderComponent,
        data: { title: 'My Projects' }
      },
      {
        path: 'workspaces/create',
        component: CreateOrganizationFormComponent,
        data: { workspaceType: 'organization' }
      },
      {
        path: 'workspaces/create/team',
        component: CreateOrganizationFormComponent,
        data: { workspaceType: 'team' }
      },
      {
        path: 'workspaces/create/partner',
        component: CreateOrganizationFormComponent,
        data: { workspaceType: 'partner' }
      },
      {
        path: 'workspaces/create/project',
        component: CreateOrganizationFormComponent,
        data: { workspaceType: 'project' }
      },
      {
        path: 'workspaces/:id',
        component: WorkspaceDetailComponent
      },
      {
        path: 'organizations/:id/tasks/create',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'organization', title: 'Create Task' }
      },
      {
        path: 'organizations/:id/tasks',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'organization', title: 'Task List' }
      },
      {
        path: 'organizations/:id/projects',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'organization', title: 'Project Management' }
      },
      {
        path: 'organizations/:id/teams',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'organization', title: 'Teams' }
      },
      {
        path: 'organizations/:id/partners',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'organization', title: 'Partners' }
      },
      {
        path: 'organizations/:id',
        component: WorkspaceDetailComponent,
        data: { workspaceType: 'organization' }
      },
      {
        path: 'teams/:id/tasks/create',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'team', title: 'Create Task' }
      },
      {
        path: 'teams/:id/tasks',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'team', title: 'Team Tasks' }
      },
      {
        path: 'teams/:id/members',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'team', title: 'Team Members' }
      },
      {
        path: 'teams/:id',
        component: WorkspaceDetailComponent,
        data: { workspaceType: 'team' }
      },
      {
        path: 'partners/:id/collaborations',
        component: ContextPlaceholderComponent,
        data: { workspaceType: 'partner', title: 'Collaborations' }
      },
      {
        path: 'partners/:id',
        component: WorkspaceDetailComponent,
        data: { workspaceType: 'partner' }
      },
      {
        path: 'projects/:id',
        component: WorkspaceDetailComponent,
        data: { workspaceType: 'project' }
      }
    ]
  },
  // passport
  { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },
  { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
  { path: '**', redirectTo: 'exception/404' }
];
