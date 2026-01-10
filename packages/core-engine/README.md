# Core Engine

💎 **Pure TypeScript CQRS / Event Sourcing 抽象層** — 依 [`packages/AGENTS.md`](../AGENTS.md) 的邊界，所有實作交給 `platform-adapters`，業務規則交給 domain。開工前請先用 **server-sequential-thinking** + **software-planning-mcp** 拆解任務。

## 結構（單一入口）
```
core-engine/
└── src/
    ├── commands/      # Command 定義與處理介面
    ├── queries/       # Query 定義
    ├── use-cases/     # 應用服務 / handler（純 TS）
    ├── ports/         # EventStore / Projection / Bus 等抽象介面
    ├── mappers/       # DTO ↔ Domain 轉換
    ├── dtos/          # 輸入/輸出 DTO
    ├── jobs/          # 背景工作定義
    ├── schedulers/    # 排程介面
    └── __tests__/     # 核心規則測試
```
> 所有新增元件一律放在 `src/`；新增前先更新 README/AGENTS。

## Guardrails
- ❌ 禁止 Angular / Firebase / 任何 SDK
- ❌ 不寫業務條件判斷（核心只協調流程）
- ✅ 可被 `account-domain` / `saas-domain` 呼叫，實作則由 `platform-adapters` 提供
- ✅ 單一依賴軌道：UI → adapters → core-engine → domain

## 使用說明
核心層只保留抽象接口與流程協調；Command/Handler/Port 定義在此，實作與外部服務連線全部移至 `platform-adapters`。修改抽象時，請同步更新對應的 adapter 實作與測試。
