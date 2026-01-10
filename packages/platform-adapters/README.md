# Platform Adapters

🔧 **唯一允許觸碰外部 SDK 的層** — 依 [`packages/AGENTS.md`](../AGENTS.md) 邊界，實作 `core-engine` 的 ports（Firebase、DB、訊息、AI 等），供上層安全使用。開始前請先用 **server-sequential-thinking** + **software-planning-mcp** 拆解任務。

## 結構（單一入口）
```
platform-adapters/
└── src/
    ├── firebase-platform/     # firebase-admin 基礎層（app/auth/app-check/firestore/storage/observability/remote-config/messaging/pubsub）
    ├── auth/                  # admin/client 身分橋接（重用 firebase-platform auth）
    ├── messaging/             # 推播/事件 publish（重用 firebase-platform messaging & pubsub）
    ├── ai/                    # AI/LLM 抽象或共用 helper
    ├── external-apis/
    │   └── google/genai/      # Google GenAI / Vertex AI 介接
    ├── persistence/           # EventStore / Projection / DB adapter 實作
    └── __tests__/             # Adapter 測試
```
> 新增 Firebase / DB / Queue / AI 實作一律放在上述子資料夾；禁止再建立平行的 `@google` 根路徑。

## SDK 分層規則
| 位置 | 可用 | 禁止 | 適用場景 |
| --- | --- | --- | --- |
| `src/firebase-platform` | firebase-admin（app/auth/app-check/firestore/storage/remote-config/messaging/pubsub） | @angular/fire | 伺服端 SDK 基礎層（唯一 admin 入口） |
| `src/persistence` | firebase-admin / DB SDK | @angular/fire | EventStore / Projection 實作 |
| `src/external-apis/google/genai` | Google GenAI / Vertex AI SDK | 其他層直連 | AI / LLM 封裝 |

## 守則
- ❌ 不放 Domain 業務規則；只做轉接。
- ❌ 不直接暴露 SDK；向上輸出 Facade/Port 實作。
- ✅ 若缺少抽象，先到 `core-engine` 定義，再回到此層實作。
- ✅ 修改 adapter 時同步更新 README/AGENTS 與對應測試。
