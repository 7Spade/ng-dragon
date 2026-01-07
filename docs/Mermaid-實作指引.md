## 實作指引（Angular + Firebase）

### Auth 與 Session
1. 使用 `@angular/fire/auth` 登入後取得 Firebase user，呼叫後端/Callable Function 取得 memberships。
2. UI 提供 Workspace 選擇器；切換後寫入 local permission cache 並呼叫 `/projects/{id}/permissions`。
3. 將 workspaceId/moduleKey 加入所有 API/Event 請求，缺少 workspaceId 一律拒絕。

### Firestore 讀寫範例
- 讀取使用者可見專案：先讀 `accounts/{uid}.projectPermissions` → 分批查 `projects`。
- 跨專案查詢 Tasks：使用 `collectionGroup('tasks')` + `organizationId` 條件，索引預先建立。
- 事件重播：`domain_events` 依 `scope.projectId` + `timestamp` 取得，按 `traceId`/時間套用。

### Permission Service (摘要)
```typescript
@Injectable({ providedIn: 'root' })
export class ProjectPermissionService {
  private cache = signal<SessionPermissionCache | null>(null);
  constructor(private http: HttpClient, private acl: ACLService) {}

  async switchProject(projectId: string) {
    const permissions = await firstValueFrom(
      this.http.get<SessionPermissionCache>(`/api/projects/${projectId}/permissions`)
    );
    this.cache.set(permissions);
    this.acl.setFull({
      role: permissions.computed,
      ability: Object.keys(permissions.computed).filter(k => permissions.computed[k])
    });
  }

  can(action: string) {
    return this.cache()?.computed[action] ?? false;
  }
}
```

### Deployment / DevOps
- Hosting：Angular app 部署至 Firebase Hosting 或 App Hosting，Functions 同步部署。
- 環境：使用 `.env.local` 管理 Firebase config；Production 啟用 App Check、強制 HTTPS。
- 監控：啟用 Crashlytics/Performance Monitoring，Functions 設定告警追蹤寫入錯誤。
