---
status: draft
---

# Requirements

## Authentication & Routing

- WHEN a user navigates to `/`, THE SYSTEM SHALL redirect to `/login`.
- WHEN a user navigates to `/login`, THE SYSTEM SHALL render the login form using Angular Material (Material Design 3) controls.
- WHEN an unauthenticated user accesses a protected route, THE SYSTEM SHALL redirect to `/login`.
- WHEN running in non-production mode and the credentials `demo@test.com` / `123123` are submitted, THE SYSTEM SHALL authenticate via a local fallback and treat the session as authenticated.
- WHEN authentication succeeds, THE SYSTEM SHALL navigate to the post-login landing page (`/dashboard`).
