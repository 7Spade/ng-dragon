# saas-domain AGENTS.md

> **AI Code Generation Guidelines for SaaS Business Domain**

## Mission

Model SaaS business modules (Task, Issue, Finance, Quality, Acceptance) as pure TypeScript, depending only on `account-domain`.

## Guardrails

### ✅ ALLOWED
- Pure TypeScript (ES2022+)
- DDD patterns (Aggregates, Entities, VOs)
- account-domain types
- Module dependency policies
- Repository interfaces

### ❌ FORBIDDEN
- Any SDK (Firebase, Angular, HTTP, etc.)
- Workspace creation (belongs to account-domain)
- Direct cross-module references (use events)
- Infrastructure code

## Code Generation Rules

### Module Aggregate Pattern

```typescript
// ✅ CORRECT
export class Task extends AggregateRoot {
  private constructor(
    public readonly id: TaskId,
    public readonly workspaceId: WorkspaceId,
    private status: TaskStatus,
    private assigneeId?: UserId
  ) {
    super();
  }

  static create(/* params */): Task {
    const task = new Task(/* params */);
    task.addDomainEvent(new TaskCreated(/* params */));
    return task;
  }

  assign(userId: UserId): void {
    // Business rule validation
    this.assigneeId = userId;
    this.addDomainEvent(new TaskAssigned(this.id, userId));
  }
}

// ❌ INCORRECT - Creating workspace
export class Task {
  createWorkspace() { // NO! Belongs to account-domain
    return new Workspace(...);
  }
}
```

## Module Dependency Policy

```typescript
// ✅ CORRECT - Define dependencies
export class ModuleDependencyPolicy {
  private static dependencies = new Map<ModuleType, ModuleType[]>([
    [ModuleType.Finance, [ModuleType.Task]],
    [ModuleType.Quality, [ModuleType.Issue]],
  ]);

  static canEnableModule(
    moduleType: ModuleType,
    enabledModules: Set<ModuleType>
  ): boolean {
    const required = this.dependencies.get(moduleType) || [];
    return required.every(dep => enabledModules.has(dep));
  }
}
```

## Summary Checklist

- [ ] No SDK imports
- [ ] Only depends on account-domain
- [ ] No workspace creation
- [ ] Cross-module communication via events only
- [ ] Module dependency policies defined
- [ ] All aggregates emit domain events

---

**SaaS business logic stays pure, workspace management stays in account-domain.**
