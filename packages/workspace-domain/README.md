# @ng-events/workspace-domain

## Overview

Pure TypeScript domain package for workspace management, workspace switching, and logic container abstractions. This package is safe for both frontend and backend use and contains no framework-specific dependencies.

## Features

- **Workspace Aggregate**: Core workspace domain logic and state management
- **Workspace Switcher**: Abstract service for switching between workspaces
- **Logic Container**: Business logic encapsulation for workspace operations
- **Repository Interfaces**: Port definitions for workspace persistence

## Architecture

This package follows Domain-Driven Design (DDD) principles:

- **Aggregates**: `WorkspaceAggregate` - manages workspace state and business rules
- **Value Objects**: `WorkspaceType`, workspace identifiers
- **Repositories**: Interface definitions for workspace persistence
- **Services**: Domain services for workspace switching and logic container management

## Usage

All features must be accessed through the main entry point:

```typescript
import { 
  WorkspaceAggregate,
  WorkspaceSwitcher,
  WorkspaceLogicContainer,
  WorkspaceRepository
} from '@ng-events/workspace-domain';
```

**Direct imports from internal files are not allowed.**

## Dependencies

- Pure TypeScript (no framework dependencies)
- No firebase-admin or other SDKs
- Safe for frontend and backend

## Development

```bash
# Build the package
npm run build

# Lint
npm run lint
```

## Design Principles

1. **Pure Domain Logic**: No infrastructure concerns
2. **Framework Agnostic**: Works in any TypeScript environment
3. **Explicit Exports**: All public APIs exported through index.ts
4. **Type Safety**: Full TypeScript strict mode compliance
