## 層級導讀（Firebase 版本）
- 架構層：docs/Mermaid-架構層.md
- 基礎設施層：docs/Mermaid-基礎設施層.md
- 概念層：docs/Mermaid-概念層.md
- 實作指引：docs/Mermaid-實作指引.md
- 模組層：docs/Mermaid-模組層.md
- 總結層：docs/Mermaid-總結層.md

## Event Flow Overview
```mermaid
flowchart TD
    subgraph Identity["Identity Layer"]
        A1[User]
        A2[Organization]
        A3[Bot]
    end
    subgraph WorkspaceLayer["Workspace Layer"]
        B[Workspace\ntype: org|project|personal]
        M1[Members\nroles: owner/admin/member/viewer]
        M2[Modules\nmoduleKey/type/enabled]
    end
    subgraph Domain["Domain Layer"]
        C[Module]
        D[Entity]
    end
    subgraph EventLayer["Event Layer"]
        E1[Event 1]
        E2[Event 2]
        E3[Event 3]
    end
    subgraph Processing["Processing Layer"]
        F[Event Sourcing]
        G[Causality Tracking]
    end
    A1 --> B
    A2 --> B
    A3 --> B
    B --> M1
    B --> M2
    B --> C --> D --> E1 --> E2 --> E3 --> F --> G
    E1 -.-> F
    E2 -.-> F
    E3 -.-> F
    E1 -.-> G
    E2 -.-> G
    E3 -.-> G
    E1 ==> E2
    E2 ==> E3
    classDef note fill:#eef5ff,stroke:#4c6fff,stroke-width:1px,color:#1a2b5f;
    NF["Event note: DomainEvent<T> carries workspaceId, moduleKey, actorId, causedBy/traceId, timestamp, payload"]:::note
    NF -.-> E1
```

## Workspace / Account / Module Core
- Workspace=容器；Organization=Workspace；User/Bot=Actor (`workspaceType`: organization|project|personal).
- `accountType`: user|bot|organization；Actor ≠ Workspace，ACL 分層。
- 成員角色：owner|admin|member|viewer；模組列表含 moduleKey/moduleType/enabled。
- ACL：`assertWorkspaceAccess(accountId, workspaceId, requiredRole)`、`assertModuleEnabled(workspaceId, moduleKey)`；Entity 只記錄狀態。

```mermaid
classDiagram
    class Workspace {
      workspaceId: UUID
      workspaceType: organization|project|personal
      modules: ModuleStatus[]
      assertWorkspaceAccess(accountId, requiredRole)
    }
    class Member {
      accountId: UUID
      accountType: user|organization|bot
      role: owner|admin|member|viewer
    }
    class ModuleStatus {
      moduleKey: string
      moduleType: core|addon|beta
      enabled: boolean
      assertModuleEnabled(moduleKey)
    }
    Workspace "1" o-- "*" Member : members
    Workspace "1" o-- "*" ModuleStatus : modules
```

## Auth Chain & Session (Angular)
- 登入鏈：`@angular/fire/auth → @delon/auth → DA_SERVICE_TOKEN → @delon/acl`。
- 多 Workspace：登入後列 memberships → 選 Workspace → 進入 Module/Entity；所有事件綁 `workspaceId`。

```mermaid
sequenceDiagram
    participant Actor as Actor(accountId/accountType)
    participant Auth as AuthService
    participant WS as Workspace
    participant Mod as Module
    Actor->>Auth: signIn(credentials)
    Auth->>WS: lookupMembership(accountId, workspaceId)
    WS-->>Auth: assertWorkspaceAccess()
    Auth->>Mod: assertModuleEnabled(moduleKey)
    Mod-->>Auth: enabled/disabled
    Auth-->>Actor: session (Workspace scoped)
```

## Module Boundary & Permissions
- Module = 功能邊界；先 `assertModuleEnabled()` 再操作 Entity。
- Entity = 資料單位；不處理 ACL，只記錄狀態與事件。

```mermaid
stateDiagram-v2
    [*] --> Disabled
    Disabled --> Enabled: enable(workspaceId, moduleKey)
    Enabled --> Disabled: disable(workspaceId, moduleKey)
    state Enabled {
        [*] --> Active
        Active --> Active: assertModuleEnabled(moduleKey)
    }
```

## Event Sourcing & Causality
- Event 型態：`eventType, aggregateId, workspaceId, payload, metadata{actorId, causedBy, traceId, timestamp, moduleKey}`。
- 重播前驗證 Workspace/Module 啟用；Event 對應 Entity 變更，因果鏈靠 `causedBy/traceId`。

## Divergence Watchlist
1) Workspace=Organization；Actor 不是 Workspace。
2) AccountType：User/Bot=Actor；Organization=Workspace。
3) Module 控功能，Entity 控資料，ACL 在 Workspace/Module。
4) Event 對應 Entity 變更；因果以 `causedBy/traceId` 追蹤。
5) 多 Workspace：Session 必選 Workspace，事件/資料綁 `workspaceId`。

## Packages Directory Tree
- packages 目錄下主要子資料夾概覽。
- 平台 SDK 入口集中在 `platform-adapters/src/external-apis/google/genai/`。
- 為避免分歧，標出各套件實際存在的 src 目錄。

```mermaid
flowchart TD
    packages["packages/"]
    packages --> acc["account-domain/"]
    packages --> core["core-engine/"]
    packages --> adapters["platform-adapters/"]
    packages --> saas["saas-domain/"]
    packages --> ui["ui-angular/"]
    acc --> accSrc["src/ (existing)"]
    core --> coreSrc["src/ (existing)"]
    adapters --> adaptersSrc["src/ (existing)"]
    adaptersSrc --> adaptersExternal["external-apis/"]
    adaptersExternal --> adaptersGoogle["google/"]
    adaptersGoogle --> adaptersGenai["genai/"]
    adaptersGenai --> genaiSrc["src/ (placeholder)"]
    saas --> saasSrc["src/ (existing)"]
    ui --> uiSrc["src/ (existing)"]
```

// END OF FILE

## Readiness Assessment
- Packages already mirror the planned layers (`core-engine`, `saas-domain`, `platform-adapters`, `ui-angular`); added `account-domain` scaffolding so identity/workspace roles can live separately from SaaS entities.
- Event metadata in the plan (workspaceId, moduleKey, actorId, causedBy/traceId) should be enforced at the aggregate boundary; core-engine remains the right place for shared `DomainEvent` and causality helpers.
- Workspace ACL and module gating should be asserted before domain actions; adapters must inject session-selected `workspaceId` to every event/command and reject when a module is disabled.
- Session flow needs a workspace switcher in UI plus query adapters that filter by `workspaceId`; platform adapters should expose a single entry point that already validates membership.
- Technical SDK work stays inside platform-adapters; Google AI calls live in `src/external-apis/google/genai/` to keep adapters consistent and isolated from domain code.

### Immediate Next Steps (pre-work)
- Flesh out `account-domain` aggregates/events for workspace, membership, and module registry so ACL checks occur before SaaS entities mutate.
- Define a shared `DomainEvent<T>` shape in `core-engine` that includes workspace/module/actor metadata and trace ids; ensure replay guards module enablement.
- Provide Angular-side services (ui-angular) that cache memberships and enforce `assertWorkspaceAccess` + `assertModuleEnabled` before navigation.
- Hook platform adapter implementations (firebase-admin/angular-fire) to stamp causality metadata automatically when emitting events.
