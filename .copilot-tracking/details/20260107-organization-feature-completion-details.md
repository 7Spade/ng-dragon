<!-- markdownlint-disable-file -->

# Task Details: organization feature completion

## Research Reference

**Source Research**: #file:../research/20260107-organization-feature-completion-research.md

## Phase 1: Domain modeling and events

### Task 1.1: Define OrganizationAggregate with invariants and events

- **Goal**: Introduce OrganizationAggregate capturing ownership, member roles, teams, and project links.
- **Events**: OrganizationCreated, OrgMemberAdded, OrgMemberRoleUpdated, OrgMemberRemoved, TeamCreated, TeamMemberAdded, TeamMemberRemoved, OrgProjectLinked.
- **Metadata**: Each event carries workspaceId/moduleKey/actorId/traceId/causedBy/occurredAt per toEventMetadata.
- **Success**: Aggregate enforces owner present, role transitions valid, team membership aligns with org membership, and emits causality-safe events.
- **Research References**: docs/Mermaid-B.md (org/member/team schema), docs/Mermaid-概念層.md (roles), docs/Mermaid-架構層.md (event metadata).

### Task 1.2: Add repositories/specifications for organization/team membership and module gating hooks

- **Goal**: Provide repository interfaces for organization aggregates and membership queries; include specifications for role checks and module enablement gating.
- **Success**: Interfaces defined in domain layer with workspace/module boundaries respected; no UI or infrastructure leakage.
- **Research References**: docs/Mermaid-架構層.md (assertWorkspaceAccess/assertModuleEnabled), docs/Mermaid-B.md (denormalized membership maps).

## Phase 2: Event store integration and projectors

### Task 2.1: Persist org/team events through event store with full metadata

- **Goal**: Wire aggregates to existing event store pipeline ensuring workspaceId/moduleKey/actorId/causedBy/traceId present.
- **Success**: Events appended-only, scoped to workspaceId, moduleKey required for module gating; complies with event-sourcing anti-pattern guidance.
- **Research References**: docs/Mermaid-架構層.md, docs/Mermaid-B.md (domain_events fields), repository memories on event sourcing rules.

### Task 2.2: Implement projectors for OrganizationDoc, OrgMemberDoc, TeamDoc, and account denormalization maps

- **Goal**: Materialize Firestore read models matching documented schema and update account organizationMemberships/teamMemberships/projectPermissions maps.
- **Success**: Projections updated on create/update/remove events; denormalized counters maintained; organizationId/projectId indices kept current.
- **Research References**: docs/Mermaid-B.md (Firestore schema), account denormalization memory.

## Phase 3: Application services and session facade

### Task 3.1: Expose application services for org lifecycle with gating

- **Goal**: Application layer APIs to create org, invite/add/remove member, create team, link project; enforce assertWorkspaceAccess then assertModuleEnabled.
- **Success**: Services accept workspaceId/moduleKey/context actor, delegate to aggregates, publish events, handle permission checks via specifications.
- **Research References**: docs/Mermaid-架構層.md (layering), docs/Mermaid-概念層.md (roles), module enablement rules.

### Task 3.2: Build Angular workspace/organization session facade with permission cache + ACL wiring

- **Goal**: Facade provides signals for org lists (owned/joined), selected workspace/org, permissions, and commands (selectOrg, createOrg, createTeam, invitePartner).
- **Success**: Uses HTTP/firestore projections to hydrate signals; applies permission cache to ACLService; no business logic in components.
- **Research References**: docs/Mermaid-實作指引.md (permission cache), research file recommended approach.

## Phase 4: UI refactor

### Task 4.1: Refactor header user dropdown to consume facade signals

- **Goal**: Replace hardcoded org arrays and inline checks with facade observables/signals; wire click handlers to facade commands.
- **Success**: Component becomes presentation-only; respects membership gating for team creation; partner creation allowed with selected org context.
- **Research References**: user.component.ts current state; research recommended UI facade.

## Phase 5: Validation and change log

### Task 5.1: Update changes log and validate SRP/gating/tests

- **Goal**: Record artifacts in changes file; run targeted tests/linters; validate workspace/module gating and SRP.
- **Success**: Changes file updated with Added/Modified entries; targeted unit tests for aggregates/projectors/facade; UI snapshot if applicable.
- **Research References**: research file success criteria; docs/Mermaid-架構層.md gating flow.
