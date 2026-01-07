## 總結層
- Firebase 生態專注：Firestore 文件式設計、Security Rules 為第一層 ACL、Cloud Functions 維護事件與投影。
- Workspace/Module 先驗：所有請求必帶 workspaceId，模組未啟用即拒絕；事件 metadata 必填 `actorId/moduleKey/causedBy/traceId`。
- 反正規化優先：跨專案查詢依靠 collectionGroup + 冗餘欄位；預先配置索引。
- Event Sourcing：`domain_events` append-only，Projector/Read Models 統一由 Functions 更新；重播與追蹤靠 traceId + causalityPath。
- 前端策略：Angular 以 @angular/fire 取得投影資料，權限快取在 Permission Service，UI 僅在已啟用模組內操作。
