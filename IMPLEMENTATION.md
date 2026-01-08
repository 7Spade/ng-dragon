# Organization Creation Implementation

## Architecture

This implementation follows the proper package boundaries:

```
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

## Data Flow

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
