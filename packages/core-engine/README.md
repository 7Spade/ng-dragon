# core-engine

> ⚡ **Pure TypeScript CQRS / Event Sourcing Infrastructure** — Zero framework dependencies, pure coordination patterns

## Mission

Provide CQRS / Event Sourcing infrastructure (commands, events, aggregates, projections, scheduling, jobs) as pure TypeScript with **zero SDK dependencies**.

## Overview

`core-engine` is the neural center of the application, orchestrating domain logic through commands, queries, and events. It defines **interfaces and patterns** but **never implements** infrastructure concerns (those belong in `platform-adapters`).

**Core Principle**: This layer handles **"flow"**, not **"meaning"**. Business rules live in domain packages.

## Folder Structure

```
core-engine/
└── src/
    ├── commands/      # Command definitions & handler interfaces
    │   ├── command.interface.ts
    │   ├── command-bus.interface.ts
    │   └── command-handler.interface.ts
    │
    ├── queries/       # Query definitions & handler interfaces
    │   ├── query.interface.ts
    │   ├── query-bus.interface.ts
    │   └── query-handler.interface.ts
    │
    ├── use-cases/     # Application services / handlers (pure TS)
    │   ├── create-account.use-case.ts
    │   └── enable-module.use-case.ts
    │
    ├── ports/         # Infrastructure abstraction interfaces
    │   ├── event-store.port.ts
    │   ├── projection.port.ts
    │   ├── message-bus.port.ts
    │   └── unit-of-work.port.ts
    │
    ├── mappers/       # DTO ↔ Domain object conversion
    │   ├── account.mapper.ts
    │   └── workspace.mapper.ts
    │
    ├── dtos/          # Data Transfer Objects
    │   ├── create-account.dto.ts
    │   └── workspace-summary.dto.ts
    │
    ├── jobs/          # Background job definitions
    │   ├── job.interface.ts
    │   └── send-welcome-email.job.ts
    │
    ├── schedulers/    # Scheduling interfaces
    │   └── scheduler.interface.ts
    │
    └── __tests__/     # Core behavior tests
        ├── command-bus.spec.ts
        └── event-store.spec.ts
```

**All code lives under `src/`** for single entry point—no parallel root directories.

## Core Responsibilities

### 1. Command Bus Pattern

Commands represent user intent and trigger state changes.

```typescript
// Command interface
export interface Command {
  readonly commandId: string;
  readonly commandType: string;
  readonly timestamp: string;
  readonly userId: string;
}

// Command handler interface
export interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}

// Command bus interface
export interface CommandBus {
  register<T extends Command>(
    commandType: string,
    handler: CommandHandler<T>
  ): void;
  execute<T extends Command>(command: T): Promise<void>;
}
```

**Example Command**:

```typescript
export class CreateAccountCommand implements Command {
  public readonly commandId: string;
  public readonly commandType = 'CreateAccount';
  public readonly timestamp: string;

  constructor(
    public readonly email: string,
    public readonly userId: string,
    timestamp: string
  ) {
    this.commandId = crypto.randomUUID();
    this.timestamp = timestamp;
  }
}
```

### 2. Query Bus Pattern

Queries read data without side effects.

```typescript
// Query interface
export interface Query<T = any> {
  readonly queryId: string;
  readonly queryType: string;
}

// Query handler interface
export interface QueryHandler<TQuery extends Query, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

// Query bus interface
export interface QueryBus {
  register<TQuery extends Query, TResult>(
    queryType: string,
    handler: QueryHandler<TQuery, TResult>
  ): void;
  execute<TQuery extends Query, TResult>(query: TQuery): Promise<TResult>;
}
```

**Example Query**:

```typescript
export class GetAccountQuery implements Query<AccountDTO> {
  public readonly queryId: string;
  public readonly queryType = 'GetAccount';

  constructor(public readonly accountId: string) {
    this.queryId = crypto.randomUUID();
  }
}
```

### 3. Event Store Port

Abstract interface for event persistence.

```typescript
export interface EventStore {
  // Append events to an aggregate stream
  append(
    aggregateId: string,
    aggregateType: string,
    events: DomainEvent[],
    expectedVersion?: number
  ): Promise<void>;

  // Load all events for an aggregate
  loadEvents(
    aggregateId: string,
    aggregateType: string
  ): Promise<DomainEvent[]>;

  // Load events from specific version
  loadEventsFrom(
    aggregateId: string,
    aggregateType: string,
    fromVersion: number
  ): Promise<DomainEvent[]>;

  // Get all events (for projections)
  getAllEvents(
    fromEventId?: string,
    limit?: number
  ): Promise<DomainEvent[]>;
}
```

### 4. Projection Port

Abstract interface for read models.

```typescript
export interface Projection<T = any> {
  // Project name for tracking
  readonly name: string;

  // Handle a domain event
  handle(event: DomainEvent): Promise<void>;

  // Rebuild projection from scratch
  rebuild(events: DomainEvent[]): Promise<void>;

  // Get projection state
  get(id: string): Promise<T | null>;
}
```

### 5. Unit of Work Pattern

Manages transactional boundaries.

```typescript
export interface UnitOfWork {
  // Begin a transaction
  begin(): Promise<void>;

  // Commit all changes
  commit(): Promise<void>;

  // Rollback all changes
  rollback(): Promise<void>;

  // Add aggregate to track
  registerAggregate(aggregate: AggregateRoot): void;

  // Get tracked aggregates
  getAggregates(): AggregateRoot[];
}
```

### 6. Use Case Pattern

Application services coordinate domain logic.

```typescript
// ✅ CORRECT - Pure coordination logic
export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private eventStore: EventStore,
    private idGenerator: IdGenerator,
    private clock: Clock
  ) {}

  async execute(command: CreateAccountCommand): Promise<void> {
    // 1. Generate ID and timestamp (injected dependencies)
    const accountId = this.idGenerator.generate();
    const email = Email.create(command.email);
    const createdAt = this.clock.now();

    // 2. Create aggregate (domain logic)
    const account = Account.create(accountId, email, createdAt);

    // 3. Save aggregate
    await this.accountRepository.save(account);

    // 4. Persist events
    const events = account.getDomainEvents();
    await this.eventStore.append(
      accountId.value,
      'Account',
      events
    );
  }
}

// ❌ INCORRECT - Business logic in use case
export class CreateAccountUseCase {
  async execute(command: CreateAccountCommand): Promise<void> {
    // NO! Validation belongs in domain
    if (!command.email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    // NO! Business rule belongs in domain
    if (command.email.endsWith('@competitor.com')) {
      throw new Error('Competitor emails not allowed');
    }
  }
}
```

## Port/Adapter Pattern Examples

### EventStore Port Definition (core-engine)

```typescript
// In core-engine/src/ports/event-store.port.ts
export interface EventStore {
  append(
    aggregateId: string,
    aggregateType: string,
    events: DomainEvent[]
  ): Promise<void>;
  
  loadEvents(
    aggregateId: string,
    aggregateType: string
  ): Promise<DomainEvent[]>;
}
```

### EventStore Adapter Implementation (platform-adapters)

```typescript
// In platform-adapters/src/persistence/firestore-event-store.ts
import { EventStore } from '@core-engine/ports/event-store.port';
import { Firestore } from 'firebase-admin/firestore';

export class FirestoreEventStore implements EventStore {
  constructor(private firestore: Firestore) {}

  async append(
    aggregateId: string,
    aggregateType: string,
    events: DomainEvent[]
  ): Promise<void> {
    const batch = this.firestore.batch();
    
    events.forEach(event => {
      const eventDoc = this.firestore
        .collection('events')
        .doc(event.eventId);
      
      batch.set(eventDoc, {
        ...event,
        aggregateId,
        aggregateType,
        savedAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
  }

  async loadEvents(
    aggregateId: string,
    aggregateType: string
  ): Promise<DomainEvent[]> {
    const snapshot = await this.firestore
      .collection('events')
      .where('aggregateId', '==', aggregateId)
      .where('aggregateType', '==', aggregateType)
      .orderBy('occurredAt', 'asc')
      .get();
    
    return snapshot.docs.map(doc => doc.data() as DomainEvent);
  }
}
```

## DTO Mapper Pattern

Mappers convert between domain objects and DTOs.

```typescript
// ✅ CORRECT - Mapper in core-engine
export class AccountMapper {
  static toDTO(account: Account): AccountDTO {
    return {
      id: account.id.value,
      email: account.email.value,
      status: account.status,
      createdAt: account.createdAt
    };
  }

  static toDomain(dto: AccountDTO): Account {
    return Account.reconstitute(
      AccountId.create(dto.id),
      Email.create(dto.email),
      dto.status as AccountStatus,
      dto.createdAt
    );
  }
}
```

## Dependency Diagram

```
core-engine (abstract interfaces)
    ↓ implements
platform-adapters (concrete implementations)
    ↓ uses
account-domain / saas-domain (domain logic)
```

## Allowed Dependencies

| Can Import | Example |
|-----------|---------|
| TypeScript stdlib | `crypto`, `Promise`, etc. |
| Domain types | `Account`, `Workspace`, `Email` from `@account-domain` |
| Domain events | `AccountCreated` from `@account-domain/events` |

## Forbidden Dependencies

| Cannot Import | Why |
|--------------|-----|
| Any SDK | Infrastructure concern |
| Angular | Framework dependency |
| Firebase | Infrastructure concern |
| HTTP clients | Infrastructure concern |
| Database drivers | Infrastructure concern |

## Anti-Patterns

### ❌ DO NOT

```typescript
// ❌ BAD - Business logic in command handler
export class CreateAccountHandler implements CommandHandler<CreateAccountCommand> {
  async handle(command: CreateAccountCommand): Promise<void> {
    // NO! Business rule belongs in domain
    if (command.email.endsWith('@competitor.com')) {
      throw new Error('Competitor emails not allowed');
    }
  }
}

// ❌ BAD - SDK import
import { Firestore } from 'firebase-admin/firestore';

export class EventStore {
  constructor(private firestore: Firestore) {} // NO! Belongs in platform-adapters
}

// ❌ BAD - Direct implementation instead of interface
export class CommandBus {
  private handlers = new Map();
  
  async execute(command: Command) {
    const handler = this.handlers.get(command.commandType);
    await handler.handle(command); // NO! Define interface only
  }
}
```

### ✅ DO

```typescript
// ✅ GOOD - Pure interface
export interface CommandBus {
  register<T extends Command>(
    commandType: string,
    handler: CommandHandler<T>
  ): void;
  execute<T extends Command>(command: T): Promise<void>;
}

// ✅ GOOD - Use case with pure coordination
export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private eventStore: EventStore
  ) {}

  async execute(command: CreateAccountCommand): Promise<void> {
    // Pure coordination - no business logic
    const account = Account.create(/* ... */);
    await this.accountRepository.save(account);
    await this.eventStore.append(/* ... */);
  }
}

// ✅ GOOD - Port definition (implementation in platform-adapters)
export interface EventStore {
  append(
    aggregateId: string,
    aggregateType: string,
    events: DomainEvent[]
  ): Promise<void>;
}
```

## Testing Guidelines

```typescript
// ✅ Pure unit test with test doubles
describe('CreateAccountUseCase', () => {
  it('should create account and save events', async () => {
    // Arrange
    const mockRepository: AccountRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn()
    };
    
    const mockEventStore: EventStore = {
      append: jest.fn(),
      loadEvents: jest.fn()
    };
    
    const useCase = new CreateAccountUseCase(
      mockRepository,
      mockEventStore,
      new TestIdGenerator(),
      new TestClock()
    );
    
    const command = new CreateAccountCommand(
      'test@example.com',
      'user-123',
      '2024-01-01T00:00:00Z'
    );
    
    // Act
    await useCase.execute(command);
    
    // Assert
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEventStore.append).toHaveBeenCalledTimes(1);
  });
});
```

## Principles

1. **Pure Interfaces**: Only define abstractions, never implementations
2. **Coordination Only**: Orchestrate domain logic, don't define business rules
3. **Zero SDK**: No external dependencies beyond TypeScript stdlib and domain types
4. **Port/Adapter**: Define ports here, implement adapters in platform-adapters
5. **Single Entry**: All code under `src/`, no parallel directories

## Planned Additions

- Saga / Process Manager patterns for complex workflows
- Event replay functionality
- Snapshot support for performance optimization
- Distributed tracing interfaces

## Related Documentation

- [packages/AGENTS.md](../AGENTS.md) - Package boundary rules
- [packages/README.md](../README.md) - Monorepo architecture
- [AGENTS.md](AGENTS.md) - AI generation guidelines for this package
- [platform-adapters/README.md](../platform-adapters/README.md) - Port implementations

## License

MIT
