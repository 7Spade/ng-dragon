# Packages 邊界（總覽）

`packages/AGENTS.md` 是唯一事實來源；本檔提供精簡地圖，讓 Copilot 能零認知就知道程式要放哪裡。規劃或拆任務前，請在對話中呼叫 **server-sequential-thinking** 與 **software-planning-mcp** 取得步驟與待辦，再比對下列邊界。

## 依賴軌道
```
ui-angular → platform-adapters → core-engine → saas-domain → account-domain
```
- SDK 只允許出現在 `platform-adapters/src`；Domain / Core 只能寫純 TS。
- UI 只能透過 adapters/facade 取用後端，不得直連 SDK 或 domain。

## Package 職責與禁制
- **account-domain**：帳號 / 工作區 / 模組啟用前置。純 VO/Entity/Policy/Event/Repository 介面。❌ SDK、Angular、HTTP、DB schema。
- **saas-domain**：任務 / 議題 / 財務 / 品質 / 驗收等 SaaS 模型，僅依賴 account-domain。❌ 任何 SDK 或 UI 依賴。
- **core-engine**：Command / Event / Saga / Bus / Unit of Work 抽象與流程協調，零業務 if/else，零 SDK。實作交給 adapters。
- **platform-adapters**：唯一 SDK 層，實作 `core-engine` 的 ports（Firebase、HTTP、AI、Queue、Storage）。不得含業務規則，僅做轉接。
- **ui-angular**：`src/app` 下的 Angular UI，透過 adapters 呼叫後端；允許 `@angular/fire`，禁止 `firebase-admin` 與直接使用 domain/core。

## 放檔案的唯一入口
所有程式碼一律放在各 package 的 `src/` 下（如 `packages/account-domain/src/aggregates/...`）。新增模組或路徑前先更新對應 README/AGENTS，保持與 Mermaid 架構文件一致。

更多細節與完整示意請參考 [`packages/AGENTS.md`](packages/AGENTS.md)。
