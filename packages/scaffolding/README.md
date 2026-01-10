# @ng-events/scaffolding

## Overview

Scaffolding utilities to bootstrap and initialize the workspace-domain package. Provides helpers for setting up workspace infrastructure and initial workspace creation.

## Features

- **Workspace Bootstrap**: Initialize workspace domain with default configuration
- **Workspace Factory Helpers**: Utilities for creating workspace instances
- **Migration Helpers**: Tools for migrating existing workspace data

## Usage

```typescript
import { bootstrapWorkspace, createWorkspaceFactory } from '@ng-events/scaffolding';

// Bootstrap workspace domain
const workspace = bootstrapWorkspace({
  workspaceType: 'organization',
  name: 'My Organization'
});
```

## Dependencies

- `@ng-events/workspace-domain`: Core workspace domain logic

## Development

```bash
# Build the package
npm run build

# Lint
npm run lint
```

## Purpose

This package provides minimal setup utilities for initializing the workspace-domain package. It serves as a bridge between raw workspace data and the domain model.
