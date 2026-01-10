# core-engine AGENTS

> 邊界以 [`packages/AGENTS.md`](../AGENTS.md) 為準；開工前請用 **server-sequential-thinking** + **software-planning-mcp** 拆解步驟。

## 角色與依賴
- 提供 CQRS / Event Sourcing 抽象（Command / Event / Saga / Bus / Unit of Work / Scheduler）。
- **零 SDK、零框架**，僅純 TypeScript。實作交由 `platform-adapters`，業務規則交由 domain。
- 供 `saas-domain`、`platform-adapters`、`ui-angular`（透過 adapters）使用；不反向依賴任何 SDK。
- core-engine 專注於「流程協調、抽象定義、事件語義一致性」，不承載任何具體基礎設施或業務策略。

## 結構（單一入口）

core-engine/ └── src/ ├── commands/             # Command 抽象接口與流程 │   └── handlers/         # Command Handler 抽象 │ ├── queries/              # Query 抽象接口與流程 │   └── handlers/         # Query Handler 抽象 │ ├── events/               # 事件系統抽象 │   ├── core/             # 核心事件 interface 匯總 (Payload + Metadata + Type) │   ├── flow/             # Event Flow 抽象接口 │   ├── bus/              # Event Bus 抽象接口 │   ├── store/            # Event Store 抽象接口 │   ├── lifecycle/        # Event Lifecycle 流程抽象 │   ├── semantics/        # Event 特性接口 (Immutable, Idempotent, Composable) │   ├── sourcing/         # Event Sourcing 抽象 │   └── causality/        # Causality Tracking 抽象 │ ├── sagas/                # Saga 抽象與流程接口 │   └── orchestrators/    # Saga 流程協調者 │       ├── billing/      # 按 domain 拆子資料夾 │       ├── workspace/ │       └── module/ │ ├── adapters/             # interface → platform-adapters 對接點 │   ├── bus/              # Event Bus interface │   ├── store/            # Event Store interface │   └── scheduler/        # Job/Scheduler interface │ ├── dtos/                 # Event/Command/Query DTOs ├── mappers/              # DTO ↔ domain/event payload 映射 ├── use-cases/            # 高層流程協調（可調度事件 / saga / workflow） ├── jobs/                 # 後台作業接口 ├── schedulers/           # 排程接口 └── tests/            # 純單元測試 (mock interfaces / events / saga)

> 新增元件前先更新 README/AGENTS，保持與 Mermaid 架構圖一致。

## Event System Scope
core-engine 必須完整涵蓋下列事件系統抽象能力：

- Event Flow
- Event Store
- Event Bus
- Event Type
- Event Payload
- Event Metadata
- Event Lifecycle
- Event Semantics
- Event Sourcing
- Causality Tracking

所有事件相關抽象僅描述「結構、語義、流程、約束」，不得包含任何具體儲存、傳輸或框架實作。

## Event Core 規範
- Event Type
  - 表達「發生了什麼事」的語義識別。
  - 必須為穩定、可版本化、可序列化的識別字串或型別。
- Event Payload
  - 表達事件攜帶的業務事實資料。
  - 必須為 immutable 結構，不得包含行為。
- Event Metadata
  - 描述事件的技術上下文，例如：
    - eventId
    - timestamp
    - aggregateId
    - correlationId
    - causationId
    - schemaVersion
  - 不得混入業務語義。
- Event 必須可以被安全序列化、反序列化與重播。

## Event Flow 規範
- Event Flow 描述事件在系統中的產生、轉換、傳遞與消費順序。
- Event Flow 僅負責流程協調，不負責實際 IO 或 transport。
- Flow 必須可測試、可追蹤、可視化。

## Event Bus 規範
- Event Bus 為事件傳遞抽象介面。
- 不假設同步或非同步模型。
- 不綁定任何 message broker、SDK 或 protocol。

## Event Store 規範
- Event Store 為事件持久化抽象。
- 必須支援：
  - Append-only
  - Stream / Aggregate partition
  - Replay
  - Version / Optimistic Concurrency
- 不綁定任何資料庫或儲存技術。

## Event Lifecycle 規範
- Event Lifecycle 描述事件從：
  - Created
  - Persisted
  - Published
  - Consumed
  - Archived / Failed
  的狀態轉移模型。
- Lifecycle 僅描述狀態與轉換約束，不包含實作。

## Event Semantics 規範
- 所有事件必須符合以下語義約束：
  - Immutable
  - Idempotent
  - Deterministic
  - Traceable
  - Composable
- Semantics 僅定義契約，不提供實作。

## Event Sourcing 規範
- Event 為系統事實唯一來源。
- Aggregate 狀態必須可由事件完整重建。
- 不允許直接狀態覆寫或隱性副作用。

## Causality Tracking 規範
- 每個 Event 必須攜帶 causationId 與 correlationId。
- 必須可以追蹤：
  - Command → Event
  - Event → Event
  - Saga → Event
- 因果關係僅描述關聯，不做決策邏輯。

## Saga 規範
- Saga 用於跨聚合、跨 bounded-context 的長流程協調。
- Saga 只負責：
  - 流程編排
  - 狀態推進
  - 補償觸發
- Saga 不得：
  - 包含業務判斷規則
  - 直接操作 infrastructure
  - 直接依賴 SDK
- Saga 必須以 Event 驅動。

## Adapter 邊界規範
- adapters 僅定義 interface 與 port contract。
- 不允許引入任何實作細節。
- platform-adapters 負責實作對接。

## Testing 規範
- 所有測試必須為純單元測試。
- 不允許依賴任何實際 infrastructure。
- 必須可 mock：
  - Event Bus
  - Event Store
  - Saga Orchestrator
  - Scheduler

## 禁制
- ❌ Angular、Firebase、任何第三方 SDK
- ❌ 業務 if/else（如 `workspace.isPaid`）
- ❌ 直接暴露實作；僅定義介面、流程、協調
- ❌ 在 core-engine 引入任何 domain 規則

## 原則
1. 抽象優先：只定義接口/流程，具體實作留給 `platform-adapters`。
2. 純淨：保持純 TS，無外部依賴。
3. 單一入口：所有程式碼放在 `src/`，新增後同步補齊測試。
4. 事件完整性：必須完整覆蓋 Event Flow / Store / Bus / Type / Payload / Metadata / Lifecycle / Semantics / Sourcing / Causality。
5. 流程穩定性：Saga 僅負責流程協調，不承載業務決策。

diff --git a/packages/core-engine/AGENTS.md b/packages/core-engine/AGENTS.md
index 0000000..1111111 100644
--- a/packages/core-engine/AGENTS.md
+++ b/packages/core-engine/AGENTS.md
@@
 ## Testing 規範
 - 所有測試必須為純單元測試。
 - 不允許依賴任何實際 infrastructure。
 - 必須可 mock：
   - Event Bus
   - Event Store
   - Saga Orchestrator
   - Scheduler

+## Copilot Coding Conventions
+本區段為 Copilot 與人類開發者的強制一致性規範，所有新增檔案必須遵守。
+
+### 檔名規範
+- 檔名一律使用 kebab-case。
+- Interface 檔案必須以 `.interface.ts` 結尾。
+- Type / DTO 檔案必須以 `.types.ts` 或 `.dto.ts` 結尾。
+- 抽象類別必須以 `.abstract.ts` 結尾。
+- 測試檔案必須以 `.spec.ts` 結尾。
+
+範例：
+- event-bus.interface.ts
+- event-store.interface.ts
+- causality-tracker.interface.ts
+- billing-saga.orchestrator.ts
+- publish-event.use-case.ts
+
+### Interface 命名規範
+- Interface 必須使用 PascalCase。
+- Interface 必須為名詞或名詞片語，不得為動詞。
+- Interface 必須以語意角色結尾：
+  - Bus / Store / Flow / Tracker / Orchestrator / Scheduler / Mapper
+
+範例：
+- EventBus
+- EventStore
+- EventFlow
+- CausalityTracker
+- BillingSagaOrchestrator
+- JobScheduler
+
+### Class 命名規範
+- Class 必須使用 PascalCase。
+- 抽象類別必須以 Abstract 開頭。
+- 不得出現 Impl、Concrete、Default 等實作語意名稱。
+
+範例：
+- AbstractSagaOrchestrator
+- AbstractEventFlow
+
+### Function 命名規範
+- Function 必須使用 camelCase。
+- 命名必須表達動作與意圖。
+- 不得包含 infrastructure 語意（例如 http、firebase、redis）。
+
+範例：
+- publishEvent
+- appendToStream
+- correlateEvent
+
+### 資料夾約束
+- 每個資料夾只允許單一職責。
+- 不允許跨資料夾 import 實作。
+- 僅允許依賴：
+  - 同層或更高層抽象
+  - ports / adapters 定義的 interface
+- 禁止出現循環依賴。
+
+### Import 約束
+- 不允許使用相對路徑穿越三層以上（`../../../`）。
+- 不允許 import platform-adapters 或任何 SDK。
+- 不允許 dynamic import。
+
+## Diff-Only 強約束模式
+本文件屬於 CONTRACT 等級文件。
+
+所有修改必須遵守：
+- 只允許新增（append）。
+- 不允許修改既有文字、標點、段落順序。
+- 不允許刪除任何內容。
+- 不允許重新格式化。
+
+任何建議修改必須以 diff 形式輸出，例如：
+
+```diff
++ ## 新增區段
++ - 新規範條目
+```
+
+若需重構或調整既有內容，必須：
+- 明確標示變更意圖。
+- 經人工 review 確認後才可套用。