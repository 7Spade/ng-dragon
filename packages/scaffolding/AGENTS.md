# scaffolding Package Agents Documentation

## Package Overview

**Purpose**: Minimal scaffolding utilities to bootstrap and initialize the workspace-domain package.

**Scope**: Utility functions and factory helpers for workspace setup.

## Package Boundaries

### ✅ What belongs here

- Workspace factory functions
- Bootstrap utilities for workspace initialization
- Helper functions for workspace setup
- Migration utilities for existing workspace data

### 🚫 What does NOT belong here

- Core domain logic (belongs in workspace-domain)
- Infrastructure implementations (belongs in platform-adapters)
- UI components (belongs in ui-angular)

## Directory Structure

```
scaffolding/
├── src/
│   ├── bootstrap.ts        # Bootstrap utilities
│   ├── factory.ts          # Factory helper functions
│   └── migration.ts        # Migration utilities
├── index.ts                # Main entry point
├── package.json
├── tsconfig.json
├── README.md
└── AGENTS.md (this file)
```

## Key Concepts

### Bootstrap Utilities

Functions to initialize workspace-domain with default configuration:
- `bootstrapWorkspace()`: Create initial workspace setup
- `initializeWorkspaceDefaults()`: Set up default workspace configuration

### Factory Helpers

Helper functions for creating workspace instances:
- `createWorkspaceFactory()`: Factory function generator
- `buildWorkspaceFromData()`: Convert raw data to workspace aggregate

### Migration Utilities

Tools for migrating existing workspace data:
- `migrateWorkspaceData()`: Transform legacy workspace format
- `validateWorkspaceSchema()`: Ensure data integrity

## Dependency Rules

### Allowed Dependencies

- `@ng-events/workspace-domain`: Core workspace domain (required)
- TypeScript standard library

### Forbidden Dependencies

- ❌ Infrastructure libraries (firebase, http, etc.)
- ❌ UI frameworks (Angular, React, etc.)
- ❌ Database drivers

## Export Rules

All utilities must be exported through `index.ts`:

```typescript
// Correct usage
import { bootstrapWorkspace } from '@ng-events/scaffolding';
```

## Development Guidelines

1. **Keep It Minimal**: Only include essential scaffolding utilities
2. **Pure Functions**: All functions should be pure and testable
3. **Type Safety**: Use TypeScript strict mode
4. **Documentation**: Document all exported functions with JSDoc

## Usage Examples

```typescript
import { bootstrapWorkspace } from '@ng-events/scaffolding';
import { WorkspaceType } from '@ng-events/workspace-domain';

const workspace = bootstrapWorkspace({
  workspaceType: 'organization' as WorkspaceType,
  name: 'My Organization',
  accountId: 'user123'
});
```

## Purpose

This package exists to:
1. Provide reusable workspace initialization logic
2. Simplify workspace-domain setup in different contexts
3. Offer migration paths for existing workspace data
4. Reduce boilerplate in consuming packages
