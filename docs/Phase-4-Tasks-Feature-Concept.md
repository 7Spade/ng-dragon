# Phase 4: Feature Store - 任務模組 (Tasks Module)

**目標**: 實現第一個功能模組,建立 FeatureStore 模式範本

**預估時間**: 5-6 天

**依賴**: Phase 3 完成

---

## 核心概念

### 什麼是 Feature Store?

Feature Store 負責管理特定功能模組的業務邏輯與狀態:

```
TasksFeatureStore (範例)
├── 任務列表資料
├── 當前選中任務
├── 篩選條件
├── 排序設定
├── 分頁狀態
└── 載入與錯誤狀態
```

### Feature Store 的定位

```
層級關係
GlobalShell (全域)
    ↓
WorkspaceListStore (工作區列表)
    ↓
WorkspaceStore (當前工作區)
    ↓
TasksFeatureStore (任務模組)  ← 本階段
    ↓
TaskEntityStore (任務實體快取) ← Phase 5
```

---

## 階段目標

### 1. 任務資料模型

**Task 實體**:
```
Task
├── 識別資訊
│   ├── id: 唯一識別碼
│   ├── workspaceId: 所屬工作區
│   ├── number: 任務編號 (自動遞增)
│   └── type: 任務類型
│
├── 基本資訊
│   ├── title: 標題
│   ├── description: 詳細描述
│   ├── status: 狀態
│   ├── priority: 優先級
│   └── labels: 標籤陣列
│
├── 時間資訊
│   ├── createdAt: 建立時間
│   ├── updatedAt: 更新時間
│   ├── dueDate: 截止日期 (可選)
│   ├── startDate: 開始日期 (可選)
│   └── completedAt: 完成時間 (可選)
│
├── 關聯資訊
│   ├── createdBy: 建立者 ID
│   ├── assignedTo: 指派給 (可選)
│   ├── parentTaskId: 父任務 ID (子任務用)
│   └── relatedTasks: 相關任務 IDs
│
└── 進階資訊
    ├── estimatedHours: 預估工時
    ├── actualHours: 實際工時
    ├── attachments: 附件列表
    └── customFields: 自訂欄位
```

**任務狀態流**:
```
TaskStatus
├── todo: 待辦 (初始狀態)
├── in_progress: 進行中
├── in_review: 審核中
├── completed: 已完成
├── cancelled: 已取消
└── blocked: 已阻擋
```

**優先級**:
```
TaskPriority
├── critical: 緊急
├── high: 高
├── medium: 中 (預設)
├── low: 低
└── none: 無
```

---

### 2. Tasks Feature Store 架構

**State**:
```
TasksFeatureState
├── tasks: Task[] - 任務列表
├── selectedTaskId: string | null - 選中的任務
├── filters: TaskFilters - 篩選條件
│   ├── status: TaskStatus[]
│   ├── priority: TaskPriority[]
│   ├── assignedTo: string[]
│   ├── labels: string[]
│   ├── dueDateRange: DateRange
│   └── searchQuery: string
├── sorting: TaskSorting - 排序設定
│   ├── field: SortField
│   └── direction: 'asc' | 'desc'
├── pagination: Pagination - 分頁
│   ├── page: number
│   ├── pageSize: number
│   └── total: number
├── viewMode: 'list' | 'board' | 'calendar'
├── loading: boolean
├── error: string | null
└── lastSync: Date | null
```

**Computed**:
```
Computed Signals
├── filteredTasks - 根據 filters 過濾
├── sortedTasks - 根據 sorting 排序
├── paginatedTasks - 根據 pagination 分頁
├── selectedTask - 根據 selectedTaskId 查找
├── taskCount - 任務總數
├── completedCount - 已完成數量
├── inProgressCount - 進行中數量
├── overdueTasks - 逾期任務
├── todayTasks - 今日到期任務
├── hasSelection - 是否有選中任務
├── canCreateTask - 權限檢查
└── groupedTasks - 依狀態分組 (for board view)
```

**Methods**:
```
State Mutations
├── setTasks(tasks) - 設定任務列表
├── addTask(task) - 新增任務
├── updateTask(id, updates) - 更新任務
├── deleteTask(id) - 刪除任務
├── selectTask(id) - 選中任務
├── clearSelection() - 清除選擇
├── setFilters(filters) - 設定篩選
├── setSorting(sorting) - 設定排序
├── setPagination(page, pageSize) - 設定分頁
├── setViewMode(mode) - 設定檢視模式
├── resetFilters() - 重置篩選
└── reset() - 重置所有狀態
```

**Effects**:
```
Async Operations
├── loadTasks() - 載入任務列表
├── subscribeToTasks() - 即時同步任務
├── createTask(data) - 建立新任務
├── updateTaskStatus(id, status) - 更新狀態
├── assignTask(id, userId) - 指派任務
├── deleteTaskPermanently(id) - 永久刪除
├── duplicateTask(id) - 複製任務
├── batchUpdateTasks(ids, updates) - 批次更新
└── onWorkspaceChange() - 工作區切換處理
```

---

### 3. 任務 CRUD 操作

**建立任務**:
```
流程
1. 驗證權限 (canCreateTask)
    ↓
2. 驗證資料 (必填欄位)
    ↓
3. 生成任務編號 (自動遞增)
    ↓
4. 寫入 Firestore
   /workspaces/{workspaceId}/tasks/{taskId}
    ↓
5. 樂觀更新 (Optimistic Update)
   立即更新本地 Store
    ↓
6. 等待 Firestore 確認
   成功 → 保持更新
   失敗 → 回滾並顯示錯誤
```

**更新任務**:
```
流程
1. 驗證權限 (canEditTask)
    ↓
2. 樂觀更新本地狀態
    ↓
3. 寫入 Firestore (partial update)
    ↓
4. 處理結果
   成功 → 完成
   失敗 → 回滾
```

**刪除任務**:
```
選項
├── 軟刪除 (推薦)
│   ├── 設定 status = 'deleted'
│   └── 可恢復
└── 硬刪除
    ├── 永久移除文檔
    └── 不可恢復

流程
1. 確認對話框
    ↓
2. 驗證權限
    ↓
3. 檢查子任務 (如有)
    ↓
4. 執行刪除
    ↓
5. 更新本地狀態
```

---

### 4. 任務篩選與排序

**篩選器設計**:
```
TaskFilters
├── status: TaskStatus[] (多選)
│   └── 空陣列 = 顯示所有
├── priority: TaskPriority[] (多選)
├── assignedTo: string[] (多選用戶)
│   ├── 'me' - 指派給我
│   ├── 'unassigned' - 未指派
│   └── [userId] - 特定用戶
├── labels: string[] (多選標籤)
├── dueDateRange: DateRange
│   ├── start: Date
│   └── end: Date
├── searchQuery: string
│   └── 搜尋標題與描述
└── customFilters: Map<string, any>
```

**排序選項**:
```
SortField
├── createdAt - 建立時間
├── updatedAt - 更新時間
├── dueDate - 截止日期
├── priority - 優先級
├── status - 狀態
├── number - 任務編號
└── title - 標題 (字母順序)

SortDirection
├── asc - 升序
└── desc - 降序
```

**複合篩選邏輯**:
```
filtered = tasks
  .filter by status (if filters.status.length > 0)
  .filter by priority (if filters.priority.length > 0)
  .filter by assignedTo (if filters.assignedTo.length > 0)
  .filter by labels (if filters.labels.length > 0)
  .filter by dueDateRange (if filters.dueDateRange set)
  .filter by searchQuery (if filters.searchQuery not empty)
```

---

### 5. 檢視模式

**列表檢視 (List View)**:
```
功能
├── 表格式顯示
├── 多欄排序
├── 行內編輯
├── 批次選擇
├── 快速篩選
└── 匯出功能
```

**看板檢視 (Board View)**:
```
功能
├── 依狀態分欄
│   ├── Todo
│   ├── In Progress
│   ├── In Review
│   └── Completed
├── 拖放排序
├── 拖放變更狀態
├── 欄位摺疊
└── 卡片預覽
```

**日曆檢視 (Calendar View)**:
```
功能
├── 月/週/日 檢視
├── 依到期日顯示
├── 拖放改期
├── 色彩標示優先級
└── 快速建立
```

---

### 6. 子任務支援

**子任務結構**:
```
Task (Parent)
└── subtasks: Task[] (Children)
    ├── parentTaskId: parent.id
    ├── 繼承部分屬性 (workspaceId, labels)
    └── 獨立狀態管理
```

**父任務狀態計算**:
```
Parent Task Progress
├── totalSubtasks: 子任務總數
├── completedSubtasks: 已完成子任務數
├── progress: completedSubtasks / totalSubtasks * 100
└── autoComplete: 所有子任務完成時自動完成父任務 (可選)
```

**UI 展示**:
```
父任務列表項
├── 標題
├── 進度條 (基於子任務完成度)
├── 展開/收合按鈕
└── 子任務列表 (縮排顯示)
```

---

## Firestore 資料結構

### Collection 設計

```
/workspaces/{workspaceId}/tasks/{taskId}
├── id: string (自動生成)
├── workspaceId: string (冗餘,方便查詢)
├── number: number (工作區內唯一,自動遞增)
├── type: string
├── title: string
├── description: string
├── status: string
├── priority: string
├── labels: string[]
├── createdAt: Timestamp
├── updatedAt: Timestamp
├── dueDate: Timestamp | null
├── startDate: Timestamp | null
├── completedAt: Timestamp | null
├── createdBy: string
├── assignedTo: string | null
├── parentTaskId: string | null
├── relatedTasks: string[]
├── estimatedHours: number | null
├── actualHours: number | null
├── attachments: Attachment[]
└── customFields: Map<string, any>
```

### 查詢索引

**必要索引**:
```
Collection: tasks (CollectionGroup)
├── workspaceId + status + dueDate (複合)
├── workspaceId + assignedTo + status (複合)
├── workspaceId + createdAt (複合,降序)
├── workspaceId + updatedAt (複合,降序)
└── workspaceId + priority + status (複合)
```

### 任務編號生成

**方案 1: Firestore Counter Document**
```
/workspaces/{workspaceId}/counters/tasks
└── nextNumber: number

建立任務時:
1. Transaction 讀取 nextNumber
2. 遞增 nextNumber
3. 使用該數字作為 task.number
```

**方案 2: Cloud Function**
```
onCreate Trigger
├── 自動分配編號
└── 更新任務文檔
```

---

## UI 元件架構

### 1. 任務列表頁

**佈局**:
```
任務頁面
├── 頂部工具列
│   ├── 檢視模式切換
│   ├── 篩選按鈕
│   ├── 排序選單
│   ├── 搜尋框
│   └── 建立任務按鈕
│
├── 側邊篩選面板 (可選)
│   ├── 狀態篩選
│   ├── 優先級篩選
│   ├── 指派者篩選
│   ├── 標籤篩選
│   └── 日期範圍
│
├── 主要內容區
│   └── 任務列表/看板/日曆
│
└── 底部分頁控制
```

### 2. 任務列表元件 (List View)

**表格欄位**:
```
欄位
├── 選擇框 (批次操作)
├── 任務編號 (#123)
├── 標題 (可點擊開啟詳情)
├── 狀態標籤
├── 優先級圖示
├── 指派者頭像
├── 標籤列表
├── 到期日 (帶警告色)
└── 操作選單
    ├── 編輯
    ├── 變更狀態
    ├── 指派
    ├── 複製
    └── 刪除
```

### 3. 任務看板元件 (Board View)

**欄位結構**:
```
看板
├── Todo 欄
│   └── [任務卡片列表]
├── In Progress 欄
│   └── [任務卡片列表]
├── In Review 欄
│   └── [任務卡片列表]
└── Completed 欄
    └── [任務卡片列表]

任務卡片
├── 標題
├── 編號
├── 優先級標示
├── 指派者頭像
├── 到期日
└── 標籤
```

**拖放功能**:
- 使用 Angular CDK Drag & Drop
- 拖動改變狀態
- 拖動改變排序

### 4. 任務詳情對話框/側欄

**內容區塊**:
```
任務詳情
├── 標題編輯器
├── 狀態選擇器
├── 優先級選擇器
├── 指派選擇器
├── 日期選擇器 (開始/到期)
├── 描述編輯器 (富文本)
├── 標籤管理
├── 附件上傳區
├── 子任務列表
├── 評論區
├── 活動歷史
└── 操作按鈕
    ├── 儲存
    ├── 刪除
    └── 關閉
```

### 5. 建立任務表單

**簡化版 (快速建立)**:
```
快速建立
├── 標題 (必填)
├── 狀態 (預設 todo)
├── 優先級 (預設 medium)
└── 建立按鈕
```

**完整版**:
```
完整建立
├── 所有欄位
├── 預覽區
└── 建立並繼續 / 建立並關閉
```

---

## 權限整合

### 任務權限檢查

```
Task Permissions (基於 Workspace 角色)
├── canViewTasks
│   └── All roles
├── canCreateTask
│   └── Member, Admin, Owner
├── canEditTask
│   ├── Task creator
│   ├── Assigned user
│   └── Admin, Owner
├── canDeleteTask
│   ├── Task creator
│   └── Admin, Owner
├── canAssignTask
│   └── Member, Admin, Owner
└── canCommentTask
    └── All roles (若有檢視權限)
```

### 實現方式

```typescript
// 在 WorkspaceStore 擴展
workspaceStore.currentUserPermissions.tasks = computed(() => {
  const role = workspaceStore.currentUserRole();
  const userId = globalShell.authUser()?.uid;
  
  return {
    canView: true,
    canCreate: ['Member', 'Admin', 'Owner'].includes(role),
    canEdit: (task: Task) => 
      task.createdBy === userId || 
      task.assignedTo === userId ||
      ['Admin', 'Owner'].includes(role),
    canDelete: (task: Task) => 
      task.createdBy === userId ||
      ['Admin', 'Owner'].includes(role),
    canAssign: ['Member', 'Admin', 'Owner'].includes(role),
  };
});
```

---

## 樂觀更新模式

### 實現流程

```
樂觀更新
1. 立即更新 Store 狀態
   patchState(store, { tasks: updatedTasks })
    ↓
2. UI 立即反映變化 (無延遲)
    ↓
3. 背景執行 Firestore 寫入
    ↓
4. 處理結果
   ├── 成功 → 完成
   └── 失敗 → 回滾 + 顯示錯誤
```

### 回滾機制

```typescript
// 保存原始狀態
const originalTasks = store.tasks();

// 樂觀更新
patchState(store, { tasks: updatedTasks });

// 執行 Firestore 操作
try {
  await updateFirestore(updates);
} catch (error) {
  // 失敗時回滾
  patchState(store, { tasks: originalTasks, error: error.message });
}
```

---

## 即時同步策略

### Firestore Listeners

```typescript
subscribeToTasks: rxMethod<string>(
  pipe(
    switchMap((workspaceId) =>
      collectionData(
        query(
          collection(firestore, `workspaces/${workspaceId}/tasks`),
          where('status', '!=', 'deleted'),
          orderBy('updatedAt', 'desc')
        ),
        { idField: 'id' }
      ).pipe(
        tap((tasks) => {
          patchState(store, { 
            tasks, 
            lastSync: new Date() 
          });
        }),
        catchError((error) => {
          console.error('Tasks sync error:', error);
          return of([]);
        })
      )
    )
  )
)
```

### 衝突解決

**Last Write Wins** (預設):
- Firestore 自動處理
- 最後寫入的勝出

**Optimistic Concurrency Control** (進階):
- 使用版本號或時間戳
- 檢測衝突並警告用戶

---

## 性能優化

### 分頁載入

```
策略
├── 初次載入: 20 筆
├── 滾動載入: 每次 20 筆
├── 最大快取: 100 筆
└── 超過則清除最舊的
```

### 查詢優化

```
最佳實踐
├── 使用複合索引
├── 限制查詢結果數量
├── 避免 != 查詢 (改用 in)
└── 快取常用查詢結果
```

### 虛擬滾動

**大量任務時** (> 50):
- 使用 CDK Virtual Scroll
- 只渲染可見項目
- 減少 DOM 節點

---

## 測試策略

### Store 測試

```
測試項目
├── CRUD 操作正確性
├── 篩選邏輯正確性
├── 排序邏輯正確性
├── 分頁計算正確性
├── 樂觀更新與回滾
└── 工作區切換重置
```

### 元件測試

```
測試項目
├── 任務列表渲染
├── 看板拖放功能
├── 篩選器互動
├── 表單驗證
└── 權限顯示/隱藏
```

---

## 開發步驟建議

### Step 1: 資料模型與 Firestore
- 定義 Task 介面
- 建立 Firestore Collection
- 設定索引
- 實現編號生成

### Step 2: TasksFeatureStore
- State 定義
- Computed 實現
- Methods 實現
- Effects 實現

### Step 3: 列表檢視 UI
- 列表元件
- 篩選器
- 排序控制

### Step 4: 建立/編輯功能
- 建立表單
- 詳情對話框
- CRUD 操作

### Step 5: 看板檢視
- 看板佈局
- 拖放功能
- 狀態同步

### Step 6: 進階功能
- 子任務
- 批次操作
- 匯出功能

### Step 7: 測試與優化
- 單元測試
- 效能優化
- 使用者測試

---

## 成功標準

### 功能完整性
✅ 任務 CRUD 完整  
✅ 篩選排序正常  
✅ 多檢視模式運作  
✅ 即時同步正常  
✅ 權限控制正確  

### 性能
✅ 列表載入 < 500ms  
✅ 狀態變更 < 200ms  
✅ 大量任務仍流暢  

### 用戶體驗
✅ 樂觀更新流暢  
✅ 錯誤處理友善  
✅ 介面直覺易用  

---

## 下一階段預告

**Phase 5**: Entity Store 與進階模組

下一階段將實現:
- Entity Store 標準化快取
- Documents 文件模組
- 跨模組功能整合
- 搜尋與全域功能
