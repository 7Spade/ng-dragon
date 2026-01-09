# Organization Creation Implementation

## Architecture

This implementation follows the proper package boundaries:

```
<<<<<<< HEAD
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
=======
UI (Angular Component)
  ↓ HTTP POST /api/organizations
Express Server (server.ts in ui-angular)
  ↓ uses
platform-adapters/WorkspaceRepositoryFirebase
  ↓ uses
firebase-admin SDK
  ↓ writes to
Firestore (workspace-events & workspaces collections)
```

## Package Boundaries Respected
>>>>>>> parent of bb1161d (Implement proper CQRS/DDD architecture without Express - UI -> UseCase -> Domain -> firebase-admin)

✅ **UI Layer** (`packages/ui-angular/src/app`)
- Angular component calls HTTP API
- No direct SDK usage
- No domain logic

✅ **Server API** (`packages/ui-angular/server.ts`)
- Express server provides `/api/organizations` endpoint
- Uses `platform-adapters` layer
- No direct SDK usage

✅ **Platform Adapters** (`packages/platform-adapters/src/firebase-platform`)
- `WorkspaceRepositoryFirebase` uses `firebase-admin`
- **ONLY** layer allowed to use SDKs
- Implements repository interface from domain

✅ **Domain Layers** (`packages/account-domain`, `packages/saas-domain`)
- Pure TypeScript
- No framework dependencies
- No SDK dependencies

## firebase-admin Usage

The entire implementation uses `firebase-admin`:

<<<<<<< HEAD
### platform-adapters (Infrastructure Layer - Server Only)
**Location:** `packages/platform-adapters/src/firebase-platform`

**Responsibilities:**
- Implement repository ports for server-side
- Use firebase-admin SDK (ONLY layer allowed to use server SDKs)
- Write to Firestore from backend

**Files:**
- `workspace.repository.firebase.ts` - Implements WorkspaceRepositoryPort using firebase-admin
- **Exported from:** `packages/platform-adapters/server.ts` (NOT main index)
=======
1. **Platform Adapters Layer**
   - `packages/platform-adapters/src/firebase-platform/firestore/index.ts`
     - Imports `firebase-admin/firestore`
     - Initializes Firestore with `getFirestore(getFirebaseAdminApp())`
   
   - `packages/platform-adapters/src/firebase-platform/workspace.repository.firebase.ts`
     - Uses `getCollection()` which uses firebase-admin
     - Writes events to `workspace-events` collection
     - Writes snapshots to `workspaces` collection

2. **Server API**
   - `packages/ui-angular/server.ts`
     - Instantiates `WorkspaceRepositoryFirebase`
     - Passes to `WorkspaceApplicationService`
     - ALL database writes go through firebase-admin

3. **UI Component**
   - `packages/ui-angular/src/app/workspaces/create-organization-form.component.ts`
     - Calls `/api/organizations` HTTP endpoint
     - No direct Firestore or firebase-admin usage
>>>>>>> parent of bb1161d (Implement proper CQRS/DDD architecture without Express - UI -> UseCase -> Domain -> firebase-admin)

## Data Flow

<<<<<<< HEAD
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
=======
1. User fills organization form
2. Component calls `/api/organizations` with name and accountId
3. Server creates `CreateOrganizationCommand`
4. Server calls `WorkspaceApplicationService.createOrganization()`
5. Service uses `WorkspaceFactory` to create aggregate and event
6. Service calls `WorkspaceRepositoryFirebase.appendWorkspaceEvent()` and `saveWorkspaceSnapshot()`
7. Repository uses **firebase-admin** to write to Firestore
8. Server returns success response
9. UI shows success message

## Firebase Collections
>>>>>>> parent of bb1161d (Implement proper CQRS/DDD architecture without Express - UI -> UseCase -> Domain -> firebase-admin)

### workspace-events
Event sourcing events written via firebase-admin:
```typescript
{
  eventType: "WorkspaceCreated",
  aggregateId: workspaceId,
  accountId: uid,
  workspaceId: workspaceId,
  payload: WorkspaceSnapshot,
  metadata: { actorId, traceId, occurredAt }
}
```

<<<<<<< HEAD
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
=======
### workspaces
Organization snapshots written via firebase-admin:
```typescript
{
  workspaceId: uuid,
  accountId: uid,
  workspaceType: "Organization",
  modules: [],
  createdAt: timestamp,
  name: string
}
```

## Deployment

### Development
```bash
cd packages/ui-angular
npm install
npm run build
npm run build:server
npm run serve
```

### Production (Firebase App Hosting)
The `server.ts` runs on Cloud Run with Node.js runtime.
firebase-admin automatically authenticates using Application Default Credentials.
No environment variables needed.

## Testing with Playwright

The implementation is ready for testing with Playwright MCP:
1. Start server: `npm run serve`
2. Navigate to http://localhost:4200/
3. Login with test account
4. Click avatar → Create organization
5. Submit form
6. Verify success message
7. Check Firestore collections for data
>>>>>>> parent of bb1161d (Implement proper CQRS/DDD architecture without Express - UI -> UseCase -> Domain -> firebase-admin)
