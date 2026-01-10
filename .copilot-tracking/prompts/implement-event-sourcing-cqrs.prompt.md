---
mode: agent
model: Claude Sonnet 4
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: Event Sourcing & CQRS Infrastructure

## Implementation Instructions

### Step 1: Create Changes Tracking File

You WILL create `20260110-event-sourcing-cqrs-implementation-changes.md` in #file:../changes/ if it does not exist.

### Step 2: Execute Implementation

You WILL follow #file:../../.github/instructions/task-implementation.instructions.md
You WILL systematically implement #file:../plans/20260110-event-sourcing-cqrs-implementation-plan.instructions.md task-by-task
You WILL follow ALL project standards and conventions:
- #file:../../packages/AGENTS.md - Package boundaries and dependency rules
- #file:../../.github/instructions/angular.instructions.md - Angular Signals and standalone components  
- #file:../../docs/Causality-Belongs-Where(因果歸屬).md - Causality tracking principles
- #file:../../docs/Module(業務模組).md - Module design patterns

**CRITICAL**: If ${input:phaseStop:true} is true, you WILL stop after each Phase for user review.
**CRITICAL**: If ${input:taskStop:false} is true, you WILL stop after each Task for user review.

### Step 3: Implementation Order

You MUST implement phases in this exact order:

**Phase 1: Core Infrastructure**
1. DomainEvent → EventMetadata bridge (adapter pattern)
2. Firebase Event Store (platform-adapters only)
3. Event projection infrastructure (event bus)

**Phase 2: Module Aggregates**
4. Identity aggregate (member management)
5. Access Control aggregate (roles/permissions)
6. Settings aggregate (workspace config)
7. Audit aggregate (activity logging)

**Phase 3: Application Services**
8. Identity application service (command handlers)
9. Access Control application service
10. Settings application service
11. Audit application service

**Phase 4: Projections (Read Models)**
12. Member list projector → Firestore
13. Role assignment projector → Firestore
14. Workspace profile projector → Firestore
15. Activity log projector → Firestore

**Phase 5: UI Integration**
16. Project detail component (displays workspace + modules)
17. Member list component (reads from projection)
18. Activity log component (shows causality chain)

**Phase 6: Validation**
19. Integration tests (event store, projectors)
20. E2E causality tracking test
21. AGENTS.md compliance validation

### Step 4: Package Boundary Compliance

You MUST respect these boundaries per #file:../../packages/AGENTS.md:

- ✅ account-domain → core-engine (for EventMetadata)
- ✅ saas-domain → account-domain (for aggregates)
- ✅ platform-adapters → core-engine (for IEventStore)
- ✅ ui-angular → platform-adapters (for Firebase)

- ❌ NO Firebase SDK imports in account-domain, saas-domain, core-engine
- ❌ NO direct Firebase imports in UI (use services)
- ❌ NO circular dependencies

### Step 5: Causality Tracking Requirements

Per #file:../../docs/Causality-Belongs-Where(因果歸屬).md:

Every event MUST include causality chain tracking previous events:

```typescript
Event 1: WorkspaceCreated
  causality: [] // root event

Event 2: ModuleEnabled
  causality: [evt1.eventId] // caused by workspace creation

Event 3: MemberAdded
  causality: [evt1.eventId, evt2.eventId] // full chain
```

You MUST implement this in all command handlers.

### Step 6: Testing Requirements

You WILL create tests for:
- ✅ Unit tests for aggregates (domain invariants)
- ✅ Integration tests for event store (persistence, concurrency)
- ✅ Integration tests for projectors (read model updates)
- ✅ E2E test validating full causality chain
- ✅ Compliance test for package boundaries

### Step 7: Cleanup

When ALL Phases are checked off (`[x]`) and completed you WILL do the following:

1. You WILL provide a markdown style link and a summary of all changes from #file:../changes/20260110-event-sourcing-cqrs-implementation-changes.md to the user:

   - You WILL keep the overall summary brief
   - You WILL add spacing around any lists
   - You MUST wrap any reference to a file in a markdown style link

2. You WILL provide markdown style links to:
   - .copilot-tracking/plans/20260110-event-sourcing-cqrs-implementation-plan.instructions.md
   - .copilot-tracking/details/20260110-event-sourcing-cqrs-implementation-details.md
   - .copilot-tracking/research/20260110-event-sourcing-cqrs-implementation-research.md
   
   You WILL recommend cleaning these files up as well.

3. **MANDATORY**: You WILL attempt to delete .copilot-tracking/prompts/implement-event-sourcing-cqrs.prompt.md

## Success Criteria

- [ ] Changes tracking file created and maintained
- [ ] All 6 phases completed with working code
- [ ] All detailed specifications satisfied
- [ ] Package boundaries respected (AGENTS.md compliance)
- [ ] Causality tracking validated end-to-end
- [ ] Integration and E2E tests passing
- [ ] TypeScript strict mode passing
- [ ] UI displays workspace with modules and activity log
- [ ] Planning files cleaned up
