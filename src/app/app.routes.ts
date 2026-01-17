import { Routes } from '@angular/router';
import { authGuard } from './application/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./presentation/features/account/auth/login/login.component').then(
        (m) => m.AccountLoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./presentation/features/account/auth/register/register.component').then(
        (m) => m.AccountRegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./presentation/features/account/auth/forgot-password/forgot-password.component').then(
        (m) => m.AccountForgotPasswordComponent
      ),
  },
  {
    path: 'account',
    children: [
      {
        path: 'auth/login',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'auth/register',
        redirectTo: '/register',
        pathMatch: 'full',
      },
      {
        path: 'auth/forgot-password',
        redirectTo: '/forgot-password',
        pathMatch: 'full',
      },
      {
        path: 'auth/reset-password',
        loadComponent: () =>
          import('./presentation/features/account/auth/reset-password/reset-password.component').then(
            (m) => m.AccountResetPasswordComponent
          ),
      },
      {
        path: 'auth/verify-email',
        loadComponent: () =>
          import('./presentation/features/account/auth/verify-email/verify-email.component').then(
            (m) => m.AccountVerifyEmailComponent
          ),
      },
      {
        path: 'auth/logout',
        loadComponent: () =>
          import('./presentation/features/account/auth/logout/logout.component').then(
            (m) => m.AccountLogoutComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./presentation/features/account/profile/profile.component').then(
            (m) => m.AccountProfileComponent
          ),
      },
      {
        path: 'settings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./presentation/features/account/settings/settings.component').then(
            (m) => m.AccountSettingsComponent
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./presentation/features/dashboard/dashboard.component').then(
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
          import('./presentation/features/workspace/my/my-workspace.component').then(
            (m) => m.MyWorkspaceComponent
          ),
      },
      {
        path: ':workspaceId',
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            loadComponent: () =>
              import('./presentation/features/workspace/overview/overview.component').then(
                (m) => m.OverviewComponent
              ),
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./presentation/features/workspace/documents/documents.component').then(
                (m) => m.DocumentsComponent
              ),
          },
          {
            path: 'tasks',
            loadComponent: () =>
              import('./presentation/features/workspace/tasks/tasks.component').then(
                (m) => m.TasksComponent
              ),
          },
          {
            path: 'members',
            loadComponent: () =>
              import('./presentation/features/workspace/members/members.component').then(
                (m) => m.MembersComponent
              ),
          },
          {
            path: 'permissions',
            loadComponent: () =>
              import('./presentation/features/workspace/permissions/permissions.component').then(
                (m) => m.PermissionsComponent
              ),
          },
          {
            path: 'audit',
            loadComponent: () =>
              import('./presentation/features/workspace/audit/audit.component').then(
                (m) => m.AuditComponent
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./presentation/features/workspace/settings/settings.component').then(
                (m) => m.SettingsComponent
              ),
          },
          {
            path: 'journal',
            loadComponent: () =>
              import('./presentation/features/workspace/journal/journal.component').then(
                (m) => m.JournalComponent
              ),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
