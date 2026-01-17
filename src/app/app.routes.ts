import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/account/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    redirectTo: '/account/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    redirectTo: '/account/auth/register',
    pathMatch: 'full',
  },
  {
    path: 'forgot-password',
    redirectTo: '/account/auth/forgot-password',
    pathMatch: 'full',
  },
  {
    path: 'account',
    children: [
      {
        path: 'auth/login',
        loadComponent: () =>
          import('./features/account/auth/login/login.component').then(
            (m) => m.AccountLoginComponent
          ),
      },
      {
        path: 'auth/register',
        loadComponent: () =>
          import('./features/account/auth/register/register.component').then(
            (m) => m.AccountRegisterComponent
          ),
      },
      {
        path: 'auth/forgot-password',
        loadComponent: () =>
          import('./features/account/auth/forgot-password/forgot-password.component').then(
            (m) => m.AccountForgotPasswordComponent
          ),
      },
      {
        path: 'auth/reset-password',
        loadComponent: () =>
          import('./features/account/auth/reset-password/reset-password.component').then(
            (m) => m.AccountResetPasswordComponent
          ),
      },
      {
        path: 'auth/verify-email',
        loadComponent: () =>
          import('./features/account/auth/verify-email/verify-email.component').then(
            (m) => m.AccountVerifyEmailComponent
          ),
      },
      {
        path: 'auth/logout',
        loadComponent: () =>
          import('./features/account/auth/logout/logout.component').then(
            (m) => m.AccountLogoutComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/account/profile/profile.component').then(
            (m) => m.AccountProfileComponent
          ),
      },
      {
        path: 'settings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/account/settings/settings.component').then(
            (m) => m.AccountSettingsComponent
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'workspace',
    canActivate: [authGuard],
    children: [
      {
        path: 'my',
        loadComponent: () =>
          import('./features/workspace/my/my-workspace.component').then(
            (m) => m.MyWorkspaceComponent
          ),
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/workspace/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/workspace/documents/documents.component').then(
            (m) => m.DocumentsComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/workspace/tasks/tasks.component').then(
            (m) => m.TasksComponent
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./features/workspace/members/members.component').then(
            (m) => m.MembersComponent
          ),
      },
      {
        path: 'permissions',
        loadComponent: () =>
          import('./features/workspace/permissions/permissions.component').then(
            (m) => m.PermissionsComponent
          ),
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./features/workspace/audit/audit.component').then(
            (m) => m.AuditComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/workspace/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'journal',
        loadComponent: () =>
          import('./features/workspace/journal/journal.component').then(
            (m) => m.JournalComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/account/auth/login',
  },
];
