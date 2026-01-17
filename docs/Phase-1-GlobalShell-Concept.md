# Phase 1: 全域殼層 (GlobalShell) - 概念架構

**目標**: 建立應用程式的全域狀態基礎,實現身份驗證與核心佈局

**預估時間**: 3-4 天

**依賴**: Phase 0 完成

---

## 核心概念

### 什麼是 GlobalShell?

GlobalShell 是整個應用程式的「外殼」,負責管理跨工作區的全域狀態:

```
GlobalShell
├── 身份驗證 (誰在使用系統?)
├── 應用配置 (系統如何運作?)
├── 佈局狀態 (介面如何呈現?)
└── 路由導航 (用戶在哪裡?)
```

### 為什麼需要 GlobalShell?

1. **單一真相來源**: 所有元件都能訪問同一份用戶資訊
2. **生命週期管理**: 從登入到登出,狀態始終一致
3. **跨功能共享**: 避免在不同模組重複管理相同狀態

---

## 階段目標

### 1. 身份驗證系統

**要實現的功能**:
- 用戶登入/登出
- 自動保持登入狀態
- 身份驗證狀態監聽
- 用戶資料載入與緩存

**核心流程**:
```
用戶輸入帳密 → Firebase Auth 驗證 → 
成功 → 載入用戶資料 → 存入 GlobalShell → 導航至主頁
失敗 → 顯示錯誤訊息
```

**狀態管理**:
- authUser: 當前登入的用戶資訊
- userAccount: 完整的用戶帳號資料
- authLoading: 是否正在驗證
- authError: 錯誤訊息

**派生狀態** (自動計算):
- isAuthenticated: 是否已登入
- userDisplayName: 顯示名稱
- userInitials: 用戶縮寫 (用於頭像)

---

### 2. 應用配置管理

**要實現的功能**:
- 載入系統配置
- 功能開關管理
- 配額限制設定

**配置內容**:
```
應用配置
├── 版本資訊
├── 環境設定 (開發/正式)
├── 功能開關
│   ├── 是否允許建立工作區
│   ├── 是否啟用檔案上傳
│   └── 每個用戶最多幾個工作區
└── 配額限制
    ├── 最大檔案大小
    ├── 每個工作區最大儲存空間
    └── 每個工作區最多成員數
```

**派生狀態**:
- isProduction: 是否為正式環境
- canCreateWorkspace: 能否建立新工作區

---

### 3. 佈局狀態管理

**要實現的功能**:
- 側邊欄展開/收合
- 主題切換 (淺色/深色/自動)
- 佈局偏好持久化

**狀態內容**:
- sidebarCollapsed: 側邊欄是否收合
- theme: 當前主題設定

**派生狀態**:
- effectiveTheme: 實際使用的主題 (處理「自動」模式)

---

### 4. 路由導航追蹤

**要實現的功能**:
- 追蹤當前頁面
- 記錄上一個頁面
- 導航狀態指示

**狀態內容**:
```
導航狀態
├── currentRoute: 當前路由
├── previousRoute: 上一個路由
└── isNavigating: 是否正在導航
```

---

## Store 架構設計

### GlobalShell Store 組成

```
GlobalShellStore (NgRx Signals)
│
├── State (狀態定義)
│   ├── authUser
│   ├── userAccount
│   ├── appConfig
│   ├── sidebarCollapsed
│   ├── theme
│   └── navigation
│
├── Computed (派生狀態)
│   ├── isAuthenticated
│   ├── userDisplayName
│   ├── effectiveTheme
│   └── isInitializing
│
├── Methods (狀態變更)
│   ├── signInWithEmail()
│   ├── signOut()
│   ├── toggleSidebar()
│   ├── setTheme()
│   └── updateCurrentRoute()
│
├── Effects (副作用處理)
│   ├── initAuthListener() - 監聽 Firebase Auth
│   ├── loadUserAccount() - 載入用戶資料
│   └── loadAppConfig() - 載入應用配置
│
└── Hooks (生命週期)
    └── onInit() - Store 初始化時執行
```

### 為什麼使用 NgRx Signals?

**優勢**:
1. **響應式**: 狀態變化自動更新 UI
2. **型別安全**: TypeScript 完整支援
3. **性能優化**: 自動記憶化,避免重複計算
4. **可測試性**: 純函數,易於測試

**核心原則**:
- 狀態不可變 (Immutable)
- 單向資料流
- Computed 不能有副作用
- 使用 rxMethod 處理異步操作

---

## 資料模型

### 1. Account (帳號)

```
Account
├── 基礎資訊
│   ├── id: 唯一識別碼
│   ├── type: 類型 (user | organization | bot | subunit)
│   ├── email: 電子郵件
│   ├── displayName: 顯示名稱
│   └── photoURL: 大頭照
│
└── 偏好設定
    ├── theme: 主題
    ├── language: 語言
    └── emailNotifications: 是否接收郵件通知
```

### 2. AuthUser (身份驗證用戶)

```
AuthUser (來自 Firebase Auth)
├── uid: Firebase 用戶 ID
├── email: 電子郵件
├── displayName: 顯示名稱
├── photoURL: 大頭照
└── emailVerified: 郵件是否已驗證
```

### 3. AppConfig (應用配置)

```
AppConfig
├── version: 版本號
├── environment: 環境 (development | production)
├── features: 功能開關
└── limits: 配額限制
```

---

## 路由守衛

### Auth Guard (身份驗證守衛)

**目的**: 保護需要登入才能訪問的頁面

**邏輯**:
```
用戶嘗試訪問受保護頁面
↓
檢查 GlobalShell.isAuthenticated
↓
├── 已登入 → 允許訪問
└── 未登入 → 重定向到登入頁
```

### Guest Guard (訪客守衛)

**目的**: 防止已登入用戶訪問登入頁

**邏輯**:
```
已登入用戶嘗試訪問登入頁
↓
檢查 GlobalShell.isAuthenticated
↓
├── 已登入 → 重定向到主頁
└── 未登入 → 允許訪問登入頁
```

---

## UI 元件架構

### 1. 登入頁面

**功能**:
- 電子郵件 + 密碼輸入
- 表單驗證
- 錯誤訊息顯示
- 載入狀態指示

**流程**:
```
用戶填寫表單 → 提交 → 
GlobalShell.signInWithEmail() → 
等待響應 → 
成功/失敗處理
```

### 2. 應用外殼 (App Shell)

**結構**:
```
App Shell
├── 頂部導覽列
│   ├── Logo
│   ├── 側邊欄切換按鈕
│   └── 用戶選單
│
├── 側邊欄
│   └── (稍後階段實現)
│
└── 主要內容區
    └── <router-outlet>
```

### 3. 用戶選單

**功能**:
- 顯示用戶資訊
- 主題切換
- 登出按鈕

---

## Firestore 資料結構

### Collections (集合)

```
/accounts/{accountId}
├── id: 帳號 ID
├── type: 'user'
├── email: 電子郵件
├── displayName: 顯示名稱
├── photoURL: 大頭照
├── createdAt: 建立時間
├── updatedAt: 更新時間
└── preferences
    ├── theme: 'light' | 'dark' | 'auto'
    ├── language: 'zh-TW' | 'en-US'
    └── emailNotifications: boolean
```

### 資料流

```
Firebase Auth 用戶登入
↓
觸發 GlobalShell.initAuthListener()
↓
偵測到用戶已登入
↓
呼叫 GlobalShell.loadUserAccount(uid)
↓
從 Firestore 載入 /accounts/{uid}
↓
如果不存在 → 建立新文檔
如果存在 → 載入到 Store
↓
更新 GlobalShell.userAccount
```

---

## 狀態持久化

### 需要持久化的狀態

1. **theme (主題設定)**
   - 儲存位置: localStorage
   - 鍵名: 'theme'
   - 恢復時機: onInit

2. **Firebase Auth Session**
   - 自動由 Firebase SDK 處理
   - 使用瀏覽器內建機制

### 不需要持久化的狀態

- authUser (由 Firebase Auth 管理)
- appConfig (每次啟動重新載入)
- navigation (不需保留)

---

## 錯誤處理策略

### 身份驗證錯誤

**常見錯誤碼**:
- auth/user-not-found → "找不到此帳號"
- auth/wrong-password → "密碼錯誤"
- auth/invalid-email → "電子郵件格式無效"
- auth/too-many-requests → "嘗試次數過多,請稍後再試"

**處理方式**:
1. 捕獲 Firebase Auth 錯誤
2. 轉換為用戶友善訊息
3. 更新 GlobalShell.authError
4. 在 UI 顯示錯誤訊息

### 網路錯誤

**處理方式**:
1. 使用 RxJS catchError 捕獲
2. 提供後備值或重試邏輯
3. 記錄錯誤到 console
4. 通知用戶

---

## 測試策略

### Store 測試

**測試項目**:
1. 初始狀態正確
2. 登入後狀態更新
3. Computed 計算正確
4. 錯誤處理正確

**測試方法**:
- 使用 TestBed 配置
- Mock Firebase 服務
- 驗證狀態變化

### 元件測試

**測試項目**:
1. 表單驗證
2. 登入流程
3. 錯誤顯示
4. 導航行為

---

## 開發步驟建議

### Step 1: 建立模型與類型定義
- 定義 Account, AuthUser, AppConfig 介面
- 建立枚舉類型

### Step 2: 實現 GlobalShell Store
- 定義狀態結構
- 實現 Computed
- 實現 Methods
- 實現 Effects
- 實現 Hooks

### Step 3: 實現身份驗證 UI
- 建立登入頁面元件
- 實現表單驗證
- 連接到 Store

### Step 4: 實現路由守衛
- Auth Guard
- Guest Guard
- 配置路由

### Step 5: 實現應用外殼
- 頂部導覽列
- 用戶選單
- 主題切換

### Step 6: 測試與優化
- 單元測試
- 整合測試
- 性能優化

---

## 成功標準

### 功能完整性
✅ 用戶可以成功登入  
✅ 用戶資料正確載入  
✅ 登入狀態持久化  
✅ 路由守衛正常運作  
✅ 主題切換功能正常  
✅ 錯誤處理友善清晰  

### 程式碼品質
✅ TypeScript 無錯誤  
✅ ESLint 無警告  
✅ 測試覆蓋率 > 80%  
✅ 無記憶體洩漏  

### 用戶體驗
✅ 載入狀態清楚  
✅ 錯誤訊息友善  
✅ 響應速度快 (< 300ms)  
✅ 介面流暢無卡頓  

---

## 下一階段預告

**Phase 2**: WorkspaceList Store - 工作區列表管理

下一階段將實現:
- 工作區列表載入
- 工作區切換
- 工作區建立與管理
- 最近使用/我的最愛
