# saas-domain AGENTS

> 邊界源自 [`packages/AGENTS.md`](../AGENTS.md)；規劃工作請先呼叫 **server-sequential-thinking** + **software-planning-mcp**。

## 角色與依賴
- 建模 SaaS 業務（task/issue/finance/quality/acceptance 等），僅依賴 `account-domain` 前置狀態。
- 純 TypeScript，零 SDK / UI 框架。被 `core-engine` / `platform-adapters` / `ui-angular` 間接消費。

## 結構（單一入口）
```
saas-domain/
└── src/
    ├── aggregates/
    ├── value-objects/
    ├── events/
    ├── domain-services/
    ├── repositories/
    ├── entities/
    ├── policies/
    └── __tests__/
```
> 新增任務/議題/財務/品質/驗收模組時，直接在上述子資料夾建立聚合與事件，禁止另開平行根目錄。

## 禁制
- ❌ 任何 SDK、UI 框架
- ❌ 持久層實作或 REST/GraphQL DTO
- ❌ 未經 account-domain 驗證的操作（必須先檢查 Workspace 與模組啟用）

## 原則
1. 依賴前置：所有模組操作需先確認 account-domain 的 Workspace / Module 啟用狀態。
2. 純業務：僅輸出聚合、事件、VO、Policy、Repository 介面；存取交給 adapters。
3. 文件先行：新增模組前更新 README/AGENTS 與 Mermaid 模組樹。
