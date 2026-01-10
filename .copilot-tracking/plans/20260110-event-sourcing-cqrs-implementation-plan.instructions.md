---
applyTo: ".copilot-tracking/changes/20260110-event-sourcing-cqrs-implementation-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Event Sourcing & CQRS Implementation

## Overview

Implement complete Event Sourcing infrastructure with Firebase, CQRS patterns, causality tracking, and 4 base SaaS modules (identity, access-control, settings, audit) for the ng-dragon repository.

## Objectives

- Bridge account-domain DomainEvent to core-engine EventMetadata
- Implement Firebase Event Store with optimistic concurrency
- Create event-sourced aggregates for 4 base modules
- Implement event projectors for read models
- Build application services for command handling
- Create UI project detail page displaying modules
- Demonstrate end-to-end causality tracking

## Research Summary

### Project Files

- packages/core-engine/src/value-objects/event-metadata.ts - Full EventMetadata with causality support
- packages/core-engine/src/ports/event-store.interface.ts - IEventStore interface for event persistence
- packages/account-domain/src/events/domain-event.ts - Simple DomainEvent needing bridge
- packages/account-domain/src/aggregates/workspace.aggregate.ts - Pattern for {aggregate, event} tuple
- packages/saas-domain/src/modules/* - 4 module entities with events, need aggregates

### External References

- #file:../research/20260110-event-sourcing-cqrs-implementation-research.md - Comprehensive gap analysis
- Firebase Firestore transactions for optimistic concurrency
- Angular Signals for CQRS read/write model separation
- NestJS event handler patterns for projections

### Standards References

- #file:../../packages/AGENTS.md - Package boundaries and dependency rules
- #file:../../.github/instructions/angular.instructions.md - Angular Signals and standalone components
- #file:../../docs/Causality-Belongs-Where(因果歸屬).md - Causality belongs to Event metadata
- #file:../../docs/Module(業務模組).md - 4 base modules specification

## Implementation Checklist

### [ ] Phase 1: Core Infrastructure

- [ ] Task 1.1: Create DomainEvent to EventMetadata Bridge
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 20-50)

- [ ] Task 1.2: Implement Firebase Event Store
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 52-100)

- [ ] Task 1.3: Create Event Projection Infrastructure
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 102-130)

### [ ] Phase 2: Module Aggregates (Domain Logic)

- [ ] Task 2.1: Implement Identity Aggregate
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 132-170)

- [ ] Task 2.2: Implement Access Control Aggregate
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 172-200)

- [ ] Task 2.3: Implement Settings Aggregate
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 202-230)

- [ ] Task 2.4: Implement Audit Aggregate
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 232-260)

### [ ] Phase 3: Application Layer (Use Cases)

- [ ] Task 3.1: Create Identity Application Service
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 262-300)

- [ ] Task 3.2: Create Access Control Application Service
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 302-330)

- [ ] Task 3.3: Create Settings Application Service
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 332-360)

- [ ] Task 3.4: Create Audit Application Service
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 362-390)

### [ ] Phase 4: Event Projections (Read Models)

- [ ] Task 4.1: Implement Member List Projector
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 392-425)

- [ ] Task 4.2: Implement Role Assignment Projector
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 427-455)

- [ ] Task 4.3: Implement Workspace Profile Projector
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 457-485)

- [ ] Task 4.4: Implement Activity Log Projector
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 487-520)

### [ ] Phase 5: UI Integration (Presentation Layer)

- [ ] Task 5.1: Create Project Detail Component
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 522-565)

- [ ] Task 5.2: Create Member List Component
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 567-595)

- [ ] Task 5.3: Create Activity Log Component with Causality Visualization
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 597-630)

### [ ] Phase 6: End-to-End Integration & Testing

- [ ] Task 6.1: Create Integration Tests for Event Sourcing Flow
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 632-665)

- [ ] Task 6.2: Implement E2E Causality Tracking Test
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 667-700)

- [ ] Task 6.3: Validate AGENTS.md Compliance
  - Details: .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md (Lines 702-730)

## Dependencies

- Firebase Admin SDK (platform-adapters only)
- @angular/fire (ui-angular only)
- TypeScript 5.x with strict mode
- Angular 19+ with Signals
- Firestore for event storage and read models
- Node.js 18+ for Firebase Functions (future)

## Success Criteria

- All events stored in Firebase with optimistic concurrency control
- DomainEvent seamlessly converts to EventMetadata with causality
- 4 module aggregates follow event sourcing pattern
- Projectors maintain eventually consistent read models
- UI displays workspace with modules and activity log
- Causality chain tracks: WorkspaceCreated → ModuleEnabled → MemberAdded
- All code passes TypeScript strict mode checks
- Package boundaries respected per AGENTS.md
- Integration and E2E tests validate full flow
