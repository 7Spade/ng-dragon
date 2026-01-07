<!-- 用途：紀錄 Firebase 基礎設施（Firestore/Rules）設計的 Mermaid 摘要。 -->

## 基礎設施層（Firebase）

### Firestore 佈局
- Root collections：`accounts/`、`organizations/`、`projects/`、`domain_events/`。
- 子集合：`organizations/{orgId}/members|teams|projects`，`projects/{projectId}/modules|permissions|events|tasks|issues|expenses`，`domain_events/{eventId}/causality`。
- 文件冗餘 `organizationId/projectId` 以利 Rules/索引判斷；跨專案查詢透過 collectionGroup。

### Security Rules
- 以 `request.auth.uid` 與 custom claims (roles/workspaceId) 驗證讀寫；禁止前端寫入 `domain_events`，僅允許讀 projection。
- Module 狀態文件需檢查 `enabled==true` 才允許下層讀寫；所有敏感欄位以 `allow read: if hasProjectPermission(projectId,'read')` 為基礎。

### 雲端元件
- **Cloud Functions**：
  - `onCall`：workspace 切換/permission 計算。
  - `onCreate(domain_events)`：預計算 causalityPath、觸發 projector 更新 read model。
  - `onWrite(projects/*/modules/*)`：同步 module enable/disable 至 custom claims。
- **Hosting**：Angular 前端透過 Firebase Hosting / App Hosting；HTTP APIs 走 Callable Functions 或後端服務。

### 效能與可靠度
- 批次寫入：BulkWriter 或 `writeBatch`，單批 <= 500；高流量以佇列/重試策略控制速率。
- 索引：預先建立複合索引（如 organizationId+status），避免在生產期觸發自動索引要求。
- 熱點避免：將事件 key 包含時間戳隨機片段，或使用 `traceId + sequence` 作排序欄位。
