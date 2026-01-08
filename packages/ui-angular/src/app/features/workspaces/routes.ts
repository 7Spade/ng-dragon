import { Routes } from '@angular/router';
import { WorkspaceDetailComponent } from './workspace-detail.component';
import { OrganizationPartnerCreateComponent } from '../organizations/organization-partner-create.component';

export const routes: Routes = [
  { path: ':workspaceId', component: WorkspaceDetailComponent },
  { path: ':workspaceId/partners/create', component: OrganizationPartnerCreateComponent },
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
];
