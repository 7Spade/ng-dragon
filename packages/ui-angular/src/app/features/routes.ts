import { Routes } from '@angular/router';
import { startPageGuard } from '@core';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';

import { LayoutBasicComponent } from '../layout';
import { CreateOrganizationFormComponent } from '../workspaces/create-organization-form.component';
import { CreateTeamFormComponent } from '../workspaces/create-team-form.component';
import { CreatePartnerFormComponent } from '../workspaces/create-partner-form.component';
import { CreateProjectFormComponent } from '../workspaces/create-project-form.component';
import { ProjectsListComponent } from '../workspaces/projects-list.component';
import { ProjectDetailComponent } from '../workspaces/project-detail.component';
import { TeamsListComponent } from '../workspaces/teams-list.component';
import { MembersListComponent } from '../workspaces/members-list.component';
import { PartnersListComponent } from '../workspaces/partners-list.component';

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
        component: CreateOrganizationFormComponent
      },
      {
        path: 'teams',
        component: TeamsListComponent
      },
      {
        path: 'organizations/:orgId/teams/create',
        component: CreateTeamFormComponent
      },
      {
        path: 'members',
        component: MembersListComponent
      },
      {
        path: 'partners',
        component: PartnersListComponent
      },
      {
        path: 'organizations/:orgId/partners/create',
        component: CreatePartnerFormComponent
      },
      {
        path: 'projects/create',
        component: CreateProjectFormComponent
      },
      {
        path: 'projects',
        component: ProjectsListComponent
      },
      {
        path: 'organizations/:orgId/projects/create',
        component: CreateProjectFormComponent
      },
      {
        path: 'projects/:projectId',
        component: ProjectDetailComponent
      }
    ]
  },
  // passport
  { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },
  { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
  { path: '**', redirectTo: 'exception/404' }
];
