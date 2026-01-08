# Copilot Resources Summary

目標：把 Copilot 聚焦在 MCP 工作流。

## 重要資產
- `.github/copilot/mcp-servers.json`：啟用 context7、server-sequential-thinking、software-planning-mcp、server-everything、server-filesystem、playwright-mcp-server、server-time、server-fetch。
- `.github/copilot/mcp-tools.yaml`：何時呼叫上述工具。
- `.github/copilot/tasks.yaml`：任務模板與 MCP 提示。
- `.github/copilot/workspace-context.yaml`：專案與技術背景。
- `.github/instructions/mcp-integration.instructions.md`：全域約束與 MCP 觸發原則。
- `.github/instructions/angular.instructions.md`：Angular 20 寫作與最佳實務指引。

## 使用提示
- 先查文檔再動手：`@context7 ...`
- 遇到流程/拆解：`@server-sequential-thinking`
- 記錄進度：`@software-planning-mcp`
- 檔案/命令/時間/外部 API：filesystem、everything、time、fetch。
- UI 驗證：`@playwright-mcp-server` 並附截圖。

保持回應短、可操作，避免冗長敘述。
