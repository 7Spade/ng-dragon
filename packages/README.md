# Packages Architecture

DDD + Event Sourcing 分層，所有業務與技術元件都從 `packages/` 內部的 `src/` 作為單一入口，避免平行或重複的資料夾結構。

## Overview（現況 + 後續規劃）

```
packages/
├── account-domain/          # 帳號 / 工作區 / 模組啟用（純 TS）
│   └── src/{aggregates,value-objects,events,policies,domain-services,repositories,entities,types}
├── core-engine/             # CQRS + Event Sourcing 基礎設施（純 TS）
│   └── src/{commands,queries,use-cases,ports,mappers,dtos,jobs,schedulers}
├── platform-adapters/       # 外部 SDK 介接（唯一可碰 SDK）
│   └── src/{auth,ai,external-apis/google/genai,messaging,persistence}
├── saas-domain/             # SaaS 模組（任務/議題/財務/品質/驗收）（純 TS）
│   └── src/{aggregates,value-objects,events,domain-services,repositories,entities,policies}
├── ui-angular/              # Angular 前端（位於根目錄 src/app）
└── README.md
```

> 未來的子模組請直接放在各自 package 的 `src/` 下，保持單一路徑，避免再出現平行根目錄。

## Dependency Flow

```
account-domain --> saas-domain --> ui-angular
        \           ^
         \          |
          \-> core-engine <- platform-adapters
```

- `account-domain`：身份 / 工作區 / 模組啟用前置邏輯，純 TS。
- `core-engine`：事件、命令、聚合、投影基礎設施，純 TS、零 SDK。
- `platform-adapters`：外部 SDK 介接（Firebase、訊息、持久化、Google GenAI 等）。
- `saas-domain`：SaaS 業務模組，依賴 account-domain 與 core-engine。
- `ui-angular`：僅透過 adapters 使用能力，不可直接觸碰 core 或 SDK。

## SDK Separation (硬規則)

| 層級 | 可用 | 禁用 | 說明 |
| --- | --- | --- | --- |
| core-engine | TypeScript | Angular / Firebase / 任何 SDK | 純基礎設施 |
| account-domain / saas-domain | TypeScript, @core-engine | 所有 SDK | 純業務邏輯 |
| platform-adapters/src/firebase-platform,persistence,ai,external-apis | 第三方 SDK (firebase-admin, @google-cloud/pubsub, Google AI SDK 等依場景) | 在未定義的層使用 SDK | 唯一 SDK 入口 |
| ui-angular (src/app) | @angular/fire, @platform-adapters (client 介面) | firebase-admin | 前端 UI 層 |

## TypeScript Path Mappings (root tsconfig)

```json
{
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
```

## ESLint Protection

- ❌ `core-engine/` 禁止 Angular / Firebase
- ❌ `account-domain/`、`saas-domain/` 禁止任何 SDK
- ❌ `platform-adapters` 中 `firebase/admin/` 禁止 `@angular/fire`
- ❌ `platform-adapters` 中 `firebase/angular-fire/` 禁止 `firebase-admin`
- ❌ `src/app/` 禁止 `firebase-admin`

## Readiness Alignment（Mermaid 文件對齊）

- `account-domain` 已收斂至單一 `src/` 入口；新增聚合請直接放入對應子資料夾。
- `platform-adapters` 的 Google AI 集中於 `src/external-apis/google/genai`，避免平行的 `@google` 根。
- `core-engine` / `saas-domain` / `ui-angular` 皆以 `src/` 為唯一入口，未來子模組請先更新 README/AGENTS 後再實作。
