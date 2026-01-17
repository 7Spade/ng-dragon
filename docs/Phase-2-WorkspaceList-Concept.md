# Phase 2: WorkspaceList Store - 工作區列表管理

**目標**: 實現多工作區管理,讓用戶可以查看、切換、建立工作區

**預估時間**: 3-4 天

**依賴**: Phase 1 完成

---

## 核心概念

### 什麼是 WorkspaceList?

WorkspaceList 是用戶所有工作區的集合與管理中心:

```
WorkspaceList
├── 我擁有的工作區 (Owner)
├── 我加入的工作區 (Member)
├── 最近使用的工作區
├── 我的最愛工作區
└── 當前選中的工作區
```

### 為什麼需要 WorkspaceList?

1. **多工作區支援**: 用戶可能同時參與多個專案/團隊
2. **快速切換**: 在不同工作區間快速切換
3. **權限區分**: 不同工作區有不同角色與權限
4. **資料隔離**: 每個工作區的資料完全獨立

---

## 階段目標

### 1. 工作區集合管理

**要實現的功能**:
- 載入用戶所有工作區
- 即時同步工作區變更
- 工作區分類 (擁有 vs 加入)
- 工作區快取機制

**資料來源**:
```
Firestore 資料結構
/workspaces/{workspaceId}
    ├── 工作區基本資料
    
/memberships/{membershipId}
    ├── accountId: 用戶 ID
    ├── workspaceId: 工作區 ID
    ├── role: 角色 (Owner | Admin | Member | Guest)
    ├── status: 狀態 (Active | Invited | Suspended)
    ├── joinedAt: 加入時間
    └── lastAccessedAt: 最後訪問時間
```

**狀態管理**:
- workspaces: 所有工作區的陣列
- currentWorkspaceId: 當前選中的工作區 ID
- loading: 是否正在載入
- error: 錯誤訊息

**派生狀態**:
- ownedWorkspaces: 我擁有的工作區 (role = Owner)
- memberWorkspaces: 我加入的工作區 (role ≠ Owner)
- recentWorkspaces: 最近使用的 5 個工作區
- currentWorkspace: 當前工作區的詳細資料
- hasWorkspaces: 是否至少有一個工作區

---

### 2. 工作區成員關係

**Membership 概念**:

```
Membership = 用戶 ↔ 工作區的關聯
├── accountId: 哪個用戶
├── workspaceId: 哪個工作區
├── role: 扮演什麼角色
│   ├── Owner: 擁有者 (最高權限)
│   ├── Admin: 管理員 (管理權限)
│   ├── Member: 成員 (一般權限)
│   └── Guest: 訪客 (唯讀權限)
├── status: 當前狀態
│   ├── Active: 已啟用
│   ├── Invited: 已邀請(未接受)
│   ├── Suspended: 已暫停
│   └── Archived: 已封存
├── permissions: 特定權限覆寫 (選填)
├── joinedAt: 加入時間
└── lastAccessedAt: 最後訪問時間
```

**角色權限矩陣**:
```
                Owner   Admin   Member  Guest
建立工作區        ✓       ✗       ✗       ✗
刪除工作區        ✓       ✗       ✗       ✗
邀請成員          ✓       ✓       ✗       ✗
移除成員          ✓       ✓       ✗       ✗
編輯設定          ✓       ✓       ✗       ✗
建立內容          ✓       ✓       ✓       ✗
編輯內容          ✓       ✓       ✓       ✗
查看內容          ✓       ✓       ✓       ✓
```

---

### 3. 工作區切換機制

**切換流程**:
```
用戶選擇工作區
↓
WorkspaceListStore.selectWorkspace(workspaceId)
↓
更新 currentWorkspaceId
↓
觸發 WorkspaceStore 載入該工作區詳情
↓
更新 lastAccessedAt 到 Firestore
↓
路由導航到工作區首頁
```

**狀態同步**:
```
WorkspaceListStore (工作區列表)
        ↓ 提供 currentWorkspaceId
WorkspaceStore (單一工作區詳情)
        ↓ 提供 workspaceId, permissions
FeatureStore (功能模組)
        ↓ 過濾資料
EntityStore (實體資料)
```

**隔離原則**:
- 切換工作區時,清除所有工作區相關狀態
- 保留 GlobalShell (全域狀態)
- 重新載入新工作區的資料

---

### 4. 工作區建立流程

**建立步驟**:
```
Step 1: 驗證權限
├── 檢查 GlobalShell.canCreateWorkspace
└── 檢查是否達到配額上限

Step 2: 收集資訊
├── 工作區名稱 (必填)
├── 描述 (選填)
├── 類型 (Project | Department | Client...)
└── 初始設定

Step 3: 建立資料
├── 建立 Firestore 文檔 /workspaces/{id}
├── 建立成員關係 /memberships/{id}
│   └── 建立者自動成為 Owner
└── 建立預設設定 (子集合)

Step 4: 更新本地狀態
├── 新增到 WorkspaceListStore.workspaces
├── 設為 currentWorkspaceId
└── 導航到新工作區
```

**配額檢查**:
```
建立前檢查
├── 用戶擁有的工作區數 < maxWorkspacesPerUser
└── 用戶總參與工作區數 < 總配額
```

---

## Store 架構設計

### WorkspaceListStore 組成

```
WorkspaceListStore (NgRx Signals)
│
├── State (狀態定義)
│   ├── workspaces: WorkspaceMetadata[]
│   ├── memberships: Membership[]
│   ├── currentWorkspaceId: string | null
│   ├── loading: boolean
│   ├── error: string | null
│   └── lastSync: Date | null
│
├── Computed (派生狀態)
│   ├── ownedWorkspaces: 過濾 role = Owner
│   ├── memberWorkspaces: 過濾 role ≠ Owner
│   ├── activeWorkspaces: 過濾 status = Active
│   ├── recentWorkspaces: 排序 lastAccessedAt, 取前 5
│   ├── currentWorkspace: 根據 currentWorkspaceId 查找
│   ├── currentMembership: 當前工作區的成員關係
│   ├── hasWorkspaces: workspaces.length > 0
│   └── canCreateMore: 檢查配額
│
├── Methods (狀態變更)
│   ├── selectWorkspace(id)
│   ├── addWorkspace(workspace)
│   ├── updateWorkspace(id, updates)
│   ├── removeWorkspace(id)
│   ├── setFavorite(id, isFavorite)
│   └── clearCurrentWorkspace()
│
├── Effects (副作用處理)
│   ├── loadWorkspaces() - 載入用戶工作區
│   ├── subscribeToWorkspaces() - 即時同步
│   ├── createWorkspace(data) - 建立新工作區
│   ├── updateLastAccessed(id) - 更新訪問時間
│   └── archiveWorkspace(id) - 封存工作區
│
└── Hooks (生命週期)
    ├── onInit() - 自動載入工作區
    └── onDestroy() - 清理訂閱
```

---

## 資料模型

### 1. WorkspaceMetadata (工作區元資料)

```
WorkspaceMetadata
├── id: 唯一識別碼
├── name: 工作區名稱
├── slug: URL 友善名稱 (唯一)
├── description: 描述
├── avatar: 圖示 URL
├── type: 類型
│   ├── Project: 專案
│   ├── Department: 部門
│   ├── Client: 客戶
│   ├── Campaign: 活動
│   ├── Product: 產品
│   └── Internal: 內部
├── ownerId: 擁有者 ID
├── status: 狀態
│   ├── Draft: 草稿
│   ├── Active: 啟用
│   ├── Archived: 封存
│   └── Deleted: 已刪除
├── memberCount: 成員數
├── createdAt: 建立時間
├── updatedAt: 更新時間
└── settings: 快速設定
    ├── isPublic: 是否公開
    └── allowInvites: 是否允許邀請
```

### 2. Membership (成員關係)

```
Membership
├── id: 關係 ID
├── accountId: 帳號 ID
├── workspaceId: 工作區 ID
├── role: 角色
├── status: 狀態
├── permissions: 特殊權限 (可選)
│   └── [permission]: boolean
├── invitedBy: 邀請者 ID (可選)
├── joinedAt: 加入時間
├── lastAccessedAt: 最後訪問時間
└── metadata: 額外資訊
    ├── isFavorite: 是否最愛
    └── customLabel: 自訂標籤
```

### 3. CreateWorkspaceData (建立工作區資料)

```
CreateWorkspaceData
├── name: 名稱 (必填)
├── description: 描述 (選填)
├── type: 類型 (選填,預設 Project)
├── avatar: 圖示 (選填)
└── initialSettings: 初始設定 (選填)
```

---

## Firestore 資料結構

### Collections 設計

```
/workspaces/{workspaceId}
├── id: 自動生成
├── name: 字串
├── slug: 字串 (唯一索引)
├── description: 字串
├── avatar: 字串 (URL)
├── type: 字串
├── ownerId: 字串
├── status: 字串
├── memberCount: 數字
├── createdAt: Timestamp
├── updatedAt: Timestamp
└── settings: Map
    ├── isPublic: boolean
    └── allowInvites: boolean

/memberships/{membershipId}
├── id: 自動生成
├── accountId: 字串 (索引)
├── workspaceId: 字串 (索引)
├── role: 字串
├── status: 字串
├── permissions: Map (可選)
├── invitedBy: 字串 (可選)
├── joinedAt: Timestamp
├── lastAccessedAt: Timestamp
└── metadata: Map
    ├── isFavorite: boolean
    └── customLabel: 字串
```

### 查詢索引

**必要的複合索引**:
```
Collection: memberships
├── accountId (升序) + status (升序)
├── accountId (升序) + lastAccessedAt (降序)
└── workspaceId (升序) + role (升序)
```

---

## UI 元件架構

### 1. 工作區選擇器 (Workspace Switcher)

**位置**: 頂部導覽列

**功能**:
- 顯示當前工作區名稱與圖示
- 下拉選單顯示所有工作區
- 快速切換
- 顯示最近使用
- 建立新工作區按鈕

**分類顯示**:
```
下拉選單
├── 當前工作區 (高亮)
├── 最近使用 (最多 5 個)
├── 分隔線
├── 我擁有的工作區
│   └── [列表]
├── 我加入的工作區
│   └── [列表]
├── 分隔線
└── 建立新工作區
```

### 2. 工作區列表頁

**功能**:
- 網格或列表檢視
- 搜尋與篩選
- 排序選項
- 建立工作區
- 工作區卡片

**卡片內容**:
```
工作區卡片
├── 圖示/縮圖
├── 名稱
├── 描述 (截斷)
├── 成員數
├── 我的角色
├── 最後訪問時間
└── 操作選單
    ├── 進入工作區
    ├── 加入/移除最愛
    ├── 離開工作區 (非 Owner)
    └── 封存 (Owner only)
```

### 3. 建立工作區對話框

**表單欄位**:
- 名稱 (必填,最多 50 字)
- 描述 (選填,最多 200 字)
- 類型 (下拉選單)
- 圖示 (選填,上傳或選擇預設)

**驗證規則**:
- 名稱不可為空
- 名稱不可重複
- 符合配額限制

---

## 狀態同步策略

### 即時同步

**使用 Firestore Realtime Listeners**:
```
用戶 A 的瀏覽器
    ↓ 訂閱 memberships (accountId = A)
Firestore
    ↓ 推送變更
用戶 A 的 Store 自動更新
```

**同步場景**:
1. 被邀請加入新工作區 → 自動顯示
2. 被移除工作區 → 自動隱藏
3. 工作區名稱變更 → 自動更新
4. 權限角色變更 → 自動更新

### 快取策略

**本地快取**:
- 首次載入後快取到 Store
- 定期背景更新
- 離線時使用快取資料

**快取失效**:
- 切換帳號時清除
- 登出時清除
- 手動重新整理

---

## 切換工作區的狀態重置

### 需要重置的狀態層級

```
切換工作區時
├── ❌ 不重置: GlobalShell
│   └── 保留登入狀態、主題等全域設定
│
├── ❌ 不重置: WorkspaceListStore
│   └── 僅更新 currentWorkspaceId
│
├── ✅ 重置: WorkspaceStore
│   └── 清除舊工作區資料,載入新工作區
│
├── ✅ 重置: 所有 FeatureStore
│   └── Tasks, Documents, Members...
│
└── ✅ 重置: 所有 EntityStore
    └── 清除所有實體快取
```

### 重置流程

```
WorkspaceListStore.selectWorkspace(newId)
    ↓
發出工作區切換事件
    ↓
WorkspaceStore.onWorkspaceChange(newId)
    ├── 清除當前工作區狀態
    ├── 載入新工作區資料
    └── 觸發子 Store 重置
    ↓
各 FeatureStore 監聽並重置
    ├── 清除實體列表
    ├── 重設篩選/排序
    └── 清除選中狀態
    ↓
完成切換
```

---

## 錯誤處理

### 載入錯誤

**可能原因**:
- 網路中斷
- 權限不足
- Firestore 規則拒絕

**處理方式**:
1. 顯示錯誤訊息
2. 提供重試按鈕
3. 降級到唯讀模式 (如果可能)

### 建立失敗

**可能原因**:
- 達到配額上限
- 名稱重複
- 驗證失敗

**處理方式**:
1. 表單顯示具體錯誤
2. 保留用戶輸入
3. 建議修正方法

### 權限錯誤

**場景**:
- 訪問已被移除的工作區
- 嘗試操作無權限的動作

**處理方式**:
1. 重新載入工作區列表
2. 自動切換到可用工作區
3. 友善提示用戶

---

## 性能優化

### 分頁載入

**策略**:
- 初次載入: 最多 20 個工作區
- 滾動載入更多
- 快取已載入資料

### 查詢優化

**最佳化**:
```
載入工作區列表
└── 單一查詢獲取所有 memberships
    ├── where('accountId', '==', userId)
    ├── where('status', '==', 'Active')
    └── orderBy('lastAccessedAt', 'desc')
    
批次載入工作區詳情
└── 使用 Promise.all() 並行載入
```

### 記憶體管理

**策略**:
- 僅快取必要的工作區元資料
- 定期清理未使用的工作區資料
- 使用虛擬滾動 (大量工作區時)

---

## 測試策略

### Store 測試

**測試項目**:
1. 工作區載入正確
2. 分類計算正確 (owned vs member)
3. 切換工作區狀態更新
4. 建立工作區成功
5. 錯誤處理正確

### 元件測試

**測試項目**:
1. 工作區列表渲染
2. 切換器下拉選單
3. 建立表單驗證
4. 搜尋篩選功能

### 整合測試

**測試項目**:
1. 端到端建立流程
2. 切換工作區完整流程
3. 即時同步驗證

---

## 開發步驟建議

### Step 1: 資料模型與 Firestore 設定
- 定義 TypeScript 介面
- 建立 Firestore Collections
- 設定索引與安全規則

### Step 2: WorkspaceListStore 實現
- State 定義
- Computed 實現
- Methods 實現
- Effects (載入、同步)

### Step 3: UI 元件 - 工作區選擇器
- 下拉選單
- 切換邏輯
- 最近使用顯示

### Step 4: UI 元件 - 工作區列表頁
- 網格檢視
- 搜尋篩選
- 排序功能

### Step 5: 建立工作區功能
- 表單對話框
- 驗證邏輯
- Firestore 寫入
- 狀態更新

### Step 6: 切換機制與狀態重置
- 切換事件系統
- 狀態清理邏輯
- 路由整合

### Step 7: 測試與優化
- 單元測試
- 效能測試
- 使用者測試

---

## 成功標準

### 功能完整性
✅ 可載入所有工作區  
✅ 可切換工作區  
✅ 可建立新工作區  
✅ 即時同步正常運作  
✅ 分類與排序正確  
✅ 最近使用記錄正確  

### 資料完整性
✅ Firestore 資料結構正確  
✅ 成員關係正確建立  
✅ 角色權限正確設定  
✅ 狀態隔離無洩漏  

### 性能表現
✅ 列表載入 < 500ms  
✅ 切換工作區 < 300ms  
✅ 即時更新延遲 < 1s  
✅ 無記憶體洩漏  

---

## 下一階段預告

**Phase 3**: Workspace Store - 單一工作區詳情管理

下一階段將實現:
- 工作區詳細資訊載入
- 成員列表管理
- 權限系統
- 工作區設定
