# SaaS Domain

🏢 **SaaS 業務模型（純 TypeScript，零 SDK）** — 依 [`packages/AGENTS.md`](../AGENTS.md) 的邊界。開始前請用 **server-sequential-thinking** + **software-planning-mcp** 拆解任務，並確認要放入下列路徑。

## 結構（單一入口）
```
saas-domain/
└── src/
    ├── aggregates/        # task / issue / finance / quality / acceptance 等聚合（預留）
    ├── value-objects/     # 模組 VO
    ├── events/            # 模組事件
    ├── domain-services/   # 無狀態的跨聚合邏輯
    ├── repositories/      # 介面定義
    ├── entities/          # 共享 Entity 型別
    ├── policies/          # 模組依賴 / 啟用檢查
    └── __tests__/         # 測試（新增實作時補齊）
```
> 新增模組時直接落在上列子資料夾，並同步更新 README/AGENTS 與 Mermaid 文件。

## Responsibilities
- 提供任務/議題/財務/品質/驗收等聚合、VO、事件與 Policy。
- 依賴 `account-domain` 的 Workspace / Module 狀態，禁止繞過前置驗證。

## Guardrails
- ❌ 禁止 Angular / Firebase / 任意 SDK / 持久層實作
- ❌ 不輸出 DTO / REST schema；僅提供介面與事件
- ✅ 單一依賴軌道：UI → adapters → core-engine → saas-domain（依賴 account-domain）
