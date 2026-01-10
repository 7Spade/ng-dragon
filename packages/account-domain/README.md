# account-domain

> 依 [`packages/AGENTS.md`](../AGENTS.md) 為事實來源；新增前請先用 **server-sequential-thinking** + **software-planning-mcp** 拆步驟，再確認檔案是否落在下列路徑。

`account-domain` 建模身份、帳號、工作區與模組啟用的前置條件。站在依賴鏈最底層，被 `saas-domain` 與 `core-engine` 消費，必須保持純 TypeScript、零 SDK。

## Folder Structure（單一入口）
```
account-domain/
├── src/
│   ├── aggregates/        # Account / Workspace / Module Registry 聚合
│   ├── value-objects/     # Roles、Module Types、Workspace Types
│   ├── events/            # Domain events + metadata helpers
│   ├── policies/          # 跨聚合守則（模組啟用檢查等）
│   ├── repositories/      # 介面定義（無實作）
│   ├── entities/          # Entity helpers
│   ├── domain-services/   # Stateless domain logic
│   └── types/             # Shared identifiers
└── __tests__/             # Domain tests
```
> 所有新檔案直接放在 `src/` 對應子資料夾，避免平行根目錄。

## Responsibilities
- Provision/suspend Account，並 gate Workspace 建立。
- Workspace 背書模組啟用（Module Registry）與 Membership。
- 提供事件 `AccountCreated → WorkspaceCreated → MembershipCreated → ModuleEnabled` 及補償事件。

## Guardrails
- ❌ 禁止 Angular / Firebase / 任意 SDK / HTTP / DB schema。
- ❌ 不直接 new Date()/uuid；統一由 factory 注入。
- ✅ 只輸出 VO/Entity/Policy/Event/Repository 介面給上層；持久化交給 `platform-adapters`。
- ✅ 修改聚合或事件前，先更新 README/AGENTS 與 Mermaid 架構圖。
