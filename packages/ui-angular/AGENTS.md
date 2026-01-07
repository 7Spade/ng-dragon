# ui-angular AGENTS.md

## 目標

提供 Angular 前端應用，透過 adapters 使用後端能力，保持與 domain/engine 隔離。

## 邊界

- **依賴**：`@platform-adapters`（client 介面）、`@angular/fire`。
- **禁止**：直接引用 `core-engine` / `saas-domain` / `account-domain`，禁止 `firebase-admin`。
- **位置**：前端程式碼位於專案根目錄 `src/app`（packages/ui-angular 本身僅承載說明）。

## 結構（現況 + 預備）

```
src/app/
├── adapters/         # Facade / service，封裝對 adapters 的呼叫
├── features/         # domain 對齊的功能 (task/issue/finance/quality/acceptance 預留)
├── core/             # i18n、startup、net、guards 等基礎設施
├── routes/           # 路由設定
├── shared/           # 共用 UI 元件
└── layout/           # 版面
```

> 新增 feature 時請放在 `features/` 並走 Facade；禁止在元件中直接呼叫 SDK。

## 原則

1. **Facade-first**：UI 僅透過 adapters/facade 呼叫後端或 domain 功能。
2. **SDK 最小化**：僅允許 `@angular/fire`；其他 SDK 一律封裝在 `platform-adapters`。
3. **單一入口**：所有 UI 代碼集中於 `src/app`，新增前先更新 README/AGENTS 對齊 Mermaid 圖。
