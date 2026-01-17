---
description: 'Project structure, naming conventions, and layered dependency rules for ng-dragon'
applyTo: '**'
---

# Project Structure & Architecture Guidelines

## Core Architecture Principles

This project follows **Clean Architecture** with strict layer boundaries and dependency rules.

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │  (UI Components)
│         src/app/presentation/           │
└─────────────────┬───────────────────────┘
                  │ depends on
┌─────────────────▼───────────────────────┐
│         Application Layer               │  (Stores, Effects, Commands)
│         src/app/application/            │
└─────────────────┬───────────────────────┘
                  │ depends on
┌─────────────────▼───────────────────────┐
│           Domain Layer                  │  (Entities, Value Objects)
│         src/app/domain/                 │
└─────────────────▲───────────────────────┘
                  │ implemented by
┌─────────────────┴───────────────────────┐
│       Infrastructure Layer              │  (Firebase, Repositories)
│       src/app/infrastructure/           │
└─────────────────────────────────────────┘
```

## Project Structure

```
src/app/
├── presentation/           # UI Layer (Angular Components)
│   ├── layouts/            # Layout components
│   ├── features/           # Feature modules
│   └── pages/              # Page components
│
├── application/            # Application Layer (Orchestration)
│   ├── store/              # NgRx Signals Stores
│   ├── commands/           # Command handlers
│   ├── queries/            # Query handlers
│   ├── services/           # Application services
│   └── mappers/            # Data mappers
│
├── domain/                 # Domain Layer (Business Logic)
│   ├── account/            # Account domain
│   ├── workspace/          # Workspace domain
│   ├── modules/            # Module domains
│   ├── events/             # Domain events
│   ├── commands/           # Domain commands
│   ├── queries/            # Domain queries
│   └── repositories/       # Repository interfaces
│
├── infrastructure/         # Infrastructure Layer (External Systems)
│   ├── firebase/           # Firebase integration
│   ├── persistence/        # Repository implementations
│   ├── storage/            # File storage
│   ├── auth/               # Authentication
│   └── event-sourcing/     # Event store
│
└── shared/                 # Shared Layer (Utilities)
    ├── components/         # Shared components
    ├── directives/         # Shared directives
    ├── pipes/              # Shared pipes
    ├── services/           # Shared services
    └── utils/              # Utility functions
```

## Naming Conventions

### Domain Layer

| Type | Pattern | Example |
|------|---------|---------|
| Entity | `{name}.entity.ts` | `workspace.entity.ts` |
| Value Object | `{name}.value-object.ts` | `workspace-id.value-object.ts` |
| Aggregate | `{name}.aggregate.ts` | `workspace.aggregate.ts` |
| Event | `{name}.event.ts` | `workspace-created.event.ts` |
| Command | `{action}-{entity}.command.ts` | `create-workspace.command.ts` |
| Query | `{action}-{entity}.query.ts` | `get-workspace.query.ts` |
| Enum | `{name}.enum.ts` | `workspace-type.enum.ts` |
| Interface | `{name}.interface.ts` | `workspace.repository.interface.ts` |

### Application Layer

| Type | Pattern | Example |
|------|---------|---------|
| Store | `{feature}.store.ts` | `workspace.store.ts` |
| Models | `{feature}.models.ts` | `workspace.models.ts` |
| Command Handler | `{action}-{entity}.handler.ts` | `create-workspace.handler.ts` |
| Query Handler | `{action}-{entity}.handler.ts` | `get-workspace.handler.ts` |
| Mapper | `{source}-to-{target}.mapper.ts` | `workspace-to-dto.mapper.ts` |
| Service | `{feature}.service.ts` | `workspace-guard.service.ts` |

### Infrastructure Layer

| Type | Pattern | Example |
|------|---------|---------|
| Repository | `{entity}-firestore.repository.ts` | `workspace-firestore.repository.ts` |
| Converter | `{entity}.firestore-converter.ts` | `workspace.firestore-converter.ts` |
| DTO | `{entity}-firebase.dto.ts` | `workspace-firebase.dto.ts` |
| Query Builder | `{entity}-query.builder.ts` | `workspace-query.builder.ts` |
| Service Impl | `{feature}-impl.service.ts` | `workspace-guard-impl.service.ts` |

### Presentation Layer

| Type | Pattern | Example |
|------|---------|---------|
| Component | `{name}.component.ts` | `workspace-list.component.ts` |
| Page | `{name}-page.component.ts` | `workspace-detail-page.component.ts` |
| Layout | `{name}-layout.component.ts` | `workspace-layout.component.ts` |

### Shared Layer

| Type | Pattern | Example |
|------|---------|---------|
| Component | `{name}.component.ts` | `avatar.component.ts` |
| Directive | `{name}.directive.ts` | `has-permission.directive.ts` |
| Pipe | `{name}.pipe.ts` | `date-ago.pipe.ts` |
| Service | `{feature}.service.ts` | `dialog.service.ts` |
| Util | `{category}.utils.ts` | `array.utils.ts` |

## Dependency Rules

### Golden Rules

1. **Dependencies point inward** - Outer layers depend on inner layers, never the reverse
2. **Domain is independent** - No dependencies on Angular, Firebase, or any framework
3. **Infrastructure implements domain** - Infrastructure provides concrete implementations of domain interfaces
4. **Application orchestrates** - Application layer coordinates domain and infrastructure

### Allowed Dependencies

```
Presentation → Application ✓
Presentation → Shared ✓

Application → Domain ✓
Application → Shared ✓

Domain → (nothing) ✓

Infrastructure → Domain ✓
Infrastructure → Shared ✓

Shared → (nothing) ✓
```

### Forbidden Dependencies

```
Domain → Application ✗
Domain → Infrastructure ✗
Domain → Presentation ✗

Infrastructure → Application ✗
Infrastructure → Presentation ✗

Application → Infrastructure (direct) ✗
  (Use dependency injection with domain interfaces instead)
```

## Layer Responsibilities

### Domain Layer

**Responsibility**: Define business rules, entities, and contracts

**Contains**:
- Entities (business objects with identity)
- Value Objects (immutable objects)
- Aggregates (consistency boundaries)
- Domain Events (business-significant occurrences)
- Repository Interfaces (persistence contracts)
- Domain Services (business logic that doesn't belong to entities)

**Must NOT contain**:
- Angular dependencies
- Firebase dependencies
- HTTP clients
- Any I/O operations
- Framework-specific code

### Application Layer

**Responsibility**: Orchestrate domain logic and coordinate with infrastructure

**Contains**:
- NgRx Signals Stores (state management)
- Command Handlers (write operations)
- Query Handlers (read operations)
- Application Services (orchestration)
- Data Mappers (domain ↔ DTO transformations)
- Effects (async operations via rxMethod)

**Must NOT contain**:
- Direct Firebase calls (use repositories)
- Business rules (belongs in domain)
- UI logic (belongs in presentation)

### Infrastructure Layer

**Responsibility**: Implement domain contracts and integrate with external systems

**Contains**:
- Repository Implementations (Firestore, etc.)
- Firebase Converters (domain ↔ Firestore)
- External Service Adapters
- Event Store Implementations
- Storage Services
- Authentication Services

**Must NOT contain**:
- Business rules (belongs in domain)
- UI components (belongs in presentation)
- Direct state management (use application layer)

### Presentation Layer

**Responsibility**: Display UI and capture user input

**Contains**:
- Angular Components
- Templates
- Layouts
- Pages
- Component-specific logic

**Must NOT contain**:
- Business rules (belongs in domain)
- Direct Firebase calls (use stores)
- Direct repository access (use stores)

### Shared Layer

**Responsibility**: Provide reusable utilities and components

**Contains**:
- UI Components (reusable)
- Directives
- Pipes
- Validators
- Utility Functions
- Shared Services

**Must NOT contain**:
- Business rules (belongs in domain)
- Layer-specific logic (belongs in respective layer)

## State Management with NgRx Signals

### Store Hierarchy

```
GlobalShell (Root Level)
├── Auth Store
├── Config Store
├── Layout Store
└── Router Store

WorkspaceList Store (Account Level)
└── Current Workspace ID

Workspace Store (Context Store)
├── Workspace Data
├── Permissions
└── Preferences

Feature Stores (Module Level)
├── Tasks Store
├── Documents Store
├── Members Store
└── ...

Entity Stores (Entity Level)
├── Task Entity Store
├── Document Entity Store
└── ...
```

### Store Naming Patterns

- **Global**: `{feature}.store.ts` (e.g., `auth.store.ts`)
- **Context**: `{context}.store.ts` (e.g., `workspace.store.ts`)
- **Feature**: `{feature}s.store.ts` (e.g., `tasks.store.ts`)
- **Entity**: `{entity}-entity.store.ts` (e.g., `task-entity.store.ts`)

## File Organization Patterns

### Component Organization

```
feature-name/
├── feature-name.component.ts
├── feature-name.component.html
├── feature-name.component.scss
├── feature-name.component.spec.ts
└── index.ts
```

### Store Organization

```
feature/
├── feature.store.ts
├── feature.models.ts
├── feature.selectors.ts (optional)
└── index.ts
```

### Domain Organization

```
entity-name/
├── entities/
│   ├── entity.entity.ts
│   └── index.ts
├── value-objects/
│   ├── value.value-object.ts
│   └── index.ts
├── enums/
│   ├── type.enum.ts
│   └── index.ts
├── aggregates/ (if applicable)
│   ├── aggregate.aggregate.ts
│   └── index.ts
└── index.ts
```

## Import Patterns

### Use Path Aliases

```typescript
// Good
import { Workspace } from '@domain/workspace';
import { WorkspaceStore } from '@application/store/workspace';
import { WorkspaceFirestoreRepository } from '@infrastructure/persistence/workspace';

// Bad
import { Workspace } from '../../../domain/workspace/entities/workspace.entity';
```

### Layer Import Rules

```typescript
// Presentation Layer
import { Component } from '@angular/core';
import { WorkspaceStore } from '@application/store/workspace'; // ✓
import { Workspace } from '@domain/workspace'; // ✓
import { AvatarComponent } from '@shared/components/ui/avatar'; // ✓
// Never import from @infrastructure directly ✗

// Application Layer
import { inject } from '@angular/core';
import { Workspace } from '@domain/workspace'; // ✓
import { IWorkspaceRepository } from '@domain/repositories'; // ✓
import { ArrayUtils } from '@shared/utils/array'; // ✓
// Never import from @infrastructure directly ✗

// Domain Layer
// Only import from same domain or shared
import { AccountId } from '@domain/account'; // ✓
// Never import from @application, @infrastructure, or @presentation ✗

// Infrastructure Layer
import { inject } from '@angular/core';
import { Workspace } from '@domain/workspace'; // ✓
import { IWorkspaceRepository } from '@domain/repositories'; // ✓
import { DateUtils } from '@shared/utils/date'; // ✓
```

## Testing Structure

```
{feature}/
├── {feature}.component.ts
├── {feature}.component.spec.ts
├── {feature}.store.ts
├── {feature}.store.spec.ts
└── ...
```

### Test Naming Convention

```typescript
describe('FeatureName', () => {
  describe('MethodName', () => {
    it('should do something when condition', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Code Quality Guidelines

### TypeScript

- Enable `strict` mode in `tsconfig.json`
- Use explicit types, avoid `any`
- Use `readonly` for immutable properties
- Use type guards and union types

### Angular

- Use standalone components
- Use Angular Signals for reactivity
- Implement `OnPush` change detection
- Follow Angular style guide

### NgRx Signals

- Use `signalStore` for all state management
- Use `patchState` for all mutations
- Use `computed()` for derived state
- Use `rxMethod` for async operations

### Firebase

- Use converters for data transformation
- Use query builders for complex queries
- Use transactions for atomic operations
- Use batch writes for bulk updates

## Documentation Requirements

### File-Level Documentation

Every file should have a comment block explaining:
- Purpose of the file
- Key responsibilities
- Dependencies
- Usage examples (for public APIs)

### Component Documentation

```typescript
/**
 * Workspace List Component
 * 
 * Displays a list of workspaces the user has access to.
 * Allows switching between workspaces and creating new ones.
 * 
 * @example
 * <app-workspace-list 
 *   [workspaces]="workspaces" 
 *   (workspaceSelected)="onSelect($event)"
 * />
 */
@Component({
  // ...
})
export class WorkspaceListComponent {
  // ...
}
```

### Service Documentation

```typescript
/**
 * Workspace Guard Service
 * 
 * Checks workspace access permissions for the current user.
 * Implements the IWorkspaceGuardService interface from the domain layer.
 */
@Injectable()
export class WorkspaceGuardService implements IWorkspaceGuardService {
  // ...
}
```

## References

- [Clean Architecture Overview](../../README.md#architecture-overview)
- [DDD Domain Models](../../docs/DDD/domain.md)
- [Application Layer Structure](../../docs/DDD/application.md)
- [Infrastructure Layer Structure](../../docs/DDD/infrastructure.md)
- [Shared Layer Structure](../../docs/DDD/shared.md)
- [Terminology Glossary](../../docs/DDD/GLOSSARY.md)

## Checklist for New Code

Before submitting code, verify:

- [ ] File is in the correct layer directory
- [ ] File naming follows the conventions
- [ ] Dependencies only point inward
- [ ] No framework code in domain layer
- [ ] No business logic in presentation layer
- [ ] No direct infrastructure access from application/presentation
- [ ] Proper use of dependency injection
- [ ] TypeScript strict mode compliance
- [ ] Tests are included
- [ ] Documentation is added
