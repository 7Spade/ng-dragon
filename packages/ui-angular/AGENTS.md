# ui-angular AGENTS.md

> **AI Code Generation Guidelines for Angular Frontend**

## Mission

Provide Angular frontend using facades to access backend. Never directly use `core-engine`, `firebase-admin`, or domain packages.

## Guardrails

### ✅ ALLOWED
- @angular/* packages
- @angular/fire (client SDK)
- platform-adapters facades
- DTOs for data display
- Angular Material, NG-ZORRO

### ❌ FORBIDDEN
- firebase-admin (server SDK)
- Direct @core-engine imports
- Direct @account-domain imports
- Direct @saas-domain imports
- Business logic in components

## Code Generation Rules

### Component Pattern

```typescript
// ✅ CORRECT - Using facade
@Component({
  selector: 'app-tasks-page',
  template: `
    <div *ngFor="let task of tasks$ | async">
      {{ task.title }}
    </div>
    <button (click)="createTask()">New Task</button>
  `
})
export class TasksPageComponent implements OnInit {
  private facade = inject(TasksFacade);
  
  tasks$!: Observable<TaskDTO[]>;

  ngOnInit() {
    this.tasks$ = this.facade.getTasks(this.workspaceId);
  }

  createTask() {
    this.facade.createTask('New Task', 'Description');
  }
}

// ❌ INCORRECT - Direct Firestore
@Component({...})
export class TasksPageComponent {
  private firestore = inject(Firestore);
  
  ngOnInit() {
    // NO! Use facade
    this.tasks$ = collectionData(
      collection(this.firestore, 'tasks')
    );
  }
}
```

### Facade Pattern

```typescript
// ✅ CORRECT - Facade in adapters/
@Injectable({ providedIn: 'root' })
export class TasksFacade {
  constructor(
    private taskService: TaskService, // From platform-adapters
    private commandBus: CommandBus // From platform-adapters
  ) {}

  getTasks(workspaceId: string): Observable<TaskDTO[]> {
    return this.taskService.getTasks(workspaceId);
  }

  createTask(title: string, description: string): Promise<void> {
    const command = new CreateTaskCommand(title, description);
    return this.commandBus.execute(command);
  }
}
```

## Summary Checklist

- [ ] Components use facades, not direct SDK
- [ ] Only DTOs in templates, not domain objects
- [ ] @angular/fire allowed for auth only
- [ ] No firebase-admin imports
- [ ] No direct core-engine/domain imports
- [ ] Tests mock facades

---

**UI accesses backend through facades—clean separation, zero domain coupling.**
