# UI Angular

💅 **Angular 前端層** — 依 [`packages/AGENTS.md`](../AGENTS.md) 的邊界，只透過 adapters/facade 使用後端 / domain 能力。開始前請用 **server-sequential-thinking** + **software-planning-mcp** 拆解任務。

## 結構（位於專案根目錄 `src/app`）
```
src/app/
├── adapters/         # Facade，封裝 @platform-adapters 呼叫
├── features/         # task / issue / finance / quality / acceptance 等功能模組（預留）
├── core/             # i18n / startup / net / guards / state
├── routes/           # 路由設定
├── shared/           # 共用 UI 元件
└── layout/           # 版面配置
```
> 新增功能時請放在 `features/`，並透過 `adapters/` 注入；避免元件直接呼叫 SDK。

## 依賴與禁制
- ✅ 可以使用 `@platform-adapters`（client 介面）、`@angular/fire`
- ❌ 禁止 `firebase-admin`
- ❌ 不直接引用 `@core-engine` / `@saas-domain` / `@account-domain`

## Access Pattern
**✅ GOOD: 使用 Facade**
```typescript
import { CoreEngineFacade } from '@app/adapters';

@Component({...})
export class TasksPage {
  private facade = inject(CoreEngineFacade);
  load(workspaceId: string) {
    return this.facade.getTasks(workspaceId);
  }
}
```

**❌ BAD: 直接依賴核心或 SDK**
```typescript
// 不要這樣做
import { EventStore } from '@core-engine';
```

## 守則
1. 介面隔離：UI 只知道 Facade，不知道具體 SDK。
2. SDK 最小化：僅允許 `@angular/fire`，其餘 SDK 交給 `platform-adapters`。
3. 文件先行：新增 feature 時同步更新 README/AGENTS 與 Mermaid 圖。
