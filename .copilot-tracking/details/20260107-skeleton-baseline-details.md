<!-- markdownlint-disable-file -->

# Task Details: Skeleton baseline implementation plan

## Research Reference

- **Primary Research**: #file:../research/20260107-skeleton-baseline-research.md
- **Process Guidance**: #file:../research/20260107-edge-ai-iterative-plan-research.md

## Phase 1: Event-sourcing scaffold and Firestore baseline

### Task 1.1: Standardize DomainEvent contract and workspace/module gating

Document the implementation steps to align all domain layers with the shared `DomainEvent` metadata (actorId, traceId, causedBy, occurredAt) and enforce workspace/module gating at the aggregate boundary. Clarify how existing helpers (e.g., `toEventMetadata`) are reused across aggregates and how causality arrays are populated.

- **Files**:
  - `packages/account-domain/src/events/domain-event.ts` – reference for current metadata helper and payload shape.
  - `packages/account-domain/src/aggregates/workspace.aggregate.ts` – source for workspace/module toggle events to mirror across other aggregates.
  - `packages`/* domain packages – note where additional aggregates must apply workspace/module checks.
- **Success**:
  - Domain events across aggregates include workspaceId/moduleKey/actorId/causedBy/traceId consistently.
  - Aggregates validate workspace access and module enablement prior to emitting events.
- **Research References**:
  - #file:../research/20260107-skeleton-baseline-research.md (Lines 9-66, 71-86) – DomainEvent metadata, workspace-first gating, module lifecycle events.
  - #file:../research/20260107-edge-ai-iterative-plan-research.md (Lines 7-83) – task-planner workflow for producing checklist and prompt.
- **Dependencies**:
  - Access to current domain event helpers and aggregate definitions.
  - Agreement on workspace/module identifier sources per aggregate.

### Task 1.2: Capture Firestore layout, security, and event write path

List the steps to align Firestore collections (accounts, organizations, projects, domain_events) and subcollections (modules, permissions, tasks/issues/expenses) with denormalized IDs and append-only event writes through Cloud Functions. Include batch/index constraints, causality subcollections, and security rule expectations (no client writes to domain_events; module reads gated by permissions).

- **Files**:
  - `firebase/firestore.rules` (or equivalent ruleset) – location to enforce domain_events immutability and module gating.
  - `functions/` (or backend write path) – entry points for Cloud Functions that append domain events and maintain causality subcollection.
  - `docs/Mermaid-B.md` – retained as the schema reference for index/batch constraints.
- **Success**:
  - Firestore layout and rule changes are enumerated with denormalized organizationId/projectId fields and composite index needs.
  - Domain event writes are routed through server code with causality tracking; batch size and IN query limits are noted.
- **Research References**:
  - #file:../research/20260107-skeleton-baseline-research.md (Lines 9-107) – Firestore schema, security rules outline, batch/index constraints.
  - #file:../research/20260107-edge-ai-iterative-plan-research.md (Lines 31-83) – artifact generation flow for downstream implementation.
- **Dependencies**:
  - Confirmation of current Firebase project structure and rules file location.
  - Access to Cloud Functions/Backend repo section for domain event writes.

## Phase 2: Module registry, permissions, and Angular consumption

### Task 2.1: Define module registry dependency enforcement and cross-module references

Outline how the module registry should validate dependencies (task/issue core, finance/quality/acceptance dependents) before enabling modules, and how projectors manage cascade/nullify/prevent behaviors for cross-module references. Include steps to persist moduleStatus entries and propagate ModuleEnabled/ModuleDisabled events.

- **Files**:
  - `packages`/* module registry/config files – location to store required/optional dependencies.
  - `packages/account-domain/src/aggregates/workspace.aggregate.ts` – pattern for ModuleEnabled/ModuleDisabled events to emit.
  - Projector/processor location (e.g., `functions/` or `core-engine`) – where cross-module reference policies are enforced.
- **Success**:
  - Dependency checks block enablement when prerequisites are missing and emit dependency-aware events when passed.
  - Cross-module reference handling strategy (cascade/nullify/prevent) is documented for projector implementation.
- **Research References**:
  - #file:../research/20260107-skeleton-baseline-research.md (Lines 15-18, 62-66, 95-106) – module dependency graph, cross-module reference policy, module registry rules.
  - #file:../research/20260107-edge-ai-iterative-plan-research.md (Lines 31-83) – checklist/prompt generation to drive implementation.
- **Dependencies**:
  - Module list and dependency registry source of truth.
  - Coordination with event projector/service owners.

### Task 2.2: Plan permission cache API and Angular permission service usage

Describe steps to expose a `/projects/{id}/permissions` cache endpoint (or equivalent) and wire Angular permission service to seed @delon/auth and @delon/acl. Include session switch flow (workspace selector) and collectionGroup query constraints (chunked IN lists, prebuilt indexes) for UI reads.

- **Files**:
  - API layer (e.g., `functions/` or backend service) – endpoint returning computed permission cache.
  - `packages/ui-angular` permission service – consumer that hydrates @delon/auth/@delon/acl and handles workspace switch.
  - `docs/Mermaid-實作指引.md` / `docs/Mermaid-B.md` – query patterns and session flow references.
- **Success**:
  - Permission cache API contract defined with required fields and denormalized maps.
  - Angular permission service flow documented, including chunked `in` query strategy and collectionGroup filters.
- **Research References**:
  - #file:../research/20260107-skeleton-baseline-research.md (Lines 18-20, 64-107) – permission cache, Angular query patterns, collectionGroup/index guidance.
  - #file:../research/20260107-edge-ai-iterative-plan-research.md (Lines 31-83) – plan/prompt workflow.
- **Dependencies**:
  - Backend capability to compute permission cache.
  - Angular environment configured with @delon/auth, @delon/acl, and @angular/fire.

## Dependencies

- Access to referenced domain packages, Firebase rules/Functions code, and Angular permission service sources.
- Agreement on module registry source of truth and projector ownership.

## Success Criteria

- All tasks yield actionable, file-scoped steps that align with workspace-first event-sourcing baseline and permission model.
- Details map directly to research references and are ready for task-implementation execution via generated prompt.
