# Phase 6: 系統整合與優化

**目標**: 整合所有模組,實現跨模組功能,優化系統性能與用戶體驗

**預估時間**: 7-10 天

**依賴**: Phase 5 完成

---

## 核心概念

### 什麼是系統整合?

將各個獨立模組連接成一個統一、流暢的系統:

```
系統整合
├── 跨模組功能
│   ├── 全域搜尋
│   ├── 通知系統
│   └── 活動追蹤
│
├── 橫切關注點
│   ├── 稽核日誌
│   ├── 權限系統
│   └── 錯誤處理
│
└── 系統優化
    ├── 性能優化
    ├── 離線支援
    └── 可觀測性
```

---

## 階段目標

### 1. 全域搜尋系統

**搜尋範圍**:
```
Global Search
├── 跨模組搜尋
│   ├── Tasks (任務)
│   ├── Documents (文件)
│   ├── Members (成員)
│   └── 未來模組...
│
├── 搜尋層級
│   ├── 當前工作區
│   └── 所有工作區 (若權限允許)
│
└── 搜尋類型
    ├── 快速搜尋 (標題、名稱)
    └── 進階搜尋 (內容、標籤、自訂欄位)
```

**搜尋結果模型**:
```
SearchResult
├── type: 'task' | 'document' | 'member' | ...
├── id: string
├── workspaceId: string
├── title: string
├── description: string
├── highlights: string[] (匹配的文字片段)
├── icon: string
├── url: string (跳轉連結)
├── relevance: number (相關性分數)
├── metadata: Map<string, any>
└── timestamp: Date
```

**搜尋 Store**:
```
SearchStore
├── State
│   ├── query: string
│   ├── results: SearchResult[]
│   ├── filters: SearchFilters
│   ├── loading: boolean
│   └── recentSearches: string[]
│
├── Computed
│   ├── groupedResults (依類型分組)
│   ├── topResults (最相關的 5 個)
│   └── hasResults
│
├── Methods
│   ├── search(query)
│   ├── clearResults()
│   ├── addToHistory(query)
│   └── clearHistory()
│
└── Effects
    ├── performSearch(query)
    ├── loadMore()
    └── trackSearchAnalytics()
```

**實現策略**:
```
Option 1: Client-Side Search (簡單場景)
├── 載入所有資料到本地
├── 使用 Array.filter() 搜尋
└── 限制: 大量資料時慢

Option 2: Firestore Queries (中等場景)
├── 使用 Firestore 查詢
├── where() 條件篩選
└── 限制: 只能搜尋索引欄位

Option 3: Search Service (進階場景)
├── Algolia / Meilisearch / Elasticsearch
├── 全文搜尋
├── 模糊搜尋
├── 即時建議
└── 限制: 額外成本
```

**搜尋 UI**:
```
搜尋介面
├── 頂部搜尋列
│   ├── 搜尋框 (快捷鍵 Ctrl+K)
│   ├── 篩選按鈕
│   └── 進階選項
│
├── 搜尋結果頁
│   ├── 結果統計
│   ├── 篩選側邊欄
│   │   ├── 類型篩選
│   │   ├── 工作區篩選
│   │   ├── 日期範圍
│   │   └── 建立者篩選
│   │
│   └── 結果列表
│       └── [搜尋結果項目]
│           ├── 類型圖示
│           ├── 標題 (高亮匹配)
│           ├── 描述片段
│           ├── 來源 (工作區/路徑)
│           └── 時間戳
│
└── 最近搜尋
    └── 快速重複搜尋
```

---

### 2. 通知系統

**通知類型**:
```
Notification Types
├── 任務相關
│   ├── 被指派任務
│   ├── 任務到期提醒
│   ├── 任務狀態變更
│   └── 任務評論
│
├── 文件相關
│   ├── 文件分享給我
│   ├── 分享文件被編輯
│   └── 文件評論
│
├── 工作區相關
│   ├── 被邀請加入
│   ├── 角色變更
│   ├── 成員加入/離開
│   └── 工作區設定變更
│
└── 系統通知
    ├── 配額警告
    ├── 系統維護
    └── 功能更新
```

**通知模型**:
```
Notification
├── id: string
├── type: NotificationType
├── recipientId: string (收件者)
├── senderId: string (發送者,可選)
├── workspaceId: string (相關工作區)
├── entityType: 'task' | 'document' | 'workspace' | ...
├── entityId: string (相關實體 ID)
├── title: string
├── body: string
├── actionUrl: string (點擊跳轉)
├── priority: 'low' | 'normal' | 'high' | 'urgent'
├── channels: NotificationChannel[]
│   ├── 'in_app' (應用內)
│   ├── 'email' (電子郵件)
│   ├── 'push' (推播,未來)
│   └── 'sms' (簡訊,未來)
├── status: 'unread' | 'read' | 'archived'
├── metadata: Map<string, any>
├── createdAt: Date
├── readAt: Date | null
└── expiresAt: Date | null (過期時間)
```

**Notification Store**:
```
NotificationStore
├── State
│   ├── notifications: Notification[]
│   ├── unreadCount: number
│   ├── loading: boolean
│   └── preferences: NotificationPreferences
│
├── Computed
│   ├── unreadNotifications
│   ├── recentNotifications (最近 10 個)
│   ├── groupedByDate
│   └── hasUnread
│
├── Methods
│   ├── markAsRead(id)
│   ├── markAllAsRead()
│   ├── archive(id)
│   ├── deleteNotification(id)
│   └── updatePreferences(prefs)
│
└── Effects
    ├── loadNotifications()
    ├── subscribeToNotifications()
    ├── sendNotification(notification)
    └── scheduleReminder(task)
```

**通知偏好設定**:
```
NotificationPreferences
├── channels: Map<NotificationType, NotificationChannel[]>
│   └── 例: 'task_assigned' → ['in_app', 'email']
├── emailDigest: 'realtime' | 'daily' | 'weekly' | 'never'
├── quietHours: QuietHours
│   ├── enabled: boolean
│   ├── start: '22:00'
│   └── end: '08:00'
└── doNotDisturb: boolean
```

**通知 UI**:
```
通知中心
├── 頂部列通知圖示
│   ├── 未讀數量徽章
│   └── 點擊開啟面板
│
├── 通知面板
│   ├── 標題列
│   │   ├── "通知"
│   │   ├── 全部已讀
│   │   └── 設定
│   ├── 標籤切換
│   │   ├── 全部
│   │   ├── 未讀
│   │   └── 已封存
│   └── 通知列表
│       └── [通知項目]
│           ├── 發送者頭像
│           ├── 內容
│           ├── 時間
│           ├── 未讀標記
│           └── 操作選單
│
└── 設定頁
    ├── 通知偏好
    ├── 靜音時段
    └── 郵件摘要
```

**Cloud Functions 整合**:
```typescript
// 觸發器範例
export const onTaskAssigned = functions.firestore
  .document('workspaces/{workspaceId}/tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // 檢查 assignedTo 變更
    if (before.assignedTo !== after.assignedTo && after.assignedTo) {
      // 建立通知
      await createNotification({
        type: 'task_assigned',
        recipientId: after.assignedTo,
        senderId: after.updatedBy,
        workspaceId: context.params.workspaceId,
        entityType: 'task',
        entityId: context.params.taskId,
        title: '新任務指派',
        body: `${senderName} 指派任務給您: ${after.title}`,
        actionUrl: `/workspaces/${workspaceId}/tasks/${taskId}`,
        channels: getUserPreferredChannels(after.assignedTo, 'task_assigned'),
      });
    }
  });
```

---

### 3. 活動記錄系統 (Journal)

**活動類型**:
```
Activity Types
├── 任務活動
│   ├── task_created
│   ├── task_updated
│   ├── task_status_changed
│   ├── task_assigned
│   └── task_completed
│
├── 文件活動
│   ├── document_uploaded
│   ├── document_shared
│   ├── document_edited
│   └── document_deleted
│
├── 成員活動
│   ├── member_joined
│   ├── member_left
│   ├── role_changed
│   └── member_invited
│
└── 工作區活動
    ├── workspace_created
    ├── workspace_updated
    └── settings_changed
```

**活動模型**:
```
ActivityEntry
├── id: string
├── workspaceId: string
├── actorId: string (執行者)
├── actorName: string (快照,避免查找)
├── actorAvatar: string
├── activityType: ActivityType
├── entityType: 'task' | 'document' | 'member' | ...
├── entityId: string
├── entityName: string (快照)
├── action: string (動詞: created, updated, deleted...)
├── description: string (人類可讀描述)
├── changes: Change[] (變更詳情)
│   └── { field, oldValue, newValue }
├── metadata: Map<string, any>
├── createdAt: Date
└── ttl: Date (過期時間,自動刪除)
```

**Journal Store**:
```
JournalStore
├── State
│   ├── activities: ActivityEntry[]
│   ├── filters: JournalFilters
│   ├── loading: boolean
│   └── hasMore: boolean
│
├── Computed
│   ├── filteredActivities
│   ├── groupedByDate
│   └── recentActivities (最近 20 個)
│
├── Methods
│   ├── setFilters(filters)
│   ├── loadMore()
│   └── reset()
│
└── Effects
    ├── loadActivities()
    ├── subscribeToActivities()
    └── logActivity(entry)
```

**活動時間軸 UI**:
```
活動記錄頁
├── 篩選工具列
│   ├── 日期範圍
│   ├── 活動類型
│   ├── 執行者
│   └── 實體類型
│
└── 時間軸
    └── [依日期分組]
        ├── 今天
        │   └── [活動項目列表]
        ├── 昨天
        │   └── [活動項目列表]
        └── 本週
            └── [活動項目列表]

活動項目
├── 執行者頭像
├── 描述文字
│   └── "張三 建立任務 #123: 實現搜尋功能"
├── 時間戳 (相對時間)
├── 變更詳情 (可展開)
└── 快速跳轉連結
```

---

### 4. 稽核日誌系統 (Audit Log)

**與 Journal 的差異**:
```
Activity Journal (活動記錄)
├── 目的: 用戶可見的活動流
├── 保留: 短期 (30-90 天)
├── 範圍: 一般業務活動
└── 用途: 團隊協作、追蹤進度

Audit Log (稽核日誌)
├── 目的: 合規、安全、審計
├── 保留: 長期 (1-7 年)
├── 範圍: 敏感操作、權限變更
└── 用途: 調查、合規、安全分析
```

**稽核事件**:
```
Audit Events
├── 身份驗證
│   ├── login_success
│   ├── login_failed
│   ├── logout
│   └── password_changed
│
├── 權限變更
│   ├── role_granted
│   ├── role_revoked
│   ├── permission_added
│   └── permission_removed
│
├── 敏感操作
│   ├── workspace_deleted
│   ├── member_removed
│   ├── data_exported
│   └── settings_changed
│
└── 系統事件
    ├── api_key_created
    ├── integration_configured
    └── backup_performed
```

**稽核日誌模型**:
```
AuditLog
├── id: string
├── timestamp: Date
├── workspaceId: string | null (全域事件可為 null)
├── actorId: string
├── actorType: 'user' | 'system' | 'api'
├── actorIp: string
├── actorUserAgent: string
├── eventType: AuditEventType
├── eventCategory: 'auth' | 'permission' | 'data' | 'system'
├── severity: 'info' | 'warning' | 'critical'
├── resource: Resource
│   ├── type: 'workspace' | 'task' | 'document' | ...
│   ├── id: string
│   └── name: string
├── action: string (performed | attempted | denied)
├── result: 'success' | 'failure'
├── changes: Change[] (變更前後對比)
├── metadata: Map<string, any>
│   ├── requestId
│   ├── sessionId
│   └── additionalContext
└── retentionUntil: Date (保留截止日)
```

**Audit Store**:
```
AuditStore (僅 Admin/Owner 可訪問)
├── State
│   ├── logs: AuditLog[]
│   ├── filters: AuditFilters
│   ├── loading: boolean
│   └── exportInProgress: boolean
│
├── Computed
│   ├── filteredLogs
│   ├── criticalEvents (severity = critical)
│   └── failedAttempts (result = failure)
│
├── Methods
│   ├── setFilters(filters)
│   ├── loadMore()
│   └── exportLogs(format)
│
└── Effects
    ├── loadAuditLogs()
    ├── logAuditEvent(event)
    └── exportToCSV()
```

**稽核日誌 UI** (僅管理員):
```
稽核日誌頁
├── 權限檢查 (只有 Owner/Admin)
├── 進階篩選
│   ├── 日期範圍
│   ├── 事件類別
│   ├── 嚴重程度
│   ├── 執行者
│   ├── 資源類型
│   └── 結果 (成功/失敗)
│
├── 日誌表格
│   ├── 時間戳
│   ├── 執行者
│   ├── 事件類型
│   ├── 資源
│   ├── 動作
│   ├── 結果
│   └── 詳情按鈕
│
└── 匯出功能
    ├── CSV
    ├── JSON
    └── PDF 報告
```

**實現建議**:
```
Cloud Functions 觸發器
├── onCreate/onUpdate/onDelete 觸發器
├── 攔截敏感操作
├── 寫入 auditLogs Collection
└── 可選:同步到外部日誌服務 (Stackdriver)

Collection
/auditLogs/{logId}
└── 使用 TTL 自動過期 (Firestore TTL policy)
```

---

### 5. 錯誤處理與監控

**全域錯誤處理器**:
```
Error Handling Strategy
├── Client-Side
│   ├── ErrorHandler Service
│   ├── HTTP Interceptor
│   └── RxJS catchError
│
├── User Feedback
│   ├── Toast 通知 (一般錯誤)
│   ├── Dialog 對話框 (嚴重錯誤)
│   └── Inline 錯誤訊息 (表單驗證)
│
└── Logging
    ├── Console (開發環境)
    ├── Firebase Analytics (錯誤事件)
    └── Error Reporting Service (正式環境)
```

**錯誤類型**:
```
Error Types
├── NetworkError (網路錯誤)
├── AuthenticationError (身份驗證錯誤)
├── PermissionError (權限錯誤)
├── ValidationError (驗證錯誤)
├── NotFoundError (找不到資源)
├── QuotaExceededError (配額超過)
└── UnknownError (未知錯誤)
```

**錯誤處理 Service**:
```typescript
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  handleError(error: Error, context?: string) {
    // 1. 記錄錯誤
    console.error('Error:', error, 'Context:', context);
    
    // 2. 分類錯誤
    const errorType = this.classifyError(error);
    
    // 3. 用戶反饋
    this.showUserFeedback(errorType, error.message);
    
    // 4. 追蹤錯誤
    this.trackError(error, context);
    
    // 5. 恢復策略
    this.attemptRecovery(errorType);
  }
}
```

**效能監控**:
```
Performance Monitoring
├── Firebase Performance
│   ├── 頁面載入時間
│   ├── API 響應時間
│   └── 自訂追蹤
│
├── Web Vitals
│   ├── LCP (Largest Contentful Paint)
│   ├── FID (First Input Delay)
│   └── CLS (Cumulative Layout Shift)
│
└── 自訂 Metrics
    ├── Store 初始化時間
    ├── Firestore 查詢時間
    └── 元件渲染時間
```

---

### 6. 離線支援

**離線策略**:
```
Offline Support
├── Service Worker
│   ├── 快取靜態資源
│   ├── 快取 API 響應
│   └── 背景同步
│
├── IndexedDB
│   ├── 離線資料快取
│   ├── 待同步佇列
│   └── 衝突解決
│
└── UI 指示
    ├── 離線指示器
    ├── 同步狀態
    └── 衝突警告
```

**離線功能**:
```
Offline Capabilities
├── 可離線檢視
│   ├── 已快取的工作區
│   ├── 已快取的任務
│   └── 已快取的文件列表
│
├── 可離線編輯
│   ├── 建立任務 (佇列)
│   ├── 更新任務 (佇列)
│   └── 標記完成 (佇列)
│
└── 限制
    ├── 無法上傳檔案
    ├── 無法邀請成員
    └── 無法刪除資料
```

**同步佇列**:
```
Sync Queue
├── PendingOperation
│   ├── id: string
│   ├── type: 'create' | 'update' | 'delete'
│   ├── entity: string
│   ├── data: any
│   ├── timestamp: Date
│   └── retryCount: number
│
├── 同步觸發
│   ├── 網路恢復時自動同步
│   ├── 手動同步按鈕
│   └── 定期背景同步
│
└── 衝突處理
    ├── 偵測衝突 (版本號)
    ├── 提示用戶選擇
    └── 合併策略
```

---

### 7. 性能優化清單

**前端優化**:
```
Frontend Optimization
├── Code Splitting
│   ├── Lazy Loading Routes
│   ├── Lazy Loading Modules
│   └── Dynamic Imports
│
├── Bundle Optimization
│   ├── Tree Shaking
│   ├── Minification
│   └── Compression (Gzip/Brotli)
│
├── Rendering Optimization
│   ├── OnPush Change Detection
│   ├── Track By Functions
│   ├── Virtual Scrolling
│   └── Image Lazy Loading
│
├── Memory Optimization
│   ├── 取消訂閱 (takeUntilDestroyed)
│   ├── 清除快取
│   └── 釋放資源
│
└── Network Optimization
    ├── HTTP/2
    ├── CDN
    ├── Resource Hints (preload, prefetch)
    └── Service Worker Caching
```

**後端優化**:
```
Backend Optimization
├── Firestore
│   ├── 複合索引優化
│   ├── 查詢限制 (limit)
│   ├── 分頁查詢
│   └── 避免 N+1 查詢
│
├── Storage
│   ├── CDN 配送
│   ├── 圖片壓縮
│   └── 縮圖生成
│
└── Cloud Functions
    ├── 冷啟動優化
    ├── 記憶體配置
    └── Timeout 設定
```

---

### 8. 可觀測性

**監控面板**:
```
Observability Dashboard
├── 系統健康
│   ├── 服務可用性
│   ├── 錯誤率
│   └── 響應時間
│
├── 使用統計
│   ├── 活躍用戶
│   ├── 工作區數量
│   ├── 任務/文件統計
│   └── 儲存空間使用
│
├── 性能指標
│   ├── 平均頁面載入時間
│   ├── API 響應時間
│   └── Firestore 查詢時間
│
└── 警報設定
    ├── 錯誤率過高
    ├── 響應時間過慢
    └── 配額接近上限
```

**日誌整合**:
```
Logging Integration
├── 前端日誌
│   ├── Console Logs (開發)
│   └── Firebase Analytics (正式)
│
├── 後端日誌
│   ├── Cloud Functions Logs
│   └── Firestore Audit Logs
│
└── 第三方服務
    ├── Sentry (錯誤追蹤)
    ├── LogRocket (Session Replay)
    └── Google Analytics (使用分析)
```

---

## 開發步驟建議

### Step 1: 全域搜尋
- Search Store 實現
- 搜尋 UI 元件
- 整合各模組搜尋

### Step 2: 通知系統
- Notification Store
- 通知 UI
- Cloud Functions 觸發器
- 郵件通知整合

### Step 3: 活動記錄
- Journal Store
- 活動時間軸 UI
- 自動記錄觸發器

### Step 4: 稽核日誌
- Audit Log Store
- 稽核日誌 UI (管理員)
- 敏感操作攔截

### Step 5: 錯誤處理
- 全域錯誤處理器
- 用戶反饋機制
- 錯誤追蹤整合

### Step 6: 離線支援
- Service Worker 配置
- 同步佇列實現
- 離線 UI 指示

### Step 7: 性能優化
- Code Splitting
- Bundle 優化
- Rendering 優化

### Step 8: 監控與日誌
- Firebase Performance
- Analytics 整合
- 監控面板

---

## 成功標準

### 功能完整性
✅ 全域搜尋正常運作  
✅ 通知系統完整  
✅ 活動記錄準確  
✅ 稽核日誌安全  
✅ 錯誤處理完善  
✅ 離線支援可用  

### 性能指標
✅ 首次載入 < 3s  
✅ 路由切換 < 300ms  
✅ 搜尋響應 < 500ms  
✅ 通知延遲 < 2s  
✅ Lighthouse 分數 > 90  

### 可靠性
✅ 錯誤率 < 0.1%  
✅ 可用性 > 99.9%  
✅ 離線模式穩定  
✅ 資料同步正確  

---

## 下一階段預告

**Phase 7**: 進階功能與擴展

下一階段將實現:
- 更多功能模組 (日曆、聊天、看板...)
- 第三方整合 (Google Drive, Slack...)
- API 與 Webhook
- 自訂欄位與工作流
- 行動應用支援
- 企業功能 (SSO, SAML...)
