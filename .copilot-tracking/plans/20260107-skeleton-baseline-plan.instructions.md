---
applyTo: ".copilot-tracking/changes/20260107-skeleton-baseline-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Skeleton baseline implementation

## Overview
Convert the skeleton baseline research into an actionable implementation plan covering domain events, Firestore layout, module registry dependencies, and permission cache integration.

## Objectives

- Capture workspace-first event-sourcing scaffolding with consistent DomainEvent metadata and gating.
- Outline Firestore layout/security, module registry enforcement, and permission cache consumption for Angular.

## Research Summary

### Project Files

- `packages/account-domain/src/events/domain-event.ts` – current DomainEvent interface and metadata helper used by aggregates.
- `packages/account-domain/src/aggregates/workspace.aggregate.ts` – emits workspace/module toggle events and models moduleStatus list.
- `docs/Mermaid-B.md`, `docs/Mermaid-實作指引.md`, `docs/Mermaid-模組層.md` – Firestore schema, query patterns, module dependency guidance.

### External References

- #file:../research/20260107-skeleton-baseline-research.md – consolidated architecture, Firestore, module, and permission cache findings.
- #file:../research/20260107-edge-ai-iterative-plan-research.md – process guide for turning research into plan/details/prompt artifacts.

### Standards References

- #file:../../.github/instructions/markdown.instructions.md – markdown formatting expectations for planning artifacts.

## Implementation Checklist

### [ ] Phase 1: Event-sourcing scaffold and Firestore baseline

- [ ] Task 1.1: Standardize DomainEvent contract and workspace/module gating

  - Details: .copilot-tracking/details/20260107-skeleton-baseline-details.md (Lines 12-29)

- [ ] Task 1.2: Capture Firestore layout, security, and event write path
  - Details: .copilot-tracking/details/20260107-skeleton-baseline-details.md (Lines 30-47)

### [ ] Phase 2: Module registry, permissions, and Angular consumption

- [ ] Task 2.1: Define module registry dependency enforcement and cross-module references
  - Details: .copilot-tracking/details/20260107-skeleton-baseline-details.md (Lines 50-67)

- [ ] Task 2.2: Plan permission cache API and Angular permission service usage
  - Details: .copilot-tracking/details/20260107-skeleton-baseline-details.md (Lines 68-85)

## Dependencies

- Access to domain packages, Firebase rules/Functions, and Angular permission service code paths.
- Module registry source of truth and projector ownership alignment.

## Success Criteria

- Plan, details, and prompt clearly map research into actionable, file-scoped steps for task-implementation.
- Event-sourcing, Firestore, module registry, and permission flows are all represented with workspace/module gating and permission cache expectations.
