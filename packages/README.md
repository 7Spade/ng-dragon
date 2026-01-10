# Packages Architecture（對齊 `packages/AGENTS.md`）

`packages/AGENTS.md` 是邊界事實來源；此檔提供簡版地圖。新增功能前，請先用 **server-sequential-thinking** + **software-planning-mcp** 產生步驟與待辦，再比對下列路徑。

## 目錄與單一入口
```
packages/
├── account-domain/      # 帳號 / 工作區 / 模組啟用，純 TS
│   └── src/{aggregates,value-objects,events,policies,domain-services,repositories,entities,types}
├── core-engine/         # CQRS + Event Sourcing 抽象，純 TS
│   └── src/{commands,queries,use-cases,ports,mappers,dtos,jobs,schedulers}
├── platform-adapters/   # 外部 SDK 介接，唯一可碰 SDK
│   └── src/{auth,ai,external-apis/google/genai,messaging,persistence,firebase-platform}
├── saas-domain/         # SaaS 模組（task/issue/finance/quality/acceptance），純 TS
│   └── src/{aggregates,value-objects,events,domain-services,repositories,entities,policies}
└── ui-angular/          # Angular UI，位於根目錄 src/app（此處僅承載說明）
```
> 所有新檔案一律放入各自 package 的 `src/`；禁止新增平行根目錄。

## 依賴軌道（單一方向）
```
ui-angular → platform-adapters → core-engine → saas-domain → account-domain
```
- SDK 僅允許 `platform-adapters/src`；domain/core 層只寫純 TypeScript。
- UI 只透過 adapters/facade 呼叫後端，不得直接觸碰 SDK 或 domain。

## 硬性守則
1. **單一入口**：每個 package 只有 `src/`；新增模組前先更新 README/AGENTS。
2. **SDK 隔離**：任何第三方 SDK（Firebase、HTTP、AI）只准在 `platform-adapters`。
3. **文件先行**：對齊 Mermaid 架構文件；先更新文件再寫碼。
4. **計畫先跑工具**：規劃任務時先呼叫 server-sequential-thinking 產出步驟，再用 software-planning-mcp 維護待辦。

完整細節與踩雷清單請閱讀 [`packages/AGENTS.md`](AGENTS.md)。
