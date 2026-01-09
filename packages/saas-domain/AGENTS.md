# saas-domain AGENTS.md

## 目標

建模 SaaS 業務領域（任務、議題、財務、品質、驗收等），僅依賴 `account-domain`，保持純 TypeScript，零 SDK。

## 邊界

- **依賴**：`account-domain`（身份 / 工作區 / 模組啟用）。
- **禁止**：任何 SDK、UI 框架。
- **輸出**：聚合 / 事件 / VO / Policy，供 adapters 或 UI 間接使用。

## 結構（現況 + 預備）

```
saas-domain/
└── src/
    ├── aggregates/        # 各模組聚合（task/issue/finance/quality/acceptance 預留）
    ├── value-objects/     # 模組 VO
    ├── events/            # 模組事件
    ├── domain-services/   # 跨聚合的無狀態邏輯
    ├── repositories/      # 介面定義
    ├── entities/          # 共享 Entity 型別
    ├── policies/          # 跨模組 / 依賴檢查（例如模組啟用）
    └── __tests__/         # 模組測試（待補）
```

> 新增任務/議題/財務/品質/驗收模組時，請直接在 `src/` 對應子資料夾建立聚合與事件，避免額外的根資料夾。

## 原則

1. **依賴前置**：所有模組操作需先確認 account-domain 的工作區與模組啟用狀態。
2. **純業務**：不得引入任何 SDK；資料存取交給 `platform-adapters` 實作 port。
3. **文件先行**：新增模組前，先更新 README/AGENTS 及 Mermaid 文件的模組樹。
