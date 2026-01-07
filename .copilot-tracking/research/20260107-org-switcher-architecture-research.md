<!-- markdownlint-disable-file -->

# Task Research Notes: Organization switcher actions & architecture boundaries

## Research Executed

### File Analysis

- packages/ui-angular/src/app/layout/basic/widgets/user.component.ts
  - Header user dropdown currently inlines owned/joined organization arrays, holds selectedOrganizationId state, and triggers placeholder router navigation for create org/team/partner with membership check embedded in component.
- docs/Mermaid-架構層.md
  - Defines layered responsibilities: Identity/Workspace separation, Module/Domain handles business logic and events, UI only consumes projections via @angular/fire and guards gating; all events include workspaceId/moduleKey/actor/causality metadata.
- docs/Mermaid-概念層.md
  - Clarifies actors vs Organization/Team as resource owners; workspace selection mandatory; roles owner/admin/member/viewer plus Team roles; permissions computed via claims/cache rather than UI logic.
- docs/Mermaid-實作指引.md
  - Implementation notes for Angular: UI provides workspace selector, fetches permissions via API, caches and applies via ACL service; every request carries workspaceId/moduleKey.
- packages/account-domain/src/value-objects/workspace-type.ts
  - WorkspaceType union of organization|project|personal, reinforcing container boundary for modules/entities.

### Code Search Results

- `grep -R "workspace" packages/ui-angular/src/app` → only match in user.component.ts indicates no shared workspace/session service yet.
- `grep -R "Team" docs/Mermaid-概念層.md` → Team identified as resource owner with roles; no Partner concept defined elsewhere.

### External Research

- #githubRepo:"(not required)"  
  - Not consulted; requirements scoped to internal architecture docs and current UI implementation.
- #fetch:(none)  
  - No external HTTP sources needed for this research.

### Project Conventions

- Standards referenced: Mermaid architecture/concept/implementation guides; Domain layer event metadata and workspace gating rules; UI layer consumes projections and should avoid domain logic.
- Instructions followed: Research-only scope, single responsibility emphasis, boundaries between UI and domain per docs/Mermaid-架構層.md and docs/Mermaid-實作指引.md.

## Key Discoveries

### Project Structure

- UI org switcher lives in `packages/ui-angular/src/app/layout/basic/widgets/user.component.ts` under layout/basic/widgets.
- Domain containers defined at workspace level (organization/project/personal) per `workspace-type.ts`; architecture layers in docs govern responsibilities.

### Implementation Patterns

- Current user component is UI-heavy: hardcoded org lists, inline membership check, direct router navigation placeholders. No facade/service for session, org membership, or permissions.
- Architecture docs expect UI to read projections (read models) and delegate workspace gating/permissions to services; domain events carry workspace/module context and actor metadata.
- Implementation guide provides permission service pattern using HTTP + ACLService to set abilities when switching workspace.

### Complete Examples

```typescript
// packages/ui-angular/src/app/layout/basic/widgets/user.component.ts
selectOrganization(orgId: string): void {
  this.selectedOrganizationId = orgId;
  this.router.navigateByUrl(`/organizations/${orgId}`).catch(() => void 0);
}
```

```typescript
// docs/Mermaid-實作指引.md — permission cache pattern
async switchProject(projectId: string) {
  const permissions = await firstValueFrom(
    this.http.get<SessionPermissionCache>(`/api/projects/${projectId}/permissions`)
  );
  this.cache.set(permissions);
  this.acl.setFull({ role: permissions.computed, ability: Object.keys(permissions.computed).filter(k => permissions.computed[k]) });
}
```

### API and Schema Documentation

- Domain event metadata requires `workspaceId`, `moduleKey`, `actorId`, `causedBy[]`, `traceId` (docs/Mermaid-架構層.md, 概念層.md).
- WorkspaceType supports `organization | project | personal` (packages/account-domain/src/value-objects/workspace-type.ts).
- Roles and permission sources: Organization role + Team permission + direct grants; Team roles maintainer|member (docs/Mermaid-概念層.md).

### Configuration Examples

```typescript
// UI layer should rely on a facade to expose signals/observables
interface OrganizationSummary { id: string; name: string; membership?: 'owner'|'admin'|'member'|'viewer'; }

@Injectable({ providedIn: 'root' })
export class WorkspaceSessionFacade {
  organizations = signal<OrganizationSummary[]>([]);
  selectedWorkspaceId = signal<string | null>(null);

  async select(orgId: string) { /* fetch permissions, update ACL, emit selection */ }
  createTeam(orgId: string) { /* route or call application service with workspaceId */ }
  createPartner(orgId: string) { /* similar, but allow non-member flow */ }
}
```

### Technical Requirements

- Workspace selection is mandatory context; every action must carry `workspaceId` and respect module enabled status before mutating entities.
- Team creation should validate membership/role via permission cache (internal accounts only); partner creation may allow non-members but still scoped to selected organization for audit.
- UI must remain presentation-only: fetch organization list and permissions via facade/application services, not hardcoded arrays; navigation should be delegated to routing service/facade with placeholder routes replaced by actual use-case handlers.

## Recommended Approach

Adopt a Workspace/Organization session facade that exposes read-model data (owned/joined orgs, selection) and methods (select, createOrganization, createTeam, createPartner) while enforcing permission checks via the permission cache pattern from docs/Mermaid-實作指引.md. The header component should consume signals from this facade, display organization lists from projections, and invoke facade commands; membership gating for team creation should rely on computed permissions (owner/admin/member) rather than inline checks, while partner creation remains allowed for external collaborators but still requires a selected organization context. All facade commands must include `workspaceId`/`moduleKey` metadata and respect module-enabled gating before emitting domain events or navigation.

## Implementation Guidance

- **Objectives**: Align org switcher actions with layered architecture, delegate business rules to services, and enforce workspace/permission gating.
- **Key Tasks**: Build workspace/session facade in core/ui-angular; replace hardcoded org arrays with projection-fed data; implement permission cache application when selecting org; gate team creation by membership/role; allow partner creation with selected org context; route through application services instead of component-level router calls.
- **Dependencies**: Permissions API/read-model, ACLService wiring (per docs/Mermaid-實作指引.md), workspace type definitions from account-domain.
- **Success Criteria**: Header component becomes presentation-only with no inline business logic or hardcoded data; all actions include workspace context and respect module enablement; permissions are derived from cached projection, satisfying single responsibility and boundary rules from architecture docs.
