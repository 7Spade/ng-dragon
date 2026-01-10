# ng-dragon workspace guide

`packages/AGENTS.md` 是套件邊界的唯一事實來源，讓 Copilot 能零認知理解程式應該放哪裡。計畫／拆解工作時，請先在對話中呼叫 **server-sequential-thinking** 與 **software-planning-mcp**，再依下列軌道落地程式。

## Package 快速地圖
- **account-domain** — 身份 / 工作區 / 模組啟用前置，純 TypeScript。
- **saas-domain** — 任務 / 議題 / 財務等 SaaS 模型，僅依賴 account-domain，純 TypeScript。
- **core-engine** — CQRS + Event Sourcing 抽象與協調流程，純 TypeScript、零 SDK。
- **platform-adapters** — 唯一可用 SDK 的層，實作 ports（Firebase/HTTP/AI 等）。
- **ui-angular** — 位於 `src/app` 的 Angular UI，只呼叫 adapters/facade。

## 依賴軌道（單一方向）
```
ui-angular → platform-adapters → core-engine → saas-domain → account-domain
```
- SDK 只允許在 `platform-adapters/src`（含 external-apis/google/genai）。
- Domain / core 只能寫純 TS；UI 只能使用 `@angular/fire` 與 adapters。

## 工作流程（新增或修改程式時）
1. 在對話中請 server-sequential-thinking 幫忙列出執行步驟，再用 software-planning-mcp 追蹤待辦。
2. 先更新對應的 README/AGENTS，確定檔案要落在哪個 package 的 `src/` 之下。
3. 依照上方依賴軌道撰寫程式：UI → adapters → ports → domain。
4. 禁止在 domain/core 新增任何 SDK，禁止在 UI 直連 Firebase/admin。

更多細節請參考 [`packages/AGENTS.md`](packages/AGENTS.md)。
