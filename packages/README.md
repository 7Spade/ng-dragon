# Packages Architecture

> **DDD + Event Sourcing 分層架構** — 所有業務與技術元件都從 `packages/` 內部的 `src/` 作為單一入口

## 📋 Overview

This monorepo contains five core packages implementing a clean architecture with strict boundary enforcement:

```
packages/
├── account-domain/       # 🧠 Identity & Account Core Domain (Pure TS)
├── saas-domain/          # 🏢 SaaS Business Domain (Pure TS)
├── core-engine/          # ⚡ CQRS/ES Infrastructure (Pure TS)
├── platform-adapters/    # 🔌 Infrastructure Implementation (SDK Layer)
└── ui-angular/           # 🎨 User Interface (Angular)
```

## 🏗️ Package Structure (現況 + 後續規劃)

```
packages/
├── account-domain/          # 帳號 / 工作區 / 模組啟用（純 TS）
│   └── src/
│       ├── aggregates/        # Account, Organization, User, Workspace
│       ├── value-objects/     # Roles, ModuleType, WorkspaceType
│       ├── events/            # DomainEvent 介面與 metadata 工具
│       ├── policies/          # 跨聚合守則（如模組啟用檢查）
│       ├── domain-services/   # 無狀態的領域服務
│       ├── repositories/      # 介面定義（實作在 platform-adapters）
│       ├── entities/          # Entity 基礎型別
│       └── types/             # 共用識別符
│
├── core-engine/             # CQRS + Event Sourcing 基礎設施（純 TS）
│   └── src/
│       ├── commands/          # Command 定義與處理介面
│       ├── queries/           # Query 定義
│       ├── use-cases/         # 應用服務 / handler（純 TS）
│       ├── ports/             # EventStore, Projection, Bus 等抽象介面
│       ├── mappers/           # DTO ↔ Domain 轉換
│       ├── dtos/              # 輸入/輸出 DTO
│       ├── jobs/              # 背景工作定義
│       └── schedulers/        # 排程介面
│
├── platform-adapters/       # 外部 SDK 介接（唯一可碰 SDK）
│   └── src/
│       ├── firebase-platform/  # firebase-admin 基礎層
│       │   ├── app/           # Firebase app initialization
│       │   ├── auth/          # Authentication
│       │   ├── app-check/     # App Check
│       │   ├── firestore/     # Firestore admin
│       │   ├── storage/       # Cloud Storage
│       │   ├── observability/ # Logging, monitoring
│       │   ├── remote-config/ # Remote Config
│       │   ├── messaging/     # Cloud Messaging
│       │   └── pubsub/        # Pub/Sub
│       ├── auth/              # admin/client 身分橋接
│       ├── messaging/         # 推播/事件 publish
│       ├── ai/                # AI/LLM 抽象或共用 helper
│       ├── external-apis/
│       │   └── google/
│       │       └── genai/     # Google GenAI / Vertex AI 介接
│       └── persistence/       # EventStore / Projection / DB adapter 實作
│
├── saas-domain/             # SaaS 模組（任務/議題/財務/品質/驗收）（純 TS）
│   └── src/
│       ├── aggregates/        # Task, Issue, Finance, Quality, Acceptance
│       ├── value-objects/     # 模組專屬 VO
│       ├── events/            # 模組事件
│       ├── domain-services/   # 跨聚合的無狀態邏輯
│       ├── repositories/      # 介面定義
│       ├── entities/          # 共享 Entity 型別
│       └── policies/          # 模組依賴 / 啟用檢查
│
└── ui-angular/              # Angular 前端（位於根目錄 src/app）
    └── (位於專案根目錄 src/app)
        ├── adapters/          # Facade，封裝 platform-adapters 呼叫
        ├── features/          # domain 對齊的功能 (task/issue/finance 等)
        ├── core/              # i18n、startup、net、guards 等基礎設施
        ├── routes/            # 路由設定
        ├── shared/            # 共用 UI 元件
        └── layout/            # 版面
```

> **重要原則**：未來的子模組請直接放在各自 package 的 `src/` 下，保持單一路徑，避免再出現平行根目錄。

## 🔗 Dependency Flow

```
account-domain ──┐
                 ├──> saas-domain ──> ui-angular
                 │         ▲
                 └──> core-engine <── platform-adapters
```

### Dependency Matrix

| Package | Depends On | Used By |
|---------|-----------|---------|
| **account-domain** | TypeScript stdlib | saas-domain, core-engine |
| **saas-domain** | account-domain | ui-angular (via adapters) |
| **core-engine** | account-domain, saas-domain | platform-adapters |
| **platform-adapters** | core-engine, domain packages, SDKs | ui-angular |
| **ui-angular** | platform-adapters, @angular/fire | End users |

### Key Points

- **account-domain**: 身份 / 工作區 / 模組啟用前置邏輯，純 TS，零依賴
- **saas-domain**: SaaS 業務模組，僅依賴 account-domain
- **core-engine**: 事件、命令、聚合、投影基礎設施，純 TS、零 SDK
- **platform-adapters**: 外部 SDK 介接（Firebase、訊息、持久化、Google GenAI 等），**唯一 SDK 入口**
- **ui-angular**: 僅透過 adapters 使用能力，不可直接觸碰 core 或 SDK

## 🔐 SDK Separation (硬規則)

### The Golden Rule

**Only `platform-adapters` may import external SDKs. Domain and core-engine must remain pure TypeScript.**

### Detailed SDK Rules

| 層級 | 可用 | 禁用 | 說明 |
| --- | --- | --- | --- |
| **core-engine** | TypeScript stdlib, domain types | Angular, Firebase, 任何 SDK | 純基礎設施，定義抽象介面 |
| **account-domain / saas-domain** | TypeScript stdlib | 所有 SDK, frameworks | 純業務邏輯，零外部依賴 |
| **platform-adapters** | 所有外部 SDK | 業務規則（留給 domain） | **唯一 SDK 入口** |
| **platform-adapters/firebase-platform** | firebase-admin (app/auth/firestore/storage/messaging/pubsub) | @angular/fire | 伺服端 Firebase SDK |
| **platform-adapters/external-apis/google/genai** | Google GenAI, Vertex AI SDK | 其他層直連 | AI/LLM 封裝 |
| **ui-angular** (src/app) | @angular/*, @angular/fire, platform-adapters facades | firebase-admin, core-engine direct | 前端 UI 層 |

### SDK Import Matrix

```typescript
// ✅ ALLOWED - Only in platform-adapters
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { VertexAI } from '@google-cloud/vertexai';

// ❌ FORBIDDEN - In domain/core-engine
import { Firestore } from 'firebase-admin/firestore'; // NO!
import * as admin from 'firebase-admin'; // NO!
import { Injectable } from '@angular/core'; // NO in domain!
```

## 📦 TypeScript Path Mappings

Configure in root `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@account-domain": ["packages/account-domain/index"],
      "@account-domain/*": ["packages/account-domain/*"],
      "@core-engine": ["packages/core-engine/index"],
      "@core-engine/*": ["packages/core-engine/*"],
      "@saas-domain": ["packages/saas-domain/index"],
      "@saas-domain/*": ["packages/saas-domain/*"],
      "@platform-adapters": ["packages/platform-adapters/index"],
      "@platform-adapters/*": ["packages/platform-adapters/*"]
    }
  }
}
```

## 🛡️ ESLint Protection

Enforce boundaries with ESLint rules:

```javascript
// eslint.config.mjs
export default [
  {
    files: ['packages/core-engine/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@angular/*',
            'firebase-admin',
            'firebase/*',
            '@google-cloud/*'
          ]
        }
      ]
    }
  },
  {
    files: ['packages/account-domain/**/*.ts', 'packages/saas-domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '*', // Forbid all except relative imports
          ],
          paths: [
            // Allow only specific domain dependencies
            { name: '@account-domain/*', message: 'Use relative imports' }
          ]
        }
      ]
    }
  },
  {
    files: ['src/app/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            'firebase-admin', // Server SDK forbidden in frontend
            '@core-engine', // No direct core-engine imports
          ]
        }
      ]
    }
  }
];
```

## 📐 Architecture Principles

### 1. **Single Entry Point**
所有套件的程式碼集中於 `src/`，未來子模組也保持此規則。

### 2. **Clear Dependencies**
禁止跨層引用；UI 只能用 adapters，domain/engine 禁用任何 SDK。

### 3. **SDK Isolation**
所有第三方 SDK 只允許存在於 `platform-adapters/src`（含 `external-apis/google/genai`）。

### 4. **Documentation First**
新增子模組時，先更新對應的 README/AGENTS，保持與 Mermaid 架構文件一致。

### 5. **Immutable Events**
All domain events are immutable and carry causality metadata (causationId, correlationId).

### 6. **Repository Pattern**
Domain defines repository interfaces, platform-adapters implements them.

## 🚀 Development Workflow

### Adding a New Domain Aggregate

1. Define in appropriate domain package (`account-domain` or `saas-domain`)
2. Create aggregate class extending `AggregateRoot`
3. Define domain events
4. Create repository interface
5. Implement repository in `platform-adapters/persistence`
6. Update README/AGENTS documentation

### Adding a New Feature Module

1. Define business logic in `saas-domain`
2. Create UI components in `src/app/features`
3. Create facade in `src/app/adapters`
4. Wire up through platform-adapters
5. Update documentation

## 📊 Readiness Alignment (Mermaid 文件對齊)

### Current State

- ✅ `account-domain`: 已收斂至單一 `src/` 入口；新增聚合請直接放入對應子資料夾
- ✅ `platform-adapters`: Google AI 集中於 `src/external-apis/google/genai`，避免平行的 `@google` 根
- ✅ `core-engine` / `saas-domain` / `ui-angular`: 皆以 `src/` 為唯一入口

### Planned Additions

未來子模組請先更新 README/AGENTS 後再實作：

- Task/Issue/Finance/Quality/Acceptance aggregates in `saas-domain`
- Event replay functionality in `core-engine`
- Module dependency validation in `account-domain/policies`
- Advanced AI features in `platform-adapters/ai`

## 🧪 Testing Strategy

| Layer | Test Type | Tools | Focus |
|-------|-----------|-------|-------|
| **Domain** | Unit Tests | Jest | Aggregates, VOs, domain logic |
| **Core-Engine** | Unit Tests | Jest | Command/query handlers, ports |
| **Platform-Adapters** | Integration Tests | Jest + Test Containers | Repository implementations, SDK integration |
| **UI-Angular** | Component Tests | Jest + Testing Library | Components, facades, user interactions |
| **E2E** | End-to-End Tests | Cypress/Playwright | Full user workflows |

## 📚 References

- [AGENTS.md](AGENTS.md) - Detailed boundary rules for AI agents
- [account-domain/README.md](account-domain/README.md) - Identity domain documentation
- [saas-domain/README.md](saas-domain/README.md) - Business domain documentation
- [core-engine/README.md](core-engine/README.md) - CQRS/ES infrastructure
- [platform-adapters/README.md](platform-adapters/README.md) - Integration layer
- [ui-angular/README.md](ui-angular/README.md) - Frontend documentation

## 📝 License

MIT

---

**Monorepo Structure maintained for maximum clarity and zero architectural violations.**
