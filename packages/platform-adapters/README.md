# Platform Adapters

🔧 **唯一允許觸碰外部 SDK 的層** — 將 Firebase、DB、訊息、AI 等實作封裝成 `core-engine` 的 port 實作，供上層安全使用。

## 結構（現況 + 預備）

```
platform-adapters/
└── src/
    ├── firebase-platform/     # firebase-admin 基礎層（app/auth/app-check/firestore/storage/observability/remote-config/messaging/pubsub）
    ├── auth/                  # admin/client 身分橋接（現已重用 firebase-platform auth）
    ├── messaging/             # 推播/事件 publish（重用 firebase-platform messaging & pubsub）
    ├── ai/                    # AI/LLM 抽象或共用 helper
    ├── external-apis/
    │   └── google/genai/      # Google GenAI / Vertex AI 介接（placeholder src/）
    ├── persistence/           # EventStore / Projection / DB adapter 實作（含 Workspace Firestore repository）
    └── __tests__/             # Adapter 測試（待補）
```

> 未來的 Firebase / DB / Queue / AI 實作一律放在 `src/` 對應子資料夾；禁止再建立平行的 `@google` 根路徑。

## SDK 分層規則

| 位置 | 可用 | 禁止 | 適用場景 |
| --- | --- | --- | --- |
| `src/firebase-platform` | firebase-admin（app/auth/app-check/firestore/storage/remote-config/messaging/pubsub） | @angular/fire | 伺服端 SDK 基礎層（唯一 admin 入口） |
| `src/persistence` | firebase-admin / DB SDK | @angular/fire | 伺服端 EventStore / Projection 實作 |
| `src/external-apis/google/genai` | Google GenAI / Vertex AI SDK | 其他層直連 | AI / LLM 封裝 |

## Workspace persistence（Firestore）

- `WorkspaceServiceAdapter`：委派 domain WorkspaceService，並以 firebase-admin 寫入 `workspaces` 與 `workspace-events`。

## 一句話規則

> **SDK 只在這裡，其他層只拿抽象或 Facade，不直連外部服務。**

## License

MIT
