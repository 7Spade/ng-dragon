import { Routes } from '@angular/router';
import { startPageGuard } from '@core';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';

import { LayoutBasicComponent } from '../layout';
import { CreateOrganizationFormComponent } from '../workspaces/create-organization-form.component';
import { CreateTeamFormComponent } from '../workspaces/create-team-form.component';
import { CreatePartnerFormComponent } from '../workspaces/create-partner-form.component';
import { CreateProjectFormComponent } from '../workspaces/create-project-form.component';
import { WorkspaceDetailComponent } from '../workspaces/workspace-detail.component';

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
        path: 'workspaces/create',
        component: CreateOrganizationFormComponent,
        data: { workspaceType: 'organization' }
      },
      {
        path: 'projects/create',
        component: CreateProjectFormComponent,
        data: { workspaceType: 'project' }
      },
      {
        path: 'organizations/:orgId/projects/create',
        component: CreateProjectFormComponent,
        data: { workspaceType: 'project' }
      },
      {
        path: 'organizations/:orgId/teams/create',
        component: CreateTeamFormComponent,
        data: { workspaceType: 'team' }
      },
      {
        path: 'organizations/:orgId/partners/create',
        component: CreatePartnerFormComponent,
        data: { workspaceType: 'partner' }
      },
      {
        path: 'workspaces/:id',
        component: WorkspaceDetailComponent
      },
      {
        path: 'organizations/:id',
        component: WorkspaceDetailComponent,
        data: { workspaceType: 'organization' }
      },
      {
        path: 'teams/:id',
        component: WorkspaceDetailComponent,
        data: { workspaceType: 'team' }
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
