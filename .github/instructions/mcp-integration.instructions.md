---
description: 'MCP 快速使用指南（重點工具）'
applyTo: '**'
---

# MCP 工具整合重點

- **Context7**：查文檔、版本差異、最佳實踐。
- **server-sequential-thinking**：產出明確步驟與風險列表。
- **software-planning-mcp**：維護 tasks.yaml、拆任務與依賴。
- **server-everything / server-filesystem**：最小化的工作區指令與檔案讀寫。
- **playwright-mcp-server**：真實瀏覽器動作、截圖、登入腳本。
- **server-time**：可信時間戳、時區計算。
- **server-fetch**：對外 HTTP 驗證或抓取輕量設定。

## 觸發原則
- 遇到不確定的 API 或版本 → 先 @context7。
- 需要拆解流程、排定下一步 → @server-sequential-thinking。
- 要同步進度或依賴 → @software-planning-mcp。
- 需要即時檢驗檔案、指令或外部 API → filesystem/everything/fetch/time。
- 驗證 UI/E2E → playwright-mcp-server，全程回傳截圖或狀態。

## 使用範例
```markdown
@context7 get-library-docs /angular/angular signals
@server-sequential-thinking 3-step plan for replay
@software-planning-mcp update task 2 status "Blocked by index"
@server-filesystem read ./README.md
@server-fetch get https://example.com/health
@playwright-mcp-server navigate https://localhost:4200
```
