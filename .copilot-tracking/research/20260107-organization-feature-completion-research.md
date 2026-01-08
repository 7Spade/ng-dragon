<!-- markdownlint-disable-file -->

# Task Research Notes: Organization feature completion

## Research Executed

### File Analysis

- packages/ui-angular/src/app/layout/basic/widgets/user.component.ts
  - Header dropdown hardcodes owned/joined organizations, keeps selectedOrganizationId locally, and uses TODO placeholders for navigation/creation; no permission gating or facade integration beyond a basic membership check.
- packages/account-domain/src/aggregates/workspace.aggregate.ts
  - Provides WorkspaceCreated and ModuleEnabled/Disabled events for workspace/module gating but does not model organizations, teams, or membership flows; highlights absence of organization aggregate in domain layer.
- docs/Mermaid-B.md (Firestore architecture)
  - Defines full Firestore schema for organizations, members, teams, project indexes, and domain_events with scope/causality; reiterates identity vs organization vs workspace separation and denormalized permission indexes.
- docs/Mermaid-架構層.md & docs/Mermaid-概念層.md
  - Emphasize layering: Identity/Workspace manage membership and module enablement; UI must consume projections with workspace/module gating and append-only domain events carrying moduleKey/actorId/causedBy/traceId.

### Code Search Results

- "organization" in packages/ui-angular → only header user component uses it; no services or facades exist (grep matches limited to user.component.ts).
- "Organization" across packages/account-domain + saas-domain → no aggregates/entities/events for organization/team; confirms backend/domain gap relative to UI.

### External Research

- #githubRepo:"N/A"  
  - Not performed; internal architecture docs already provide authoritative guidance for organization/permission design.
- #fetch:N/A  
  - Not used; no external specifications required for this scope.

### Project Conventions

- Standards referenced: .github/collections/edge-ai-tasks.md (task workflow), docs/Mermaid-B/架構層/概念層 (Firestore schema, layering, event metadata), .github/instructions/angular.instructions.md and typescript-5-es2022 for UI/service boundaries, event-sourcing patterns for causality metadata.
- Instructions followed: Task Researcher scope (research-only), single responsibility emphasis, avoidance of UI-embedded domain logic per architecture docs.

## Key Discoveries

### Project Structure

- UI layer has only a header dropdown for organizations with static data; no shared workspace/organization session state, permissions cache, or creation flows wired.
- Domain layer currently models workspaces/modules (workspace.aggregate.ts) but lacks organization/team aggregates, events, repositories, and projectors; saas-domain is empty.
- Firestore design already specifies collections/subcollections for organizations, members, teams, projects, and domain_events with denormalized permission indexes to support Security Rules and projections.

### Implementation Patterns

- Architecture expects append-only domain events with moduleKey/workspaceId/actorId/causedBy/traceId; Projector updates read models that UI consumes via @angular/fire.
- Workspace/module gating precedes domain actions (`assertWorkspaceAccess` then `assertModuleEnabled`), and permissions are derived from cached claims/ACL rather than inline UI checks.
- Organization ownership/roles (owner|admin|member) and team roles (maintainer|member) flow into project permission indexes; Organization is a resource owner, never an Actor.

### Complete Examples

```typescript
// Firestore OrganizationDoc & Member/Team (from docs/Mermaid-B.md)
interface OrganizationDoc {
  organizationId: string;
  slug: string;
  displayName: string;
  ownerId: string;
  stats: { memberCount: number; teamCount: number; projectCount: number; };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface OrgMemberDoc {
  accountId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Timestamp;
  accountInfo: { email: string; displayName: string; photoURL?: string; };
}

interface TeamDoc {
  teamId: string;
  organizationId: string;
  slug: string;
  displayName: string;
  defaultPermission: 'admin' | 'write' | 'read' | 'none';
  memberCount: number;
  createdAt: Timestamp;
}
```

```typescript
// DomainEventDoc scope/causality fields (docs/Mermaid-B.md)
interface DomainEventDoc {
  eventType: string;
  aggregateId: string;
  scope: { projectId: string; organizationId?: string; personalUserId?: string; };
  moduleKey?: string;
  actorId: string;
  traceId: string;
  causality: { causedBy: string[]; affects: string[]; type: 'direct' | 'cascading' | 'cross_module' | 'automation'; };
  payload: Record<string, any>;
  metadata: Record<string, any>;
  timestamp: Timestamp;
  _indexProjectModule: string;
  _indexOrgTime: string;
}
```

### API and Schema Documentation

- Organization root collection with stats and slug, members subcollection with denormalized account info, teams subcollection with defaultPermission and member counts, and org-level project index for cross-navigation (docs/Mermaid-B.md).
- Domain events must include organization/project scope and causality metadata; projections/read models should index by organizationId and moduleKey for queries and guards.
- Project permissions derive from organization role + team grants + direct grants; Security Rules rely on denormalized permissionIndex and org/team membership maps.

### Configuration Examples

```typescript
// Workspace/module gating and permission cache pattern (docs/Mermaid-架構層 + 實作指引)
async switchWorkspace(workspaceId: string) {
  const permissions = await firstValueFrom(this.http.get<SessionPermissionCache>(`/api/workspaces/${workspaceId}/permissions`));
  this.acl.setFull({ role: permissions.computedRole, ability: Object.keys(permissions.abilities).filter(k => permissions.abilities[k]) });
  this.currentWorkspace.set(workspaceId);
}
```

### Technical Requirements

- Implement organization aggregate/event set (OrganizationCreated, OrgMemberInvited/Joined/RoleChanged, TeamCreated/MemberAdded, ProjectLinked) with workspace/module gating and causality metadata.
- Event store + projector must write Firestore read models matching OrganizationDoc/OrgMemberDoc/TeamDoc and update account denormalization maps for fast permission checks.
- UI should consume projections via a Workspace/Organization session facade (signals) and route guards; creation/join flows must call application services rather than hardcoded router navigation.
- Module enablement rules (core/addon dependencies) still apply when organization enables project-level modules; events should include moduleKey for gating downstream entities.

## Recommended Approach

Adopt an event-sourced organization domain: define OrganizationAggregate (with team/member invariants) and event set (OrganizationCreated, OrgMemberAdded/RoleUpdated/Removed, TeamCreated/MemberAdded/Removed, OrgProjectIndexed) using EventContext metadata (workspaceId/moduleKey/actorId/causedBy/traceId). Persist events through the existing event store, add projectors to materialize Firestore read models for organizations/members/teams and to update account-level denormalization (organizationMemberships, teamMemberships, projectPermissions). Expose an application/session facade that handles workspace selection, permission cache loading, and organization/team creation/join flows; UI header dropdown should bind to this facade’s signals and invoke commands rather than embedding data/logic. Guards and mutations must first assert workspace access then module enablement, using the cached permissions derived from projections.

## Implementation Guidance

- **Objectives**: Deliver end-to-end organization management (create org/team, join/invite, select workspace, link projects) with event-sourced domain, Firestore projections, and UI wired through a session facade respecting SRP and layering.
- **Key Tasks**: Define organization/team aggregates, events, policies, and repositories; implement projectors for OrganizationDoc/OrgMemberDoc/TeamDoc and account denormalization; add application services + Angular facade for workspace/permission cache + creation/join actions; refactor header UI to consume facade outputs and remove hardcoded data.
- **Dependencies**: Event store and projector infrastructure, module registry/gating from workspace aggregate, ACLService/permission cache pattern in UI, Firestore indexes for organizationId/projectId/moduleKey.
- **Success Criteria**: No hardcoded org data in UI; organization/team domain represented by aggregates/events; Firestore read models align with documented schemas; account/org/team permission denormalization maintained; workspace selection and creation flows run through facade with module/permission gating and causality metadata captured in events.
