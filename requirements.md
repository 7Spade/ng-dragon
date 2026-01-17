---
status: draft
---

# Requirements

## Authentication & Routing

- WHEN a user navigates to `/`, THE SYSTEM SHALL redirect to `/login`.
- WHEN a user navigates to `/login`, THE SYSTEM SHALL render the login form using Angular Material (Material Design 3) controls.
- WHEN an unauthenticated user accesses a protected route, THE SYSTEM SHALL redirect to `/login`.
- WHEN authentication succeeds, THE SYSTEM SHALL navigate to the post-login landing page (`/dashboard`).

## Account Switcher (Identity)

- WHEN the user is authenticated, THE SYSTEM SHALL expose an account switcher in the global header.
- WHEN the account switcher is opened, THE SYSTEM SHALL display grouped accounts (user, organizations, teams, partners).
- WHEN the user selects a different account, THE SYSTEM SHALL switch context and persist the selected account ID.
- WHEN the current account is active, THE SYSTEM SHALL render a visual selection indicator.
- WHEN account switching fails, THE SYSTEM SHALL surface an error message without leaving the current account.
- WHEN Ctrl+Shift+A is pressed, THE SYSTEM SHALL open the account switcher.

## Workspace Switcher

- WHEN the user is authenticated, THE SYSTEM SHALL expose a workspace switcher in the global header.
- WHEN the workspace list exceeds 50 items, THE SYSTEM SHALL use virtual scrolling.
- WHEN the user types in the search field, THE SYSTEM SHALL filter workspaces by name or description.
- WHEN the user toggles favorites, THE SYSTEM SHALL persist favorite workspace IDs.
- WHEN the user selects a workspace, THE SYSTEM SHALL update the active workspace and recent list.
- WHEN Ctrl+K is pressed, THE SYSTEM SHALL open the command palette for workspace switching.

## Global Header & Sidebar Layout

- WHEN the user is authenticated, THE SYSTEM SHALL render the global header and sidebar layout per workspace-layout-spec.
- WHEN the viewport is mobile or tablet, THE SYSTEM SHALL adapt header and switcher layouts per responsive rules.
- WHEN the header is rendered, THE SYSTEM SHALL provide skip navigation and required ARIA attributes.

## Performance & Persistence

- WHEN a workspace is selected, THE SYSTEM SHALL persist the selection to local storage.
- WHEN favorites are updated, THE SYSTEM SHALL persist the favorites list to local storage.
- WHEN user preferences are available in Firestore, THE SYSTEM SHALL sync favorites and recents.

## DDD Structure Migration

- WHEN the project is organized, THE SYSTEM SHALL place domain entities under `src/app/domain/**/entities`.
- WHEN application state is managed, THE SYSTEM SHALL place signal stores under `src/app/application/store`.
- WHEN infrastructure integrations exist, THE SYSTEM SHALL place Firebase/API services under `src/app/infrastructure`.
- WHEN UI is rendered, THE SYSTEM SHALL place feature UI under `src/app/presentation` and reusable assets under `src/app/shared`.
- WHEN imports reference moved code, THE SYSTEM SHALL use the new alias paths (`@domain`, `@application`, `@infrastructure`, `@presentation`, `@shared`).
