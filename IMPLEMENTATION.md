# Organization Creation - CQRS/DDD Implementation

## Architecture Flow

```
UI Component
  ↓ (sends Command)
CreateOrganizationService (Angular Service)
  ↓ (calls)
CreateOrganizationUseCase (core-engine)
  ↓ (uses)
WorkspaceRepositoryPort (interface)
  ↓ (implemented by)
WorkspaceRepositoryFirebase (platform-adapters)
  ↓ (calls)
Workspace.createOrganization() (saas-domain)
  ↓ (emits)
WorkspaceCreatedEvent (saas-domain)
  ↓ (writes via)
firebase-admin SDK (firestore)
  ↓
Firestore Collections (workspaces, workspace-events)
```

## Package Responsibilities

### core-engine (Infrastructure/Application Layer)
**Location:** `packages/core-engine/src`

**Responsibilities:**
- Define Commands (DTOs for user intent)
- Define Ports (interfaces for repositories)
- Implement Use Cases (application logic orchestration)
- Pure TypeScript - NO SDKs allowed

**Files:**
- `commands/create-organization.command.ts` - Command interface
- `ports/workspace.repository.port.ts` - Repository interface
- `use-cases/create-organization.usecase.ts` - Use case implementation

### saas-domain (Domain Layer)
**Location:** `packages/saas-domain/src`

**Responsibilities:**
- Domain Aggregates (Workspace)
- Domain Events (WorkspaceCreatedEvent)
- Business logic and validation
- Pure TypeScript - NO SDKs or framework dependencies

**Files:**
- `aggregates/workspace.aggregate.ts` - Workspace aggregate with business logic
- `events/workspace-created.event.ts` - Domain event

### platform-adapters (Infrastructure Layer)
**Location:** `packages/platform-adapters/src/firebase-platform`

**Responsibilities:**
- Implement repository ports
- Use firebase-admin SDK (ONLY layer allowed to use SDKs)
- Write to Firestore

**Files:**
- `workspace.repository.firebase.ts` - Implements WorkspaceRepositoryPort using firebase-admin

### ui-angular (Presentation Layer)
**Location:** `packages/ui-angular/src/app/workspaces`

**Responsibilities:**
- User interface components
- Send commands to use cases
- NO direct SDK usage
- NO direct repository access

**Files:**
- `create-organization-form.component.ts` - UI component
- `create-organization.service.ts` - Angular service that wires UseCase and Repository

## Key Design Decisions

### 1. Organization is Workspace Type
Organization is NOT a separate aggregate. It's a Workspace with `type = 'organization'`.

```typescript
const workspace: Workspace = {
  workspaceId,
  type: 'organization',  // <-- Type determines it's an organization
  name,
  ownerUserId,
  members: [{ userId: ownerUserId, role: 'owner' }]
}
```

### 2. Owner Role Initialization
When creating an organization, the creator automatically becomes the owner:

```typescript
members: [
  { userId: ownerUserId, role: 'owner' }
]
```

### 3. No Express/HTTP Server
❌ NO Express
❌ NO HTTP endpoints
✅ Direct function calls via Angular dependency injection

### 4. Firebase Admin SDK Isolation
firebase-admin ONLY exists in `platform-adapters`:

```
✅ platform-adapters/src/firebase-platform/workspace.repository.firebase.ts
❌ NOT in core-engine
❌ NOT in saas-domain
❌ NOT in ui-angular
```

## Data Flow Example

```typescript
// 1. UI sends command
const workspaceId = await createOrgService.createOrganization({
  accountId: 'user-123',
  name: 'Acme Corporation',
  ownerUserId: 'user-123'
});

// 2. Use Case validates and creates workspace
const workspace = {
  workspaceId: 'ws-123',
  type: 'organization',
  name: 'Acme Corporation',
  ownerUserId: 'user-123',
  members: [{ userId: 'user-123', role: 'owner' }],
  createdAt: '2026-01-08T16:00:00.000Z',
  modules: []
};

// 3. Repository calls Domain
const { workspace, event } = Workspace.createOrganization(...);

// 4. Repository saves via firebase-admin
await workspacesCollection.doc(workspaceId).set(workspace.toSnapshot());
await eventsCollection.doc().set(event);
```

## Firestore Collections

### workspaces
```typescript
{
  workspaceId: string;
  accountId: string;
  type: 'organization';
  name: string;
  ownerUserId: string;
  members: Array<{ userId: string; role: string }>;
  createdAt: string;
  modules: [];
}
```

### workspace-events
```typescript
{
  workspaceId: string;
  accountId: string;
  type: 'organization';
  name: string;
  ownerUserId: string;
  timestamp: string;
}
```

## Package Boundaries Verification

✅ **core-engine** - No SDK imports, only interfaces and use cases
✅ **saas-domain** - No SDK imports, pure domain logic
✅ **platform-adapters** - Only layer with firebase-admin
✅ **ui-angular** - Only sends commands, no direct DB access

## Dependency Direction

```
account-domain → saas-domain → ui-angular
       \          ^
        \         |
         → core-engine ← platform-adapters
```

All dependencies point inward. Domain has no knowledge of infrastructure.
