## Event Flow Overview
```mermaid
%% Event Flow + Event Sourcing + Causality Tracking with Causality Links
flowchart TD
    %% 層級節點
    subgraph Identity["Identity Layer"]
        A[Account]
    end

    subgraph WorkspaceLayer["Workspace Layer"]
        B[Workspace]
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

    %% 核心流程
    A --> B
    B --> C
    C --> D
    D --> E1
    E1 --> E2
    E2 --> E3
    E3 --> F
    F --> G

    %% Event 延伸處理箭頭
    E1 -.-> F
    E2 -.-> F
    E3 -.-> F
    E1 -.-> G
    E2 -.-> G
    E3 -.-> G

    %% 因果鏈示意（Causality Tracking）
    E1 ==> E2
    E2 ==> E3

    %% 节点样式
    style A fill:#ffe0b2,stroke:#fb8c00,stroke-width:2px
    style B fill:#fff59d,stroke:#fbc02d,stroke-width:2px
    style C fill:#b2dfdb,stroke:#00796b,stroke-width:2px
    style D fill:#80cbc4,stroke:#004d40,stroke-width:2px
    style E1 fill:#ffccbc,stroke:#d84315,stroke-width:2px
    style E2 fill:#ffab91,stroke:#d84315,stroke-width:2px
    style E3 fill:#ff8a65,stroke:#d84315,stroke-width:2px
    style F fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style G fill:#bbdefb,stroke:#1565c0,stroke-width:2px
```

## Workspace Model & Permission APIs
- `workspaceId` 與 `workspaceType`：`organization | project | personal`
- 成員角色：`owner | admin | member | viewer`，用於權限界定。
- 可用模組列表需記錄 `moduleKey`、啟用狀態、模組類型。
- 權限檢查 API：`assertWorkspaceAccess(accountId, workspaceId, requiredRole)`、`assertModuleEnabled(workspaceId, moduleKey)`。

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

## Account Context & Authentication Flow
- `accountId` + `accountType (user | organization | bot)` 定義 Actor。
- Actor 與 Workspace 需透過 membership 連結；登入後可檢查所屬 Workspace 權限。
- 登入/驗證流程需串接 Workspace / Module 的權限檢查。

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
    Mod-->>Auth: module enabled/disabled
    Auth-->>Actor: session/accessToken
```

## Module Lifecycle & Enablement
- 每個模組記錄 `moduleKey`、`moduleType` 與所屬 Workspace。
- 模組狀態：啟用 / 停用；需透過 `assertModuleEnabled()` 進行權限檢查。
- 啟用/停用應保留審計事件以供後續追蹤。

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

// END OF FILE
