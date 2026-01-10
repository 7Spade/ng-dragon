# saas-domain

> 🏢 **SaaS Business Domain** — Pure TypeScript business models for tasks, issues, finance, quality, and acceptance

## Mission

Model SaaS business capabilities (Tasks, Issues, Finance, Quality, Acceptance) that extend account-domain foundations. This package must remain **pure TypeScript** with dependencies **only on account-domain**.

## Overview

`saas-domain` contains the pluggable business modules that run within workspaces. Each module is independently enabled/disabled and may have dependencies on other modules.

## Module Architecture

```
saas-domain/
└── src/
    ├── aggregates/         # Business module aggregates
    │   ├── task/
    │   │   ├── task.aggregate.ts
    │   │   └── task-list.aggregate.ts
    │   ├── issue/
    │   │   ├── issue.aggregate.ts
    │   │   └── issue-tracker.aggregate.ts
    │   ├── finance/
    │   │   ├── payment.aggregate.ts
    │   │   └── invoice.aggregate.ts
    │   ├── quality/
    │   │   └── quality-metric.aggregate.ts
    │   └── acceptance/
    │       └── acceptance-criteria.aggregate.ts
    │
    ├── value-objects/      # Module-specific VOs
    │   ├── task-status.vo.ts
    │   ├── priority.vo.ts
    │   ├── currency.vo.ts
    │   └── issue-severity.vo.ts
    │
    ├── events/             # Module events
    │   ├── task-created.event.ts
    │   ├── task-completed.event.ts
    │   ├── issue-resolved.event.ts
    │   └── payment-processed.event.ts
    │
    ├── domain-services/    # Cross-aggregate stateless logic
    │   ├── task-assignment.service.ts
    │   └── payment-calculation.service.ts
    │
    ├── repositories/       # Interface definitions
    │   ├── task.repository.ts
    │   ├── issue.repository.ts
    │   └── payment.repository.ts
    │
    ├── entities/           # Shared entities
    │   ├── attachment.entity.ts
    │   └── comment.entity.ts
    │
    ├── policies/           # Module dependency rules
    │   ├── module-dependency.policy.ts
    │   └── module-enablement.policy.ts
    │
    └── __tests__/          # Module tests
        ├── task.aggregate.spec.ts
        └── payment.aggregate.spec.ts
```

## Module Dependency Rules

Modules may depend on each other:

```typescript
export class ModuleDependencyPolicy {
  private static dependencies = new Map<ModuleType, ModuleType[]>([
    [ModuleType.Finance, [ModuleType.Task]], // Finance requires Task module
    [ModuleType.Quality, [ModuleType.Issue]], // Quality requires Issue module
    [ModuleType.Acceptance, [ModuleType.Task]], // Acceptance requires Task module
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

## Module Examples

### Task Module

```typescript
export class Task extends AggregateRoot {
  private constructor(
    public readonly id: TaskId,
    public readonly workspaceId: WorkspaceId,
    private title: string,
    private description: string,
    private status: TaskStatus,
    private priority: Priority,
    private assigneeId?: UserId,
    public readonly createdAt: string
  ) {
    super();
  }

  static create(
    id: TaskId,
    workspaceId: WorkspaceId,
    title: string,
    description: string,
    priority: Priority,
    createdAt: string
  ): Task {
    const task = new Task(
      id,
      workspaceId,
      title,
      description,
      TaskStatus.Open,
      priority,
      undefined,
      createdAt
    );
    task.addDomainEvent(new TaskCreated(id, workspaceId, title, createdAt));
    return task;
  }

  assign(assigneeId: UserId): void {
    if (this.assigneeId && this.assigneeId.equals(assigneeId)) {
      throw new DomainError('Task already assigned to this user');
    }
    const previousAssignee = this.assigneeId;
    this.assigneeId = assigneeId;
    this.addDomainEvent(
      new TaskAssigned(this.id, this.workspaceId, assigneeId, previousAssignee)
    );
  }

  complete(): void {
    if (this.status === TaskStatus.Completed) {
      throw new DomainError('Task already completed');
    }
    this.status = TaskStatus.Completed;
    this.addDomainEvent(new TaskCompleted(this.id, this.workspaceId));
  }
}
```

### Payment Module (Finance)

```typescript
export class Payment extends AggregateRoot {
  private constructor(
    public readonly id: PaymentId,
    public readonly workspaceId: WorkspaceId,
    private amount: Money,
    private status: PaymentStatus,
    public readonly createdAt: string
  ) {
    super();
  }

  static create(
    id: PaymentId,
    workspaceId: WorkspaceId,
    amount: Money,
    createdAt: string
  ): Payment {
    const payment = new Payment(
      id,
      workspaceId,
      amount,
      PaymentStatus.Pending,
      createdAt
    );
    payment.addDomainEvent(
      new PaymentCreated(id, workspaceId, amount, createdAt)
    );
    return payment;
  }

  process(): void {
    if (this.status !== PaymentStatus.Pending) {
      throw new DomainError('Only pending payments can be processed');
    }
    this.status = PaymentStatus.Processing;
    this.addDomainEvent(new PaymentProcessing(this.id, this.workspaceId));
  }

  complete(): void {
    if (this.status !== PaymentStatus.Processing) {
      throw new DomainError('Only processing payments can be completed');
    }
    this.status = PaymentStatus.Completed;
    this.addDomainEvent(
      new PaymentCompleted(this.id, this.workspaceId, this.amount)
    );
  }
}
```

## Value Objects

```typescript
// TaskStatus value object
export class TaskStatus {
  private constructor(public readonly value: string) {}

  static readonly Open = new TaskStatus('open');
  static readonly InProgress = new TaskStatus('in_progress');
  static readonly Completed = new TaskStatus('completed');
  static readonly Cancelled = new TaskStatus('cancelled');

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }
}

// Money value object for Finance module
export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: Currency
  ) {
    this.validate();
  }

  static create(amount: number, currency: Currency): Money {
    return new Money(amount, currency);
  }

  private validate(): void {
    if (this.amount < 0) {
      throw new DomainError('Amount cannot be negative');
    }
  }

  add(other: Money): Money {
    if (!this.currency.equals(other.currency)) {
      throw new DomainError('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return (
      this.amount === other.amount && this.currency.equals(other.currency)
    );
  }
}
```

## Anti-Patterns

### ❌ DO NOT

```typescript
// ❌ BAD - Creating workspace in saas-domain
export class Task {
  createWorkspace() { // NO! Workspace belongs to account-domain
    return new Workspace(...);
  }
}

// ❌ BAD - SDK usage
import { Firestore } from 'firebase-admin/firestore';
export class Task {
  async save() {
    await Firestore().collection('tasks').add(this); // NO!
  }
}

// ❌ BAD - Accessing other modules directly
export class Task {
  linkToPayment(paymentId: string) {
    const payment = new Payment(...); // NO! Cross-module via events only
  }
}
```

### ✅ DO

```typescript
// ✅ GOOD - Pure business aggregate
export class Task extends AggregateRoot {
  complete(): void {
    if (this.status === TaskStatus.Completed) {
      throw new DomainError('Task already completed');
    }
    this.status = TaskStatus.Completed;
    this.addDomainEvent(new TaskCompleted(this.id, this.workspaceId));
  }
}

// ✅ GOOD - Module dependency via policy
export class ModuleDependencyPolicy {
  static canEnableModule(
    moduleType: ModuleType,
    enabledModules: Set<ModuleType>
  ): boolean {
    const required = this.dependencies.get(moduleType) || [];
    return required.every(dep => enabledModules.has(dep));
  }
}
```

## Testing Guidelines

```typescript
describe('Task', () => {
  it('should complete open task and emit event', () => {
    const task = Task.reconstitute(
      TaskId.create('task-123'),
      WorkspaceId.create('ws-123'),
      'Test Task',
      'Description',
      TaskStatus.Open,
      Priority.High,
      undefined,
      '2024-01-01T00:00:00Z'
    );

    task.complete();

    expect(task.status).toBe(TaskStatus.Completed);
    const events = task.getDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(TaskCompleted);
  });
});
```

## Principles

1. **依賴前置**: 所有模組操作需先確認 account-domain 的工作區與模組啟用狀態
2. **純業務**: 不得引入任何 SDK；資料存取交給 `platform-adapters` 實作 port
3. **文件先行**: 新增模組前，先更新 README/AGENTS 及 Mermaid 文件的模組樹
4. **模組獨立**: 各模組獨立開發，透過事件溝通

## Related Documentation

- [packages/AGENTS.md](../AGENTS.md) - Package boundaries
- [account-domain/README.md](../account-domain/README.md) - Identity domain
- [AGENTS.md](AGENTS.md) - AI generation guidelines

## License

MIT
