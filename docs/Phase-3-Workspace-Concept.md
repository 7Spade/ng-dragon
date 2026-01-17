# Phase 3: Workspace Store - 單一工作區詳情管理

**目標**: 實現單一工作區的深度管理,包含成員、權限、設定

**預估時間**: 4-5 天

**依賴**: Phase 2 完成

---

## 核心概念

### 什麼是 Workspace Store?

Workspace Store 負責管理「當前選中工作區」的所有詳細資訊:

```
WorkspaceStore
├── 工作區詳細資訊
├── 成員列表與角色
├── 權限設定
├── 模組啟用狀態
├── 工作區偏好設定
└── 配額使用情況
```

### WorkspaceListStore vs WorkspaceStore

```
WorkspaceListStore                 WorkspaceStore
(所有工作區概覽)                   (單一工作區詳情)
├── 輕量級元資料                  ├── 完整詳細資訊
├── 用於列表顯示                  ├── 用於工作區內操作
├── 多個工作區                    ├── 當前工作區
└── 較少更新                      └── 頻繁更新
```

---

## 階段目標

### 1. 工作區詳情管理

**要實現的功能**:
- 載入當前工作區完整資訊
- 即時同步工作區變更
- 監聽工作區切換事件
- 自動重置狀態

**狀態管理**:
```
workspace: Workspace | null
├── 基本資訊
├── 詳細描述
├── 設定
└── 統計資料
```

**派生狀態**:
```
workspaceName: 工作區名稱
workspaceOwner: 擁有者資訊
workspaceType: 類型
isWorkspaceOwner: 當前用戶是否為擁有者
isWorkspaceAdmin: 當前用戶是否為管理員
```

---

### 2. 成員管理系統

**功能需求**:
- 載入所有成員列表
- 顯示成員角色與狀態
- 邀請新成員
- 變更成員角色
- 移除成員
- 處理邀請狀態

**成員資料**:
```
WorkspaceMember
├── account: Account 基本資訊
│   ├── id
│   ├── displayName
│   ├── email
│   └── photoURL
├── membership: Membership 關聯資訊
│   ├── role
│   ├── status
│   ├── joinedAt
│   └── permissions
└── computed: 計算屬性
    ├── displayRole: 角色中文
    ├── canModify: 是否可修改
    └── canRemove: 是否可移除
```

**邀請流程**:
```
Step 1: 輸入電子郵件
    ↓
Step 2: 選擇角色
    ↓
Step 3: 檢查配額與權限
    ├── 成員數是否達上限
    ├── 是否有邀請權限
    └── 電子郵件是否有效
    ↓
Step 4: 建立邀請
    ├── 檢查帳號是否存在
    ├── 建立 Membership (status: Invited)
    └── 發送邀請郵件
    ↓
Step 5: 更新本地狀態
```

**角色變更流程**:
```
檢查權限
├── 只有 Owner/Admin 可變更角色
├── 不可降級自己
└── 至少保留一個 Owner
    ↓
更新 Firestore
    ↓
本地狀態同步更新
```

---

### 3. 權限管理系統

**權限模型**:
```
Permission System
├── Role-Based (角色權限)
│   ├── Owner: 所有權限
│   ├── Admin: 管理權限
│   ├── Member: 一般權限
│   └── Guest: 唯讀權限
│
├── Resource-Based (資源權限)
│   ├── Workspace Level: 工作區設定
│   ├── Module Level: 模組啟用/停用
│   └── Entity Level: 個別資料存取
│
└── Permission Overrides (權限覆寫)
    └── 針對特定用戶的額外權限
```

**權限檢查函數**:
```
currentUserPermissions: ComputedSignal
├── canInviteMembers: boolean
├── canRemoveMembers: boolean
├── canChangeRoles: boolean
├── canEditWorkspace: boolean
├── canDeleteWorkspace: boolean
├── canEnableModules: boolean
├── canManageSettings: boolean
└── modulePermissions: Map<ModuleName, ModulePermission>
```

**模組權限**:
```
ModulePermission
├── canView: 是否可檢視
├── canCreate: 是否可建立
├── canEdit: 是否可編輯
└── canDelete: 是否可刪除
```

---

### 4. 模組啟用管理

**模組列表**:
```
Modules
├── overview: 總覽儀表板 (預設啟用)
├── documents: 文件管理
├── tasks: 任務管理
├── members: 成員管理 (預設啟用)
├── permissions: 權限管理
├── audit: 稽核日誌
├── settings: 設定 (預設啟用)
└── journal: 活動記錄
```

**啟用/停用邏輯**:
```
moduleStates: Map<ModuleName, ModuleState>
├── enabled: boolean
├── visible: boolean
├── accessLevel: 'all' | 'admin' | 'owner'
└── settings: ModuleSettings (可選)
```

**狀態管理**:
```
modules: ModuleState[]
enabledModules: Computed (過濾 enabled = true)
visibleModules: Computed (根據權限過濾)
```

---

### 5. 工作區設定管理

**設定類別**:
```
WorkspaceSettings
├── General (一般設定)
│   ├── name
│   ├── description
│   ├── avatar
│   └── type
│
├── Access (存取設定)
│   ├── isPublic: 是否公開
│   ├── allowInvites: 是否允許成員邀請
│   ├── requireApproval: 邀請是否需審核
│   └── allowedDomains: 允許自動加入的網域
│
├── Features (功能設定)
│   ├── enabledModules: 啟用的模組
│   ├── enableNotifications: 啟用通知
│   └── enableIntegrations: 啟用整合
│
├── Quotas (配額設定)
│   ├── maxMembers: 最大成員數
│   ├── maxStorage: 最大儲存空間
│   └── customLimits: 自訂限制
│
└── Advanced (進階設定)
    ├── archivePolicy: 封存政策
    ├── retentionDays: 資料保留天數
    └── exportEnabled: 是否允許匯出
```

---

### 6. 配額與使用情況

**追蹤項目**:
```
WorkspaceUsage
├── members
│   ├── current: 當前成員數
│   └── limit: 上限
│
├── storage
│   ├── used: 已使用 (bytes)
│   ├── limit: 上限 (bytes)
│   └── percentage: 使用百分比
│
├── apiCalls (若啟用)
│   ├── daily: 今日呼叫次數
│   └── limit: 每日上限
│
└── entities (依模組)
    ├── tasks: 任務數
    ├── documents: 文件數
    └── ...
```

**配額警告**:
```
quotaWarnings: ComputedSignal
├── nearMemberLimit: members >= 90%
├── nearStorageLimit: storage >= 80%
└── apiThrottled: 是否被限流
```

---

## Store 架構設計

### WorkspaceStore 組成

```
WorkspaceStore (NgRx Signals)
│
├── State (狀態定義)
│   ├── workspace: Workspace | null
│   ├── members: WorkspaceMember[]
│   ├── permissions: PermissionSet
│   ├── modules: ModuleState[]
│   ├── settings: WorkspaceSettings | null
│   ├── usage: WorkspaceUsage | null
│   ├── loading: boolean
│   ├── membersLoading: boolean
│   └── error: string | null
│
├── Computed (派生狀態)
│   ├── workspaceId: workspace?.id
│   ├── workspaceName: workspace?.name
│   ├── workspaceOwner: 查找 Owner 成員
│   ├── currentUserMembership: 當前用戶的成員資訊
│   ├── currentUserRole: 當前用戶角色
│   ├── currentUserPermissions: 權限集合
│   ├── isOwner: role === 'Owner'
│   ├── isAdmin: role in ['Owner', 'Admin']
│   ├── canManageMembers: 權限檢查
│   ├── enabledModules: 過濾啟用模組
│   ├── memberCount: members.length
│   ├── activeMembers: 過濾 Active 成員
│   ├── pendingInvites: 過濾 Invited 成員
│   └── quotaStatus: 配額狀態摘要
│
├── Methods (狀態變更)
│   ├── setWorkspace(workspace)
│   ├── updateWorkspace(updates)
│   ├── setMembers(members)
│   ├── addMember(member)
│   ├── updateMember(id, updates)
│   ├── removeMember(id)
│   ├── setModuleEnabled(module, enabled)
│   ├── updateSettings(settings)
│   └── reset() - 清除所有狀態
│
├── Effects (副作用處理)
│   ├── loadWorkspace(id) - 載入工作區
│   ├── subscribeToWorkspace(id) - 即時同步
│   ├── loadMembers(workspaceId) - 載入成員
│   ├── subscribeToMembers(workspaceId) - 成員同步
│   ├── inviteMember(email, role) - 邀請成員
│   ├── changeMemberRole(memberId, role) - 變更角色
│   ├── removeMemberFromWorkspace(memberId) - 移除成員
│   ├── updateWorkspaceSettings(settings) - 更新設定
│   ├── loadUsageStats(workspaceId) - 載入使用統計
│   └── onWorkspaceSwitch(newId) - 工作區切換處理
│
└── Hooks (生命週期)
    ├── onInit() - 訂閱工作區切換事件
    └── onDestroy() - 清理訂閱
```

---

## 資料模型

### 1. Workspace (完整工作區)

```typescript
Workspace
├── id: string
├── name: string
├── slug: string
├── description: string
├── avatar: string | null
├── type: WorkspaceType
├── ownerId: string
├── status: WorkspaceStatus
├── createdAt: Date
├── updatedAt: Date
│
├── settings: WorkspaceSettings
│   ├── access: AccessSettings
│   ├── features: FeatureSettings
│   ├── quotas: QuotaSettings
│   └── advanced: AdvancedSettings
│
├── stats: WorkspaceStats
│   ├── memberCount: number
│   ├── activeMembers: number
│   ├── pendingInvites: number
│   ├── storageUsed: number
│   └── lastActivityAt: Date
│
└── modules: ModuleState[]
```

### 2. WorkspaceMember (工作區成員)

```typescript
WorkspaceMember
├── account: Account
│   ├── id
│   ├── type
│   ├── email
│   ├── displayName
│   └── photoURL
│
├── membership: Membership
│   ├── id
│   ├── accountId
│   ├── workspaceId
│   ├── role
│   ├── status
│   ├── permissions: CustomPermissions | null
│   ├── invitedBy: string | null
│   ├── joinedAt: Date
│   └── lastAccessedAt: Date
│
└── computed properties (在元件中計算)
```

### 3. PermissionSet (權限集合)

```typescript
PermissionSet
├── workspace: WorkspacePermissions
│   ├── canEdit: boolean
│   ├── canDelete: boolean
│   ├── canInviteMembers: boolean
│   ├── canRemoveMembers: boolean
│   ├── canChangeRoles: boolean
│   └── canManageSettings: boolean
│
├── modules: Map<ModuleName, ModulePermissions>
│   └── [moduleName]: ModulePermissions
│       ├── canView: boolean
│       ├── canCreate: boolean
│       ├── canEdit: boolean
│       └── canDelete: boolean
│
└── entities: Map<EntityType, EntityPermissions>
    └── [entityType]: EntityPermissions
```

### 4. ModuleState (模組狀態)

```typescript
ModuleState
├── name: ModuleName
├── enabled: boolean
├── visible: boolean
├── order: number
├── accessLevel: 'all' | 'member' | 'admin' | 'owner'
├── icon: string
├── route: string
└── settings: ModuleSettings | null
```

---

## Firestore 資料結構

### Collections & SubCollections

```
/workspaces/{workspaceId}
├── (基本欄位如 Phase 2)
├── settings: Map
│   ├── access: Map
│   ├── features: Map
│   ├── quotas: Map
│   └── advanced: Map
└── modules: Map
    └── [moduleName]: ModuleState

/workspaces/{workspaceId}/members (SubCollection)
└── {memberId}
    ├── accountId: string
    ├── role: string
    ├── status: string
    ├── permissions: Map | null
    ├── joinedAt: Timestamp
    └── lastAccessedAt: Timestamp

/workspaces/{workspaceId}/usage (Document)
├── members
│   ├── current: number
│   └── limit: number
├── storage
│   ├── used: number
│   └── limit: number
└── updatedAt: Timestamp
```

### 安全規則範例

```javascript
// 只有成員可讀取工作區
match /workspaces/{workspaceId} {
  allow read: if isMember(workspaceId);
  allow update: if isAdmin(workspaceId);
  allow delete: if isOwner(workspaceId);
  
  // 成員子集合
  match /members/{memberId} {
    allow read: if isMember(workspaceId);
    allow write: if isAdmin(workspaceId);
  }
}

// 輔助函數
function isMember(workspaceId) {
  return exists(/databases/$(database)/documents/memberships/$(getMembershipId(workspaceId)));
}

function isAdmin(workspaceId) {
  let membership = get(/databases/$(database)/documents/memberships/$(getMembershipId(workspaceId))).data;
  return membership.role in ['Owner', 'Admin'];
}
```

---

## 狀態同步機制

### 工作區切換流程

```
WorkspaceListStore.currentWorkspaceId 變化
    ↓
WorkspaceStore 監聽到變化
    ↓
WorkspaceStore.onWorkspaceSwitch(newId)
    ├── 取消舊訂閱
    ├── 清除舊狀態 (reset)
    ├── 載入新工作區資料
    │   ├── subscribeToWorkspace(newId)
    │   ├── loadMembers(newId)
    │   └── loadUsageStats(newId)
    └── 通知 FeatureStores 重置
```

### 即時同步

**工作區資料同步**:
```
Firestore onSnapshot(/workspaces/{id})
    ↓
收到變更
    ↓
WorkspaceStore.setWorkspace(updatedData)
    ↓
Computed 自動重新計算
    ↓
UI 自動更新
```

**成員列表同步**:
```
Firestore onSnapshot(/workspaces/{id}/members)
    ↓
收到成員變更
    ↓
WorkspaceStore.setMembers(updatedMembers)
    ↓
memberCount, activeMembers 等自動更新
```

---

## UI 元件架構

### 1. 工作區設定頁

**頁籤結構**:
```
設定頁
├── 一般設定 Tab
│   ├── 名稱與描述編輯
│   ├── 圖示上傳
│   └── 類型選擇
│
├── 成員管理 Tab
│   ├── 成員列表
│   ├── 邀請表單
│   ├── 角色管理
│   └── 移除成員
│
├── 權限設定 Tab
│   ├── 預設角色權限展示
│   ├── 模組存取控制
│   └── 自訂權限 (進階)
│
├── 模組管理 Tab
│   ├── 啟用/停用模組
│   ├── 模組排序
│   └── 模組設定
│
└── 配額與使用 Tab
    ├── 使用情況圖表
    ├── 配額警告
    └── 升級選項 (若適用)
```

### 2. 成員列表元件

**功能**:
- 表格或卡片顯示成員
- 角色標記與圖示
- 狀態指示 (Active, Invited, Suspended)
- 快速操作選單
- 搜尋與篩選

**列表項目**:
```
成員卡片/列
├── 頭像
├── 名稱與電子郵件
├── 角色標籤
├── 加入日期
├── 最後活動時間
└── 操作選單
    ├── 變更角色 (下拉選單)
    ├── 移除成員
    └── 檢視詳情
```

### 3. 邀請成員對話框

**表單**:
```
邀請表單
├── 電子郵件輸入 (支援多個)
├── 角色選擇
│   ├── Admin
│   ├── Member
│   └── Guest
├── 個人訊息 (選填)
└── 送出按鈕
```

**驗證**:
- 電子郵件格式
- 重複檢查 (已是成員)
- 配額檢查
- 權限檢查

---

## 權限檢查最佳實踐

### 在元件中使用

```typescript
// 使用 Computed Signal
readonly canInvite = this.workspaceStore.currentUserPermissions.canInviteMembers;

// 模板中
@if (canInvite()) {
  <button (click)="openInviteDialog()">邀請成員</button>
}
```

### 多層權限檢查

```
UI Level (最外層)
├── 顯示/隱藏按鈕
    ↓
Component Level
├── 啟用/停用操作
    ↓
Store/Service Level
├── 執行前驗證權限
    ↓
Backend/Firestore Rules (最內層)
└── 最終權限執行
```

---

## 錯誤處理

### 成員操作錯誤

**邀請失敗**:
- 配額已滿 → 提示升級或移除成員
- 權限不足 → 提示聯繫管理員
- 郵件無效 → 顯示格式錯誤

**移除失敗**:
- 不能移除擁有者 → 提示先轉移擁有權
- 不能移除自己 → 提示使用「離開工作區」

**角色變更失敗**:
- 至少保留一個 Owner → 阻止降級最後的 Owner
- 權限不足 → 顯示權限錯誤

### 同步錯誤

**Firestore 連線中斷**:
- 顯示離線指示器
- 快取本地狀態
- 重新連線後自動同步

**權限被撤銷**:
- 即時偵測
- 自動導航回工作區列表
- 友善提示用戶

---

## 性能優化

### 成員列表優化

**大量成員場景** (> 50 人):
- 虛擬滾動 (CDK Virtual Scroll)
- 分頁載入
- 搜尋結果限制

### 權限計算優化

**快取策略**:
```
計算權限時
├── 基於 role 的基礎權限 (快取)
├── 加上 custom permissions 覆寫
└── 結果 memoization (Computed 自動)
```

### 訂閱管理

**避免過多訂閱**:
- 只訂閱當前工作區
- 使用單一查詢獲取成員
- 適時取消訂閱

---

## 測試策略

### Store 測試

**測試項目**:
1. 工作區載入與同步
2. 成員列表更新
3. 權限計算正確性
4. 模組啟用/停用
5. 工作區切換重置

### 權限測試

**測試矩陣**:
```
For each role (Owner, Admin, Member, Guest):
  For each permission:
    Assert correct value
```

### 整合測試

**端到端流程**:
1. 邀請成員完整流程
2. 變更角色完整流程
3. 工作區設定更新流程

---

## 開發步驟建議

### Step 1: 擴展資料模型
- Workspace 完整定義
- WorkspaceMember 定義
- PermissionSet 定義

### Step 2: WorkspaceStore 基礎
- State 定義
- 基礎 Computed
- 載入與重置 Methods

### Step 3: 成員管理
- 成員載入
- 邀請功能
- 角色變更
- 移除功能

### Step 4: 權限系統
- 權限計算邏輯
- 權限檢查函數
- UI 權限控制

### Step 5: 模組管理
- 模組狀態管理
- 啟用/停用邏輯

### Step 6: 設定與配額
- 設定頁 UI
- 配額追蹤
- 使用統計

### Step 7: 測試與整合
- 單元測試
- 整合測試
- 與 Phase 2 整合

---

## 成功標準

### 功能完整性
✅ 工作區資料正確載入  
✅ 成員管理功能完整  
✅ 權限系統正常運作  
✅ 模組啟用/停用正常  
✅ 設定可正確儲存  
✅ 工作區切換狀態重置  

### 安全性
✅ 權限檢查完善  
✅ Firestore 規則正確  
✅ 前後端驗證一致  

### 性能
✅ 成員列表載入 < 500ms  
✅ 權限計算不阻塞 UI  
✅ 大量成員時仍流暢  

---

## 下一階段預告

**Phase 4**: Feature Store - 任務模組實現 (Tasks)

下一階段將實現第一個功能模組:
- 任務列表與詳情
- 任務建立與編輯
- 任務狀態管理
- 任務指派
- 篩選與排序
