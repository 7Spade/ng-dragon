<!-- markdownlint-disable-file -->
# Release Changes: organization feature completion

**Related Plan**: .copilot-tracking/plans/20260107-organization-feature-completion-plan.instructions.md
**Implementation Date**: 2026-01-07

## Summary

Implemented organization domain events/aggregate with causality metadata, projections/account denormalization, and an application service entry point; added an Angular session facade backed by an in-memory event store and refactored the header UI to consume facade signals. Introduced a targeted facade test plus tsconfig path updates to compile shared domain packages.

## Changes

### Added

- packages/saas-domain/src/value-objects/organization-roles.ts - Role value objects for organization and teams.
- packages/saas-domain/src/events/domain-event.ts - Event context/metadata helpers including workspace/module scope.
- packages/saas-domain/src/events/organization-events.ts - Organization/member/team/project event payload contracts.
- packages/saas-domain/src/events/in-memory-event-store.ts - In-memory event store for organization domain events.
- packages/saas-domain/src/aggregates/organization.aggregate.ts - Organization aggregate with invariants and event emitters.
- packages/saas-domain/src/projections/organization-projector.ts - Projector to materialize org/member/team docs and account denormalization maps.
- packages/saas-domain/src/repositories/organization-repository.ts - Repository and event store interfaces for organizations.
- packages/saas-domain/src/specifications/organization.specifications.ts - Workspace/module gating specifications and role checks.
- packages/core-engine/src/use-cases/organization.use-case.ts - Application service wiring aggregates through gating and event store.
- packages/ui-angular/src/app/core/session/organization-session.facade.ts - Angular session facade using signals, ACL cache, and event projections.
- packages/ui-angular/src/app/core/session/organization-session.facade.spec.ts - Targeted unit test covering facade seed and permissions.

### Modified

- packages/saas-domain/index.ts - Export organization domain primitives and infrastructure.
- packages/core-engine/index.ts - Re-export organization application service entry point.
- packages/ui-angular/src/app/core/index.ts - Surface organization session facade from core barrel.
- packages/ui-angular/src/app/layout/basic/widgets/user.component.ts - Refactored header dropdown to consume facade signals and commands.
- packages/ui-angular/tsconfig.json - Added @account-domain path mapping for shared identifiers.
- packages/ui-angular/tsconfig.spec.json - Allowed spec files for compilation in tests.
- .copilot-tracking/plans/20260107-organization-feature-completion-plan.instructions.md - Marked completed tasks/phases.
- Copilot-Processing.md - Recorded session request metadata per process instructions.

### Removed

- N/A

## Release Summary

**Total Files Affected**: 19

### Files Created (11)

- packages/saas-domain/src/value-objects/organization-roles.ts - Role primitives for organization/team members.
- packages/saas-domain/src/events/domain-event.ts - Domain event metadata with workspace/module scope.
- packages/saas-domain/src/events/organization-events.ts - Organization domain event payload definitions.
- packages/saas-domain/src/events/in-memory-event-store.ts - In-memory organization event store implementation.
- packages/saas-domain/src/aggregates/organization.aggregate.ts - Organization aggregate with member/team/project behaviors.
- packages/saas-domain/src/projections/organization-projector.ts - Projector/read models and account denormalization.
- packages/saas-domain/src/repositories/organization-repository.ts - Organization repository/event store contracts.
- packages/saas-domain/src/specifications/organization.specifications.ts - Workspace/module gating specs and role helpers.
- packages/core-engine/src/use-cases/organization.use-case.ts - Application service orchestrating organization commands.
- packages/ui-angular/src/app/core/session/organization-session.facade.ts - Session facade with ACL cache and event-sourced data.
- packages/ui-angular/src/app/core/session/organization-session.facade.spec.ts - Unit test verifying facade seed and permissions.

### Files Modified (8)

- packages/saas-domain/index.ts - Updated exports to surface organization domain additions.
- packages/core-engine/index.ts - Added export for organization application service.
- packages/ui-angular/src/app/core/index.ts - Re-exported organization session facade.
- packages/ui-angular/src/app/layout/basic/widgets/user.component.ts - Hooked header UI into session facade and removed hardcoded org data.
- packages/ui-angular/tsconfig.json - Added account-domain path mapping for shared identifiers.
- packages/ui-angular/tsconfig.spec.json - Enabled spec inclusion for Angular tests.
- .copilot-tracking/plans/20260107-organization-feature-completion-plan.instructions.md - Checked completed phases.
- Copilot-Processing.md - Process tracking entry for this session.

### Files Removed (0)

- N/A

### Dependencies & Infrastructure

- **New Dependencies**: None
- **Updated Dependencies**: None
- **Infrastructure Changes**: None
- **Configuration Updates**: Added TypeScript path mapping for @account-domain and allowed spec compilation in Angular tests.

### Deployment Notes

Targeted Angular unit test executed via `npm run test -- --watch=false --browsers=ChromeHeadless --include src/app/core/session/organization-session.facade.spec.ts`; initial Chrome (non-headless) launch failed due to missing display but headless run succeeded.
