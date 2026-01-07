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
    ├── commands/      # Command 定義與處理介面
    ├── queries/       # Query 定義
    ├── use-cases/     # 應用服務 / handler（純 TS）
    ├── ports/         # 介面/抽象 (EventStore, Projection 等)
    ├── mappers/       # DTO/領域物件轉換
    ├── dtos/          # 輸入/輸出 DTO
    ├── jobs/          # 背景工作定義
    ├── schedulers/    # 定時 / 排程介面
    └── __tests__/     # 核心行為測試（待補）
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
