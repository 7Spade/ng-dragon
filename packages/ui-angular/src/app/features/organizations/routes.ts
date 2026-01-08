import { Routes } from '@angular/router';
import { OrganizationCreateComponent } from './organization-create.component';

export const routes: Routes = [
  { path: 'create', component: OrganizationCreateComponent },
  { path: '', pathMatch: 'full', redirectTo: 'create' }
];
