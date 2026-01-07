# Packages Architecture

🏗️ **DDD (Domain-Driven Design) Architecture with Event Sourcing**

## Core Principle

> **核心永遠不知道 Angular 是什麼**
> **前端永遠不能碰 firebase-admin**

## Architecture Overview

```
packages/
├── core-engine/          💎 Pure TypeScript core (ZERO framework deps)
├── saas-domain/          🏢 SaaS business models (Pure TS)
├── platform-adapters/    🔧 SDK implementations (ONLY place for SDKs)
└── ui-angular/          💅 Angular UI (via src/app, uses adapters)
```

## Dependency Flow

```
┌─────────────────────────────────────────────────────┐
│                   ui-angular (src/app)              │
│                                                     │
│  Uses: @platform-adapters (angular-fire only)      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              platform-adapters/                     │
│                                                     │
│  ├── firebase/admin (firebase-admin only) 🛠️       │
│  └── firebase/angular-fire (@angular/fire) 🌐      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              saas-domain/                           │
│                                                     │
│  Depends on: @core-engine                          │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              core-engine/                           │
│                                                     │
│  Depends on: NOTHING (pure TypeScript)             │
└─────────────────────────────────────────────────────┘
```

## Package Details

### 1. 💎 core-engine

**Purpose:** Pure domain core with event sourcing infrastructure

**Contains:**
- Event Store abstractions (interface only)
- Causality tracking (correlation/causation IDs)
- Aggregate Root base class
- Projection (Read Model) definitions

**Rules:**
- ❌ NO Angular imports
- ❌ NO Firebase imports
- ❌ NO framework dependencies
- ✅ Pure TypeScript only

**Example:**
```typescript
import { EventStore, DomainEvent, AggregateRoot } from '@core-engine';
```

### 2. 🏢 saas-domain

**Purpose:** SaaS business domain models

**Contains:**
- Task domain (task management)
- Payment domain (payment processing)
- Issue domain (issue tracking)

**Rules:**
- ✅ Can depend on `@core-engine`
- ❌ NO Angular imports
- ❌ NO Firebase imports
- ✅ Pure TypeScript only

**Example:**
```typescript
import { Task, Payment, Issue } from '@saas-domain';
```

### 3. 🔧 platform-adapters

**Purpose:** Technical implementations - ONLY place that can touch SDKs

**Contains:**
- `firebase/admin/` - Backend adapters (firebase-admin)
- `firebase/angular-fire/` - Frontend adapters (@angular/fire)
- `auth/` - Authentication adapters (both admin and client)
- `notification/` - Notification services
- `analytics/` - Analytics integration
- `ai/` - AI services

**Rules - Firebase Admin:**
- ✅ Can use `firebase-admin`
- ❌ CANNOT use `@angular/fire`
- 🛠️ Runs in Node.js (Cloud Run/Functions)

**Rules - Firebase Angular-Fire:**
- ✅ Can use `@angular/fire`
- ❌ CANNOT use `firebase-admin`
- 🌐 Runs in browser/Angular

**Example:**
```typescript
// Backend
import { FirebaseAdminEventStore } from '@platform-adapters/firebase/admin';

// Frontend
import { FirebaseAuthAdapter, TaskQueryAdapter } from '@platform-adapters/firebase/angular-fire';
```

### 4. 💅 ui-angular (src/app)

**Purpose:** Angular user interface

**Location:** `src/app` (not in packages/)

**Contains:**
- `adapters/` - Facades for accessing core functionality
- `features/` - Feature modules (task, payment, issue)
- `core/` - Angular infrastructure (i18n, startup, etc.)
- `routes/` - Page routes
- `shared/` - Shared UI components

**Rules:**
- ✅ Can use `@platform-adapters` (angular-fire adapters only)
- ✅ Can use `@angular/fire`
- ❌ CANNOT use `firebase-admin`
- ❌ Should NOT import `@core-engine` or `@saas-domain` directly

**Access Pattern:**
```typescript
// ✅ GOOD: Use facade
import { CoreEngineFacade } from '@app/adapters';

class MyComponent {
  facade = inject(CoreEngineFacade);
  
  async loadTasks() {
    return this.facade.getTasksByBlueprint('workspace-123');
  }
}

// ❌ BAD: Direct import from core
import { EventStore } from '@core-engine';
```

## SDK Separation Table

| Location | Can Use | Cannot Use | Runs In |
|----------|---------|------------|---------|
| core-engine | TypeScript | ❌ Any SDK | Anywhere |
| saas-domain | TypeScript, @core-engine | ❌ Any SDK | Anywhere |
| platform-adapters/firebase/admin | firebase-admin | ❌ @angular/fire | Node.js |
| platform-adapters/firebase/angular-fire | @angular/fire | ❌ firebase-admin | Browser |
| ui-angular (src/app) | @angular/fire, @platform-adapters | ❌ firebase-admin | Browser |

## Quick Reference

### Who Uses Who?

```
core-engine → Used by everyone, depends on nobody
    ↑
saas-domain → Depends on core-engine
    ↑
platform-adapters → Depends on core-engine, saas-domain
    ↑
ui-angular → Depends on platform-adapters (angular-fire only)
```

### One-Sentence Rules

> **@angular/fire is for what USERS see (browser, client)**
> **firebase-admin is for what the SYSTEM does (server, backend)**
> **Core never knows about frameworks**

## TypeScript Path Mappings

```json
{
  "paths": {
    "@core-engine": ["packages/core-engine/index"],
    "@core-engine/*": ["packages/core-engine/*"],
    "@saas-domain": ["packages/saas-domain/index"],
    "@saas-domain/*": ["packages/saas-domain/*"],
    "@platform-adapters": ["packages/platform-adapters/index"],
    "@platform-adapters/*": ["packages/platform-adapters/*"]
  }
}
```

## ESLint Protection

The project includes ESLint rules to prevent SDK mixing:

- ❌ `core-engine/` cannot import Angular or Firebase
- ❌ `saas-domain/` cannot import Angular or Firebase
- ❌ `platform-adapters/firebase/admin/` cannot import `@angular/fire`
- ❌ `platform-adapters/firebase/angular-fire/` cannot import `firebase-admin`
- ❌ `src/app/` cannot import `firebase-admin`

## License

MIT

## Readiness alignment

- `@account-domain` path aliases are now available in the root `tsconfig.json` so Angular and tooling can import identity/workspace aggregates without local path hacks.
- Scaffolded `account-domain` module folders (`account/`, `workspace/`, `membership/`, `module-registry/`) to match the Mermaid plan; each exports placeholders ready for aggregates/events once implemented.
- Reserved `platform-adapters/@google/genai` for future Google GenAI adapters, keeping SDK usage isolated per the separation rules.
