---
status: draft
---

# Design

## Architecture

- **Presentation**: `AccountLoginComponent` renders the login UI with Angular Material form controls and reacts to `AuthStore` signals.
- **Application**: `AuthStore` coordinates authentication state using `@ngrx/signals` and exposes `login()` plus computed flags.
- **Domain**: Entities live under `src/app/domain/**/entities`.
- **Infrastructure**: `AuthService` wraps AngularFire Auth and forwards auth operations to Firebase.
- **Routing**: `/login` is the canonical entry point; legacy `/account/auth/*` routes redirect to top-level equivalents.
- **Switcher UI**: `AccountSwitcherComponent` and `WorkspaceSwitcherComponent` render Material menus with responsive behavior.
- **Layout**: `HeaderComponent` and `SidebarComponent` compose the authenticated shell in the presentation layer.

## Layered Structure

```
src/app/
├─ domain/
│  └─ **/entities/
├─ application/
│  └─ store/
├─ infrastructure/
├─ presentation/
│  └─ features/
└─ shared/
```

## Import Strategy

Use path aliases to keep references clear and avoid ambiguous relative imports:

```
@domain/*, @application/*, @infrastructure/*, @presentation/*, @shared/*
```

## Data Flow

1. User submits the login form on `/login`.
2. `AccountLoginComponent` calls `AuthStore.login()`.
3. `AuthStore` invokes `AuthService.login()` via its reactive method.
4. `AuthStore` updates signals with `patchState()`.
5. `AccountLoginComponent` reacts via `effect()` and navigates to `/dashboard`.
6. `ContextStore` syncs available contexts and `WorkspaceStore` derives workspace groups.
7. Switchers update store state and persist selections in local storage.

## Interfaces

- `AuthService.login(email: string, password: string): Observable<User>`
- `AuthStore.login(credentials: { email: string; password: string }): Promise<void>`
- `AccountStore.switchAccount(accountId: string): Promise<void>`
- `WorkspaceStore.setCurrentWorkspace(workspaceId: string): void`
- Routes:
  - `/login` → `AccountLoginComponent`
  - `/register` → `AccountRegisterComponent`
  - `/forgot-password` → `AccountForgotPasswordComponent`

## Data Models

- **AuthState**: `{ user: User | null; status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'; error: string | null }`
- **AccountState**: `{ currentAccount: Account | null; accounts: Account[]; loading: boolean; error: string | null }`
- **WorkspaceState**: `{ workspaces: Workspace[]; favorites: string[]; recents: string[]; currentWorkspaceId: string | null; searchQuery: string; loading: boolean; error: string | null }`

## Error Handling Matrix

| Scenario | Handling | User Impact |
| --- | --- | --- |
| Invalid credentials | `AuthStore` sets `error` and `unauthenticated` | Error message displayed |
| Firebase errors | Propagate message to `AuthStore.error` | Error message displayed |
| Network failure | Same as Firebase error | Retry after network recovery |
| Account switch failure | `AccountStore` sets `error` and retains previous account | Error message displayed |
| Workspace load failure | `WorkspaceStore` sets `error` and keeps previous list | Error message displayed |

## Testing Strategy

- Run `npm run lint` and `npm run build`.
- Playwright login flow to confirm `/` → `/login` redirect and successful authentication with a configured test account.
- Playwright checks for header, switcher menus, and command palette interactions.
