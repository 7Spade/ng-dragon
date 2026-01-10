# workspace-domain Package Agents Documentation

## Package Overview

**Purpose**: Pure TypeScript domain layer for workspace management, workspace switching, and logic container abstractions.

**Scope**: Domain logic only - no infrastructure, no SDKs, no framework dependencies.

## Package Boundaries

### ✅ What belongs here

- Workspace aggregates and entities
- Workspace value objects (WorkspaceType, identifiers)
- Domain services (WorkspaceSwitcher, WorkspaceLogicContainer)
- Repository interfaces (ports for persistence)
- Domain events related to workspaces
- Business rules for workspace operations

### 🚫 What does NOT belong here

- Firebase, HTTP, or any external SDKs
- Angular, React, or any UI framework code
- Database schemas or Firestore documents
- API DTOs or JSON serialization
- Infrastructure implementations

## Directory Structure

```
workspace-domain/
├── src/
│   ├── aggregates/          # Workspace aggregate and domain logic
│   ├── repositories/        # Repository interfaces (ports)
│   ├── value-objects/       # WorkspaceType, immutable value objects
│   ├── types/              # Type definitions and identifiers
│   └── services/           # Domain services (switcher, container)
├── index.ts                # SINGLE entry point - all exports go through here
├── package.json
├── tsconfig.json
├── README.md
└── AGENTS.md (this file)
```

## Key Concepts

### Workspace Aggregate

The `WorkspaceAggregate` is the core domain entity that encapsulates:
- Workspace state (id, type, members, modules)
- Business rules for workspace operations
- Module enablement/disablement logic
- Member management

### Workspace Switcher

The `WorkspaceSwitcher` service provides:
- Abstract logic for switching between workspaces
- Workspace selection and activation
- Context persistence (delegated to infrastructure)

### Logic Container

The `WorkspaceLogicContainer` provides:
- Encapsulation of workspace business logic
- Workspace validation rules
- Cross-workspace operations

## Dependency Rules

### Allowed Dependencies

- `@ng-events/account-domain`: For account and identity types
- TypeScript standard library only

### Forbidden Dependencies

- ❌ `firebase-admin` or `@angular/fire`
- ❌ Any Angular, React, or UI framework
- ❌ HTTP clients or network libraries
- ❌ Database drivers or ORMs
- ❌ `@ng-events/platform-adapters`
- ❌ `@ng-events/ui-angular`

## Export Rules

### ✅ Correct Usage

```typescript
// In consuming code
import { WorkspaceAggregate, WorkspaceSwitcher } from '@ng-events/workspace-domain';
```

### ❌ Forbidden Usage

```typescript
// NEVER import from internal paths
import { WorkspaceAggregate } from '@ng-events/workspace-domain/src/aggregates/workspace.aggregate';
```

## Development Guidelines

1. **Pure Domain Logic**: All code must be pure TypeScript business logic
2. **No Side Effects**: Aggregates should be pure, side effects in services
3. **Immutability**: Value objects must be immutable
4. **Type Safety**: Use TypeScript strict mode
5. **Single Entry Point**: Export all public APIs through `index.ts`

## Testing

- Unit tests should be pure and not require infrastructure
- Mock repository interfaces for testing domain logic
- Use value objects for test data setup

## Migration Notes

This package was created to consolidate workspace logic from:
- `packages/account-domain/src/aggregates/workspace.aggregate.ts`
- `packages/account-domain/src/repositories/workspace.repository.ts`
- UI workspace switcher logic from `packages/ui-angular`

All workspace domain concerns should now live in this package, with infrastructure implementations in `platform-adapters` and UI components in `ui-angular`.
