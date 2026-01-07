## 概念層
- **Account / Actor**：登入主體 (user|bot)，永遠不是 Organization；透過 Firebase Auth 驗證。
- **Organization / Team**：資源擁有者，決定 Project 權限繼承；Organization 不是 Actor。
- **Workspace (Project/Personal)**：事件與資料的範圍單位；Session 必選一個 Workspace。
- **Module**：功能邊界，狀態由 `modules/{moduleKey}` 控管，負責 gating；Entity 專注資料。
- **Domain Event**：`eventType + aggregateId + scope(workspaceId, organizationId?) + moduleKey + metadata{actorId, causedBy[], traceId}`，所有事件 append-only。
- **Causality/Trace**：使用 `causedBy[]` 與 `traceId` 追蹤因果，投影時以時間/traceId 排序。

### 角色與權限模型
- 成員角色：owner|admin|member|viewer；Team role：maintainer|member。
- Project 權限來源：Organization 角色、Team 權限、直接授權；模組啟用狀態會影響下層 Entity 的操作。
- Security Rules/custom claims 實際映射角色 → ability，UI 只讀取已計算的 permission cache。
