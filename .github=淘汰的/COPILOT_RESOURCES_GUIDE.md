# Copilot Resources Guide (精簡版)

專注讓 Copilot 自主運用 MCP：context7、server-sequential-thinking、software-planning-mcp、server-everything、server-filesystem、playwright-mcp-server、server-time、server-fetch。

## 必備清單
- **MCP Servers**: 定義於 `.github/copilot/mcp-servers.json`。
- **工具說明**: `.github/copilot/mcp-tools.yaml`，每個工具對應使用時機。
- **任務腳本**: `.github/copilot/tasks.yaml`，示範如何在任務中呼叫 MCP。
- **運行指引**: `.github/copilot/workspace-context.yaml` 與 `.github/copilot-instructions.md`。

## 快速用法
- 查文檔：`@context7 get-library-docs /angular/angular signals`
- 拆任務：`@server-sequential-thinking 3-step plan for replay`
- 更新進度：`@software-planning-mcp update task 1 status "In Progress"`
- 檔案/命令：`@server-filesystem read ./README.md`、`@server-everything run "npm -v"`
- 外部資料：`@server-fetch get https://example.com/health`、`@server-time now`
- E2E：`@playwright-mcp-server navigate https://localhost:4200` + 截圖

保持指令簡短、回傳可驗證的結果即可。
