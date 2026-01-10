# Event Sourcing & CQRS Implementation

## Overview

This document describes the Event Sourcing and CQRS implementation across the ng-dragon platform, following the architectural principles defined in the documentation.

## Architecture Principles

### Core Concepts

1. **Account**: The sole business actor (who)
2. **Workspace**: Logical container (where)
3. **Module**: Business capability (what)
4. **Entity**: State holder (data)
5. **Event**: Business fact (what happened)

### Dependency Chain

```
Account → Workspace → Module → Entity → Event
```

Each layer can only reference layers to the right, never to the left.

## Package Structure

### core-engine

Pure TypeScript infrastructure for Event Sourcing and CQRS:

- **EventMetadata**: Complete event context with causality tracking
- **CausalityChain**: Event causality relationships
- **AffectedEntity**: Tracks entities impacted by events
- **IEventStore**: Event persistence interface
- **IEventProjector**: Read model projection interface
- **IEventReplayer**: Aggregate state rebuild interface

### account-domain

Core domain aggregates and events:

- **WorkspaceAggregate**: Workspace lifecycle and module management
- **AccountAggregate**: Account creation and workspace associations
- **ModuleRegistryAggregate**: Module enable/disable tracking
- **DomainEvent**: Simplified event structure for domain

### saas-domain

Business modules with event-sourced aggregates:

#### Identity Module
- **MembershipAggregate**: Event-sourced membership management
- **MemberListProjector**: Read model for member queries
- **MembershipApplicationService**: Orchestrates member operations
- Events: MemberAdded, MemberRemoved, MemberRoleChanged

#### Access Control Module
- **AccessControlAggregate**: Event-sourced role/permission management
- Default roles: owner, admin, member, guest
- Permission-based authorization
- Events: RoleAssigned, RoleRevoked, PermissionGranted

#### Settings Module
- **WorkspaceSettingsAggregate**: Event-sourced settings management
- **WorkspaceProfile**: Workspace metadata and configuration
- Feature flag management
- Events: SettingsUpdated, FeatureToggled, ProfileUpdated

#### Audit Module
- **AuditLogAggregate**: Event-sourced audit trail
- **ActivityLog**: Immutable activity records
- Automatic event recording
- Events: ActivityRecorded

### platform-adapters

Firebase implementation of core-engine interfaces:

- **FirebaseEventStore**: Firestore-based event persistence
  - Optimistic concurrency control
  - Event streams per aggregate
  - Scope-based querying for workspace isolation

## Event Sourcing Flow

### 1. Command Execution

```typescript
// Application service receives command
const command: AddMemberCommand = {
  workspaceId: 'ws-123',
  accountId: 'acc-456',
  roleType: 'member',
  actorId: 'acc-789',
  traceId: 'trace-001',
  causedBy: ['evt-parent-1']
};
```

### 2. Aggregate Load

```typescript
// Load event stream from store
const stream = await eventStore.getEventStream('ws-123', 'Membership');

// Replay events to rebuild state
const aggregate = await replayer.replay(stream);
```

### 3. Business Logic

```typescript
// Execute business logic in aggregate
const { aggregate: next, event } = aggregate.addMember(
  command.accountId,
  command.roleType,
  context
);
```

### 4. Event Persistence

```typescript
// Append event to stream
await eventStore.appendEvents(
  'ws-123',
  'Membership',
  [{ eventType: 'MemberAdded', payload, metadata }],
  { expectedVersion: stream.currentVersion }
);
```

### 5. Projection Update

```typescript
// Projector listens to events and updates read model
const projection = await projector.project(event, currentProjection);
```

## Causality Tracking

Events track complete causality chains:

```typescript
{
  eventId: 'evt-123',
  eventType: 'MemberAdded',
  metadata: {
    eventId: 'evt-123',
    traceId: 'trace-001',
    actorAccountId: 'acc-789',
    containerScope: {
      workspaceId: 'ws-123',
      moduleKey: 'identity'
    },
    causality: {
      causes: ['evt-workspace-created', 'evt-module-enabled']
    },
    occurredAt: '2024-01-10T10:30:00Z',
    affects: [
      { entityId: 'member-456', entityType: 'Member', changeType: 'created' }
    ]
  }
}
```

## Module Activation Flow

1. **WorkspaceCreated** event occurs
2. **ModuleEnabled** event activates a module
3. Module aggregate bootstraps (e.g., MembershipAggregate)
4. Module operations begin (e.g., addMember)
5. Each event references causality chain

## UI Integration

### Project Detail Component

Displays workspace information with module status:

```typescript
// Base modules configuration
baseModules = [
  {
    key: 'identity',
    name: 'Identity & Members',
    capabilities: ['Add/remove members', 'Role assignment', ...]
  },
  {
    key: 'access-control',
    name: 'Access Control',
    capabilities: ['Role definitions', 'Permission management', ...]
  },
  {
    key: 'settings',
    name: 'Settings & Profile',
    capabilities: ['Workspace profile', 'Feature flags', ...]
  },
  {
    key: 'audit',
    name: 'Audit & Activity',
    capabilities: ['Activity logging', 'Event audit trail', ...]
  }
];
```

## AGENTS.md Compliance

✅ **Package Boundaries**:
- core-engine: Pure TypeScript, zero framework dependencies
- account-domain: Uses core-engine, no Firebase
- saas-domain: Uses account-domain and core-engine
- platform-adapters: ONLY place for Firebase SDK
- ui-angular: Uses services from saas-domain via platform-adapters

✅ **Dependency Direction**:
- Account → Workspace → Module → Entity ✓
- No circular dependencies ✓
- Modules use Account, don't own it ✓

✅ **Event Sourcing Best Practices**:
- Events record business facts only ✓
- No events for technical flows ✓
- Complete causality tracking ✓
- Immutable event stream ✓

## Future Enhancements

### Planned
- [ ] Complete EventReplayer implementation
- [ ] Projection consistency guarantees
- [ ] Event versioning and migration
- [ ] Saga orchestration for multi-aggregate workflows
- [ ] Advanced projections (statistics, reports)

### Under Consideration
- [ ] Event snapshots for performance
- [ ] Parallel event processing
- [ ] Event streaming/subscriptions
- [ ] Time-travel debugging

## Testing Strategy

### Unit Tests
- Aggregate behavior and invariants
- Event generation correctness
- Projection logic

### Integration Tests
- Event store persistence
- Event replay accuracy
- Projection consistency

### End-to-End Tests
- Complete causality chains
- Multi-module workflows
- UI module display

## References

- [AGENTS.md](/packages/AGENTS.md) - Package boundaries
- [架構.md](/docs/架構.md) - Platform architecture
- [Module(業務模組).md](/docs/Module(業務模組).md) - Module design
- [Causality-Belongs-Where.md](/docs/Causality-Belongs-Where(因果歸屬).md) - Causality tracking
- [Logical-Container-Role.md](/docs/Logical-Container-Role(邏輯容器角色).md) - Container design
