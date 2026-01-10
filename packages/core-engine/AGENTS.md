# core-engine AGENTS

> 邊界以 [`packages/AGENTS.md`](../AGENTS.md) 為準；開工前請用 **server-sequential-thinking** + **software-planning-mcp** 拆解步驟。

## 角色與依賴
- 提供 CQRS / Event Sourcing 抽象（Command / Event / Saga / Bus / Unit of Work / Scheduler）。
- **零 SDK、零框架**，僅純 TypeScript。實作交由 `platform-adapters`，業務規則交由 domain。
- 供 `saas-domain`、`platform-adapters`、`ui-angular`（透過 adapters）使用；不反向依賴任何 SDK。

## 結構（單一入口）
```
core-engine/
└── src/
    ├── commands/
    ├── queries/
    ├── use-cases/
    ├── ports/
    ├── mappers/
    ├── dtos/
    ├── jobs/
    ├── schedulers/
    └── __tests__/
```
> 新增元件前先更新 README/AGENTS，保持與 Mermaid 架構圖一致。

## 禁制
- ❌ Angular、Firebase、任何第三方 SDK
- ❌ 業務 if/else（如 `workspace.isPaid`）
- ❌ 直接暴露實作；僅定義介面、流程、協調

## 原則
1. 抽象優先：只定義接口/流程，具體實作留給 `platform-adapters`。
2. 純淨：保持純 TS，無外部依賴。
3. 單一入口：所有程式碼放在 `src/`，新增後同步補齊測試。
