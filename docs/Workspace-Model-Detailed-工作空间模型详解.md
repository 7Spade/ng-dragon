# Workspace Model

> **Workspace is the logical container where business happens, not the actor doing it.**
> **承載業務模組的邏輯容器，請叫：Workspace**

**Workspace = 業務發生的空間，不是做事的人**

---

## What is a Workspace?

### Definition

**Workspace** is a **邏輯容器** (logical container) that:
- Defines **scope boundaries** for business operations
- Contains business modules (Task, Payment, Issue, etc.)
- Establishes **data isolation** boundaries
- Serves as the context for permissions
- **Does NOT trigger events** or act as a business entity

### Workspace is NOT

- ❌ An actor (doesn't have `actorAccountId`)
- ❌ A user or organization
- ❌ A business entity with lifecycle
- ❌ Something that makes decisions

### Workspace IS

- ✅ A scope for operations (`workspaceId` in events)
- ✅ A boundary for permissions
- ✅ A container for business modules
- ✅ A multi-tenant isolation unit

---

## The Three-Layer Universe (from ✨✨✨✨✨.md)

```
Account     → 誰 (WHO)
Workspace   → 在哪 (WHERE)
Module      → 做什麼 (WHAT)
```

### Event Structure Reflects This

```typescript
interface DomainEvent<T> {
  id: string;
  type: string;
  aggregateId: string;
  actorAccountId: string;   // WHO did this (Account)
  workspaceId: string;      // WHERE it happened (Workspace)
  causedBy: string[];
  timestamp: number;
  data: T;                  // WHAT happened (Module-specific)
}
```

**Clean, replay-friendly, easy to audit. 😌**

---

## Workspace Definition

```typescript
interface Workspace {
  workspaceId: string;
  name: string;
  status: 'active' | 'archived';
  createdAt: number;
  // Notice: NO ownerAccountId field!
  // Ownership is a relationship, not a property
}
```

### Workspace Responsibilities

Workspace **only does three things**:
1. **承載業務模組** - Contains business modules (Task, Payment, Issue)
2. **定義權限 Scope** - Defines permission boundaries
3. **定義資料隔離邊界** - Establishes data isolation

**不多，也不少 😼**

---

## Workspace vs Organization

### Common Confusion

Many developers confuse:
- **Organization Account**: A type of Account (actor)
- **Workspace**: A logical container (scope)

### Key Differences

|                    | Organization Account | Workspace           |
|--------------------|----------------------|---------------------|
| Is it an Actor?    | ✅ Yes               | ❌ No               |
| Triggers Events?   | ✅ Yes (actorAccountId) | ❌ No            |
| Has Permissions?   | ✅ Yes (via relationships) | ❌ No (defines scope) |
| Can own resources? | ✅ Yes               | ❌ No (contains resources) |
| Login?             | ❌ No (managed by Users) | ❌ No            |
| Purpose            | Legal entity, actor  | Operational space   |

### Correct Relationships

```
Organization Account (actor)
  ↓ owns (via AccountWorkspaceMembership)
Workspace (scope)
  ↓ contains
Task / Payment / Issue (entities)
```

**Organization Account ≠ Workspace**

One Organization can own multiple Workspaces. Multiple Organizations (via Accounts) can co-own a single Workspace.

---

## Workspace and Modules

### Module Containment

Modules (Task, Payment, Issue) **exist within** a Workspace.

```typescript
// Task created in workspace
{
  type: 'TaskCreated',
  aggregateId: 'task-123',
  actorAccountId: 'acc-user-456',
  workspaceId: 'ws-789',        // ← Task belongs to this workspace
  data: {
    title: 'Implement feature X'
  }
}
```

### Module Independence

Each module (Task, Payment, Issue) is:
- **Domain-specific** - Has its own events, aggregates, projections
- **Workspace-scoped** - All entities reference their `workspaceId`
- **Not coupled to Workspace lifecycle** - Modules don't create or manage Workspaces

**From ✨✨✨✨✨✨✨.md:**

> **Workspace 是殼，Module 是外掛，Account 是手，Event 是因果。**
>
> 模組永遠不創建 Workspace

---

## Workspace Membership

### Relationship Model

```typescript
interface AccountWorkspaceMembership {
  accountId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  grantedByAccountId: string;
  grantedAt: number;
}
```

### Roles

- **Owner**: Full control, can delete workspace, manage all members
- **Admin**: Manage members, configure workspace settings
- **Member**: Access and modify workspace content
- **Viewer**: Read-only access

### Permission Queries

```typescript
// Check if account has role in workspace
function hasRole(
  accountId: string,
  workspaceId: string,
  role: string
): boolean {
  const membership = getMembership(accountId, workspaceId);
  return membership?.role === role;
}

// Check if account can access workspace
function canAccessWorkspace(
  accountId: string,
  workspaceId: string
): boolean {
  const membership = getMembership(accountId, workspaceId);
  return membership !== null;
}
```

---

## Workspace Lifecycle

### Workspace Events

```typescript
// Workspace creation
WorkspaceCreated {
  workspaceId: string;
  name: string;
  createdByAccountId: string;  // Account that created it
}

// Membership management
AccountJoinedWorkspace {
  accountId: string;
  workspaceId: string;
  role: string;
  invitedByAccountId: string;
}

AccountLeftWorkspace {
  accountId: string;
  workspaceId: string;
}

AccountRoleChanged {
  accountId: string;
  workspaceId: string;
  oldRole: string;
  newRole: string;
  changedByAccountId: string;
}

// Workspace archival (soft delete)
WorkspaceArchived {
  workspaceId: string;
  archivedByAccountId: string;
  reason: string;
}
```

**Note**: Events have `actorAccountId` (WHO), not Workspace. Workspace is the scope (`workspaceId`).

---

## Data Isolation

### Multi-Tenant Boundaries

Workspace provides **hard boundaries** for data isolation:

```typescript
// Query tasks in a specific workspace
async function getTasksInWorkspace(
  workspaceId: string
): Promise<Task[]> {
  const events = await eventStore.query({
    filters: [
      { field: 'type', operator: 'startsWith', value: 'Task' },
      { field: 'workspaceId', operator: '==', value: workspaceId }
    ]
  });
  return projectTaskList(events);
}
```

### Cross-Workspace Queries

```typescript
// Get all workspaces for an account
async function getWorkspacesForAccount(
  accountId: string
): Promise<Workspace[]> {
  const memberships = await getMemberships(accountId);
  const workspaceIds = memberships.map(m => m.workspaceId);
  return Promise.all(workspaceIds.map(getWorkspace));
}
```

**Key Rule**: Always filter by `workspaceId` when querying domain entities.

---

## Workspace Naming Rationale

### Why "Workspace"?

From ✨✨✨✨✨.md:

**Workspace 是王者選擇** because it:
- ✅ 不是人（不登入）
- ✅ 不是 Actor（不觸發事件）
- ✅ 不是法律主體
- ✅ 可承載多個業務模組
- ✅ 可套用權限範圍（Scope）
- ✅ 可做多租戶隔離
- ✅ 可被 Organization / Account 管理
- ✅ 不限制未來形態

### Why NOT other names?

#### ❌ Tenant

- Too technical
- Locks you into "multi-tenant" framing
- Hard to adapt for single-tenant or on-premise

#### ❌ Organization

- Already used for Organization Account
- Causes confusion (actor vs container)

#### ❌ Project

- Too business-specific
- Not all modules are "projects" (e.g., accounting, settings)

#### ❌ Domain

- Conflicts with DDD's "Domain"
- Technical term, not business term

---

## Advanced: Workspace Hierarchy (Future)

Workspaces can be extended to support hierarchy **without changing the name**:

```typescript
interface Workspace {
  workspaceId: string;
  name: string;
  parentWorkspaceId?: string;  // Optional hierarchy
  type?: 'default' | 'project' | 'team';  // Optional typing
  status: 'active' | 'archived';
}
```

**Benefits**:
- Sub-workspaces for large organizations
- Permission inheritance
- Resource aggregation

**都不用改名字，只加屬性就好 😈**

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Workspace as Actor

```typescript
// BAD: Workspace triggering events
{
  type: 'TaskCreated',
  actorAccountId: 'ws-123',  // ❌ Workspace is NOT an actor
}
```

**Fix**: Actor is always an Account, never a Workspace.

### ❌ Mistake 2: Baking Ownership into Workspace

```typescript
// BAD: Owner as property
interface Workspace {
  ownerAccountId: string;  // ❌ Ownership is a relationship
}
```

**Fix**: Use `AccountWorkspaceMembership` with `role: 'owner'`.

### ❌ Mistake 3: Modules Creating Workspaces

```typescript
// BAD: Task module creates workspace
function createTaskWithWorkspace(task: Task) {
  const workspace = createWorkspace({ name: 'Auto-created' });
  const newTask = { ...task, workspaceId: workspace.id };
  // ...
}
```

**Fix**: Workspaces are created by Platform layer, Modules consume them.

### ❌ Mistake 4: Confusing Workspace with Organization

```typescript
// BAD: Using organization as workspace
const workspace = getOrganizationWorkspace(orgId);
```

**Fix**: Treat Organization and Workspace as separate concepts. Organizations own Workspaces via membership relationships.

---

## Workspace in Firestore Queries

### ✅ Good: Always Filter by Workspace

```typescript
// Correct: Filter by workspaceId
const tasks = await getDocs(
  query(
    collection(db, 'tasks'),
    where('workspaceId', '==', currentWorkspaceId)
  )
);
```

### ❌ Bad: Missing Workspace Filter

```typescript
// WRONG: No workspace filter (data leak!)
const tasks = await getDocs(collection(db, 'tasks'));
```

**Security Risk**: Without workspace filtering, users can access data from other tenants.

---

## Dependency Chain (from ✨✨✨✨✨✨✨✨✨.md)

```
Account ──▶ Workspace ──▶ Module ──▶ Entity
   誰           在哪          做什麼         狀態
```

**每一層只能「往右用」，不能「往左知道」**

- **Account** knows nothing about Workspace or Module
- **Workspace** knows nothing about Account or Module
- **Module** knows Workspace exists (scopes its entities)
- **Entity** knows its Workspace and occasionally references Account (as assignee, etc.)

---

## Example: Task in Workspace Context

```typescript
// Creating a task in a workspace
interface CreateTaskCommand {
  title: string;
  description: string;
  actorAccountId: string;   // WHO is creating
  workspaceId: string;      // WHERE to create
}

// Event produced
{
  type: 'TaskCreated',
  aggregateId: 'task-123',
  actorAccountId: 'acc-user-456',
  workspaceId: 'ws-789',
  causedBy: [],
  timestamp: 1735762800000,
  data: {
    title: 'Implement feature X',
    description: '...',
    createdByAccountId: 'acc-user-456'
  }
}

// Query tasks in workspace
const tasks = await getTasksInWorkspace('ws-789');

// Authorization check
const canView = await canAccessWorkspace('acc-user-456', 'ws-789');
```

---

## See Also

- [Account Model](./05-account-model.md) - Business actors (WHO)
- [Authorization Layers](../03-architecture/05-authorization-layers.md) - Permission enforcement
- [Platform Architecture](../dev/consolidated/17-平台層SaaS架構.md) - Platform layer design

---
