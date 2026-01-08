<!-- markdownlint-disable-file -->
# Release Changes: organization feature completion

**Related Plan**: .copilot-tracking/plans/20260107-organization-feature-completion-plan.instructions.md
**Implementation Date**: 2026-01-08

## Summary

Implemented the initial create-organization flow with command/application service/factory/event wiring, added a Firebase workspace repository, and exposed a UI form plus route that triggers workspace creation and navigation. Workspace aggregate now captures organization names in snapshots/events.

## Changes

### Added

- packages/saas-domain/src/commands/CreateOrganizationCommand.ts - Command contract for creating an organization workspace.
- packages/saas-domain/src/domain/WorkspaceFactory.ts - Factory to build organization workspaces and emit creation events.
- packages/saas-domain/src/application/WorkspaceApplicationService.ts - Application service orchestrating workspace creation persistence.
- packages/saas-domain/src/events/WorkspaceCreatedEvent.ts - Typed workspace created domain event.
- packages/saas-domain/src/repositories/WorkspaceRepository.ts - Repository port for workspace snapshots and events.
- packages/platform-adapters/src/firebase-platform/workspace.repository.firebase.ts - Firebase-admin implementation of the workspace repository.
- packages/ui-angular/src/app/workspaces/create-organization-form.component.ts - UI form that issues the create-organization command and navigates to the new workspace.

### Modified

- packages/account-domain/src/aggregates/workspace.aggregate.ts - Allow workspace snapshots to carry names alongside modules and metadata.
- packages/account-domain/src/value-objects/workspace-type.ts - Allow WorkspaceType to include `Organization`.
- packages/saas-domain/index.ts - Export workspace creation flow artifacts.
- packages/platform-adapters/src/firebase-platform/index.ts - Re-export Firebase workspace repository.
- packages/ui-angular/src/app/features/routes.ts - Register route to the create-organization form.
- .copilot-tracking/changes/20260107-organization-feature-completion-changes.md - Logged the new organization creation flow.

### Removed

- N/A

## Release Summary

**Total Files Affected**: 13

### Files Created (7)

- packages/saas-domain/src/commands/CreateOrganizationCommand.ts - Command contract for organization creation.
- packages/saas-domain/src/domain/WorkspaceFactory.ts - Factory for organization workspace creation.
- packages/saas-domain/src/application/WorkspaceApplicationService.ts - Application service saving events and snapshots.
- packages/saas-domain/src/events/WorkspaceCreatedEvent.ts - Workspace created event type.
- packages/saas-domain/src/repositories/WorkspaceRepository.ts - Workspace repository abstraction.
- packages/platform-adapters/src/firebase-platform/workspace.repository.firebase.ts - Firebase-admin repository implementation.
- packages/ui-angular/src/app/workspaces/create-organization-form.component.ts - UI form to trigger creation and redirect.

### Files Modified (6)

- packages/account-domain/src/aggregates/workspace.aggregate.ts - Included workspace names in snapshots and events.
- packages/account-domain/src/value-objects/workspace-type.ts - Added `Organization` workspace type.
- packages/saas-domain/index.ts - Expose workspace creation exports.
- packages/platform-adapters/src/firebase-platform/index.ts - Export Firebase workspace repository.
- packages/ui-angular/src/app/features/routes.ts - Added create workspace route.
- .copilot-tracking/changes/20260107-organization-feature-completion-changes.md - Updated change log for current work.

### Files Removed (0)

- N/A

### Dependencies & Infrastructure

- **New Dependencies**: None
- **Updated Dependencies**: None
- **Infrastructure Changes**: Firebase workspace repository added for event persistence.
- **Configuration Updates**: None

### Deployment Notes

Route `/workspaces/create` renders the creation form, posting commands via HTTP adapters and navigating to `/workspaces/:workspaceId` on success.
