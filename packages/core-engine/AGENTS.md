# core-engine AGENTS.md

> **AI Code Generation Guidelines for CQRS/ES Infrastructure**

## Mission

Provide CQRS / Event Sourcing infrastructure (commands, queries, use-cases, ports, mappers) as pure TypeScript with **zero SDK dependencies**. Define interfaces and patterns, never implementations.

## Guardrails

### ✅ ALLOWED

- Pure TypeScript (ES2022+)
- Command/Query/Event patterns (CQRS)
- Port/Adapter pattern (define ports only)
- Use case pattern (application services)
- DTO mapping
- Domain type imports from account-domain/saas-domain
- TypeScript decorators for metadata (if needed)

### ❌ FORBIDDEN

- **Any SDK**: Firebase, Angular, HTTP clients, database drivers
- **Framework decorators**: `@Injectable`, `@Component` (except metadata decorators)
- **Business logic**: Domain rules, validations belong in domain packages
- **Concrete implementations**: Implement in platform-adapters, not here
- **Direct infrastructure**: Logging, persistence, messaging implementations

## Current + Planned Structure

```
core-engine/
└── src/
    ├── commands/          # Command definitions & handler interfaces
    │   ├── command.interface.ts
    │   ├── command-bus.interface.ts
    │   ├── command-handler.interface.ts
    │   └── create-account.command.ts
    │
    ├── queries/           # Query definitions & handler interfaces
    │   ├── query.interface.ts
    │   ├── query-bus.interface.ts
    │   ├── query-handler.interface.ts
    │   └── get-account.query.ts
    │
    ├── use-cases/         # Application services (pure TS coordination)
    │   ├── create-account.use-case.ts
    │   ├── enable-module.use-case.ts
    │   └── create-workspace.use-case.ts
    │
    ├── ports/             # Infrastructure abstraction interfaces
    │   ├── event-store.port.ts
    │   ├── projection.port.ts
    │   ├── message-bus.port.ts
    │   ├── unit-of-work.port.ts
    │   └── logger.port.ts
    │
    ├── mappers/           # DTO ↔ Domain conversion
    │   ├── account.mapper.ts
    │   ├── workspace.mapper.ts
    │   └── mapper.base.ts
    │
    ├── dtos/              # Data Transfer Objects
    │   ├── create-account.dto.ts
    │   ├── account-summary.dto.ts
    │   └── workspace-detail.dto.ts
    │
    ├── jobs/              # Background job definitions
    │   ├── job.interface.ts
    │   ├── send-welcome-email.job.ts
    │   └── generate-report.job.ts
    │
    ├── schedulers/        # Scheduling interfaces
    │   ├── scheduler.interface.ts
    │   └── cron-job.interface.ts
    │
    └── __tests__/         # Infrastructure pattern tests
        ├── command-bus.spec.ts
        ├── use-case.spec.ts
        └── mapper.spec.ts
```

> 實作端（Firebase、DB、AI）一律放在 `platform-adapters/src`，此處只定義介面與純邏輯。

## Code Generation Rules

### 1. Command Pattern

When generating a command:

```typescript
// ✅ CORRECT Pattern
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

// Command handler interface (not implementation)
export interface CreateAccountHandler extends CommandHandler<CreateAccountCommand> {
  handle(command: CreateAccountCommand): Promise<void>;
}

// ❌ INCORRECT - Business validation in command
export class CreateAccountCommand {
  constructor(public readonly email: string) {
    if (!email.includes('@')) { // NO! Validation belongs in domain
      throw new Error('Invalid email');
    }
  }
}

// ❌ INCORRECT - Implementation in core-engine
export class CreateAccountHandler {
  constructor(private firestore: Firestore) {} // NO! SDK belongs in adapters
  
  async handle(command: CreateAccountCommand) {
    await this.firestore.collection('accounts').add(...); // NO!
  }
}
```

### 2. Query Pattern

When generating a query:

```typescript
// ✅ CORRECT Pattern
export class GetAccountQuery implements Query<AccountDTO> {
  public readonly queryId: string;
  public readonly queryType = 'GetAccount';

  constructor(public readonly accountId: string) {
    this.queryId = crypto.randomUUID();
  }
}

// Query handler interface
export interface GetAccountHandler extends QueryHandler<GetAccountQuery, AccountDTO> {
  handle(query: GetAccountQuery): Promise<AccountDTO>;
}

// ❌ INCORRECT - Concrete implementation
export class GetAccountHandler {
  constructor(private db: Database) {} // NO!
  
  async handle(query: GetAccountQuery): Promise<AccountDTO> {
    const result = await this.db.query(...); // NO!
    return result;
  }
}
```

### 3. Port Pattern

When generating a port (infrastructure interface):

```typescript
// ✅ CORRECT Pattern - Interface only
export interface EventStore {
  append(
    aggregateId: string,
    aggregateType: string,
    events: DomainEvent[],
    expectedVersion?: number
  ): Promise<void>;

  loadEvents(
    aggregateId: string,
    aggregateType: string
  ): Promise<DomainEvent[]>;

  loadEventsFrom(
    aggregateId: string,
    aggregateType: string,
    fromVersion: number
  ): Promise<DomainEvent[]>;

  getAllEvents(
    fromEventId?: string,
    limit?: number
  ): Promise<DomainEvent[]>;
}

// ✅ CORRECT - Port for projection
export interface Projection<T = any> {
  readonly name: string;
  handle(event: DomainEvent): Promise<void>;
  rebuild(events: DomainEvent[]): Promise<void>;
  get(id: string): Promise<T | null>;
}

// ❌ INCORRECT - Concrete implementation
export class EventStore {
  constructor(private firestore: Firestore) {} // NO! Belongs in platform-adapters
  
  async append(/* params */) {
    await this.firestore.collection('events').add(...); // NO!
  }
}
```

### 4. Use Case Pattern

When generating a use case:

```typescript
// ✅ CORRECT Pattern - Pure coordination
export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private eventStore: EventStore,
    private idGenerator: IdGenerator,
    private clock: Clock,
    private logger: Logger
  ) {}

  async execute(command: CreateAccountCommand): Promise<void> {
    this.logger.info('Creating account', { email: command.email });

    // 1. Generate dependencies (injected)
    const accountId = this.idGenerator.generate();
    const email = Email.create(command.email);
    const createdAt = this.clock.now();

    // 2. Domain logic (aggregate handles business rules)
    const account = Account.create(accountId, email, createdAt);

    // 3. Persistence (through repository)
    await this.accountRepository.save(account);

    // 4. Event persistence
    const events = account.getDomainEvents();
    await this.eventStore.append(
      accountId.value,
      'Account',
      events
    );

    this.logger.info('Account created', { accountId: accountId.value });
  }
}

// ❌ INCORRECT - Business logic in use case
export class CreateAccountUseCase {
  async execute(command: CreateAccountCommand): Promise<void> {
    // NO! Business validation belongs in domain
    if (command.email.endsWith('@competitor.com')) {
      throw new Error('Competitor emails not allowed');
    }

    // NO! Business rule belongs in domain
    const account = new Account();
    account.email = command.email;
    account.status = 'active';
  }
}

// ❌ INCORRECT - Direct SDK usage
export class CreateAccountUseCase {
  constructor(private firestore: Firestore) {} // NO!
  
  async execute(command: CreateAccountCommand): Promise<void> {
    await this.firestore.collection('accounts').add({...}); // NO!
  }
}
```

### 5. DTO Mapper Pattern

When generating a mapper:

```typescript
// ✅ CORRECT Pattern
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

  static toDomainList(dtos: AccountDTO[]): Account[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}

// ❌ INCORRECT - Business logic in mapper
export class AccountMapper {
  static toDTO(account: Account): AccountDTO {
    // NO! Validation belongs in domain
    if (!account.email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    return {...};
  }
}

// ❌ INCORRECT - SDK usage in mapper
export class AccountMapper {
  static async toDTO(account: Account): Promise<AccountDTO> {
    // NO! Database calls belong in repository
    const userData = await firestore.collection('users').doc(account.userId).get();
    return {...};
  }
}
```

### 6. DTO Pattern

When generating a DTO:

```typescript
// ✅ CORRECT Pattern - Simple data structure
export interface AccountDTO {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

export interface CreateAccountDTO {
  email: string;
  userId: string;
}

export interface AccountSummaryDTO {
  id: string;
  email: string;
  workspaceCount: number;
  lastLoginAt?: string;
}

// ❌ INCORRECT - Methods in DTO
export class AccountDTO {
  constructor(
    public id: string,
    public email: string
  ) {}
  
  validate() { // NO! DTOs are plain data
    if (!this.email.includes('@')) {
      throw new Error('Invalid email');
    }
  }
}

// ❌ INCORRECT - Domain logic in DTO
export interface AccountDTO {
  id: string;
  email: string;
  
  suspend(): void; // NO! Methods belong in domain
}
```

### 7. Command Bus Interface Pattern

When generating command/query bus interface:

```typescript
// ✅ CORRECT Pattern - Interface only
export interface CommandBus {
  register<T extends Command>(
    commandType: string,
    handler: CommandHandler<T>
  ): void;
  
  execute<T extends Command>(command: T): Promise<void>;
}

export interface QueryBus {
  register<TQuery extends Query, TResult>(
    queryType: string,
    handler: QueryHandler<TQuery, TResult>
  ): void;
  
  execute<TQuery extends Query, TResult>(query: TQuery): Promise<TResult>;
}

// ❌ INCORRECT - Concrete implementation
export class CommandBus {
  private handlers = new Map<string, CommandHandler<any>>();
  
  register<T extends Command>(
    commandType: string,
    handler: CommandHandler<T>
  ): void {
    this.handlers.set(commandType, handler); // NO! Implementation belongs in platform-adapters
  }
}
```

## Dependency Diagram

```
core-engine (pure interfaces & coordination)
    ^
    |
    └── Uses types from: account-domain, saas-domain
    
    ↓
    
platform-adapters (concrete implementations)
```

## Testing Guidelines

### Unit Test Pattern

```typescript
// ✅ CORRECT - Test use case with mocks
describe('CreateAccountUseCase', () => {
  let useCase: CreateAccountUseCase;
  let mockRepository: jest.Mocked<AccountRepository>;
  let mockEventStore: jest.Mocked<EventStore>;
  let mockIdGenerator: jest.Mocked<IdGenerator>;
  let mockClock: jest.Mocked<Clock>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn()
    };
    
    mockEventStore = {
      append: jest.fn(),
      loadEvents: jest.fn()
    };
    
    mockIdGenerator = {
      generate: jest.fn(() => AccountId.create('test-id'))
    };
    
    mockClock = {
      now: jest.fn(() => '2024-01-01T00:00:00Z')
    };
    
    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    };
    
    useCase = new CreateAccountUseCase(
      mockRepository,
      mockEventStore,
      mockIdGenerator,
      mockClock,
      mockLogger
    );
  });

  it('should create account and persist events', async () => {
    const command = new CreateAccountCommand(
      'test@example.com',
      'user-123',
      '2024-01-01T00:00:00Z'
    );

    await useCase.execute(command);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEventStore.append).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Account created',
      expect.objectContaining({ accountId: 'test-id' })
    );
  });

  it('should log error if save fails', async () => {
    mockRepository.save.mockRejectedValue(new Error('DB error'));
    
    const command = new CreateAccountCommand(
      'test@example.com',
      'user-123',
      '2024-01-01T00:00:00Z'
    );

    await expect(useCase.execute(command)).rejects.toThrow('DB error');
  });
});

// ❌ INCORRECT - Testing implementation details
describe('CommandBus', () => {
  it('should store handlers in map', () => {
    const bus = new CommandBus();
    const handler = { handle: jest.fn() };
    
    bus.register('Test', handler);
    
    expect(bus.handlers.get('Test')).toBe(handler); // NO! Testing private implementation
  });
});
```

## Principles

1. **Pure Interfaces**: Định nghĩa abstract chỉ, không implement
2. **Coordination Only**: Điều phối domain logic, không định nghĩa business rules
3. **Zero SDK**: Không có external dependencies ngoài TypeScript stdlib và domain types
4. **Port/Adapter**: Định nghĩa ports ở đây, implement adapters trong platform-adapters
5. **Single Entry**: Tất cả code dưới `src/`, không có parallel directories

## Common Mistakes to Avoid

### ❌ Mistake 1: Business Logic in Use Case

```typescript
// ❌ BAD
export class CreateAccountUseCase {
  async execute(command: CreateAccountCommand): Promise<void> {
    // NO! Business rule belongs in domain
    if (command.email.endsWith('@competitor.com')) {
      throw new Error('Competitor emails not allowed');
    }
  }
}

// ✅ GOOD - Domain handles business rules
export class CreateAccountUseCase {
  async execute(command: CreateAccountCommand): Promise<void> {
    const email = Email.create(command.email); // Domain validates
    const account = Account.create(/* ... */); // Domain enforces rules
    await this.accountRepository.save(account);
  }
}
```

### ❌ Mistake 2: Concrete Implementation Instead of Interface

```typescript
// ❌ BAD
export class EventStore {
  constructor(private firestore: Firestore) {} // NO!
  
  async append(events: DomainEvent[]) {
    await this.firestore.collection('events').add(...); // NO!
  }
}

// ✅ GOOD - Interface only
export interface EventStore {
  append(
    aggregateId: string,
    aggregateType: string,
    events: DomainEvent[]
  ): Promise<void>;
}
```

### ❌ Mistake 3: SDK Imports

```typescript
// ❌ BAD
import { Firestore } from 'firebase-admin/firestore';
import { Injectable } from '@angular/core';

export class SomeService {
  constructor(private firestore: Firestore) {} // NO!
}

// ✅ GOOD - Only domain and stdlib imports
import { Account } from '@account-domain/aggregates/account';
import { AccountRepository } from '@account-domain/repositories/account.repository';

export class CreateAccountUseCase {
  constructor(private repository: AccountRepository) {}
}
```

## Summary Checklist

When generating code for core-engine:

- [ ] No SDK imports (Firebase, Angular, HTTP, database drivers)
- [ ] Commands/Queries use readonly properties and factory methods
- [ ] Use cases only coordinate, never implement business logic
- [ ] Ports are interfaces only (implementations in platform-adapters)
- [ ] Mappers only transform data, no business logic
- [ ] DTOs are plain data structures without methods
- [ ] Tests use mocks/test doubles for all dependencies
- [ ] No direct time/random/uuid generation (inject via interfaces)
- [ ] All types strongly typed (avoid `any` unless necessary)
- [ ] Documentation clearly states this is pure coordination layer

---

**Generated code must be pure TypeScript coordination logic. Business rules belong in domain packages, implementations belong in platform-adapters.**
