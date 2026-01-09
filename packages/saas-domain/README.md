# SaaS Domain

🏢 **SaaS 業務模型（純 TypeScript，零 SDK）**

> 依賴 `account-domain`（身份 / 工作區 / 模組啟用），所有程式碼集中於 `src/`。

## 結構（現況 + 預備）

```
saas-domain/
└── src/
    ├── aggregates/        # task / issue / finance / quality / acceptance 等聚合（預留）
    ├── value-objects/     # 模組 VO
    ├── events/            # 模組事件
    ├── domain-services/   # 無狀態的跨聚合邏輯
    ├── repositories/      # 介面定義
    ├── entities/          # 共享 Entity 型別
    ├── policies/          # 模組依賴 / 啟用檢查
    └── __tests__/         # 測試（新增實作時補齊）
```

> 新增模組時，直接落在上述子資料夾，避免再產生平行根目錄；若新增 task/issue/finance/quality/acceptance，請同步更新 README/AGENTS 與 Mermaid 文件。

## 原則

- ❌ 禁止引入 Angular / Firebase / 任何 SDK
- ✅ 僅依賴 `account-domain` 前置邏輯
- ✅ 單一入口 `src/`，新增前先更新文件，保持對齊架構圖

## 依賴

```
account-domain -> saas-domain -> ui-angular (透過 adapters)
```

## License

MIT
