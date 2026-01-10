# saas-domain AGENTS.md

## 目標

建模 SaaS 業務領域（任務、議題、財務、品質、驗收等），基於 `account-domain` 與 `core-engine`，保持純 TypeScript，零 SDK。

## 邊界

- **依賴**：`account-domain`（身份 / 工作區 / 模組啟用）、`core-engine` 抽象。
- **禁止**：任何 SDK、UI 框架。
- **輸出**：聚合 / 事件 / VO / Policy，供 adapters 或 UI 間接使用。

## 結構（現況 + 預備）

```
saas-domain/
└── src/
    ├── aggregates/        # 各模組聚合（team, project-collaboration 等）
    ├── application/       # Application Services (協調 domain 層的純 TS 服務)
    ├── commands/          # 業務命令定義 (SaaS 特定命令)
    ├── domain-services/   # 跨聚合的無狀態邏輯與 Factories
    ├── entities/          # 共享 Entity 型別
    ├── events/            # 模組事件
    ├── modules/           # 子模組組織 (identity, access-control, settings, audit)
    │   ├── identity/      # - aggregates, entities, events, value-objects, application, projections
    │   ├── access-control/# - aggregates, entities, events, value-objects, services
    │   ├── settings/      # - aggregates, entities, events, value-objects
    │   └── audit/         # - aggregates, entities, events, value-objects
    ├── repositories/      # Repository 介面定義（實作在 platform-adapters）
    └── value-objects/     # 模組 VO
```

> **組織原則：**
> - 簡單模型：使用扁平化結構（aggregates/, events/, value-objects/ 等）
> - 複雜模型：可使用 modules/ 子目錄組織 bounded context（如 4 個基礎模組）
> - Application Services 可存在於 domain package（協調純 TS domain 邏輯，無框架依賴）
> - Commands 可存在於 domain package（業務命令定義屬於 domain 概念）

## 原則

1. **依賴前置**：所有模組操作需先確認 account-domain 的工作區與模組啟用狀態。
2. **純業務**：不得引入任何 SDK；資料存取交給 `platform-adapters` 實作 port。
3. **文件先行**：新增模組前，先更新 README/AGENTS 及 Mermaid 文件的模組樹。
