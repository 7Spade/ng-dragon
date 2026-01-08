# Platform Adapters

🔧 **唯一允許觸碰外部 SDK 的層** — 將 Firebase、DB、訊息、AI 等實作封裝成 `core-engine` 的 port 實作，供上層安全使用。

## 結構（現況 + 預備）

```
platform-adapters/
└── src/
    ├── firebase-platform/     # firebase-admin 基礎層（app/auth/firestore/storage/observability）
    ├── auth/                  # admin/client 身分橋接（可遷移重用 firebase-platform）
    ├── messaging/             # 通知、推播、佇列
    ├── ai/                    # AI/LLM 抽象或共用 helper
    ├── external-apis/
    │   └── google/genai/      # Google GenAI / Vertex AI 介接（placeholder src/）
    ├── persistence/           # EventStore / Projection / DB adapter 實作
    └── __tests__/             # Adapter 測試（待補）
```

> 未來的 Firebase / DB / Queue / AI 實作一律放在 `src/` 對應子資料夾；禁止再建立平行的 `@google` 根路徑。

## SDK 分層規則

| 位置 | 可用 | 禁止 | 適用場景 |
| --- | --- | --- | --- |
| `src/firebase-platform` | firebase-admin（app/auth/firestore/storage/app-check/observability） | @angular/fire | 伺服端 SDK 基礎層 |
| `src/persistence` | firebase-admin / DB SDK | @angular/fire | 伺服端 EventStore / Projection 實作 |
| `src/auth` (admin) | firebase-admin | @angular/fire | 伺服端 claims / 用戶管理 |
| `src/auth` (client) | @angular/fire | firebase-admin | 前端登入 / token 取得 |
| `src/external-apis/google/genai` | Google GenAI / Vertex AI SDK | 其他層直連 | AI / LLM 封裝 |

## 依賴

- ✅ 可依賴 `@core-engine` 定義的 port / 型別
- ✅ 可使用第三方 SDK
- ❌ 不含業務規則（交給 domain 層）
- ❌ 不直接暴露 SDK 至 `ui-angular`，改以 Facade / Adapter 輸出

## 一句話規則

> **SDK 只在這裡，其他層只拿抽象或 Facade，不直連外部服務。**

## License

MIT
