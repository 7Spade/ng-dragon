# Core Engine

💎 **Pure TypeScript CQRS / Event Sourcing 抽象層** --- 依據
[`packages/core-engine/AGENTS.md`](../AGENTS.md) 的邊界。\
所有實作交由 `platform-adapters`；業務規則交由 domain。\
在開工前請用 **server-sequential-thinking + software-planning-mcp**
拆解任務。

## 角色與依賴

-   提供 CQRS / Event Sourcing 抽象（Command / Event / Saga / Bus / Unit
    of Work / Scheduler）。\
-   **零 SDK、零框架**，僅純 TypeScript。實作交由
    `platform-adapters`，業務規則交由 domain。\
-   供 `saas-domain`、`platform-adapters`、`ui-angular`（透過
    adapters）使用；不反向依賴任何 SDK。\
-   專注於「抽象接口、流程協調、事件語義一致性」，不包含任何具體
    infrastructure 或業務邏輯。

## 目錄結構（單一入口）

    core-engine/
    └── src/
        ├── commands/             # Command 抽象接口與流程
        │   └── handlers/         # Command Handler 抽象
        │
        ├── queries/              # Query 抽象接口與流程
        │   └── handlers/         # Query Handler 抽象
        │
        ├── events/               # 事件系統抽象
        │   ├── core/             # 核心事件 interface 匯總 (Payload + Metadata + Type)
        │   ├── flow/             # Event Flow 抽象接口
        │   ├── bus/              # Event Bus 抽象接口
        │   ├── store/            # Event Store 抽象接口
        │   ├── lifecycle/        # Event Lifecycle 抽象流程
        │   ├── semantics/        # Event 特性接口 (Immutable, Idempotent, Composable)
        │   ├── sourcing/         # Event Sourcing 抽象
        │   └── causality/        # Causality Tracking 抽象
        │
        ├── sagas/                # Saga 抽象與流程接口
        │   └── orchestrators/    # Saga 流程協調者
        │       ├── billing/      # 按 domain 拆子資料夾
        │       ├── workspace/
        │       └── module/
        │
        ├── adapters/             # interface → platform-adapters 對接點
        │   ├── bus/              # Event Bus interface
        │   ├── store/            # Event Store interface
        │   └── scheduler/        # Job / Scheduler interface
        │
        ├── dtos/                 # Event / Command / Query DTOs
        ├── mappers/              # DTO ↔ domain / event payload 映射
        ├── use-cases/            # 高層流程協調（可調度事件 / saga / workflow）
        ├── jobs/                 # 後台作業接口
        ├── schedulers/           # 排程接口
        └── __tests__/            # 純單元測試 (mock interfaces / events / saga)

> 新增元件前必須先更新 `README` / `AGENTS.md` 並保持與 Mermaid
> 架構圖一致。

## 核心邊界（Guardrails）

-   ❌ 禁止 Angular / Firebase / 任何第三方 SDK\
-   ❌ 不寫業務條件判斷（核心只協調流程）\
-   ❌ 禁止直接暴露實作；僅定義介面、流程、協調\
-   ❌ 禁止在 core-engine 引入 domain 規則或 infrastructure 細節\
-   ✅ 可被 `account-domain` / `saas-domain` 呼叫\
-   ✅ 實作由 `platform-adapters` 提供\
-   ✅ 單一依賴軌道：UI → adapters → core-engine → domain

## 使用說明

核心層保留抽象接口與流程協調；\
Command / Handler / Port 定義在此，實作與外部連線交由
`platform-adapters`。\
當修改抽象時，請確保同步更新對應的 adapter 實作與測試。

## 事件系統範圍

core-engine 提供完整的事件系統抽象能力，包括：

-   Event Flow\
-   Event Store\
-   Event Bus\
-   Event Type\
-   Event Payload\
-   Event Metadata\
-   Event Lifecycle\
-   Event Semantics\
-   Event Sourcing\
-   Causality Tracking\
-   Saga（跨聚合 / 長流程協調）

所有事件相關的抽象僅定義結構、語義與約束，**不包含任何實際持久化或傳輸實作**。

## Copilot / 其他 AI 開發友好指南

請搭配 `AGENTS.md` 所定義的：

-   檔名 / interface / class / function 命名規範\
-   資料夾責任邊界\
-   Import 約束\
-   Diff-only 變更規則（避免重寫或移動既有文字）

以利 Copilot 或其他智能編輯器依規範產出一致性程式碼。

## 測試策略

-   必須為純單元測試，不依賴任何 concrete infrastructure\
-   需 mock Event Bus、Event Store、Saga Orchestrator、Scheduler
    等抽象介面\
-   不包含實際外部資源驗證

------------------------------------------------------------------------

## 常見範例（語意說明）

``` ts
// commands/handlers/create-order.command.ts
export interface CreateOrderCommand {
  orderId: string
}

// commands/handlers/create-order.handler.ts
export interface CreateOrderHandler {
  execute(cmd: CreateOrderCommand): Promise<void>
}
```

以上示例符合 core-engine 的「抽象定義」與「命名習慣」要求。
