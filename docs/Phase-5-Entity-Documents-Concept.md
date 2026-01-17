# Phase 5: Entity Store 與進階模組

**目標**: 建立標準化實體快取層,實現文件管理與跨模組功能

**預估時間**: 6-7 天

**依賴**: Phase 4 完成

---

## 核心概念

### 什麼是 Entity Store?

Entity Store 是一個標準化的實體快取層,用於優化資料存取:

```
EntityStore
├── 正規化資料結構 (Normalized)
│   ├── entities: Map<id, entity>
│   └── ids: string[]
│
├── 快速查找
│   └── O(1) 時間複雜度
│
└── 記憶體優化
    ├── 避免重複資料
    └── 支援跨模組共享
```

### Entity Store vs Feature Store

```
Feature Store                  Entity Store
(業務邏輯)                     (資料快取)
├── 篩選、排序、分頁            ├── 正規化儲存
├── 檢視狀態                   ├── 快速查找
├── UI 狀態                    ├── 共享快取
└── 業務規則                   └── 資料同步
```

---

## 階段目標

### 1. 通用 Entity Store 架構

**設計模式**:
```
createEntityStore<T extends { id: string }>()
├── State
│   ├── entities: Map<string, T>
│   ├── ids: string[]
│   ├── loading: boolean
│   └── error: string | null
│
├── Computed
│   ├── entitiesArray: T[]
│   ├── entityCount: number
│   └── entityById(id): T | undefined
│
├── Methods
│   ├── setAll(entities: T[])
│   ├── setOne(entity: T)
│   ├── addOne(entity: T)
│   ├── updateOne(id: string, updates: Partial<T>)
│   ├── removeOne(id: string)
│   ├── setMany(entities: T[])
│   ├── upsertMany(entities: T[])
│   └── clear()
│
└── Utils
    ├── normalize(entities: T[]): Map<string, T>
    ├── denormalize(map: Map<string, T>): T[]
    └── selectById(id: string): T | undefined
```

**優勢**:
- 避免陣列查找 (O(n) → O(1))
- 防止重複實體
- 支援部分更新
- 記憶體效率高

---

### 2. Documents 文件模組

**Document 資料模型**:
```
Document
├── 識別資訊
│   ├── id: 唯一識別碼
│   ├── workspaceId: 所屬工作區
│   ├── folderId: 所屬資料夾 (可選)
│   └── number: 文件編號
│
├── 基本資訊
│   ├── name: 檔案名稱
│   ├── description: 描述
│   ├── type: 文件類型
│   │   ├── folder: 資料夾
│   │   ├── file: 檔案
│   │   └── link: 連結
│   └── mimeType: MIME 類型 (檔案用)
│
├── 檔案資訊 (type = file)
│   ├── size: 檔案大小 (bytes)
│   ├── storagePath: Firebase Storage 路徑
│   ├── downloadURL: 下載連結
│   └── thumbnailURL: 縮圖連結 (可選)
│
├── 版本控制
│   ├── version: 版本號
│   ├── versionHistory: Version[]
│   └── currentVersionId: string
│
├── 時間資訊
│   ├── createdAt: 建立時間
│   ├── updatedAt: 更新時間
│   ├── lastAccessedAt: 最後存取時間
│   └── deletedAt: 刪除時間 (軟刪除)
│
├── 關聯資訊
│   ├── createdBy: 建立者 ID
│   ├── ownedBy: 擁有者 ID
│   ├── sharedWith: SharedPermission[]
│   └── relatedTasks: string[] (關聯任務)
│
└── 進階資訊
    ├── tags: string[]
    ├── starred: boolean
    ├── color: string (資料夾用)
    └── metadata: Map<string, any>
```

**資料夾樹狀結構**:
```
Folder Structure
/
├── Folder A
│   ├── Document 1
│   ├── Document 2
│   └── Subfolder B
│       └── Document 3
└── Folder C
    └── Document 4

實現方式:
└── parentId 欄位建立層級關係
```

---

### 3. Documents Feature Store

**State**:
```
DocumentsFeatureState
├── documents: Document[]
├── currentFolderId: string | null (當前資料夾)
├── selectedDocumentIds: string[] (多選)
├── breadcrumbs: Folder[] (麵包屑導航)
├── filters: DocumentFilters
│   ├── type: DocumentType[]
│   ├── tags: string[]
│   ├── createdBy: string[]
│   ├── dateRange: DateRange
│   └── searchQuery: string
├── sorting: DocumentSorting
│   ├── field: 'name' | 'createdAt' | 'size' | 'type'
│   └── direction: 'asc' | 'desc'
├── viewMode: 'grid' | 'list' | 'tree'
├── uploadQueue: UploadTask[]
├── loading: boolean
└── error: string | null
```

**Computed**:
```
Computed Signals
├── currentFolderDocuments - 當前資料夾內容
├── filteredDocuments - 套用篩選
├── sortedDocuments - 套用排序
├── selectedDocuments - 選中的文件
├── folderTree - 完整資料夾樹
├── storageUsage - 已使用儲存空間
├── canUpload - 上傳權限檢查
├── canCreateFolder - 建立資料夾權限
└── uploadProgress - 上傳進度
```

**Methods**:
```
State Mutations
├── setCurrentFolder(folderId)
├── navigateUp() - 返回上層
├── navigateTo(path) - 導航到路徑
├── selectDocument(id, multi)
├── clearSelection()
├── addToUploadQueue(files)
├── removeFromUploadQueue(index)
└── reset()
```

**Effects**:
```
Async Operations
├── loadDocuments(folderId) - 載入文件
├── subscribeToDocuments(folderId) - 即時同步
├── uploadFile(file, folderId) - 上傳檔案
├── createFolder(name, parentId) - 建立資料夾
├── renameDocument(id, newName) - 重新命名
├── moveDocuments(ids, targetFolderId) - 移動
├── copyDocuments(ids, targetFolderId) - 複製
├── deleteDocuments(ids, permanent) - 刪除
├── shareDocument(id, permissions) - 分享
├── downloadDocument(id) - 下載
└── generateThumbnail(id) - 生成縮圖
```

---

### 4. 檔案上傳系統

**上傳流程**:
```
Upload Pipeline
1. 檔案選擇
   ├── 拖放上傳
   ├── 點擊上傳
   └── 貼上上傳
    ↓
2. 驗證
   ├── 檔案大小 (< maxFileSize)
   ├── 檔案類型 (允許的 MIME types)
   ├── 配額檢查 (剩餘空間)
   └── 權限檢查 (canUpload)
    ↓
3. 加入上傳佇列
   └── uploadQueue.push(task)
    ↓
4. 上傳到 Firebase Storage
   /workspaces/{workspaceId}/documents/{documentId}/{filename}
   ├── 監聽上傳進度
   ├── 生成縮圖 (圖片)
   └── 取得下載 URL
    ↓
5. 建立 Firestore 文檔
   /workspaces/{workspaceId}/documents/{documentId}
    ↓
6. 更新本地 Store
   └── addDocument(document)
    ↓
7. 移除佇列項目
```

**進度追蹤**:
```
UploadTask
├── id: string
├── file: File
├── targetFolderId: string
├── status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
├── progress: number (0-100)
├── bytesUploaded: number
├── totalBytes: number
├── speed: number (bytes/sec)
├── error: string | null
└── cancelToken: () => void
```

**批次上傳**:
```
策略
├── 同時上傳: 最多 3 個
├── 佇列管理: 先進先出
├── 錯誤處理: 失敗項目可重試
└── 取消功能: 可單獨取消
```

---

### 5. 檔案分享與權限

**分享模型**:
```
SharedPermission
├── accountId: 分享給誰
├── role: 'viewer' | 'editor' | 'owner'
├── expiresAt: Date | null (過期時間)
├── sharedBy: 分享者 ID
└── sharedAt: 分享時間

分享層級
├── 私密 (Private) - 只有擁有者
├── 工作區成員 (Workspace) - 所有成員
├── 特定人員 (Specific) - 指定帳號
└── 公開連結 (Public Link) - 任何人
```

**權限層級**:
```
Document Permissions
├── Viewer (檢視者)
│   ├── 可檢視
│   ├── 可下載
│   └── 不可編輯
│
├── Editor (編輯者)
│   ├── 可檢視
│   ├── 可下載
│   ├── 可編輯
│   ├── 可分享 (給 Viewer)
│   └── 不可刪除
│
└── Owner (擁有者)
    └── 所有權限
```

**分享對話框**:
```
分享介面
├── 當前分享列表
│   └── [帳號] - [角色] - [移除]
│
├── 新增分享
│   ├── 搜尋帳號
│   ├── 選擇角色
│   ├── 設定過期時間 (可選)
│   └── 新增按鈕
│
└── 公開連結區
    ├── 啟用公開連結
    ├── 複製連結
    └── 設定過期時間
```

---

### 6. 檔案預覽系統

**支援的檔案類型**:
```
預覽支援
├── 圖片
│   ├── jpg, jpeg, png, gif, webp, svg
│   └── 直接顯示 (img tag)
│
├── 文件
│   ├── pdf (PDF.js)
│   ├── txt, md (文字編輯器)
│   └── docx, xlsx (轉換為 PDF 或 HTML)
│
├── 影片
│   ├── mp4, webm, ogg
│   └── HTML5 video player
│
├── 音訊
│   ├── mp3, wav, ogg
│   └── HTML5 audio player
│
└── 程式碼
    ├── js, ts, html, css, json, etc.
    └── Syntax highlighting
```

**預覽對話框**:
```
預覽介面
├── 頂部工具列
│   ├── 檔案名稱
│   ├── 下載按鈕
│   ├── 分享按鈕
│   ├── 刪除按鈕
│   └── 關閉按鈕
│
├── 主要預覽區
│   └── [檔案內容顯示]
│
├── 側邊資訊欄
│   ├── 檔案資訊
│   ├── 版本歷史
│   ├── 分享設定
│   └── 相關任務
│
└── 導航控制
    ├── 上一個檔案
    └── 下一個檔案
```

---

### 7. 版本控制

**版本模型**:
```
DocumentVersion
├── versionId: string
├── documentId: string
├── versionNumber: number
├── storagePath: string
├── size: number
├── createdBy: string
├── createdAt: Date
├── changeLog: string (變更說明)
└── downloadURL: string
```

**版本操作**:
```
版本功能
├── 自動版本 (每次上傳新檔案)
├── 手動版本 (標記重要版本)
├── 檢視歷史版本
├── 比較版本 (若支援)
├── 還原到舊版本
└── 下載舊版本
```

**版本限制**:
```
配額管理
├── 保留版本數: 最多 10 個
├── 保留時間: 30 天
├── 超過限制: 刪除最舊版本
└── 標記版本: 永久保留
```

---

### 8. 搜尋功能

**搜尋範圍**:
```
Search Scope
├── 當前資料夾
├── 當前資料夾 + 子資料夾
└── 整個工作區
```

**搜尋欄位**:
```
Searchable Fields
├── name: 檔案名稱
├── description: 描述
├── tags: 標籤
├── content: 檔案內容 (文字檔案)
└── metadata: 自訂欄位
```

**進階搜尋**:
```
Advanced Search
├── 檔案類型篩選
├── 大小範圍
├── 日期範圍
├── 建立者篩選
├── 標籤組合
└── 排序選項
```

**搜尋實現**:
```
選項 1: Firestore 查詢
├── 限制: 只能搜尋索引欄位
└── 優勢: 即時、免費

選項 2: Algolia/Meilisearch
├── 限制: 需要額外服務
└── 優勢: 全文搜尋、模糊搜尋

選項 3: Cloud Functions + Firestore
├── 定期索引建立
└── 搜尋 API
```

---

## Firestore 資料結構

### Collections

```
/workspaces/{workspaceId}/documents/{documentId}
├── id: string
├── workspaceId: string
├── folderId: string | null
├── number: number
├── name: string
├── description: string
├── type: 'folder' | 'file' | 'link'
├── mimeType: string | null
├── size: number | null
├── storagePath: string | null
├── downloadURL: string | null
├── thumbnailURL: string | null
├── version: number
├── createdAt: Timestamp
├── updatedAt: Timestamp
├── lastAccessedAt: Timestamp
├── deletedAt: Timestamp | null
├── createdBy: string
├── ownedBy: string
├── sharedWith: SharedPermission[]
├── relatedTasks: string[]
├── tags: string[]
├── starred: boolean
├── color: string | null
└── metadata: Map<string, any>

/workspaces/{workspaceId}/documents/{documentId}/versions (SubCollection)
└── {versionId}: DocumentVersion
```

### 查詢索引

```
Collection: documents (CollectionGroup)
├── workspaceId + type + name (複合)
├── workspaceId + folderId + type (複合)
├── workspaceId + createdAt (複合,降序)
├── workspaceId + ownedBy + type (複合)
├── workspaceId + tags (陣列)
└── workspaceId + starred + updatedAt (複合)
```

---

## Firebase Storage 結構

### Storage 路徑設計

```
/workspaces
  /{workspaceId}
    /documents
      /{documentId}
        /{filename}  - 當前版本
        /versions
          /v{versionNumber}_{filename}  - 歷史版本
    /thumbnails
      /{documentId}
        /thumb_{filename}  - 縮圖
```

### Security Rules

```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /workspaces/{workspaceId}/documents/{documentId}/{filename} {
      // 讀取: 工作區成員 或 有分享權限
      allow read: if isWorkspaceMember(workspaceId) || 
                     hasSharedAccess(workspaceId, documentId);
      
      // 寫入: 工作區成員 且 有上傳權限
      allow write: if isWorkspaceMember(workspaceId) && 
                      canUploadFiles(workspaceId);
      
      // 刪除: 檔案擁有者 或 管理員
      allow delete: if isDocumentOwner(workspaceId, documentId) ||
                       isWorkspaceAdmin(workspaceId);
    }
  }
}
```

---

## UI 元件架構

### 1. 文件管理器主頁

**佈局**:
```
文件管理器
├── 頂部工具列
│   ├── 麵包屑導航
│   ├── 搜尋框
│   ├── 檢視切換 (網格/列表/樹狀)
│   ├── 排序選單
│   └── 上傳按鈕
│
├── 側邊欄
│   ├── 快速存取
│   │   ├── 最近使用
│   │   ├── 我的最愛
│   │   └── 與我分享
│   ├── 資料夾樹狀圖
│   └── 儲存空間使用量
│
├── 主要內容區
│   ├── 工具列
│   │   ├── 全選
│   │   ├── 建立資料夾
│   │   └── 批次操作
│   └── 文件/資料夾網格或列表
│
└── 底部狀態列
    ├── 選中項目數
    ├── 上傳進度
    └── 儲存空間資訊
```

### 2. 網格檢視卡片

```
文件卡片
├── 縮圖/圖示
├── 檔案名稱
├── 檔案大小
├── 修改日期
├── 分享圖示
├── 我的最愛圖示
└── 右鍵選單
    ├── 預覽
    ├── 下載
    ├── 分享
    ├── 重新命名
    ├── 移動
    ├── 複製
    └── 刪除
```

### 3. 上傳區域

```
上傳介面
├── 拖放區域
│   └── "將檔案拖曳至此或點擊上傳"
│
└── 上傳佇列
    └── [上傳項目列表]
        ├── 檔案名稱
        ├── 大小
        ├── 進度條
        ├── 狀態
        └── 取消按鈕
```

---

## 跨模組整合

### 任務與文件整合

**關聯功能**:
```
Task ↔ Document
├── 任務附加文件
├── 文件關聯任務
├── 雙向同步
└── 快速跳轉
```

**實現方式**:
```typescript
// 在 Task 中
task.attachments: DocumentReference[]

// 在 Document 中
document.relatedTasks: string[]

// Computed
relatedDocuments = computed(() => {
  return task.attachments.map(ref => 
    documentsStore.entityById(ref.documentId)
  );
});
```

### 成員與文件整合

**個人空間**:
```
My Documents
├── 我建立的文件
├── 分享給我的文件
├── 我的最愛
└── 最近開啟
```

---

## 性能優化

### 縮圖生成

**Cloud Function**:
```
onFileUpload Trigger
├── 偵測圖片上傳
├── 使用 Sharp 生成縮圖
├── 上傳到 /thumbnails
└── 更新 document.thumbnailURL
```

### 懶加載

**策略**:
```
Lazy Loading
├── 初次只載入當前資料夾
├── 滾動時載入更多
├── 子資料夾按需載入
└── 快取已載入資料夾
```

### 虛擬滾動

**大量檔案** (> 100):
- CDK Virtual Scroll
- 只渲染可見項目
- 平滑滾動體驗

---

## 測試策略

### Entity Store 測試

```
測試項目
├── 正規化與反正規化
├── CRUD 操作
├── 查找效能
└── 記憶體使用
```

### Documents Store 測試

```
測試項目
├── 資料夾導航
├── 檔案上傳流程
├── 權限檢查
├── 分享功能
└── 版本控制
```

---

## 開發步驟建議

### Step 1: Entity Store 框架
- 建立通用 Entity Store
- 實現正規化邏輯
- 單元測試

### Step 2: Documents 資料模型
- 定義 Document 介面
- Firestore Collection
- Storage 結構

### Step 3: Documents Feature Store
- State/Computed/Methods
- Effects 實現
- 資料夾導航邏輯

### Step 4: 上傳系統
- 檔案上傳到 Storage
- 進度追蹤
- Firestore 文檔建立

### Step 5: 文件管理 UI
- 網格/列表檢視
- 麵包屑導航
- 拖放上傳

### Step 6: 分享與權限
- 分享對話框
- 權限管理
- 公開連結

### Step 7: 預覽與版本
- 預覽對話框
- 版本歷史
- 還原功能

### Step 8: 整合與優化
- 與 Tasks 整合
- 性能優化
- 使用者測試

---

## 成功標準

### 功能完整性
✅ Entity Store 正常運作  
✅ 文件 CRUD 完整  
✅ 上傳下載正常  
✅ 分享權限正確  
✅ 版本控制運作  
✅ 預覽功能正常  

### 性能
✅ 大檔案上傳穩定  
✅ 列表載入 < 500ms  
✅ 預覽開啟 < 1s  

### 安全性
✅ Storage Rules 正確  
✅ 權限檢查完善  
✅ 分享控制安全  

---

## 下一階段預告

**Phase 6**: 系統整合與優化

下一階段將實現:
- 全域搜尋功能
- 通知系統
- 活動記錄 (Journal)
- 稽核日誌 (Audit)
- 效能監控與優化
- 離線支援
