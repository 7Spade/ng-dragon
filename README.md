---
language: en
type: explanation
audience: developers
status: current
---

# NgRx Dragon Start

> **For AI Code Generation**: See [AGENTS.md](./AGENTS.md) for explicit coding rules and constraints.

## Zone-less Angular Application (Clean Architecture)

A modern **Angular 20** application built with **zone-less change detection**, **@ngrx/signals**, and a **Clean Architecture–aligned structure** designed for long-term scalability, strict boundaries, and AI-assisted development (Copilot-friendly).

---

## ✨ Core Philosophy

This project is built around a **business-first architecture**, not a framework-first one.

```
domain         → Defines the World
application    → Orchestrates the World
infrastructure → Connects to the World
presentation   → Views the World
```

Each layer has **clear responsibility**, **strict dependency rules**, and **explicit intent**.

---

## 🚀 Key Features

* ✅ **Zone-less Angular** (no Zone.js, smaller bundle, explicit updates)
* ✅ **Angular 20** (stable APIs, esbuild)
* ✅ **@ngrx/signals** (state as first-class signals)
* ✅ **Clean Architecture** (ui / application / domain / infrastructure)
* ✅ **Firebase Integration** via adapters
* ✅ **Copilot-friendly structure** (low ambiguity, low hallucination)
* ✅ **Production-ready mental model**

---

## 🧱 Architecture Overview

### Layer Responsibilities

```
src/app/
├─ presentation/     # UI components, pages, layouts (Material/CDK)
├─ application/      # Use cases, orchestration, signal stores
├─ domain/           # Pure business rules (no Angular, no Firebase)
├─ infrastructure/   # External systems (Firebase, API, storage)
└─ shared/           # Cross-cutting shared resources
```

### Dependency Direction (Golden Rule)

```
presentation → application → domain
presentation → application → infrastructure

❌ domain → application
❌ domain → infrastructure
❌ presentation → infrastructure (direct)
```

Dependencies **must always point inward**.

---

## 🧠 Layer Semantics (for Humans & Copilot)

### 🧬 domain — Defines the World (What the system *is*)

* Entities, Value Objects, Domain Events
* Business rules and invariants
* No Angular, no Signals, no Firebase, no I/O

> If this code describes **truth**, it belongs here.

---

### ⚙️ application — Orchestrates the World (What the system *does*)

* Use cases and orchestration
* Signal Stores (`@ngrx/signals`)
* Facades exposed to UI
* Guards, policies, workflows

> If this code decides **how things happen**, it lives here.

---

### 🔌 infrastructure — Connects to the World (How the system talks to the outside)

* Firebase adapters
* API clients
* Persistence implementations
* Environment bindings

> All external systems are isolated here.

---

### 👀 presentation — Views the World (How the system is presented)

* Pages, components, layouts
* Routing
* ViewModels / Presenters
* Zero business rules

> UI renders state and emits intent — nothing more.

---

## 📚 Documentation

### Architecture & Standards

* **[Project Structure & Naming Conventions](./.github/instructions/project-structure.instructions.md)** - Comprehensive guide to project organization, naming patterns, and dependency rules
* **[Terminology Glossary](./docs/DDD/GLOSSARY.md)** - Standard terminology reference to avoid synonym confusion

### Layer Documentation

* **[Domain Layer](./docs/DDD/domain.md)** - Domain entities, value objects, and business rules
* **[Application Layer](./docs/DDD/application.md)** - State management, commands, queries, and orchestration
* **[Infrastructure Layer](./docs/DDD/infrastructure.md)** - Firebase integration, repositories, and external services
* **[Shared Layer](./docs/DDD/shared.md)** - Reusable components, directives, pipes, and utilities

### UI Specifications

* **[Workspace Layout](./docs/ui/workspace-layout-spec/README.md)** - Workspace layout components and state management
* **[Identity Switcher](./docs/ui/switcher-ui-spec/00-開發步驟總覽.md)** - Identity and workspace switcher components

---

## 🗂️ Project Structure

```
src/
├─ app/
│  ├─ presentation/
│  │  ├─ layouts/
│  │  └─ features/
│  │
│  ├─ application/
│  │  └─ store/
│  │
│  ├─ domain/
│  │  └─ ... (models)
│  │
│  ├─ infrastructure/
│  │  └─ ... (services)
│  │
│  ├─ shared/
│  │  └─ ... (components/services/utils)
│  │
│  ├─ app.config.ts      # zone-less configuration
│  ├─ app.routes.ts
│  └─ app.component.ts
│
├─ environments/
├─ main.ts
└─ ...
```

---

## ⚡ Zone-less Change Detection

The app uses Angular’s **stable zone-less mode**.

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
  ],
};
```

### Why zone-less?

* Smaller bundle (~40 KB saved)
* Explicit state-driven updates
* Perfect fit for signal-based architecture
* Predictable performance

---

## 📦 Tech Stack

* **Framework**: Angular 20
* **State**: @ngrx/signals
* **Backend**: Firebase via @angular/fire
* **Language**: TypeScript 5.8+
* **Build**: Angular CLI + esbuild

---

## 🔄 State Flow (Signals)

```
User Intent
  → UI Event
    → Application Facade
      → Signal Store Method
        → patchState()
          → Signal Update
            → UI Re-render
```

No Zone.js.
No implicit magic.
Only explicit state changes.

---

## 🚦 Getting Started

### Prerequisites

* Node.js 18+
* npm or pnpm
* Firebase project (optional but recommended)

### Install

```bash
npm install --legacy-peer-deps
# or
pnpm install
```

### Run

```bash
npm run start
```

Open `http://localhost:4200`

### Test credentials

Use a real Firebase Auth account created in your project to sign in.

---

## 🔐 Firebase Configuration

Set credentials in:

```
src/environments/environment.ts
```

Infrastructure code **must not leak** into application or domain layers.

---

## 🧭 Architectural Guardrails

When adding new code:

* Business meaning → `domain`
* State / orchestration → `application`
* External systems → `infrastructure`
* Rendering / interaction → `presentation`

If unsure → **do not put it in Presentation**.

---

## 🤖 Copilot Guidance

This structure is intentionally designed to:

* Reduce ambiguous file placement
* Prevent cross-layer imports
* Encourage correct abstractions
* Make AI-assisted coding predictable and safe

---

## 📄 License

MIT License

---

**Built with ❤️, discipline, and zero Zone.js**

---
