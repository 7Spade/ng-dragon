# Core Engine

💎 **Pure TypeScript CQRS / Event Sourcing 基礎層，零框架依賴**

> **核心永遠不知道 Angular 是什麼，也不碰任何 SDK**

## 結構（現況 + 預備）

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
    └── __tests__/     # 核心規則測試（新增元件時同步補齊）
```

## 原則

- ❌ 禁止 Angular / Firebase / 任意 SDK
- ✅ 只定義介面與純邏輯，實作放在 `platform-adapters`
- ✅ 可由 `account-domain` / `saas-domain` 引用
- ✅ 單一入口 `src/`，新增元件前先更新 README/AGENTS

## 使用範例

```typescript
import { DomainEvent } from '@core-engine/ports';
import { CommandHandler } from '@core-engine/commands';

// 在 adapters 中實作 EventStore，再注入 use-case
```

## 依賴位置

```
core-engine (純抽象) <-- platform-adapters (具體實作)
         ^
         |
account-domain / saas-domain (呼叫抽象介面)
```

## License

MIT
