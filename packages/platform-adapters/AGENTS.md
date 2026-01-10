# platform-adapters AGENTS

> 以 [`packages/AGENTS.md`](../AGENTS.md) 為邊界；規劃工作時請先用 **server-sequential-thinking** + **software-planning-mcp** 拆解步驟。

## 角色與依賴
- 唯一允許使用外部 SDK 的層，實作 `core-engine` 的 ports（Firebase/HTTP/AI/Queue/Storage）。
- 不含任何業務規則；僅做 Domain Interface → Infra Implementation 的轉接。
- 依賴 `core-engine` 抽象，可被 `ui-angular` 透過 facade 使用。

## 結構（單一入口）
```
platform-adapters/
└── src/
    ├── firebase-platform/     # firebase-admin 基礎層 (app/auth/app-check/firestore/storage/observability/remote-config/messaging/pubsub)
    ├── auth/                  # 登入 / 權杖 / claims（重用 firebase-platform auth）
    ├── messaging/             # 推播、事件 publish（重用 firebase-platform messaging/pubsub）
    ├── ai/                    # AI/LLM 抽象 or helper
    ├── external-apis/
    │   └── google/genai/      # Google GenAI / Vertex AI 介接
    ├── persistence/           # EventStore / Projection / DB adapter 實作
    └── __tests__/             # Adapter 測試
```
> 所有 SDK 呼叫集中在上列子資料夾，禁止新增平行的 `@google` 根。

## SDK 規則
| 位置 | 可以用 | 禁止 | 說明 |
| --- | --- | --- | --- |
| `src/firebase-platform` | firebase-admin（app/auth/app-check/firestore/storage/remote-config/messaging/pubsub）、@google-cloud/pubsub | @angular/fire | 伺服端 admin SDK 唯一入口 |
| `src/persistence` | firebase-admin / DB SDK | @angular/fire | EventStore / Projection 實作 |
| `src/external-apis/google/genai` | Google GenAI / Vertex AI SDK | 其他層直連 | AI 封裝 |

## 原則
1. 單一出口：UI 只拿 Facade/Adapter，不拿 SDK 型別。
2. 遵守抽象：若需要新 adapter，先在 `core-engine` 定義 port，再在此層實作。
3. 文件先行：新增 adapter 前先更新 README/AGENTS 與 Mermaid 節點。
