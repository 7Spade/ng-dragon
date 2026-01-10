# ui-angular AGENTS

> 依 [`packages/AGENTS.md`](../AGENTS.md) 的邊界；工作前請用 **server-sequential-thinking** + **software-planning-mcp** 列出步驟。

## 角色與依賴
- 提供 Angular 前端應用，程式碼位於專案根目錄 `src/app`（本 package 僅承載說明）。
- 只能透過 adapters/facade 呼叫後端；允許 `@angular/fire`，禁止 `firebase-admin` 與直接依賴 domain/core。

## 結構（位於 `src/app`）
```
src/app/
├── adapters/         # Facade / service，封裝對 adapters 的呼叫
├── features/         # task/issue/finance/quality/acceptance 等功能模組（預留）
├── core/             # i18n、startup、net、guards 等基礎設施
├── routes/           # 路由設定
├── shared/           # 共用 UI 元件
└── layout/           # 版面
```
> 新增 feature 請放在 `features/` 並走 Facade；禁止在元件中直接呼叫 SDK。

## 禁制
- ❌ 直接引用 `core-engine` / `saas-domain` / `account-domain`
- ❌ 使用 `firebase-admin` 或其他未封裝的 SDK
- ❌ 在 UI 內實作業務規則；所有業務交給 domain/adapters

## 原則
1. Facade-first：UI 只知道 Facade，不知道 SDK。
2. SDK 最小化：僅允許 `@angular/fire`；其餘 SDK 放在 `platform-adapters`。
3. 單一入口：所有 UI 代碼集中於 `src/app`；新增前先更新 README/AGENTS。
