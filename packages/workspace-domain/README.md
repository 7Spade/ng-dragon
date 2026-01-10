# @ng-events/workspace-domain

## Overview

Pure TypeScript domain package for workspace management, workspace switching, and logic container abstractions. This package is safe for both frontend and backend use and contains no framework-specific dependencies.

## Features

### Core Features
- **Workspace Aggregate**: Core workspace domain logic and state management
- **Workspace Switcher**: Abstract service for switching between workspaces
- **Logic Container**: Business logic encapsulation for workspace operations
- **Repository Interfaces**: Port definitions for workspace persistence

### Workspace Modules
Seven fully-typed domain modules for comprehensive workspace management:

1. **Overview Module**: Workspace statistics, recent activities, and dashboard data
2. **Documents Module**: Document creation, management, and versioning
3. **Tasks Module**: Task tracking, assignment, and status management
4. **Members Module**: Member management, roles, and invitations
5. **Permissions Module**: Fine-grained permission control and access management
6. **Audit Module**: Activity logging and audit trail functionality
7. **Settings Module**: Workspace configuration and preferences

## Architecture

This package follows Domain-Driven Design (DDD) principles:

- **Aggregates**: `WorkspaceAggregate` - manages workspace state and business rules
- **Value Objects**: `WorkspaceType`, `MemberRole`, `ModuleStatus`, workspace identifiers
- **Repositories**: Interface definitions for workspace persistence
- **Services**: Domain services for workspace switching and logic container management
- **Modules**: Seven domain modules providing comprehensive workspace functionality

## Usage

All features must be accessed through the main entry point:

```typescript
// Core workspace features
import { 
  WorkspaceAggregate,
  WorkspaceSwitcher,
  WorkspaceLogicContainer,
  WorkspaceRepository
} from '@ng-events/workspace-domain';

// Workspace modules
import {
  // Overview
  OverviewService,
  OverviewData,
  
  // Documents
  DocumentsService,
  Document,
  DocumentInput,
  
  // Tasks
  TasksService,
  Task,
  TaskInput,
  
  // Members
  MembersService,
  Member,
  MemberInput,
  
  // Permissions
  PermissionsService,
  Permission,
  PermissionType,
  
  // Audit
  AuditService,
  AuditLog,
  AuditAction,
  
  // Settings
  SettingsService,
  SettingsData,
} from '@ng-events/workspace-domain';
```

**Direct imports from internal files are not allowed.**

### Quick Examples

```typescript
// Get workspace overview
const overviewService = new OverviewService();
const overview = overviewService.getOverview('workspace_123');

// Create a document
const documentsService = new DocumentsService();
const doc = documentsService.createDocument('workspace_123', 'user_456', {
  title: 'Product Roadmap',
  status: 'draft',
});

// Create a task
const tasksService = new TasksService();
const task = tasksService.createTask('workspace_123', 'user_456', {
  title: 'Implement authentication',
  priority: 'high',
});

// Manage members
const membersService = new MembersService();
const member = membersService.addMember('workspace_123', 'user_456', {
  accountId: 'user_789',
  role: 'member',
});

// Set permissions
const permissionsService = new PermissionsService();
permissionsService.setPermission('workspace_123', 'user_456', 'user_789', 'documents.write');

// Log audit events
const auditService = new AuditService();
auditService.logAction('workspace_123', {
  actionType: 'document.created',
  actorId: 'user_456',
  resourceType: 'document',
  resourceId: 'doc_123',
  severity: 'info',
});

// Manage settings
const settingsService = new SettingsService();
settingsService.updateSetting('workspace_123', 'user_456', 'theme', 'dark');
```

For comprehensive examples, see [USAGE_EXAMPLES.ts](./USAGE_EXAMPLES.ts).

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
