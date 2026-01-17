---
status: draft
---

# Design

## Architecture

- **Interface**: `AccountLoginComponent` renders the login UI with Angular Material form controls and reacts to `AuthStore` signals.
- **Application**: `AuthStore` coordinates authentication state using `@ngrx/signals` and exposes `login()` plus computed flags.
- **Infrastructure**: `AuthService` wraps AngularFire Auth, including a non-production fallback for demo credentials.
- **Routing**: `/login` is the canonical entry point; legacy `/account/auth/*` routes redirect to top-level equivalents.

## Data Flow

1. User submits the login form on `/login`.
2. `AccountLoginComponent` calls `AuthStore.login()`.
3. `AuthStore` invokes `AuthService.login()` via its reactive method.
4. `AuthStore` updates signals with `patchState()`.
5. `AccountLoginComponent` reacts via `effect()` and navigates to `/dashboard`.

## Interfaces

- `AuthService.login(email: string, password: string): Observable<User>`
- `AuthStore.login(credentials: { email: string; password: string }): Promise<void>`
- Routes:
  - `/login` → `AccountLoginComponent`
  - `/register` → `AccountRegisterComponent`
  - `/forgot-password` → `AccountForgotPasswordComponent`

## Data Models

- **AuthState**: `{ user: User | null; status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'; error: string | null }`

## Error Handling Matrix

| Scenario | Handling | User Impact |
| --- | --- | --- |
| Invalid credentials | `AuthStore` sets `error` and `unauthenticated` | Error message displayed |
| Firebase errors | Propagate message to `AuthStore.error` | Error message displayed |
| Network failure | Same as Firebase error | Retry after network recovery |

## Testing Strategy

- Run `npm run lint` and `npm run build`.
- Playwright login flow to confirm `/` → `/login` redirect and successful demo login.
