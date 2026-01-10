<!-- markdownlint-disable-file -->

# Task Details: Event Sourcing & CQRS Implementation

## Research Reference

**Source Research**: #file:../research/20260110-event-sourcing-cqrs-implementation-research.md

## Phase 1: Core Infrastructure

### Task 1.1: Create DomainEvent to EventMetadata Bridge

Create adapter to convert account-domain DomainEvent to core-engine EventMetadata, enabling integration between the two event systems.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/core-engine/src/mappers/domain-event-adapter.ts` - Main adapter class
  - `/home/runner/work/ng-dragon/ng-dragon/packages/core-engine/src/mappers/index.ts` - Export barrel

- **Implementation**:
  ```typescript
  export class DomainEventAdapter {
    static toEventMetadata(
      domainEvent: DomainEvent<any>,
      containerScope: ContainerScope
    ): EventMetadata {
      const causality = new CausalityChain(domainEvent.metadata.causedBy ?? []);
      return new EventMetadata(
        domainEvent.metadata.traceId ?? uuidv4(),
        domainEvent.metadata.traceId ?? uuidv4(),
        domainEvent.metadata.actorId,
        containerScope,
        causality,
        new Date(domainEvent.metadata.occurredAt),
        []
      );
    }
  }
  ```

- **Success**:
  - Adapter converts DomainEvent to EventMetadata without data loss
  - causedBy[] array correctly converted to CausalityChain
  - TypeScript strict mode passes
  - Unit tests validate conversion

- **Dependencies**: None

### Task 1.2: Implement Firebase Event Store

Implement IEventStore interface using Firebase Firestore with optimistic concurrency control via transactions.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/platform-adapters/src/persistence/firebase-event-store.ts` - FirebaseEventStore class
  - `/home/runner/work/ng-dragon/ng-dragon/packages/platform-adapters/src/persistence/index.ts` - Export barrel

- **Firestore Schema**:
  ```
  /event-streams/{aggregateType}/{aggregateId}/
    _metadata: { currentVersion: number, lastEventAt: Timestamp }
    events/{eventId}: {
      eventId, eventType, aggregateId, aggregateType, version, payload,
      metadata: { eventId, traceId, actorAccountId, containerScope, causality, occurredAt, affects },
      storedAt: Timestamp
    }
  ```

- **Implementation**:
  ```typescript
  export class FirebaseEventStore implements IEventStore {
    async appendEvents<TPayload>(
      aggregateId: string,
      aggregateType: string,
      events: Array<{eventType, payload, metadata}>,
      options?: AppendEventsOptions
    ): Promise<void> {
      await this.firestore.runTransaction(async (transaction) => {
        // Check expected version for optimistic concurrency
        // Append events with incremental version numbers
        // Update _metadata document
      });
    }
    
    async getEventStream(aggregateId, aggregateType, fromVersion?): Promise<EventStream> {
      // Query events subcollection ordered by version
    }
    
    async getEventsByType(eventType, fromTimestamp?): Promise<StoredEvent[]> {
      // Collection group query across all aggregates
    }
    
    async getEventsInScope(scopeId, scopeType, fromTimestamp?): Promise<StoredEvent[]> {
      // Query by metadata.containerScope
    }
  }
  ```

- **Success**:
  - Events persisted in Firestore with correct schema
  - Optimistic concurrency prevents version conflicts
  - All IEventStore methods implemented
  - Integration test validates append and retrieval

- **Research References**:
  - Firebase Firestore transactions documentation
  - #file:../research/20260110-event-sourcing-cqrs-implementation-research.md (Gap 2)

- **Dependencies**: Task 1.1 (DomainEventAdapter for metadata serialization)

### Task 1.3: Create Event Projection Infrastructure

Create infrastructure for registering and dispatching events to projectors.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/core-engine/src/ports/event-bus.interface.ts` - IEventBus interface
  - `/home/runner/work/ng-dragon/ng-dragon/packages/core-engine/src/use-cases/event-dispatcher.ts` - Event dispatcher implementation

- **Implementation**:
  ```typescript
  export interface IEventBus {
    publish<TEvent>(event: TEvent): Promise<void>;
    subscribe<TEvent>(eventType: string, handler: IEventProjector<TEvent>): void;
  }
  
  export class EventDispatcher implements IEventBus {
    private handlers = new Map<string, IEventProjector<any>[]>();
    
    subscribe<TEvent>(eventType: string, handler: IEventProjector<TEvent>): void {
      const existing = this.handlers.get(eventType) ?? [];
      this.handlers.set(eventType, [...existing, handler]);
    }
    
    async publish<TEvent>(event: TEvent & { eventType: string }): Promise<void> {
      const handlers = this.handlers.get(event.eventType) ?? [];
      await Promise.all(handlers.map(h => h.project(event)));
    }
  }
  ```

- **Success**:
  - Event bus registers multiple projectors per event type
  - publish() dispatches to all registered handlers
  - Async projection errors isolated per projector

- **Dependencies**: None

## Phase 2: Module Aggregates (Domain Logic)

### Task 2.1: Implement Identity Aggregate

Create event-sourced aggregate for workspace member management.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/identity/aggregates/identity.aggregate.ts` - IdentityAggregate class
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/identity/aggregates/index.ts` - Export barrel

- **Implementation**:
  ```typescript
  export interface IdentitySnapshot {
    workspaceId: string;
    members: Map<string, Member>;
  }
  
  export class IdentityAggregate {
    constructor(private snapshot: IdentitySnapshot) {}
    
    static create(workspaceId: string, context: EventContext): {
      aggregate: IdentityAggregate;
      event: DomainEvent<IdentitySnapshot>;
    } {
      const snapshot: IdentitySnapshot = { workspaceId, members: new Map() };
      const event = {
        eventType: 'IdentityModuleInitialized',
        aggregateId: workspaceId,
        workspaceId,
        moduleKey: 'identity',
        payload: snapshot,
        metadata: toEventMetadata(context)
      };
      return { aggregate: new IdentityAggregate(snapshot), event };
    }
    
    addMember(member: Member, context: EventContext): {
      aggregate: IdentityAggregate;
      event: DomainEvent<MemberAddedPayload>;
    } {
      if (this.snapshot.members.has(member.memberId)) {
        throw new Error(`Member ${member.memberId} already exists`);
      }
      const nextMembers = new Map(this.snapshot.members);
      nextMembers.set(member.memberId, member);
      const event = { eventType: 'MemberAdded', ... };
      return {
        aggregate: new IdentityAggregate({ ...this.snapshot, members: nextMembers }),
        event
      };
    }
    
    removeMember(memberId: string, context: EventContext) { ... }
    
    get state(): IdentitySnapshot { return this.snapshot; }
  }
  ```

- **Success**:
  - Aggregate follows WorkspaceAggregate pattern
  - Commands: create, addMember, removeMember
  - Events: IdentityModuleInitialized, MemberAdded, MemberRemoved
  - Immutable state updates
  - Domain invariants enforced (no duplicate members)

- **Research References**:
  - #file:../research/20260110-event-sourcing-cqrs-implementation-research.md (Gap 3)
  - /home/runner/work/ng-dragon/ng-dragon/packages/account-domain/src/aggregates/workspace.aggregate.ts (pattern reference)

- **Dependencies**: None

### Task 2.2: Implement Access Control Aggregate

Create event-sourced aggregate for role and permission management.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/access-control/aggregates/access-control.aggregate.ts`
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/access-control/aggregates/index.ts`

- **Implementation**:
  ```typescript
  export interface AccessControlSnapshot {
    workspaceId: string;
    roles: Map<string, Role>;
    assignments: Map<string, string[]>; // accountId -> roleIds
  }
  
  export class AccessControlAggregate {
    assignRole(accountId: string, roleId: string, context: EventContext) { ... }
    revokeRole(accountId: string, roleId: string, context: EventContext) { ... }
    grantPermission(roleId: string, permission: Permission, context: EventContext) { ... }
  }
  ```

- **Success**:
  - Commands: assignRole, revokeRole, grantPermission
  - Events: RoleAssigned, RoleRevoked, PermissionGranted
  - Domain invariants: role exists before assignment

- **Dependencies**: None

### Task 2.3: Implement Settings Aggregate

Create event-sourced aggregate for workspace configuration.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/settings/aggregates/settings.aggregate.ts`
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/settings/aggregates/index.ts`

- **Implementation**:
  ```typescript
  export interface SettingsSnapshot {
    workspaceId: string;
    profile: WorkspaceProfile;
    featureFlags: Map<string, FeatureFlag>;
  }
  
  export class SettingsAggregate {
    updateSettings(settings: Partial<WorkspaceSettings>, context: EventContext) { ... }
    toggleFeature(featureKey: string, enabled: boolean, context: EventContext) { ... }
  }
  ```

- **Success**:
  - Commands: updateSettings, toggleFeature
  - Events: SettingsUpdated, FeatureToggled

- **Dependencies**: None

### Task 2.4: Implement Audit Aggregate

Create append-only aggregate for activity logging.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/audit/aggregates/audit.aggregate.ts`
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/audit/aggregates/index.ts`

- **Implementation**:
  ```typescript
  export interface AuditSnapshot {
    workspaceId: string;
    activities: ActivityLog[];
  }
  
  export class AuditAggregate {
    recordActivity(activity: ActivityLog, context: EventContext) {
      // Append-only, no validation needed
      const nextActivities = [...this.snapshot.activities, activity];
      const event = { eventType: 'ActivityRecorded', ... };
      return { aggregate: new AuditAggregate({ ...this.snapshot, activities: nextActivities }), event };
    }
  }
  ```

- **Success**:
  - Commands: recordActivity
  - Events: ActivityRecorded
  - Append-only pattern

- **Dependencies**: None

## Phase 3: Application Layer (Use Cases)

### Task 3.1: Create Identity Application Service

Implement command handlers for identity module using event store and projectors.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/identity/application/identity-application.service.ts`
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/identity/application/index.ts`

- **Implementation**:
  ```typescript
  export class IdentityApplicationService {
    constructor(
      private eventStore: IEventStore,
      private projector: MemberListProjector,
      private eventBus: IEventBus
    ) {}
    
    async addMember(command: AddMemberCommand): Promise<void> {
      // Load aggregate from event stream
      const stream = await this.eventStore.getEventStream(
        command.workspaceId,
        'IdentityAggregate'
      );
      let aggregate = this.replayAggregate(stream.events);
      
      // Execute command
      const { aggregate: next, event } = aggregate.addMember(
        new Member(command.memberId, command.accountId, command.role),
        { actorId: command.actorId, traceId: command.traceId, causedBy: command.causedBy }
      );
      
      // Convert to EventMetadata
      const scope = new ContainerScope(command.workspaceId, 'workspace');
      const metadata = DomainEventAdapter.toEventMetadata(event, scope);
      
      // Append to event store
      await this.eventStore.appendEvents(
        command.workspaceId,
        'IdentityAggregate',
        [{ eventType: event.eventType, payload: event.payload, metadata }],
        { expectedVersion: stream.currentVersion }
      );
      
      // Publish for projection
      await this.eventBus.publish(event);
    }
    
    private replayAggregate(events: readonly StoredEvent[]): IdentityAggregate {
      // Rebuild aggregate from events
      let aggregate = IdentityAggregate.create(workspaceId, initialContext).aggregate;
      for (const storedEvent of events) {
        // Apply each event to rebuild state
        if (storedEvent.eventType === 'MemberAdded') {
          const payload = storedEvent.payload as MemberAddedPayload;
          aggregate = aggregate.addMember(
            new Member(payload.memberId, payload.accountId, payload.role),
            { actorId: storedEvent.metadata.actorAccountId, occurredAt: storedEvent.metadata.occurredAt.toISOString() }
          ).aggregate;
        }
      }
      return aggregate;
    }
  }
  ```

- **Success**:
  - Command: AddMemberCommand handled
  - Aggregate replayed from event stream
  - Event appended with causality tracking
  - Projector triggered via event bus

- **Research References**:
  - #file:../research/20260110-event-sourcing-cqrs-implementation-research.md (Gap 5)

- **Dependencies**: Phase 1 (event store, adapter), Phase 2.1 (IdentityAggregate), Phase 4.1 (MemberListProjector)

### Task 3.2: Create Access Control Application Service

Similar pattern for access control commands.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/access-control/application/access-control-application.service.ts`

- **Implementation**: AssignRoleCommand, RevokeRoleCommand handlers

- **Success**: Commands executed with event sourcing flow

- **Dependencies**: Phase 2.2, Phase 4.2

### Task 3.3: Create Settings Application Service

Similar pattern for settings commands.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/settings/application/settings-application.service.ts`

- **Implementation**: UpdateSettingsCommand, ToggleFeatureCommand handlers

- **Success**: Commands executed with event sourcing flow

- **Dependencies**: Phase 2.3, Phase 4.3

### Task 3.4: Create Audit Application Service

Similar pattern for audit commands.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/audit/application/audit-application.service.ts`

- **Implementation**: RecordActivityCommand handler

- **Success**: Activity logging automated via event handlers

- **Dependencies**: Phase 2.4, Phase 4.4

## Phase 4: Event Projections (Read Models)

### Task 4.1: Implement Member List Projector

Project MemberAdded/MemberRemoved events to Firestore read model.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/identity/projectors/member-list.projector.ts`
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/identity/projectors/index.ts`

- **Implementation**:
  ```typescript
  export class MemberListProjector implements IEventProjector<MemberAddedEvent | MemberRemovedEvent> {
    constructor(private firestore: Firestore) {}
    
    async project(event: MemberAddedEvent | MemberRemovedEvent): Promise<void> {
      const workspaceId = event.workspaceId;
      
      if (event.eventType === 'MemberAdded') {
        await this.firestore
          .collection(`workspaces/${workspaceId}/members`)
          .doc(event.payload.memberId)
          .set({
            memberId: event.payload.memberId,
            accountId: event.payload.accountId,
            role: event.payload.role,
            status: 'active',
            joinedAt: event.payload.joinedAt,
            addedBy: event.metadata.actorId
          });
      } else if (event.eventType === 'MemberRemoved') {
        await this.firestore
          .collection(`workspaces/${workspaceId}/members`)
          .doc(event.payload.memberId)
          .update({
            status: 'removed',
            removedAt: event.metadata.occurredAt,
            removedBy: event.metadata.actorId
          });
      }
    }
  }
  ```

- **Read Model Schema**:
  ```
  /workspaces/{workspaceId}/members/{memberId}:
    { memberId, accountId, role, status, joinedAt, addedBy, removedAt?, removedBy? }
  ```

- **Success**:
  - Listens to MemberAdded, MemberRemoved events
  - Projects to workspaces/{id}/members collection
  - Idempotent projection (eventId deduplication)

- **Research References**:
  - #file:../research/20260110-event-sourcing-cqrs-implementation-research.md (Gap 4)

- **Dependencies**: Phase 1.3 (event bus registration)

### Task 4.2: Implement Role Assignment Projector

Project role assignment events to read model.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/access-control/projectors/role-assignment.projector.ts`

- **Read Model Schema**:
  ```
  /workspaces/{workspaceId}/role-assignments/{accountId}:
    { accountId, roleIds: string[], grantedAt, grantedBy }
  ```

- **Success**: RoleAssigned/RoleRevoked events projected

- **Dependencies**: Phase 1.3

### Task 4.3: Implement Workspace Profile Projector

Project settings events to profile read model.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/settings/projectors/workspace-profile.projector.ts`

- **Read Model Schema**:
  ```
  /workspaces/{workspaceId}/profile/_current:
    { name, description, featureFlags: Map<string, boolean>, updatedAt }
  ```

- **Success**: SettingsUpdated/FeatureToggled events projected

- **Dependencies**: Phase 1.3

### Task 4.4: Implement Activity Log Projector

Project all events to activity log for auditing.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/audit/projectors/activity-log.projector.ts`

- **Implementation**:
  ```typescript
  export class ActivityLogProjector implements IEventProjector<any> {
    async project(event: any): Promise<void> {
      await this.firestore
        .collection(`workspaces/${event.workspaceId}/activity-log`)
        .doc(event.metadata.eventId)
        .set({
          eventId: event.metadata.eventId,
          eventType: event.eventType,
          actorId: event.metadata.actorId,
          occurredAt: event.metadata.occurredAt,
          causality: event.metadata.causedBy ?? [],
          summary: this.generateSummary(event)
        });
    }
    
    private generateSummary(event: any): string {
      // Generate human-readable summary
      return `${event.eventType} by ${event.metadata.actorId}`;
    }
  }
  ```

- **Read Model Schema**:
  ```
  /workspaces/{workspaceId}/activity-log/{eventId}:
    { eventId, eventType, actorId, occurredAt, causality: string[], summary }
  ```

- **Success**: All events logged with causality chain

- **Dependencies**: Phase 1.3

## Phase 5: UI Integration (Presentation Layer)

### Task 5.1: Create Project Detail Component

Display workspace with enabled modules and activity feed.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/ui-angular/src/app/features/projects/project-detail.component.ts`
  - `/home/runner/work/ng-dragon/ng-dragon/packages/ui-angular/src/app/features/projects/project-detail.component.html`
  - `/home/runner/work/ng-dragon/ng-dragon/packages/ui-angular/src/app/features/projects/project-detail.component.scss`

- **Implementation**:
  ```typescript
  @Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [CommonModule, MemberListComponent, ActivityLogComponent],
    templateUrl: './project-detail.component.html'
  })
  export class ProjectDetailComponent {
    projectId = input.required<string>();
    
    private firestore = inject(Firestore);
    
    project = signal<WorkspaceProfile | null>(null);
    modules = signal<ModuleStatus[]>([]);
    
    enabledModules = computed(() => this.modules().filter(m => m.enabled));
    
    constructor() {
      effect(() => {
        const id = this.projectId();
        if (id) this.loadProject(id);
      });
    }
    
    private async loadProject(id: string) {
      const profileDoc = await getDoc(doc(this.firestore, `workspaces/${id}/profile/_current`));
      this.project.set(profileDoc.data() as WorkspaceProfile);
      
      const modulesSnap = await getDocs(collection(this.firestore, `workspaces/${id}/modules`));
      this.modules.set(modulesSnap.docs.map(d => d.data() as ModuleStatus));
    }
  }
  ```

- **Template**:
  ```html
  <div class="project-container">
    <header class="project-header">
      <h1>{{ project()?.name }}</h1>
      <p>{{ project()?.description }}</p>
    </header>
    
    <section class="modules-section">
      <h2>Modules</h2>
      <div class="modules-grid">
        @for (module of enabledModules(); track module.moduleKey) {
          <div class="module-card">
            <h3>{{ module.moduleKey }}</h3>
            @if (module.moduleKey === 'identity') {
              <app-member-list [workspaceId]="projectId()" />
            }
          </div>
        }
      </div>
    </section>
    
    <section class="activity-section">
      <h2>Activity</h2>
      <app-activity-log [workspaceId]="projectId()" />
    </section>
  </div>
  ```

- **Success**:
  - Displays workspace profile
  - Shows enabled modules in grid
  - Renders module-specific components
  - Activity feed at bottom

- **Research References**:
  - #file:../../.github/instructions/angular.instructions.md (Signals, standalone components)
  - #file:../research/20260110-event-sourcing-cqrs-implementation-research.md (Gap 6)

- **Dependencies**: Phase 4 (read models exist), Phase 5.2, Phase 5.3

### Task 5.2: Create Member List Component

Display members from identity module read model.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/ui-angular/src/app/features/projects/components/member-list.component.ts`

- **Implementation**:
  ```typescript
  @Component({
    selector: 'app-member-list',
    standalone: true,
    template: `
      <div class="member-list">
        @for (member of members(); track member.memberId) {
          <div class="member-item">
            <span>{{ member.accountId }}</span>
            <span>{{ member.role }}</span>
            <span>{{ member.status }}</span>
          </div>
        }
      </div>
    `
  })
  export class MemberListComponent {
    workspaceId = input.required<string>();
    private firestore = inject(Firestore);
    
    members = signal<Member[]>([]);
    
    constructor() {
      effect(() => {
        const id = this.workspaceId();
        if (id) this.loadMembers(id);
      });
    }
    
    private async loadMembers(workspaceId: string) {
      const membersSnap = await getDocs(
        collection(this.firestore, `workspaces/${workspaceId}/members`)
      );
      this.members.set(membersSnap.docs.map(d => d.data() as Member));
    }
  }
  ```

- **Success**:
  - Queries workspaces/{id}/members read model
  - Uses Angular Signals for reactive updates
  - Displays member list

- **Dependencies**: Phase 4.1 (MemberListProjector)

### Task 5.3: Create Activity Log Component with Causality Visualization

Display activity feed with causality chain visualization.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/ui-angular/src/app/features/projects/components/activity-log.component.ts`

- **Implementation**:
  ```typescript
  @Component({
    selector: 'app-activity-log',
    standalone: true,
    template: `
      <div class="activity-log">
        @for (activity of activities(); track activity.eventId) {
          <div class="activity-item">
            <p><strong>{{ activity.eventType }}</strong></p>
            <p>Actor: {{ activity.actorId }}</p>
            <p>Time: {{ activity.occurredAt | date:'short' }}</p>
            @if (activity.causality.length > 0) {
              <details>
                <summary>Causality Chain ({{ activity.causality.length }})</summary>
                <ul class="causality-chain">
                  @for (cause of activity.causality; track cause) {
                    <li>{{ cause }}</li>
                  }
                </ul>
              </details>
            }
            <p>{{ activity.summary }}</p>
          </div>
        }
      </div>
    `
  })
  export class ActivityLogComponent {
    workspaceId = input.required<string>();
    private firestore = inject(Firestore);
    
    activities = signal<ActivityLog[]>([]);
    
    constructor() {
      effect(() => {
        const id = this.workspaceId();
        if (id) this.loadActivities(id);
      });
    }
    
    private async loadActivities(workspaceId: string) {
      const activitiesSnap = await getDocs(
        query(
          collection(this.firestore, `workspaces/${workspaceId}/activity-log`),
          orderBy('occurredAt', 'desc'),
          limit(50)
        )
      );
      this.activities.set(activitiesSnap.docs.map(d => d.data() as ActivityLog));
    }
  }
  ```

- **Success**:
  - Displays activity log ordered by time
  - Shows causality chain in expandable details
  - Visualizes event relationships

- **Research References**:
  - #file:../research/20260110-event-sourcing-cqrs-implementation-research.md (Gap 7)

- **Dependencies**: Phase 4.4 (ActivityLogProjector)

## Phase 6: End-to-End Integration & Testing

### Task 6.1: Create Integration Tests for Event Sourcing Flow

Test event store, projectors, and application services.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/src/modules/identity/__tests__/identity-integration.spec.ts`

- **Test Cases**:
  ```typescript
  describe('Identity Module Integration', () => {
    it('should persist MemberAdded event to event store', async () => {
      const service = new IdentityApplicationService(eventStore, projector, eventBus);
      await service.addMember({
        workspaceId: 'ws_1',
        memberId: 'mem_1',
        accountId: 'acc_1',
        role: 'member',
        actorId: 'acc_admin',
        traceId: 'trace_1'
      });
      
      const stream = await eventStore.getEventStream('ws_1', 'IdentityAggregate');
      expect(stream.events).toHaveLength(1);
      expect(stream.events[0].eventType).toBe('MemberAdded');
    });
    
    it('should project MemberAdded to read model', async () => {
      // Test projection flow
    });
    
    it('should enforce optimistic concurrency', async () => {
      // Test concurrent writes fail gracefully
    });
  });
  ```

- **Success**:
  - Integration tests pass for all modules
  - Event store persistence validated
  - Projector execution validated
  - Concurrency control tested

- **Dependencies**: All previous phases

### Task 6.2: Implement E2E Causality Tracking Test

Validate full causality chain from workspace creation to member addition.

- **Files**:
  - `/home/runner/work/ng-dragon/ng-dragon/packages/saas-domain/__tests__/e2e-causality.spec.ts`

- **Test Scenario**:
  ```typescript
  describe('End-to-End Causality Tracking', () => {
    it('should track causality: WorkspaceCreated -> ModuleEnabled -> MemberAdded', async () => {
      // Step 1: Create workspace
      const { event: evt1 } = WorkspaceAggregate.create({
        workspaceId: 'ws_1',
        accountId: 'acc_1',
        workspaceType: WorkspaceType.Project
      }, { actorId: 'acc_1', traceId: 'trace_1' });
      
      await eventStore.appendEvents('ws_1', 'WorkspaceAggregate', [evt1Metadata]);
      
      // Step 2: Enable identity module
      const workspace = new WorkspaceAggregate(evt1.payload);
      const { event: evt2 } = workspace.toggleModule('identity', ModuleType.Identity, true, {
        actorId: 'acc_1',
        traceId: 'trace_1',
        causedBy: [evt1Metadata.eventId]
      });
      
      await eventStore.appendEvents('ws_1', 'WorkspaceAggregate', [evt2Metadata]);
      
      // Step 3: Add first member
      await identityService.addMember({
        workspaceId: 'ws_1',
        memberId: 'mem_1',
        accountId: 'acc_2',
        role: 'member',
        actorId: 'acc_1',
        traceId: 'trace_1',
        causedBy: [evt1Metadata.eventId, evt2Metadata.eventId]
      });
      
      // Validate causality chain
      const stream = await eventStore.getEventStream('ws_1', 'IdentityAggregate');
      const memberEvent = stream.events.find(e => e.eventType === 'MemberAdded');
      expect(memberEvent.metadata.causality.getCauses()).toEqual([
        evt1Metadata.eventId,
        evt2Metadata.eventId
      ]);
      
      // Validate activity log shows full chain
      const activityLog = await firestore
        .collection('workspaces/ws_1/activity-log')
        .doc(memberEvent.metadata.eventId)
        .get();
      expect(activityLog.data().causality).toEqual([
        evt1Metadata.eventId,
        evt2Metadata.eventId
      ]);
    });
  });
  ```

- **Success**:
  - Full event chain persisted with causality
  - CausalityChain correctly tracks parent events
  - Activity log displays complete chain
  - E2E test passes

- **Research References**:
  - #file:../../docs/Causality-Belongs-Where(因果歸屬).md (causality flow diagram)
  - #file:../research/20260110-event-sourcing-cqrs-implementation-research.md (Gap 7)

- **Dependencies**: All previous phases

### Task 6.3: Validate AGENTS.md Compliance

Ensure all code respects package boundaries and dependency rules.

- **Validation Checks**:
  ```typescript
  // Automated boundary checks
  describe('AGENTS.md Compliance', () => {
    it('should not import Firebase SDK in domain packages', () => {
      const domainFiles = glob.sync('packages/{account-domain,saas-domain,core-engine}/src/**/*.ts');
      domainFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        expect(content).not.toContain('firebase/firestore');
        expect(content).not.toContain('@angular/fire');
      });
    });
    
    it('should follow dependency direction: account → core → platform', () => {
      // Check import statements follow allowed dependencies
    });
    
    it('should not have circular dependencies', () => {
      // Use madge or similar to detect cycles
    });
  });
  ```

- **Success**:
  - No Firebase SDK imports in domain/core packages
  - Dependency direction respected
  - No circular dependencies
  - All modules in correct src/ subdirectories

- **Research References**:
  - #file:../../packages/AGENTS.md (Lines 23-43)

- **Dependencies**: None (validation only)

## Success Criteria Summary

- [ ] All TypeScript files pass strict mode
- [ ] Event store persists events with optimistic concurrency
- [ ] Causality chain tracked end-to-end
- [ ] All 4 modules have aggregates, projectors, application services
- [ ] UI displays workspace with modules and activity log
- [ ] Integration and E2E tests pass
- [ ] AGENTS.md package boundaries validated
