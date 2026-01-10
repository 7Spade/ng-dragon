# Workspace Domain & Scaffolding Packages

## Overview

This document provides a quick reference for the newly created `workspace-domain` and `scaffolding` packages.

## Package Locations

```
packages/
├── workspace-domain/     # Pure TypeScript workspace domain logic
│   ├── src/
│   │   ├── aggregates/        # WorkspaceAggregate
│   │   ├── repositories/      # WorkspaceRepository interface
│   │   ├── services/          # WorkspaceSwitcher, WorkspaceLogicContainer
│   │   ├── value-objects/     # WorkspaceType, MemberRole, ModuleStatus
│   │   └── types/             # Identifiers (WorkspaceId, AccountId, etc.)
│   ├── index.ts              # Public API - single entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── README.md
│   └── AGENTS.md
│
└── scaffolding/          # Bootstrapping utilities
    ├── src/
    │   ├── bootstrap.ts       # Workspace initialization helpers
    │   ├── factory.ts         # Factory functions
    │   └── migration.ts       # Schema validation & migration
    ├── index.ts              # Public API
    ├── package.json
    ├── tsconfig.json
    ├── README.md
    └── AGENTS.md
```

## Usage Examples

### Import Aliases

```typescript
// In tsconfig paths
"@workspace-domain": ["packages/workspace-domain/index.ts"]
"@scaffolding": ["packages/scaffolding/index.ts"]
```

### workspace-domain Usage

```typescript
import {
  // Aggregates
  WorkspaceAggregate,
  WorkspaceSnapshot,
  
  // Value Objects
  WorkspaceType,
  MemberRole,
  ModuleStatus,
  
  // Services
  WorkspaceSwitcher,
  WorkspaceLogicContainer,
  WorkspaceSwitcherUtils,
  
  // Types
  WorkspaceId,
  AccountId
} from '@workspace-domain';

// Create a workspace
const { aggregate, event } = WorkspaceAggregate.create(
  {
    workspaceId: 'ws-123',
    accountId: 'user-456',
    workspaceType: 'organization',
    name: 'My Organization'
  },
  { actorId: 'user-456' }
);

// Check permissions
const canManage = WorkspaceLogicContainer.canAccountManageWorkspace(
  aggregate.state,
  'user-456'
);

// Convert to view
const view = WorkspaceSwitcherUtils.snapshotToView(aggregate.state);
```

### scaffolding Usage

```typescript
import {
  // Bootstrap
  bootstrapWorkspace,
  createPersonalWorkspace,
  createOrganizationWorkspace,
  
  // Factory
  buildWorkspaceFromData,
  createWorkspaceFactory,
  
  // Migration
  validateWorkspaceSchema,
  migrateWorkspaceData
} from '@scaffolding';

// Quick workspace creation
const personal = createPersonalWorkspace('user-123');

// Create organization
const org = createOrganizationWorkspace('user-123', 'Acme Corp');

// Validate data
const validation = validateWorkspaceSchema({
  id: 'ws-123',
  accountId: 'user-123',
  type: 'organization',
  name: 'My Org'
});

if (validation.valid) {
  // Schema is valid
}
```

## Building the Packages

```bash
# Build workspace-domain
cd packages/workspace-domain
npm run build

# Build scaffolding (depends on workspace-domain)
cd packages/scaffolding
npm run build
```

## Key Features

### workspace-domain

1. **WorkspaceAggregate**: Core domain entity
   - `create()`: Create new workspace with event
   - `toggleModule()`: Enable/disable modules
   - `state`: Access current snapshot
   - `hasMember()`, `getMemberRole()`: Member queries

2. **WorkspaceLogicContainer**: Business logic
   - `validateWorkspaceCreation()`: Validate creation input
   - `canAccountManageWorkspace()`: Permission checking
   - `canAccountManageModules()`: Module permission checking
   - `getDisplayName()`: UI display helpers

3. **WorkspaceSwitcher**: Abstract switching logic
   - Define switching behavior
   - Manage active workspace state
   - Filter and select workspaces

4. **Value Objects**:
   - `WorkspaceType`: 'personal' | 'organization' | 'team' | 'partner' | 'project'
   - `MemberRole`: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
   - `ModuleStatus`: Module enablement state

### scaffolding

1. **Bootstrap**: Quick workspace creation
   - `createPersonalWorkspace()`
   - `createOrganizationWorkspace()`
   - `createTeamWorkspace()`
   - `bootstrapWorkspace()`: Generic creation

2. **Factory**: Flexible workspace creation
   - `createWorkspaceFactory()`: Custom factory
   - `buildWorkspaceFromData()`: From raw data
   - `createFromSnapshot()`: From snapshot

3. **Migration**: Data validation & migration
   - `validateWorkspaceSchema()`: Schema validation
   - `migrateWorkspaceData()`: Legacy data migration
   - `normalizeWorkspaceSnapshot()`: Export normalization

## Design Principles

### workspace-domain

- ✅ Pure TypeScript - no framework dependencies
- ✅ No SDKs (firebase-admin, etc.)
- ✅ Frontend & backend safe
- ✅ Single entry point (index.ts)
- ✅ No direct imports from internal files

### scaffolding

- ✅ Minimal utilities only
- ✅ Depends on workspace-domain
- ✅ Pure functions
- ✅ No infrastructure code

## Integration Points

### For Platform Adapters

Implement `WorkspaceRepository` interface from workspace-domain:

```typescript
import { WorkspaceRepository } from '@workspace-domain';

export class FirestoreWorkspaceRepository implements WorkspaceRepository {
  async appendWorkspaceEvent(event) { /* ... */ }
  async saveWorkspaceSnapshot(snapshot) { /* ... */ }
  async getWorkspaceSnapshot(id) { /* ... */ }
  async listWorkspaces() { /* ... */ }
  // ...
}
```

### For UI Angular

Extend `WorkspaceSwitcher` abstract class:

```typescript
import { WorkspaceSwitcher, WorkspaceView } from '@workspace-domain';

@Injectable()
export class AngularWorkspaceSwitcher extends WorkspaceSwitcher {
  // Implement abstract methods with Angular services
}
```

## Documentation

- **workspace-domain/README.md**: Package overview and usage
- **workspace-domain/AGENTS.md**: Architecture rules and boundaries
- **scaffolding/README.md**: Utility documentation
- **scaffolding/AGENTS.md**: Scaffolding guidelines

## Next Steps

1. ✅ Packages created and compiling
2. ✅ TypeScript paths configured
3. ⏭️ Implement WorkspaceRepository in platform-adapters
4. ⏭️ Implement WorkspaceSwitcher in ui-angular
5. ⏭️ Migrate existing workspace code to use new packages
