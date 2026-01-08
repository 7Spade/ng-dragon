---
name: Standard Pull Request
about: 一般修正/增強
---

### Description
# 標準 Pull Request 範本

請使用此範本提交一般變更（非重大 feature / 非 hotfix）。此 repo 為 mono-repo，請在標題與欄位中標明受影響的 package。

標題範例：
- [ui-angular] feat: 新增組件 X
- [core-engine] fix: 修正事件序列化錯誤

請填寫下列欄位：

## 變更類型
- feat / fix / docs / chore / test / refactor / perf

## 變更說明（簡短）
- 一句話描述這次變更的重點。

## 受影響的 package（列出 packages 路徑或名稱）
- 例如：ui-angular, core-engine, platform-adapters

## 變更細節（必要時）
- 更詳細的設計或實作摘要，包含重要檔案/函式的說明。

## 測試與驗證
- 本地如何重現、unit / e2e 測試狀態、手動測試步驟。

## 檢查清單
- [ ] 新增/更新對應 package 的 unit tests
- [ ] 已執行 lint（`yarn lint`）和 type-check（若適用）
- [ ] 已執行必要的 e2e 或整合測試
- [ ] 已更新相關文件（README / docs / changelog）

## 相關議題 / PR
- 連結 issue 或相關 PR

## Reviewer 注意事項
- 需要特別注意的風險、相依性或 migration 步驟

---
請保持 PR 小且單一職責；若改動跨多個 package，請考慮拆成多個 PR。若為大型設計變更，請先開 RFC 或設計討論 PR。
- [ ] ESLint / Prettier
### Notes
