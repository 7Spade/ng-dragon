# Gap analysis vs `copilot/fix-structure-boundary-issues`

Purpose: document what the comparison branch already provides that is absent on the current branch, and outline what to build to both reach feature parity and surpass it.

## Summary of missing capabilities
- **Event-sourcing/CQRS scaffolding** is missing: the comparison branch carries `IEventStore`, projector/replayer ports, causality metadata/value objects, and the global search query VO that power cross-module workflows.
- **Firebase/Firestore adapters for the event store and search** are missing: `FirebaseEventStore` and `FirestoreSearchRepository` implementations (plus workspace client adapters) are absent, so persistence and lookup paths are not wired.
- **Workspace base modules** are missing: Identity (membership lifecycle), Access Control (roles/permissions), Audit (activity log), Settings (feature flags/profile) along with project/team/partner aggregates and commands are not present.
- **Workspace UI flows** are missing: organization/partner/project/team creation forms & services, member/partner/project/team list/detail views, and the global search widget are removed, along with supporting i18n entries.
- **Automation/tooling** gaps: Copilot/MCP workflows & configs, Playwright workflow, and earlier ESLint/tsconfig settings from that branch are not present, reducing CI coverage and coding automation.

## Detailed gaps and “surpass” recommendations

### Core engine
- Missing artifacts (in comparison branch): `src/ports/event-store.interface.ts`, projector/replayer interfaces, `value-objects/{event-metadata,causality-chain,affected-entity}.ts`, `queries/search-query.ts`, and the domain event mapper.
- Impact: no contract for append/replay pipelines, no causality metadata, no validated search request model.
- To surpass: reintroduce the event-store/search contracts with stricter typing (sealed metadata type, branded IDs), add schema validation for appendEvents payloads, and provide replay hooks with backpressure options.

### Platform adapters
- Missing artifacts: `persistence/firebase-event-store.ts`, `search/firestore-search.repository.ts`, and workspace/client adapters under `src/client-adapter/workspaces/*` & `auth/firebase-auth.client.ts`.
- Impact: no concrete event persistence, no search indexing/query path, and workspace/account operations cannot reach Firebase from UI.
- To surpass: rebuild the Firebase event store with transaction-based optimistic concurrency, per-aggregate streams, and retry/backoff; add search repository with composite index hints and relevance scoring; expose workspace/auth client adapters via factories with cache + error translation.

### SaaS domain
- Missing artifacts: workspace modules Identity (membership aggregate/projector), Access Control (roles/permissions), Audit (activity logging), Settings (feature flags/profile), plus `project-collaboration.aggregate.ts`, `team.aggregate.ts`, and commands (`create-partner`, `create-project`, `create-team`, enriched `create-organization`).
- Impact: cannot model membership lifecycle, authorization policies, audit trails, settings toggles, or team/project/partner lifecycles in-domain; application service lacks factory hooks.
- To surpass: restore these aggregates/events and tighten invariants (e.g., role/permission matrices, membership status transitions, audit entry normalization), add domain services for module bootstrap, and wire factories so workspace creation emits module bootstrap events.

### UI (Angular)
- Missing artifacts: global search component/service, workspace context service, organization/partner/project/team creation forms & services, members/partners/projects/teams list/detail views, and related i18n keys.
- Impact: no end-user flows to create/manage workspace entities or search across them; authentication flows lack context bootstrap; header widget lost member/profile awareness.
- To surpass: reintroduce the components using signals + OnPush, align forms with domain commands, add accessible focus/ARIA patterns, restore i18n keys, and add lightweight e2e smoke paths for the restored flows.

### Tooling & automation
- Missing artifacts: Copilot/MCP configs (`.github/copilot/*`), automation workflows (`copilot-agent`, `copilot-setup-steps`, `mcp-validation`, `playwright`), and lint/spec configs from the comparison branch.
- Impact: reduced automated assistance, fewer guardrails for MCP integration, and no scheduled Playwright smoke tests.
- To surpass: restore/modernize these workflows (pin action SHAs, least-privilege permissions), add cache keys for pnpm/yarn, and gate on lint + focused Playwright suites covering restored UI flows.

## Suggested next steps (priority order)
1) Reinstate core-engine contracts and Firebase adapters, adding validation/backpressure and documenting Firestore indexes.  
2) Bring back Identity/Access-Control/Audit/Settings modules with stricter invariants and hook them into workspace factory/application service.  
3) Restore workspace UI flows (create/list/detail/search) with accessibility and signal-based state, plus i18n updates.  
4) Re-enable automation (Copilot/MCP + Playwright) with locked dependencies and minimal permissions.

## Superior implementation blueprint (to surpass `copilot/fix-structure-boundary-issues`)
- **Core engine (CQRS + ES contracts)**
  - Reintroduce event-store/projector/replayer ports with branded IDs and sealed metadata (eventId, aggregateId, causality links, occurredAt) to prevent cross-stream drift.
  - Validate `appendEvents` payloads (schema + max batch size) and expose replay options with backpressure (page size, stop tokens) so long-running rebuilds do not starve live traffic.
  - Provide a mapper that normalizes event envelopes and guarantees immutable payload snapshots before adapters persist them.
- **Platform adapters (Firebase/Firestore)**
  - Implement `FirebaseEventStore` using per-aggregate collections, transaction-based optimistic concurrency, and retry/backoff policy; store causality chain + affected entities for cross-module debugging.
  - Add `FirestoreSearchRepository` that writes queryable projections with composite-index hints; keep Firestore types inside adapters and surface DTOs only.
  - Register AngularFire with tree-shakeable providers (`provideFirebaseApp`, `provideFirestore`) inside `platform-adapters`; inject via tokens so UI never sees SDK types.
- **Domain (workspace base modules)**
  - Rebuild Identity/Access-Control/Audit/Settings modules with stricter invariants (role/membership matrices, single source of truth for status transitions) and emit bootstrap events when a workspace is created.
  - Keep domain pure TypeScript: no SDK, no Angular, no date/uuid construction without injected factories. Surface repository interfaces that the Firebase adapters implement.
- **UI (Angular)**
  - Restore workspace CRUD and global search as standalone, lazy-loaded components that use `signal()/computed()/effect()` for state and `toSignal()` only at the adapter boundary.
  - Use route-level providers for feature slices, OnPush change detection, accessible focus order, and ARIA landmarks for forms/lists/search results.
  - Keep all I/O in adapter facades; templates bind to readonly signals to minimize re-render churn and reduce bundle size.
- **Automation/tooling**
  - Re-enable MCP/Playwright/GitHub Actions with pinned SHAs, least-privilege permissions, and pnpm caching. Add emulator-based adapter tests (no live Firebase in CI).
  - Gate merges on lint + focused Playwright smoke for restored flows; publish artifacts (coverage, accessibility snapshots) for triage.
