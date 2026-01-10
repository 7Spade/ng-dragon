# platform-adapters AGENTS.md

> **AI Code Generation Guidelines for Infrastructure Adapters**

## Mission

Implement infrastructure ports using external SDKs. **The only package allowed to import SDKs.**

## Guardrails

### ✅ ALLOWED
- All external SDKs (firebase-admin, @google-cloud/*, etc.)
- Port implementations from core-engine
- Data mapping and transformation
- Technical error handling

### ❌ FORBIDDEN
- Business logic (leave to domain)
- Domain validation rules
- Returning SDK-specific types to callers
- Cross-module business decisions

## Code Generation Rules

### Repository Implementation Pattern

```typescript
// ✅ CORRECT - Pure implementation
export class FirestoreAccountRepository implements AccountRepository {
  constructor(private firestore: Firestore) {}

  async save(account: Account): Promise<void> {
    const doc = this.mapToFirestoreDoc(account);
    await this.firestore.collection('accounts').doc(account.id.value).set(doc);
  }

  private mapToFirestoreDoc(account: Account): any {
    return {
      id: account.id.value,
      email: account.email.value,
      status: account.status,
      createdAt: account.createdAt
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

// ❌ INCORRECT - Business logic in adapter
export class FirestoreAccountRepository {
  async save(account: Account): Promise<void> {
    if (account.email.value.endsWith('@competitor.com')) { // NO!
      throw new Error('Competitor emails not allowed');
    }
    await this.firestore.collection('accounts').add({...});
  }
}
```

## Summary Checklist

- [ ] Implements port interface from core-engine
- [ ] No business logic in adapters
- [ ] Maps between infrastructure and domain types
- [ ] Returns domain objects, not SDK types
- [ ] Handles technical errors (network, DB, etc.)
- [ ] Integration tests with real/fake SDKs

---

**Adapters bridge infrastructure with domain—pure transformation, zero business logic.**
