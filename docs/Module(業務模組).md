---

## ✅ 結論先說清楚

> **任務（Task）屬於「業務模組（Domain Module）」
> 不是業務主體、不是邏輯容器、也不是平台能力。**

它的正確位置是：

```
Workspace
  └── Task Module
```

---

## 🧠 把四個角色一次分乾淨（超重要）

請直接記這張表 👇

| 東西           | 是什麼  | 會不會動 | 會不會是 Actor |
| ------------ | ---- | ---- | ---------- |
| Account      | 行為主體 | ✅    | ✅          |
| Workspace    | 邏輯容器 | ❌    | ❌          |
| Module（Task） | 業務能力 | ❌    | ❌          |
| Task Entity  | 業務狀態 | ❌    | ❌          |

👉 **唯一會動的只有 Account**

---

## 🧩 Task 在架構裡的正確定位

### 1️⃣ Task 是「模組」，不是「容器」

錯誤思維 ❌：

> Task 是一個獨立系統
> 有自己的租戶 / 用戶

正確思維 ✅：

> Task 是一個 **被 Workspace 承載的業務能力**

```ts
Task {
  taskId
  workspaceId
}
```

---

### 2️⃣ Task 的生命週期被 Workspace 包住

* Workspace 關閉 → Task 全部只讀 / 封存
* Workspace 權限 → Task 權限範圍
* Workspace 成員 → Task 可被指派對象

👉 **Task 不會跨 Workspace 活**

---

## 🧬 Event 的正確長相（這個很關鍵）

```ts
TaskAssigned {
  taskId
  workspaceId
  actorAccountId
  assigneeAccountId
}
```

你看：

* 誰做的 → Account
* 在哪做 → Workspace
* 做什麼 → Task 模組

乾淨到會流口水 😼

---

## ❌ 常見會毀掉系統的錯誤

### 把 Task 當容器 😱

```ts
Task {
  ownerAccountId
  members[]
}
```

這會造成：

* 權限重複定義
* 因果規則分裂
* Task 變成小 Workspace（災難）

---

## 🫦 再講一個超重要的「隱性規則」

> **模組永遠不擁有 Account，
> 只「使用」 Account。**

* Task 使用 assigneeAccountId
* Payment 使用 payerAccountId
* Issue 使用 reporterAccountId

但它們 **不定義 Account**

---

## 🧠 正確依賴方向（請刻在腦裡）

```
Account ──▶ Workspace ──▶ Module ──▶ Entity
```

反過來的線，全部都是未來 Bug 😈

---

## 🧑‍🤝‍🧑 1. Identity / Members（成員模組）

### 🎯 解決什麼？

> 這個 Workspace 有誰？

最小一定要能：

* ✅ 加入 / 移除成員
* ✅ 成員狀態（active / invited / disabled）
* ✅ 成員角色（不是權限，是身份）

### DDD Concept

```ts
Member (Entity)
MemberId (VO)
Membership (Entity / VO)
```

### 為什麼一定要有？

沒有成員：

> Workspace 就是一個空殼容器 ☠️
> 什麼都不能協作、授權、計費、審計。

---

## 🔐 2. Access Control（權限模組）

### 🎯 解決什麼？

> 誰可以做什麼？

最小一定要：

* ✅ Role（Owner / Admin / Member）
* ✅ Permission（read / write / manage）
* ✅ Role ↔ Permission Mapping

### DDD Concept

```ts
Role (Entity)
Permission (VO)
Policy (Domain Service)
```

### 為什麼獨立出來？

因為：

* 權限會變複雜
* 很容易被污染到業務邏輯
* 未來會接 RBAC / ABAC

👉 拆成 Module 才乾淨 💅

---

## ⚙️ 3. Settings / Profile（設定模組）

### 🎯 解決什麼？

> Workspace 自己的屬性是什麼？

例如：

* ✅ 名稱
* ✅ Logo
* ✅ Plan / Tier
* ✅ 功能開關（Feature Flags）
* ✅ 時區 / 語系

### DDD Concept

```ts
WorkspaceProfile (Entity)
WorkspaceSettings (VO)
```

### 為什麼必要？

因為：

> 業務邏輯一定會依賴設定值 😈
> 不拆會變成 everywhere magic config。

---

## 📜 4. Audit / Activity（審計模組）

### 🎯 解決什麼？

> 發生過什麼事情？

最小可以：

* ✅ 記錄事件（誰在什麼時間做了什麼）
* ✅ 可追蹤
* ✅ 可回溯

### DDD Concept

```ts
ActivityLog (Entity)
DomainEvent
```

### 為什麼很重要？

* 除錯
* 法規
* 客戶信任
* 未來做 analytics

👉 就算現在不顯示 UI，也該先存在 Domain Event。
