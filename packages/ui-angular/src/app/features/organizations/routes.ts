import { Routes } from '@angular/router';
import { OrganizationDetailComponent } from './organization-detail.component';
import { OrganizationPartnerCreateComponent } from './organization-partner-create.component';

export const routes: Routes = [
    { path: ':id', component: OrganizationDetailComponent },
    { path: ':id/partners/create', component: OrganizationPartnerCreateComponent }
];
