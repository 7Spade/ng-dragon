# ng-dragon 🐉

> **Event-Sourced Multi-Tenant SaaS Platform with DDD Architecture**

A modern monorepo implementing Domain-Driven Design (DDD), CQRS, and Event Sourcing patterns for building scalable SaaS applications with Angular frontend and Firebase backend.

## 🎯 Project Vision

ng-dragon is a production-ready foundation for building multi-tenant SaaS platforms with:
- **Event Sourcing** for complete audit trails and temporal queries
- **CQRS** for optimized read/write separation
- **Multi-tenancy** with organization/workspace isolation
- **Modular Architecture** with pluggable domain modules
- **Type-Safe** end-to-end TypeScript implementation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   ui-angular                        │
│            (Angular Frontend Layer)                 │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              platform-adapters                      │
│     (Firebase, AI, External APIs - SDK Layer)       │
└─────────────┬───────────────┬───────────────────────┘
              │               │
┌─────────────▼───────────┐   │
│      core-engine        │   │
│  (CQRS/ES Infrastructure)◄──┘
└─────────────┬───────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───▼──────────┐  ┌──────▼──────────┐
│account-domain│  │  saas-domain    │
│ (Identity)   │  │(Business Logic) │
└──────────────┘  └─────────────────┘
```

### Dependency Flow (Single Direction)

```
account-domain ──┐
                 ├──> saas-domain ──> ui-angular
                 │         ▲
                 └──> core-engine <── platform-adapters
```

## 📦 Package Structure

This monorepo contains five core packages under `/packages`:

| Package | Responsibility | SDK Allowed |
|---------|---------------|-------------|
| **account-domain** | Identity, Account, Organization, User entities | ❌ None (Pure TS) |
| **saas-domain** | Business modules (Tasks, Issues, Finance, etc.) | ❌ None (Pure TS) |
| **core-engine** | CQRS/Event Sourcing infrastructure | ❌ None (Pure TS) |
| **platform-adapters** | External integrations (Firebase, AI, APIs) | ✅ **Only Here** |
| **ui-angular** | Angular frontend application | ✅ @angular/fire |

### Package Boundaries

```
packages/
├── account-domain/       # 🧠 Identity & Account Core Domain
│   └── src/{aggregates,value-objects,events,policies,domain-services}
├── saas-domain/          # 🏢 SaaS Business Domain
│   └── src/{aggregates,value-objects,events,domain-services,repositories}
├── core-engine/          # ⚡ Event Flow & CQRS Engine
│   └── src/{commands,queries,use-cases,ports,mappers,dtos}
├── platform-adapters/    # 🔌 Infrastructure Implementation
│   └── src/{firebase-platform,auth,ai,messaging,persistence}
└── ui-angular/           # 🎨 User Interface (located at /src/app)
    └── {adapters,features,core,routes,shared,layout}
```

See [packages/AGENTS.md](packages/AGENTS.md) for detailed architectural boundaries.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project (for backend services)
- Angular CLI

### Installation

```bash
# Install dependencies
npm install

# Setup Firebase
firebase login
firebase use <your-project-id>

# Start development server
npm start
```

### Development

```bash
# Run tests
npm test

# Build all packages
npm run build

# Lint code
npm run lint
```

## 🎓 Key Concepts

### Event Sourcing & CQRS

All state changes are captured as immutable events:

```
User Action → Command → Aggregate → Domain Event → Event Store
                                         ↓
                                   Projections (Read Models)
```

### Multi-Tenancy Model

```
Account → Organization → Workspace → Module → Entity
```

- **Account**: Root identity for authentication
- **Organization**: Billing and ownership boundary
- **Workspace**: Isolated environment where modules run
- **Module**: Pluggable business capabilities (Tasks, Issues, etc.)
- **Entity**: Domain-specific data (Task, Issue, Payment, etc.)

### Dependency Direction Rule

**Critical**: Dependencies only flow in ONE direction:

```
✅ ALLOWED: ui-angular → platform-adapters → core-engine → domain
❌ FORBIDDEN: domain → core-engine → platform-adapters
```

## 📚 Documentation

- [Packages Architecture](packages/README.md) - Technical package details
- [Package Boundaries](packages/AGENTS.md) - Detailed boundary rules for AI agents
- [Account Domain](packages/account-domain/README.md) - Identity domain documentation
- [SaaS Domain](packages/saas-domain/README.md) - Business domain documentation
- [Core Engine](packages/core-engine/README.md) - CQRS/ES infrastructure
- [Platform Adapters](packages/platform-adapters/README.md) - Integration layer
- [UI Angular](packages/ui-angular/README.md) - Frontend documentation

### For Copilot/AI Agents

See [AGENTS.md](AGENTS.md) for comprehensive architectural boundaries, anti-patterns, and code generation guidelines.

## 🔐 Security & SDK Rules

### The Golden Rule: SDK Isolation

**Only `platform-adapters` may import external SDKs.**

| Layer | Allowed Imports | Forbidden |
|-------|----------------|-----------|
| domain (account/saas) | TypeScript stdlib only | All SDKs |
| core-engine | TypeScript stdlib, domain | All SDKs, frameworks |
| platform-adapters | All SDKs (Firebase, Google AI, etc.) | N/A |
| ui-angular | @angular/*, @angular/fire, platform-adapters facades | firebase-admin, core-engine |

### Anti-Patterns (DO NOT)

❌ Import `firebase-admin` in domain packages  
❌ Import `@angular/*` in core-engine  
❌ Call Firestore directly from UI components  
❌ Use `new Date()` or `uuid()` in domain (inject via factories)  
❌ Mix business logic in platform-adapters  

See [AGENTS.md](AGENTS.md) for complete anti-pattern list with examples.

## 🧪 Testing Strategy

- **Unit Tests**: Domain logic, value objects, aggregates
- **Integration Tests**: Port implementations, adapters
- **E2E Tests**: Full user workflows through UI

```bash
# Run all tests
npm test

# Run specific package tests
npm test -- account-domain
```

## 🛠️ Tech Stack

- **Frontend**: Angular 19+, Angular Material, RxJS, Signals
- **Backend**: Firebase (Firestore, Auth, Functions, Storage)
- **Language**: TypeScript (strict mode)
- **Build**: Nx Monorepo, Vite
- **Testing**: Jest, Cypress
- **AI Integration**: Google Gemini API, Vertex AI

## 📖 Design Principles

1. **Domain-First**: Business logic lives in pure domain packages
2. **Single Responsibility**: Each package has one clear purpose
3. **Dependency Inversion**: Domain defines interfaces, adapters implement
4. **Event-Driven**: All state changes emit domain events
5. **Immutability**: Value objects and events are immutable
6. **Type Safety**: Leverage TypeScript's type system fully

## 🤝 Contributing

1. Read [AGENTS.md](AGENTS.md) for architectural boundaries
2. Follow the package structure conventions
3. Maintain SDK isolation rules
4. Write tests for new functionality
5. Update relevant documentation

## 📝 License

MIT

---

## 🔗 Quick Links

- [Monorepo Structure](packages/README.md)
- [Package Boundaries (for AI)](packages/AGENTS.md)
- [Architecture Diagrams](docs/)
- [Event Sourcing Guide](docs/)
- [Module Development Guide](packages/saas-domain/README.md)

---

**Built with ❤️ using DDD, CQRS, and Event Sourcing**
