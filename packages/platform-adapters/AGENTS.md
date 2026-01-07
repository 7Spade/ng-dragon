# platform-adapters AGENTS.md

## 目標

唯一允許使用外部 SDK 的層，負責資料庫 / 外部 API / 身分 / 訊息 / AI 介接，並將實作封裝成介面供上層使用。

## 邊界

- **依賴**：`core-engine` 抽象介面、型別；可使用外部 SDK。
- **不包含**：任何業務規則（交給 domain 層），也不直接暴露 SDK 給 UI。
- **SDK 隔離**：所有 SDK 實作集中在 `src/`，包含 `external-apis/google/genai`，禁止另起平行根目錄。

## 結構（現況 + 預備）

```
platform-adapters/
└── src/
    ├── auth/                  # 登入 / 權杖 / claims，分 admin / client 實作
    ├── ai/                    # AI/LLM 抽象 or common helpers
    ├── external-apis/
    │   └── google/
    │       └── genai/         # Google GenAI / Vertex AI 介接（placeholder src/）
    ├── messaging/             # 通知、隊列、推播
    ├── persistence/           # EventStore / Projection / DB adapter 實作
    └── __tests__/             # 介面實作的對應測試（待補）
```

> Firebase、GA、外部 HTTP、第三方 SDK 均集中於上述子資料夾，避免再出現 `@google` 平行路徑。

## SDK 規則

| 位置 | 可以用 | 禁止 | 說明 |
| --- | --- | --- | --- |
| `src/persistence` | firebase-admin / DB SDK | @angular/fire | 伺服端實作 |
| `src/auth` (admin) | firebase-admin | @angular/fire | 伺服端身份 / claims |
| `src/auth` (client) | @angular/fire | firebase-admin | 前端身份橋接 |
| `src/external-apis/google/genai` | Google GenAI / Vertex AI SDK | 其他層直連 | AI 封裝 |

## 原則

1. **單一出口**：所有 SDK 呼叫集中於 adapters，不向上暴露 SDK 型別。
2. **遵守抽象**：依 `core-engine` 的 port 介面實作；如需新 port，先在 core 定義抽象再於此層實作。
3. **文件先行**：新增 adapter 時，先更新 README/AGENTS 與對應的 Mermaid 文件節點。
