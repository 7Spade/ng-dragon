# core-engine AGENTS.md

## 目標

提供 CQRS / Event Sourcing 的基礎設施（命令、事件、聚合、投影、排程、工作），純 TypeScript，零 SDK。

## 邊界與依賴

- **僅依賴**：`account-domain` 模型（選擇性），TypeScript 標準庫。
- **禁止**：Angular、Firebase、任何第三方 SDK。
- **服務對象**：`saas-domain`、`platform-adapters`、`ui-angular`（透過 adapters 間接）。

## 結構（現況 + 預備）

```
core-engine/
└── src/
    ├── aggregates/    # Aggregate Root 基礎模式與工具
    ├── causality/     # Causality tracking 因果追蹤工具
    ├── commands/      # Command 定義與處理介面
    ├── dtos/          # 輸入/輸出 DTO
    ├── event-store/   # Event Store 抽象介面與工具
    ├── jobs/          # 背景工作定義
    ├── mappers/       # DTO/領域物件轉換
    ├── ports/         # 介面/抽象 (EventStore, Projection 等)
    ├── projection/    # Projection (Read Model) 定義與工具
    ├── queries/       # Query 定義
    ├── schedulers/    # 定時 / 排程介面
    ├── use-cases/     # 應用服務 / handler（純 TS）
    └── value-objects/ # 共用 Value Objects
```

> 實作端（Firebase、DB、AI）一律放在 `platform-adapters/src`，此處只定義介面與純邏輯。

## 依賴圖（單一路徑）

```
core-engine
   ^      \
   |       \
account-domain  platform-adapters
        \        /
         \      /
         saas-domain
             ^
             |
          ui-angular (透過 adapters)
```

## 原則

1. **純淨**：零 SDK、零框架依賴。
2. **抽象優先**：僅定義介面與行為，具體實作交給 `platform-adapters`。
3. **單一入口**：所有程式碼放在 `src/`；新增元件前先更新 README/AGENTS。
4. **測試導向**：新增 command/handler/port 時，為核心規則撰寫對應測試（`__tests__/`）。
