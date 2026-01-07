<!-- markdownlint-disable-file -->

# Task Research Notes: Skeleton baseline & divergence guardrails

## Research Executed

### File Analysis

- docs/Mermaid-架構層.md
  - Layers split Identity/Workspace/Domain/Event/Processing; enforce workspace-bound events with moduleKey/actorId/causedBy/traceId and workspace/module gating before entity actions.
- docs/Mermaid-基礎設施層.md
  - Firestore root/child collections, denormalized org/project IDs for rules; Cloud Functions handle domain_events causality and module enable sync; batch/index/hotspot guidance.
- docs/Mermaid-概念層.md
  - Definitions for Account/Actor vs Organization/Workspace, module as boundary, domain event metadata scope, role model (org/team/project) and permission cache.
- docs/Mermaid-模組層.md
  - Module dependency graph (task/issue core; finance/quality/acceptance dependents), cross-module reference handling (cascade/nullify/prevent) via projection-managed references.
- docs/Mermaid-總結層.md
  - Summary: workspace-first gating, mandatory event metadata, denormalization + collectionGroup, append-only domain_events with projector, Angular reads projections with permission cache.
- docs/Mermaid-實作指引.md
  - Angular+Firebase workflow: auth → workspace selector → permission cache; Firestore query patterns (project permissions first, collectionGroup for tasks, event replay), permission service sketch, hosting/devops tips.
- docs/Mermaid.md
  - High-level event flow, workspace/module ACL sequence, divergence watchlist, package tree (account-domain/core-engine/platform-adapters/saas-domain/ui-angular + genai path).
- docs/Mermaid-A.md
  - Divergence watchlist fixes (identity separation, permission tiers, event scope, module deps, causality), implementation priorities P0-P2, package directory tree, cross-module causality guidance.
- docs/Mermaid-B.md
  - Firestore schema diagram, Account/Organization/Project/DomainEvent interfaces with denormalized permission maps, security rule patterns, Angular query patterns (chunked documentId in, collectionGroup filters, event sourcing queries).
- docs/Mermaid-C.md
  - Same baseline as A with performance notes (indexes, BigQuery export) and implementation priorities; reiterates module dependency and multi-causality tracking.
- packages/account-domain/src/events/domain-event.ts
  - DomainEvent<T> interface with actorId/traceId/causedBy/occurredAt metadata and helper toEventMetadata for consistent timestamps.
- packages/account-domain/src/aggregates/workspace.aggregate.ts
  - Workspace aggregate emits WorkspaceCreated and ModuleEnabled/Disabled with workspace/account/module scoped payloads; modules stored as ModuleStatus[] ensuring module gating events carry moduleKey/type.

### Code Search Results

- "DomainEvent" search
  - Found definitions and usages in packages/account-domain (events and aggregates) establishing event metadata helper and module toggle events.
- Additional code search
  - Not performed beyond DomainEvent scope; no other event-store implementations detected in packages.

### External Research

- #githubRepo:"7Spade/ng-dragon skeleton"  
  - Not executed; scope limited to in-repo documentation.
- #fetch:https://example.com/  
  - Not executed; no external sources required for current baseline.

### Project Conventions

- Standards referenced: Firebase-first event sourcing with workspace/module gating, append-only domain_events, denormalized Firestore schema, module dependency registry, Angular permission cache with @delon/auth/acl, package layout per Mermaid docs.
- Instructions followed: Layered architecture docs (Mermaid-架構層/概念層/基礎設施層/模組層/總結層/實作指引), divergence watchlist + priorities (Mermaid-A/C), Firestore patterns + queries (Mermaid-B), package tree (Mermaid.md), DomainEvent interface in account-domain.

## Key Discoveries

### Project Structure

- Packages align with planned layers: account-domain (identity/workspace events), core-engine/saas-domain/platform-adapters/ui-angular, with genai adapter path reserved. Modules split into core (task/issue) and addon (finance/quality/acceptance) with declared dependencies.
- Firestore layout centers on root collections (accounts/organizations/projects/domain_events) plus project subcollections (modules/permissions/events/tasks/issues/expenses) and domain_events/causality subcollections; security rules rely on denormalized organizationId/projectId.

### Implementation Patterns

- Workspace-first gating: every domain action asserts workspace access then module enablement; events carry moduleKey, actorId, causedBy[], traceId, and scope identifiers.
- Module lifecycle captured as ModuleEnabled/ModuleDisabled events; cross-module references stored centrally with cascade/nullify/prevent strategies managed by projectors rather than UI writes.
- Permission model uses precomputed cache (organization member + team + direct project grants) surfaced via API; Angular Permission Service caches computed abilities and seeds @delon/acl.
- Firestore queries favor denormalization and collectionGroup with prebuilt composite indexes; chunked documentId IN lists respect Firestore limit of 10; batch writes capped at 500 with BulkWriter/retry guidance.
- DomainEvent helper (toEventMetadata) standardizes timestamps/trace/causality, ensuring append-only events suitable for replay and projection.

### Complete Examples

```typescript
// Source: packages/account-domain/src/events/domain-event.ts
export interface DomainEvent<TPayload> {
  eventType: string;
  aggregateId: string;
  accountId?: AccountId;
  workspaceId?: WorkspaceId;
  moduleKey?: ModuleKey;
  payload: TPayload;
  metadata: {
    actorId: AccountId;
    traceId?: string;
    causedBy?: string[];
    occurredAt: string;
  };
}
```

### API and Schema Documentation

- Firestore collections: accounts/, organizations/ (members|teams|projects), projects/ (modules|permissions|events|tasks|issues|expenses), domain_events/ + causality subcollection; events immutable and written via Cloud Functions.
- Domain event scope includes projectId, optional organizationId/personalUserId, moduleKey, actorId, causedBy[], traceId; read models updated by projector functions.

### Configuration Examples

```text
Security rules outline (docs/Mermaid-B.md):
- deny client writes to domain_events; Cloud Functions maintain causality
- module reads require moduleStatus.enabled == true and project permission checks
- cross_module_references readable when caller has read on source or target projects; immutable after creation
```

### Technical Requirements

- Enforce workspaceId/moduleKey/actorId/causedBy/traceId on all events; append-only domain_events.
- Module registry validates required dependencies before enable; projection layer maintains cross-module references.
- Permission API `/projects/{id}/permissions` supplies computed cache for Angular session switching; @delon/auth/acl fed from cache.
- Index and batch constraints: composite indexes for collectionGroup queries; batch writes <=500; avoid hot keys via traceId+sequence or timestamp sharding.

## Recommended Approach

Adopt the documented workspace-first event-sourcing skeleton: keep Identity/Workspace and Module layers separate, emit append-only DomainEvent records with standardized metadata, gate all actions via workspace/module checks, and store state in denormalized Firestore collections managed by Cloud Functions projectors. Build core modules (task/issue) first with dependency-aware module registry, expose permission cache API, and use Angular Permission Service + @delon/acl for consistent session-aware UI.

## Implementation Guidance

- **Objectives**: Establish baseline scaffolding that enforces workspace/module gating, standardized DomainEvent metadata, Firestore collection layout, and module dependency registry to prevent divergence/tech debt.
- **Key Tasks**: Define shared DomainEvent types and metadata helper; stand up Firestore collections/rules per schema; implement module registry with dependency validation and cross-module reference handling; deliver permission API and Angular permission cache; ensure Cloud Functions handle domain_events writes/projectors.
- **Dependencies**: Firestore composite indexes, Cloud Functions runtime for event write/projector, @delon/auth/acl + @angular/fire for UI, module registry data in projects/{id}/modules.
- **Success Criteria**: All events include scope/metadata fields; module enablement blocked when dependencies missing; domain_events append-only with projector updating read models; permission cache returned by API and consumed by Angular ACL; collectionGroup queries succeed with prepared indexes and respect batch/IN limits.
