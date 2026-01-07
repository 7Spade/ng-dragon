---
applyTo: ".copilot-tracking/changes/20260107-organization-feature-completion-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: organization feature completion

## Overview

Design and implement end-to-end organization functionality using event-sourced domain patterns, Firestore projections, and an Angular session facade, ensuring strict layering and single responsibility.

## Objectives

- Introduce organization/team aggregates and events with causality metadata
- Project organization read models (org/member/team) and account denormalization
- Provide application/session facade for workspace selection and permission cache
- Refactor header UI to consume facade signals without embedded business logic

## Research Summary

- #file:../research/20260107-organization-feature-completion-research.md – gaps, schemas, recommended approach
- #file:../../docs/Mermaid-B.md – Firestore org/member/team schema, event scope/causality fields
- #file:../../docs/Mermaid-架構層.md – layering, workspace/module gating flow
- #file:../../docs/Mermaid-概念層.md – roles model (owner/admin/member, team maintainer/member) and permissions derivation

## Implementation Checklist

### [x] Phase 1: Domain modeling and events

- [x] Task 1.1: Define OrganizationAggregate with invariants and events (OrganizationCreated, OrgMemberAdded/RoleUpdated/Removed, TeamCreated/MemberAdded/Removed, OrgProjectLinked)
  - Details: .copilot-tracking/details/20260107-organization-feature-completion-details.md (Lines 15-46)
- [x] Task 1.2: Add repositories/specifications for organization/team membership and module gating hooks
  - Details: .copilot-tracking/details/20260107-organization-feature-completion-details.md (Lines 48-62)

### [x] Phase 2: Event store integration and projectors

- [x] Task 2.1: Persist org/team events through event store with workspaceId/moduleKey/actorId/traceId/causedBy
  - Details: .copilot-tracking/details/20260107-organization-feature-completion-details.md (Lines 64-78)
- [x] Task 2.2: Implement projectors for OrganizationDoc, OrgMemberDoc, TeamDoc, and account denormalization maps
  - Details: .copilot-tracking/details/20260107-organization-feature-completion-details.md (Lines 80-104)

### [x] Phase 3: Application services and session facade

- [x] Task 3.1: Expose application services for create org, invite/add member, create team, link project with workspace/module gating
  - Details: .copilot-tracking/details/20260107-organization-feature-completion-details.md (Lines 106-130)
- [x] Task 3.2: Build Angular workspace/organization session facade with permission cache + ACL wiring
  - Details: .copilot-tracking/details/20260107-organization-feature-completion-details.md (Lines 132-156)

### [x] Phase 4: UI refactor

- [x] Task 4.1: Refactor header user dropdown to consume facade signals (org lists, selection, commands) and remove hardcoded data/logic
  - Details: .copilot-tracking/details/20260107-organization-feature-completion-details.md (Lines 158-176)

### [x] Phase 5: Validation and change log

- [x] Task 5.1: Update changes log with added aggregates, projectors, services, facade, and UI refactor; verify tests/guards and SRP compliance
  - Details: .copilot-tracking/details/20260107-organization-feature-completion-details.md (Lines 178-194)

## Dependencies

- Event store and projector infrastructure
- Firestore schema and indexing for organizationId/projectId/moduleKey
- ACLService and permission cache pattern in UI

## Success Criteria

- Organization/team domain modeled with events including causality metadata
- Firestore read models and account denormalization kept in sync via projectors
- Session facade handles workspace selection and permissions; UI uses facade outputs only
- Module/workspace gating enforced before mutations; header UI free of hardcoded org data
