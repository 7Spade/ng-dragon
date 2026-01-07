## Mandatory Reasoning & Memory

1. **Sequential-Thinking**：明確列步驟、逐步驗證。
2. **Software-Planning-Tool**：先寫計畫、列依賴與測試策略。
3. **Copilot Memory**：復用既有慣例並存回新的重點。

## MCP 使用優先序
- @context7 查文檔/升級差異。
- @server-sequential-thinking 拆解與排程。
- @software-planning-mcp 維護 tasks.yaml。
- @server-everything / @server-filesystem 做最小命令與檔案操作。
- @server-fetch / @server-time 拿外部資料或時間戳。
- @playwright-mcp-server 驗證 UI/E2E，務必附截圖或 DOM 狀態。

## Constraints
- 非 Markdown 單檔內容 < **4000 UTF-8 字元**。
- 程式碼需通過 ESLint + Prettier，使用 TypeScript 風格。

## Deliverables
- 可執行的程式碼與最小拆分說明。

## Playwright MCP 登入腳本
1. `playwright_navigate` 至登入頁。
2. `playwright_wait_for_selector` 等表單可見。
3. `playwright_fill` email=`ac7x@pm.me`。
4. `playwright_fill` password=`123123`。
5. `playwright_click` 送出並等待登入後頁面可見。
6. 如需驗證，截圖或取得 DOM 狀態。

## Playwright MCP 工具
使用 `playwright_*` 進行所有瀏覽器操作；不得假設瀏覽器行為，失敗需重跑至成功。
