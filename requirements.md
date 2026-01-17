---
status: draft
---

# Requirements

## Authentication & Routing

- WHEN a user navigates to `/`, THE SYSTEM SHALL redirect to `/login`.
- WHEN a user navigates to `/login`, THE SYSTEM SHALL render the login form using Angular Material (Material Design 3) controls.
- WHEN an unauthenticated user accesses a protected route, THE SYSTEM SHALL redirect to `/login`.
- WHEN authentication succeeds, THE SYSTEM SHALL navigate to the post-login landing page (`/dashboard`).

## DDD Structure Migration

- WHEN the project is organized, THE SYSTEM SHALL place domain entities under `src/app/domain/**/entities`.
- WHEN application state is managed, THE SYSTEM SHALL place signal stores under `src/app/application/store`.
- WHEN infrastructure integrations exist, THE SYSTEM SHALL place Firebase/API services under `src/app/infrastructure`.
- WHEN UI is rendered, THE SYSTEM SHALL place feature UI under `src/app/presentation` and reusable assets under `src/app/shared`.
- WHEN imports reference moved code, THE SYSTEM SHALL use the new alias paths (`@domain`, `@application`, `@infrastructure`, `@presentation`, `@shared`).
