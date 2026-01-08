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
WorkspaceRepositoryClient (ui-angular) - Uses @angular/fire
  ↓ (writes via)
@angular/fire/firestore (client SDK)
  ↓
Firestore Collections (workspaces, workspace-events)
```

## Critical: Frontend vs Backend SDK Separation

### ⚠️ The Problem
- `packages/platform-adapters` contains `firebase-admin` (Node.js only)
- If `ui-angular` imports `platform-adapters`, Vite will try to bundle `firebase-admin` → 💥 Build fails

### ✅ The Solution

**Frontend (ui-angular)**:
- Uses `@angular/fire` (browser-compatible client SDK)
- `WorkspaceRepositoryClient` implements `WorkspaceRepositoryPort` using client SDK
- NO imports from `platform-adapters/firebase-platform`

**Backend (platform-adapters)**:
- Uses `firebase-admin` (server-only SDK)
- `WorkspaceRepositoryFirebase` implements `WorkspaceRepositoryPort` using admin SDK
- Exported from `platform-adapters/server.ts` (NOT from main index)

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

### platform-adapters (Infrastructure Layer - Server Only)
**Location:** `packages/platform-adapters/src/firebase-platform`

**Responsibilities:**
- Implement repository ports for server-side
- Use firebase-admin SDK (ONLY layer allowed to use server SDKs)
- Write to Firestore from backend

**Files:**
- `workspace.repository.firebase.ts` - Implements WorkspaceRepositoryPort using firebase-admin
- **Exported from:** `packages/platform-adapters/server.ts` (NOT main index)

### ui-angular (Presentation Layer)
**Location:** `packages/ui-angular/src/app/workspaces`

**Responsibilities:**
- User interface components
- Send commands to use cases
- Use @angular/fire client SDK
- NO direct firebase-admin usage

**Files:**
- `create-organization-form.component.ts` - UI component
- `create-organization.service.ts` - Angular service that wires UseCase and Repository
- `workspace.repository.client.ts` - Client-side repository using @angular/fire

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

### 3. Frontend Uses @angular/fire, Backend Uses firebase-admin

**Frontend (Browser)**:
```typescript
// ui-angular/src/app/workspaces/workspace.repository.client.ts
import { Firestore } from '@angular/fire/firestore';  // ✅ Client SDK
```

**Backend (Server - if needed)**:
```typescript
// platform-adapters/src/firebase-platform/workspace.repository.firebase.ts
import { getFirestore } from 'firebase-admin/firestore';  // ✅ Admin SDK
```

### 4. No Express/HTTP Server
❌ NO Express
❌ NO HTTP endpoints
✅ Direct function calls via Angular dependency injection

### 5. SDK Isolation via Separate Exports

**platform-adapters/index.ts**:
```typescript
// Only client-safe exports
export * from './src/ai';
export * from './src/external-apis';
// NO firebase-platform export here
```

**platform-adapters/server.ts** (server-only):
```typescript
// Server-only exports
export * from './src/firebase-platform';  // firebase-admin
export * from './src/persistence';
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

// 3. Repository (client) writes via @angular/fire
await setDoc(doc(workspacesCol, workspaceId), workspace);
await setDoc(doc(eventsCol), event);
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
✅ **platform-adapters** - firebase-admin only in server.ts export
✅ **ui-angular** - Uses @angular/fire client SDK, NO firebase-admin

## Dependency Direction

```
account-domain → saas-domain → ui-angular
       \          ^
        \         |
         → core-engine
                ^
                |
         platform-adapters (server-only via server.ts)
```

## Frontend Build Safety

### What Was Fixed
- ❌ Before: `ui-angular` imported `platform-adapters` → bundled `firebase-admin` → build fails
- ✅ After: `ui-angular` uses `@angular/fire` → NO `firebase-admin` in bundle → build succeeds

### Verification
```bash
# Frontend should NOT import from platform-adapters main export
grep -r "from '@platform-adapters'" packages/ui-angular/
# Should return ZERO results

# Frontend should use @angular/fire
grep -r "from '@angular/fire" packages/ui-angular/
# Should show WorkspaceRepositoryClient using @angular/fire
```
