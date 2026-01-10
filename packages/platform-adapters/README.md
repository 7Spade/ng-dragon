# platform-adapters

> 🔌 **Infrastructure Implementation Layer** — The ONLY package allowed to use external SDKs

## Mission

Implement infrastructure ports defined in `core-engine` using external SDKs (Firebase, Google AI, databases, messaging). This is the **exclusive SDK entry point** for the entire application.

## Overview

`platform-adapters` bridges pure domain/core logic with real-world infrastructure:
- **Firebase**: Authentication, Firestore, Storage, Messaging, Pub/Sub
- **Google AI**: GenAI, Vertex AI integration
- **Persistence**: EventStore, Projection, Repository implementations
- **External APIs**: Third-party service integrations

## Folder Structure

```
platform-adapters/
└── src/
    ├── firebase-platform/      # firebase-admin base layer
    │   ├── app/               # Firebase app initialization
    │   ├── auth/              # Authentication
    │   ├── app-check/         # App Check
    │   ├── firestore/         # Firestore admin
    │   ├── storage/           # Cloud Storage
    │   ├── observability/     # Logging, monitoring
    │   ├── remote-config/     # Remote Config
    │   ├── messaging/         # Cloud Messaging
    │   └── pubsub/            # Pub/Sub
    │
    ├── auth/                  # Auth bridging (admin/client)
    │   ├── firebase-auth.adapter.ts
    │   └── auth-token.service.ts
    │
    ├── messaging/             # Push notifications, event publishing
    │   ├── fcm.adapter.ts
    │   └── pubsub.adapter.ts
    │
    ├── ai/                    # AI/LLM abstractions
    │   ├── llm.adapter.ts
    │   └── prompt.service.ts
    │
    ├── external-apis/
    │   └── google/
    │       └── genai/         # Google GenAI / Vertex AI
    │           ├── gemini.adapter.ts
    │           └── vertex-ai.adapter.ts
    │
    ├── persistence/           # Data persistence implementations
    │   ├── firestore-event-store.ts
    │   ├── firestore-account.repository.ts
    │   ├── firestore-workspace.repository.ts
    │   └── account-projection.ts
    │
    └── __tests__/             # Integration tests
        ├── firestore-event-store.spec.ts
        └── firestore-account-repository.spec.ts
```

## The Golden Rule: SDK Isolation

**Only this package may import external SDKs. All other packages must use ports/interfaces.**

| SDK Category | Allowed Here | Forbidden Elsewhere |
|-------------|-------------|-------------------|
| firebase-admin | ✅ Yes | ❌ No (domain, core, UI) |
| @google-cloud/* | ✅ Yes | ❌ No |
| Database drivers | ✅ Yes | ❌ No |
| HTTP clients | ✅ Yes | ❌ No |
| @angular/fire | ❌ No (UI only) | UI: ✅ Yes |

## Port Implementation Examples

### EventStore Implementation

```typescript
// Port defined in core-engine
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

// Implementation in platform-adapters
import { Firestore } from 'firebase-admin/firestore';
import { EventStore } from '@core-engine/ports/event-store.port';

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
    
    return snapshot.docs.map(doc => this.mapToDomainEvent(doc.data()));
  }

  private mapToDomainEvent(data: any): DomainEvent {
    // Map Firestore document to domain event
    return {
      eventId: data.eventId,
      eventType: data.eventType,
      aggregateId: data.aggregateId,
      occurredAt: data.occurredAt,
      causationId: data.causationId,
      correlationId: data.correlationId,
      ...data.payload
    };
  }
}
```

### Repository Implementation

```typescript
// Repository interface in domain
export interface AccountRepository {
  save(account: Account): Promise<void>;
  findById(id: AccountId): Promise<Account | null>;
  findByEmail(email: Email): Promise<Account | null>;
}

// Implementation in platform-adapters
import { Firestore } from 'firebase-admin/firestore';
import { AccountRepository } from '@account-domain/repositories/account.repository';

export class FirestoreAccountRepository implements AccountRepository {
  private collection = 'accounts';

  constructor(private firestore: Firestore) {}

  async save(account: Account): Promise<void> {
    const doc = this.mapToFirestoreDoc(account);
    await this.firestore
      .collection(this.collection)
      .doc(account.id.value)
      .set(doc, { merge: true });
  }

  async findById(id: AccountId): Promise<Account | null> {
    const doc = await this.firestore
      .collection(this.collection)
      .doc(id.value)
      .get();
    
    if (!doc.exists) {
      return null;
    }
    
    return this.mapToDomain(doc.data()!);
  }

  async findByEmail(email: Email): Promise<Account | null> {
    const snapshot = await this.firestore
      .collection(this.collection)
      .where('email', '==', email.value)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    return this.mapToDomain(snapshot.docs[0].data());
  }

  private mapToFirestoreDoc(account: Account): any {
    return {
      id: account.id.value,
      email: account.email.value,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: new Date().toISOString()
    };
  }

  private mapToDomain(data: any): Account {
    return Account.reconstitute(
      AccountId.create(data.id),
      Email.create(data.email),
      data.status,
      data.createdAt
    );
  }
}
```

## Anti-Patterns

### ❌ DO NOT

```typescript
// ❌ BAD - Business logic in adapter
export class FirestoreAccountRepository {
  async save(account: Account): Promise<void> {
    // NO! Business validation belongs in domain
    if (account.email.value.endsWith('@competitor.com')) {
      throw new Error('Competitor emails not allowed');
    }
    
    await this.firestore.collection('accounts').doc(account.id).set({...});
  }
}

// ❌ BAD - Returning infrastructure types
export class FirestoreAccountRepository {
  async findById(id: string): Promise<DocumentSnapshot> { // NO! Return domain object
    return await this.firestore.collection('accounts').doc(id).get();
  }
}
```

### ✅ DO

```typescript
// ✅ GOOD - Pure implementation without business logic
export class FirestoreAccountRepository implements AccountRepository {
  async save(account: Account): Promise<void> {
    // Just map and save, no business logic
    const doc = this.mapToFirestoreDoc(account);
    await this.firestore.collection('accounts').doc(account.id.value).set(doc);
  }
}

// ✅ GOOD - Always return domain objects
export class FirestoreAccountRepository {
  async findById(id: AccountId): Promise<Account | null> {
    const doc = await this.firestore.collection('accounts').doc(id.value).get();
    return doc.exists ? this.mapToDomain(doc.data()!) : null;
  }
}
```

## Testing Guidelines

```typescript
// Integration test with real Firebase (using emulator)
describe('FirestoreEventStore', () => {
  let eventStore: FirestoreEventStore;
  let firestore: Firestore;

  beforeEach(() => {
    firestore = getFirestore(); // Firebase emulator
    eventStore = new FirestoreEventStore(firestore);
  });

  afterEach(async () => {
    await clearFirestoreData(firestore);
  });

  it('should append and load events', async () => {
    const event = new AccountCreated(
      AccountId.create('acc-123'),
      Email.create('test@example.com'),
      '2024-01-01T00:00:00Z'
    );

    await eventStore.append('acc-123', 'Account', [event]);
    
    const loadedEvents = await eventStore.loadEvents('acc-123', 'Account');
    
    expect(loadedEvents).toHaveLength(1);
    expect(loadedEvents[0].eventType).toBe('AccountCreated');
  });
});
```

## Principles

1. **單一出口**: 所有 SDK 呼叫集中於 adapters，不向上暴露 SDK 型別
2. **遵守抽象**: 依 `core-engine` 的 port 介面實作
3. **純轉換**: 只做資料轉換，不含業務邏輯
4. **文件先行**: 新增 adapter 時，先更新 README/AGENTS

## Related Documentation

- [packages/AGENTS.md](../AGENTS.md) - Package boundaries
- [core-engine/README.md](../core-engine/README.md) - Port definitions
- [AGENTS.md](AGENTS.md) - AI generation guidelines

## License

MIT
