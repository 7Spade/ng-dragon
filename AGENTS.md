---
language: en
type: reference
audience: ai-agents
status: current
---

# NgRx Dragon - AI Agent Context

> **For Conceptual Understanding**: See [README.md](./README.md) for project overview and architecture explanation.

## Project Identity

**Name**: NgRx Dragon  
**Type**: Zone-less Angular 20 Application  
**Architecture**: Domain-Driven Design (DDD) + Clean Architecture  
**State Management**: @ngrx/signals (Pure Reactive)  
**Backend**: Firebase (@angular/fire)  
**Language**: TypeScript 5.8+  

---

## 🎯 Primary Purpose

Multi-workspace team collaboration system with strict architectural boundaries designed for:
- Long-term maintainability
- AI-assisted development (Copilot-optimized)
- Zero framework dependency leakage
- Explicit state management

---

## 🏗️ Architecture Philosophy

```
domain        → Defines the World (What the system IS)
application   → Orchestrates the World (What the system DOES)
infrastructure→ Connects to the World (How the system CONNECTS)
ui            → Views the World (How the system is PRESENTED)
shared        → Toolbox (Generic utilities)
```

**Golden Rule**: Dependencies flow INWARD ONLY
```
domain ← application ← infrastructure
  ↑                      ↑
  └────── ui ────────────┘
```

---

## 🚫 Strict Prohibitions (MUST NEVER)

### Framework Prohibitions
- ❌ `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity` (use @ngrx/signals)
- ❌ Zone.js dependencies (app is zone-less)
- ❌ Traditional NgRx patterns (actions/reducers/effects)

### Architectural Violations
- ❌ Domain layer importing Angular/RxJS/Firebase
- ❌ UI components directly injecting Firebase services
- ❌ Direct Store-to-Store dependencies (use EventBus)
- ❌ Manual `.subscribe()` calls (use rxMethod + tapResponse)
- ❌ Template syntax: `*ngIf`, `*ngFor`, `*ngSwitch` (use @if/@for/@switch)

---

## ✅ Required Patterns (MUST ALWAYS)

### State Management
- ✅ Use `signalStore()` from @ngrx/signals
- ✅ Use `rxMethod()` for async operations
- ✅ Use `withComputed()` for derived state
- ✅ Use `withMethods()` for store actions
- ✅ All state changes via `patchState()`

### Communication
- ✅ EventBus for cross-store communication
- ✅ Facades for UI-to-Application interface
- ✅ Repository pattern for Infrastructure layer

### Templates
- ✅ Control flow: `@if`, `@for`, `@switch`
- ✅ Signal-based binding: `{{ signal() }}`
- ✅ Effect-based side effects

---

## 📁 File Placement Decision Tree

**Ask yourself:**

1. **Is this pure business logic with no framework dependencies?**
   → `domain/` (entities, value objects, policies, types)

2. **Does this manage state or orchestrate use cases?**
   → `application/` (stores, facades, guards)

3. **Does this connect to external systems?**
   → `infrastructure/` (repositories, adapters, Firebase)

4. **Does this render UI or handle user interaction?**
   → `ui/` (components, pages, layouts)

5. **Is this a reusable utility with no business context?**
   → `shared/` (pipes, directives, generic services)

**When in doubt**: If it has business meaning → NOT in `shared/` or `ui/`

---

## 🔄 Development Workflow (MANDATORY)

```
Step 1: Context7 → Query official documentation
Step 2: Sequential Thinking → List errors & requirements
Step 3: Software Planning MCP → Break down into atomic tasks
Step 4: Domain Design → Models, Policies, Types
Step 5: Infrastructure → Repositories (Observable, no subscribe)
Step 6: Application → Stores (signalStore + rxMethod)
Step 7: UI → Components (effect + @if/@for/@switch)
Step 8: Architecture Validation → Check for anti-patterns
Step 9: Testing → Store/Component tests
Step 10: Completion Checklist
```

---

## 🧪 Testing Requirements

- Unit tests for domain logic (pure functions)
- Store tests for application layer (signal updates)
- Component tests for UI layer (signal bindings)
- Integration tests for infrastructure (repository operations)

---

## 📦 Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | Angular 20 (zone-less) |
| **State** | @ngrx/signals, @ngrx/operators |
| **Backend** | Firebase (Auth, Firestore, Storage) via @angular/fire |
| **Build** | Angular CLI + esbuild |
| **Language** | TypeScript 5.8+ (strict mode) |

---

## 🎨 Code Style Expectations

- **Naming**: PascalCase for classes, camelCase for functions/variables
- **Files**: kebab-case (e.g., `user-profile.store.ts`)
- **Imports**: Absolute paths from `@app/*` aliases
- **Formatting**: Prettier + ESLint
- **Comments**: JSDoc for public APIs

---

## 🔐 Security & Best Practices

- Never hardcode credentials (use environment files)
- Sanitize user inputs (use Angular's built-in sanitization)
- Firebase rules enforce server-side security
- Use least-privilege access for Firebase operations

---

## 📚 Reference Documentation

- **Architecture Details**: `/src/app/README.md`
- **Domain Rules**: `/src/app/domain/README.md`
- **Application Patterns**: `/src/app/application/README.md`
- **Infrastructure Patterns**: `/src/app/infrastructure/README.md`
- **UI Guidelines**: `/src/app/ui/README.md`
- **PRD**: `/docs/prd.md`
- **Specifications**: `/docs/*.md`

---

## 🤖 Copilot Guidance Summary

**When generating code:**
1. Identify the correct layer first
2. Check dependency direction
3. Use prohibited/required patterns lists
4. Follow file naming conventions
5. Validate against architecture rules

**When unsure:**
- Business meaning → `domain/`
- State/orchestration → `application/`
- External systems → `infrastructure/`
- UI/interaction → `ui/`
- Generic helpers → `shared/`

---

**Built with discipline, clarity, and zero Zone.js** 🐉
